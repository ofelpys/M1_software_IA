# PLAN-006 — Equipamento & Salas (Implementação Técnica)

> Versão: 1.1  
> Data: 5 de abril de 2026  
> Baseado em: SPEC-006-equipamento-salas.md  
> RFs Cobertas: RF-EQUIP-01 a 08  
> Situação do documento: alinhado ao estado real do projeto (MVP operacional)

---

> Nota de escopo MVP: este PLAN descreve implementacao tecnica orientada ao MVP operacional. Itens tipicos de plataforma enterprise entram como backlog de evolucao.

## 1. Diagnóstico Real (Abr/2026)

- Backend implementado: criação e listagem de equipamentos.
- Frontend implementado: tela operacional de equipamentos integrada ao gateway.
- Banco implementado para este módulo: `equipamento` (estrutura simplificada).
- Não implementado ainda: gestão de salas, agenda por horário e manutenção detalhada.

---

## 2. Escopo de Dados Ajustado

### 2.1 Tabela real já existente

- `equipamento`

### 2.2 Tabelas alvo sob demanda funcional

- `sala`
- `agenda_sala`
- `manutencao_equipamento`

Observação: o módulo cobre inventário mínimo. Agenda de salas e manutenção avançada permanecem como evolução planejada.

---

## 3. API Real vs Alvo

### 3.1 Endpoints implementados

- `POST /api/equipamentos`
- `GET /api/equipamentos`

### 3.2 Endpoints pendentes

- atualização/inativação de equipamento
- agenda e disponibilidade de salas
- manutenção preventiva/corretiva

---

## 4. Backlog Priorizado

1. P0: completar CRUD de equipamentos.
2. P1: modelar salas e agendamento sem conflito.
3. P1: registrar histórico de manutenção.
4. P2: alertas automáticos de manutenção próxima.

---

## 5. Critérios de Aceite Atualizados

- Implementado (MVP): cadastro e listagem de equipamentos.
- Parcial: padronização de status e campos operacionais.
- Pendente: salas, agenda e manutenção avançada.

---

## 6. Status

Status real: funcional para inventário básico, com roadmap aberto para operação completa.
