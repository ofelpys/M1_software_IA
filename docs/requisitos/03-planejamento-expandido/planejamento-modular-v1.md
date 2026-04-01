# Planejamento Modular Expandido — Arquitetura e Implementação

> **Projeto**: Rede Força Total Academias  
> **Data**: 1 de abril de 2026  
> **Status**: Planejamento de arquitetura e decomposição modular  
> **Referência**: Todos os mapa-mestre e requisitos

---

## 1. Arquitetura Geral do Sistema

### 1.1 Visão de Camadas

```
┌──────────────────────────────────────────────────────────────────┐
│                    CAMADA FRONT-END (React)                      │
│                                                                   │
│  Pages → Components → Services → Models → Utils & Hooks          │
│  (Interfaces)  (UI)  (HTTP)    (DTOs)   (Lógica auxiliar)       │
└────────────────────────────┬─────────────────────────────────────┘
                             │ HTTP(S) + JSON
                             │ REST API Calls
┌────────────────────────────▼─────────────────────────────────────┐
│                   CAMADA BACK-END (Spring Boot)                   │
│                                                                   │
│  Controller → Service → Repository → Database (PostgreSQL)       │
│  (REST)   (Negócio) (Dados)     (Tables, Procedures)            │
│                                                                   │
│  ├─ Auth Controller (JWT)                                        │
│  ├─ Aluno Controller → AlunoService → AlunoRepository            │
│  ├─ Financeiro Controller → FinanceiroService → FinRepository    │
│  ├─ Professor Controller → ProfessorService → ProfRepository     │
│  └─ ...                                                           │
└────────────────────────────┬─────────────────────────────────────┘
                             │ JDBC / JPA
                             │ SQL Queries
┌────────────────────────────▼─────────────────────────────────────┐
│                  CAMADA BANCO DE DADOS (PostgreSQL)               │
│                                                                   │
│  Tables: aluno, matrícula, professor, financeiro, comanda, ...  │
│  Indexes: Para performance em queries críticas                   │
│  Procedures/Functions: Para lógica complexa (comissões, etc)     │
│  Constraints: Integridade referencial e regras de negócio        │
└──────────────────────────────────────────────────────────────────┘
```

### 1.2 Padrão MVC + REST

**Requisição típica**:
```
React Component 
  → Estado local (useState)
    → ServiçoHTTP (axios/fetch)
      → Interceptor (JWT)
        → Backend REST API (/api/v1/alunos)
          → Controller (valida entrada)
            → Service (regra de negócio)
              → Repository (acesso dados)
                → SQL / Procedure
Resposta: DTO → JSON → React → Renderização
```

### 1.3 Fluxo de Dados

```
FRONT-END (React)              BACK-END (Spring Boot)
┌──────────────┐               ┌──────────────┐
│ Componentes  │ ──REST───────>│ Controllers  │
│              │               │              │
│ (ex. Lista   │ <──JSON───────│ (validation) │
│  de Alunos)  │               │              │
└──────┬───────┘               └────────┬─────┘
       │                               │
       │ DTOs / Models                 │ Entities
       │ (aluno, professor)            │ (Aluno.java, Professor.java)
       │                               │
       └───────────────────┬───────────┘
                           │
                    DATABASE LAYER
                           │
                  ┌────────▼────────┐
                  │ hibernate/JPA   │
                  │ DDL/DML SQL     │
                  │ Procedures      │
                  └────────────────┘
```

---

## 2. Decomposição de Módulos por Stack

### 2.1 Módulo M01 — Cadastros e Matrículas

#### **Backend** (Spring Boot)

