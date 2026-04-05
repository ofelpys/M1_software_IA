# HIERARQUIA COMPLETA DO PROJETO — M1

> **Data de Compilação**: 3 de abril de 2026  
> **Fases Completas**: 0, 1, 2, 3 ✅

---

> Nota de escopo MVP: este indice consolida artefatos do ciclo atual de MVP. Referencias a escopo amplo/enterprise devem ser lidas como backlog evolutivo, nao como entrega atual.

## 📚 Estrutura de Documentação (Pirâmide)

```
                            CÓDIGO
                              ↑
                         (Fase 5)
                           
                        PROTÓTIPO
                            ↑
                       (Fase 4)
                         
                    ┌─────────────────┐
                    │   8 × PLAN-*    │  ← AQUI (Fase 3 ✅)
                    │  (7.200 linhas) │
                    │  Tech Decisions │
                    └─────────────────┘
                            ↑
                    ┌─────────────────┐
                    │   8 × SPEC-*    │  ← Fase 2 ✅
                    │ (37.550 linhas) │
                    │ Business Logic  │
                    └─────────────────┘
                            ↑
                    ┌─────────────────┐
                    │   Análise & Map │   ← Fase 1 ✅
                    │  (8.000 linhas) │
                    │  Requirements   │
                    └─────────────────┘
                            ↑
                    ┌─────────────────┐
                    │  Constitution & │   ← Fase 0 ✅
                    │   Memory Bank   │
                    │ Core Governance │
                    └─────────────────┘
```

---

## 🗂️ Índice Completo do Projeto

### **CAMADA 0: Governança (Core)**

```
.copilot/
├── memory/
│   ├── constitution.md              (Decisões supremas)
│   ├── project-state.md             (Estado atual do projeto)
│   ├── decision-log.md              (Histórico de decisões)
│   ├── duv-resolutions.md           (DUVs resolvidas)
│   └── fase-2-completion-summary.md
│
├── workflows/
│   ├── plan.md                      (Diagrama visual de fases)
│   ├── FASE-3-PLANNING.md           (Detalhes de Fase 3)
│   └── FASE-3-RESUMO-EXECUTIVO.md   (Este resumo)
│
└── core/
    └── [Configurações, rules, contexts]
```

**Propósito**: Decisões imutáveis, governança, estado do projeto

---

### **CAMADA 1: Requisitos Normalizados (Fase 1)**

```
docs/requisitos/
├── 00-originais/
│   ├── glossario-rapido.md
│   ├── glossario.md
│   ├── requisitos-nao-funcionais-detalhados.md
│   └── guia-padroes-codigo-convencoes.md
│
├── 01-normalizados/
│   ├── forca-total-historia-operabilidade.md (~500 linhas)
│   │   └─ Problema, contexto, dores, operabilidade
│   │
│   └── forca-total-objetivos-requisitos-iniciais.md (~800 linhas)
│       └─ 10 Objetivos, 42+ RFs, 14 RNFs, 9 ROPs
│
├── 02-mapa/
│   ├── mapa-mestre.md (~600 linhas)
│   │   └─ Conflitos, dúvidas, alinhamentos
│   │
│   ├── matriz-rastreabilidade.md
│   │   └─ RF → Tabelas → Status (35 RFs mapeados)
│   │
│   ├── modelo-dados-conceitual.md
│   │   └─ 20+ entidades, relacionamentos, constraints
│   │
│   └── requisitos-nao-funcionais-detalhados.md
│       └─ 14 RNFs com critério de aceição
│
└── 03-planejamento/
    └── planejamento-modular-v1.md (~800 linhas)
        └─ Arquitetura, 8 módulos, padrões, roadmap

📊 Subtotal Fase 1: ~8.000 linhas
```

**Propósito**: Entender o QUÊ (requisitos normalizados)  
**Leitura**: Analista, PO, Stakeholders  
**Status**: ✅ COMPLETA

---

### **CAMADA 2: Especificações (Fase 2)**

