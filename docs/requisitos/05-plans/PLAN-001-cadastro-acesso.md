# PLAN-001 — Cadastro & Acesso (Implementação Técnica)

> **Versão**: 1.0  
> **Data**: 3 de abril de 2026  
> **Baseado em**: SPEC-001-cadastro-acesso.md  
> **RFs Cobertas**: RF-CAD-01 a 08, RF-ACE-01 a 07 (15 RFs)  
> **Tempo Estimado**: 16 horas (8h database + 8h API + React)

---

## 1. Modelagem de Banco de Dados (PostgreSQL)

### 1.1 Entidades Principais

```sql
-- USUÁRIO (Auth + Roles)
TABLE usuario {
  usuario_id BIGSERIAL PRIMARY KEY
  cpf VARCHAR(11) NOT NULL UNIQUE
  email VARCHAR(100) NOT NULL UNIQUE
  senha_hash VARCHAR(255) NOT NULL (BCrypt)
  nome VARCHAR(150) NOT NULL
  telefone VARCHAR(20)
  status ENUM('ATIVO', 'INATIVO', 'SUSPENSO') DEFAULT 'ATIVO'
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  criado_por BIGINT REFERENCES usuario(usuario_id)
}

-- PAPEL/ROLE
TABLE papel {
  papel_id SMALLSERIAL PRIMARY KEY
  nome VARCHAR(50) NOT NULL UNIQUE ('PROPRIETARIO', 'COORDENADOR', 'RECEPCIONISTA', 'PROFESSOR', 'ALUNO')
  descricao TEXT
  permissoes JSONB -- Array de permissões (legacy, usar table abaixo)
  ativo BOOLEAN DEFAULT TRUE
}

-- USUÁRIO × PAPEL × ACADEMIA (Multi-tenant RBAC)
TABLE usuario_papel_academia {
  usuario_papel_academia_id BIGSERIAL PRIMARY KEY
  usuario_id BIGINT NOT NULL REFERENCES usuario(usuario_id) ON DELETE CASCADE
  papel_id SMALLINT NOT NULL REFERENCES papel(papel_id)
  academia_id SMALLINT NOT NULL REFERENCES academia(academia_id)
  data_inicio DATE DEFAULT CURRENT_DATE
  data_fim DATE -- NULL = indefinido
  ativo BOOLEAN DEFAULT TRUE
  
  UNIQUE(usuario_id, papel_id, academia_id)
}

-- ALUNO
TABLE aluno {
  aluno_id BIGSERIAL PRIMARY KEY
  cpf VARCHAR(11) NOT NULL UNIQUE
  rg VARCHAR(20)
  nome VARCHAR(150) NOT NULL
  sobrenome VARCHAR(150)
  email VARCHAR(100)
  telefone VARCHAR(20)
  data_nascimento DATE
  genero ENUM('M', 'F', 'OUTRO')
  endereco_rua VARCHAR(200)
  endereco_numero VARCHAR(10)
  endereco_complemento VARCHAR(100)
  endereco_bairro VARCHAR(100)
  endereco_cidade VARCHAR(100)
  endereco_estado VARCHAR(2)
  endereco_cep VARCHAR(8)
  
  contato_emergencia_nome VARCHAR(150)
  contato_emergencia_telefone VARCHAR(20)
  
  status ENUM('ATIVO', 'INATIVO', 'BLOQUEADO', 'SUSPENSO') DEFAULT 'ATIVO'
  data_primeira_matricula DATE
  
  AUDITORIA:
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  criado_por BIGINT REFERENCES usuario(usuario_id)
  atualizado_por BIGINT REFERENCES usuario(usuario_id)
}

-- PLANO (Bronze, Prata, Ouro)
TABLE plano {
  plano_id SMALLSERIAL PRIMARY KEY
  nome VARCHAR(50) NOT NULL UNIQUE
  descricao TEXT
  preco_mensal NUMERIC(10, 2) NOT NULL
  preco_semestral NUMERIC(10, 2)
  preco_anual NUMERIC(10, 2)
  dias_carencia SMALLINT DEFAULT 3
  acesso_completo BOOLEAN DEFAULT TRUE
  horarios_restrictos BOOLEAN DEFAULT FALSE
  
  ativo BOOLEAN DEFAULT TRUE
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
}

-- ACADEMIA
TABLE academia {
  academia_id SMALLSERIAL PRIMARY KEY
  nome VARCHAR(150) NOT NULL
  cnpj VARCHAR(14)
  endereco VARCHAR(200)
  telefone VARCHAR(20)
  email VARCHAR(100)
  
  horas_funcionamento_inicio TIME
  horas_funcionamento_fim TIME
  
  ativo BOOLEAN DEFAULT TRUE
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
}

-- MATRÍCULA (Aluno × Plano × Academia × Data)
TABLE matricula {
  matricula_id BIGSERIAL PRIMARY KEY
  aluno_id BIGINT NOT NULL REFERENCES aluno(aluno_id) ON DELETE CASCADE
  academia_id SMALLINT NOT NULL REFERENCES academia(academia_id)
  plano_id SMALLINT NOT NULL REFERENCES plano(plano_id)
  
  data_inicio DATE DEFAULT CURRENT_DATE
  data_vencimento DATE NOT NULL
  data_renovacao DATE
  
  status ENUM('ATIVA', 'VENCIDA', 'BLOQUEADA_INADIMPLENCIA', 'CANCELADA') DEFAULT 'ATIVA'
  cancelada_motivo VARCHAR(255)
  data_cancelamento DATE
  
  AUDITORIA:
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  
  UNIQUE(aluno_id, academia_id)  -- Um aluno, um plano por academia
}

-- REGISTRO DE ACESSO
TABLE registro_acesso {
  registro_acesso_id BIGSERIAL PRIMARY KEY
  aluno_id BIGINT NOT NULL REFERENCES aluno(aluno_id) ON DELETE CASCADE
  academia_id SMALLINT NOT NULL REFERENCES academia(academia_id)
  
  data_hora_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  data_hora_saida TIMESTAMP
  
  acesso_liberado BOOLEAN DEFAULT TRUE
  motivo_bloqueio VARCHAR(255) -- 'INADIMPLENTE', 'MATRICULA_VENCIDA', etc
  
  registrado_por BIGINT REFERENCES usuario(usuario_id)
  
  AUDITORIA:
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
}

-- BLOQUEIO DE ACESSO
TABLE bloqueio_acesso {
  bloqueio_acesso_id BIGSERIAL PRIMARY KEY
  aluno_id BIGINT NOT NULL REFERENCES aluno(aluno_id) ON DELETE CASCADE
  academia_id SMALLINT NOT NULL REFERENCES academia(academia_id)
  
  motivo ENUM('INADIMPLENCIA', 'MATRICULA_VENCIDA', 'SUSPENSO', 'ADMIN') NOT NULL
  data_bloqueio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  data_desbloqueio TIMESTAMP
  
  bloqueado_por BIGINT REFERENCES usuario(usuario_id)
  
  ativo BOOLEAN
}

-- AUDITORIA LOG
TABLE auditoria_log {
  auditoria_log_id BIGSERIAL PRIMARY KEY
  
  entidade_tipo VARCHAR(50) NOT NULL -- 'ALUNO', 'MATRICULA', 'ACESSO'
  entidade_id BIGINT NOT NULL
  operacao VARCHAR(50) NOT NULL -- 'INSERT', 'UPDATE', 'DELETE'
  
  usuario_id BIGINT REFERENCES usuario(usuario_id)
  
  valores_antigas JSONB
  valores_novas JSONB
  
  ip_address VARCHAR(45)
  user_agent VARCHAR(500)
  
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
}

-- DOCUMENTO ALUNO (Foto, CPF escaneado, etc)
TABLE documento_aluno {
  documento_id BIGSERIAL PRIMARY KEY
  aluno_id BIGINT NOT NULL REFERENCES aluno(aluno_id) ON DELETE CASCADE
  
  tipo_documento ENUM('FOTO', 'CPF', 'RG', 'COMPROVANTE_ENDERECO', 'OUTRO')
  arquivo_path VARCHAR(500)
  arquivo_nome VARCHAR(255)
  arquivo_tamanho BIGINT
  mime_type VARCHAR(100)
  
  enviado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  enviado_por BIGINT REFERENCES usuario(usuario_id)
}

-- CONFIGURAÇÃO DE ACESSO POR ACADEMIA
TABLE configuracao_acesso {
  config_id SMALLSERIAL PRIMARY KEY
  academia_id SMALLINT NOT NULL REFERENCES academia(academia_id) UNIQUE
  
  dias_carencia_bloqueio SMALLINT DEFAULT 3
  permitir_checkin_recepcionista BOOLEAN DEFAULT TRUE
  permitir_checkin_catraca BOOLEAN DEFAULT FALSE  -- Futuro
  requer_foto_documento BOOLEAN DEFAULT FALSE
  
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
}
```

