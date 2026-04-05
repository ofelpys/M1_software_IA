# PLAN-002 — Financeiro (Implementação Técnica)

> Versão: 1.1  
> Data: 5 de abril de 2026  
> Baseado em: SPEC-002-financeiro.md  
> RFs Cobertas: RF-FIN-01 a 09  
> Situação do documento: alinhado ao estado real do projeto (MVP operacional)

---

> Nota de escopo MVP: este PLAN descreve implementacao tecnica orientada ao MVP operacional. Itens tipicos de plataforma enterprise entram como backlog de evolucao.

## 1. Diagnóstico Real (Abr/2026)

- Backend implementado: CRUD operacional de pagamentos e endpoint de desbloqueio por inadimplência.
- Frontend implementado: tela financeira integrada para operação básica.
- Banco implementado para este módulo: `pagamento` (estrutura simplificada).
- Não implementado ainda: motor de inadimplência completo, cálculo automático de comissão, views analíticas avançadas e export financeiro.

---

## 2. Escopo de Dados Ajustado

### 2.1 Tabelas reais já existentes

- `pagamento`

### 2.2 Tabelas alvo sob demanda funcional

- `inadimplencia`
- `comissao_calculo`
- `comissao_pagamento`
- `configuracao_financeira`

Observação: manter modelagem incremental. Não existe necessidade técnica de inflar banco para "200 tabelas" neste estágio.

---

## 3. API Real vs Alvo

### 3.1 Endpoints implementados

- `POST /api/pagamentos`
- `GET /api/pagamentos`
- `PUT /api/pagamentos/{pagamentoId}`
- `DELETE /api/pagamentos/{pagamentoId}`
- `POST /api/acesso/{alunoId}/desbloquear`

### 3.2 Endpoints planejados e pendentes

- gestão completa de inadimplência (listar, bloquear, desbloquear automatizado)
- cálculo/fechamento de comissões
- dashboard financeiro e exportações

---

## 4. Backlog Priorizado

1. P0: consolidar regra financeira de bloqueio/desbloqueio integrada ao módulo de acesso.
2. P0: adicionar status e transições de pagamento com histórico.
3. P1: implantar inadimplência estruturada.
4. P1: implantar cálculo de comissão com fechamento mensal.
5. P2: exportações e indicadores avançados.

---

## 5. Critérios de Aceite Atualizados

- Implementado (MVP): operações centrais de pagamento.
- Parcial: regras de inadimplência e indicadores.
- Pendente: comissão, export e automações de fechamento.

---

## 6. Status

Status real: operacional para fluxo básico, não concluído para gestão financeira completa.
