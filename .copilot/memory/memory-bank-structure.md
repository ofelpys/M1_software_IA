# MEMORY-BANK-STRUCTURE.MD — Estrutura e Navegação

> **Propósito**: Mapa mental do Memory Bank  
> **Mantido por**: Copilot (Automated)

---

## Estrutura de Diretórios

```
.copilot/
├── core/                          ← Conhecimento base
│   ├── rules.md                   (Regras não-negociáveis)
│   ├── contexts.md                (Contextos de negócio)
│   ├── patterns.md                (Padrões de código)
│   └── README.md
│
├── memory/                        ← Persistência de decisões
│   ├── constitution.md            (Lei suprema ~ Decisions)
│   ├── memory-bank-structure.md   (Este arquivo)
│   ├── function-map.xml           (Index de functions)
│   ├── context-index.md           (Tags e índices)
│   ├── decision-log.md            (Histórico de decisões)
│   ├── project-state.md           (Snapshot atual)
│   └── README.md
│
├── workflows/                     ← Procedures
│   ├── plan.md                    (Diagrama do plano)
│   ├── act.md                     (Como executar)
│   ├── documentation.md           (Como documentar)
│   ├── specification-documentation.md
│   ├── evaluation.md              (Como avaliar)
│   ├── learning.md                (Como aprender)
│   ├── retry.md                   (Como recuperar de falhas)
│   ├── task-logs.md               (Como registrar tarefas)
│   └── README.md
│
└── logs/                          ← Histórico
    ├── task-log-2026-04-01.md     (Diário de execução)
    ├── task-log-2026-04-02.md
    └── README.md
```

---

## Ciclo de Leitura (Inicialização)

Quando **Copilot** é acionado numa sessão nova:

```
1. Verificar se .copilot/ existe
   ├─ Se NÃO: Scaffoldar automaticamente
   └─ Se SIM: Continuar

2. Ler obrigatoriamente (nesta ordem):
   ├─ .copilot/memory/constitution.md
   ├─ .copilot/core/rules.md
   ├─ .copilot/memory/decision-log.md (últimas 5 opções)
   └─ .copilot/memory/project-state.md

3. Ler contexto conforme tarefa:
   ├─ Implementação → .copilot/core/patterns.md
   ├─ Dúvida de negócio → .copilot/core/contexts.md
   ├─ Task execution → .copilot/workflows/act.md
   └─ Documentação → .copilot/workflows/documentation.md

4. Executar workflow apropriado

5. Persistir no memory bank + logs
```

---

## Arquivos Core

### `.copilot/core/rules.md`
- Leis não-negociáveis do projeto
- Checklist de code review
- Padrões de PR
- Quando e como violação é inaceitável

### `.copilot/core/contexts.md`
- Quem é Jonathan (proprietário)
- O que ele realmente precisa
- Fluxos de negócio críticos
- Riscos e stakeholders

### `.copilot/core/patterns.md`
- Entity + DTO pattern (Spring)
- Repository pattern
- Service pattern com validações
- Controller pattern (REST)
- Exception handling
- React components + Hooks
- Migration pattern
- Test pattern

---

## Arquivos Memory

### `.copilot/memory/constitution.md`
- Decisões FINAIS e IMUTÁVEIS
- Stack technology
- Bloqueadores resolvidos
- Hierarquia de verdade
- Governo de mudanças

### `.copilot/memory/decision-log.md`
- Histórico de TODAS as decisões
- Por quê cada decisão foi tomada
- Alternativas consideradas
- Data e quem decidiu
- Impacto de cada decisão

### `.copilot/memory/project-state.md`
- Snapshot ATUAL do projeto
- Fase em que estamos (Fase X)
- O que foi completado
- O que está em progresso
- O que falta
- Próxim milestone

### `.copilot/memory/context-index.md`
- Tags para navegação rápida
- Cross-references entre documentos
- Índice de RFs/DPs/DUVidas
- Quick lookup table

### `.copilot/memory/function-map.xml`
- Mapa de funções/métodos em código
- Atualizado automaticamente ou manualmente
- Links para arquivos

---

## Workflows

### `.copilot/workflows/plan.md`
- Diagrama de fases do projeto
- O que fazer em cada fase
- Checklist de início de projeto (Initialization)
- Dependências entre fases

### `.copilot/workflows/act.md`
- Passo-a-passo de execução
- Como começar uma task
- Como executar um design
- Como integrar code

### `.copilot/workflows/documentation.md`
- Como documentar new features
- Template para SPEC
- Template para PLAN
- Template para TASKS

### `.copilot/workflows/task-logs.md`
- Como registrar uma task
- Formato de task log
- O que deve incluir
- Como vincular ao contexto

---

## Ciclo de Persistência (Memory Update)

Sempre que uma atividade significativa ocorre:

```
Atividade (ex: Decisão tomada)
  ↓
1. Registrar em `.copilot/memory/decision-log.md`
   └─ O quê, por quê, quem, quando, impacto

2. Atualizar `.copilot/memory/project-state.md`
   └─ Progresso, milestones, status

3. Registrar em `.copilot/logs/task-log-YYYY-MM-DD.md`
   └─ Diário executivo da sessão

4. Se Constitution muda:
   ├─ Incrementar versão
   ├─ Registrar em decision-log
   └─ Notificar stakeholders

5. Se novo pattern descoberto:
   └─ Adicionar em `.copilot/core/patterns.md`
```

---

## Quick Reference (Memory Lookup)

| Pergunta | Resposta Em |
|---|---|
| "Qual é a stack?" | constitution.md § Stack Definitivo |
| "Qual Rule foi violada?" | core/rules.md (seção relevante) |
| "Por que decidimos X?" | decision-log.md |
| "Qual é o status?" | project-state.md |
| "Como fazer um SPEC?" | workflows/documentation.md |
| "Como testar?" | core/patterns.md § Testes |
| "Qual é o fluxo de aluno?" | core/contexts.md § Fluxos de Negócio |

---

## Encerramento

O Memory Bank é o **coração do Copilot**. Sem ele, não há continuidade, rastreabilidade ou governança.

**Leia sempre antes de agir.**