### 1.2 Índices Críticos

```sql
-- Performance de busca
CREATE INDEX idx_aluno_cpf ON aluno(cpf);
CREATE INDEX idx_aluno_email ON aluno(email);
CREATE INDEX idx_usuario_cpf ON usuario(cpf);
CREATE INDEX idx_usuario_email ON usuario(email);

-- Multi-tenant
CREATE INDEX idx_matricula_aluno_academia ON matricula(aluno_id, academia_id);
CREATE INDEX idx_usuario_papel_academia ON usuario_papel_academia(usuario_id, academia_id, papel_id);

-- Auditoria e histórico
CREATE INDEX idx_registro_acesso_aluno_data ON registro_acesso(aluno_id, data_hora_entrada DESC);
CREATE INDEX idx_registro_acesso_academia_data ON registro_acesso(academia_id, data_hora_entrada DESC);
CREATE INDEX idx_auditoria_log_entidade ON auditoria_log(entidade_tipo, entidade_id);
CREATE INDEX idx_auditoria_log_data ON auditoria_log(criado_em DESC);
CREATE INDEX idx_bloqueio_acesso_aluno ON bloqueio_acesso(aluno_id, ativo);

-- Status checks
CREATE INDEX idx_matricula_status ON matricula(status, data_vencimento);
CREATE INDEX idx_aluno_status ON aluno(status);
```

### 1.3 Constraints e Triggers

