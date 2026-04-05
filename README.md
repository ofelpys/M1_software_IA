# M1 - Rede Forca Total Academias

> **Ambiente recomendado (obrigatorio para contribuicao):** use **Maven instalado localmente** (PATH/SDKMAN/Chocolatey etc.). O repositorio **nao deve versionar binarios do Maven** em `tools/`.

> **Java LTS:** o projeto esta padronizado em **Java 21 (LTS)**, que e a LTS mais recente suportada de forma estavel pelo stack atual.

Projeto de software para gestao centralizada de uma rede de 5 academias, com foco em rastreabilidade ponta a ponta: requisito -> SPEC -> PLAN -> prototipo -> implementacao.

## Escopo do Projeto (MVP)

Este repositorio representa um MVP (Minimum Viable Product) para validacao de fluxos criticos de negocio e integracao entre modulos.

Nao e objetivo desta etapa entregar um software em nivel enterprise completo (ex.: alta disponibilidade multi-regiao, hardening avancado de seguranca, observabilidade corporativa completa, SSO corporativo, governanca formal de dados em escala).

As decisoes atuais priorizam simplicidade, entrega incremental e validacao rapida com usuarios.

Documento de referencia da concepcao do MVP:
- [Concepcao MVP v1](docs/requisitos/03-planejamento-expandido/concepcao-mvp-v1.md)

Repositorio: https://github.com/ofelpys/M1_software_IA

**BPMN do negocio (PDF): [Abrir diagrama completo](docs/requisitos/06-prototipos/bpmn-negocio-m1.pdf)**

## Status Atual

- Fase 1 (Analysis): completa
- Fase 2 (SPECs 001-008): completa
- Fase 3 (PLANs 001-008): completa
- Fase 4 (Prototipagem): em execucao avancada
- Fase 5 (Development): iniciada com backend canonico M01/M02/M08 + Flyway baseline

Resumo tecnico atualizado:
- 70 RFs rastreados entre SPECs e PLANs
- prototipo HTML da Fase 4 criado em [docs/requisitos/06-prototipos/fase-4-iron](docs/requisitos/06-prototipos/fase-4-iron)
- app React funcional em [frontend/prototipo-react-fase4](frontend/prototipo-react-fase4)
- backend canonico em [backend/forca-total-api](backend/forca-total-api)
- contratos de integracao para M01, M02 e M08
- testes de integracao de fluxo critico automatizados

## Estrutura Principal

