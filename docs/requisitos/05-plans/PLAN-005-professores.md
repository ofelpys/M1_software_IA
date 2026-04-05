# PLAN-005 — Professores (Implementação Técnica)

> Versão: 1.1  
> Data: 5 de abril de 2026  
> Baseado em: SPEC-005-professores.md  
> RFs Cobertas: RF-PROF-01 a 08  
> Situação do documento: alinhado ao estado real do projeto (MVP operacional)

---

> Nota de escopo MVP: este PLAN descreve implementacao tecnica orientada ao MVP operacional. Itens tipicos de plataforma enterprise entram como backlog de evolucao.

## 1. Diagnóstico Real (Abr/2026)

- Backend implementado: criação e listagem de professores.
- Frontend implementado: tela de professores integrada ao gateway.
- Banco implementado para este módulo: `professor` (estrutura simplificada).
- Não implementado ainda: agenda de aulas, performance avançada, ranking e integração com comissão completa.

---

## 2. Escopo de Dados Ajustado

### 2.1 Tabela real já existente

- `professor`

### 2.2 Tabelas alvo sob demanda funcional

- `professor_academia`
- `horario_professor`
- `aula_professor`
- `inscricao_aula`
- `performance_professor`

Observação: manter evolução por ciclos. A modelagem alvo permanece válida, porém não deve ser tratada como concluída.

---

## 3. API Real vs Alvo

### 3.1 Endpoints implementados

- `POST /api/professores`
- `GET /api/professores`

### 3.2 Endpoints pendentes

- detalhes/edição/exclusão de professor
- horários e agenda de aula
- performance/ranking e visão de comissão

---

## 4. Backlog Priorizado

1. P0: CRUD completo de professor (incluindo atualização e inativação).
2. P1: módulo de horários e agenda.
3. P1: indicadores de performance por período.
4. P2: ranking e integração completa com comissionamento.

---

## 5. Critérios de Aceite Atualizados

- Implementado (MVP): cadastro e listagem básicos.
- Parcial: governança de status e contratos de dados.
- Pendente: agenda, performance e regras avançadas do SPEC.

---

## 6. Status

Status real: módulo funcional básico, ainda distante da cobertura total planejada.
