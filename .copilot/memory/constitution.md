# CONSTITUTION.MD — A Lei Suprema do Projeto M1

> **Versão**: 1.0  
> **Data**: 1 de abril de 2026  
> **Status**: Em vigor  
> **Autoridade**: Engenharia Sênior

---

## 1. Resolução de Conflitos Críticos

Neste documento, resolvemos os 3 bloqueadores críticos identificados no mapa-mestre.

### DP-TECH-STACK-001 — Stack Tecnológica

**Conflito**: PostgreSQL (docs) vs MySQL (prompt_inicial.txt)

**DECISÃO FINAL**: 🔴 **POSTGRESQL**

**Justificativa**:
- Documentos de requisitos (1 e 2) especificam PostgreSQL
- Melhor suporte a tipos avançados (UUID, arrays)
- Melhor integração com Spring Boot + Flyway
- Stack padrão do projeto academico

**Implementações imediatas**:
```
1. Configurar pom.xml com postgresql:postgresql driver
2. application.properties: spring.jpa.database=POSTGRESQL
3. Migrations Flyway usando sintaxe PostgreSQL
4. Procedures em PL/pgSQL
```

**Lei**: Nenhuma alteração de banco sem nova decisão explícita aqui.

---

### DP-COMISSAO-PROF-001 — Modelo de Comissionamento

**Conflito**: Por aula? Por aluno? Por plano? Híbrido?

**DECISÃO FINAL**: 🟢 **MODELO POR ALUNO MENSAL**

**Especificação**:
```
Comissão = Alunos_Ativos × VLA × Percentual

Onde:
- Alunos_Ativos = total de alunos ativos no mês
- VLA = valor do plano / 30
- Percentual = configurável por professor/política
```

**Justificativa**:
- Simplifica fechamento mensal e auditoria
- Dá previsibilidade para financeiro e professores
- Reduz ambiguidade de cálculo na implementação

**Configurabilidade**:
```java
// Em application.properties ou ConfigEntity
professor.comissao.modelo = por_aluno_mensal
professor.comissao.percentual-padrao = 0.15
professor.comissao.dia-fechamento = 5
```

**Lei**: Se professor pede mudança, must ter aprovação de Jonathan via novo Decision Document.

---

### DP-CATRACA-001 — Integração de Catraca

**Conflito**: Futuro ou Fase 1?

**DECISÃO FINAL**: 🟡 **FUTURO (NÃO FASE 1)**

**Justificativa**:
- Investigação preliminar: nem todas unidades têm catraca
- RF-ACE-07 marcado como "futuro possível"
- Escopo Fase 1 é contenção (mínimo viável)
- Check-in manual funciona com 3 cliques (ROP-02)

**Escopo Fase 1**: Check-in 100% manual na recepção
- Recepcionista escaneia CPF (usando leitor de código de barras ou digitação)
- Sistema valida status
- Sistema registra timestamp
- Acesso liberado/bloqueado

**Futuro (Fase 2)**: Integração com catraca
- Desenvolver API REST para comunicação com catraca
- Suportar webhooks de entrada
- Síncrono: catraca puxa status do sistema

**Lei**: RF-ACE-07 bloqueada até nova decisão.

---

## 2. Stack Definitivo (Confirmado e Imutável)

| Componente | Decisão | Status |
|---|---|---|
| **Frontend** | React 18+ | ✅ CONFIRMADO |
| **Backend** | Spring Boot 3.x | ✅ CONFIRMADO |
| **Database** | PostgreSQL 15+ | ✅ **RESOLVIDO** (Constitution) |
| **Migrations** | Flyway | ✅ CONFIRMADO |
| **Auth** | JWT (HS256) | ✅ CONFIRMADO |
| **Validation** | Bean Validation 3.x | ✅ CONFIRMADO |
| **Testing** | JUnit5 + Mockito + Jest | ✅ CONFIRMADO |
| **HTTP Client** | Axios (React) + RestTemplate (Java) | ✅ CONFIRMADO |

---

## 3. Resoluções de Dúvidas (DUVs)

| Dúvida | Resolução | Data | Impacto |
|---|---|---|---|
| **DUV-02**: Prof PC ou celular? | ✅ PC/Desktop | 2026-04-02 | Frontend desktop-first |
| **DUV-03**: Comissão modelo exato | ✅ Por aluno mensal | 2026-04-02 | RF-PROF-04 a 07 destravadas |
| **DUV-04**: Cônjuges compartilham? | ✅ Não (usuários separados) | 2026-04-02 | Modelo de matrícula/auditoria |
| **DUV-06**: Dias carência bloqueio? | ✅ 3 dias corridos | 2026-04-02 | RF-ACE-03 configurada |
| **DUV-07**: Venda produtos? | ✅ Sim (Whey + Creatina) | 2026-04-02 | Escopo de produtos definido |

---

## 4. Hierarquia Absoluta de Verdade

```
Este documento (Constitution.md)
  ↓
.copilot/core/rules.md
  ↓
.copilot/core/contexts.md
  ↓
docs/requisitos/02-mapa/mapa-mestre.md
  ↓
docs/requisitos/01-normalizados/
  ↓
specs/*/spec.md
  ↓
specs/*/plan.md
  ↓
specs/*/tasks.md
  ↓
Código
```

**Se há conflito entre dois níveis, o mais alto vence. Sempre.**

---

## 5. Regras de Governança

### 5.1 Mudanças na Constitution

- Somente eng sênior pode editar
- Requer discussão com stakeholder (Jonathan, se negócio)
- Todas as mudanças registradas em `decision-log.md`
- Versão incrementada (1.0 → 1.1, etc)

### 5.2 Violações de Constitution

Violação = Desvio não autorizado de qualquer decisão aqui.

**Consequências**:
- PR bloqueado automaticamente
- Refeito do zero
- Revisão postmortem com team

---

## 6. Data de Vigência

**Vigente desde**: 1 de abril de 2026

**Revisão prevista**: 15 de abril de 2026

---

## 7. Assinaturas (Ratificação)

| Papel | Nome | Data | Assinatura |
|---|---|---|---|
| Eng Sênior | [Seu Nome] | 2026-04-01 | ✅ |
| Proprietário | Jonathan R. Barbosa | 2026-04-02 | ✅ |
| Tech Lead | [A definir] | [Pendente] | ⏳ |

---

## Encerramento

Esta Constitution define as 3 decisões críticas que estavam bloqueando o projeto:

1. ✅ **Stack**: PostgreSQL confirmado
2. ✅ **Comissionamento**: Modelo por aluno mensal confirmado
3. ✅ **Catraca**: Futuro, não Fase 1

O projeto **pode prosseguir para Fase 4/5** com confiança.

Toda future decision será registrada como addendum a este documento.
