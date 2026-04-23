param(
  [string]$DbHost = 'localhost',
  [int]$DbPort = 5432,
  [string]$DbName = 'forca_total',
  [string]$DbUser = 'postgres',
  [securestring]$DbSecret = (ConvertTo-SecureString 'postgres' -AsPlainText -Force),
  [int]$ApiPort = 8080,
  [int]$FrontendPort = 5173,
  [switch]$SkipBackend,
  [switch]$SkipFrontend
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $false
$DbSecretPlain = [System.Net.NetworkCredential]::new('', $DbSecret).Password

$repoRoot = (Resolve-Path $PSScriptRoot).Path
$logsDir = Join-Path $repoRoot 'logs\local-stack'
$stateFile = Join-Path $env:TEMP 'm1-local-stack-pids.json'

function Info([string]$msg) {
  Write-Host "[INFO] $msg" -ForegroundColor Cyan
}

function Ok([string]$msg) {
  Write-Host "[OK] $msg" -ForegroundColor Green
}

function Warn([string]$msg) {
  Write-Host "[WARN] $msg" -ForegroundColor Yellow
}

function Fail([string]$msg) {
  Write-Host "[ERRO] $msg" -ForegroundColor Red
  exit 1
}

function Resolve-PgBin {
  $base = 'C:\Program Files\PostgreSQL'
  if (-not (Test-Path $base)) {
    return $null
  }

  $candidate = Get-ChildItem $base -Directory -ErrorAction SilentlyContinue |
    Sort-Object Name -Descending |
    Select-Object -First 1

  if (-not $candidate) {
    return $null
  }

  $bin = Join-Path $candidate.FullName 'bin'
  if (Test-Path (Join-Path $bin 'psql.exe')) {
    return $bin
  }

  return $null
}

function Resolve-MavenCommand {
  $localMavenCandidates = @(
    (Join-Path $repoRoot '.tools\apache-maven\bin\mvn.cmd'),
    (Join-Path $repoRoot 'tools\apache-maven-3.9.9\bin\mvn.cmd')
  )

  foreach ($localMvn in $localMavenCandidates) {
    if (Test-Path $localMvn) {
      return $localMvn
    }
  }

  $mvnCmd = Get-Command mvn.cmd -ErrorAction SilentlyContinue
  if ($mvnCmd) {
    return $mvnCmd.Source
  }

  $mvn = Get-Command mvn -ErrorAction SilentlyContinue
  if ($mvn) {
    return $mvn.Source
  }

  return $null
}

function Resolve-Java21Home {
  $adoptiumBase = 'C:\Program Files\Eclipse Adoptium'
  if (Test-Path $adoptiumBase) {
    $jdk21 = Get-ChildItem $adoptiumBase -Directory -ErrorAction SilentlyContinue |
      Where-Object { $_.Name -like 'jdk-21*' } |
      Sort-Object Name -Descending |
      Select-Object -First 1
    if ($jdk21) {
      return $jdk21.FullName
    }
  }

  $javaHomeEnv = [Environment]::GetEnvironmentVariable('JAVA_HOME', 'User')
  if ($javaHomeEnv -and (Test-Path (Join-Path $javaHomeEnv 'bin\java.exe'))) {
    $versionLine = & "$javaHomeEnv\bin\java.exe" -version 2>&1 | Select-String 'version' | Select-Object -First 1
    if ($versionLine -and $versionLine.Line -match '"21\.') {
      return $javaHomeEnv
    }
  }

  return $null
}

function Install-FrontendDeps {
  $frontendDir = Join-Path $repoRoot 'frontend\prototipo-react-fase4'
  $nodeModules = Join-Path $frontendDir 'node_modules'
  if (Test-Path $nodeModules) {
    return
  }

  Info 'node_modules nao encontrado. Executando npm ci...'
  Push-Location $frontendDir
  try {
    & cmd.exe /c "npm ci"
    if ($LASTEXITCODE -ne 0) {
      Fail 'Falha ao instalar dependencias do frontend (npm ci).'
    }
  } finally {
    Pop-Location
  }
}

function Wait-Http([string]$url, [int]$timeoutSeconds) {
  $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
  while ($stopwatch.Elapsed.TotalSeconds -lt $timeoutSeconds) {
    try {
      $response = Invoke-WebRequest -UseBasicParsing -Uri $url -TimeoutSec 2
      if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) {
        return $true
      }
    } catch {
      Start-Sleep -Seconds 2
    }
  }
  return $false
}

function Stop-ProcessOnPort([int]$port, [string]$label) {
  $entries = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
  if (-not $entries) {
    return
  }

  $pids = $entries | Select-Object -ExpandProperty OwningProcess -Unique
  foreach ($ownerPid in $pids) {
    if ($ownerPid -and $ownerPid -gt 0 -and $ownerPid -ne $PID) {
      try {
        $proc = Get-Process -Id $ownerPid -ErrorAction Stop
        Warn "Encerrando processo existente na porta $port ($label): $($proc.ProcessName) PID=$ownerPid"
        Stop-Process -Id $ownerPid -Force -ErrorAction Stop
      } catch {
        Warn "Nao foi possivel encerrar PID $ownerPid na porta $port."
      }
    }
  }
}

if (-not (Test-Path $logsDir)) {
  New-Item -ItemType Directory -Path $logsDir -Force | Out-Null
}

# Evita conectar em instancias antigas que podem estar com codigo/config desatualizados.
Stop-ProcessOnPort -port $ApiPort -label 'backend'
Stop-ProcessOnPort -port $FrontendPort -label 'frontend'

Info 'Validando prerequisitos da stack local...'

$mvnCmdPath = Resolve-MavenCommand
if (-not $mvnCmdPath -and -not $SkipBackend) {
  Fail 'Maven nao encontrado. Instale Maven ou mantenha .tools/apache-maven configurado.'
}

