# CONTRIBUTING — Processo de Pull Request 🚀

> **Versão**: 1.1  
> **Data**: 3 de abril de 2026 (Fase 3 Planning Completa)  
> **Aplicação**: OBRIGATÓRIO para todas as PRs  
> **Referência**: [Guia de Padrões de Código](docs/requisitos/00-originais/guia-padroes-codigo-convencoes.md) | [PLANs (8 módulos)](docs/requisitos/05-plans/)

---

> Nota de escopo MVP: este processo de PR esta calibrado para a fase de MVP operacional. Exigencias de governanca/operacao enterprise sao tratadas como evolucao posterior.

## 🎯 O que é Processo de PR?

**Pull Request (PR)** é um **fluxo controlado de revisão de código** antes de mergear mudanças para `main`. Este processo garante rastreabilidade **100% do RF ao Código** (RF → SPEC → PLAN → PR → Code). Garante:

1. ✅ **Qualidade de Código**: Segue padrões (Guia de Padrões)
2. ✅ **Sem Bugs Óbvios**: Code Review por pelo menos 1 dev
3. ✅ **Testes Automáticos Passam**: SonarQube, Jest, JUnit
4. ✅ **Documentação Atualizada**: README, comentários, API docs
5. ✅ **Segurança**: Sem senhas, token, SQL injection

**Benefícios**:
- Compartilha conhecimento (2+ pessoas veem o código)
- Previne bugs antes de ir para PROD
- Rastreabilidade COMPLETA: RF → SPEC → PLAN → PR → Code (quem mudou quê, quando, por quê, qual requisito)
- Rollback fácil se problema é detectado
- Governança: Todas decisões (constitution.md), padrões (patterns.md) e planos (8 PLANs Fase 3) respeitados

> **Ambiente obrigatório**: Java 21 (LTS) + Maven instalado localmente no PATH (`mvn`).
> Não versionar binários Maven em `tools/`.

---

## 📋 Passo-a-Passo Completo

### 1️⃣ Criptografia de Branch

Antes de começar a trabalhar:

```bash
# Atualizar main local
git checkout main
git pull origin main

# Criar branch com tipo + descrição
git checkout -b feature/M01-autenticacao-aluno
git checkout -b bugfix/corrigir-validacao-cpf
git checkout -b docs/adicionar-exemplos-api
```

**Convenção de Branch** (vinculado aos 8 PLANs da Fase 3):
```
feature/PLAN-[001-008]-[modulo]-[descricao-curta]
bugfix/PLAN-[001-008]-[modulo]-[descricao-curta]
docs/PLAN-[001-008]-[descricao-curta]
refactor/PLAN-[001-008]-[modulo]-[descricao-curta]
```

Examples:
- `feature/PLAN-001-cadastro-validacao-aluno` ✅ (rastreável a PLAN-001 Cadastro & Acesso)
- `bugfix/PLAN-002-financeiro-juros-calculo` ✅ (rastreável a PLAN-002 Financeiro)
- `feature/PLAN-003-relatorios-filtro-datas` ✅ (rastreável a PLAN-003 Relatórios & Dashboards)
- `feature/PLAN-004-avaliacao-teste-fisico` ✅ (rastreável a PLAN-004 Avaliação & Evolução)
- `docs/PLAN-001-api-endpoints-update` ✅
- `myfeature` ❌ (sem contexto ou PLAN)
- `feature/auth` ❌ (genérico, sem PLAN reference)

## 🔗 Rastreabilidade: RF → SPEC → PLAN → PR → Code

Este projeto segue rastreabilidade **100% do RF ao Código**:

