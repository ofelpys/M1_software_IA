# CONTEXTS.MD — Contextos de Conhecimento do Projeto M1

> **Propósito**: Repository centralizado de todo conhecimento do projeto  
> **Atualizado**: 1 de abril de 2026  
> **Escopo**: Rede Força Total Academias

---

## 1. Contexto de Negócio

### 1.1 O Proprietário

- **Nome**: Jonathan Rodrigues Barbosa
- **Experiência**: 5 anos no mercado fitness
- **Rede**: 5 unidades ativas
- **Alunos**: 2.000+ matriculados
- **Funcionários**: 40+ profissionais
- **Problema-chave**: Fragmentação de dados, falta de visibilidade consolidada

### 1.2 Dor Principal

**"Preciso enxergar a rede como um todo, em tempo real, sem depender de planilhas e ligações para gerentes."**

Isto determina:
- Centralização absoluta de dados
- Dashboard de proprietário como feature crítica
- Relatórios gerenciais simples mas efetivos

### 1.3 Stakeholders

| Persona | Necessidade | Ferramenta |
|---|---|---|
| **Jonathan** (Proprietário) | Visão consolidada | Dashboard/Relatórios |
| **Coordenador** (Unidade) | Gerenciar sua unidade | Admin panel |
| **Recepcionista** | Check-in rápido | Terminal check-in |
| **Professor** | Ver alunos, planos | Portal professor |
| **Aluno** | Consultar plano, evolução | Web/Mobile (futuro) |

---

## 2. Stack Definitivo (AGUARDANDO RESOLUÇÃO)

### 2.1 Confirmado

| Camada | Decisão | Status |
|---|---|---|
| **Frontend** | React | ✅ CONFIRMADO |
| **Backend** | Java Spring Boot | ✅ CONFIRMADO |
| **Autenticação** | JWT + Spring Security | ✅ CONFIRMADO |
| **Migrations** | Flyway | ✅ CONFIRMADO |
| **Testing** | JUnit5 + Jest | ✅ CONFIRMADO |

### 2.2 Bloqueado (DP-TECH-STACK-001)

| Componente | Opção A | Opção B | Status |
|---|---|---|---|
| **Database** | PostgreSQL | MySQL | 🔴 **PENDENTE** |

**Impacto se PostgreSQL**:
- Drivers: `org.postgresql:postgresql`
- JPA types: UUID nativo, arrays suportados
- Functions: PL/pgSQL

**Impacto se MySQL**:
- Drivers: `mysql:mysql-connector-java`
- JPA types: Sem UUID nativo (string)
- Functions: MySQL syntax

**Decisão critica porque**:
- Migrations não podem começar sem escolha
- ORM precisa ser configurado corretamente
- Deployment assumptions mudarão

---

## 3. Arquitetura de Referência

### 3.1 Fluxo Padrão de Requisição

```
1. React Component dispara requisição
   └─ POST /api/v1/alunos (com JWT)

2. Interceptor valida token
   └─ Se inválido: 401 Unauthorized

3. Controller recebe requisição
   └─ @PostMapping("/alunos")

4. Controller valida input
   └─ @Valid @RequestBody AlunoCadastroDTO

5. Service executa lógica
   └─ alunoService.cadastrarAluno(dto)
   └─ Service valida regras de negócio
   └─ Repository acessa dados

6. Repository salva no BD
   └─ alunoRepository.save(entity)

7. Resultado volta para Service (Entity)

8. Service converte Entity → DTO

9. Controller serializa → JSON

10. Response enviada ao React
    └─ 201 Created + body com AlunoDTO
```

### 3.2 Validação em 2 Camadas

**Frontend (React)**:
- react-hook-form
- Validações de padrão (email, telefone, CPF)
- Feedback imediato ao usuário

**Backend (Spring Boot)**:
- Bean Validation (@NotNull, @Pattern, etc)
- Validações de regra de negócio (CPF duplicado, etc)
- Rejeição com mensagem apropriada

---

## 4. Requisitos Críticos em Foco

### 4.1 Top 5 Requisitos por Impacto

| Rank | Código | Descrição | Módulo | Prioridade |
|---|---|---|---|---|
| 1 | **RF-CAD-03** | Validar unicidade de CPF | M01 | 🔴 P0 |
| 2 | **RF-ACE-03** | Bloquear automaticamente inadimplentes | M02/M03 | 🔴 P0 |
| 3 | **RF-FIN-04** | Visão consolidada de inadimplência | M03 | 🔴 P0 |
| 4 | **RF-REL-01** | Dashboard proprietário com KPIs | M07 | 🔴 P0 |
| 5 | **RF-PROF-04** | Cálculo automático de comissão | M05 | 🔴 P0 |

