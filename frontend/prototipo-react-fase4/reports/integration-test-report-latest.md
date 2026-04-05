# Relatorio de Testes de Integracao (Latest)

- Data: 2026-04-05
- Projeto: frontend/prototipo-react-fase4

## Resumo

- test:integration: PASS
- test:integration:real: PASS (backend local Spring Boot + PostgreSQL local)
- build: PASS
- smoke backend M01-M08: PASS (GET/POST endpoints operacionais)
- backend integration (MockMvc): PASS com cobertura expandida M03/M04/M05

## Observacao

Este arquivo representa o ultimo snapshot de validacao local apos ativacao da Fase 5.
Fluxos de integracao real foram validados contra `http://127.0.0.1:8080` com backend
conectado ao PostgreSQL local (`forca_total`) e migrations Flyway aplicadas.
Tambem foi ampliada a cobertura de testes integrados do backend para os endpoints
canonicos dos modulos M03/M04/M05.
Para rodar novamente:

- `RUN_REAL_API_TESTS=true`
- `REAL_API_BASE_URL=http://127.0.0.1:8080`