```
Fase 1 (Analysis)
  70 RFs (Requisitos Funcionais) documentados
      ↓
Fase 2 (Design)
  8 SPECs (1 por módulo)
  - SPEC-001: Cadastro & Acesso (15 RFs)
  - SPEC-002: Financeiro (9 RFs)
  - SPEC-003: Relatórios & Dashboards (9 RFs)
  - SPEC-004: Avaliação & Evolução (8 RFs)
  - SPEC-005: Professores (8 RFs)
  - SPEC-006: Equipamento & Salas (8 RFs)
  - SPEC-007: Insumos & Produtos (8 RFs)
  - SPEC-008: Comunicação & Notificações (5 RFs)
      ↓
Fase 3 (Planning) ← VOCÊ ESTÁ AQUI
  8 PLANs (1 por SPEC)
  - PLAN-001: Cadastro & Acesso (1.200 linhas | 12 tabelas | 24 endpoints)
  - PLAN-002: Financeiro (900 linhas | 5 tabelas | 18 endpoints)
  - PLAN-003: Relatórios & Dashboards (700 linhas | 5 VIEWs | 12 endpoints)
  - PLAN-004: Avaliação & Evolução (500 linhas | 4 tabelas | 12 endpoints)
  - PLAN-005: Professores (600 linhas | 5 tabelas | 14 endpoints)
  - PLAN-006: Equipamento & Salas (500 linhas | 4 tabelas | 12 endpoints)
  - PLAN-007: Insumos & Produtos (600 linhas | 5 tabelas | 14 endpoints)
  - PLAN-008: Comunicação & Notificações (400 linhas | 4 tabelas | 10 endpoints)
      ↓
Fase 4 (Prototyping)
  HTML/CSS mockups + React stubs
      ↓
Fase 5 (Development)
  PRs com referência a PLAN-XXX → Java/React code implementaçao
      ↓
MVP EM PRODUCAO TECNICA
```

**Ao abrir PR, SEMPRE referencie qual RF → SPEC → PLAN está implementando!**

Exemplo:
```
feat(PLAN-002-Financeiro): Implementar cálculo de juros automático

RF-FIN-03: Alunos com pagamento atrasado acumulam juros
SPEC-002: Seção 4.2 - Cálculo de juros (0.05% ao dia = 1.5% mensal)
PLAN-002: Database (tabela INADIMPLENCIA, trigger calcular_juros_automatico)

Implementação:
- Trigger PostgreSQL: calcular_juros_automatico()
- Endpoint REST: POST /api/inadimplencia/calcular-juros
- Service: InadimplenciaService.calcularJuros()
- Tests: 12 unit tests (cobertura 100%)
```

---

**Enquanto você desenvolver**:

```bash
# Fazer mudanças nos arquivos
vim src/main/java/com/forcatotal/AlunoService.java
vim src/main/js/AlunoForm.jsx

# Verificar status
git status

# Adicionar mudanças
git add src/main/java/com/forcatotal/AlunoService.java
git add src/main/js/AlunoForm.jsx

# Commit com mensagem clara referenciando o PLAN da Fase 3
# IMPORTANTE: Cada commit deve referenciar qual PLAN estar implementando
git commit -m "feat(PLAN-001-Autenticacao): Implementar validacao JWT 5min expiacao

- Adicionar Spring Security filter conforme PLAN-001 (12 tabelas, 24 endpoints, 5 React pages)
- Validar token em cada request com HS256
- Lançar InvalidTokenException se expirado (como especificado em PLAN-001)
- Implementar rotação de refresh tokens (30 dias)
- Cobertura de teste: 95% de linhas

Ref: PLAN-001, RF-ACE-02, RNF-03, RNF-13
Link PLAN: docs/requisitos/05-plans/PLAN-001-cadastro-acesso.md"

# Push para origin
git push origin feature/M02-login-jwt
```

#### 2.1 Padrão de Commit Message

```
[tipo]([modulo]-[nome]): [descrição curta em português]

[corpo com detalhes, quebras de linha]

[referência a RFs/RNFs/DUVs]
```

**Tipos permitidos**:
- `feat`: Nova funcionalidade (necessário referenciar PLAN-XXX)
- `fix`: Correção de bug (necessário referenciar PLAN-XXX)
- `refactor`: Reorganização sem mudança de comportamento
- `docs`: Documentação apenas
- `test`: Testes apenas (associar ao PLAN-XXX sendo testado)
- `chore`: Dependências, config, build

**Exemplos validos** ✅:

```
feat(M02-Autenticacao): Implementar JWT com 5min expiacao

- Adicionar Spring Security filter
- Configurar token expiration em application.yml
- Integrar com tabela USUARIO para validacao
- Logout limpa refresh token

Ref: RF-ACE-02, RNF-03, RNF-13
Testes: 18 unit tests passed

fix(M03-Financeiro): Corrigir calculo de comissao perdido milhaos

O calculo estava usando FLOAT ao inves de NUMERIC(10,2),
causando perda de precisao em valores de comissao.

Resolucao: Migrar BD para NUMERIC, regerar calculos em batch

Ref: DUV-03, BUG#2456
Testes: 1 integration test passed
```

**Exemplos inválidos** ❌:

```
updated code
:
bugfix: algo
feat: v2
fixed pagination
```

---

### 3️⃣ Abrir Pull Request (PR)

Quando estar pronto para review:

```bash
# Antes de push, executar testes localmente
npm run test:frontend  # Jest
mvn -f backend/forca-total-api/pom.xml test  # JUnit backend

# Se tudo passa, push
git push origin feature/M02-login-jwt

# GitHub cria botão "Compare & Pull Request"
```

**Na interface do GitHub**:

#### 3.1 Preenchimento de PR

```markdown
# Título da PR
feat(M02-Autenticacao): Implementar validacao JWT com 5min expiacao

## Descrição
Implementa sistema de autenticação com JWT tokens de curta duração,
seguindo RNF-03 (Autenticação) e requisitos de segurança LGPD.

## Mudanças
- [ ] Backend: JwtAuthenticationFilter (Spring Security)
- [ ] Backend: JwtUtil (geração e validação)
- [ ] Frontend: useAuth hook (armazenar token em sessionStorage)
- [ ] Database: Adicionar coluna refresh_token_expiry em USUARIO
- [ ] Tests: 18 JUnit + 5 Jest (cobertura 93%)

## Linked Issues
Closes #234 (DUV-02 validacao JWT)
Ref: RF-ACE-02, RNF-03, RNF-13

## Checklist antes de Review
- [x] Código segue [Guia de Padrões](docs/requisitos/00-originais/guia-padroes-codigo-convencoes.md)
- [x] Testes unitários passam (cobertura ≥80%)
- [x] Sem console.log/debug statements em PROD code
- [x] Sem senhas/tokens hardcoded
- [x] README atualizado (se necessário)
- [x] Commit messages claras (convenção padrão)
- [x] Sem conflitos com main
- [x] Performance checklist (índices, lazy loading)

## Screenshots/Demo (se UI)
[Opcional: incluir antes/depois]

## Performance Impact
- JWT validation: <1ms por request
- Token geração: <10ms
- Storage overhead: ~300 bytes por sessão

## Rollback Plan
1. Revert commit: `git revert <commit-hash>`
2. Database: executar migration de rollback
3. Frontend: limpar sessionStorage
4. Monitor: verificar logs de erro por 5min

## Reviewer Notes
- [x] Code review requerido: 1 senior dev
- [x] Tests: Todas as novas funções estimuladas
- [x] Docs: API docs atualizado
- [x] Segurança validada: Sem XSS, Injection risks
- [x] Performance validada: Load tests < 2s (P95)
```

**Campos Obrigatórios**:
- [ ] Título claro (seguir `[tipo](modulo): descricao`)
- [ ] Descrição com mudanças, resolução, referências a RFs/RNFs
- [ ] Checklist pré-review completo
- [ ] Link a Issues/DUVs
- [ ] Plano de rollback

---

### 4️⃣ Code Review Automático

Abre automaticamente quando PR criar:

