# PROJECT-STATE.MD — Status Consolidado do Projeto M1

> Ultima atualizacao: 23 de abril de 2026
> Versao: 2.0-memory-reconciled
> Fonte: validacao cruzada entre codigo, scripts, testes e documentacao do repositorio

---

## 1. Resumo Executivo

| Metrica | Estado atual |
|---|---|
| Projeto | Rede Forca Total Academias (M1) |
| Stack principal | React + Spring Boot + PostgreSQL |
| Fase atual | Fase 5 em andamento |
| Bloqueadores criticos | 0 abertos |
| SPECs | 8/8 concluidas |
| PLANs | 8/8 concluidos |
| Backend canonico | M01-M08 com endpoints minimos implementados |
| Frontend React | Prototipo funcional + gateways por modulo |
| Testes integracao | Suites mock e real API existentes |

---

## 2. Status por Fase

| Fase | Status | Evidencia principal |
|---|---|---|
| Fase 0 - Init | Concluida | Memory bank e governanca em `.copilot/` |
| Fase 1 - Analysis | Concluida | Normalizacao em `docs/requisitos/01-normalizados` e `02-mapa` |
| Fase 2 - Specs | Concluida | `docs/requisitos/04-specs/SPEC-001..008` |
| Fase 3 - Plans | Concluida | `docs/requisitos/05-plans/PLAN-001..008` |
| Fase 4 - Prototipos | Concluida (pacote base) | `docs/requisitos/06-prototipos/fase-4-iron` e app React |
| Fase 4.5 - Integration readiness | Concluida | OpenAPI + matriz de rotas + DoR fase 5 |
| Fase 5 - Development | Em andamento | Backend Java, Flyway, CI e testes integracao |

---

## 3. Evidencias de Implementacao (Fase 5)

### Backend
- Controllers presentes para M01-M08 em `backend/forca-total-api/src/main/java/com/forcatotal/m1/api/controller/`.
- Shim legado de transicao presente (`LegacyShimController.java`).
- Migracoes Flyway V001-V009 em `backend/forca-total-api/src/main/resources/db/migration/`.

### Frontend
- App React em `frontend/prototipo-react-fase4` com modulos e gateways.
- Politica de integracao/fallback por modulo presente nos services.

### Testes e automacao
- Testes integracao frontend (mock + real API):
  - `frontend/prototipo-react-fase4/tests/integration/critical-flow.test.mjs`
  - `frontend/prototipo-react-fase4/tests/integration/critical-flow.real-api.test.mjs`
- Pipeline CI da fase 5: `.github/workflows/ci-fase5.yml`.

---

## 4. Decisoes e DUVs

- Decisoes estruturais ratificadas: PostgreSQL, modelo de comissao por aluno mensal, catraca fora da fase inicial.
- DUVs operacionais registradas no ciclo inicial: resolvidas e sem pendencias criticas abertas.

---

## 5. Riscos Atuais

| Risco | Probabilidade | Impacto | Mitigacao |
|---|---|---|---|
| Drift entre memoria e codigo | Media | Alta | Atualizacao sincronizada de `project-state`, `plan`, `README .copilot`, `task-log` |
| Cobertura real incompleta entre modulos | Media | Media/Alta | Expandir testes integracao por modulo (M03-M07) |
| Inconsistencia de rotas entre front e backend | Baixa/Media | Alta | Validacao continua contra OpenAPI e matriz fase 4.5 |

---

## 6. Proximos Passos Recomendados

1. Consolidar checklist de Go-Live da Fase 5 por modulo (M01-M08).
2. Expandir testes de integracao real API para cobertura de CRUD minimo em todos modulos.
3. Congelar baseline de rotas canonicas e reduzir dependencia de shim legado.
4. Atualizar este snapshot ao fim de cada marco relevante de implementacao.

---

## 7. Regra de Ouro de Consistencia

Este arquivo e o snapshot operacional principal.
Qualquer mudanca de fase/status deve ser refletida na mesma sessao em:
- `.copilot/workflows/plan.md`
- `.copilot/README.md`
- `.copilot/logs/task-log.md`
- `.copilot/memory/decision-log.md` (quando houver decisao)