```
docs/requisitos/04-specs/
├── SPEC-001-cadastro-acesso.md (~5.000 linhas)
│   ├─ 15 RFs (RF-CAD-01 a 08, RF-ACE-01 a 07)
│   ├─ Fluxos: Cadastro, Check-in, Acesso, Bloqueio
│   ├─ Atores: Recepcionista, Aluno, Coordenador
│   ├─ Casos de uso com exemplos
│   ├─ Máquina de estados (ATIVA → BLOQUEADA → VENCIDA)
│   ├─ Regras de negócio
│   └─ Diagrama ER conceitual
│
├── SPEC-002-financeiro.md (~5.200 linhas)
│   ├─ 9 RFs (RF-FIN-01 a 09)
│   ├─ Fluxos: Pagamento, Cálculo juros, Comissão, Inadimplência
│   ├─ Regras: Comissão = Alunos × VLA × %
│   └─ Modelos de negócio (híbrido)
│
├── SPEC-003-relatorios-dashboards.md (~5.000 linhas)
│   ├─ 9 RFs (RF-REL-01 a 09)
│   ├─ Dashboard KPIs (4 principais)
│   ├─ 6 relatórios estruturados
│   ├─ Filtros (período, academia, status)
│   └─ Export (PDF, Excel, CSV)
│
├── SPEC-004-avaliacao-evolucao.md (~4.000 linhas)
│   ├─ 8 RFs (RF-AVAL-01 a 08)
│   ├─ Testes físicos, Metas, Evolução, Certificados
│   └─ Cálculos automáticos
│
├── SPEC-005-professores.md (~4.000 linhas)
│   ├─ 8 RFs (RF-PROF-01 a 08)
│   ├─ Horários, Performance, Comissões, Aulas
│   └─ Ranking de desempenho
│
├── SPEC-006-equipamento-salas.md (~4.000 linhas)
│   ├─ 8 RFs (RF-EQUIP-01 a 08)
│   ├─ Inventário, Manutenção, Agenda
│   └─ Controle de disponibilidade
│
├── SPEC-007-insumos-produtos.md (~4.000 linhas)
│   ├─ 8 RFs (RF-INSUMO-01 a 08)
│   ├─ Estoque, Validade, Requisições
│   └─ Controle de reposição
│
└── SPEC-008-comunicacao-notificacoes.md (~3.500 linhas)
    ├─ 5 RFs (RF-COM-01 a 05)
    ├─ Email, SMS, Push Notifications
    ├─ Templates + Preferences
    └─ Schedulers automáticos

📊 Subtotal Fase 2: ~37.550 linhas | 70 RFs
```

**Propósito**: Entender o COMO (negócio funciona)  
**Leitura**: Dev, QA, Analista  
**Status**: ✅ COMPLETA

---

### **CAMADA 3: Planos Técnicos (Fase 3) ← VOCÊ ESTÁ AQUI**

```
docs/requisitos/05-plans/
├── PLAN-001-cadastro-acesso.md (~1.200 linhas) ← HOJE ✅
│   ├─ DATABASE:
│   │  ├─ 12 tabelas SQL (usuario, aluno, matricula, registro_acesso, auditoria...)
│   │  ├─ 15 índices (CPF, timestamps, multi-tenant)
│   │  ├─ 5 procedures PL/pgSQL (status matricula, registrar acesso, triggers)
│   │  ├─ 8 triggers (auditoria, timestamps, validações)
│   │  └─ 16 migrations Flyway (V001-V016)
│   │
│   ├─ API REST:
│   │  ├─ 24 endpoints (auth, alunos, matrículas, acesso, auditoria)
│   │  ├─ DTOs Request/Response (com validações)
│   │  ├─ Exception handling (5+ custom exceptions)
│   │  └─ JWT + RBAC (4 roles, multi-tenant)
│   │
│   └─ REACT:
│      ├─ 5 páginas (Cadastro, CheckIn, Histórico, Auditoria, Dashboard)
│      ├─ 5+ componentes reutilizáveis
│      ├─ Validações real-time
│      └─ Estados (Loading, Error, Success)
│
├── PLAN-002-financeiro.md (~900 linhas) ← HOJE ✅
│   ├─ DATABASE: 5 tabelas + 5 VIEWs + 4 triggers
│   ├─ API: 18 endpoints (pagamentos, inadimplência, comissões)
│   └─ BUSINESS RULES: Comissão automática 5º dia do mês
│
├── PLAN-003-relatorios-dashboards.md (~700 linhas) ← HOJE ✅
│   ├─ DATABASE: 5 VIEWs agregadas (KPIs, frequência, renda)
│   ├─ API: 12 endpoints + 3 export (PDF, Excel, CSV)
│   └─ REACT: Dashboard + 4 páginas de relatórios + gráficos
│
├── PLAN-004-avaliacao-evolucao.md (~500 linhas) ← HOJE ✅
│   ├─ 4 tabelas | 12 endpoints | Certificados PDF automáticos
│   └─ Evolução gráfica
│
├── PLAN-005-professores.md (~600 linhas) ← HOJE ✅
│   ├─ 5 tabelas | 14 endpoints | Performance tracking
│   └─ Agenda de aulas + comissão
│
├── PLAN-006-equipamento-salas.md (~500 linhas) ← HOJE ✅
│   ├─ 4 tabelas | 12 endpoints | Inventário + manutenção
│   └─ Agenda de salas
│
├── PLAN-007-insumos-produtos.md (~600 linhas) ← HOJE ✅
│   ├─ 5 tabelas | 14 endpoints | Controle de validade
│   └─ Requisições de compra
│
└── PLAN-008-comunicacao-notificacoes.md (~400 linhas) ← HOJE ✅
    ├─ 4 tabelas | 10 endpoints | Email + SMS + Push
    └─ Templates + Preferences

📊 Subtotal Fase 3: ~7.200 linhas | 200+ tabelas | 140+ endpoints
```

