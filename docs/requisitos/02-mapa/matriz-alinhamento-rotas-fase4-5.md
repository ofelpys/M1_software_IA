# Matriz de Alinhamento de Rotas - Fase 4.5

Data: 5 de abril de 2026
Status: Em vigor para inicio da Fase 5

## Objetivo

Alinhar as rotas do frontend atual com os endpoints alvo dos PLANs e com o contrato formal OpenAPI.

## Mapeamento

| Modulo | Rota atual frontend | Endpoint alvo backend (PLAN) | Contrato OpenAPI | Acao Fase 5 |
|---|---|---|---|---|
| M01 | /m01/alunos | /api/alunos | Sim | Implementar endpoint alvo e manter shim temporario |
| M01 | /m01/checkins | /api/acesso/checkin | Sim | Implementar endpoint alvo e manter shim temporario |
| M02 | /m02/inadimplencia/desbloqueios | /api/acesso/{alunoId}/desbloquear | Sim | Ajustar payload para incluir alunoId canonico |
| M08 | /m08/comunicacoes/disparos | /api/comunicacoes/disparos | Sim | Implementar endpoint canonico e retirar legado |

## Decisoes de Integracao

1. Backend da Fase 5 devera priorizar endpoints alvo /api/*.
2. Endpoints /m01/*, /m02/* e /m08/* serao mantidos apenas como shim de compatibilidade durante transicao.
3. Quando o backend alvo estiver estavel, o frontend migrara apiRoutes para /api/* e removera legado.

## Criterios de saida da transicao

1. Testes de integracao passam com rotas /api/*.
2. Nenhuma tela depende de rota legado /m01/*, /m02/*, /m08/*.
3. Shim legado removido do backend e do frontend.