```yaml
# .github/workflows/pr-checks.yml
name: PR Quality Checks
on: [pull_request]

jobs:
  sonarqube:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: SonarQube Scan
        run: |
          mvn -f backend/forca-total-api/pom.xml clean verify sonar:sonar \
            -Dsonar.projectKey=forcatotal-m1 \
            -Dsonar.host.url=${{ secrets.SONAR_HOST }} \
            -Dsonar.login=${{ secrets.SONAR_TOKEN }}

  tests-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: '21'
      - name: Run JUnit Tests
        run: mvn -f backend/forca-total-api/pom.xml test -DskipITs=true
      - name: Code Coverage Report
        run: mvn -f backend/forca-total-api/pom.xml jacoco:report
      - name: Upload Coverage
        uses: codecov/codecov-action@v3

  tests-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - name: Install Dependencies
        run: npm ci
      - name: Run Jest Tests
        run: npm run test:coverage
      - name: Ensure Coverage ≥80%
        run: npm run test:coverage -- --coverageReporters='text' --coverageThreshold='{"lines": 80}'

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: OWASP Dependency Check
        run: dependency-check.sh --project "Força Total M1" --scan .
      - name: SonarQube Security Hotspots
        run: # validar contra SAST rules
```

**Checklist automatizado**:

| Check | Status | Referência |
|-------|--------|-----------|
| JUnit tests pass | 🟢 18/18 | `./src/test/java/**/*Test.java` |
| Jest tests pass | 🟢 23/23 | `./src/main/js/**/*.test.jsx` |
| Code coverage ≥80% | 🟢 87% | Codecov report |
| SonarQube gates pass | 🟢 Pass | sonarqube.com |
| No critical security issues | 🟢 0 | OWASP, Snyk |
| Lint passes (ESLint, Checkstyle) | 🟢 Pass | ESLint, Checkstyle |
| No hardcoded secrets | 🟢 Pass | git-secrets |
| Build succeeds | 🟢 Pass | Maven + npm build |

Se algum check falhar:

```
❌ Code coverage 62% (required ≥80%)
├─ Backend: 85% (good!)
├─ Frontend: 40% (need +40%)
└─ Action: Add missing AlunoForm.jsx tests
   Example: test check-in validation error paths

❌ SonarQube Blocker: SQL Injection risk in AlunoRepository
├─ Linha: 42
├─ Mensagem: Query construído com concatenação string
└─ Ação: Usar @Query com @Param ou QueryDSL

❌ Build failed: npm build error
├─ Erro: Missing import in AlunoForm.jsx
└─ Ação: npm install ou verificar import paths
```

**Você volta ao ramo, corrige, commita, push**:

```bash
# Corrigir falha
vim src/main/js/AlunoForm.jsx  # corrigir coverage

# Commit
git add src/main/js/AlunoForm.jsx
git commit -m "test(M02-Autenticacao): Adicionar tests para AlunoForm validacao

- Test email invalid format
- Test CPF validation error paths
- Test submit disabled when loading
- Cobertura aumentada: 40% → 88%"

# Push (PR update automaticamente)
git push origin feature/M02-login-jwt
```

PR automaticamente re-executa todos checks ✅

---

### 5️⃣ Code Review Humano

Depois de ✅ todos checks automáticos:

#### Quem pode fazer review?
- **Backend**: At least 1 dev Senior Java/Spring Boot
- **Frontend**: At least 1 dev Senior React
- **Database**: DBA if migration/schema changes
- **Arquiteto**: Se changes na arquitetura

#### O que Code Review valida?

