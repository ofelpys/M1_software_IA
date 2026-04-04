# .COPILOT/README.md — Guia Rápido do Memory Bank

> **Projeto**: Rede Força Total Academias (M1)  
> **Versão**: 1.1  
> **Última atualização**: 4 de abril de 2026

---

## 1. Objetivo

Esta pasta centraliza governança, contexto e estado do projeto para manter continuidade entre sessões.

---

## 2. Estrutura Atual

```
.copilot/
├── core/
│   ├── rules.md
│   ├── contexts.md
│   └── patterns.md
├── memory/
│   ├── constitution.md
│   ├── decision-log.md
│   ├── duv-resolutions.md
│   ├── fase-2-completion-summary.md
│   ├── memory-bank-structure.md
│   └── project-state.md
├── workflows/
│   ├── plan.md
│   ├── FASE-3-PLANNING.md
│   └── FASE-3-RESUMO-EXECUTIVO.md
└── logs/
    └── task-log.md
```

---

## 3. Ordem de Leitura Recomendada

1. `.copilot/memory/constitution.md`
2. `.copilot/core/rules.md`
3. `.copilot/memory/decision-log.md`
4. `.copilot/memory/project-state.md`

Depois, use leitura por contexto:
- Implementação: `.copilot/core/patterns.md`
- Negócio e stakeholders: `.copilot/core/contexts.md`
- Planejamento de execução: `.copilot/workflows/plan.md`

---

## 4. Decisões-Chave Vigentes

- Database: PostgreSQL 15+
- Backend: Spring Boot 3.x
- Frontend: React 18+
- Comissão de professor: por aluno mensal
- Catraca: fora da fase inicial (futuro)
- DUV-02, DUV-03, DUV-04, DUV-06 e DUV-07: resolvidas

---

## 5. Estado de Fase

- Fase 0: concluída
- Fase 1: concluída
- Fase 2: concluída (SPEC-001 a 008)
- Fase 3: concluída (PLAN-001 a 008)
- Fase 4: em andamento (protótipo inicial em docs/requisitos/06-prototipos/fase-4-iron/)
- Fase 5: não iniciada

---

## 6. Protocolo de Atualização

Sempre que houver mudança relevante:
1. Atualizar `decision-log.md` se foi decisão.
2. Atualizar `project-state.md` com impacto no status.
3. Atualizar `task-log.md` com resumo da sessão.
4. Atualizar `constitution.md` se a decisão for de nível supremo.

---

## Encerramento

Este README deve permanecer alinhado ao estado real dos arquivos e decisões vigentes.