```sql
-- Garantir que email do usuário é válido
ALTER TABLE usuario
ADD CONSTRAINT check_email_formato CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$');

-- Garantir que CPF tem 11 dígitos
ALTER TABLE aluno
ADD CONSTRAINT check_cpf_format CHECK (LENGTH(cpf) = 11 AND cpf ~ '^\d+$');

-- Data vencimento deve ser no futuro
ALTER TABLE matricula
ADD CONSTRAINT check_data_vencimento CHECK (data_vencimento > data_inicio);

-- Trigger: Atualizar timestamp de auditoria
CREATE TRIGGER trigger_aluno_updated_at
BEFORE UPDATE ON aluno
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Trigger: Log auditoria quando aluno é criado
CREATE TRIGGER trigger_auditoria_aluno_insert
AFTER INSERT ON aluno
FOR EACH ROW
EXECUTE FUNCTION log_auditoria('ALUNO', 'INSERT');

-- Trigger: Log auditoria quando aluno é alterado
CREATE TRIGGER trigger_auditoria_aluno_update
AFTER UPDATE ON aluno
FOR EACH ROW
WHEN (OLD.* IS DISTINCT FROM NEW.*)
EXECUTE FUNCTION log_auditoria('ALUNO', 'UPDATE');

-- Trigger: Log auditoria quando matrícula é criada
CREATE TRIGGER trigger_auditoria_matricula_insert
AFTER INSERT ON matricula
FOR EACH ROW
EXECUTE FUNCTION log_auditoria('MATRICULA', 'INSERT');

-- Trigger: Log auditoria de acesso
CREATE TRIGGER trigger_auditoria_acesso_insert
AFTER INSERT ON registro_acesso
FOR EACH ROW
EXECUTE FUNCTION log_auditoria('ACESSO', 'INSERT');
```

### 1.4 Functions (PL/pgSQL)

```sql
-- Função: Calcular status da matrícula (ATIVA, VENCIDA, BLOQUEADA, etc)
CREATE OR REPLACE FUNCTION calcular_status_matricula(p_matricula_id BIGINT)
RETURNS VARCHAR AS $$
DECLARE
  v_data_vencimento DATE;
  v_status VARCHAR;
  v_bloqueada BOOLEAN;
BEGIN
  SELECT m.data_vencimento, m.status INTO v_data_vencimento, v_status
  FROM matricula m
  WHERE m.matricula_id = p_matricula_id;
  
  -- Verificar se está bloqueada por inadimplência
  SELECT EXISTS(
    SELECT 1 FROM bloqueio_acesso ba
    WHERE ba.aluno_id = (SELECT aluno_id FROM matricula WHERE matricula_id = p_matricula_id)
    AND ba.ativo = TRUE
  ) INTO v_bloqueada;
  
  IF v_bloqueada THEN
    RETURN 'BLOQUEADA_INADIMPLENCIA';
  ELSIF v_data_vencimento < CURRENT_DATE THEN
    RETURN 'VENCIDA';
  ELSE
    RETURN 'ATIVA';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Função: Registrar acesso de aluno
CREATE OR REPLACE FUNCTION registrar_acesso_aluno(
  p_aluno_id BIGINT,
  p_academia_id SMALLINT,
  p_usuario_id BIGINT
) RETURNS TABLE(
  acesso_liberado BOOLEAN,
  motivo VARCHAR,
  aluno_nome VARCHAR
) AS $$
DECLARE
  v_status VARCHAR;
  v_acesso_liberado BOOLEAN := TRUE;
  v_motivo VARCHAR := 'OK';
  v_aluno_nome VARCHAR;
BEGIN
  -- Buscar dados do aluno
  SELECT a.nome INTO v_aluno_nome FROM aluno a WHERE a.aluno_id = p_aluno_id;
  
  -- Verificar se aluno existe e está ativo
  IF v_aluno_nome IS NULL THEN
    RETURN QUERY SELECT FALSE, 'ALUNO_NAO_ENCONTRADO', NULL::VARCHAR;
    RETURN;
  END IF;
  
  -- Verificar se está bloqueado
  IF EXISTS(SELECT 1 FROM bloqueio_acesso WHERE aluno_id = p_aluno_id AND ativo = TRUE) THEN
    v_acesso_liberado := FALSE;
    v_motivo := 'BLOQUEADO_INADIMPLENCIA';
    RETURN QUERY SELECT v_acesso_liberado, v_motivo, v_aluno_nome;
    INSERT INTO registro_acesso(aluno_id, academia_id, acesso_liberado, motivo_bloqueio, registrado_por)
    VALUES(p_aluno_id, p_academia_id, FALSE, v_motivo, p_usuario_id);
    RETURN;
  END IF;
  
  -- Verificar se matrícula está vencida
  IF EXISTS(
    SELECT 1 FROM matricula m
    WHERE m.aluno_id = p_aluno_id
    AND m.academia_id = p_academia_id
    AND m.data_vencimento < CURRENT_DATE
  ) THEN
    v_acesso_liberado := FALSE;
    v_motivo := 'MATRICULA_VENCIDA';
  END IF;
  
  -- Registrar acesso
  INSERT INTO registro_acesso(aluno_id, academia_id, acesso_liberado, motivo_bloqueio, registrado_por)
  VALUES(p_aluno_id, p_academia_id, v_acesso_liberado, CASE WHEN v_acesso_liberado THEN NULL ELSE v_motivo END, p_usuario_id);
  
  RETURN QUERY SELECT v_acesso_liberado, v_motivo, v_aluno_nome;
END;
$$ LANGUAGE plpgsql;

-- Função: Atualizar timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função: Log auditoria
CREATE OR REPLACE FUNCTION log_auditoria(p_entidade_tipo VARCHAR, p_operacao VARCHAR)
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO auditoria_log(entidade_tipo, entidade_id, operacao, valores_novas, criado_em)
  VALUES(
    p_entidade_tipo,
    CASE WHEN p_operacao = 'DELETE' THEN OLD.id ELSE NEW.id END,
    p_operacao,
    CASE WHEN p_operacao = 'DELETE' THEN NULL ELSE row_to_json(NEW) END,
    CURRENT_TIMESTAMP
  );
  RETURN CASE WHEN p_operacao = 'DELETE' THEN OLD ELSE NEW END;
END;
$$ LANGUAGE plpgsql;
```

