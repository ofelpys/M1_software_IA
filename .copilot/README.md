# .COPILOT/README.md — Como Usar o Memory Bank do Copilot

> **Introdução**: Este é o coração inteligente do projeto Rede Força Total Academias.  
> **Versão**: 1.0 (1º de abril, 2024)  
> **Público**: Dev sênior, Arquiteto, Tech Lead

---

## 1. O que é o Memory Bank?

O Memory Bank é um **repositório de governança e conhecimento** que permite ao Copilot (este agente de IA) trabalhar **autonomamente** sem perder contexto entre sessões.

### A Estrutura

```
.copilot/
├── core/                 ← Knowledge base imutável
│   ├── constitution.md   ← Decisões supremas (não pode violar)
│   ├── rules.md          ← Leis de execução (checklist)
│   ├── contexts.md       ← Contexto de negócio (stakeholders, fluxos)
│   └── patterns.md       ← Padrões de código (copy-paste ready)
│
├── memory/               ← Estado do projeto (atualiza-se)
│   ├── decision-log.md   ← Histórico de decisões + rationale
│   ├── project-state.md  ← Snapshot atual (fases, bloqueadores, risks)
│   └── memory-bank-structure.md ← Mapa de navegação
│
├── workflows/            ← Procedimentos
│   ├── plan.md           ← Fases do projeto + próximos passos
│   ├── documentation.md  ← Como gerar specs/plans (template)
│   ├── implementation.md ← Como codificar
│   └── testing.md        ← Estratégia de testes
│
└── logs/                 ← Rastreamento
    ├── task-log.md       ← Tarefas diárias + progresso
    └── communication-log.md ← Conversas importantes

```

---

## 2. Como Usar: Workflow de Invocação

### 2.1 Quando Você Quer Usar o Copilot

Invoque o Copilot quando precisar de uma das seguintes ações:

```
"Copilot, faça X"

Onde X pode ser:
✨ Gerar SPEC-001 (Cadastro/Acesso)
✨ Gerar PLAN-001 (Database schema para Cadastro)
✨ Implementar RF-CAD-01 (Função de cadastro de alunos)
✨ Criar testes para Controller
✨ Deploy para staging
✨ Analisar bloqueador técnico
✨ Validar se código viola rules.md
```

### 2.2 O que o Copilot Fará Automaticamente

```
1. INICIALIZAR (primeira vez em cada sessão):
   └─ Lê constitution.md (decisões supremas)
   └─ Lê rules.md (leis)
   └─ Lê memory-bank-structure.md (orientação)
   └─ Cache em memória
   └─ Status: "Memory Bank carregado"

2. SELECIONAR WORKFLOW:
   └─ Analisa sua solicitação
   └─ Escolhe workflow apropriado:
      ├─ documentation.md → se pedir "gerar SPEC"
      ├─ implementation.md → se pedir "codificar"
      ├─ testing.md → se pedir "testar"
      └─ plan.md → se pedir "usar plan"

3. EXECUTAR:
   └─ Segue protocolo do workflow escolhido
   └─ Valida cada passo contra rules.md
   └─ Se viola: para e explica por quê
   └─ Gera artefatos (código, docs, etc)

4. REGISTRAR:
   └─ Atualiza decision-log.md (se decisão tomada)
   └─ Atualiza project-state.md (progresso)
   └─ Atualiza task-log.md (o que foi feito)
   └─ Commit no git com rastreabilidade
```

---

## 3. Contexto Crítico (Leia Primeiro)

Antes de usar Copilot, você deve conhecer estas decisões **supremas**:

### Constitution (Não pode violar)

```
✅ DATABASE: PostgreSQL 15+ (FINAL DECISION)
   └─ Implementação: Flyway migrations
   └─ Validação: PL/pgSQL functions onde necessário

✅ BACKEND: Java Spring Boot 3.x
   └─ Estrutura: Controller → Service → Repository
   └─ DTOs sempre separadas de Entities

✅ FRONTEND: React 18+ com Vite
   └─ State: React hooks + Context API
   └─ HTTP Client: Axios com JWT interceptor

⏳ COMISSIONING: Modelo Hybrid (70% aula + 5% novos + bônus)
   └─ Status: Awaiting Jonathan confirmation
   └─ BLOCKER: RF-PROF-04-07 não podem ser codificadas até isto ser confirmado

✅ CATRACA: Phase 2+ (NOT Phase 1)
   └─ Phase 1: Check-in manual (3 cliques, cumple ROP-02)
   └─ Rastreabilidade: Salvar timestamp + usuário em tabela

✅ SECURITY: JWT (HS256) + Spring Security
   └─ Endpoints: Todos precisam de @PreAuthorize
   └─ Tokens: 24h expiry, refresh token mechanism
```

