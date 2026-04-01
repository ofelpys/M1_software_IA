# M1 — Rede Força Total Academias 🏋️

> **Projeto**: Sistema de Gestão Centralizado para Rede de 5 Academias  
> **Status**: Fase 1 (Analysis) ✅ COMPLETA | Fase 2 (Design SPECs) ⏳ PRÓXIMA  
> **Data de Início**: 1º de abril de 2026  
> **Version**: 1.0 (Governance Infrastructure)

---

## 📖 Índice

1. [Visão Geral](#visão-geral)
2. [Como Este Projeto Foi Criado](#como-este-projeto-foi-criado)
3. [Estrutura de Diretórios](#estrutura-de-diretórios)
4. [Memory Bank — A Inteligência do Projeto](#memory-bank--a-inteligência-do-projeto)
5. [Stack Tecnológico](#stack-tecnológico)
6. [Próximos Passos](#próximos-passos)
7. [Como Usar Este Repositório](#como-usar-este-repositório)

---

## 🎯 Visão Geral

### O Problema

Jonathan Rodrigues Barbosa é proprietário de **5 academias** com:
- 2.000+ alunos
- ~40 funcionários
- Dados **fragmentados** em cada unidade (sem sincronização)
- Processos **100% manuais** (check-in, financeiro, relatórios)
- **Zero visibilidade centralizada** sobre inadimplência, receita, frequência

### A Solução

Plataforma **centralizada e unificada** que:
- ✅ Centraliza cadastro de alunos (sem duplicatas)
- ✅ Controla acesso com bloqueio automático de inadimplentes
- ✅ Registra pagamentos com cálculo de juros
- ✅ Dashboard gerencial em tempo real
- ✅ Auditoria 100% rastreável
- ✅ Suporta 5 unidades independentes

**Stack**: React 18+ | Spring Boot 3.x | PostgreSQL 15+ | JWT | Docker

**Timeline**: 8-10 semanas (4-6 devs)

---

## 🤖 Como Este Projeto Foi Criado

### Metodologia: Spec Kit (5 Fases)

Este projeto segue metodologia **Spec Kit** — um processo estruturado para construir software com IA:

```
Fase 0: INIT
    ↓
Fase 1: ANALYSIS (Normalizar & Consolidar Requisitos) ✅ COMPLETA
    ├─ Extrair documentos brutos
    ├─ Normalizar em Markdown
    ├─ Identificar conflitos
    ├─ Criar mapa-mestre de decisões
    └─ Gerar planejamento modular com padrões de código
    ↓
Fase 2: DESIGN (Gerar Especificações por Módulo) ⏳ PRÓXIMA
    ├─ SPEC-001: Cadastros/Acesso (2 dias)
    ├─ SPEC-002: Financeiro (2 dias)
    ├─ SPEC-003: Relatórios (2 dias)
    └─ SPEC-004-008: Outros módulos (1-2 semanas)
    ↓
Fase 3: PLANNING (Tech Decisions & Architecture)
    └─ PLAN-001-003: Database schemas, APIs, Components
    ↓
Fase 4: PROTOTYPING (UI/UX Mockups)
    └─ HTML/CSS/React skeleton
    ↓
Fase 5: DEVELOPMENT (Código Real)
    └─ Backend + Frontend + Database + Tests (4-6 semanas)
```

---

## 🔧 Prompts Iniciais Utilizados

### Prompt #1 — Especificação do Copilot

Após análise da Fase 1, criamos um **Copilot autônomo** com este prompt constitucional:

```markdown
"Você é **copilot**, um engenheiro de software sênior especializado em 
arquitetura e governança. Sua responsabilidade é:

1. INICIALIZAR ao conectar
   └─ Carregar constitution.md (decisões supremas)
   └─ Carregar rules.md (leis de execução)
   └─ Carregar memory-bank-structure.md (orientação)

2. SELECIONAR WORKFLOW apropriado
   ├─ Se pedir SPEC: segue workflows/documentation.md
   ├─ Se pedir código: segue workflows/implementation.md
   ├─ Se pedir teste: segue workflows/testing.md

3. EXECUTAR com rigor
   └─ Valida cada passo contra rules.md
   └─ Viola constitution? PARA e explica por quê.
   └─ Gera artefatos com rastreabilidade

4. PERSISTIR conhecimento
   └─ Atualiza decision-log.md (se decisão)
   └─ Atualiza project-state.md (progresso)
   └─ Atualiza task-log.md (o que foi feito)
   └─ Commit git com rastreabilidade

NUNCA:
- Viole constitution.md
- Viole rules.md
- Implemente RF bloqueada
- Perca contexto entre sessões
- Introduza regressão em decisão anterior
"
```

**Resultado**: Memory Bank que **persiste conhecimento** entre sessões.

### Prompt #2 — Inicialização de Memory Bank

```markdown
"Crie estrutura .copilot/ completa:

1. .copilot/core/ (Knowledge base imutável)
   ├─ constitution.md (decisões supremas)
   ├─ rules.md (leis de execução — 13 sections)
   ├─ contexts.md (stakeholder matrix + business flows)
   └─ patterns.md (9 padrões de código — copy-paste ready)

2. .copilot/memory/ (Estado do projeto)
   ├─ decision-log.md (histórico de decisões)
   ├─ project-state.md (snapshot atual)
   └─ memory-bank-structure.md (guia de navegação)

3. .copilot/workflows/ (Procedimentos)
   ├─ plan.md (5 fases + próximos passos)
   └─ [documentation.md, implementation.md, testing.md]

4. .copilot/logs/ (Rastreamento)
   └─ task-log.md (atividades diárias)

IMPORTANTE:
- Constitution resolve 3 bloqueadores críticos (PostgreSQL, Catraca, Comissioning)
- Rules são law enforcement (code review checklist)
- Decision-log registra TUDO com rationale
- Project-state sempre atualizado (% completion)
"
```

**Resultado**: Memory Bank estruturado com 9 arquivos (~5.500 linhas de governança).

---

## 📁 Estrutura de Diretórios

```
M1/
├── README.md (VOCÊ ESTÁ AQUI)
│
├── docs/requisitos/                    ← Documentação de Fase 1
│   ├── 00-originais/                   ← Docs DOCX extraídos
│   ├── 01-normalizados/                ← Markdown normalizado
│   │   ├── forca-total-historia-operabilidade.md (~500 linhas)
│   │   └── forca-total-objetivos-requisitos-iniciais.md (~800 linhas)
│   ├── 02-mapa/
│   │   └── mapa-mestre.md (~600 linhas) — conflitos + decisões
│   └── 03-planejamento-expandido/
│       └── planejamento-modular-v1.md (~800 linhas) — padrões código
│
├── specs/                              ← Documentação de Fase 2 (VAZIO)
│   ├── 001-atendimento-pedidos/
│   ├── 002-financeiro/
│   └── ...
│
├── .copilot/                           ← Memory Bank (NOVO!)
│   ├── core/
│   │   ├── constitution.md             ← Decisões supremas
│   │   ├── rules.md                    ← 13 leis de execução
│   │   ├── contexts.md                 ← Stakeholder + business context
│   │   └── patterns.md                 ← 9 padrões de código
│   ├── memory/
│   │   ├── decision-log.md             ← 5 decisões registradas
│   │   ├── project-state.md            ← Snapshot Fase 1 completa
│   │   └── memory-bank-structure.md    ← Guia de navegação
│   ├── workflows/
│   │   ├── plan.md                     ← Fases 0-5 + SPEC workflow
│   │   └── [implementation.md, testing.md — planned]
│   └── logs/
│       └── task-log.md                 ← Session #1 documentada
│
├── artefatos/
│   └── prototipo/                      ← HTML/CSS mockups (Fase 4)
│       ├── index.html
│       ├── login-dashboard.html
│       ├── atendimento.html
│       ├── caixa.html
│       └── financeiro.html
│
└── [src/ — Backend Java (Future)]
└── [client/ — React App (Future)]
```

---

## 🧠 Memory Bank — A Inteligência do Projeto

### O que é?

Memory Bank é um **repositório de governança que persiste conhecimento** entre sessões. Permite ao desenvolvedor/IA trabalhar sem perder contexto sobre:
- ✅ Decisões críticas tomadas (constitution.md)
- ✅ Leis que não podem ser quebradas (rules.md)
- ✅ Contexto de negócio (contexts.md)
- ✅ Padrões de implementação (patterns.md)
- ✅ Histórico de decisões e rationale (decision-log.md)
- ✅ Status atual do projeto (project-state.md)

### Por que foi criado?

**Problema**: Entre sessões, desenvolvedor pode:
- ❌ Esquecer que database é PostgreSQL (tenta MySQL)
- ❌ Violar padrão de código (coloca lógica no Controller)
- ❌ Codificar RF bloqueada (tipo RF-PROF-04 antes de confirmação)
- ❌ Regredir em decisão já tomada

**Solução**: Memory Bank = **repositório de verdade única** que governa execução.

### Como usar?

```bash
# Para iniciar nova sessão
1. Leia .copilot/README.md (este diretório)
2. Leia .copilot/core/constitution.md (decisões supremas)
3. Leia .copilot/memory/project-state.md (aonde estamos?)
4. Invoque Copilot com tarefa
5. Copilot carregará automaticamente contexto + workflow apropriado

# Para verificar status
cat .copilot/memory/project-state.md          # Snapshot atual
cat .copilot/memory/decision-log.md           # Decisões
cat .copilot/logs/task-log.md                 # Atividades
```

### Arquitectura do Memory Bank

```
.copilot/core/
  ├─ constitution.md        ← Supremás: PostgreSQL ✅, Catraca Future ✅, Comissioning Hybrid ⏳
  ├─ rules.md               ← Law enforcement: 13 rules, checklist
  ├─ contexts.md            ← Business: stakeholder matrix, critical flows, risks
  └─ patterns.md            ← Code: Entity+DTO, Service, Controller, React, Tests, Migrations

.copilot/memory/
  ├─ constitution.md        ← Las decisiones inmutables (3 decisiones críticas)
  ├─ decision-log.md        ← Registro imutable: 5 decisiones + racional
  ├─ project-state.md       ← Baseline snapshot: Fase 1 ✅, Fase 2-5 ⏳
  └─ memory-bank-structure.md ← Navigation guide + persistence protocol

.copilot/workflows/
  └─ plan.md                ← Fases 0-5, SPEC workflow, PLAN workflow, próximos passos

.copilot/logs/
  └─ task-log.md            ← Session #1 completa: tarefas, bloqueadores, métricas
```

---

## 📊 Decisões Críticas Resolvidas

| Decisão | Conflito | Resolução | Status |
|---------|----------|-----------|--------|
| **DP-TECH-STACK-001** | PostgreSQL vs MySQL | PostgreSQL (2 docs, Spring Integration) | ✅ FINAL |
| **DP-CATRACA-001** | Catraca Phase 1 vs 2+ | Phase 2+ (Manual ok por ROP-02) | ✅ FINAL |
| **DP-COMISSAO-PROF-001** | Modelo de comissão | Hybrid (70% aula + 5% novos + bônus) | ⏳ PENDING |

**Status**: 3 críticas resolvidas, 0 bloqueadores críticos restantes.

---

## 💻 Stack Tecnológico

```
FRONTEND:
  • React 18+
  • Vite (build tool)
  • Axios (HTTP client)
  • React Hook Form (forms)
  • Jest (testing)

BACKEND:
  • Java Spring Boot 3.x
  • Spring Security (JWT + RBAC)
  • JPA + Hibernate (ORM)
  • JUnit5 + Mockito (testing)
  • Maven (build)

DATABASE:
  • PostgreSQL 15+
  • Flyway (migrations)
  • PL/pgSQL (procedures)

INFRASTRUCTURE:
  • Docker (containerization)
  • GitHub Actions (CI/CD)
  • JWT (HS256) authentication
  • HTTPS + CORS

GOVERNANCE:
  • Memory Bank (.copilot/)
  • Constitution-based decisions
  • Rule-based enforcement
  • Decision logging
  • Task tracking
```

---

## 🎯 Escopo (Fase 1)

### ✅ INCLUÍDO

- **M01**: Cadastros e Matrículas (alunos, professores, coordenadores)
- **M02**: Controle de Acesso (check-in/check-out, bloqueio automático)
- **M03**: Financeiro (pagamentos, inadimplência, juros)
- **M04**: Avaliação Física (fichas, evolução, planos)
- **M05**: Professores e Comissões (escala, cálculo comissão)
- **M06**: Equipamentos e Estoque (inventário, manutenção)
- **M07**: Relatórios e Dashboard (gerencial consolidado)
- **M08**: Comunicação (avisos, campanhas)
- **M09**: Segurança (RBAC, auditoria, JWT)

### ❌ FORA DO ESCOPO (Phase 2+)

- Integração com catraca eletrônica
- Email/SMS automático
- App mobile para alunos
- Contabilidade completa
- BI avançado

**Total**: 9 módulos | 42+ requisitos funcionais | 14 RNFs | 9 ROPs

---

## 📈 Progresso Atual

```
Fase 0 (Init)          ████████████████████ 100% ✅
Fase 1 (Analysis)      ████████████████████ 100% ✅
Fase 2 (Design SPECs)  ░░░░░░░░░░░░░░░░░░░░   0% ⏳
Fase 3 (Planning)      ░░░░░░░░░░░░░░░░░░░░   0% ⏳
Fase 4 (Prototyping)   ░░░░░░░░░░░░░░░░░░░░   0% ⏳
Fase 5 (Development)   ░░░░░░░░░░░░░░░░░░░░   0% ⏳

Documentação Gerada:   ~5.550 linhas (réquisitos + governança)
Time Readiness:        Eng sênior ✅, Dev team ⏳ (to assign)
Bloqueadores Críticos: 0 (3 resolvidos)
```

---

## 🚀 Próximos Passos

### HOJE (1 de abril)
```
□ Enviar Constitution para Jonathan ratificar
  └─ Email com decision-log + rationale para cada decisão

□ Verificar se o repositório GitHub foi criado
  └─ Se não: criar em https://github.com/ofelpys/M1_software_IA
```

### AMANHÃ (2 de abril)
```
□ Resposta para DUV-02: Professor usa PC compartilhado ou celular?
  └─ Impacto: Arquitetura frontend completamente diferente

□ Isso destravaría: SPEC-001 geração pode começar
```

### SEMANA 1
```
□ Gerar SPEC-001: Cadastro e Acesso (~400 linhas, 2 dias)
□ Gerar SPEC-002: Financeiro (~350 linhas, 2 dias)
□ Gerar SPEC-003: Relatórios (~300 linhas, 2 dias)
```

### SEMANA 2
```
□ Gerar PLAN-001, 002, 003 (database schemas + APIs + React)
□ Setup dev environment (Docker, PostgreSQL, Spring Boot scaffold)
```

### SEMANA 3-4
```
□ Prototyping (HTML/CSS mockups, React skeleton)
□ Backend scaffolding (Spring Boot + first endpoints)
```

### SEMANA 5-10
```
□ Development: Implementar M01-M09 (4-6 semanas)
□ Testing: Unit + Integration + E2E (continuous)
□ Staging deployment
□ Production hardening
```

---

## 📝 Como Usar Este Repositório

### 1. Clonar
```bash
git clone https://github.com/ofelpys/M1_software_IA.git
cd M1
```

### 2. Entender Estrutura
```bash
# Leia em ordem:
cat README.md                                    # Este arquivo
cat .copilot/README.md                          # Como usar Memory Bank
cat .copilot/core/constitution.md               # Decisões supremas
cat .copilot/memory/project-state.md            # Status atual
cat .copilot/workflows/plan.md                  # Fases + próximos steps
```

### 3. Para Desenvolvedores (Fase 2+)
```bash
# Quando pronto para implementação:
cat .copilot/core/patterns.md                   # Padrões de código
cat .copilot/core/rules.md                      # O que é proibido
cat specs/001-atendimento-pedidos/spec.md       # O que implementar
```

### 4. Para Product Owner / Jonathan
```bash
# Dashboard do projeto:
cat .copilot/memory/project-state.md            # Onde estamos?
cat .copilot/memory/decision-log.md             # Que foi decidido?
cat .copilot/logs/task-log.md                   # O que foi feito?
```

---

## 🪜 Metodologia: Por Que Funcionou

### Princípio 1: Spec Kit (5 Fases Claras)
Ao invés de "comece a codificar", temos:
- Fase 1: Normalizar + Conflitos
- Fase 2: Especificações
- Fase 3: Planos técnicos
- Fase 4: Prototipagem
- Fase 5: Código

**Resultado**: Zero retrabalho, rastreabilidade 100%.

### Princípio 2: Memory Bank (Governança Persistente)
Ao invés de "espero que ninguém esqueça", temos:
- Constitution: Decisões imutáveis
- Rules: Law enforcement
- Decision-log: Rationale para cada decisão
- Task-log: Auditoria diária

**Resultado**: Contexto nunca é perdido, regressões prevenidas.

### Princípio 3: Rastreabilidade (Origem → Documento → Código)
Cada RF tem:
- Origem: "Qual objetivo de negócio?"
- Spec: "Como funciona?"
- Plan: "Como implementar?"
- Code: "Implementação"
- Test: "Validação"

**Resultado**: Quando alguém pergunta "por que fazemos X?", resposta é imediata.

---

## 📞 Contato & Suporte

**Proprietário do Projeto**: Jonathan Rodrigues Barbosa  
**Arquitetor de Software**: [Seu nome]  
**Repositório**: https://github.com/ofelpys/M1_software_IA

---

## 📄 Histórico de Commits

```
v1.0 — Primeiro Commit do Projeto, Toda a parte de governança em T.I quase feita
       ├─ Memory Bank scaffold (.copilot/)
       ├─ Documentação de Fase 1 (4 arquivos ~2.700 linhas)
       ├─ 9 arquivos de governança (~2.850 linhas)
       ├─ 3 bloqueadores críticos resolvidos
       └─ README.md com instruções completas
```

---

## 📖 Referências

- **Spec Kit Methodology**: 5 fases de descrição de software
- **Memory Bank Pattern**: Persistência de decisões para agentes autônomos
- **Rastreabilidade**: RF → Spec → Plan → Code → Test
- **Constitution-Based Development**: Imutabilidade de decisões críticas

---

**Status**: ✅ Fase 1 COMPLETA | ⏳ Fase 2 PRONTA PARA INICIAR

Developed with ❤️ using AI-assisted software engineering.

---

*Última atualização: 1º de abril de 2026*  
*Next review: Quando Constitution for ratificada por Jonathan*