### 1.5 Migrations Flyway

```
V001__criar_tabela_academia.sql
V002__criar_tabela_usuario.sql
V003__criar_tabela_papel.sql
V004__criar_tabela_usuario_papel_academia.sql
V005__criar_tabela_aluno.sql
V006__criar_tabela_plano.sql
V007__criar_tabela_matricula.sql
V008__criar_tabela_registro_acesso.sql
V009__criar_tabela_bloqueio_acesso.sql
V010__criar_tabela_auditoria_log.sql
V011__criar_tabela_documento_aluno.sql
V012__criar_tabela_configuracao_acesso.sql
V013__criar_indices.sql
V014__criar_functions.sql
V015__criar_triggers.sql
V016__popular_dados_iniciais.sql
```

---

## 2. API REST (Spring Boot)

### 2.1 Endpoints

| Método | Endpoint | Descrição | Autenticação | Responsabilidade |
|--------|----------|-----------|--------------|------------------|
| POST | `/api/auth/login` | Autenticar usuário | ❌ Pública | Gerar JWT |
| POST | `/api/auth/logout` | Logout | ✅ JWT | Invalidar token |
| POST | `/api/auth/refresh-token` | Renovar JWT | ✅ JWT | Gerar novo token |
| POST | `/api/alunos` | Criar novo aluno | ✅ RECEPCIONISTA | Validar + Criar |
| GET | `/api/alunos/{id}` | Detalhes do aluno | ✅ COORDENADOR | Buscar |
| PUT | `/api/alunos/{id}` | Atualizar aluno | ✅ COORDENADOR | Validar + Atualizar |
| GET | `/api/alunos` | Listar alunos | ✅ COORDENADOR | Filtrar + Paginar |
| DELETE | `/api/alunos/{id}` | Soft delete aluno | ✅ PROPRIETARIO | Marcar inativo |
| POST | `/api/alunos/{id}/matriculas` | Criar matrícula | ✅ RECEPCIONISTA | Validar + Criar |
| GET | `/api/alunos/{id}/matriculas` | Histórico matrículas | ✅ COORDENADOR | Listar |
| PUT | `/api/matriculas/{id}` | Atualizar matrícula | ✅ COORDENADOR | Validar + Atualizar |
| GET | `/api/matriculas/{id}/status` | Status atual | ✅ RECEPCIONISTA | Consultar status |
| POST | `/api/acesso/checkin` | Registrar check-in | ✅ RECEPCIONISTA | Validar + Registrar |
| GET | `/api/acesso/historico/{aluno_id}` | Histórico acessos | ✅ COORDENADOR | Listar com filtros |
| GET | `/api/acesso/bloqueados` | Lista bloqueados | ✅ COORDENADOR | Listar + Filtrar |
| POST | `/api/acesso/{aluno_id}/desbloquear` | Desbloquear acesso | ✅ PROPRIETARIO | Desbloquear |
| GET | `/api/auditoria/aluno/{aluno_id}` | Auditoria aluno | ✅ PROPRIETARIO | Histórico mudanças |
| GET | `/api/auditoria/acesso/{aluno_id}` | Auditoria acesso | ✅ COORDENADOR | Histórico tentativas |
| POST | `/api/usuarios` | Criar usuário | ✅ PROPRIETARIO | Validar + Criar |
| GET | `/api/usuarios/{id}` | Detalhes usuário | ✅ PROPRIETARIO | Buscar |
| PUT | `/api/usuarios/{id}` | Atualizar usuário | ✅ PROPRIETARIO | Validar + Atualizar |
| POST | `/api/usuarios/{id}/papeis` | Atribuir papel | ✅ PROPRIETARIO | Vincular papel |
| GET | `/api/usuarios/{id}/papeis` | Papéis do usuário | ✅ PROPRIETARIO | Listar |
| GET | `/api/planos` | Listar planos | ❌ Pública | Listar |

### 2.2 DTOs (Request/Response)