```java
// Entity
class Aluno {
  Long id;
  String cpf;          // Unique
  String nome;
  LocalDate dataNasc;
  String telefone;
  String email;
  String endereco;
  LocalDateTime criadoEm;
  LocalDateTime atualizadoEm;
}

class Matricula {
  Long id;
  Long alunoId;        // FK → Aluno
  Long unidadeId;      // FK → Unidade
  String plano;        // Bronze/Prata/Ouro
  LocalDate dataMatr;
  LocalDate dataVenc;
  String status;       // Ativo, Suspenso, Cancelado, Inadimplente
  LocalDateTime criadoEm;
}

// Repository (JPA)
interface AlunoRepository extends JpaRepository<Aluno, Long> {
  Optional<Aluno> findByCpf(String cpf);
  List<Aluno> findAll();  // Com paging
}

// Service
class AlunoService {
  Aluno cadastrarAluno(AlunoCadastroDTO dto) {
    // Validações
    if (alunoRepository.findByCpf(dto.cpf).isPresent()) {
      throw new CadastroException("CPF já existe");
    }
    // Persistir
    Aluno aluno = new Aluno(dto);
    return alunoRepository.save(aluno);
  }
  
  Matricula vincularMatricula(long alunoId, MatriculaDTO dto) {
    Aluno aluno = alunoRepository.findById(alunoId)
      .orElseThrow(() -> new AlunoNaoEncontradoException());
    
    Matricula mat = new Matricula(aluno, dto);
    return matriculaRepository.save(mat);
  }
}

// Controller (REST)
@RestController
@RequestMapping("/api/v1/alunos")
class AlunoController {
  @PostMapping
  ResponseEntity<AlunoDTO> criarAluno(@RequestBody AlunoCadastroDTO dto) {
    Aluno aluno = alunoService.cadastrarAluno(dto);
    return ResponseEntity.created(URI).body(toDTO(aluno));
  }
  
  @GetMapping("/{id}")
  ResponseEntity<AlunoDTO> obterAluno(@PathVariable Long id) {
    Aluno aluno = alunoService.obterAluno(id);
    return ResponseEntity.ok(toDTO(aluno));
  }
}
```

#### **Database** (PostgreSQL + Flyway)

```sql
-- V001__criar_tabela_aluno.sql
CREATE TABLE aluno (
  id BIGSERIAL PRIMARY KEY,
  cpf VARCHAR(14) NOT NULL UNIQUE,
  nome VARCHAR(255) NOT NULL,
  data_nasc DATE,
  telefone VARCHAR(20),
  email VARCHAR(255),
  endereco TEXT,
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_aluno_cpf ON aluno(cpf);

-- V002__criar_tabela_matricula.sql
CREATE TABLE matricula (
  id BIGSERIAL PRIMARY KEY,
  aluno_id BIGINT NOT NULL REFERENCES aluno(id) ON DELETE CASCADE,
  unidade_id BIGINT NOT NULL,  -- Foreign key para tabela unidade (criada depois)
  plano VARCHAR(50) NOT NULL,  -- Bronze, Prata, Ouro
  data_matr DATE NOT NULL,
  data_venc DATE NOT NULL,
  status VARCHAR(30) NOT NULL,  -- Ativo, Suspenso, Cancelado, Inadimplente
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW(),
  CHECK (status IN ('ATIVO', 'SUSPENSO', 'CANCELADO', 'INADIMPLENTE'))
);

CREATE INDEX idx_matricula_aluno ON matricula(aluno_id);
CREATE INDEX idx_matricula_unidade ON matricula(unidade_id);
CREATE INDEX idx_matricula_status ON matricula(status);
```

#### **Frontend** (React)

```jsx
// Components/CadastroAluno.jsx
function CadastroAluno() {
  const [formData, setFormData] = useState({
    nome: '', cpf: '', email: '', telefone: ''
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await alunoService.criarAluno(formData);
      alert('Aluno cadastrado com sucesso!');
      navegar('/alunos');
    } catch (error) {
      setError(error.message);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        name="nome"
        placeholder="Nome completo"
        onChange={(e) => setFormData({...formData, nome: e.target.value})}
        required
      />
      <input
        name="cpf"
        placeholder="CPF"
        onChange={(e) => setFormData({...formData, cpf: e.target.value})}
        required
      />
      {/* Mais campos... */}
      <button type="submit">Cadastrar</button>
    </form>
  );
}

// Services/AlunoService.js
class AlunoService {
  async criarAluno(data) {
    const response = await fetch('/api/v1/alunos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}` },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    
    return response.json();
  }
}

