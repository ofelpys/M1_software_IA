# Mapa-Mestre de Consolidação — Sistema Rede Força Total Academias

> **Status**: Fase 1 concluída (normalização de requisitos)  
> **Data**: 1 de abril de 2026  
> **Documentos analisados**:
> - `docs/requisitos/01-normalizados/forca-total-historia-operabilidade.md`
> - `docs/requisitos/01-normalizados/forca-total-objetivos-requisitos-iniciais.md`

---

## 1. Conflitos Identificados entre Documentos

### CONFLITO-001 — Stack Tecnológico - **ALINHADO**

| Aspecto | Documento 1 (História) | Documento 2 (Requisitos) | Prompt Inicial | **Status** |
|---|---|---|---|---|
| **Frontend** | React | React | React | ✅ ALINHADO |
| **Backend** | Java Spring Boot | Java Spring Boot | Spring Boot | ✅ ALINHADO |
| **Banco** | PostgreSQL | PostgreSQL | MySQL | ⚠️ CONFLITO |

**Análise**: 
- Documentos 1 e 2 mencionam **PostgreSQL** explicitamente
- `prompt_inicial.txt` menciona **MySQL**
- **Severidade**: 🟠 MÉDIA — Afeta estrutura de migrations, drivers, tipos de dados

**Decisão Pendente**: `DP-TECH-STACK-001`
- **Questão**: PostgreSQL é a escolha oficial ou MySQL?
- **Impacto**: Flyway vs Liquibase, tipos de dados, procedures, performance
- **Ação necessária**: Confirmação com direção técnica do projeto

---

### CONFLITO-002 — Integração com Catraca de Acesso

| Documento | Posição | Detalhes |
|---|---|---|
| **História** | Não menciona catraca | Problema é manual na recepção |
| **Requisitos** | Menciona integração futura | "com integração com catraca ou registro manual" |
| **Operabilidade** | Pergunta aberta | "Há integração física ou acesso é registrado manualmente?" |

**Análise**:
- Não há definição clara se catraca é:
  - Futuro (nice-to-have)
  - Fase 1 (essencial)
  - Não aplicável (operação 100% manual)
- **Severidade**: 🟠 MÉDIA — Afeta arquitetura de integração hardware

**Decisão Pendente**: `DP-CATRACA-001`
- **Questão**: Integração com catraca é escopo inicial ou futuro?
- **Impacto**: API de integração, hardware necessário, treinamento de recepção
- **Ação necessária**: Confirmação com Jonathan sobre infraestrutura de cada unidade

---

### CONFLITO-003 — Acesso de Professor ao Sistema

| Documento | Posição |
|---|---|
| **Requisitos** | "Os professores terão acesso ao sistema via computador na academia ou precisam de acesso por celular?" (DUV-02) |
| **Operabilidade** | Não menciona |
| **Premissas** | Implica web responsivo |

**Análise**:
- Questão aberta se professor acessa via **computador fixo na academia** ou via **celular pessoal**
- Diferenças significativas:
  - Computador fixo: controle do proprietário, segurança maior
  - Celular: flexibilidade, mas resiliência de conexão importante
- **Severidade**: 🟠 MÉDIA — Afeta arquitetura front (responsive vs app nativo)

**Decisão Pendente**: `DP-ACESSO-PROF-001`
- **Questão**: Computador compartilhado ou acesso por celular (ou ambos)?
- **Impacto**: Desenvolvimento mobile, SSO, segurança
- **Ação necessária**: Entrevista com professores

---

### CONFLITO-004 — Modelo de Comissionamento de Professores

| Documento | Posição |
|---|---|
| **História** | "Comissões por aulas avulsas ou planos personalizados são calculadas no final do mês" |
| **Requisitos** | RF-PROF-04: "% configurável por tipo de aula" + DUV-03: "por aluno ativo, por aula, por plano, ou combinação?" |
| **Operabilidade** | Pergunta aberta sem resposta |

**Análise**:
- Três modelos mencionados:
  1. Por aula ministrada (RF-PROF-04)
  2. Por aluno ativo (DUV-03)
  3. Por plano vendido (DUV-03)
  4. Combinação de múltiplos (DUV-03)
