# PLAN-001 — Cadastro & Acesso (Implementação Técnica)

> Versão: 1.1  
> Data: 5 de abril de 2026  
> Baseado em: SPEC-001-cadastro-acesso.md  
> RFs Cobertas: RF-CAD-01 a 08, RF-ACE-01 a 07  
> Situação do documento: alinhado ao estado real do projeto (MVP operacional)

---

> Nota de escopo MVP: este PLAN descreve implementacao tecnica orientada ao MVP operacional. Itens tipicos de plataforma enterprise entram como backlog de evolucao.

## 1. Diagnóstico Real (Abr/2026)

- Backend implementado: cadastro de aluno (CRUD), check-in e desbloqueio manual.
- Frontend implementado: tela operacional de cadastro/acesso integrada via gateway e fallback.
- Banco implementado para este módulo: `aluno`, `registro_acesso`, `desbloqueio_acesso`.
- Não implementado ainda neste módulo: autenticação JWT, RBAC completo multi-tenant, trilha de auditoria completa por entidade.

---

## 2. Escopo de Dados Ajustado

### 2.1 Tabelas reais já existentes

- `aluno`
- `registro_acesso`
- `desbloqueio_acesso`

### 2.2 Tabelas alvo (quando houver necessidade de negócio)

- `usuario`
- `papel`
- `usuario_papel_academia`
- `matricula`
- `bloqueio_acesso`
- `auditoria_log`

Observação: a meta de "200+ tabelas" não é necessária para o escopo atual. O produto está em estágio modular MVP; crescimento de schema deve ocorrer por necessidade funcional validada, não por volume artificial.

---

## 3. API Real vs Alvo

### 3.1 Endpoints implementados

- `POST /api/alunos`
- `GET /api/alunos`
- `GET /api/alunos/{alunoId}`
- `PUT /api/alunos/{alunoId}`
- `DELETE /api/alunos/{alunoId}` (soft-delete)
- `POST /api/acesso/checkin`
- `POST /api/acesso/{alunoId}/desbloquear`

### 3.2 Endpoints planejados e ainda pendentes

- `POST /api/auth/login`
- `POST /api/auth/refresh-token`
- `POST /api/auth/logout`
- endpoints administrativos de usuários/perfis
- endpoints de auditoria detalhada

---

## 4. Backlog Priorizado

1. P0: autenticação e autorização (JWT + roles mínimas).
2. P0: padronizar regras de bloqueio/desbloqueio com origem financeira.
3. P1: trilha de auditoria por operação crítica.
4. P1: paginação/filtros avançados em listagem de alunos.
5. P2: refinamento multi-tenant completo por academia.

---

## 5. Critérios de Aceite Atualizados

- Implementado (MVP): CRUD de aluno + check-in + desbloqueio operacional.
- Parcial: validações avançadas e rastreabilidade completa.
- Pendente: JWT/RBAC, auditoria completa, multi-tenant pleno.

---

## 6. Status

Status real: em produção técnica de MVP, não concluído em nível enterprise.