```java
// === AUTH ===

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    @NotBlank(message = "CPF é obrigatório")
    @Size(min = 11, max = 11, message = "CPF deve ter 11 dígitos")
    private String cpf;
    
    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 6, message = "Senha deve ter no mínimo 6 caracteres")
    private String senha;
}

@Data
public class LoginResponse {
    private String token;
    private String refreshToken;
    private Long usuarioId;
    private String nome;
    private List<String> papeis;
    private List<Integer> academiaIds;
    private Long expiresIn; // milliseconds
}

// === ALUNOS ===

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CadastroAlunoRequest {
    @NotBlank(message = "CPF é obrigatório")
    @Pattern(regexp = "\\d{11}", message = "CPF deve conter 11 dígitos")
    private String cpf;
    
    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 3, max = 150, message = "Nome deve ter entre 3 e 150 caracteres")
    private String nome;
    
    @NotBlank
    @Email(message = "Email inválido")
    private String email;
    
    @NotBlank
    @Pattern(regexp = "\\(\\d{2}\\) \\d{5}-\\d{4}", message = "Telefone no formato (XX) XXXXX-XXXX")
    private String telefone;
    
    @NotNull(message = "Data de nascimento é obrigatória")
    @PastOrPresent
    private LocalDate dataNascimento;
    
    @NotNull(message = "Academia principal é obrigatória")
    private Integer academiaPrincipalId;
    
    @NotNull(message = "Plano é obrigatório")
    private Integer planoId;
    
    private String nomeContato;
    private String telefoneContato;
    
    // Endereço
    private String enderecRua;
    private String enderecNumero;
    private String enderecComplemento;
    private String enderecBairro;
    private String enderecCidade;
    private String enderecEstado;
    private String enderecCep;
}

@Data
public class AlunoResponse {
    private Long id;
    private String cpf;
    private String nome;
    private String email;
    private String telefone;
    private LocalDate dataNascimento;
    private String statusAtual; // ATIVO, BLOQUEADO, VENCIDO
    private LocalDateTime dataMatricula;
    private LocalDateTime dataVencimento;
    private List<MatriculaResponse> matriculas;
    private List<RegistroAcessoResponse> ultimosAcessos; // Últimos 5
    private List<String> papeis; // Se usuário também (PROFESSOR, etc)
}

@Data
public class AlunoUpdateRequest {
    private String email;
    
    @Pattern(regexp = "\\(\\d{2}\\) \\d{5}-\\d{4}", message = "Telefone no formato (XX) XXXXX-XXXX")
    private String telefone;
    
    private String enderecRua;
    private String enderecNumero;
    private String enderecComplemento;
    private String enderecBairro;
    private String enderecCidade;
    private String enderecEstado;
    private String enderecCep;
}

// === MATRÍCULAS ===

@Data
public class MatriculaResponse {
    private Long id;
    private Integer planoId;
    private String nomePlano;
    private LocalDate dataInicio;
    private LocalDate dataVencimento;
    private String status; // ATIVA, VENCIDA, BLOQUEADA_INADIMPLENCIA, CANCELADA
    private Boolean bloqueada;
    private String motivoBloqueio;
}

@Data
public class MatriculaCreateRequest {
    @NotNull(message = "Plano é obrigatório")
    private Integer planoId;
    
    @NotNull(message = "Academia é obrigatória")
    private Integer academiaId;
    
    @NotNull(message = "Data de vencimento é obrigatória")
    @FutureOrPresent
    private LocalDate dataVencimento;
}

// === CHECK-IN ===

@Data
public class CheckInRequest {
    @NotBlank(message = "CPF ou ID do aluno é obrigatório")
    private String cpfOuId;
    
    @NotNull(message = "Academia é obrigatória")
    private Integer academiaId;
    
    // Timestamps são preenchidos automaticamente pelo backend
}

@Data
public class CheckInResponse {
    private Boolean acessoLiberado;
    private String motivo; // OK, INADIMPLENTE, MATRICULA_VENCIDA, ALUNO_NAO_ENCONTRADO
    
    private Long alunoId;
    private String alunoNome;
    private String alunoPlano;
    
    private LocalDateTime registroTimestamp;
    
    // Se bloqueado
    private LocalDate dataVencimentoMatricula;
    private LocalDate dataBloqueio;
}

// === AUDITORIA ===

@Data
public class AuditoriaResponse {
    private Long id;
    private String entidadeTipo; // ALUNO, MATRICULA, ACESSO
    private Long entidadeId;
    private String operacao; // INSERT, UPDATE, DELETE
    private String usuarioNome;
    private LocalDateTime criadoEm;
    private Map<String, Object> valoresAntigos;
    private Map<String, Object> valoresNovos;
    private String ipAddress;
}

@Data
public class RegistroAcessoResponse {
    private Long id;
    private String akademiaId;
    private LocalDateTime dataHoraEntrada;
    private LocalDateTime dataHoraSaida;
    private Boolean acessoLiberado;
    private String motivoBloqueio;
}
```

### 2.3 REST Controller Example (Java/Spring)