```text
M1/
|- README.md
|- .copilot/                            # governanca, memoria e workflow do projeto
|- docs/requisitos/
|  |- 00-originais/
|  |- 01-normalizados/
|  |- 02-mapa/
|  |- 03-planejamento-expandido/
|  |- 04-specs/                         # SPEC-001..008
|  |- 05-plans/                         # PLAN-001..008
|  `- 06-prototipos/
|     `- fase-4-iron/                   # prototipo HTML/CSS/JS
|- frontend/
|  `- prototipo-react-fase4/            # prototipo React + integracao + testes
|- backend/
|  `- forca-total-api/                  # Spring Boot + Flyway + endpoints canonicos /api
|- INDICE-COMPLETO.md
`- CONTRIBUTING.md
```

## Backend API (Fase 5)

Backend Spring Boot inicial alinhado ao OpenAPI e PLANs.

Local: [backend/forca-total-api](backend/forca-total-api)

Endpoints canonicos implementados:
- POST `/api/alunos`
- GET `/api/alunos`
- GET `/api/alunos/{alunoId}`
- PUT `/api/alunos/{alunoId}`
- DELETE `/api/alunos/{alunoId}` (soft delete)
- POST `/api/acesso/checkin`
- POST `/api/acesso/{alunoId}/desbloquear`
- POST `/api/pagamentos`
- GET `/api/pagamentos`
- PUT `/api/pagamentos/{pagamentoId}`
- DELETE `/api/pagamentos/{pagamentoId}`
- POST `/api/comunicacoes/disparos`
- GET `/api/notificacoes`
- POST `/api/usuarios/{usuarioId}/preferencias`
- GET `/api/usuarios/{usuarioId}/preferencias`
- GET `/api/relatorios/kpis`
- POST `/api/avaliacoes`
- GET `/api/avaliacoes`
- POST `/api/professores`
- GET `/api/professores`
- POST `/api/equipamentos`
- GET `/api/equipamentos`
- POST `/api/insumos`
- GET `/api/insumos`

Shim legado de transicao (para compatibilidade com frontend):
- POST `/m01/alunos`
- POST `/m01/checkins`
- POST `/m02/inadimplencia/desbloqueios`
- POST `/m08/comunicacoes/disparos`

### Bootstrap local de toolchain e testes

Para validar o ambiente local do backend (Java 21 + Maven >= 3.9.0) antes de executar os testes:

```powershell
./scripts/bootstrap-backend.ps1
```

Para validar somente a toolchain, sem rodar testes:

```powershell
./scripts/bootstrap-backend.ps1 -SkipTests
```

Script:
- [scripts/bootstrap-backend.ps1](scripts/bootstrap-backend.ps1)

## Memory Bank (.copilot)

A pasta [.copilot](.copilot) e a fonte de verdade para governanca do projeto.

Arquivos-chave:
- [.copilot/core/constitution.md](.copilot/core/constitution.md)
- [.copilot/core/rules.md](.copilot/core/rules.md)
- [.copilot/core/contexts.md](.copilot/core/contexts.md)
- [.copilot/memory/project-state.md](.copilot/memory/project-state.md)
- [.copilot/memory/decision-log.md](.copilot/memory/decision-log.md)
- [.copilot/logs/task-log.md](.copilot/logs/task-log.md)

## Frontend React (Fase 4/Fase 5)

Aplicacao em React + Vite com telas por modulo, navegação completa, feedback de erro/rede e health check da API.

Local: [frontend/prototipo-react-fase4](frontend/prototipo-react-fase4)

### Rodar localmente

```bash
cd frontend/prototipo-react-fase4
npm install
npm run dev
```

### Build e preview estavel

```bash
cd frontend/prototipo-react-fase4
npm run build
npm run preview
```

## Integracao API e Fallback

O frontend usa gateways por modulo com client HTTP centralizado:
- M01: cadastro e acesso
- M02: financeiro
- M08: comunicacao

Arquivos principais:
- [frontend/prototipo-react-fase4/src/services/httpClient.js](frontend/prototipo-react-fase4/src/services/httpClient.js)
- [frontend/prototipo-react-fase4/src/services/apiRoutes.js](frontend/prototipo-react-fase4/src/services/apiRoutes.js)
- [frontend/prototipo-react-fase4/src/modules/m01-cadastro-acesso/m01Gateway.js](frontend/prototipo-react-fase4/src/modules/m01-cadastro-acesso/m01Gateway.js)
- [frontend/prototipo-react-fase4/src/modules/m02-financeiro/m02Gateway.js](frontend/prototipo-react-fase4/src/modules/m02-financeiro/m02Gateway.js)
- [frontend/prototipo-react-fase4/src/modules/m08-comunicacao/m08Gateway.js](frontend/prototipo-react-fase4/src/modules/m08-comunicacao/m08Gateway.js)

Variaveis de ambiente usadas no frontend:
- `VITE_API_BASE_URL`
- `VITE_API_HEALTH_PATH`
- `VITE_API_STRICT_MODE` (legado para M01)
- `VITE_API_FALLBACK_MODE` (`auto` ou `strict`)
- `VITE_API_FALLBACK_M01`, `VITE_API_FALLBACK_M02`, `VITE_API_FALLBACK_M08`
- `VITE_API_ROUTE_PROFILE` (`legacy` ou `canonical`)
- `VITE_RUNTIME_ENV` (`development` ou `production`)

Comportamento relevante:
- fallback para mock quando a API real falha (modo padrao)
- modo estrito por modulo via politica central (`integrationPolicy.js`)
- em runtime de producao, modo `auto` e promovido para `strict`
- perfil de rotas `canonical` aponta para endpoints alvo `/api/*`

## Testes de Integracao

Os testes estao no frontend React e usam o runner nativo do Node.

Arquivos:
- [frontend/prototipo-react-fase4/tests/integration/critical-flow.test.mjs](frontend/prototipo-react-fase4/tests/integration/critical-flow.test.mjs)
- [frontend/prototipo-react-fase4/tests/integration/critical-flow.real-api.test.mjs](frontend/prototipo-react-fase4/tests/integration/critical-flow.real-api.test.mjs)

Executar:

```bash
cd frontend/prototipo-react-fase4
npm run test:integration
```

Opcional (API real em staging):

```bash
cd frontend/prototipo-react-fase4
set RUN_REAL_API_TESTS=true
set REAL_API_BASE_URL=https://seu-staging
npm run test:integration:real
```

Relatorios:
- [frontend/prototipo-react-fase4/reports/integration-test-report-latest.md](frontend/prototipo-react-fase4/reports/integration-test-report-latest.md)

Contratos formais e alinhamento (Fase 4.5):
- [docs/requisitos/04-specs/OPENAPI-M01-M02-M08.yaml](docs/requisitos/04-specs/OPENAPI-M01-M02-M08.yaml)
- [docs/requisitos/02-mapa/matriz-alinhamento-rotas-fase4-5.md](docs/requisitos/02-mapa/matriz-alinhamento-rotas-fase4-5.md)
- [docs/requisitos/05-plans/DOR-FASE-5-go-live-readiness.md](docs/requisitos/05-plans/DOR-FASE-5-go-live-readiness.md)

## Rastreadibilidade

Documentos centrais de rastreabilidade:
- [docs/requisitos/02-mapa/matriz-rastreabilidade.md](docs/requisitos/02-mapa/matriz-rastreabilidade.md)
- [docs/requisitos/04-specs](docs/requisitos/04-specs)
- [docs/requisitos/05-plans](docs/requisitos/05-plans)

Estado consolidado:
- alinhamento SPEC x PLAN e PLAN x Matriz revisado
- cobertura de RFs mapeada para 8 modulos

## Proximos Passos Recomendados

1. Consolidar a concepcao do MVP (escopo In/Out, DoD, riscos e ondas de evolucao) como base da fase atual.
2. Rodar validacao em ambiente de staging real com URL publicada (smoke + fluxo critico).
3. Subir PostgreSQL de desenvolvimento e validar Flyway no banco alvo definitivo.
4. Expandir pacote de endpoints canonicos com cobertura dos modulos M03/M04/M05.
5. Publicar relatorio de integracao real em staging com status PASS.

## Autoria

- Proprietario do negocio: Jonathan Rodrigues Barbosa
- Arquitetura e engenharia de software: Felipe Costa Monteiro

Ultima atualizacao: 05/04/2026
