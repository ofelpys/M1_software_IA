# FASE 3 — PLANNING (Decisões Técnicas)

> **Data Início**: 3 de abril de 2026  
> **Duração Estimada**: 1 semana de trabalho intenso  
> **Status**: 🟢 **INICIADA AGORA**  
> **Objetivo**: Converter 8 SPECs em 3 PLANs técnicos detalhados

---

## 📋 Visão Geral da Fase 3

### O que é Fase 3?

Enquanto **Fase 2 (SPECs)** responde "*Como o negócio funciona?*", **Fase 3 (PLANs)** responde "*Como implementar no código?*"

```
SPEC-001 (Negócio)              PLAN-001 (Implementação)
  "Recepcionista faz            "Criar tabelas:
   check-in de aluno"      →    - ALUNO (id, cpf, nome, ...)
                                - MATRICULA (id, aluno_id, ...)
                                - REGISTRO_ACESSO (aluno_id, timestamp, ...)
                                
                                Criar endpoints:
                                - POST /api/alunos
                                - GET /api/alunos/{id}
                                - POST /api/acesso/checkin
                                
                                Criar componentes React:
                                - CadastroAlunoForm
                                - CheckInPage"
```

### Entradas (Do que dispomos)

```
✅ 8 SPECs prontas (SPEC-001 a SPEC-008)
✅ 70 RFs documentadas
✅ Matriz de Rastreabilidade (RF → Tabelas)
✅ Constitution com decisões críticas
✅ Modelo Conceitual de Dados (20+ entidades)
✅ Glossário de 50+ termos
```

### Saídas (O que vamos produzir)

```
📄 PLAN-001: Database + API (Cadastro/Acesso)
   ├─ DDL SQL (20+ tabelas)
   ├─ Migrations Flyway (V001 até V010)
   ├─ Procedures/Functions em PL/pgSQL
   ├─ Índices + Constraints
   ├─ 25+ Endpoints REST
   ├─ DTOs Request/Response
   ├─ Validações (2 camadas)
   └─ ~800 linhas de documentação

📄 PLAN-002: Database + API (Financeiro)
   ├─ 8 tabelas + 2 VIEWs
   ├─ Triggers automáticos (cálculo juros, bloqueio)
   ├─ 18 endpoints REST
   ├─ Cálculos comissão professores
   ├─ Validações financeiras
   └─ ~700 linhas

📄 PLAN-003: Database + API (Relatórios)
   ├─ 5 VIEWs agregadas
   ├─ 12 endpoints de relatório
   ├─ Query performance tuning
   ├─ Component structure (React)
   └─ ~600 linhas

📄 PLAN-004-008: Planejados (não nesta conversa)
   └─ Estrutura similar aos 3 anteriores
```

---

## 🎯 Tarefas Principais da Fase 3

### Tarefa 1️⃣: PLAN-001 — Database & API (Cadastro/Acesso)

> **Tempo Estimado**: 8-10 horas  
> **Entrada**: SPEC-001 + Matriz Rastreabilidade  
> **Saída**: PLAN-001.md (~800 linhas)

#### 1.1 Modelagem de Banco (PostgreSQL)

**Tabelas a Criar**:

```sql
-- Identidade & Roles
TABLE usuario                    → Auth + roles (PROPRIETARIO, COORDENADOR...)
TABLE papel_acesso              → Permissões por papel
TABLE usuario_papel_academia    → Qual papel em qual academia

-- Alunos
TABLE aluno                      → CPF, nome, contato
TABLE matricula                  → Aluno × Plano × Academia × Data
TABLE documento_aluno           → Foto, CPF escaneado (auditoria)

-- Acesso
TABLE registro_acesso           → Timestamp de cada entrada
TABLE bloqueio_acesso           → Log de tentativas bloqueadas
TABLE configuracao_acesso       → Regras por academia

-- Auditoria
TABLE auditoria_log             → Quem fez o quê, quando, por quê
TABLE auditoria_aluno_mudança   → Histórico de mudanças
```

**Índices Críticos**:

```sql
CREATE INDEX idx_aluno_cpf ON aluno(cpf) UNIQUE;
CREATE INDEX idx_matricula_aluno_academia ON matricula(aluno_id, academia_id);
CREATE INDEX idx_registro_acesso_aluno_data ON registro_acesso(aluno_id, data_hora);
CREATE INDEX idx_auditoria_timestamp ON auditoria_log(criado_em DESC);
```

**Procedures/Functions em PL/pgSQL**:

```sql
-- Bloqueia acesso se inadimplente
FUNCTION bloquear_se_inadimplente(aluno_id INT) RETURNS BOOLEAN

-- Registra acesso com auditoria
FUNCTION registrar_acesso(aluno_id INT, academia_id INT) RETURNS RECORD

-- Calcula status (ATIVO/BLOQUEADO/VENCIDO)
FUNCTION calcular_status_matricula(matricula_id INT) RETURNS VARCHAR
```

**Migrations Flyway**:

```
V001__criar_tabela_usuario.sql
V002__criar_tabela_aluno.sql
V003__criar_tabela_matricula.sql
V004__criar_tabela_registro_acesso.sql
V005__criar_tabela_auditoria_log.sql
V006__criar_indices.sql
V007__criar_procedures.sql
V008__criar_triggers.sql
V009__popular_dados_iniciais.sql
V010__criar_views_auditoria.sql
```

#### 1.2 API REST (Spring Boot)

**Endpoints**:

```
AUTH
  POST   /api/auth/login                    → Token JWT
  POST   /api/auth/refresh-token            → Refresh token expirado
  POST   /api/auth/logout                   → Logout

ALUNOS
  POST   /api/alunos                        → Criar novo aluno
  GET    /api/alunos/{id}                   → Detalhes aluno
  PUT    /api/alunos/{id}                   → Atualizar aluno
  GET    /api/alunos?academia_id=1          → Listar alunos por academia
  DELETE /api/alunos/{id}                   → Soft delete

MATRÍCULAS
  POST   /api/alunos/{id}/matriculas        → Nova matrícula
  GET    /api/alunos/{id}/matriculas        → Histórico matrículas
  PUT    /api/matriculas/{id}               → Atualizar plano/status
  GET    /api/matriculas/{id}/status        → Status atual (ATIVO/BLOQUEADO/VENCIDO)

ACESSO/CHECK-IN
  POST   /api/acesso/checkin                → Register entrada
  GET    /api/acesso/historico/{aluno_id}   → Histórico de acessos
  GET    /api/acesso/bloqueados             → Lista alunos bloqueados

AUDITORIA
  GET    /api/auditoria/aluno/{id}          → Histórico mudanças aluno
  GET    /api/auditoria/acesso/{aluno_id}   → Histórico tentativas acesso
```

**DTOs (Request/Response)**:

```java
// Request
class CadastroAlunoRequest {
  String nome;
  String cpf;
  String email;
  String telefone;
  LocalDate dataNascimento;
  Integer academiaPrincipal;
  String plano; // "BRONZE", "PRATA", "OURO"
}

// Response
class AlunoResponse {
  Long id;
  String cpf;
  String nome;
  String email;
  StatusMatricula status;
  LocalDateTime dataMatricula;
  LocalDateTime dataVencimento;
  List<RegistroAcessoResponse> ultimosAcessos;
}

// Check-in Request
class CheckInRequest {
  String cpf;  // ou aluno_id
  Integer academiaSaida;  // qual academia (para multi-unidade)
  LocalDateTime timestamp;
}

// Check-in Response
class CheckInResponse {
  Boolean acessoLiberado;
  String motivo; // "OK", "INADIMPLENTE", "MATRÍCULA_VENCIDA"
  AlunoResponse aluno;
  LocalDateTime registroTiempo;
}
```

**Validações (2 Camadas)**:

Frontend (React):
```javascript
// Real-time validation
validateCPF(cpf) → Verifica formato 000.000.000-00
validateEmail(email) → RFC 5322
validatePhone(phone) → (XX) XXXXX-XXXX
```

Backend (Spring Boot):
```java
// Security validation
@NotBlank String cpf;
@Valid @Email String email;
@Valid String telefone;

// Business logic validation
if (repository.findByCpf(cpf).isPresent()) 
  throw new CPFJaExisteException();
  
if (!isDataVencimentoValida(dataVencimento)) 
  throw new DataVencimentoInvalidaException();
```