### 4.2 Riscos Críticos

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| **DP-TECH-STACK-001 não resolvida** | 🟢 BAIXA | 🔴 CRÍTICA | Resolver hoje |
| **DP-COMISSAO-PROF-001 ambígua** | 🟡 MÉDIA | 🔴 CRÍTICA | Entrevista com Jonathan |
| **Integração catraca não clara** | 🟡 MÉDIA | 🟠 ALTA | Verificar hardware |
| **Performance em check-in** | 🟡 MÉDIA | 🟠 ALTA | Índices de DB otimizados |
| **Erro em cálculo de comissão** | 🟡 MÉDIA | 🟠 ALTA | Testes extensivos |

---

## 5. Decisões Pendentes de Negócio

| Decisão | Implicação | Prazo Crítico |
|---|---|---|
| **DP-COMISSAO-PROF-001**: Modelo de comissão | RF-PROF-04 a 07 bloqueadas | **HOJE** |
| **DP-CATRACA-001**: Integração hardware | RF-ACE-07 arquitetura | **HOJE** |
| **DP-ACESSO-PROF-001**: Professor em PC ou celular | Frontend mobile vs responsivo | **HOJE** |
| **DP-PLANO-COMPARTILHADO-001**: Cônjuges compartilham? | Modelo de dados (matrícula) | Amanhã |
| **DUV-06**: Dias de carência antes de bloqueio | RF-ACE-03 configuração | Amanhã |

---

## 6. Estrutura de Dados Preliminar

### 6.1 Entidades Principais

```
┌─────────────┐
│    ALUNO    │
│             │
│ id (PK)     │
│ cpf (UQ)    │ ← RF-CAD-03: Única no sistema
│ nome        │
│ email       │
│ telefone    │
│ data_nasc   │
└─────────────┘
      │
      │ (1:N) 
      │
┌─────────────────┐
│   MATRÍCULA     │
│                 │
│ id (PK)         │
│ aluno_id (FK)   │
│ unidade_id (FK) │
│ plano           │
│ data_matr       │
│ data_venc       │
│ status          │ ← DP-ACE-03: Ativo/Inadimplente/Cancelado
└─────────────────┘
      │
      │ (1:N)
      │
┌─────────────────┐
│   PAGAMENTO     │
│                 │
│ id (PK)         │
│ matricula_id    │
│ valor           │
│ forma (enum)    │
│ data            │
│ status          │
└─────────────────┘

```

### 6.2 Fluxo de Dados Crítico

```
Check-in (RF-ACE-01):
1. Aluno vem à academia
2. Recepcionista escaneia CPF ou digita
3. Sistema busca Aluno por CPF (índice)
4. Sistema busca Matrícula da unidade
5. Sistema verifica status (Ativo/Inadimplente/Cancelado)
   └─ Se Inadimplente: bloqueia (RF-ACE-03)
   └─ Se Ativo: libera
6. Sistema registra RegistroAcesso com timestamp

Performance:
- Busca por CPF: <50ms (índice essential)
- Busca matrícula: <50ms (índice por aluno+unidade)
- Registro de acesso: <100ms
- Total: <3 cliques (ROP-02)
```

---

## 7. Fluxos de Negócio Críticos

### 7.1 Fluxo 1: On boarding de Aluno

```
Recepcionista abre "Novo Aluno"
  ↓
Preenche: nome, CPF, email, telefone
  ↓
Sistema valida CPF (RF-CAD-03)
  └─ Se duplicado: "CPF já cadastrado"
  └─ Se válido: continua
  ↓
Seleciona plano (Bronze/Prata/Ouro)
  ↓
Sistema calcula data de vencimento (+30 dias)
  ↓
Salva Aluno + Matrícula
  ↓
Gera recibo/comprovante
  ↓
Aluno consegue fazer check-in
```

**RFs cobertos**: RF-CAD-01, RF-CAD-02, RF-CAD-03, RF-CAD-04, RF-FIN-01

---

### 7.2 Fluxo 2: Bloqueio por Inadimplência

