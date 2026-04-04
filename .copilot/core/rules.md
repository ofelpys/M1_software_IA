# RULES.MD — Regras Não-Negociáveis do Projeto M1

> **Versão**: 1.0  
> **Data**: 1 de abril de 2026  
> **Escopo**: Rede Força Total Academias  
> **Autoridade**: Engenharia Sênior (Spec Kit)

---

## 1. Autoridade e Verdade

### 1.1 Hierarquia de Verdade (Ordem absoluta)

```
1️⃣  .copilot/memory/constitution.md (Lei suprema)
2️⃣  .copilot/core/rules.md (Regras não-negociáveis)
3️⃣  docs/requisitos/02-mapa/mapa-mestre.md (Conflitos resolvidos)
4️⃣  docs/requisitos/01-normalizados/* (Requisitos normalizados)
5️⃣  specs/*/spec.md (Especificações por fluxo)
6️⃣  specs/*/plan.md (Decisões técnicas)
7️⃣  specs/*/tasks.md (Tarefas para dev)
8️⃣  Código fonte (Implementação)
```

**Implicação**: Se há conflito entre documentos, a hierarquia define. Nunca inventar ou improvisar.

### 1.2 Nenhuma Implementação Sem Baseline

- ❌ Não existe "desenvolvimento rápido" sem context
- ❌ Não existe "tentativa e erro" sem baseline
- ✅ Todo código vem de PLAN documentado
- ✅ Todo PLAN vem de SPEC definida
- ✅ Toda SPEC vem de requisitos normalizados

---

## 2. Banco de Dados — Decisão Ratificada

### 2.1 Stack Definitivo (DP-TECH-STACK-001)

**ATUAL**: Conflito histórico já resolvido na Constitution

| Documento | Decisão |
|---|---|
| `forca-total-historia-operabilidade.md` | PostgreSQL |
| `forca-total-objetivos-requisitos-iniciais.md` | PostgreSQL |
| `prompt_inicial.txt` | MySQL |

**REGRA OBRIGATÓRIA**: 
```
✅ Implementar migrations exclusivamente para PostgreSQL via Flyway
```

**Status atual**: ✅ **RESOLVIDO**

**Resolução necessária em**: `.copilot/memory/constitution.md` 

### 2.2 Uma Vez Decidido (Lei irrevogável)

```markdown
- Todas as migrations usarão Flyway (se PostgreSQL) ou Liquibase
- Drivers serão configurados em spring-boot-starter-data-jpa
- Tipos de dados respeitarão convenção do banco escolhido
- Procedures e functions seguirão sintaxe do banco escolhido
- Nenhuma mudança de banco sem aprovação explícita
```

---

## 3. Comissionamento de Professores

### 3.1 Status (DP-COMISSAO-PROF-001)

**ATUAL**: Questão resolvida em 2 de abril de 2026

```
Modelo ratificado:
1. Por aluno ativo mensal
2. Fórmula: alunos_ativos × VLA × percentual
```

**REGRA OBRIGATÓRIA**:
```
✅ RF-PROF-04 a RF-PROF-07 liberadas para implementação
✅ Cálculo de comissão permitido conforme DUV-03
```

**Referência de decisão**: `.copilot/memory/duv-resolutions.md` (DUV-03)

---

## 4. Restrições de Escopo

### 4.1 Proibições Absolutas

| O que | Razão | Consequência |
|---|---|---|
| ❌ Inventar requisitos | Requisitos vêm de análise, não de suposição | Refeito do zero |
| ❌ Alterar DB sem migration | Perda de rastreabilidade | Rollback obrigatório |
| ❌ Código sem testes | Débito técnico | Code review rejeita |
| ❌ Endpointssem validação 2-camadas | Segurança | Refeito obrigatório |
| ❌ Uso de SQL injection | Segurança crítica | Pull request recusado |
| ❌ Hard-code de secrets | Segurança crítica | Não mergea |
| ❌ Refator sem PLAN | Risco de regressão | Revertido |

### 4.2 Permissões Condicionais

| O que | Condição | Quem autoriza |
|---|---|---|
| ✅ Criar nova tabela | Must ter migration e documentação | Code review + eng sênior |
| ✅ Alterar procedure | Must ter teste e changelog | Eng sênior |
| ✅ Mudar estrutura de DTO | Must ter impacto no PLAN | Produto + backend lead |
| ✅ Usar biblioteca externa | Must ter análise de compatibilidade | Tech lead |