// Models/Aluno.js (DTO)
export class Aluno {
  constructor(id, cpf, nome, email, telefone) {
    this.id = id;
    this.cpf = cpf;
    this.nome = nome;
    this.email = email;
    this.telefone = telefone;
  }
}
```

---

### 2.2 Módulo M02 — Controle de Acesso

#### **Backend** (Spring Boot)

```java
class RegistroAcesso {
  Long id;
  Long alunoId;
  Long unidadeId;
  LocalDateTime dataHora;
  String status;  // AUTORIZADO, BLOQUEADO, PENDENTE_COMISSAO
}

class AcessoService {
  RegistroAcesso registrarAcesso(Long alunoId, Long unidadeId) {
    // 1. Validar se aluno existe
    Aluno aluno = alunoRepository.findById(alunoId)
      .orElseThrow(() -> new AlunoNaoEncontradoException());
    
    // 2. Verificar se tem matrícula ativa na unidade
    Matricula mat = matriculaRepository.findByAlunoAndUnidade(alunoId, unidadeId)
      .orElseThrow(() -> new MatriculaNaoEncontradaException());
    
    // 3. Verificar se está inadimplente
    if (mat.getStatus().equals("INADIMPLENTE")) {
      return criarRegistroAcesso(alunoId, unidadeId, "BLOQUEADO");
    }
    
    // 4. Registrar acesso
    return criarRegistroAcesso(alunoId, unidadeId, "AUTORIZADO");
  }
  
  void bloquearInadimplentes() {
    // Procedure ou query de bloquei automático
    List<Matricula> atrasadas = matriculaRepository.findInadimplentes(diasCarencia);
    atrasadas.forEach(mat -> mat.setStatus("INADIMPLENTE"));
    matriculaRepository.saveAll(atrasadas);
  }
}
```

#### **Database** (PostgreSQL)

```sql
-- V003__criar_tabela_acesso.sql
CREATE TABLE registro_acesso (
  id BIGSERIAL PRIMARY KEY,
  aluno_id BIGINT NOT NULL REFERENCES aluno(id),
  unidade_id BIGINT NOT NULL,
  data_hora TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(30) NOT NULL  -- AUTORIZADO, BLOQUEADO, PENDENTE
);

CREATE INDEX idx_acesso_aluno ON registro_acesso(aluno_id);
CREATE INDEX idx_acesso_data ON registro_acesso(data_hora);

-- V004__procedure_bloquear_inadimplentes.sql
CREATE OR REPLACE FUNCTION bloquear_inadimplentes(dias_carencia INT)
RETURNS VOID AS $$
BEGIN
  UPDATE matricula
  SET status = 'INADIMPLENTE'
  WHERE status = 'ATIVO'
    AND data_venc < CURRENT_DATE - (dias_carencia || ' days')::INTERVAL;
END;
$$ LANGUAGE plpgsql;
```

#### **Frontend** (React)

```jsx
// Pages/CheckIn.jsx
function CheckIn() {
  const [cpf, setCpf] = useState('');
  const [resultado, setResultado] = useState(null);
  
  const handleCheckIn = async (e) => {
    e.preventDefault();
    try {
      const aluno = await alunoService.buscarPorCPF(cpf);
      const acesso = await acessoService.registrarAcesso(aluno.id);
      
      if (acesso.status === 'AUTORIZADO') {
        setResultado({ tipo: 'sucesso', msg: `Bem-vindo, ${aluno.nome}!` });
      } else {
        setResultado({ tipo: 'bloqueado', msg: 'Acesso bloqueado - Inadimplência' });
      }
    } catch (error) {
      setResultado({ tipo: 'erro', msg: error.message });
    }
  };
  
  return (
    <div className="checkin">
      <input
        type="text"
        placeholder="Digite o CPF"
        value={cpf}
        onChange={(e) => setCpf(e.target.value)}
        autoFocus
      />
      <button onClick={handleCheckIn}>Registrar Entrada</button>
      {resultado && (
        <div className={`alerta alerta-${resultado.tipo}`}>
          {resultado.msg}
        </div>
      )}
    </div>
  );
}
```

---

### 2.3 Módulo M03 — Financeiro e Mensalidades

#### **Backend** (Spring Boot)

```java
class Pagamento {
  Long id;
  Long matriculaId;
  BigDecimal valor;
  String forma;  // Dinheiro, Débito, Crédito, PIX
  LocalDate data;
  String status;  // Pendente, Confirmado, Recusado
}

