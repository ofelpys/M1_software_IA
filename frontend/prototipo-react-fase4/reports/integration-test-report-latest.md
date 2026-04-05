# Relatorio de Testes de Integracao (Latest)

- Data: 2026-04-05
- Projeto: frontend/prototipo-react-fase4

## Resumo

- test:integration: PASS
- test:integration:real: PASS (backend local Spring Boot + profile local)
- build: PASS
- smoke backend M01-M08: PASS (GET/POST endpoints operacionais)

## Observacao

Este arquivo representa o ultimo snapshot de validacao local apos ativacao da Fase 5.
Maven foi provisionado localmente em `tools/apache-maven-3.9.9` e o fluxo real foi
validado contra `http://localhost:8080` com perfil canonico.
Foi executado smoke test operacional com payload real para M02-M08 e leitura GET
de todos os modulos ativos, com respostas HTTP 200.
Para rodar novamente:

- `RUN_REAL_API_TESTS=true`
- `REAL_API_BASE_URL=http://localhost:8080`
