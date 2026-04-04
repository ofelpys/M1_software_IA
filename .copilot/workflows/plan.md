# WORKFLOWS/PLAN.MD — Diagrama de Fases do Projeto

> **Propósito**: Estado consolidado das fases e próximos passos de execução  
> **Escopo**: Rede Força Total Academias (M1)  
> **Última revisão**: 4 de abril de 2026

---

## 1. Status Atual das Fases

```
Fase 0 — Init         ✅ COMPLETA
Fase 1 — Analysis     ✅ COMPLETA
Fase 2 — Design       ✅ COMPLETA (SPEC-001 a SPEC-008)
Fase 3 — Planning     ✅ COMPLETA (PLAN-001 a PLAN-008)
Fase 4 — Prototyping  🚧 EM ANDAMENTO
Fase 5 — Development  ❌ NÃO INICIADA
```

Resumo:
- 8 SPECs criadas e publicadas em docs/requisitos/04-specs/
- 8 PLANs criadas e publicadas em docs/requisitos/05-plans/
- 70 RFs rastreadas
- Zero bloqueadores críticos abertos
- Pacote inicial Fase 4 criado em docs/requisitos/06-prototipos/fase-4-iron/

---

## 2. Entregáveis Concluídos

### Fase 2 (Design)
- SPEC-001-cadastro-acesso.md
- SPEC-002-financeiro.md
- SPEC-003-relatorios-dashboards.md
- SPEC-004-avaliacao-evolucao.md
- SPEC-005-professores.md
- SPEC-006-equipamento-salas.md
- SPEC-007-insumos-produtos.md
- SPEC-008-comunicacao-notificacoes.md

### Fase 3 (Planning)
- PLAN-001-cadastro-acesso.md
- PLAN-002-financeiro.md
- PLAN-003-relatorios-dashboards.md
- PLAN-004-avaliacao-evolucao.md
- PLAN-005-professores.md
- PLAN-006-equipamento-salas.md
- PLAN-007-insumos-produtos.md
- PLAN-008-comunicacao-notificacoes.md

---

## 3. Próxima Fase Ativa (Fase 4)

### Objetivo
Construir protótipos navegáveis e alinhamento visual/UX antes da implementação completa.

### Entrada
- PLAN-001 a PLAN-008 completas
- Constituição e decisões de DUVs ratificadas

### Atividades
1. Criar mockups HTML/CSS para fluxos críticos (cadastro, acesso, financeiro, relatórios).
2. Criar stubs de componentes React para telas-chave.
3. Validar navegação e estados de erro/sucesso com stakeholders.
4. Consolidar feedback e congelar baseline de protótipo.

### Saída Esperada
- Protótipos aprovados para início da Fase 5.
- Lista de ajustes de UX priorizada.
- Critérios de aceitação visuais por módulo.

---

## 4. Fase 5 (Desenvolvimento)

### Pré-condições
- Prototipagem da Fase 4 validada.
- Sequenciamento de implementação por PLAN definido.

### Ordem recomendada
1. PLAN-001 + PLAN-002
2. PLAN-003
3. PLAN-004 a PLAN-008 em paralelo

### Metas técnicas
- Backend Spring Boot + PostgreSQL com Flyway
- Frontend React com estrutura por módulos
- Cobertura de testes conforme rules.md
- Deploy em ambiente de staging

---

## 5. Checklist de Inicialização de Sessão

Ao retomar o projeto:
1. Ler .copilot/memory/constitution.md
2. Ler .copilot/memory/project-state.md
3. Ler .copilot/memory/decision-log.md (últimas decisões)
4. Ler .copilot/logs/task-log.md (último fechamento)

---

## Encerramento

Este plano mantém o direcionamento operacional atualizado:
- Fases 0 a 3 encerradas
- Fase 4 em execução com protótipo inicial entregue
- Fase 5 pronta para iniciar após validação de protótipo
