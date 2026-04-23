# DECISION-LOG.MD — Historico Consolidado de Decisoes

> Ultima atualizacao: 23 de abril de 2026
> Escopo: decisoes de alto impacto e decisoes de governanca de memoria

---

## D-001 — Banco de dados padrao: PostgreSQL

- Data: 01/04/2026
- Status: ratificada
- Decisao: PostgreSQL como banco oficial do projeto.
- Impacto: migrations Flyway, modelagem e consultas orientadas a PostgreSQL.

## D-002 — Modelo de comissao de professores

- Data: 02/04/2026
- Status: ratificada
- Decisao: comissao por aluno ativo mensal.
- Impacto: RFs de financeiro/professores/relatorios destravadas.

## D-003 — Integracao de catraca

- Data: 01/04/2026
- Status: ratificada
- Decisao: fora do escopo inicial; manter check-in manual no MVP.
- Impacto: reduz risco e complexidade na fase inicial.

## D-004 — Stack frontend

- Data: 01/04/2026
- Status: ratificada
- Decisao: React 18+.

## D-005 — Stack backend

- Data: 01/04/2026
- Status: ratificada
- Decisao: Spring Boot 3.x.

## D-006 — Fase 2 e Fase 3 executadas integralmente

- Data: 02/04/2026 a 03/04/2026
- Status: concluida
- Decisao: gerar e consolidar SPEC-001..008 e PLAN-001..008 no ciclo inicial.
- Impacto: baseline de desenvolvimento completo por modulo.

## D-007 — Integration readiness (Fase 4.5)

- Data: 05/04/2026
- Status: concluida
- Decisao: formalizar OpenAPI, matriz de alinhamento de rotas e politica de fallback para transicao.
- Impacto: frontend/backend alinhados para evolucao da fase 5.

## D-008 — Reconciliacao do memory bank

- Data: 23/04/2026
- Status: executada
- Decisao: sincronizar todo o memory bank com o estado real do repositorio.
- Motivacao: havia divergencias entre arquivos de memoria sobre status da Fase 5 e proximos passos.
- Impacto:
  - `project-state.md` passou a ser o snapshot operacional principal.
  - `plan.md`, `README` da `.copilot` e `task-log.md` alinhados na mesma data.
  - Remocao de contradicoes ativas em status de fase e progresso tecnico.

---

## Regra de Atualizacao

Para cada decisao nova:
1. Registrar aqui com data e impacto.
2. Atualizar `project-state.md` se afetar status operacional.
3. Atualizar `plan.md` se afetar sequenciamento de fase.
4. Registrar no `task-log.md` o fechamento da sessao.
