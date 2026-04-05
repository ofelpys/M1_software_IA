# DoR - Fase 5 (Go-Live Readiness)

Data: 5 de abril de 2026
Escopo: Entrada controlada da implementacao backend + integracao real

## Definicao de Pronto (DoR)

### A. Contratos e Rastreabilidade

- [x] Contrato formal OpenAPI criado para M01, M02 e M08
- [x] Matriz de alinhamento de rotas frontend x backend publicada
- [x] DTOs canonicos de request/response definidos no contrato
- [x] Referencias cruzadas com SPEC/PLAN atualizadas

### B. Frontend Integracao

- [x] Gateways por modulo com contratos formais em uso
- [x] Politica de fallback central definida (auto/strict)
- [x] Modo estrito disponivel para testes de integracao real
- [x] Teste de fluxo critico automatizado

### C. Backend Preparacao

- [ ] Projeto Spring Boot criado no repositorio
- [ ] DTOs Java implementados conforme OpenAPI
- [ ] Flyway configurado no backend
- [ ] Primeiras migrations reais aplicaveis criadas

### D. Qualidade e Evidencias

- [x] test:integration local com status PASS
- [ ] test:integration:real em staging com status PASS
- [x] Relatorio latest atualizado com resultado e limitacoes

## Bloqueadores atuais

1. Backend Spring Boot ainda nao existe no repositorio (faltam DTOs Java e Flyway executavel).
2. Sem URL de staging/API real ativa para validar test:integration:real como PASS.

## Decisao operacional

Fase 5 pode iniciar com prioridade em:
1. scaffold backend
2. DTOs + endpoints alvo /api/*
3. Flyway baseline
4. ativacao do teste real em staging