class FinanceiroService {
  Pagamento registrarPagamento(PagamentoDTO dto) {
    Matricula mat = matriculaRepository.findById(dto.matriculaId)
      .orElseThrow(() -> new MatriculaNaoEncontradaException());
    
    Pagamento pag = new Pagamento(dto);
    pagamentoRepository.save(pag);
    
    // Atualizar status da matrícula se quitado
    if (verificarQuitacao(mat)) {
      mat.setStatus("ATIVO");
      matriculaRepository.save(mat);
    }
    
    return pag;
  }
  
  boolean verificarQuitacao(Matricula mat) {
    // Verificar se todas as parcelas foram pagas
    return pagamentoRepository.countPendendosPor(mat.getId()) == 0;
  }
}
```

#### **Database** (PostgreSQL)

```sql
-- V005__criar_tabela_pagamento.sql
CREATE TABLE pagamento (
  id BIGSERIAL PRIMARY KEY,
  matricula_id BIGINT NOT NULL REFERENCES matricula(id),
  valor NUMERIC(10,2) NOT NULL,
  forma VARCHAR(30) NOT NULL,  -- Dinheiro, Débito, Crédito, PIX
  data DATE NOT NULL,
  status VARCHAR(30) NOT NULL,  -- Pendente, Confirmado, Recusado
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pagamento_matricula ON pagamento(matricula_id);
CREATE INDEX idx_pagamento_data ON pagamento(data);

-- V006__view_inadimplencia.sql
CREATE OR REPLACE VIEW inadimplencia_por_unidade AS
SELECT
  u.id AS unidade_id,
  u.nome AS unidade,
  COUNT(DISTINCT m.id) AS alunos_inadimplentes,
  COALESCE(SUM(m.data_venc * 1.0), 0) AS valor_em_atraso
FROM
  unidade u
  LEFT JOIN matricula m ON u.id = m.unidade_id AND m.status = 'INADIMPLENTE'
GROUP BY u.id, u.nome;
```

---

## 3. Arquitetura de Segurança

### 3.1 Autenticação (JWT)

```
┌─────────────────────────────────────────────────┐
│ Login (usuário + senha)                         │
└──────────────────┬──────────────────────────────┘
                   │
          ┌────────▼─────────┐
          │ Validar no BD    │
          │ Verificar Hash   │ (bcrypt)
          └────────┬─────────┘
                   │
    ┌──────────────▼──────────────┐
    │ Gerar JWT Token             │
    │ {alunoid, role, exp, sign}  │
    └──────────────┬──────────────┘
                   │
           ┌───────▼────────┐
           │ Retornar Token │
           └───────┬────────┘
                   │
        ┌──────────▼────────────┐
        │ Cliente armazena JWT  │
        │ (localStorage)        │
        └──────────┬────────────┘
                   │
        ┌──────────▼──────────────┐
        │ Próximas chamadas       │
        │ Authorization: Bearer.. │
        └──────────┬──────────────┘
                   │
        ┌──────────▼──────────────┐
        │ Interceptor valida JWT  │
        │ Se válido → aceita      │
        │ Se expirado → refresh   │
        │ Se inválido → logout    │
        └─────────────────────────┘
```

### 3.2 Controle de Acesso (RBAC)

```java
// Spring Security + Roles
@RestController
@RequestMapping("/api/v1/alunos")
class AlunoController {
  
  @PostMapping
  @PreAuthorize("hasRole('PROPRIET') or hasRole('COORDENADOR')")
  ResponseEntity<AlunoDTO> criarAluno(@RequestBody AlunoCadastroDTO dto) {
    // Só proprietário ou coordenador pode criar aluno
  }
  
  @GetMapping
  @PreAuthorize("hasRole('PROPRIET') or hasRole('COORDENADOR') or hasRole('ATENDENTE')")
  ResponseEntity<Page<AlunoDTO>> listarAlunos() {
    // Qualquer um pode listar (com filtros por unidade)
  }
}

// Interceptor para logs de auditoria
@Component
class AuditoriaInterceptor {
  void intercept(HttpRequest request, HttpResponse response, Object principal) {
    auditariaRepository.save(new Auditoria(
      usuario: principal.getUsername(),
      acao: request.getMethod() + " " + request.getPath(),
      timestamp: now(),
      status: response.getStatus()
    ));
  }
}
```

---

## 4. Fluxo de Implementação Recomendado

### **Sprint 1** — Fundação

```
Semana 1:
├─ Database setup (PostgreSQL)
├─ Entity Aluno + Migration V001, V002
├─ Repository + Service
├─ Controller + API /alunos
├─ Testes unitários
└─ Validações backend

Semana 2:
├─ Autenticação JWT
├─ Spring Security setup
├─ Page Login (React)
├─ Service de autenticação
└─ Interceptor de autorização
```

### **Sprint 2** — Acesso

```
Semana 3:
├─ RegistroAcesso Entity
├─ Check-in Procedure (PostgreSQL)
├─ API /acesso/registrar
├─ Page CheckIn (React)
└─ Testes de integração

Semana 4:
├─ Bloqueio automático
├─ Scheduler de inadimplência
├─ Painel de acesso
└─ Relatório de frequência
```

### **Sprint 3** — Financeiro

```
Semana 5-6:
├─ Pagamento Entity + Endpoints
├─ Calculadora de juros/multa
├─ Panel de Inadimplência
├─ Relatório de fluxo de caixa
└─ Dashboard simplificado
```

---

## 5. Stack Técnico Detalhado

### 5.1 Frontend (React)

```
src/
├── components/
│   ├── common/
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   └── Footer.jsx
│   ├── forms/
│   │   ├── CadastroAluno.jsx
│   │   ├── PagamentoForm.jsx
│   │   └── LoginForm.jsx
│   └── pages/
│       ├── Dashboard.jsx
│       ├── CheckIn.jsx
│       ├── Financeiro.jsx
│       └── Relatórios.jsx
├── services/
│   ├── api.js (Axios instance com JWT)
│   ├── AlunoService.js
│   ├── AcessoService.js
│   ├── FinanceiroService.js
│   └── AuthService.js
├── models/
│   ├── Aluno.js
│   ├── Matricula.js
│   └── Pagamento.js
├── hooks/
│   ├── useAuth.js
│   ├── useFetch.js
│   └── useForm.js
├── utils/
│   ├── validators.js
│   ├── formatters.js
│   └── constants.js
└── App.jsx

Dependencies:
- react-router-dom (routing)
- axios (HTTP)
- react-hook-form (forms)
- zustand (state management)
- tailwindcss (styling)
- vitest (testing)
```

### 5.2 Backend (Spring Boot)

```
src/main/java/com/forcatotal/
├── config/
│   ├── SecurityConfig.java
│   └── WebConfig.java
├── controller/
│   ├── AlunoController.java
│   ├── AcessoController.java
│   ├── FinanceiroController.java
│   └── AuthController.java
├── service/
│   ├── AlunoService.java
│   ├── AcessoService.java
│   ├── FinanceiroService.java
│   └── AuthService.java
├── repository/
│   ├── AlunoRepository.java
│   ├── AcessoRepository.java
│   ├── PagamentoRepository.java
│   └── UsuarioRepository.java
├── entity/
│   ├── Aluno.java
│   ├── Matricula.java
│   ├── RegistroAcesso.java
│   └── Pagamento.java
├── dto/
│   ├── AlunoCadastroDTO.java
│   ├── AlunoDTO.java
│   ├── PagamentoDTO.java
│   └── ErrorDTO.java
├── security/
│   ├── JwtTokenProvider.java
│   ├── JwtAuthenticationFilter.java
│   └── CustomUserDetailsService.java
├── exception/
│   ├── AlunoNaoEncontradoException.java
│   ├── CadastroException.java
│   └── GlobalExceptionHandler.java
└── ForcaTotalApplication.java

Dependencies (pom.xml):
- spring-boot-starter-web
- spring-boot-starter-data-jpa
- spring-boot-starter-security
- postgresql driver
- flyway (migrations)
- jjwt (JWT)
- lombok (code generation)
- junit5 (testing)
```

### 5.3 Database (PostgreSQL)

```
Migration Directory:
db/migration/
├── V001__criar_tabela_aluno.sql
├── V002__criar_tabela_matricula.sql
├── V003__criar_tabela_acesso.sql
├── V004__criar_tabela_pagamento.sql
├── V005__criar_tabela_usuario.sql
├── V006__criar_tabela_auditoria.sql
└── V00X__procedure_bloquear_inadimplentes.sql

Índices principais:
- aluno(cpf) UNIQUE
- matricula(aluno_id, unidade_id)
- registro_acesso(aluno_id, data_hora)
- pagamento(matricula_id, data)

Constraints:
- FK integridade referencial
- CHECK para enums (status)
- NOT NULL para campos obrigatórios
```

---

## 6. Testes e Qualidade

### 6.1 Strategy de Testes

```
Backend (Spring Boot):
├── Unit Tests (Service layer)
│   └── Validações de negócio
├── Repository Tests
│   └── Queries complexas
├── Integration Tests
│   └── Controller + Service + BD
└── E2E Tests (optional)
    └── Fluxos completos

Frontend (React):
├── Component Tests
│   └── Rendering, eventos
├── Hook Tests
│   └── useAuth, useFetch
├── Service Tests
│   └── API calls (mocked)
└── E2E Tests
    └── Selenium/Cypress
```

### 6.2 Pilar de Qualidade

```
Code Coverage:
- Backend: ≥ 70%
- Frontend: ≥ 60%

Performance:
- API response: < 500ms (P95)
- React render: < 100ms (P95)
- Database query: < 200ms (P95)

Security:
- Sem SQL Injection
- Sem XSS vulnerabilities
- Sem secrets em código
- JWT válido e rotação

Maintainability:
- Code review obrigatório
- Lint/Prettier enforce
- Documentação atualizada
- Sem código duplicado
```

---

## 7. Deployment e DevOps

### 7.1 Ambientes

```
DEV (Local)
├── Docker Compose (PostgreSQL)
├─ Frontend: npm start (http://localhost:3000)
└─ Backend: IDE ou mvn spring-boot:run

STAGING
├─ Kubernetes cluster
├─ PostgreSQL RDS
├─ Domain: staging.forcatotal.com
└─ SSL/TLS certificados

PRODUCTION
├─ Kubernetes cluster
├─ PostgreSQL RDS com backup
├─ Domain: app.forcatotal.com
├─ CDN para assets estáticos
└─ Monitoring + Alertas
```

### 7.2 CI/CD Pipeline

```
GitHub/GitLab Push
  ↓
1. Run Tests (Jest + JUnit)
  ↓
2. Lint (ESLint + SonarQube)
  ↓
3. Build (React + Spring Boot JAR)
  ↓
4. Build Docker Images
  ↓
5. Push to Registry (Docker Hub)
  ↓
6. Deploy to Staging (automatic)
  ↓
7. Run Smoke Tests
  ↓
8. Manual Approval
  ↓
9. Deploy to Production
```

---

## Encerramento

Este documento define a **arquitetura completa** do sistema, estruturando:
- ✅ Camadas (Frontend, Backend, Database)
- ✅ Padrões arquiteturais (MVC, REST, Repository)
- ✅ Decomposição modular por componentes
- ✅ Stack técnico detalhado (React + Spring Boot + PostgreSQL)
- ✅ Fluxo de implementação (sprints)
- ✅ Segurança (JWT + RBAC)
- ✅ Testes e qualidade
- ✅ DevOps (CI/CD, ambientes)

**Próximo passo**: Iniciar **Fase 2** com geração de **SPECs** para cada fluxo crítico.
