# PLAN-008 — Comunicação & Notificações (Implementação Técnica)

> Versão: 1.1  
> Data: 5 de abril de 2026  
> Baseado em: SPEC-008-comunicacao-notificacoes.md  
> RFs Cobertas: RF-COM-01 a 05  
> Situação do documento: alinhado ao estado real do projeto (MVP operacional)

---

> Nota de escopo MVP: este PLAN descreve implementacao tecnica orientada ao MVP operacional. Itens tipicos de plataforma enterprise entram como backlog de evolucao.

## 1. Diagnóstico Real (Abr/2026)

- Backend implementado: disparo de comunicação, listagem de notificações e preferências por usuário.
- Frontend implementado: tela de comunicação integrada ao gateway.
- Banco implementado para este módulo: `notificacao`, `preferencia_notificacao`, `comunicacao_disparo`.
- Não implementado ainda: integrações externas reais (email/sms/push), templates versionados, retry assíncrono robusto e schedulers de negócio.

---

## 2. Escopo de Dados Ajustado

### 2.1 Tabelas reais já existentes

- `notificacao`
- `preferencia_notificacao`
- `comunicacao_disparo`

### 2.2 Tabelas alvo sob demanda funcional

- `template_notificacao`
- `log_comunicacao`

Observação: o módulo está apto para fluxo interno de comunicação. Integrações externas devem entrar por etapa controlada.

---

## 3. API Real vs Alvo

### 3.1 Endpoints implementados

- `POST /api/comunicacoes/disparos`
- `GET /api/notificacoes`
- `POST /api/usuarios/{usuarioId}/preferencias`
- `GET /api/usuarios/{usuarioId}/preferencias`

### 3.2 Endpoints pendentes

- marcação granular de leitura por notificação
- templates administrativos
- status de gateways externos e reprocessamento automático

---

## 4. Backlog Priorizado

1. P0: completar ciclo de estado da notificação (pendente, enviada, lida, falha).
2. P1: integrar provedor externo de email com fila/retry.
3. P1: criar templates e versionamento.
4. P2: ampliar para SMS/push e agendamentos por evento.

---

## 5. Critérios de Aceite Atualizados

- Implementado (MVP): disparo e consulta básica de notificações, preferências por usuário.
- Parcial: rastreabilidade de estados e observabilidade.
- Pendente: integrações externas e automações completas.

---

## 6. Status

Status real: módulo operacional interno, ainda sem stack completa de mensageria externa.
