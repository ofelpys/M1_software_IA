# MEMORY-BANK-STRUCTURE.MD — Estrutura e Consistencia

> Ultima atualizacao: 23 de abril de 2026

---

## 1. Estrutura oficial

```
.copilot/
|- core/
|  |- rules.md
|  |- contexts.md
|  `- patterns.md
|- memory/
|  |- constitution.md
|  |- decision-log.md
|  |- duv-resolutions.md
|  |- fase-2-completion-summary.md
|  |- memory-bank-structure.md
|  `- project-state.md
|- workflows/
|  |- plan.md
|  |- FASE-3-PLANNING.md
|  `- FASE-3-RESUMO-EXECUTIVO.md
`- logs/
   `- task-log.md
```

---

## 2. Papel de cada arquivo chave

- `project-state.md`: snapshot operacional canonico.
- `constitution.md`: decisoes supremas e governanca.
- `decision-log.md`: historico de decisoes com impacto.
- `duv-resolutions.md`: status das duvidas resolvidas.
- `plan.md`: estado das fases e proximo sequenciamento.
- `task-log.md`: historico de marcos/sessoes.

---

## 3. Regra de sincronizacao obrigatoria

Se o status do projeto mudar, atualizar em conjunto:
1. `project-state.md`
2. `plan.md`
3. `README.md` da `.copilot`
4. `task-log.md`

Quando houver decisao nova:
5. `decision-log.md`
6. `constitution.md` (se for decisao estrutural)

---

## 4. Integridade

- Evitar manter status de fase conflitante entre arquivos.
- Evitar referencias a caminhos inexistentes.
- Priorizar fatos verificaveis por arquivo de codigo/teste/script.
