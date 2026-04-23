# WORKFLOWS/PLAN.MD — Plano de Fases Consolidado

> Ultima revisao: 23 de abril de 2026

---

## 1. Status de Fases

| Fase | Status |
|---|---|
| Fase 0 - Init | Concluida |
| Fase 1 - Analysis | Concluida |
| Fase 2 - Specs | Concluida |
| Fase 3 - Planning | Concluida |
| Fase 4 - Prototyping | Concluida (baseline) |
| Fase 4.5 - Integration readiness | Concluida |
| Fase 5 - Development | Em andamento |

---

## 2. Evidencias rapidas da fase atual

- Backend com controllers M01-M08 em `backend/forca-total-api/src/main/java/com/forcatotal/m1/api/controller/`.
- Migracoes Flyway V001-V009 em `backend/forca-total-api/src/main/resources/db/migration/`.
- Frontend React com modulos/gateways em `frontend/prototipo-react-fase4/src/`.
- Testes integracao frontend (mock e real API) em `frontend/prototipo-react-fase4/tests/integration/`.

---

## 3. Sequenciamento recomendado (fase 5)

1. Consolidar cobertura de testes de integracao por modulo M01-M08.
2. Reduzir uso de rotas legadas, priorizando perfil canonico `/api/*`.
3. Fechar checklist de readiness para deploy de staging.
4. Executar hardening de observabilidade, seguranca e resiliencia.

---

## 4. Regra de sincronia

Toda mudanca de status de fase deve atualizar no mesmo ciclo:
- `../memory/project-state.md`
- `../memory/decision-log.md` (quando houver decisao)
- `../logs/task-log.md`
- `../README.md`