- **Severidade**: 🔴 CRÍTICA — Afeta cálculo de receita, auditoria financeira, satisfação de professor

**Decisão Pendente**: `DP-COMISSAO-PROF-001`
- **Questão**: Qual modelo exato de comissionamento? Variações por tipo de aula?
- **Impacto**: Lógica de negócio complexa, validação em 2 camadas, testes extensivos
- **Ação necessária**: Análise de histórico com Jonathan, entrevista com coordenadores

---

### CONFLITO-005 — Planos Compartilhados entre Cônjuges/Dependentes

| Documento | Posição | Detalhe |
|---|---|---|
| **Requisitos** | RF-CAD-03: "Validar unicidade de CPF" | Implica 1 CPF = 1 aluno |
| **Operabilidade** | DUV-04: "Há alunos com planos compartilhados entre cônjuges ou dependentes?" | **Questão aberta** |

**Análise**:
- Requisito força 1 CPF = 1 aluno
- Mas operabilidade questiona se cônjuges podem compartilhar plano
- Impacto na modelagem:
  - Se SIM: plano pode ter múltiplos alunos (matrícula adicional, desconto em cascata?)
  - Se NÃO: cada aluno precisa de matrícula separada (premissa atual)
- **Severidade**: 🟠 MÉDIA — Afeta modelo de dados, preço de plano

**Decisão Pendente**: `DP-PLANO-COMPARTILHADO-001`
- **Questão**: Planos compartilhados são permitidos?
- **Impacto**: Modelagem de matrícula, cálculo de receita, check-in
- **Ação necessária**: Entrevista com Jonathan sobre política de planos

---

## 2. Dúvidas em Aberto (Extraídas do Documento de Requisitos)

| ID | Pergunta | Impacto | Status |
|---|---|---|---|
| **DUV-01** | Quantas catracas/pontos de controle por unidade? Integração física ou manual? | Arquitetura hardware | ❌ Pendente |
| **DUV-02** | Computador na academia ou acesso por celular para professores? | Frontend mobile/responsive | ❌ Pendente |
| **DUV-03** | Modelo de comissionamento: por aluno, por aula, por plano, combinação? | Lógica de negócio complexa | ❌ Pendente |
| **DUV-04** | Planos compartilhados entre cônjuges/dependentes? | Modelo de matrícula | ❌ Pendente |
| **DUV-05** | Ponto de funcionários: eletrônico ou manual no sistema? | Integração com relógio | ❌ Pendente |
| **DUV-06** | Dias de carência antes de bloqueio automático por inadimplência? | Configuração de regra | ❌ Pendente |
| **DUV-07** | Venda de produtos na recepção (suplementos)? Controlar estoque? | Escopo de estoque | ❌ Pendente |
| **DUV-08** | Relatórios por email periódico ou sob demanda? | Automação de reports | ❌ Pendente |
| **DUV-09** | Avaliações físicas por qualquer professor ou designados? | Controle de permissão | ❌ Pendente |
| **DUV-10** | Integração com app móvel para aluno no futuro? | Roadmap/arquitetura | ❌ Pendente |

---

## 3. Alinhamentos Confirmados (Sem Conflito)

Os documentos **concordam** nos seguintes pontos:

| Tema | Alinhamento | Confiança |
|---|---|---|
| **Interface simples** | Ambos enfatizam: poucos cliques, sem retrabalho, acessível a recepcionista. | ✅ ALTA |
| **Multi-unidade** | Ambos: sistema deve suportar 5 unidades sem reescrita futura. | ✅ ALTA |
| **Visibilidade centralizada** | Proprietário precisa enxergar rede em tempo real, sem depender de ligações. | ✅ ALTA |
| **Integridade de dados** | Sem duplicatas, auditoria de alterações, rastreabilidade de ações. | ✅ ALTA |
| **Acesso centralizado** | Alunos cadastrados uma vez, múltiplas matrículas em unidades diferentes. | ✅ ALTA |
| **Controle de acesso integrado** | Bloqueio automático de inadimplentes, check-in por status. | ✅ ALTA |
| **Histórico preservado** | Avaliações físicas, planos de treino, comissões: todos devem ter histórico. | ✅ ALTA |
| **Relatórios gerenciais** | Dashboard do proprietário é prioridade. KPIs consolidados. | ✅ ALTA |
| **Perfis de acesso variados** | Proprietário, coordenador, professor, atendente — cada um vê o que precisa. | ✅ ALTA |
| **Stack React + Spring** | Definição clara e coerente entre documentos. | ✅ ALTA |

