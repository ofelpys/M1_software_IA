# DECISION-LOG.MD — Histórico de Decisões Críticas

> **Propósito**: Registrar TODAS as decisões de projeto (por quê não foram feitas de outra forma)  
> **Mantido por**: Copilot + Engenharia Sênior  
> **Formato**: Decisão → Contexto → Alternativas → Por quê → Impacto

---

## Decisão #1: Stack Tecnológico — PostgreSQL

**Data**: 1 de abril de 2026  
**Versão Constitution**: 1.0  
**Tomada por**: Engenharia Sênior  
**Status**: ✅ **RATIFICADA**

### Contexto
- Conflito: PostgreSQL (docs 1-2) vs MySQL (prompt_inicial.txt)
- Bloqueador crítico para iniciar migrations
- Impacto: Drivers, ORM, procedures, deployment

### Decisão Final
🔴 **PostgreSQL 15+**

### Alternativas Consideradas
| Alternativa | Motivo Rejeição |
|---|---|
| MySQL 8.x | Menos suitable para Spring Data JPA, tipos limitados (sem UUID nativo) |
| MongoDB | Não é RDBMS (requisitos de integridade relacional) |
| Redis | Apenas cache, não suporta estrutura de dados necessária |

### Justificativa
1. Dois documentos de requisitos indicam PostgreSQL (autoridade > prompt inicial)
2. Melhor integração Spring Boot:  UUID, arrays, JSON nativos
3. PL/pgSQL mais potente que MySQL procedures
4. Flyway suporta ambos, mas PostgreSQL mais test-friendly

### Impacto Técnico
```
✅ pom.xml: org.postgresql:postgresql
✅ application.properties: spring.jpa.database=POSTGRESQL
✅ Migrations: Flyway com sintaxe PL/pgSQL
✅ JPA: @Column(columnDefinition="uuid")
✅ Procedures: CREATE OR REPLACE FUNCTION ... LANGUAGE plpgsql
```

### Impacto Operacional
```
✅ Deploy: Container PostgreSQL (Docker/Kubernetes)
✅ Backup: pg_dump nativo
✅ Monitoramento: pgAdmin ou DataGrip
```

### Reversão Impossível?
Não. Mas exigiria:
- Refazer todas as migrations
- Adaptar procedures
- Retestagem completa
- Re-approval

**Recomendação**: Não considerar mudança.

---

## Decisão #2: Modelo de Comissionamento de Professor

**Data**: 1 de abril de 2026  
**Versão Constitution**: 1.0  
**Tomada por**: Engenharia Sênior (recomendação)  
**Status**: ⏳ **AGUARDANDO RATIFICAÇÃO DE JONATHAN**

### Contexto
- Ambiguidade: Por aula? Por aluno? Por plano? Combinação?
- RF-PROF-04 a RF-PROF-07 bloqueadas
- Risco: Erro de cálculo → Fraude ou insatisfação de professor

### Decisão Proposta
🟠 **MODELO HÍBRIDO**

```
Comissão Mensal = (A) + (B) + (C)

Onde:
(A) = 70% da receita das aulas ministradas
(B) = 5% de cada novo aluno captado pelo professor
(C) = Bônus de desempenho (configurável)
     └─ Se frequência ≥ 95% → +10% do mês
     └─ Se novos alunos ≥ meta → +5% do mês
```

### Alternativas Consideradas
| Modelo | Vantagem | Desvantagem | Rejeição |
|---|---|---|---|
| **A) Por Aula** | Simples, transparente | Não incentiva venda/novos alunos | Parcial (adotado em A) |
| **B) Por Aluno** | Incentiva crescimento | Não recompensa execução | Parcial (adotado em B) |
| **C) Por Plano** | Alinha com receita | Complicado, pouco usado | Não adotado |
| **D) Híbrido** | Equilibra ambos | Mais complexo, mais configurações | ✅ **PROPOSTO** |

### Justificativa do Modelo Híbrido
1. **Parte A (70% aula)**: Recompensa o professor que *executa* bem (recorrência, satisfação aluno)
2. **Parte B (5% novo)**: Incentiva *venda* (crescimento, receita nova)
3. **Parte C (bônus)**: Motiva *excellence* (qualidade, retenção)

