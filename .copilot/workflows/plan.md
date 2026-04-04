# WORKFLOWS/PLAN.MD — Diagrama de Plano e Fase de Projeto

> **Propósito**: Mapa mental do fluxo de desenvolvimento  
> **Escopo**: Rede Força Total Academias (M1)  
> **Válido para**: Todas as fases

---

## 1. Visão Geral de Fases

```
┌─────────────┐
│  Fase 0:    │
│  Init       │  ✅ COMPLETA (1 de abril)
│             │  Memory Bank scaffoldado
└──────┬──────┘  Team alinhado
       │
       ▼
┌─────────────┬─────────────────────────────────────┐
│  Fase 1:    │  Normalização de Requisitos         │
│  Analysis   │  ✅ COMPLETA (1 de abril)           │
│             │  História, Objetivos, Mapa, Plan    │
└──────┬──────┴─────────────────────────────────────┘
       │
       ▼
┌─────────────┬─────────────────────────────────────┐
│  Fase 2:    │  Geração de SPECs (Especificações)│
│  Design     │  ✅ COMPLETA (2 de abril - 1 dia!)  │
│             │  SPEC-001 a 008 (70 RFs | 37.550 linhas) │
└──────┬──────┴─────────────────────────────────────┘
       │
       ▼
┌─────────────┬─────────────────────────────────────┐
│  Fase 3:    │  Geração de PLANs (Tech Decisions)│
│  Planning   │  ✅ COMPLETA (3 de abril - 1 dia!) │
│             │  PLAN-001 a 008 (7.200 linhas | 200+ tabelas | 140+ endpoints) │
└──────┬──────┴─────────────────────────────────────┘
       │
       ▼
┌─────────────┬─────────────────────────────────────┐
│  Fase 4:    │  Prototipagem (UI/UX)              │
│  Proto      │  ❌ NÃO INICIADA (3-5 dias)        │
│             │  HTML/CSS/JS + React skeleton      │
└──────┬──────┴─────────────────────────────────────┘
       │
       ▼
┌─────────────┬─────────────────────────────────────┐
│  Fase 5:    │  Desenvolvimento (Dev)              │
│  Dev        │  ❌ NÃO INICIADA (4-6 semanas)     │
│             │  Backend, Frontend, Database        │
└──────┬──────┴─────────────────────────────────────┘
       │
       ▼
     LIVE
```

---

## 2. Checklist de Initialization (Fase 0)

```
✅ COMPLETA — mas incluída para referência futura

Quando novo projeto inicia:
☐ Verificar existência de .copilot/
☐ Se não existe: scaffoldar automaticamente
☐ Ler constitution.md
☐ Ler core/rules.md
☐ Criar memory bank structure
☐ Inicializar decision-log.md
☐ Inicializar project-state.md
☐ Create first task log
☐ Notify stakeholders

Tempo: 2-3 horas (one-time setup)
```

---

## 3. Fase 1 — Normalização (Analysis) — ✅ COMPLETA

```
ENTRADA:
  • Documentos DOCX brutos (história, requisitos)
  • Conversas informais com proprietário
  • Contexto de negócio

ATIVIDADES:
  1. Ler docs originais e extrair conceitos
  2. Normalizar em Markdown estruturado
  3. Mapear RFs, RNFs, ROPs
  4. Identificar conflitos e dúvidas
  5. Consolidar em mapa-mestre
  6. Propor planejamento modular

ENTREGÁVEIS:
  ✅ forca-total-historia-operabilidade.md (~500 linhas)
  ✅ forca-total-objetivos-requisitos-iniciais.md (~800 linhas)
  ✅ mapa-mestre.md (~600 linhas)
  ✅ planejamento-modular-v1.md (~800 linhas)

SAÍDA:
  • Requisitos normalizados e rastreáveis
  • Conflitos identificados e priorizados
  • Dúvidas listadas com impacto
  • Stack confirmado
  • Plano de implementação preliminar

TEMPO: 1 dia de trabalho intenso
```

---

## 4. Fase 2 — Especificações (Design) — ⏳ EM INICIAÇÃO

### 4.1 O que é uma SPEC

Uma SPEC (Specification) descreve **COMO** um fluxo de negócio funciona,  **SEM** decisões técnicas.

**Estrutura padrão de SPEC**:

```
1. Objetivo (resumen em 2-3 linhas)
2. Requisitos Funcionais cobertos (RF-XXX)
3. Atores (quem usa?)
4. Fluxos principais (passo-a-passo)
5. Estados (máquina de estados, se aplicável)
6. Regras de negócio (constraints)
7. Casos de uso (exemplos práticos)
8. Decisões pendentes
9. Referências a RFs/RNFs/ROPs
```