---

## 5. Documentação — Lei da Rastreabilidade

### 5.1 Padrão de Rastreamento

**Todo código deve traçar de volta**:

```
Linha de Código
  ↑ 
Referencia Task (tasks.md)
  ↑
Referencia PLAN (plan.md)
  ↑
Referencia SPEC (spec.md)
  ↑
Referencia Requisito (RF-XXX em requisitos)
  ↑
Referencia Problema (em história-operabilidade.md)
```

**Exemplo correto**:
```java
// RF-CAD-01: Permitir cadastrar aluno com CPF único
// Task: TASK-051-Cadastro-Aluno-Backend
// PLAN-001, seção 2.1

@PostMapping("/alunos")
public ResponseEntity<AlunoDTO> criarAluno(@RequestBody AlunoCadastroDTO dto) {
  // Validação 1: Frontend já validou
  // Validação 2: Backend valida integridade
  ...
}
```

### 5.2 Comentários Obrigatórios

```java
// ❌ MAU
public void Process() { ... }

// ✅ BOM
/**
 * RF-CAD-01: Validar unicidade de CPF durante cadastro
 * PLAN-001 §2.1: Camada Service com regra de negócio
 * @param cpf - CPF a validar (format: XXX.XXX.XXX-XX)
 * @return true se CPF é válido e único
 * @throws CPFJaExisteException - Se CPF já cadastrado
 */
public boolean validarCPFUnico(String cpf) { ... }
```

---

## 6. Arquitetura — Princípios Invioláveis

### 6.1 Estrutura MVC Obrigatória

```
Controller (Recebe requisição)
  ↓
Valida input (Bean Validation)
  ↓
Service (Regra de negócio)
  ↓
Valida lógica
  ↓
Repository (Acesso dados)
  ↓
Database (SQL)
  ↓
Retorna Entity
  ↓
Service converte → DTO
  ↓
Controller serializa → JSON
  ↓
Retorna resposta
```

**Regra**: 
- ❌ Controller NUNCA tem regra de negócio
- ❌ Service NUNCA tem acesso direto a HTTP
- ❌ Repository NUNCA tem lógica de negócio
- ✅ Cada camada tem responsabilidade única

### 6.2 DTOs são Obrigatórios

```java
// ❌ MAU — Retornar Entity direto
@GetMapping("/{id}")
public Aluno obterAluno(@PathVariable Long id) { ... }

// ✅ BOM — Retornar DTO
@GetMapping("/{id}")
public ResponseEntity<AlunoDTO> obterAluno(@PathVariable Long id) { ... }
```

---

## 7. Validação — Lei das Duas Camadas

### 7.1 Frontend (React)

```jsx
// ❌ NÃO SUFICIENTE
if (cpf.length !== 14) alert("CPF inválido");

// ✅ OBRIGATÓRIO - react-hook-form + validadores
<input {...register("cpf", { pattern: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/ })} />
```

### 7.2 Backend (Spring Boot)

```java
// ❌ NÃO SUFICIENTE
if (aluno.getCpf() == null) throw Exception();

// ✅ OBRIGATÓRIO - Bean Validation
public class AlunoCadastroDTO {
  @NotNull(message = "CPF é obrigatório")
  @Pattern(regexp = "\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}")
  private String cpf;
}
```

**Regra**: Validação é *redundante por design*. Frontend + Backend.

---

## 8. Segurança — Não Negociáveis

### 8.1 Autenticação (JWT)

```
❌ Session-based
✅ JWT com refresh token
✅ Expiração configurável (padrão: 1h)
✅ Refresh token com vida longa (7 dias)
❌ Sem secrets em .env untracked
✅ Secrets em vault ou env variables
```

### 8.2 Autorização (RBAC)

```
@PreAuthorize("hasRole('PROPRIETARIO')")     ✅
@PreAuthorize("hasRole('PROPRIETARIO') OR hasRole('COORDENADOR')") ✅
@RequestMapping("/admin") // Sem @PreAuthorize   ❌
```

### 8.3 Auditoria (Logging)