```
Diariamente (Scheduler):
  └─ procedure: bloquear_inadimplentes()
  └─ Busca matrículas com data_venc < hoje - 7 dias
  └─ Atualiza status = "INADIMPLENTE"
  └─ Registra auditoria
  ↓
Próximo check-in do aluno inadimplente:
  └─ Sistema vê status = "INADIMPLENTE"
  └─ Nega acesso (RF-ACE-03)
  └─ Registra tentativa de acesso negado
  └─ Notifica gerente (futuro)
  ↓
Quando aluno paga:
  └─ Coordenador registra Pagamento (RF-FIN-01)
  └─ Sistema valida se quitado (RF-FIN-01)
  └─ Sistema muda status = "ATIVO"
  └─ Próximo check-in: aluno consegue entrar
```

**RFs cobertos**: RF-ACE-03, RF-ACE-04, RF-FIN-01, RF-REL-04

---

### 7.3 Fluxo 3: Geração de Relatório de Inadimplência

```
Coordenador (ou proprietário) clica "Inadimplência"
  ↓
Sistema executa VIEW inadimplencia_por_unidade
  ↓
Retorna:
  - Total de alunos inadimplentes da unidade
  - Valor total em atraso
  - Detalhamento por aluno
  ↓
Coordenador pode:
  - Filtrar por período
  - Exportar PDF/Excel
  - Ver ações tomadas (auditoria)
```

**RFs cobertos**: RF-FIN-04, RF-REL-03, RF-REL-05

---

## 8. Performance Baseada em Requisitos

### 8.1 SLAs Críticos (RNF-06)

| Operação | Target | Justificativa |
|---|---|---|
| Check-in de aluno | < 2 seg | ROP-02 (3 cliques em ritmo balcão) |
| Consulta de pagamentos | < 1 seg | Dashboard em tempo real |
| Geração de relatório | < 5 seg | Consulta mensal, aceitável |
| Cálculo de comissão | < 30 seg | Processamento noturno (job) |

### 8.2 Índices Críticos

```sql
-- OBRIGATÓRIOS
CREATE INDEX idx_aluno_cpf ON aluno(cpf);        -- RF-CAD-03
CREATE INDEX idx_matricula_status ON matricula(status);  -- RF-ACE-03
CREATE INDEX idx_acesso_aluno ON registro_acesso(aluno_id, data_hora);
CREATE INDEX idx_pagamento_matricula ON pagamento(matricula_id);    -- RF-FIN-01
```

---

## 9. Conversas com Stakeholders (Extraído de Docs)

### 9.1 Jonathan (Proprietário)

**Necessidade expressa**:
> "Eu preciso saber, em tempo real, quantos alunos ativos tenho no total e por unidade, qual é a receita do mês, quem está devendo e tomar uma ação coordenada sobre a inadimplência."

**Implicação**:
- Dashboard deve carregar em <2 seg
- KPIs consolidados na primeira tela
- Dados sempre atualizados

### 9.2 Coordenadores (Unidade)

**Necessidade implícita** (da história):
> "Eu preciso confirmar o status do aluno na hora do check-in, sem esperar por sistema genérico de academia antiga."

**Implicação**:
- Check-in deve ser rápido (<3 cliques)
- Interface simples
- Offline resilience (futuro)

### 9.3 Recepcionistas

**Necessidade** (da história):
> "Eu preciso de um sistema tão simples que eu possa usar sem treinamento."

**Implicação**:
- Campos obrigatórios mínimos
- Botões grandes e claros
- Mensagens de erro em linguagem leiga

---

## 10. Restrições de Negócio

### 10.1 Escalabilidade

- System must support 5 academias now
- Must be architected for N academias (não refactor no futuro)
- Cada unidade: ~400 alunos (assumption)
- Total DB: 2000+ registros (growing)
- Concurrent users: ~20-30 durante pico (7-9h, 18-20h)

### 10.2 Regulamentação / Compliance

- ❌ Sem LGPD: Dados pessoais de alunos (não delete automático)
- ❌ Sem PCI-DSS: Pagamentos pela própria plataforma (futuro integrar Stripe)
- ✅ Auditoria mínima: Quem alterou o quê, quando

---

## 11. Encerramento

Este contexto define:
- ✅ Quem é Jonathan e o que ele precisa
- ✅ Como o sistema deve se comportar
- ✅ Que dados são críticos
- ✅ Que fluxos são prioritários
- ✅ Que riscos existem

**Referência sempre que tiver dúvida sobre direção do projeto.**