#### 1.3 React Components

```javascript
// Pages
- CadastroAlunoPage.jsx
  ├─ Form com 6 campos
  ├─ Validação real-time CPF
  ├─ Seletor de plano (dropdown)
  └─ Confirmação (modal)

- CheckInPage.jsx
  ├─ Input CPF + button "Verificar"
  ├─ Display status (VERDE = liberado, VERMELHO = bloqueado)
  ├─ Histórico últimas entradas (tabela)
  └─ Timestamp automático

- HistoricoAcessoPage.jsx
  ├─ Tabela com filtros (data, aluno, academia)
  ├─ Download CSV/PDF
  └─ Gráfico de frequência (linha temporal)

- AuditoriaPage.jsx
  ├─ Log completo de mudanças
  ├─ Quem, quando, o quê
  ├─ Differenciar antes → depois
  └─ Busca por data/usuário

// Componentes Reutilizáveis
- CadastroForm.jsx
- StatusBadge.jsx (ATIVO/BLOQUEADO/etc)
- DataTable.jsx (genérico)
- ExportButton.jsx (PDF/CSV)
```

#### 1.4 Security & RBAC

```
Roles:
  - PROPRIETARIO   → Acesso total
  - COORDENADOR    → Acesso por academia
  - RECEPCIONISTA  → Apenas check-in + básico aluno
  - PROFESSOR      → Apenas próprios dados

JWT payload:
{
  "sub": "userid",
  "roles": ["RECEPCIONISTA"],
  "academia_ids": [1, 2],  // Mulitenant
  "iat": 1234567890,
  "exp": 1234567890
}
```

---

### Tarefa 2️⃣: PLAN-002 — Database & API (Financeiro)

> **Tempo Estimado**: 8-10 horas  
> **Entrada**: SPEC-002 + DUV-03 resolvida (modelo comissão)  
> **Saída**: PLAN-002.md (~700 linhas)

#### 2.1 Modelagem de Banco

**Tabelas**:

```sql
TABLE pagamento              → Registro de pagamento + forma
TABLE inadimplencia          → Controle de atrasos
TABLE comissao_calculo       → Comissão professor (mensal)
TABLE comissao_pagamento     → Histórico pagamento comissão
TABLE configuracao_financeira → Taxas, juros, percentuais
```

**VIEWs**:

```sql
VIEW inadimplencia_atual           → Alunos atrasados HOJE
VIEW fluxo_caixa_mensal            → Entrada/saída por dia
VIEW comissoes_a_pagar             → Comissões pendentes
VIEW renda_por_academia            → Consolidado 5 academias
VIEW alunos_em_risco               → Análise de retenção
```

#### 2.2 API REST

```
PAGAMENTOS
  POST   /api/pagamentos                   → Registrar pagamento
  GET    /api/pagamentos?periodo=2026-04   → Listar pagamentos
  PUT    /api/pagamentos/{id}              → Ajuste manual
  DELETE /api/pagamentos/{id}              → Estorno

INADIMPLÊNCIA
  GET    /api/inadimplencia                → Lista completa
  GET    /api/inadimplencia/{aluno_id}     → Detalhes por aluno
  POST   /api/inadimplencia/{id}/reverter  → Quitar atraso

COMISSÕES
  GET    /api/professores/{id}/comissao    → Comissão prevista
  GET    /api/comissoes/mensal?mes=04      → Comissões do mês
  POST   /api/comissoes/aprovar            → Marcar como aprovada
  POST   /api/comissoes/pagar              → Registrar pagamento

RELATÓRIOS
  GET    /api/financeiro/dashboard         → KPIs financeiros
  GET    /api/financeiro/fluxo-caixa       → Fluxo de caixa
```

#### 2.3 Business Rules (Triggers)