### Impacto Técnico
```
RF-PROF-04: Service → calcularComissaoMensal()
  Input: professor_id, mes
  Process: SUM(aulas * % receita) + COUNT(new_alunos) * 0.05 + bônus
  Output: comissao_mensal, detalhamento

RF-PROF-05: Controller GET /professores/{id}/comissao-prevista
  Retorna projeção em tempo real

Testes: 100% cobertura de cenários (aula, novos, bônus combinado)
```

### Impacto Operacional
```
✅ Configurável em application.properties (% pode mudar por política)
✅ Relatório mensal: Breakdown de cada component
✅ Auditoria: Log de cálculo preservado
✅ Ajuste manual: Se erro, coordenador pode revisar
```

### Próximos Passos
1. ⏳ Jonathan confirma modelo
2. ⏳ Jonathan define % exatos
3. ⏳ Jonathan define bônus (valor/critério)
4. ✅ Converter para SPEC-PROF-001
5. ✅ Implementar RF-PROF-04 a 07

---

## Decisão #3: Integração com Catraca de Acesso

**Data**: 1 de abril de 2026  
**Versão Constitution**: 1.0  
**Tomada por**: Engenharia Sênior  
**Status**: ✅ **RATIFICADA** (por descope)

### Contexto
- Questão: Catraca é Fase 1 ou Futuro?
- RF-ACE-07: "Integração futura com catraca"
- Infraestrutura: Nem todas unidades têm
- ROP-02: 3 cliques de check-in (funciona sem catraca)

### Decisão Final
🟡 **FUTURO (NÃO FASE 1)**

### Alternativas Consideradas
| Alternativa | Motivo Rejeição |
|---|---|
| Catraca na Fase 1 | Hardware unknown, dinheiro ?, complexo |
| Catraca em Fase 2 | Descope conforme scope creep |
| Catraca Futuro | ✅ **ACEITO** |

### Justificativa
1. Check-in manual atende ROP-02 (3 cliques) e RF-ACE-01 a 06
2. Não há definição clara de hardware em cada unidade
3. Escopo Fase 1 é MVP (minimum viable product)
4. Catraca não é bloqueador para ir live

### Funcionalidade Fase 1: Check-in Manual
```
1. Recepcionista abre página de check-in
2. Escaneia CPF (leitor de código barras) ou digita manualmente
3. Sistema valida status em <2 seg
4. Sistema libera/bloqueia acesso
5. Registra timestamp em RegistroAcesso
Total: 3 interações ✅ (ROP-02)
```

### Roadmap Futuro: Integração Catraca
```
Fase 2: Catraca (quando decidido)
├─ API REST: /api/v1/catraca/validar-acesso
├─ Webhook: Catraca → Sistema (entrada registrada)
├─ Síncrono: Catraca puxa status de aluno
└─ Offline: Catraca cacheada (6h)

RF-ACE-07 será ativado nesta fase.
```

### Impacto
```
Fase 1: Sem impacto (defer completamente)
Futuro: +30% dev time para integração + testes
```

---

## Decisão #4: Stack Frontend — React (Confirmada)

**Data**: 1 de abril de 2026  
**Status**: ✅ **JÁ RATIFICADA**

React confirmado em todos documentos. Sem conflito.

---

## Decisão #5: Stack Backend — Spring Boot (Confirmada)

**Data**: 1 de abril de 2026  
**Status**: ✅ **JÁ RATIFICADA**

Java + Spring Boot confirmado. Sem conflito.

---

## Decisão #6: Fase 2 — Quando e Como Gerar 8 SPECs?

**Data**: 2 de abril de 2026, 08:00  
**Versão Constitution**: 1.2  
**Tomada por**: Engenharia Sênior  
**Status**: ✅ **EXECUTADA & RATIFICADA**

### Contexto
- Fase 1 (normalização) completada 100%
- Questão: Quando gerar 8 especificações (SPECs)?
- Opções: Hoje vs próxima semana? Sequencial vs paralelo?
- Timing: Equipe pronta, DUVs todas resolvidas

### Decisão Final
🟢 **SEQUENCIAL com Prompts Estruturados (HOJE, 2 abr)**

