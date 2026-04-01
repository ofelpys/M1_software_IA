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

## Decisões Pendentes (Aguardando Resolução)

| ID | Questão | Prazo | Responsável | Prioridade |
|---|---|---|---|---|
| **DUV-02** | Professor acessa via PC compartilhado ou celular pessoal? | 2 dias | Jonathan | 🔴 P0 |
| **DUV-03** | Comissionamento: % exatos e bônus | 2 dias | Jonathan | 🔴 P0 |
| **DUV-04** | Cônjuges podem compartilhar plano? | 3 dias | Jonathan | 🟡 P1 |
| **DUV-06** | Quantos dias de carência antes de bloqueio? | 3 dias | Jonathan | 🟡 P1 |
| **DUV-07** | Vende suplementos/produtos? | 3 dias | Jonathan | 🟡 P1 |

---

## Protocolo de Atualização

Quando uma nova decisão é tomada:

```
1. Adicionar seção aqui (Decisão #N)
2. Incluir: Contexto, Alternativas, Justificativa, Impacto
3. Atualizar constitution.md se decision é "lei"
4. Atualizar project-state.md com novo status
5. Registrar em task-log-YYYY-MM-DD.md
```

---

## Encerramento

Este log preserva **por que o projeto é do jeito que é**. Protege contra:
- ❌ Mudar de ideia sem justificativa
- ❌ Esquecer alternativas consideradas
- ❌ Refazer trabalho já decidido
- ✅ Rastreabilidade total

**Lei**: Toda mudança de decisão deve ser registrada aqui como **Revisão**.