```sql
-- Quando pagamento registrado → atualizar MATRICULA status
TRIGGER pagamento_recebido AFTER INSERT ON pagamento
  → IF valor >= minimo THEN SET matricula.status = 'ATIVO'
  → UPDATE inadimplencia.data_quitacao

-- Quando matrícula fica 3 dias em atraso → TRIGGER bloqueia
TRIGGER bloquear_inadimplentes DAILY (scheduler)
  → Para cada aluno com data_vencimento < TODAY - 3 dias
  → SET matricula.status = 'BLOQUEADO'
  → INSERT auditoria_log (motivo = 'BLOQUEIO_AUTOMÁTICO')

-- Comissão do professor (5º dia de cada mês)
FUNCTION calcular_comissoes_mensais(mes DATE)
  → Para cada professor
  → SELECT COUNT alunos_ativos
  → comissao = alunos × (vla) × percentual
  → INSERT comissao_calculo
```

---

### Tarefa 3️⃣: PLAN-003 — Database & API (Relatórios)

> **Tempo Estimado**: 6-8 horas  
> **Entrada**: SPEC-003 + VIEWs de PLAN-001 e PLAN-002  
> **Saída**: PLAN-003.md (~600 linhas)

#### 3.1 Relatórios & VIEWs

```sql
-- Dashboard KPIs (tempo real)
VIEW dashboard_kpis AS
  SELECT 
    COUNT(DISTINCT a.aluno_id) as total_alunos,
    COUNT(DISTINCT CASE WHEN m.status='ATIVO') as alunos_ativos,
    COUNT(DISTINCT CASE WHEN m.status='BLOQUEADO') as alunos_bloqueados,
    SUM(p.valor) FILTER (MONTH = atual) as receita_mes,
    COUNT(DISTINCT i.aluno_id) as alunos_inadimplentes
  FROM aluno a
  LEFT JOIN matricula m
  LEFT JOIN pagamento p
  LEFT JOIN inadimplencia i;

-- Relatório de Frequência
VIEW frequencia_alunos AS
  SELECT 
    a.id, a.nome,
    COUNT(ra.id) as total_acessos,
    MAX(ra.data_hora) as ultimo_acesso,
    (COUNT(ra.id) * 100 / 30.0) as frequencia_percentual
  FROM aluno a
  LEFT JOIN registro_acesso ra
  GROUP BY a.id, a.nome;
```

#### 3.2 API REST

```
RELATÓRIOS
  GET    /api/relatorios/dashboard         → KPIs executivo
  GET    /api/relatorios/inadimplencia     → Detalhado
  GET    /api/relatorios/frequencia        → Frequência alunos
  GET    /api/relatorios/comissoes         → Comissões professores
  GET    /api/relatorios/renda-academia    → Por unidade
  GET    /api/relatorios/export?format=pdf → Download PDF/Excel

FILTROS
  ?academia_id=1
  ?data_inicio=2026-04-01&data_fim=2026-04-30
  ?status=BLOQUEADO
  ?ordenar=frequencia_desc
```

#### 3.3 React Componentes

```javascript
// Dashboard Executivo
- DashboardPage.jsx
  ├─ Cards com KPIs (alunos, receita, inadimplência)
  ├─ Gráfico linha (receita último 12 meses)
  ├─ Gráfico pizza (distribuição por academia)
  ├─ Tabela de inadimplentes (topo 10)
  └─ Atualiza cada 5 min

// Relatórios Detalhados
- RelatorioPorAluno.jsx
- RelatorioFrequencia.jsx
- RelatorioComissoes.jsx

// Export
- BotaoExport.jsx
  ├─ Download PDF (jsPDF)
  ├─ Download Excel (xlsx)
  └─ Copiar CSV (clipboard)
```

---

## 📂 Estrutura de Arquivos (Fase 3)

```
M1/docs/requisitos/05-plans/
  ├─ PLAN-001-cadastro-acesso.md        (800 linhas)
  ├─ PLAN-002-financeiro.md              (700 linhas)
  ├─ PLAN-003-relatorios.md              (600 linhas)
  └─ PLAN-004-008-placeholder.md         (TBD)

M1/backend/
  ├─ pom.xml                             (Deps SpringBoot + PostgreSQL)
  └─ src/main/resources/
      └─ db/migration/
          ├─ V001__criar_usuario.sql
          ├─ V002__criar_aluno.sql
          ├─ V003__criar_matricula.sql
          ├─ V004__criar_registro_acesso.sql
          ├─ V005__criar_indices.sql
          └─ ...

M1/frontend/
  ├─ src/pages/
  │  ├─ CadastroAlunoPage.jsx
  │  ├─ CheckInPage.jsx
  │  ├─ DashboardPage.jsx
  │  └─ ...
  └─ src/components/
     ├─ forms/CadastroForm.jsx
     ├─ common/StatusBadge.jsx
     └─ ...
```