```
TODAS as operações críticas devem ter:
- Usuário responsável
- Timestamp
- Ação realizada
- Entidade afetada
- Resultado (sucesso/erro)

Exemplo:
✅ [AUDIT] User:felipsa@forcatotal.com | Action:DELETE | Entity:Aluno | ID:123 | Result:SUCCESS | Timestamp:2026-04-01T14:30:00Z
```

---

## 9. Testes — Cobertura Obrigatória

### 9.1 Tipos Mandatórios

| Camada | Tipo | Cobertura mínima |
|---|---|---|
| **Backend** | Unit Tests (Service) | ≥ 70% |
| **Backend** | Repository Tests | ≥ 60% |
| **Backend** | Integration Tests | ≥ 50% |
| **Frontend** | Component Tests | ≥ 60% |
| **Frontend** | Hook Tests | ≥ 60% |
| **E2E** | Critical Flows | 100% |

### 9.2 Padrão Obrigatório

```java
// ❌ MAU
@Test
public void test() {
  Aluno aluno = new Aluno();
  assertNotNull(aluno);
}

// ✅ BOM
@Test
@DisplayName("RF-CAD-01: Deve rejeitar CPF duplicado")
public void deveRejeitar_CPFDuplicado() {
  // Given: Aluno com CPF 123.456.789-10 já existe
  alunoRepository.save(new Aluno("123.456.789-10", "João"));
  
  // When: Tentar cadastrar outro aluno com mesmo CPF
  AlunoCadastroDTO dto = new AlunoCadastroDTO("123.456.789-10", "Maria");
  
  // Then: Deve lançar exceção
  assertThrows(CPFJaExisteException.class, () -> {
    alunoService.cadastrarAluno(dto);
  });
}
```

---

## 10. Code Review — Critérios de Aceitação

### 10.1 Checklist obrigatório

- [ ] Rastreabilidade: Código → PLAN → SPEC → Requisito
- [ ] Testes: Cobertura mínima atingida
- [ ] Validação: 2 camadas (frontend + backend)
- [ ] Segurança: Sem SQL injection, XSS, secrets
- [ ] Documentação: Comments, docstrings, README
- [ ] Estilo: Lint passing, Prettier formatted
- [ ] Performance: Sem N+1 queries, índices criados
- [ ] Backwards compatibility: Nenhuma breaking change sem análise

### 10.2 Motivos de Rejeição Imediata

```
❌ REJEIÇÃO AUTOMÁTICA:
- Sem testes
- Sem rastreabilidade
- Secrets em código
- SQL Injection vulnerável
- Sem documentação
```

---

## 11. Merge Request — Processo Obrigatório

### 11.1 Template de PR

```markdown
## Descrição
Breve descrição do que foi feito

## Rastreabilidade
- Task: TASK-XXX
- PLAN: PLAN-001 §2.1
- SPEC: SPEC-001 §3
- RF: RF-CAD-01, RF-CAD-03

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova feature
- [ ] Refatoração
- [ ] Documentação

## Checklist
- [ ] Código testado localmente
- [ ] Testes adicionados/atualizados
- [ ] Documentação atualizada
- [ ] Lint e Prettier passing
- [ ] Sem breaking changes
- [ ] Performance analisada

## Screenshots (se aplicável)
...
```

---

## 12. Decisões Pendentes

| Decisão | Status | Impacto | Próximo passo |
|---|---|---|---|
| `DP-TECH-STACK-001` | ✅ RESOLVIDA | PostgreSQL definido | Seguir padrão Flyway + PL/pgSQL |
| `DP-COMISSAO-PROF-001` | ✅ RESOLVIDA | Comissão destravada | Implementar conforme DUV-03 |
| `DP-CATRACA-001` | ✅ RESOLVIDA | Escopo futuro | Não implementar na Fase 5 inicial |
| `DP-ACESSO-PROF-001` | ✅ RESOLVIDA | Frontend desktop-first | Aplicar em UX dos módulos de professor |

**Não há bloqueadores críticos abertos no momento.**

---

## 13. Encerramento

Estas regras não são sugestões. São **leis do projeto**. 

Violar qualquer uma delas resulta em:
- Code review rejeição
- PR não-mergeavel
- Requirement de refazer

**Lei suprema**: *Se não está nos documentos hierárquicos, não existe.*