```markdown
## Backend Review Checklist

### Arquitetura + Design
- [ ] Segue camada SOLID (Controller → Service → Repository)
- [ ] DTOs separados por operação (CreateDto, UpdateDto, ResponseDto)
- [ ] Exceções customizadas (não RuntimeException genérica)
- [ ] Sem acoplamento entre camadas

### Código
- [ ] Segue Guia de Padrões (nomenclatura, indentação)
- [ ] Funções < 50 linhas, métodos < 15 linhas
- [ ] Nomes descritivos (variáveis, funções)
- [ ] Sem código duplicado (DRY)
- [ ] Sem comentários óbvios (código auto-explanatório)

### Segurança
- [ ] Sem senhas/tokens hardcoded
- [ ] Validação input: DTO + Service
- [ ] Sem SQL injection (usar @Query)
- [ ] Bcrypt cost ≥10 para senhas
- [ ] JWT expiration < 5min

### Performance
- [ ] Índices BD para queries > select em 500ms
- [ ] N+1 problem? (usar fetch=LAZY)
- [ ] Lazy loading collections
- [ ] Cache strategy se necessário

### Testes
- [ ] Cobertura ≥80%
- [ ] Tests nomeados descritivamente
- [ ] Padrão AAA (Arrange, Act, Assert)
- [ ] Mocks injetados (não field injection)

### Documentação
- [ ] JavaDoc em funções públicas
- [ ] README atualizado (se feature nova)
- [ ] API docs atualizado (OpenAPI/Swagger)
- [ ] Migrations documentadas (se schema change)

## Frontend Review Checklist

### React Patterns
- [ ] Componentes < 200 linhas
- [ ] Custom hooks para lógica compartilhada
- [ ] Key prop em listas (não index)
- [ ] useCallback para memoization
- [ ] Sem memory leaks em useEffect (cleanup)

### Estado + Props
- [ ] Props validadas com PropTypes ou TypeScript
- [ ] Estado é flat (não nested objects)
- [ ] Loading + error states
- [ ] Sem estado duplicado

### Segurança
- [ ] Sem XSS: DOMPurify se dangerouslySetInnerHTML
- [ ] Tokens em sessionStorage (não localStorage)
- [ ] HTTPS enforcement
- [ ] Rate limiting feedback

### Performance
- [ ] Bundle size < 200KB gzipped
- [ ] Lazy loading de rotas
- [ ] Memoização apropriada
- [ ] Sem console.log em PROD

### Testes
- [ ] Cobertura ≥80%
- [ ] Usar @testing-library/react
- [ ] Teste comportamento (não implementação)
- [ ] Snapshot tests apenas componentes estáveis

### Acessibilidade
- [ ] alt text em imagens
- [ ] Keyboard navigation
- [ ] Contrast ≥4.5:1
- [ ] ARIA labels onde necessário

## Database Review (se migration)

- [ ] Script migration é idempotent
- [ ] Rollback script testado
- [ ] Índices para foreign keys
- [ ] Backup antes de executar
- [ ] Tests de performance (EXPLAIN ANALYZE)
```

#### Exemplo de Review com Comments

```markdown
// no arquivo AlunoService.java linha 42
@@ -40,10 +40,15 @@
   public AlunoResponseDto criarAluno(AlunoCreateDto dto) {
-      if (dto.getCpf() == null) {
-          throw new RuntimeException("CPF obrigatório");
-      }
+      if (!cpfValidator.isValid(dto.getCpf())) {
+          throw new InvalidCpfException(dto.getCpf());
+      }

Comment do Reviewer:
👍 Bom catch! Temos que validar NUMERO_INVALIDO também.
Mas e DUV-03 de comissionamento? Vemos referência aqui?

Sugestão: Adicionar log antes do throw
  log.warn("CPF inválido: {}", dto.getCpf());
```

#### Estados de PR

| Estado | Significado | Ação |
|--------|-----------|------|
| 🟡 PENDING | Checks automáticos rodando | Esperar |
| ❌ FAILED | Checks falharam | Corrigir + push |
| ⏳ REVIEW REQUESTED | Esperando aprovação humano | Aguarde reviewer |
| 💬 CHANGES REQUESTED | Reviewer pediu mudanças | Faça mudanças, commit, push |
| ✅ APPROVED | Reviewer aprovou | Pronto para merge |
| 🟢 MERGED | Fundido em main | Completado! |

---

### 6️⃣ Merge + Deploy

Quando ✅ aprovado:

```bash
# Opção 1: Merge via GitHub UI (recomendado)
# Click "Merge pull request" (ou "Squash and merge")

# Opção 2: Via CLI
git checkout main
git pull origin main
git merge origin/feature/M02-login-jwt
git push origin main
```

**Deploy Automático** (se configurado):