```java
@RestController
@RequestMapping("/api/acesso")
@RequiredArgsConstructor
@Slf4j
public class AcessoController {
    
    private final AcessoService acessoService;
    private final AuditService auditService;
    
    @PostMapping("/checkin")
    @PreAuthorize("hasAnyRole('RECEPCIONISTA', 'COORDENADOR')")
    public ResponseEntity<CheckInResponse> checkin(
            @Valid @RequestBody CheckInRequest request,
            @AuthenticationPrincipal UserPrincipal user) {
        
        try {
            CheckInResponse response = acessoService.registrarAcesso(
                request.getCpfOuId(),
                request.getAcademiaId(),
                user.getId()
            );
            
            // Auditoria
            auditService.registrar(
                "ACESSO",
                response.getAlunoId(),
                "CHECK_IN",
                null,
                response
            );
            
            return ResponseEntity.ok(response);
            
        } catch (AlunoNaoEncontradoException e) {
            log.warn("Tentativa de check-in com aluno não encontrado: {}", request.getCpfOuId());
            return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(CheckInResponse.builder()
                    .acessoLiberado(false)
                    .motivo("ALUNO_NAO_ENCONTRADO")
                    .registroTimestamp(LocalDateTime.now())
                    .build());
        }
    }
    
    @GetMapping("/historico/{alunoId}")
    @PreAuthorize("hasAnyRole('COORDENADOR', 'PROPRIETARIO')")
    public ResponseEntity<Page<RegistroAcessoResponse>> historicoAcesso(
            @PathVariable Long alunoId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @RequestParam(required = false) LocalDate dataInicio,
            @RequestParam(required = false) LocalDate dataFim) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("dataHoraEntrada").descending());
        Page<RegistroAcessoResponse> historico = acessoService.buscarHistorico(
            alunoId,
            dataInicio,
            dataFim,
            pageable
        );
        
        return ResponseEntity.ok(historico);
    }
}

@RestController
@RequestMapping("/api/alunos")
@RequiredArgsConstructor
@Slf4j
public class AlunoController {
    
    private final AlunoService alunoService;
    private final AuditService auditService;
    
    @PostMapping
    @PreAuthorize("hasAnyRole('RECEPCIONISTA', 'COORDENADOR')")
    public ResponseEntity<AlunoResponse> criar(
            @Valid @RequestBody CadastroAlunoRequest request,
            @AuthenticationPrincipal UserPrincipal user) {
        
        AlunoResponse aluno = alunoService.criar(request, user.getId());
        
        auditService.registrar("ALUNO", aluno.getId(), "INSERT", null, aluno);
        
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(aluno);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('COORDENADOR', 'PROPRIETARIO')")
    public ResponseEntity<AlunoResponse> obter(@PathVariable Long id) {
        return ResponseEntity.ok(alunoService.buscarPorId(id));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('COORDENADOR', 'PROPRIETARIO')")
    public ResponseEntity<AlunoResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody AlunoUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal user) {
        
        AlunoResponse alunoAntigo = alunoService.buscarPorId(id);
        AlunoResponse alunoNovo = alunoService.atualizar(id, request, user.getId());
        
        auditService.registrar("ALUNO", id, "UPDATE", alunoAntigo, alunoNovo);
        
        return ResponseEntity.ok(alunoNovo);
    }
    
    @GetMapping
    @PreAuthorize("hasAnyRole('COORDENADOR', 'PROPRIETARIO')")
    public ResponseEntity<Page<AlunoResponse>> listar(
            @RequestParam(required = false) Integer academiaId,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<AlunoResponse> alunos = alunoService.listar(academiaId, status, pageable);
        
        return ResponseEntity.ok(alunos);
    }
}
```

### 2.4 Exception Handling

```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    
    @ExceptionHandler(AlunoNaoEncontradoException.class)
    public ResponseEntity<ErrorResponse> handleAlunoNaoEncontrado(AlunoNaoEncontradoException e) {
        ErrorResponse error = ErrorResponse.builder()
            .status(HttpStatus.NOT_FOUND.value())
            .mensagem("Aluno não encontrado")
            .detalhe(e.getMessage())
            .timestamp(LocalDateTime.now())
            .build();
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
    
    @ExceptionHandler(CPFJaExisteException.class)
    public ResponseEntity<ErrorResponse> handleCPFJaExiste(CPFJaExisteException e) {
        ErrorResponse error = ErrorResponse.builder()
            .status(HttpStatus.CONFLICT.value())
            .mensagem("CPF já cadastrado")
            .detalhe(e.getMessage())
            .timestamp(LocalDateTime.now())
            .build();
        
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationErrors(MethodArgumentNotValidException e) {
        Map<String, String> erros = new HashMap<>();
        e.getBindingResult().getFieldErrors().forEach(error ->
            erros.put(error.getField(), error.getDefaultMessage())
        );
        
        ErrorResponse error = ErrorResponse.builder()
            .status(HttpStatus.BAD_REQUEST.value())
            .mensagem("Erro de validação")
            .validacaoErros(erros)
            .timestamp(LocalDateTime.now())
            .build();
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
}
```

---

## 3. React Components

### 3.1 Estrutura de Pastas