### Rules You Can't Break

Se você tentar fazer isto, Copilot **dirá não**:

```
❌ Adicionar lógica de negócio no Controller
❌ Registrar senhas em plaintext
❌ Queries sem índices em grandes tabelas
❌ Teste coverage < 70% (backend)
❌ Merge PR sem code review ✅
❌ Deploy sem passar todos testes
❌ Mudar decisão constitutional sem reunião
❌ Implementar RF bloqueado (tipo RF-PROF-04)
```

---

## 4. Leitura Dirigida (Quick Reference)

Dependendo da tarefa, leia isto:

### "Quero gerar uma SPEC"
1. Leia: **workflows/documentation.md** (template de SPEC)
2. Leia: **docs/requisitos/01-normalizados/** (RFs base)
3. Leia: **core/contexts.md** (stakeholder context)
4. Output: `specs/XXX/spec.md` (~400-500 linhas típicas)

### "Quero implementar uma RF"
1. Leia: **core/constitution.md** (decisões supremas)
2. Leia: **core/patterns.md** (padrões de código)
3. Leia: **specs/XXX/spec.md** (requisito específico)
4. Leia: **workflows/plan.md** (database schema relevante)
5. Output: Backend + Frontend + Testes

### "Encontrei um bloqueador técnico"
1. Leia: **core/rules.md** (seria violação de regra?)
2. Leia: **memory/constitution.md** (entra em conflito com decisão?)
3. Se não: registre em **memory/decision-log.md**
4. Reúna stakeholders, vote, atualize constitution

### "Não sei o status do projeto"
1. Leia: **memory/project-state.md** (snapshot atual)
2. Leia: **memory/task-log.md** (atividades recentes)
3. Leia: **workflows/plan.md** (próximos passos)

---

## 5. Exemplo Prático: Gerar SPEC-001

### Você Diz:
```
"Copilot, gere SPEC-001 para Cadastro e Acesso.
Cubra RF-CAD-01 a 08 e RF-ACE-01 a 07.
Formato: .md estruturado.
Prazo: 2 dias."
```

### Copilot Faz:

#### Step 1: Inicializa
```
✓ Carregou constitution.md
✓ Carregou rules.md
✓ Carregou core/contexts.md (stakeholder context)
✓ Selecionou workflow: documentation.md
```

#### Step 2: Extrai Contexto
```
✓ Lê RFs-CAD-01-08 de docs/requisitos/01-normalizados/
✓ Lê RFs-ACE-01-07 de mesma fonte
✓ Mapeia atores: Recepcionista, Aluno, Coordenador
✓ Valida: todas RFs cobrem pela SPEC (rastreabilidade)
```

#### Step 3: Gera Estrutura SPEC-001
```
✓ 1. Objetivo: "Descrever fluxo de cadastro e acesso de alunos"
✓ 2. RFs cobertos: RF-CAD-01 la 08, RF-ACE-01 a 07
✓ 3. Atores: 3 personas
✓ 4. Fluxo principal: 9 passos
✓ 5. Máquina de estados: ATIVO → INADIMPLENTE → BLOQUEADO
✓ 6. Regras de negócio: 12 constraints
✓ 7. Casos de uso: 3 exemplos
✓ 8. DTOs esperadas: AlunoDTO, MatriculaDTO, AcessoDTO
✓ 9. Validações: 2-layer (frontend + backend)
✓ 10. Tech decisions needed: 0 (tudo claro)
```

#### Step 4: Valida Contra Rules
```
✓ Todas RFs rastreáveis? SIM (100%)
✓ Conflita com constitution? NÃO
✓ Novos requisitos inventados? NÃO
✓ Precisa decisão Jonathan? NÃO (comissioning é RF-PROF, não CAD)
✓ Pode prosseguir? SIM ✅
```

#### Step 5: Output
```
✓ Cria: specs/001-atendimento-pedidos/spec.md (~400 linhas)
✓ Atualiza: memory/decision-log.md (registra SPEC-001 gerada)
✓ Atualiza: memory/project-state.md (Fase 2: 30% complete)
✓ Commit: git add + commit com msg "[SPEC-001] Cadastro/Acesso finalizado"
```

#### Step 6: Retorna
```
"SPEC-001 gerada e live em specs/001-atendimento-pedidos/spec.md.

Próximos passos:
1. Validar com Jonathan (se mudanças)
2. Iniciar SPEC-002 (Financeiro)
3. Após SPEC-001-003, iniciar PLANs

Bloqueadores restantes: 2
- DUV-02: Prof PC vs mobile (impacta frontend design)
- DUV-03: Taxa comissão (impacta RF-PROF-04-07)

Prazo met: Gerada em X horas (dentro de 2 dias estimado)"
```

---

## 6. Decisões Conhecidas

| Tema | Decisão | Status | Bloqueador? |
|------|---------|--------|-----------|
| **Database** | PostgreSQL 15+ | ✅ FINAL | NÃO |
| **Backend** | Spring Boot 3.x | ✅ FINAL | NÃO |
| **Frontend** | React 18+ | ✅ FINAL | NÃO |
| **Comissioning** | Hybrid (70%+5%+bônus) | ⏳ PENDING | **SIM** — RF-PROF-04-07 |
| **Catraca** | Phase 2+ | ✅ FINAL | NÃO |
| **Prof Access** | PC shared? Mobile? | ⏳ PENDING | **SIM** — Frontend design |

Leia **memory/constitution.md** para detalhes completos.

---

## 7. Quando Pedir Ajuda do Copilot

### ✅ Use Copilot Para:
```
✓ Gerar documentação (SPEC, PLAN)
✓ Implementar RFs (code generation)
✓ Validar compliance (checklist rules.md)
✓ Análise técnica (rastreabilidade)
✓ Planejamento (milestone breakdown)
✓ Teste coverage (test generation)
✓ Refactoring (code patterns)
✓ PR review (contre rules.md)
```

### ❌ NÃO Use Copilot Para:
```
✗ Decisões de negócio (Jonathan's call)
✗ Mudanças em constitution (requer reunião)
✗ Hiring/Team management
✗ Negociações comerciais
✗ Resolução de conflitos interpessoais
```

---

## 8. Atualização do Memory Bank

Copilot **SEMPRE** atualiza:

```
Após cada ação significante:

1. decision-log.md
   └─ Se decisão tomada: registra com context + rationale

2. project-state.md
   └─ Atualiza % completion (fases)
   └─ Atualiza health metrics
   └─ Atualiza risks + mitigations

3. task-log.md
   └─ Registra tarefa + tempo decorrido
   └─ Status (✅ complete, ⏳ in-progress, ❌ blocked)
   └─ Próximos passos

4. Commit + Push
   └─ Git commit com rastreabilidade
   └─ Mensagem: [COMPONENT] O que foi feito
   └─ Referência: Qual RF/DUV/Bloqueador
```

---

## 9. Troubleshooting

### "Copilot disse NÃO"

Se Copilot recusa uma ação, é por:

```
🛑 Viola constitution.md
   → Solução: Reúna stakeholders, vota, amenda constitution

🛑 Viola rules.md
   → Solução: Refatore a solução para cumprir

🛑 Bloqueador não resolvido
   → Solução: Leia decision-log.md, resolva DUV primeiro

🛑 RF bloqueado (tipo RF-PROF-04)
   → Solução: Aguarde Jonathan confirmar comissioning
```

### "Perdi o contexto"

```
1. Leia memory/project-state.md (snapshot atual)
2. Leia memory/task-log.md (atividades recentes)
3. Leia memory/decision-log.md (decisões recentes)
4. Invoque: "Copilot, resuma meu status"
```

### "Encontrei inconsistência"

```
Exemplo: SPEC-001 menciona validação que não está no PLAN-001

1. Registre em memory/task-log.md como bug aberto
2. Invoque: "Copilot, reconcilie SPEC-001 vs PLAN-001"
3. Copilot analisará e atualizará ambos
```

---

## 10. Próximas Ações Imediatas

Veja **memory/task-log.md** para hoje's tasks.

**Resumo Crítico**:
```
TODAY (1 apr):
□ Enviar Constitution para Jonathan confirmar

AMANHÃ (2 apr):
□ Resposta para DUV-02 (Prof PC vs mobile)

SEMANA 1:
□ SPEC-001 gerada
□ SPEC-002 gerada
□ SPEC-003 gerada

SEMANA 2:
□ PLAN-001 gerada
□ PLAN-002 gerada
□ PLAN-003 gerada
```

---

## Encerramento

**Copilot Memory Bank é sua inteligência aumentada.**

Ele conhece:
- ✅ Todas as decisões (constitution)
- ✅ Todas as regras (rules)
- ✅ Todo contexto de negócio (contexts)
- ✅ Padrões de implementação (patterns)
- ✅ O que foi decidido antes (decision-log)
- ✅ Onde você está agora (project-state)
- ✅ O que fazer depois (workflows)

**Use-o generosamente. Atualize-o constantemente.**

---

**Arquivo**: `.copilot/README.md`  
**Versão**: 1.0  
**Última Atualização**: 1º de abril de 2024  
**Próxima Revisão**: Quando Constitution for ratificada