---

## 🔄 Workflow de Execução

```
DIA 1 (Segunda): PLAN-001 Database
  ├─ Desenhar ERD (Tabelas + Relacionamentos)
  ├─ Escrever DDL SQL (em documento)
  ├─ Validar com Matriz Rastreabilidade
  └─ Revisar procedures

DIA 1 (Tarde): PLAN-001 API + Components
  ├─ Documentar 25 endpoints
  ├─ Escrever DTOs
  ├─ Validações
  └─ React structure

DIA 2: PLAN-002 Financeiro
  ├─ Database (triggers, VIEWs)
  ├─ API endpoints (18 endpoints)
  ├─ Business rules
  └─ Comissão automática

DIA 3: PLAN-003 Relatórios
  ├─ VIEWs agregadas
  ├─ Dashboard KPIs
  ├─ React components
  └─ Export PDF/Excel

DIA 4: Review & Consolidação
  ├─ Cross-check entre os 3 PLANs
  ├─ Validar rastreabilidade (PLAN → SPEC → RF)
  ├─ Atualizar decision-log
  ├─ Revisar com tech lead
  └─ Aprovar Go → Fase 4
```

---

## ✅ Critérios de Aceição (Fase 3 Completa)

```
☑ PLAN-001 escrito (≥800 linhas)
  ├─ 20+ tabelas mapeadas
  ├─ 10+ migrations planejadas
  ├─ 25 endpoints documentados
  ├─ DTOs completos
  └─ Security/RBAC definido

☑ PLAN-002 escrito (≥700 linhas)
  ├─ Tabelas financeiras
  ├─ VIEWs de inadimplência
  ├─ Triggers implementados
  ├─ 18 endpoints documentados
  └─ Comissão automática

☑ PLAN-003 escrito (≥600 linhas)
  ├─ VIEWs dashboards
  ├─ 12 endpoints relatorios
  ├─ React components documentados
  └─ Export PDF/Excel especificado

☑ Cross-validation
  ├─ 100% RFs rastreáveis a PLANs
  ├─ Zero conflitos entre PLANs
  ├─ Migrations sequenciadas
  └─ Security consistente

☑ Documentação
  ├─ decision-log atualizado
  ├─ TODO tasks criadas para Fase 4
  ├─ Architecture diagram (Mermaid)
  └─ README de setup (PostgreSQL + Spring + React)

☑ Aprovação
  ├─ Tech lead review + OK
  ├─ Proprietário (Jonathan) notificado
  └─ Go → Fase 4 (Prototyping)
```

---

## 📊 Cronograma Estimado

```
Semana de 3-7 de abril

MON 3 abr:  Fase 3 kickoff + PLAN-001 database       (8h)
TUE 4 abr:  PLAN-001 API + components                (8h)
WED 5 abr:  PLAN-002 financeiro                      (8h)
THU 6 abr:  PLAN-003 relatórios                      (8h)
FRI 7 abr:  Review + consolidação + próximos passos (4h)

TOTAL: 36 horas ≈ 1 dev full-time + 1 DBA part-time
```

---

## 🎯 Próximos Passos Após Fase 3

```
→ Fase 4 (Prototyping):
  ├─ HTML mockups (index.html, login, dashboard)
  ├─ React stubs (componentes vazios)
  ├─ Navigation wireframes
  └─ 3-5 dias de trabalho

→ Fase 5 (Development):
  ├─ Backend real (Spring Boot + migrations)
  ├─ Frontend real (React components + state mgmt)
  ├─ Tests (JUnit5 + Jest ≥80% coverage)
  ├─ Integration & E2E
  └─ 4-6 semanas, 4-5 devs
```

---

**Pronto para começar PLAN-001?** Quer que comecemos com o database schema?
