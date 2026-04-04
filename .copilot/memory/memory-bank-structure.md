# MEMORY-BANK-STRUCTURE.MD — Estrutura e Navegação

> **Propósito**: Mapa atualizado dos artefatos reais do Memory Bank  
> **Mantido por**: Copilot

---

## Estrutura Atual

```
.copilot/
├── core/
│   ├── rules.md
│   ├── contexts.md
│   └── patterns.md
│
├── memory/
│   ├── constitution.md
│   ├── decision-log.md
│   ├── duv-resolutions.md
│   ├── fase-2-completion-summary.md
│   ├── memory-bank-structure.md
│   └── project-state.md
│
├── workflows/
│   ├── plan.md
│   ├── FASE-3-PLANNING.md
│   └── FASE-3-RESUMO-EXECUTIVO.md
│
├── logs/
│   └── task-log.md
│
└── README.md
```

---

## Ordem Recomendada de Leitura

1. `.copilot/memory/constitution.md`
2. `.copilot/core/rules.md`
3. `.copilot/memory/decision-log.md`
4. `.copilot/memory/project-state.md`

Leitura complementar por necessidade:
- Implementação: `.copilot/core/patterns.md`
- Negócio: `.copilot/core/contexts.md`
- Planejamento de execução: `.copilot/workflows/plan.md`

---

## Responsabilidade por Arquivo

- `constitution.md`: decisões supremas e governança.
- `decision-log.md`: histórico e racional das decisões.
- `duv-resolutions.md`: resoluções das DUVs e impactos.
- `project-state.md`: snapshot operacional atual.
- `task-log.md`: histórico de sessões e marcos.
- `plan.md`: estado das fases e próximos passos.

---

## Regras de Persistência

Quando houver mudança relevante:
1. Registrar decisão em `decision-log.md`.
2. Atualizar `project-state.md` com impacto e status.
3. Registrar fechamento da sessão em `task-log.md`.
4. Se a decisão for estrutural, atualizar `constitution.md`.

---

## Encerramento

Este arquivo deve sempre refletir os artefatos que realmente existem na pasta `.copilot`.