---

## 4. Diagramas de Severidade — Matriz de Risco

### 4.1 Áreas Críticas (Risco Alto)

```
┌─────────────────────────────────────┐
│  CRÍTICAS — Precisam de decisão JÁ   │
├─────────────────────────────────────┤
│ DP-TECH-STACK-001 (PostgreSQL vs MySQL) │
│ DP-COMISSAO-PROF-001 (Modelo comissão) │
│ DP-CATRACA-001 (Integração hardware)   │
└─────────────────────────────────────┘
```

### 4.2 Áreas Médias (Risco Moderado)

```
┌──────────────────────────────────────┐
│  MÉDIAS — Resolvidas em design       │
├──────────────────────────────────────┤
│ DP-ACESSO-PROF-001 (Computador/celular) │
│ DP-PLANO-COMPARTILHADO-001 (Cônjuges)   │
│ DUV-06 (Dias de carência)               │
│ DUV-07 (Venda de produtos)              │
└──────────────────────────────────────┘
```

### 4.3 Áreas Baixas (Risco Baixo)

```
┌─────────────────────────────────────┐
│  BAIXAS — Nice-to-have ou futuro     │
├─────────────────────────────────────┤
│ DUV-08 (Email de relatórios)         │
│ DUV-10 (App móvel para aluno)        │
│ DUV-05 (Ponto eletrônico)            │
└─────────────────────────────────────┘
```

---

## 5. Registro de Decisões Pendentes (Consolidado)

### DP-TECH-STACK-001 (Produto: Backend - PostgreSQL vs MySQL)

**Questão**: O banco de dados será PostgreSQL ou MySQL?

**Contexto**:
- Documentos 1 e 2 mencionam PostgreSQL
- `prompt_inicial.txt` menciona MySQL
- **Bloqueador**: Não pode iniciar implementação até decidir

**Próximos passos**:
1. Verificar constitution do projeto em `.specify/memory`
2. Confirmar com direção técnica
3. Uma vez decidido: atualizar migration scripts, drivers, tipos

**Impacto**:
- Flyway (PostgreSQL) vs Liquibase (compatível com ambos)
- Tipos de dados (UUID vs BIGINT, arrays, etc.)
- Procedures e functions (sintaxe diferente)
- Performance e replicação

---

### DP-COMISSAO-PROF-001 (Produto: Financeiro/RH - Modelo de Comissionamento)

**Questão**: Qual modelo exato de comissionamento dos professores?

**Contexto**:
- RF-PROF-04 menciona "% configurável por tipo de aula"
- DUV-03 questiona: "por aluno ativo, por aula, por plano, ou combinação?"
- Sem resposta, RF-PROF-04 a 07 não podem ser entregues

**Cenários possíveis**:
1. **Modelo A — Por aula**: Professor ganha % da receita de cada aula que ministra
2. **Modelo B — Por aluno**: Professor ganha por cada aluno inscrito em sua aula
3. **Modelo C — Por plano**: Professor ganha quando seu aluno compra/renova um plano
4. **Modelo D — Híbrido**: Combinação (ex.: 70% aula + 30% novos alunos)

**Próximos passos**:
1. Entrevista com Jonathan sobre histórico de comissionamento
2. Verificar prática atual em cada unidade
3. Definir em documento separado (Decisão-COMISSAO-PROF-001.md)

**Impacto**:
- Regras de negócio no Service
- Validações de cálculo
- Testes extensivos
- Interface de pré-visualização para professor

---

### DP-CATRACA-001 (Produto: Acesso - Integração Catraca)

**Questão**: Integração com catraca de acesso é escopo inicial ou futuro?

**Contexto**:
- Requisitos menciona "integração com catraca ou registro manual"
- DUV-01 pergunta: "Há integração física ou acesso é registrado manualmente?"
- Falta informação sobre hardware em cada unidade

