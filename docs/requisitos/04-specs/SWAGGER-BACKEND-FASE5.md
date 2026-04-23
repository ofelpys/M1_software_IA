# Swagger Backend Fase 5

## Objetivo

Validar e explorar os endpoints reais do projeto pela interface Swagger/OpenAPI.

## Como acessar

Com o backend local rodando:

- Swagger UI: `http://127.0.0.1:8080/swagger-ui/index.html`
- OpenAPI JSON: `http://127.0.0.1:8080/v3/api-docs`

## Endpoints principais para validação

### M01 - Cadastro e acesso

- `POST /api/alunos`
- `GET /api/alunos`
- `GET /api/alunos/{alunoId}`
- `PUT /api/alunos/{alunoId}`
- `DELETE /api/alunos/{alunoId}`
- `POST /api/acesso/checkin`

### M02 - Financeiro e desbloqueio

- `POST /api/acesso/{alunoId}/desbloquear`
- `POST /api/pagamentos`
- `GET /api/pagamentos`
- `PUT /api/pagamentos/{pagamentoId}`
- `DELETE /api/pagamentos/{pagamentoId}`

### M03 a M08

- `GET /api/relatorios/kpis`
- `POST/GET/PUT/DELETE /api/avaliacoes`
- `POST/GET/PUT/DELETE /api/professores`
- `POST/GET/PUT/DELETE /api/equipamentos`
- `POST/GET/PUT/DELETE /api/insumos`
- `POST /api/comunicacoes/disparos`
- `POST/GET/PUT/DELETE /api/notificacoes`
- `GET/PUT /api/notificacoes/preferencias/{usuarioId}`

## Cenário recomendado de validação

1. Criar aluno com `status=Ativo` em `POST /api/alunos`.
2. Rodar check-in em `POST /api/acesso/checkin` com CPF do aluno.
3. Atualizar status para `Inadimplente` em `PUT /api/alunos/{alunoId}`.
4. Repetir check-in e validar resposta de bloqueio.
5. Desbloquear em `POST /api/acesso/{alunoId}/desbloquear`.
6. Confirmar retorno para `status=Ativo` em `GET /api/alunos`.

## Observações

- O frontend usa esses endpoints para receita dinâmica, inadimplência e desbloqueio sincronizado.
- Em ambiente local, prefira executar a stack com `INICIE_O_PROGRAMA.ps1` antes de validar no Swagger.
