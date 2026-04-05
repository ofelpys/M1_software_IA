# Backend Fase 5 - Forca Total API

Backend canonico da Fase 5 alinhado com:
- docs/requisitos/04-specs/OPENAPI-M01-M02-M08.yaml
- docs/requisitos/05-plans/PLAN-001-cadastro-acesso.md
- docs/requisitos/05-plans/PLAN-002-financeiro.md
- docs/requisitos/05-plans/PLAN-008-comunicacao-notificacoes.md

## Escopo MVP

Este backend foi concebido para MVP: validar contratos, fluxos criticos e operacao inicial dos modulos.

Nao representa, nesta fase, uma plataforma enterprise completa com requisitos avancados de resiliencia e operacao em larga escala.

## Stack

- Java 21 (LTS)
- Spring Boot 3.3.x
- Flyway
- PostgreSQL (prod) / H2 local (profile local)

## Endpoints canonicos implementados

- POST /api/alunos
- GET /api/alunos
- GET /api/alunos/{alunoId}
- PUT /api/alunos/{alunoId}
- DELETE /api/alunos/{alunoId} (soft delete)
- POST /api/acesso/checkin
- POST /api/acesso/{alunoId}/desbloquear
- POST /api/pagamentos
- GET /api/pagamentos
- PUT /api/pagamentos/{pagamentoId}
- DELETE /api/pagamentos/{pagamentoId} (soft delete)
- POST /api/comunicacoes/disparos
- GET /api/notificacoes
- POST /api/usuarios/{usuarioId}/preferencias
- GET /api/usuarios/{usuarioId}/preferencias
- GET /api/relatorios/kpis
- POST /api/avaliacoes
- GET /api/avaliacoes
- POST /api/professores
- GET /api/professores
- POST /api/equipamentos
- GET /api/equipamentos
- POST /api/insumos
- GET /api/insumos

## Hardening de API

- `@RestControllerAdvice` global para padronizar respostas de erro
- Tratamento de validacao (`400`), payload invalido (`400`), conflito de dados (`409`) e erro inesperado (`500`)
- Payload de erro padrao com timestamp, status, mensagem e path

## Endpoints legados de transicao (shim)

- POST /m01/alunos
- POST /m01/checkins
- POST /m02/inadimplencia/desbloqueios
- POST /m08/comunicacoes/disparos

## Flyway baseline

- V001__criar_tabela_aluno.sql
- V002__criar_tabela_registro_acesso.sql
- V003__criar_tabela_desbloqueio_acesso.sql
- V004__criar_tabela_comunicacao_disparo.sql
- V005__adicionar_ativo_aluno.sql
- V006__criar_tabelas_modulos_m02_m08.sql

## Execucao local

Pre-requisito: Maven instalado localmente no PATH (`mvn`).

```powershell
cd backend/forca-total-api
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

Health check:
- GET http://localhost:8080/actuator/health

## Perfis de execucao

- `local`:
	- datasource H2 em memoria
	- Flyway habilitado
	- uso recomendado para desenvolvimento local
- `test`:
	- datasource H2 em memoria
	- Flyway desabilitado para testes de fluxo rapido (MockMvc)
- `default` (sem profile explicito):
	- configuracao orientada a PostgreSQL via variaveis (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`)

Comandos uteis:

```powershell
# desenvolvimento local com migrations
mvn spring-boot:run -Dspring-boot.run.profiles=local

# testes (suite rapida + smoke de Flyway)
mvn test
```

## Integracao com frontend (teste real)

No frontend, usar:
- RUN_REAL_API_TESTS=true
- REAL_API_BASE_URL=http://localhost:8080

E executar:

```powershell
cd frontend/prototipo-react-fase4
npm.cmd run test:integration:real
```

## Aderencia aos PLANs (status atual)

- PLAN-001 (Cadastro/Acesso): CRUD de alunos + check-in + desbloqueio implementados
- PLAN-002 (Financeiro): desbloqueio + CRUD operacional minimo de pagamentos
- PLAN-003 (Relatorios): endpoint KPI operacional implementado
- PLAN-004 a PLAN-007: endpoints operacionais minimos implementados (GET/POST por modulo)
- PLAN-008 (Comunicacao): disparo + listagem de notificacoes + preferencias por usuario