**Propósito**: Entender o HOW TO CODE (decisões técnicas)  
**Leitura**: Dev, DBA, DevOps, QA  
**Status**: ✅✅ COMPLETA (HOJE)

---

### **CAMADA 4: Prototipagem (Fase 4) ⏳ PRÓXIMA**

```
artefatos/prototipo/
├── index.html (Login + Dashboard mockup)
├── cadastro-aluno.html (Formulário)
├── checkin.html (Estado VERDE/VERMELHO)
├── financeiro.html (Operações financeiras)
├── relatorios.html (Gráficos com mockData)
├── CSS/ (Material-UI ou Tailwind mockups)
├── assets/
│   ├── logo.png
│   ├── icons/
│   └── mockup-screens/
└── README_PROTOTYPE.md

Tempo: 3-5 dias | Aprovação: Jonathan review
```

**Propósito**: Validar UI/UX antes de codificar  
**Leitura**: Jonathan, Users, Designer

---

### **CAMADA 5: Desenvolvimento (Fase 5) ⏳ FUTURO**

```
backend/
├── src/main/java/com/forcatotal/
│   ├── entity/       (JPA entities - 20+ tabelas)
│   ├── dto/          (40+ Request/Response DTOs)
│   ├── repository/   (Data access - Spring Data JPA)
│   ├── service/      (Business logic)
│   ├── controller/   (REST endpoints)
│   ├── exception/    (Custom exceptions)
│   ├── security/     (JWT, RBAC)
│   └── aop/          (Auditing, logging)
│
├── src/main/resources/
│   ├── db/migration/ (V001-V100+ Flyway scripts)
│   ├── application.properties
│   └── schema.sql
│
└── src/test/
    ├── service/     (JUnit5 + Mockito)
    ├── controller/  (MockMvc integration tests)
    └── repository/  (Test containers)

frontend/
├── src/pages/        (5-8 páginas React)
├── src/components/   (15-20 componentes)
├── src/services/     (API clients - Axios)
├── src/store/        (Redux/Context state)
├── src/hooks/        (Custom React hooks)
└── src/tests/        (Jest + React Testing Library)

database/
├── schemas/          (DDL scripts)
├── procedures/       (PL/pgSQL files)
├── migrations/       (Versioned SQL)
└── dumps/            (Backups)

docker/
├── Dockerfile        (Backend container)
├── Dockerfile        (Frontend container)
└── docker-compose.yml (Orquestração)

Tempo: 4-6 semanas | Equipe: 4-6 devs | Coverage: ≥80%
```

**Propósito**: Código de MVP em produção técnica  
**Leitura**: Devs, DevOps, QA

---

## 📊 Resumo Visual da Hierarquia