```yaml
# .github/workflows/deploy.yml
name: Deploy to Staging
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker image
        run: docker build -t forcatotal-m1:latest .
      - name: Push to Docker Registry
        run: docker push forcatotal-m1:latest
      - name: Deploy to Kubernetes
        run: kubectl set image deployment/forcatotal-m1 forcatotal-m1=forcatotal-m1:latest
      - name: Wait for Rollout
        run: kubectl rollout status deployment/forcatotal-m1
      - name: Run Smoke Tests
        run: npm run test:e2e
```

---

## 📋 Checklist Completo (Copy-Paste)

```markdown
# PR Checklist

## Pré-Review
- [ ] Branch criado com padrão `[tipo]/[modulo]-[descricao]`
- [ ] Commits seguem padrão de mensagem (tipo + modulo + descriptivo)
- [ ] Sem `console.log`, `debugger`, `alert()` em PROD code
- [ ] Sem senhas, tokens, API keys hardcoded
- [ ] Código segue Guia de Padrões (nomenclatura, camadas, patterns)
- [ ] README.md atualizado (se necessário)
- [ ] Tests escritos (cobertura ≥80%)

## Automático (GitHub Actions)
- [ ] SonarQube quality gates: ✅ Pass
- [ ] JUnit tests: ✅ 18/18 passed
- [ ] Jest tests: ✅ 23/23 passed
- [ ] Code coverage: ✅ 87% (≥80%)
- [ ] ESLint/Checkstyle: ✅ 0 violations
- [ ] Security scan: ✅ 0 critical issues
- [ ] Build success: ✅ Maven + npm
- [ ] No hardcoded secrets: ✅ Pass

## Code Review Humano
- [ ] Arquitetura válida (SOLID, camadas)
- [ ] Segurança revisada (XSS, injection, auth)
- [ ] Performance revisada (índices, lazy loading)
- [ ] Documentação adequada (JavaDoc, comments)
- [ ] Tests validam o esperado
- [ ] Sem código duplicado

## Merge
- [ ] 1x aprovação de reviewer
- [ ] Todos checks passam ✅
- [ ] Sem conflitos com main
- [ ] Commits squashed (opcional, prefer sequence)
- [ ] PR pronta para merge
```

---

## 🚫 O que NÃO Fazer em PRs

| ❌ | ✅ |
|----|-----|
| Fazer PR gigante (>500 linhas) | Split em múltiplas PRs menores |
| Mergear sem review | Sempre esperar 1+ aprovações |
| Force-push em main | Use GitHub UI ou rebase local |
| Commitar senhas/keys | Use `.env` e variaveis de ambiente |
| Código sem testes | Sempre cobertura ≥80% |
| Merge sem passing checks | Wait all green checks ✅ |
| PRs de features incompletas | Pronto → Merge → Deploy |
| Mudanças em branches de others | Respeitar ownership de branch |

---

## 🔗 Referências

| Documento | Propósito |
|-----------|-----------|
| [Guia de Padrões](docs/requisitos/00-originais/guia-padroes-codigo-convencoes.md) | Nomenclatura, design patterns, segurança |
| [Glossário](docs/requisitos/00-originais/glossario.md) | Terminologia padronizada |
| [Matriz Rastreabilidade](docs/requisitos/02-mapa/matriz-rastreabilidade.md) | RFs → Módulos → Tabelas |
| [RNFs Detalhados](docs/requisitos/02-mapa/requisitos-nao-funcionais-detalhados.md) | Critério aceitação, stack tech |
| [Modelo Dados](docs/requisitos/02-mapa/modelo-dados-conceitual.md) | Schema, relacionamentos, triggers |
| **[PLAN-001: Cadastro & Acesso](docs/requisitos/05-plans/PLAN-001-cadastro-acesso.md)** | **12 tabelas \| 24 endpoints \| 5 React pages** |
| **[PLAN-002: Financeiro](docs/requisitos/05-plans/PLAN-002-financeiro.md)** | **5 tabelas \| 18 endpoints \| Comissão automática** |
| **[PLAN-003: Relatórios & Dashboards](docs/requisitos/05-plans/PLAN-003-relatorios-dashboards.md)** | **5 VIEWs \| 12 endpoints \| Dashboard KPIs** |
| **[PLAN-004: Avaliação & Evolução](docs/requisitos/05-plans/PLAN-004-avaliacao-evolucao.md)** | **4 tabelas \| 12 endpoints \| Certificados** |
| **[PLAN-005: Professores](docs/requisitos/05-plans/PLAN-005-professores.md)** | **5 tabelas \| 14 endpoints \| Performance ranking** |
| **[PLAN-006: Equipamento & Salas](docs/requisitos/05-plans/PLAN-006-equipamento-salas.md)** | **4 tabelas \| 12 endpoints \| Manutenção** |
| **[PLAN-007: Insumos & Produtos](docs/requisitos/05-plans/PLAN-007-insumos-produtos.md)** | **5 tabelas \| 14 endpoints \| Controle validade** |
| **[PLAN-008: Comunicação & Notificações](docs/requisitos/05-plans/PLAN-008-comunicacao-notificacoes.md)** | **4 tabelas \| 10 endpoints \| Multi-channel** |
| [.copilot/memory/constitution.md](.copilot/memory/constitution.md) | Decisões supremas imutáveis |
| [.copilot/core/patterns.md](.copilot/core/patterns.md) | 9 padrões code copy-paste ready |
| [.copilot/core/rules.md](.copilot/core/rules.md) | 13 regras de execução (law enforcement) |