### Alternativas Consideradas
| Alternativa | Motivo Rejeição |
|---|---|
| Próxima semana | Demora desnecessária; momentum perdido; equipe pronta agora |
| Paralelo (8 devs gerando) | Team não escalada; IA mantém contexto melhor sequencial |
| Hybrid (3 hoje + 5 depois) | Nega momentum; todos devem sair juntos |

### Justificativa (Rationale)
1. **Momentum**: Contexto vivo após Fase 1 → gerar AGORA
2. **IA Quality**: Sequencial permite ajustes incrementais vs paralelo
3. **Rastreabilidade**: Cada SPEC referencia anteriores
4. **Team Ready**: Dev pode começa 3 abr em SPEC-001
5. **Blueprint**: Template prompts em todas 8 → qualidade uniforme

### Impacto Técnico
```
✅ 8 SPECs criadas (docs/requisitos/04-specs/SPEC-*.md)
✅ 70 RFs especificados
✅ 50+ tabelas database
✅ 60+ endpoints API
✅ 240+ test cases
✅ Stack confirmado: Spring Boot 3.0 + React 18 + PostgreSQL
```

### Impacto Operacional
```
✅ project-state.md: Fase 2 = 100% COMPLETA
✅ GitHub: Commit "Fase 2 Concluida com sucesso" (2 abr 11:00)
✅ Dev Team: Onboard em 3 abr
✅ Timeline: 2,5 dias (Fase 1+2) vs 8-10 semanas planejado
```

### Execução
```
2 abr 09:00 — Início SPEC generation
2 abr 09:00 — SPEC-001: 15 RFs, 5.000 linhas ✅
2 abr 09:20 — SPEC-002: 9 RFs, 5.200 linhas ✅
2 abr 09:40 — SPEC-003: 9 RFs, 5.000 linhas ✅
2 abr 10:00 — SPEC-004 a 008: 37 RFs, 19.500 linhas ✅
2 abr 10:30 — Documentação atualizada ✅
2 abr 11:00 — GitHub push ✅
2 abr 11:30 — FASE 2 COMPLETA 🎉
Tempo Total: 2h 58min (planejado 2h 30min) ✅
```

### Decisões Relacionadas

**D-FASE2-A**: Use **Template Prompts Standardizados**
- Padrão: 15 RFs bem-detalhadas por SPEC
- Benefício: Qualidade uniforme, rápido
- Executado: Sim ✅

**D-FASE2-B**: **Publica ao GitHub após Fase 2**
- Branch: master
- Commit: "Fase 2 Concluida com sucesso"
- Executado: 2 abr 11:00 ✅

**D-FASE2-C**: **All DUVs Resolved Before SPEC Gen**
- DUV-02, 03, 04, 06, 07: Todas resolvidas ✅
- Bloqueador evitado: SPECs incorretas

---

## Decisões Pendentes (Aguardando Resolução)

| ID | Questão | Status | Responsável |
|---|---|---|---|
| - | **TODAS RESOLVIDAS** | ✅ | - |
| DUV-02 | Professor: PC/celular | ✅ RESOLVIDA (2 abr) | Jonathan |
| DUV-03 | Comissão: % exatos | ✅ RESOLVIDA (2 abr) | Jonathan |
| DUV-04 | Cônjuges: compartilham | ✅ RESOLVIDA (2 abr) | Jonathan |
| DUV-06 | Carência: quantos dias | ✅ RESOLVIDA (2 abr) | Jonathan |
| DUV-07 | Produtos: venda | ✅ RESOLVIDA (2 abr) | Jonathan |

**Status**: ZERO DUVs abertas = ZERO bloqueadores críticos ✅

---

## Protocolo de Atualização

Quando uma nova decisão é tomada:

```
1. Adicionar seção aqui (Decisão #N)
2. Incluir: Contexto, Alternativas, Justificativa, Impacto
3. Atualizar constitution.md se decision é "lei"
4. Atualizar project-state.md com novo status
5. Registrar em task-log.md
```

---

## Encerramento

Este log preserva **por que o projeto é do jeito que é**. Protege contra:
- ❌ Mudar de ideia sem justificativa
- ❌ Esquecer alternativas consideradas
- ❌ Refazer trabalho já decidido
- ✅ Rastreabilidade total

**Lei**: Toda mudança de decisão deve ser registrada aqui como **Revisão**.
