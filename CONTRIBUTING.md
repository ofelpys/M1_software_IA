# CONTRIBUTING — Processo de Pull Request 🚀

> **Versão**: 1.0  
> **Data**: 2 de abril de 2026  
> **Aplicação**: OBRIGATÓRIO para todas as PRs  
> **Referência**: [Guia de Padrões de Código](docs/requisitos/00-originais/guia-padroes-codigo-convencoes.md)

---

## 🎯 O que é Processo de PR?

**Pull Request (PR)** é um **fluxo controlado de revisão de código** antes de mergear mudanças para `main`. Garante:

1. ✅ **Qualidade de Código**: Segue padrões (Guia de Padrões)
2. ✅ **Sem Bugs Óbvios**: Code Review por pelo menos 1 dev
3. ✅ **Testes Automáticos Passam**: SonarQube, Jest, JUnit
4. ✅ **Documentação Atualizada**: README, comentários, API docs
5. ✅ **Segurança**: Sem senhas, token, SQL injection

**Benefícios**:
- Compartilha conhecimento (2+ pessoas veem o código)
- Previne bugs antes de ir para PROD
- Rastreabilidade completa (quem mudou quê, quando, por quê)
- Rollback fácil se problema é detectado

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

**Convenção de Branch**:
```
feature/[MODULO]-[descripcion-curta]
bugfix/[MODULO]-[descripcion-curta]
docs/[descripcion-curta]
refactor/[MODULO]-[descripcion-curta]
```

Examples:
- `feature/M02-login-jwt` ✅
- `bugfix/M03-error-handling` ✅
- `docs/readme-update` ✅
- `myfeature` ❌ (sem contexto)
- `feature/auth` ❌ (genérico)

---

### 2️⃣ Desenvolvimento + Commits

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

# Commit com mensagem clara (ver seção 2.1 abaixo)
git commit -m "feat(M02-Autenticacao): Implementar validacao JWT 5min expiacao

- Adicionar filter de autenticaco JWT
- Validar token em cada request
- Larcar InvalidTokenException se expirado
- Cobertura de teste: 95% de linhas

Ref: RF-ACE-02, RNF-03, RNF-13"

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
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `refactor`: Reorganização sem mudança de comportamento
- `docs`: Documentação apenas
- `test`: Testes apenas
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
./mvnw test           # JUnit backend

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
          ./mvnw clean verify sonar:sonar \
            -Dsonar.projectKey=forcatotal-m1 \
            -Dsonar.host.url=${{ secrets.SONAR_HOST }} \
            -Dsonar.login=${{ secrets.SONAR_TOKEN }}

  tests-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
      - name: Run JUnit Tests
        run: ./mvnw test -DskipITs=true
      - name: Code Coverage Report
        run: ./mvnw jacoco:report
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

---

## 📞 Suporte

Dúvidas sobre processo de PR?

1. Ver exemplos em PRs anteriores (GitHub)
2. Consultar Guia de Padrões
3. Contatar Tech Lead
4. Abrir Issue em GitHub

---

**Last Updated**: 2 de abril de 2026  
**Owner**: Tech Lead  
**Status**: 🟢 Active — All PRs must follow this process