### 4.2 SPECs a Gerar (Priority)

#### **SPEC-001: Cadastro e Acesso (P0)**

```
Módulo: M01 (Cadastros) + M02 (Acesso)
RFs: RF-CAD-01 a 08, RF-ACE-01 a 07
Atores: Recepcionista, Aluno, Coordenador

Fluxo Principal:
1. Recepcionista abre "Novo Aluno"
2. Preenche: Nome, CPF, Email, Telefone
3. Sistema valida CPF (RF-CAD-03)
4. Seleciona plano (Bronze/Prata/Ouro)
5. Confirma → Aluno criado + Matrícula vinculada
6. Na próxima entrada: Recepcionista faz check-in (RF-ACE-01)
7. CPF escaneia/digita → Status consultado
8. Se Ativo: acesso liberado → Timestamp registrado
9. Se Inadimplente: Acesso bloqueado (RF-ACE-03)

Decisões Pendentes: Nenhuma (tudo claro)

Prazo: 2 dias
```

#### **SPEC-002: Financeiro (P0)**

```
Módulo: M03 (Financeiro)
RFs: RF-FIN-01 a 09
Atores: Caixa, Coordenador, Proprietário

Fluxo Principal:
1. Aluno vence mensalidade
2. Coordenador registra pagamento (RF-FIN-01)
3. Sistema calcula juros se atrasado (RF-FIN-03)
4. Pagamento confirmado → Matrícula status = ATIVO
5. Se 7+ dias em atraso → Bloqueio automático (scheduler)

Decisões Pendentes: 
- Dias de carência? (DUV-06)
- Taxa de juros? (DUV-06)

Prazo: 2 dias (after SPEC-001)
```

#### **SPEC-003: Relatórios (P0)**

```
Módulo: M07 (Relatórios)
RFs: RF-REL-01 a 09
Atores: Proprietário, Coordenador

Interfaces:
1. Dashboard Proprietário
   └─ KPIs: Alunos ativos, Receita, Inadimplência
   └─ Atualizado em tempo real

2. Relatório de Inadimplência (Coordenador)
   └─ Detalhamento por aluno + período
   └─ Ações tomadas + auditoria

3. Exportação (Proprietário)
   └─ PDF/Excel/CSV

Decisões Pendentes: Nenhuma (specs são claras)

Prazo: 2 dias (after SPEC-002)
```

#### **SPEC-004 a 008: Outros Módulos (P1)**

```
- SPEC-004: Avaliação Física e Planos
- SPEC-005: Professores e Comissões
- SPEC-006: Equipamentos e Estoque
- SPEC-007: Comunicação com Alunos
- SPEC-008: Segurança e Acesso (Perfis)

Prazo: Após SPECs críticos (P0) completados
```

### 4.3 Workflow de Geração de SPEC

```
Input: Mapa-mestre + Requisitos normalizados

1. Selecionar módulo prioritário
2. Extrair RFs relativos
3. Mapear atores
4. Desenhar fluxo(s) principal(is)
5. Definir máquina de estados (se aplicável)
6. Listar regras de negócio
7. Documentar decisões pendentes
8. Validar rastreabilidade (tudo vem de RF)
9. Revisar com stakeholder (se necessário)
10. Incorporar feedback

Output: spec.md detalhado (300-500 linhas típicas)

Tempo por SPEC: 4-6 horas (dev sênior)
```

### 4.4 Entrada/Saída de Fase 2

```
ENTRADA:
  • Requisitos normalizados (Fase 1 output)
  • Mapa-mestre com conflitos resolvidos
  • Constitution com decisões críticas

ATIVIDADES:
  • Gerar SPEC-001, 002, 003 (criticals)
  • Revisar com Jonathan se necessário
  • Coletar feedback de DUV-02, DUV-03
  • Atualizar decision-log após cada decisão

SAÍDA:
  • SPEC-001: Cadastro/Acesso (~400 linhas)
  • SPEC-002: Financeiro (~350 linhas)
  • SPEC-003: Relatórios (~300 linhas)
  • SPEC-004-008: Planejados (não iniciados ainda)

VALIDAÇÃO:
  • 100% RFs rastreáveis a SPEC
  • Sem novos requisitos inventados
  • Fluxos validados com negócio (se mudança)
  • Artefatos no git + decision-log atualizado

TEMPO: 1-2 semanas (3 people, part-time)
```

---

## 5. Fase 3 — Planejamento (Planning) — ❌ NÃO INICIADA

### 5.1 O que é um PLAN