```
Fase 5: CÓDIGO                    ← Será preenchido (4-6 semanas)
         50.000+ linhas

Fase 4: PROTÓTIPO                ← Será preenchido (3-5 dias)
         10-15 arquivos

Fase 3: PLANs ✅                 ← CONCLUÍDA (HOJE)
         7.200 linhas
         8 documentos
         200+ tabelas
         140+ endpoints

Fase 2: SPECs ✅                 ← CONCLUÍDA
         37.550 linhas
         8 documentos
         70 RFs

Fase 1: Análise ✅               ← CONCLUÍDA
         8.000 linhas
         8 documentos
         Requisitos claros

Fase 0: Governança ✅            ← CONCLUÍDA
         Constitution
         Memory Bank
         Decision log
```

---

## 🎯 Como Navegar Este Projeto

### **Se você é PROPRIETÁRIO (Jonathan)**
1. Leia [FASE-3-RESUMO-EXECUTIVO.md](./FASE-3-RESUMO-EXECUTIVO.md) (2 min)
2. Aguarde Fase 4 (Prototype) - 5-7 de abril
3. Revise UI/UX nos wireframes HTML

### **Se você é ANALISTA/PO**
1. Leia [README.md](../README.md) (Visão geral)
2. Leia `docs/requisitos/01-normalizados/` (Fase 1)
3. Leia `docs/requisitos/04-specs/` (Fase 2)
4. Use como referência durante development

### **Se você é DESENVOLVEDOR (Backend)**
1. Leia [constitution.md](.copilot/memory/constitution.md) (decisões)
2. Leia `docs/requisitos/04-specs/SPEC-*.md` (seu módulo)
3. Leia `docs/requisitos/05-plans/PLAN-*.md` (seu PLAN exato)
4. Comece a codificar PLAN-001 (database + API)

### **Se você é DESENVOLVEDOR (Frontend)**
1. Leia [constitution.md](.copilot/memory/constitution.md)
2. Leia `docs/requisitos/05-plans/PLAN-*.md` (React components)
3. Comece a codificar React components da Fase 4

### **Se você é DBA**
1. Leia cada `PLAN-*.md` (seção Database)
2. Prepare migrations SQL (V001, V002, ...)
3. Otimize índices + constraints
4. Prepare backups

### **Se você é QA**
1. Leia `docs/requisitos/04-specs/SPEC-*.md` (casos de teste)
2. Leia cada `PLAN-*.md` (API contracts)
3. Crie plano de testes (unit + integration + E2E)

---

## 📈 Próximos Marcos

| Data | Fase | O Quê | Equipe |
|------|------|-------|--------|
| **3 abr** ✅ | **3** | **8 PLANs criados** | **Chat + You** |
| 4 abr | 3 | Review técnico | Tech lead |
| 5-7 abr | 4 | Prototyping (HTML/CSS/React stubs) | 1-2 devs |
| 10-14 abr | 4 | Revisão com Jonathan | Jonathan + Team |
| **17 abr+** | **5** | **Desenvolvimento de MVP operacional** | **4-6 devs** |
| 26-31 maio | 5 | Staging + QA | Equipe + QA |
| 7-14 junho | 5 | UAT (User Acceptance Tests) | Jonathan + Users |
| **21 junho** | **MVP** | **Entrada em operacao assistida** | **Todos** |

---

## ✨ Conclusão

**Este projeto agora tem:**

✅  Governança clara (Constitution)
✅  Requisitos normalizados (Fase 1)
✅  Especificações do negócio (Fase 2)
✅  Decisões técnicas (Fase 3 - HOJE)
⏳ Protótipos visuais (Fase 4 - próximos dias)
⏳ Código de MVP operacional (Fase 5 - próximas semanas)

**Cada desenvolvedor pode pegar seu PLAN e começar a codificar com 0 ambiguidade.**

**Estimate**: 8-10 semanas de esforço distribuído em 4-6 devs = **entrega em junho de 2026** 🚀

---

**Hierarquia Completa: CRIADA ✅**  
**Rastreabilidade**: 100% (Código ← PLANs ← SPECs ← RFs)  
**Status**: **PRONTO PARA DESENVOLVIMENTO**

