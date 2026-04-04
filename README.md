# M1 - Rede Forca Total Academias

Projeto de software para gestao centralizada de uma rede de 5 academias, com foco em rastreabilidade ponta a ponta: requisito -> SPEC -> PLAN -> prototipo -> implementacao.

Repositorio: https://github.com/ofelpys/M1_software_IA

## Status Atual

- Fase 1 (Analysis): completa
- Fase 2 (SPECs 001-008): completa
- Fase 3 (PLANs 001-008): completa
- Fase 4 (Prototipagem): em execucao avancada
- Fase 5 (Development): em preparacao, com frontend ja integrado por contratos e testes de fluxo critico

Resumo tecnico atualizado:
- 70 RFs rastreados entre SPECs e PLANs
- prototipo HTML da Fase 4 criado em [docs/requisitos/06-prototipos/fase-4-iron](docs/requisitos/06-prototipos/fase-4-iron)
- app React funcional em [frontend/prototipo-react-fase4](frontend/prototipo-react-fase4)
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
|- INDICE-COMPLETO.md
`- CONTRIBUTING.md
```

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
- `VITE_API_STRICT_MODE`

Comportamento relevante:
- fallback para mock quando a API real falha (modo padrao)
- modo estrito para M01 quando `VITE_API_STRICT_MODE=true`

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

## Rastreadibilidade

Documentos centrais de rastreabilidade:
- [docs/requisitos/02-mapa/matriz-rastreabilidade.md](docs/requisitos/02-mapa/matriz-rastreabilidade.md)
- [docs/requisitos/04-specs](docs/requisitos/04-specs)
- [docs/requisitos/05-plans](docs/requisitos/05-plans)

Estado consolidado:
- alinhamento SPEC x PLAN e PLAN x Matriz revisado
- cobertura de RFs mapeada para 8 modulos

## Proximos Passos Recomendados

1. Conectar backend Spring Boot real aos contratos existentes (M01, M02, M08).
2. Expandir contratos e testes para M03, M04, M05, M06 e M07.
3. Subir pipeline CI para build + testes de integracao no frontend.
4. Iniciar implementacao do backend conforme PLANs priorizados.

## Autoria

- Proprietario do negocio: Jonathan Rodrigues Barbosa
- Arquitetura e engenharia de software: Felipe Costa Monteiro

Ultima atualizacao: 04/04/2026