**Cenários possíveis**:
1. **Futuro**: Check-in 100% manual na recepção (Fase 1)
2. **Fase 1**: Catraca já existe, precisa integração via API
3. **Fase 1 Parcial**: Uma ou duas unidades têm catraca, outras manual

**Próximos passos**:
1. Investigar infraestrutura atual de cada unidade
2. Confirmar se propriedade já possui catraca
3. Avaliar custo de integração vs. implementação manual

**Impacto**:
- Se Fase 1: necessário desenvolver API de integração
- Se Futuro: RF-ACE-07 fica marcado como "rascunho/futuro"
- Afeta ROP-02 (3 cliques do check-in podem reduzir a 1 com catraca)

---

## 6. Requisitos Críticos a Confirmar

| Requisito | Status | Ação |
|---|---|---|
| RF-CAD-03 (Unicidade de CPF) | ✅ Claro | Implementar |
| RF-ACE-03 (Bloqueio automático) | ⚠️ Parcial | Confirmar dias de carência |
| RF-FIN-03 (Juros/multa por atraso) | ⚠️ Parcial | Definir taxa e método |
| RF-PROF-04 (Comissão) | ❌ Bloqueado | Decisão DUV-03 |
| RF-EQUIP-07 (Alerta de estoque) | ⚠️ Parcial | Confirmar quantidade mínima |
| RF-COM-04 (Avisos de vencimento) | ⚠️ Parcial | Manual ou automático? |

---

## 7. Próximos Passos do Projeto

### Fase 1 — ✅ CONCLUÍDA
- ✅ Normalização de requisitos
- ✅ Mapa-mestre (este documento)

### Fase 2 — ⏭️ SEGUINTE
- Resolver 5 decisões pendentes
- Gerar **SPEC por fluxo crítico**:
  - SPEC-001: Cadastro e Acesso
  - SPEC-002: Financeiro e Inadimplência
  - SPEC-003: Professores e Comissões
  - Et cetera...

### Fase 3 — ⏱️ SEQUENCIAL
- Gerar **PLAN** (decisões técnicas, DB, API)
- Prototipagem de telas em React

### Fase 4 — 🎯 EXECUÇÃO
- Gerar **TASKS** (backlog técnico)
- Desenvolvimento Spring Boot + React

---

## 8. Matriz de Rastreabilidade — Requisitos → Conflitos

| Código | Requisito | Conflito Associado | Status |
|---|---|---|---|
| RF-ACE-01 a 07 | Controle de Acesso | DP-CATRACA-001 | ⚠️ Aguardando |
| RF-PROF-04 a 07 | Comissões | DP-COMISSAO-PROF-001 | ❌ Bloqueado |
| RF-CAD-02 | Múltiplas matrículas | DP-PLANO-COMPARTILHADO-001 | ⚠️ Aguardando |
| Todos | Stack do projeto | DP-TECH-STACK-001 | ⚠️ Aguardando |

---

## 9. Recomendação de Prioridade

### Fase 2.1 — CRÍTICA (Semana 1)
1. **Resolver DP-TECH-STACK-001** → Permite iniciar migrations
2. **Resolver DP-COMISSAO-PROF-001** → Permite especificar RH com precisão
3. **Resolver DP-CATRACA-001** → Define escopo de integração

### Fase 2.2 — ALTA (Semana 2)
4. **Resolver DP-ACESSO-PROF-001** → Define arquitetura frontend
5. **Resolver DP-PLANO-COMPARTILHADO-001** → Permite iniciar modelagem de dados

### Fase 2.3 — MÉDIA (Semana 3-4)
6. Responder DUV-06 a DUV-08 → Completar requisitos não-funcionais

---

## Encerramento

Este mapa consolida a **análise de Fase 1** (normalização de requisitos), identificando:
- **5 conflitos** que precisam resolução
- **10 dúvidas** em aberto
- **Alinhamentos confirmados** entre documentos
- **Matriz de risco** e prioridades

A próxima etapa é **resolver decisões pendentes** antes de iniciar **Fase 2 (Especificações)**.

**Lei de ouro**: Se não está resolvido no MAPA, não sai do papel. Não inventar novos requisitos durante implementação.