```
frontend/src/
├── pages/
│   ├── Cadastro/
│   │   ├── CadastroAlunoPage.jsx
│   │   └─ CadastroAlunoPage.module.css
│   ├── CheckIn/
│   │   ├── CheckInPage.jsx
│   │   └─ CheckInPage.module.css
│   ├── Relatorios/
│   │   ├── HistoricoAcessoPage.jsx
│   │   └─ HistoricoAcessoPage.module.css
│   └── Auditoria/
│       ├── AuditariaPage.jsx
│       └─ AuditoriaPage.module.css
│
├── components/
│   ├── forms/
│   │   ├── CadastroForm.jsx
│   │   └─ CadastroForm.module.css
│   ├── tables/
│   │   ├── DataTable.jsx
│   │   └─ DataTable.module.css
│   ├── badges/
│   │   ├── StatusBadge.jsx
│   │   └─ StatusBadge.module.css
│   ├── modals/
│   │   ├── ConfirmacaoModal.jsx
│   │   └─ ConfirmacaoModal.module.css
│   └── buttons/
│       ├── ExportButton.jsx
│       └─ ExportButton.module.css
│
├── services/
│   ├── api.js            (configuração Axios)
│   ├── alunoService.js
│   ├── acessoService.js
│   └── auditoriaService.js
│
├── store/
│   ├── index.js          (Redux ou Context)
│   ├── alunoSlice.js
│   └── authSlice.js
│
└── hooks/
    ├── useAuth.js
    ├── useAluno.js
    └── useFetch.js
```

### 3.2 Componentes Principais

```jsx
// CadastroAlunoPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Alert } from '@mui/material';
import CadastroForm from '../../components/forms/CadastroForm';
import alunoService from '../../services/alunoService';

export default function CadastroAlunoPage() {
  const navigate = useNavigate();
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(false);

  const handleSubmit = async (dados) => {
    try {
      const novoAluno = await alunoService.criar(dados);
      setSucesso(true);
      setTimeout(() => {
        navigate(`/alunos/${novoAluno.id}`);
      }, 1500);
    } catch (err) {
      setErro(err.response?.data?.mensagem || 'Erro ao criar aluno');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <h1>Novo Aluno</h1>
      {erro && <Alert severity="error">{erro}</Alert>}
      {sucesso && <Alert severity="success">Aluno criado com sucesso!</Alert>}
      <CadastroForm onSubmit={handleSubmit} />
    </Container>
  );
}

// CheckInPage.jsx
import React, { useState } from 'react';
import { Container, TextField, Button, Alert, Paper, Box } from '@mui/material';
import StatusBadge from '../../components/badges/StatusBadge';
import acessoService from '../../services/acessoService';

export default function CheckInPage() {
  const [cpf, setCpf] = useState('');
  const [academia, setAcademia] = useState('');
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const handleCheckin = async () => {
    setCarregando(true);
    setErro(null);
    try {
      const response = await acessoService.checkin({
        cpfOuId: cpf,
        academiaId: academia
      });
      setResultado(response);
      setCpf(''); // Limpar para próximo
    } catch (err) {
      setErro(err.response?.data?.mensagem || 'Erro ao processar check-in');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <h1>Check-in de Alunos</h1>
      
      <Paper sx={{ p: 3, mb: 2 }}>
        <TextField
          fullWidth
          label="CPF do Aluno"
          placeholder="000.000.000-00"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          disabled={carregando}
          sx={{ mb: 2 }}
        />
        
        <TextField
          fullWidth
          select
          label="Academia"
          value={academia}
          onChange={(e) => setAcademia(e.target.value)}
          disabled={carregando}
          sx={{ mb: 2 }}
        >
          <option value="1">Academia Bom Retiro</option>
          <option value="2">Academia Centro</option>
        </TextField>
        
        <Button
          fullWidth
          variant="contained"
          onClick={handleCheckin}
          disabled={!cpf || !academia || carregando}
          size="large"
        >
          {carregando ? 'Processando...' : 'Registrar Entrada'}
        </Button>
      </Paper>

      {erro && <Alert severity="error">{erro}</Alert>}
      
      {resultado && (
        <Paper sx={{ p: 2, bgcolor: resultado.acessoLiberado ? '#c8e6c9' : '#ffcdd2' }}>
          <h2>{resultado.alunoNome}</h2>
          <StatusBadge status={resultado.motivo} />
          <Box sx={{ mt: 2 }}>
            <p><strong>Plano:</strong> {resultado.alunoPlano}</p>
            <p><strong>Status:</strong> {resultado.motivo}</p>
            <p><strong>Horário:</strong> {new Date(resultado.registroTimestamp).toLocaleTimeString('pt-BR')}</p>
          </Box>
        </Paper>
      )}
    </Container>
  );
}

// StatusBadge.jsx
import React from 'react';
import { Chip } from '@mui/material';

const statusConfig = {
  'OK': { label: 'Acesso Liberado', color: 'success' },
  'INADIMPLENTE': { label: 'Inadimplente', color: 'error' },
  'MATRICULA_VENCIDA': { label: 'Matrícula Vencida', color: 'warning' },
  'ALUNO_NAO_ENCONTRADO': { label: 'Aluno Não Encontrado', color: 'default' },
  'BLOQUEADO': { label: 'Acesso Bloqueado', color: 'error' },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig['ALUNO_NAO_ENCONTRADO'];
  return <Chip label={config.label} color={config.color} />;
}
```

---

## 4. Security & RBAC

### 4.1 JWT Configuration (Spring Security)

