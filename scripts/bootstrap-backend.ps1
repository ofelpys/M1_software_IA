param(
  [switch]$SkipTests
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $false

$requiredJavaMajor = 21
$requiredMavenMin = [Version]'3.9.0'
$pomPath = 'backend/forca-total-api/pom.xml'

function Fail([string]$message) {
  Write-Host "[ERRO] $message" -ForegroundColor Red
  exit 1
}

function Get-JavaMajor {
  $javaCmd = Get-Command java -ErrorAction SilentlyContinue
  if (-not $javaCmd) {
    Fail 'Java nao encontrado no PATH. Instale Java 21 LTS e tente novamente.'
  }

  $javaVersionOutput = & cmd.exe /c "java -version 2>&1"
  $line = ($javaVersionOutput | Select-String -Pattern 'version').Line
  if (-not $line) {
    Fail 'Nao foi possivel identificar a versao do Java.'
  }

  $match = [regex]::Match($line, '"(?<ver>[^\"]+)"')
  if (-not $match.Success) {
    Fail "Formato inesperado da versao do Java: $line"
  }

  $versionText = $match.Groups['ver'].Value
  if ($versionText.StartsWith('1.')) {
    return [int]($versionText.Split('.')[1])
  }

  return [int]($versionText.Split('.')[0])
}

function Get-MavenVersion {
  $mvnCmd = Get-Command mvn -ErrorAction SilentlyContinue
  if (-not $mvnCmd) {
    $mvnCmd = Get-Command mvn.cmd -ErrorAction SilentlyContinue
  }
  if (-not $mvnCmd) {
    Fail 'Maven nao encontrado no PATH. Instale Maven >= 3.9.0 e tente novamente.'
  }

  $mvnOutput = & cmd.exe /c "mvn -v 2>&1"
  $line = ($mvnOutput | Select-String -Pattern '^Apache Maven\s+').Line
  if (-not $line) {
    Fail 'Nao foi possivel identificar a versao do Maven.'
  }

  $parts = $line -split '\s+'
  return [Version]$parts[2]
}

Write-Host 'Validando toolchain do backend...' -ForegroundColor Cyan

$javaMajor = Get-JavaMajor
if ($javaMajor -ne $requiredJavaMajor) {
  Fail "Java incompativel. Esperado Java $requiredJavaMajor.x (LTS), encontrado Java major $javaMajor."
}

$mavenVersion = Get-MavenVersion
if ($mavenVersion -lt $requiredMavenMin) {
  Fail "Maven incompativel. Esperado Maven >= $requiredMavenMin, encontrado $mavenVersion."
}

Write-Host "[OK] Toolchain valida: Java $javaMajor.x e Maven $mavenVersion" -ForegroundColor Green

if (-not (Test-Path $pomPath)) {
  Fail "Arquivo POM nao encontrado em '$pomPath'."
}

if (-not $SkipTests) {
  Write-Host 'Executando testes do backend...' -ForegroundColor Cyan
  & mvn -f $pomPath test
  if ($LASTEXITCODE -ne 0) {
    Fail 'Falha na execucao de mvn test.'
  }
  Write-Host '[OK] Testes do backend concluidos com sucesso.' -ForegroundColor Green
} else {
  Write-Host 'Validacao concluida. Execucao de testes foi ignorada por -SkipTests.' -ForegroundColor Yellow
}
