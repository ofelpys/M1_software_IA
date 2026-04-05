# PLAN-007 — Insumos & Produtos (Implementação Técnica)

> Versão: 1.1  
> Data: 5 de abril de 2026  
> Baseado em: SPEC-007-insumos-produtos.md  
> RFs Cobertas: RF-INSUMO-01 a 08  
> Situação do documento: alinhado ao estado real do projeto (MVP operacional)

---

> Nota de escopo MVP: este PLAN descreve implementacao tecnica orientada ao MVP operacional. Itens tipicos de plataforma enterprise entram como backlog de evolucao.

## 1. Diagnóstico Real (Abr/2026)

- Backend implementado: criação e listagem de insumos/produtos.
- Frontend implementado: tela de insumos integrada ao gateway.
- Banco implementado para este módulo: `insumo_produto` (estrutura simplificada).
- Não implementado ainda: movimentação de estoque formal, alertas automáticos e fluxo completo de requisição de compra.

---

## 2. Escopo de Dados Ajustado

### 2.1 Tabela real já existente

- `insumo_produto`

### 2.2 Tabelas alvo sob demanda funcional

- `categoria_produto`
- `movimentacao_estoque`
- `alerta_validade`
- `requisicao_compra`
- `item_requisicao`

Observação: o escopo atual é suficiente para operação inicial. Expansão será conduzida por necessidade de estoque e compras.

---

## 3. API Real vs Alvo

### 3.1 Endpoints implementados

- `POST /api/insumos`
- `GET /api/insumos`

### 3.2 Endpoints pendentes

- atualização/inativação
- movimentações de entrada/saída
- alertas de validade/estoque baixo
- fluxo de requisição e aprovação de compra

---

## 4. Backlog Priorizado

1. P0: completar CRUD e ajustes de status de estoque.
2. P1: registrar movimentação com auditoria.
3. P1: alertas por validade e nível mínimo.
4. P2: módulo completo de requisições de compra.

---

## 5. Critérios de Aceite Atualizados

- Implementado (MVP): cadastro e listagem operacionais.
- Parcial: padronização de categorias/status.
- Pendente: movimentação, alertas e compras.

---

## 6. Status

Status real: módulo funcional básico com roadmap aberto para gestão completa de estoque.