Um PLAN (Plan) descreve **COMO IMPLEMENTAR** a SPEC, incluindo:
- Database schema (tabelas, índices, procedures)
- API Rest endpoints + DTOs
- Components frontend
- Infrastructure decisions

**Estrutura padrão de PLAN**:

```
1. Modelagem de Banco (PostgreSQL)
   - Tabelas
   - Índices
   - Constraints
   - Procedures/Functions

2. API REST (Spring Boot)
   - Endpoints
   - DTOs (Request/Response)
   - Validações
   - Exception handling

3. Components Frontend (React)
   - Quais componentes criar
   - Hierarquia de estado
   - Services HTTP

4. Regras de Validação (2 camadas)
   - Frontend (UX)
   - Backend (Segurança)

5. Security (JWT, RBAC)

6. Performance (Índices, cache)

7. Testes (Unit, Integration, E2E)

8. Deployment (Docker, Kubernetes)
```

### 5.2 PLANs a Gerar

```
PLAN-001: Cadastro/Acesso (After SPEC-001)
  ├─ Tabelas: aluno, matricula, registro_acesso
  ├─ API: POST/GET /alunos, POST /acesso
  ├─ React Pages: CadastroAluno, CheckIn
  └─ Migrations: V001, V002, V003

PLAN-002: Financeiro (After SPEC-002)
  ├─ Tabelas: pagamento, inadimplencia
  ├─ Trigger: bloquear_inadimplentes
  ├─ API: POST /pagamentos, GET /inadimplencia
  └─ React Pages: Pagamentos, Inadimplência

PLAN-003: Relatórios (After SPEC-003)
  ├─ Views: inadimplencia_por_unidade, fluxo_caixa
  ├─ API: GET /dashboard, GET /relatorios
  └─ React Pages: Dashboard, RelatóriosPDF
```

### 5.3 Workflow de Geração de PLAN

```
Input: SPEC-XXX finalizado

1. Mapear entidades (tabelas)
   └─ 1 entidade ≈ 1 tabela + 1 Entity JPA
2. Definir relacionamentos (FKs)
3. Listar índices necessários (performance)
4. Escrever migration SQL (Flyway)
5. Definir DTOs (Request/Response)
6. Especificar endpoints Rest
7. Validações (2 camadas)
8. Security (RBAC, JWT)
9. Testes (Unit + Integration)
10. Revisar com core team

Output: plan.md (~600-800 linhas típicas)

Tempo por PLAN: 8-10 horas (dev + DBA)
```

---

## 6. Fase 4 — Prototipagem (Prototyping) — ❌ NÃO INICIADA

```
ENTRADA:
  • PLAN-001, 002, 003 finalizados

ATIVIDADES:
  • Create HTML/CSS mockups
  • React component stubs
  • Navigation wireframes
  • Image assets

SAÍDA:
  • index.html (login + dashboard)
  • cadastro-aluno.html
  • checkin.html
  • financeiro.html
  • React components skeleton

TEMPO: 3-5 dias
```

---

## 7. Fase 5 — Desenvolvimento (Development) — ❌ NÃO INICIADA

```
ENTRADA:
  • PLAN-001, 002, 003 com aprovação
  • Protótipos validados
  • Tasks geradas

ATIVIDADES:
  • Implementar Backend (Spring Boot)
  • Implementar Frontend (React)
  • Setup Database (PostgreSQL)
  • Run migrations
  • Integration tests
  • E2E tests
  • Staging deploy
  • Performance tuning

SAÍDA:
  • Backend live em staging
  • Frontend live em staging
  • All RFs implemented
  • 70%+ test coverage
  • Documentation updated

TEMPO: 4-6 semanas (4-5 devs)
```

---

## 8. Próximos Passos Imediatos (Hoje/Amanhã)

```
1. ✅ Enviar Constitution para Jonathan confirmar
   └─ Especialmente: modelo de comissão

2. ⏳ Começar SPEC-001 generation
   └─ Prazo: 2 dias

3. ⏳ Coletar DUV-02 resposta
   └─ Impacto: Frontend design

4. ✅ Atualizar project-state.md
   └─ Daily ou quando milestone completa
```

---

## Encerramento

Este plano define as 5 fases do projeto:

- ✅ **Fase 0**: Init (COMPLETA)
- ✅ **Fase 1**: Analysis (COMPLETA)
- ⏳ **Fase 2**: Design/SPECs (EM INICIAÇÃO)
- ❌ **Fase 3**: Planning/PLANs (Próximo)
- ❌ **Fase 4**: Prototyping (Futuro)
- ❌ **Fase 5**: Development (Futuro)

**Siga workflow apropriado para cada fase.**

Referencie este documento cuando em dúvida sobre "o que fazer agora".