---

## 🎯 Desenvolvimento em Paralelo com 8 PLANs (Fase 3 Completa)

Agora que Fase 3 está completa, o desenvolvimento será estruturado com **8 developers trabalhando em paralelo**, cada um com seu PLAN:

| Dev | PLAN | Tabelas | Endpoints | React Pages | Duração |
|-----|------|---------|-----------|------------|---------|
| Dev 1 | PLAN-001 Cadastro & Acesso | 12 | 24 | 5 | 2 semanas |
| Dev 2 | PLAN-002 Financeiro | 5 | 18 | 4 | 2 semanas |
| Dev 3 | PLAN-003 Relatórios & Dashboards | 5 VIEWs | 12 | 6 | 2 semanas |
| Dev 4 | PLAN-004 Avaliação & Evolução | 4 | 12 | 4 | 1.5 semanas |
| Dev 5 | PLAN-005 Professores | 5 | 14 | 4 | 1.5 semanas |
| Dev 6 | PLAN-006 Equipamento & Salas | 4 | 12 | 3 | 1.5 semanas |
| Dev 7 | PLAN-007 Insumos & Produtos | 5 | 14 | 4 | 1.5 semanas |
| Dev 8 | PLAN-008 Comunicação & Notificações | 4 | 10 | 3 | 1.5 semanas |

**Dependências Críticas**:
- PLAN-001 (Cadastro) → bloqueador para PLAN-002 e PLAN-005 (usam dados de alunos/professores)
- PLAN-002 (Financeiro) → bloqueador para PLAN-003 (relatórios exigem dados financeiros)
- Recomendação: Priority → PLAN-001 (Dev 1 começa primeiro)

**Branch Organization**:
```bash
# Cada dev abre branch relacionado ao SEU PLAN
git checkout -b feature/PLAN-001-cadastro-validacao-cpf
git checkout -b feature/PLAN-002-financeiro-calculo-juros
git checkout -b feature/PLAN-003-relatorios-dashboard-kpis
# ... etc para PLAN-004 a PLAN-008
```

**Review Strategy**:
- Backend PRs: Revisado por dev sênior Java + arquiteto
- Frontend PRs: Revisado por dev sênior React + UX
- Database PRs: Revisado por DBA (índices, migrations, triggers)
- Cross-PLAN: Se afeta múltiplos PLANs, approval de ambos devs

---

**Last Updated**: 3 de abril de 2026 (Fase 3 Planning Completa)  
**Owner**: Tech Lead + Felipe Costa Monteiro  
**Status**: 🟢 Active — Processamento de PRs com rastreabilidade RF→SPEC→PLAN→Code  
**Próximo**: Fase 4 Prototyping (5-7 abr) + Fase 5 Development (8 módulos em paralelo)