$java21Home = Resolve-Java21Home
if (-not $java21Home -and -not $SkipBackend) {
  Fail 'Java 21 nao encontrado. Instale/Configure Java 21 antes de subir o backend.'
}

$pgBin = Resolve-PgBin
if (-not $pgBin) {
  Fail 'PostgreSQL nao encontrado em C:\Program Files\PostgreSQL.'
}

$service = Get-Service | Where-Object { $_.Name -like 'postgresql*' } | Select-Object -First 1
if (-not $service) {
  Fail 'Servico do PostgreSQL nao encontrado.'
}

if ($service.Status -ne 'Running') {
  Info "Iniciando servico $($service.Name)..."
  Start-Service -Name $service.Name
}

Ok "PostgreSQL ativo: $($service.Name)"

$env:PGPASSWORD = $DbSecretPlain
$psql = Join-Path $pgBin 'psql.exe'
$createdb = Join-Path $pgBin 'createdb.exe'

$exists = & $psql -h $DbHost -p $DbPort -U $DbUser -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$DbName'"
if ($LASTEXITCODE -ne 0) {
  Fail "Falha ao conectar no PostgreSQL em ${DbHost}:$DbPort com usuario $DbUser."
}

if ($exists.Trim() -ne '1') {
  Info "Criando banco $DbName..."
  & $createdb -h $DbHost -p $DbPort -U $DbUser $DbName
  if ($LASTEXITCODE -ne 0) {
    Fail "Falha ao criar banco $DbName."
  }
  Ok "Banco $DbName criado."
} else {
  Ok "Banco $DbName ja existe."
}

$started = [ordered]@{}

if (-not $SkipBackend) {
  $backendOut = Join-Path $logsDir 'backend.out.log'
  $backendErr = Join-Path $logsDir 'backend.err.log'
  Info 'Subindo backend Spring Boot...'

  $backendCmd = @(
    "set `"JAVA_HOME=$java21Home`"",
    "set `"PATH=%JAVA_HOME%\\bin;%PATH%`"",
    "set `"DB_URL=jdbc:postgresql://${DbHost}:$DbPort/$DbName`"",
    "set `"DB_USERNAME=$DbUser`"",
    "set `"DB_PASSWORD=$DbSecretPlain`"",
    "set `"PORT=$ApiPort`"",
    "set `"SPRING_PROFILES_ACTIVE=default`"",
    "`"$mvnCmdPath`" -f backend/forca-total-api/pom.xml spring-boot:run"
  ) -join ' && '

  $backendProc = Start-Process -FilePath 'cmd.exe' -ArgumentList "/c $backendCmd" -WorkingDirectory $repoRoot -RedirectStandardOutput $backendOut -RedirectStandardError $backendErr -PassThru
  $started.backendPid = $backendProc.Id

  $healthUrl = "http://127.0.0.1:$ApiPort/actuator/health"
  if (-not (Wait-Http -url $healthUrl -timeoutSeconds 120)) {
    Fail "Backend nao respondeu em $healthUrl. Veja logs em $backendOut e $backendErr"
  }

  Ok "Backend ativo em http://127.0.0.1:$ApiPort"
}

if (-not $SkipFrontend) {
  Install-FrontendDeps

  $frontendDir = Join-Path $repoRoot 'frontend\prototipo-react-fase4'
  $frontendOut = Join-Path $logsDir 'frontend.out.log'
  $frontendErr = Join-Path $logsDir 'frontend.err.log'

  Info 'Subindo frontend Vite...'
  $frontendCmd = @(
    "set VITE_API_BASE_URL=/api",
    "set VITE_API_ROUTE_PROFILE=canonical",
    "npm run dev -- --host 127.0.0.1 --port $FrontendPort"
  ) -join ' && '

  $frontendProc = Start-Process -FilePath 'cmd.exe' -ArgumentList "/c $frontendCmd" -WorkingDirectory $frontendDir -RedirectStandardOutput $frontendOut -RedirectStandardError $frontendErr -PassThru
  $started.frontendPid = $frontendProc.Id

  $frontendUrl = "http://127.0.0.1:$FrontendPort"
  if (-not (Wait-Http -url $frontendUrl -timeoutSeconds 90)) {
    Warn "Frontend ainda nao respondeu em $frontendUrl. Verifique logs em $frontendOut e $frontendErr"
  } else {
    Ok "Frontend ativo em $frontendUrl"
  }
}

$state = [ordered]@{
  startedAt = (Get-Date).ToString('s')
  repoRoot = $repoRoot
  apiUrl = "http://127.0.0.1:$ApiPort"
  frontendUrl = "http://127.0.0.1:$FrontendPort"
  backendPid = $null
  frontendPid = $null
  logsDir = $logsDir
}

if ($started.Contains('backendPid')) {
  $state.backendPid = $started.backendPid
}
if ($started.Contains('frontendPid')) {
  $state.frontendPid = $started.frontendPid
}

$state | ConvertTo-Json | Set-Content -Path $stateFile -Encoding UTF8

Write-Host ''
Ok 'Stack local iniciada.'
Write-Host "- API: $($state.apiUrl)"
Write-Host "- Frontend: $($state.frontendUrl)"
Write-Host "- Logs: $logsDir"
Write-Host "- Estado/PIDs: $stateFile"
Write-Host ''
Write-Host 'Para parar manualmente:'
if ($started.Contains('backendPid') -and $started.backendPid) {
  Write-Host "  Stop-Process -Id $($started.backendPid)"
}
if ($started.Contains('frontendPid') -and $started.frontendPid) {
  Write-Host "  Stop-Process -Id $($started.frontendPid)"
}