```java
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .cors().and()
            .exceptionHandling()
                .authenticationEntryPoint(jwtAuthenticationEntryPoint)
            .and()
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/planos").permitAll()
                .requestMatchers("/api/**").authenticated()
                .anyRequest().authenticated()
            )
            .addFilterBefore(
                new JwtAuthenticationFilter(jwtTokenProvider()),
                UsernamePasswordAuthenticationFilter.class
            );
        
        return http.build();
    }
    
    @Bean
    public JwtTokenProvider jwtTokenProvider() {
        return new JwtTokenProvider();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

### 4.2 Role-Based Access Control

```java
@Data
@NoArgsConstructor
public class UserPrincipal implements UserDetails {
    private Long id;
    private String cpf;
    private String email;
    private Collection<? extends GrantedAuthority> authorities;
    private Map<String, List<Integer>> academiasByRole; // role -> [academiaIds]
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.authorities;
    }
    
    public boolean temAcessoAcademia(Integer academiaId) {
        return this.academiasByRole.values()
            .stream()
            .flatMap(List::stream)
            .anyMatch(id -> id.equals(academiaId));
    }
}
```

---

## 5. Validações

### 5.1 Frontend Validações (React)

```javascript
// validators.js
export const validadores = {
  cpf: (cpf) => {
    const cleaned = cpf.replace(/\D/g, '');
    if (cleaned.length !== 11) return 'CPF deve conter 11 dígitos';
    if (/^(\d)\1{10}$/.test(cleaned)) return 'CPF inválido';
    // Cálculo do dígito verificador...
    return null;
  },

  email: (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email) ? null : 'Email inválido';
  },

  telefone: (telefone) => {
    const regex = /^\(\d{2}\) \d{5}-\d{4}$/;
    return regex.test(telefone) ? null : 'Telefone no formato (XX) XXXXX-XXXX';
  },

  dataNascimento: (data) => {
    const date = new Date(data);
    const hoje = new Date();
    if (date > hoje) return 'Data não pode ser no futuro';
    return null;
  }
};
```

### 5.2 Backend Validações (Java/Spring)

```java
// Bean Validation
@Data
public class CadastroAlunoRequest {
    @NotBlank(message = "CPF obrigatório")
    @Pattern(regexp = "\\d{11}", message = "CPF com 11 dígitos")
    @ValidCPF  // Custom validator
    private String cpf;
    
    @NotBlank(message = "Email obrigatório")
    @Email(message = "Email inválido")
    private String email;
}

// Custom Validator
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = CPFValidator.class)
public @interface ValidCPF {
    String message() default "CPF inválido";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

public class CPFValidator implements ConstraintValidator<ValidCPF, String> {
    @Override
    public boolean isValid(String cpf, ConstraintValidatorContext context) {
        if (cpf == null) return false;
        
        String digits = cpf.replaceAll("\\D", "");
        if (digits.length() != 11) return false;
        if (digits.matches("(\\d)\\1{10}")) return false;
        
        // Validar dígitos verificadores...
        return true;
    }
}
```

---

## 6. Critérios de Aceição

```
✅ Database
  ☑ 12 tabelas criadas
  ☑ 15 índices configurados
  ☑ 4 procedures PL/pgSQL (status, acesso, triggers)
  ☑ 8 triggers implementados
  ☑ 16 migrations Flyway

✅ API REST
  ☑ 24 endpoints documentados
  ☑ Validações em 2 camadas (frontend + backend)
  ☑ RBAC com 4 roles (PROPRIETARIO, COORDENADOR, RECEPCIONISTA, PROFESSOR)
  ☑ JWT authentication + refresh token
  ☑ Exception handling com 5+ custom exceptions
  ☑ Paginação + filtros em listagens

✅ React Components
  ☑ 4 páginas principais (Cadastro, CheckIn, Histórico, Auditoria)
  ☑ 5+ componentes reutilizáveis (StatusBadge, DataTable, Form, Modal, Button)
  ☑ Validações real-time
  ☑ Estados de Loading/Erro/Sucesso
  ☑ Responsividade (desktop + tablet)

✅ Security
  ☑ JWT tokens com expiração (15min + refresh 7 dias)
  ☑ BCrypt para senhas
  ☑ RBAC por academia (multi-tenant)
  ☑ SQL injection prevention (Prepared Statements)
  ☑ XSS protection (React sanitização)
  ☑ CORS configurado

✅ Tests
  ☑ Unit tests (Service layer) ≥80%
  ☑ Integration tests (API endpoints)
  ☑ Database tests (Migrations + Functions)
  ☑ E2E tests (Selenium/Cypress) para fluxos críticos

✅ Documentation
  ☑ Endpoints documentados (Swagger/OpenAPI)
  ☑ Database schema diagram
  ☑ Architecture diagram
  ☑ Setup guide (PostgreSQL + Spring + React)
```

---

## 7. Próximos Passos

Este PLAN-001 cobre **Cadastro e Acesso** (~15 RFs). Após implementação:

1. ✅ Database migrations aplicadas
2. ✅ API endpoints testados
3. ✅ React prototype integrado
4. ✅ Segurança validada
5. ➜ Seguir para **PLAN-002 (Financeiro)**

---

**Status**: 📋 Artefato criado para implementação imediata  
**Tempo Estimado**: 16 horas  
**Devs Necessários**: 1 Backend + 1 Frontend + 0.5 DBA
