# Protótipo React - Fase 4

Base React inicial para transição da Fase 4 para Fase 5.

## Escopo MVP

Este frontend e um prototipo funcional de MVP para validar experiencia de uso, navegacao e fluxos criticos.

Nao e, nesta etapa, um produto enterprise completo (ex.: design system corporativo consolidado, internacionalizacao ampla, acessibilidade em nivel de certificacao e operacao multi-tenant em larga escala).

## Como rodar

1. npm install
2. npm run dev
3. npm run test:integration

## Teste de integração com API real (staging)

1. Definir variáveis no PowerShell:
  - $env:RUN_REAL_API_TESTS="true"
  - $env:REAL_API_BASE_URL="http://localhost:8080"
  - $env:VITE_API_ROUTE_PROFILE="canonical"
2. Executar:
  - npm run test:integration:real

Observações:

- Sem as variáveis acima, o teste real é automaticamente ignorado (skip).
- O teste real força modo estrito no M01 (sem fallback local).

## Relatórios de execução

- Último snapshot: reports/integration-test-report-latest.md
- Snapshot datado: reports/integration-test-report-2026-04-04.md
- Consistência visual (mapa de telas): reports/visual-consistency-report-2026-04-05.md

## API (passo 2)

- Base URL da API real: VITE_API_BASE_URL
- Exemplo (PowerShell): $env:VITE_API_BASE_URL="http://localhost:8080/api"
- Endpoint de saúde da API: VITE_API_HEALTH_PATH (padrão: /health)
- Exemplo (PowerShell): $env:VITE_API_HEALTH_PATH="/actuator/health"
- Se a API não responder, o app usa fallback automático para mock.
- Politica central de fallback em `src/services/integrationPolicy.js`:
  - `VITE_API_FALLBACK_MODE=auto|strict`
  - `VITE_API_FALLBACK_M01=auto|strict`
  - `VITE_API_FALLBACK_M02=auto|strict`
  - `VITE_API_FALLBACK_M08=auto|strict`
  - `VITE_RUNTIME_ENV=development|production` (producao promove `auto` para `strict`)
- Compatibilidade legado: `VITE_API_STRICT_MODE=true` continua valido para M01.
- Perfil de rotas em `src/services/apiRoutes.js`:
  - `VITE_API_ROUTE_PROFILE=legacy` (padrao atual)
  - `VITE_API_ROUTE_PROFILE=canonical` (alvo de Fase 5, endpoints `/api/*`)
- Tipos de fallback padronizados no feedback:
  - timeout: API indisponível por tempo de resposta excedido
  - network: API indisponível por falha de conexão
  - http 4xx/5xx: API indisponível por rejeição/erro interno
- O Topbar mostra status em tempo real da API (online/offline) e botão Atualizar.

## Escopo

- Tema industrial/iron aplicado
- Grid 12 colunas com gap 8px
- Componentes base reaproveitáveis
- Telas por módulo (M01-M08 + operação)
- Fluxos críticos implementados:
  - recepção/check-in rápido
  - inadimplência/desbloqueio
  - comunicação com sucesso/falha

## Mapa de Telas (M01-M08)

- Dashboard executivo: DashboardScreen
- M01 Cadastro e Acesso: CadastroScreen + RecepcaoScreen
- M02 Financeiro: FinanceiroScreen
- M03 Relatórios e Dashboards: RelatoriosScreen
- M04 Avaliação e Evolução: AvaliacaoScreen
- M05 Professores: ProfessoresScreen
- M06 Equipamentos e Salas: EquipamentosScreen
- M07 Insumos e Produtos: InsumosScreen
- M08 Comunicação e Notificações: ComunicacaoScreen
- Operação e checklist técnico: OperacaoScreen

Validação de consistência menu/título/tela:
- Status: PASS
- Evidência: reports/visual-consistency-report-2026-04-05.md

## Evolução (passos executados)

- Passo 1: Componentização de domínio criada
  - MetricCard
  - CheckinPanel
  - DelinquencyTable
  - CommunicationPanel
- Passo 2: Camada de serviços mock adicionada em src/services/mockApi.js
- Passo 3: Início do módulo M01-cadastro-acesso
  - Formulário de cadastro com validação de CPF
  - Integração da tela de cadastro com o módulo
- Passo 2 (iniciado): Contratos HTTP + fallback
  - requestJson em src/services/httpClient.js
  - rotas em src/services/apiRoutes.js
  - gateway M01 em src/modules/m01-cadastro-acesso/m01Gateway.js
  - gateway M02 em src/modules/m02-financeiro/m02Gateway.js
  - gateway M08 em src/modules/m08-comunicacao/m08Gateway.js
  - telas exibem origem da resposta: API real ou modo simulado
  - telas exibem motivo padronizado quando ocorre fallback

- Passo 1 (concluído): Contratos formais backend
  - M01: src/contracts/m01.contract.js
  - M02: src/contracts/m02.contract.js
  - M08: src/contracts/m08.contract.js

- Passo 2 (evoluído): Modo estrito para persistência real no M01
  - Variável: VITE_API_STRICT_MODE=true
  - Sem fallback no M01 quando API estiver indisponível

- Passo 4 (concluído): Fechamento Fase 4.5 para entrada da Fase 5
  - OpenAPI formal: docs/requisitos/04-specs/OPENAPI-M01-M02-M08.yaml
  - Matriz de rotas: docs/requisitos/02-mapa/matriz-alinhamento-rotas-fase4-5.md
  - DoR da Fase 5: docs/requisitos/05-plans/DOR-FASE-5-go-live-readiness.md
  - Politica de fallback central aplicada em M01, M02 e M08

- Passo 3 (concluído): Teste de integração do fluxo crítico
  - Arquivo: tests/integration/critical-flow.test.mjs
  - Fluxo: cadastro -> check-in -> desbloqueio financeiro -> disparo comunicação
  - Variante real API: tests/integration/critical-flow.real-api.test.mjs

## Estrutura

- src/components: blocos compartilhados
- src/components/domain: componentes de domínio
- src/services: serviços mock de integração
- src/modules/m01-cadastro-acesso: módulo inicial M01
- src/screens: telas por módulo
- src/App.jsx: orquestração de navegação
