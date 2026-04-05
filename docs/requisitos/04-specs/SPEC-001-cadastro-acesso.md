# SPEC-001 — Cadastro e Acesso — Especificação Completa

> **Versão**: 1.0  
> **Data**: 2 de abril de 2026  
> **Módulos**: M01 (Cadastro) + M02 (Acesso)  
> **Status**: 🟢 PRONTO PARA DESENVOLVIMENTO  
> **RFs Incluídos**: RF-CAD-01 a 08, RF-ACE-01 a 07 (15 RFs)  
> **Bloqueadores**: ✅ ZERO

---

> Nota de escopo MVP: esta SPEC orienta a entrega do MVP operacional. Requisitos de robustez em nivel enterprise ficam como evolucao futura e nao sao criterio de aceite desta fase.

## 1. Visão Geral

### Propósito
Especificar funcionalidades de **cadastro de entidades iniciais** (Academia, Usuário, Aluno) e **autenticação/autorização** necessárias para o MVP da Força Total.

### Escopo
- ✅ Cadastro de Academia (proprietário, localização, contato)
- ✅ Cadastro de Usuário (PROPRIETARIO, COORDENADOR, PROFESSOR, RECEPCIONISTA)
- ✅ Cadastro de Aluno (dados pessoais, responsável, documento)
- ✅ Autenticação (login via CPF + senha)
- ✅ Autorização (controle de acesso por role)
- ✅ Recuperação de senha
- ✅ Logout

### Não Incluso (Futuro)
- ❌ Integração com redes sociais (Google, Facebook login)
- ❌ Two-factor authentication (2FA)
- ❌ Biometria
- ❌ SSO/SAML empresarial

---

## 2. Referências Críticas

| Documento | Seção | Referência |
|-----------|-------|-----------|
| [Glossário](../00-originais/glossario.md) | Academia, Aluno, Usuário, Autenticação | Terminologia padronizada |
| [Guia Padrões](../00-originais/guia-padroes-codigo-convencoes.md) | Backend, Frontend, Security | Padrões de código |
| [Matriz Rastreabilidade](../02-mapa/matriz-rastreabilidade.md) | M01-M02 RFs | Mapeamento RFs → Tabelas |
| [Modelo Dados](../02-mapa/modelo-dados-conceitual.md) | USUARIO, ALUNO, ACADEMIA | Schema database |
| [RNFs Detalhados](../02-mapa/requisitos-nao-funcionais-detalhados.md) | RNF-01, 03, 13, 14 | Acceptance criteria |
| [CONTRIBUTING.md](../../CONTRIBUTING.md) | Code Review | Padrão de PR |

---

## 3. Requisitos Funcionais Detalhados

### 3.1 RF-CAD-01: Cadastro de Academia

#### Descrição
Permitir que o proprietário crie um novo registro de academia (unidade) no sistema. Cada academia é uma unidade independente da rede com endereço, telefone, horário de funcionamento e coordenador responsável.

#### Casos de Uso

**UC-001: Proprietário Cria Academia Principal**  
Ator: Proprietário (primeira vez usando app)  
Pré-condição: Proprietário logado pela primeira vez (novo)  
Pós-condição: Academia criada, Proprietário vinculado como OWNER

```
1. Sistema detect novo proprietário (1ª vez)
2. Redireciona para "Criar Minha Academia"
3. Proprietário preenche:
   ├─ Nome academia (ex: "Força Total - Centro")
   ├─ Cidade/UF (ex: "São Paulo/SP")
   ├─ Endereço completo
   ├─ Telefone (ex: "(11) 3456-7890")
   ├─ Email (opcional para notificações)
   ├─ Horário abertura (ex: "06:00")
   ├─ Horário fechamento (ex: "23:00")
   └─ Logo (upload imagem, opcional)
4. Sistema validar dados
5. Proprietário clica "Criar Academia"
6. Sistema persistence em BD + envia email confirmação
7. Redirect para dashboard
```

**Fluxo Principal (Happy Path)**

```
1. [PROPRIETARIO] Clica "Criar Nova Academia"
2. [SISTEMA] Carrega form com campos obrigatórios
3. [PROPRIETARIO] Preenche: Nome, Cidade, Endereço, Telefone, Horários
4. [SISTEMA] Valida:
   ├─ Nome: 3-100 caracteres, sem números
   ├─ CEP: formato valid (xxxxx-xxx)
   ├─ Telefone: 10-11 dígitos (DDD)
   ├─ Horários: abertura < fechamento
   └─ Não pode haver 2 academias mesmo CEP+nome
5. [PROPRIETARIO] Confirma "Criar"
6. [SISTEMA] Insere ACADEMIA table + linka USUARIO(proprietario)
7. [SISTEMA] Email: "Academia criada com sucesso"
8. [PROPRIETARIO] Vê dashboard inicial
```

**Fluxos Alternativos**

```
A1: Dados inválidos
├─ 4a. Validação falha
├─ 4b. Sistema mostra erro em campo específico (vermelho)
├─ 4c. Cursor em campo com erro
└─ Usuário corrige e tenta novamente

A2: Academia já existe
├─ 4d. System detecta ACADEMIA(CEP + nome) já existe
├─ 4e. Pergunta "Academia já existe. Usar como segunda unidade?"
└─ Se sim → linked ao proprietário como COORDENADOR

A3: Timeout/Erro servidor
├─ 6a. Erro ao salvar
├─ 6b. Sistema mostra "Erro ao criar. Tente novamente em 5s"
└─ Auto-retry ou manual
```

#### Regras de Negócio

```
RN-CAD-001: Uma academia precisa de exatamente 1 COORDENADOR
            └─ Proprietário é auto-COORDENADOR da 1ª academia

RN-CAD-002: Academia não pode ficar sem responsável (coordenador)
            └─ Se coordenador sair, proprietário vira temporário

RN-CAD-003: Múltiplas academias na mesma rede
            └─ Proprietário pode gerenciar N academias
            └─ Cada academia tem dados isolados

RN-CAD-004: Dados obrigatórios mínimos
            ├─ Nome: SIM (validar 3-100 chars)
            ├─ Localização: SIM (CEP + Endereço)
            ├─ Telefone: SIM
            ├─ Horários: SIM
            └─ Email: NÃO (opcional)

RN-CAD-005: Dados únicos por academia
            ├─ Nome + CEP: único (evita duplicação)
            ├─ Não pode ter 2 academias nome="Força Total - Centro" mesmo CEP
            └─ Mas pode ter 2 em CEPs diferentes
```

#### Dados de Entrada

```
Entrada: AcademiaCreateDto
├─ nomeAcademia: String (3-100 chars, pt-BR)
├─ cep: String (formato: xxxxx-xxx, validado)
├─ endereco: String (rua + número)
├─ complemento: String (apt, sala, opcional)
├─ cidade: String
├─ estado: String (2 chars, enum UF)
├─ telefone: String (10-11 dígitos, DDD)
├─ email: String (opcional, validado se present)
├─ horariosAbertura: LocalTime (HH:mm)
├─ horarioFechamento: LocalTime (HH:mm)
└─ logo: File (optional, max 2MB, jpg/png)
```

#### Dados de Saída

```
Saída: AcademiaResponseDto
├─ academiaId: Long
├─ nomeAcademia: String
├─ cep: String
├─ endereco: String
├─ complemento: String
├─ cidade: String
├─ estado: String
├─ telefone: String
├─ email: String
├─ horariosAbertura: LocalTime
├─ horarioFechamento: LocalTime
├─ ativo: Boolean
├─ logo_url: String (se aplicável)
├─ proprietarioId: Long
├─ criadoEm: OffsetDateTime
└─ atualizadoEm: OffsetDateTime
```

#### Validações

| Campo | Regra | Erro |
|-------|-------|------|
| nomeAcademia | 3-100 chars, sem números | "Nome deve ter 3-100 caracteres" |
| cep | ^[0-9]{5}-[0-9]{3}$ | "CEP inválido (formato: xxxxx-xxx)" |
| endereco | 10-200 chars | "Endereço incompleto" |
| cidade | 2-50 chars | "Cidade inválida" |
| estado | enum (UF) | "Estado não reconhecido" |
| telefone | 10-11 dígitos | "Telefone deve ter 10 ou 11 dígitos" |
| email | RFC 5322 | "Email inválido" |
| abertura < fechamento | time logic | "Horário de abertura deve ser menor que fechamento" |
| unique(nome, cep) | composite | "Academia com este nome+CEP já existe" |

#### Critério de Aceitação (baseado em RNF)

```
✅ RNF-01 (Interface simples)
   └─ Form tem máximo 10 campos visíveis
   └─ Campos obrigatórios marcados com *
   └─ Help text em português claro

✅ RNF-13 (Segurança - Dados não sensíveis aqui)
   └─ Validações client + server
   └─ Sem dados sensíveis expostos

✅ RNF-14 (Validação 2-layer)
   ├─ Frontend: Validação imediata (onChange)
   └─ Backend: Validação completa (server)

✅ Performance (RNF-06)
   ├─ Validação < 100ms
   ├─ Insert BD < 500ms
   └─ Response para cliente < 1s total
```

#### Exemplos de Tela

**Frontend: AcademiaCreateForm.jsx**
```
┌─────────────────────────────────┐
│ Criar Minha Academia            │
├─────────────────────────────────┤
│                                 │
│ Nome da Academia *              │
│ [Força Total - Centro_________] │
│  ⓘ Ex: "Força Total - Centro"   │
│                                 │
│ CEP *                           │
│ [01310--100_____________________] │
│  ⓘ Formato: xxxxx-xxx           │
│                                 │
│ Endereço *                      │
│ [Av. Paulista, 1000____________] │
│                                 │
│ Cidade * | Estado *             │
│ [São Paulo___] [SP___]          │
│                                 │
│ Telefone * (com DDD)            │
│ [(11) 3456-7890________]        │
│                                 │
│ Horário Abertura *              │
│ [06:00________]                 │
│                                 │
│ Horário Fechamento *            │
│ [23:00________]                 │
│                                 │
│ [ Criar Academia ]              │
│                                 │
└─────────────────────────────────┘
```

#### Database Schema

```sql
-- Referência: modelo-dados-conceitual.md
INSERT INTO ACADEMIA (
    nome, cep, endereco, complemento, cidade, estado,
    telefone, email, horario_abertura, horario_fechamento,
    coordenador_id, ativo, criado_em
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, true, CURRENT_TIMESTAMP);

-- Trigger: AUDITORIA_LOG registra
INSERT INTO AUDITORIA_LOG (
    usuario_id, tabela_modificada, operacao, registro_id,
    valores_antes, valores_depois, data_hora
) VALUES (?, 'ACADEMIA', 'INSERT', ?, NULL, ?, CURRENT_TIMESTAMP);
```

#### Referências

| Tipo | ID | Descrição |
|------|----|-|
| RF | RF-CAD-01 | Cadastro Academia |
| RNF | RNF-01, 13, 14 | Interface, Segurança, Validação |
| Table | ACADEMIA | Tabela principal |
| DUV | — | Nenhuma |
| DP | DP-TECH-STACK-001 | PostgreSQL, Java/Spring |

---

### 3.2 RF-CAD-02: Cadastro de Usuário (COORDENADOR, PROFESSOR, RECEPCIONISTA)

#### Descrição
Permitir que um PROPRIETARIO crie novos usuários (COORDENADOR, PROFESSOR, RECEPCIONISTA) na academia. Cada usuário tem autenticação via CPF + senha e permissões baseadas em role.

#### Casos de Uso

**UC-002: Proprietário Cria Novo COORDENADOR**

```
1. [PROP] Acessa "Gerenciar Usuários" → "Adicionar Usuário"
2. [SYS] Form vazio com campos
3. [PROP] Preenche:
   ├─ Nome: "Maria Silva"
   ├─ CPF: "123.456.789-00"
   ├─ Email: "maria@forcatotal.com"
   ├─ Senha: "Abc123!@!"
   ├─ Confirmar: "Abc123!@!"
   ├─ Role: "COORDENADOR"
   └─ Academia: "Força Total - Centro"
4. [SYS] Valida CPF, uniqueness, password strength
5. [SYS] Hash senha com BCrypt (cost=10)
6. [SYS] Insere em USUARIO table
7. [SYS] Email: "Bem-vindo! Seu login é: CPF 123.456.789-00"
8. [PROP] Vê confirmação "Usuário criado"
```

#### Fluxo Principal

```
1. [USER] Navigate to "Adicionar Usuário"
2. [SYS] Load form com:
   ├─ Nome (obrigatório)
   ├─ CPF (obrigatório, unique)
   ├─ Email (obrigatório, unique)
   ├─ Rol (dropdown: COORDENADOR|PROFESSOR|RECEPCIONISTA)
   ├─ Senha (obrigatório, strength indicator)
   └─ Confirmar Senha (match validation)
3. [USER] Fill all fields
4. [SYS] Validar:
   ├─ CPF: algoritmo mod-11 + unique
   ├─ Email: RFC 5322 + unique glob
   ├─ Senha: min 8 chars, 1 maiúscula, 1 número, 1 especial
   └─ Senha match confirm
5. [USER] Click "Criar Usuário"
6. [SYS] 
   ├─ Hash senha: BCrypt(password, cost=10)
   ├─ Insert USUARIO
   ├─ Insert AUDITORIA_LOG
   ├─ Send welcome email
   └─ Return created user
7. [USER] See success "Usuário criado: Maria Silva (COORDENADOR)"
```

#### Validações

| Campo | Regra | Erro |
|-------|-------|------|
| nome | 3-255 chars, letters only | "Nome deve ter 3-255 caracteres, letra/espaço apenas" |
| cpf | valid mod-11 + unique | "CPF inválido ou já cadastrado" |
| email | RFC 5322 + unique | "Email inválido ou já cadastrado" |
| role | enum | "Role inválido" |
| senha | min 8, 1 upper, 1 digit, 1 special | "Senha fraca (min: 8 chars, 1 MAIÚSCULA, 1 número, 1 especial)" |
| confirmaSenha | == senha | "Senhas não conferem" |

#### Critério de Aceitação

```
✅ Senha hash com BCrypt
   ├─ Cost = 10
   ├─ Tempo compute: 100-200ms (aceitável)
   └─ Nunca armazenar plain text

✅ CPF validado
   ├─ Algoritmo mod-11 correto
   ├─ Formato: xxx.xxx.xxx-xx
   └─ Único na academia

✅ Email único globalmente
   ├─ Evita contas duplicadas
   └─ Case-insensitive comparison

✅ Sensibilidade 2-factor (future)
   ├─ Atualmente: single password
   └─ 2FA será adicionado em Phase 3

✅ Auditoria rastreada
   ├─ AUDITORIA_LOG registra quem criou usuário
   ├─ Timestamp + usuario_id + IP
   └─ Queryable após
```

#### Database Schema

```sql
INSERT INTO USUARIO (
    academia_id, cpf, nome_completo, email, senha_hash,
    role, ativo, criado_em
) VALUES (
    ?, sha256(cpf), ?, ?, bcrypt(senha, cost=10),
    ?, true, CURRENT_TIMESTAMP
);
-- CPF armazenado como SHA256 (nunca plain text)
-- Senha como BCrypt(password)
```

---

### 3.3 RF-CAD-03: Cadastro de Aluno

#### Descrição
Permitir que RECEPCIONISTA, PROFESSOR, ou COORDENADOR crie registro de aluno (matriculável). Aluno tem dados pessoais, contato, responsável (se menor), e é vinculado a uma academia.

#### Fluxo Principal

```
1. [RECEPCAO] Clica "Adicionar Aluno" ou "Cadastrar Novo"
2. [SYS] Load form multi-step (3 steps):
   
   STEP 1: Dados Pessoais
   ├─ Nome completo *
   ├─ Data nascimento *
   ├─ Gênero
   ├─ CPF (optional, pode ser SEM CPF)
   └─ RG/CNH
   
   STEP 2: Contato
   ├─ Email
   ├─ Telefone celular *
   ├─ Telefone residencial (opt)
   └─ Endereço completo
   
   STEP 3: Responsável (se menor de 18)
   ├─ Nome responsável *
   ├─ Relação (mãe, pai, avó, etc) *
   ├─ CPF *
   ├─ Telefone *
   └─ Email (opt)

3. [RECEPCAO] Valida cada step
4. [RECEPCAO] Confirma "Criar Aluno"
5. [SYS] Insert ALUNO + CONTATO + RESPONSAVEL (if under 18)
6. [RECEPCAO] Vê ID do aluno, pode imprimir comprovante
```

#### Validações

| Campo | Regra | Erro |
|-------|-------|------|
| nomeCompleto | 3-255 chars | "Nome deve ter 3-255 caracteres" |
| dataNascimento | valid date, < 100 years old | "Data inválida ou pessoa muito velha" |
| cpf | optional: if provided, must be valid | "CPF inválido" |
| email | optional: if provided, must be RFC 5322 | "Email inválido" |
| telefoneCelular | 10-11 dígitos DDD | "Telefone celular deve ter 10-11 dígitos" |
| responsavel (minor) | obrigatório se < 18 | "Responsável obrigatório para menores" |
| responsavelCPF | valid mod-11 | "CPF responsável inválido" |

#### Database Schema

```sql
-- ALUNO
INSERT INTO ALUNO (
    academia_id, nome_completo, data_nascimento, genero,
    cpf, cpf_hash, rg, ativo, criado_em
) VALUES (?, ?, ?, ?, ?, SHA256(cpf), ?, true, ?);

-- CONTATO_ALUNO
INSERT INTO CONTATO_ALUNO (
    aluno_id, email, telefone_celular, telefone_residencial,
    endereco, complemento, cep, cidade, estado
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);

-- RESPONSAVEL (if idade < 18)
INSERT INTO RESPONSAVEL (
    aluno_id, nome, relacao, cpf, cpf_hash, telefone, email
) VALUES (?, ?, ?, ?, SHA256(cpf), ?, ?);
```

---

### 3.4 RF-ACE-01: Autenticação (Login)

#### Descrição
Permitir que qualquer usuário cadastrado (PROPRIETARIO, COORDENADOR, PROFESSOR, RECEPCIONISTA) acesse o sistema usando CPF + Senha. Uma vez autenticado, recebe JWT token com 5min de expiração.

#### Fluxo Principal

```
1. [QUALQUER] Acessa sistema, vê tela de login
2. [SYS] Mostra form:
   ├─ CPF: [____________]
   ├─ Senha: [________]
   └─ [ LOGIN ] [ Esqueci Senha ]

3. [USER] Enter CPF (auto-format: xxx.xxx.xxx-xx)
4. [USER] Enter senha
5. [USER] Click "Login"
6. [SYS] Valida entrada format (básico)
7. [SYS] Query: SELECT * FROM USUARIO WHERE cpf_hash = SHA256(input_cpf)
8. [SYS] If found:
   ├─ Compare: BCrypt.matches(input_password, usuario.senha_hash)
   ├─ If match:
   │  ├─ Gera JWT token (incluir: userId, role, academiaId)
   │  ├─ Token expiry: +5 minutos
   │  ├─ Refresh token: +7 dias (optional)
   │  ├─ Insert AUDITORIA_LOG: "LOGIN_SUCESSO"
   │  ├─ Set cookie: HttpOnly, Secure, SameSite=Strict
   │  └─ Redirect para dashboard
   └─ If no match:
      ├─ Increment failed_attempts counter
      ├─ If failed_attempts >= 5:
      │  ├─ Block usuário por 15 minutos
      │  └─ Email: "Tentativas de login falhadas"
      └─ Show error: "CPF ou senha incorretos"
9. [USER] Redirect to dashboard OR see error
```

#### Validações

| Campo | Regra | Erro |
|-------|-------|------|
| cpf | format xxx.xxx.xxx-xx | "CPF em formato inválido" |
| senha | not empty | "Senha obrigatória" |
| rate limit | max 5 attempts/15min | "Muitas tentativas. Tente novamente em 15min" |
| usuario exists | must find in DB | "CPF ou senha incorretos" |
| password match | BCrypt.matches() | "CPF ou senha incorretos" |
| user active | usuario.ativo = true | "Usuário inativo. Contate administrador" |

#### Critério de Aceitação (RNF-03: Autenticação)

```
✅ JWT Token
   ├─ Gerado com HS256 signature
   ├─ Expiry: 5 minutos (RNF-03)
   ├─ Header: Authorization: Bearer <token>
   └─ Payload: {userId, role, academiaId, exp, iat}

✅ Password Security
   ├─ BCrypt compare (never == plain)
   ├─ Failed attempts tracked
   ├─ Lockout após 5 tentativas
   └─ 15 min block per IP

✅ HttpOnly Cookie
   ├─ Token não accessível via JavaScript (XSS protection)
   ├─ Secure flag (HTTPS only)
   ├─ SameSite=Strict (CSRF protection)
   └─ Domain=forcatotal.com

✅ Auditoria
   ├─ LOGIN_SUCESSO logged
   ├─ LOGIN_FALHA logged (com IP)
   ├─ Queryable por usuário/data/IP
   └─ Retenção: 6 meses
```

#### Database Schema

```sql
-- USUARIO table (já existe)
CREATE TABLE USUARIO (
    usuario_id SERIAL PRIMARY KEY,
    academia_id SMALLINT,  -- NULL = global access (proprietário)
    cpf_hash VARCHAR(64) UNIQUE NOT NULL,  -- SHA256
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,  -- BCrypt
    role ENUM('PROPRIETARIO', 'COORDENADOR', 'PROFESSOR', 'RECEPCIONISTA'),
    ativo BOOLEAN DEFAULT TRUE,
    failed_login_attempts INTEGER DEFAULT 0,
    last_failed_login TIMESTAMP,
    bloqueado_ate TIMESTAMP,  -- NULL if not blocked
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AUDITORIA_LOG (registra login attempts)
INSERT INTO AUDITORIA_LOG (
    usuario_id, tabela_modificada, operacao, registro_id,
    valores_antes, valores_depois, ip_address, data_hora
) VALUES (?, 'USUARIO', 'LOGIN', usuario_id, NULL, ?, ?, ?);
```

---

### 3.5 RF-ACE-02: Autorização (Controle de Acesso por Role)

#### Descrição
Após autenticação, cada usuário tem um ROLE (PROPRIETARIO, COORDENADOR, PROFESSOR, RECEPCIONISTA) que determina quais telas/APIs pode acessar. Sistema valida autorização em CADA request.

#### Matriz de Acesso (por Role / Recurso)

```
Recurso                  PROP  COORD  PROF  RECV
═════════════════════════════════════════════════
Academia (Create)         ✅    ❌    ❌    ❌
Academia (List own)       ✅    ✅    ❌    ❌
Academia (Edit config)    ✅    ✅    ❌    ❌
Usuário (Create/Delete)   ✅    ✅    ❌    ❌
Usuário (View)            ✅    ✅    ❌    ❌
Aluno (Create)            ✅    ✅    ✅    ✅
Aluno (List)              ✅    ✅    ✅    ✅
Aluno (Edit)              ✅    ✅    ⚠️*   ✅
Aula (Schedule)           ✅    ✅    ✅    ❌
Checkin (Do)              ✅    ✅    ✅    ✅
Pagamento (Record)        ✅    ✅    ❌    ✅
Financeiro (Dashboard)    ✅    ✅    ❌    ❌
Relatório (Execute)       ✅    ✅    ❌    ❌
═════════════════════════════════════════════════

*PROF pode editar apenas seus dados pessoais
⚠️ diferentes academias NÃO podem acessar uma à outra
```

#### Implementação (Backend)

```java
// Spring Security @PreAuthorize
@GetMapping("/academias/{id}")
@PreAuthorize("hasAnyRole('PROPRIETARIO', 'COORDENADOR')")
public ResponseEntity<AcademiaDto> getAcademia(@PathVariable Long id) { }

@PostMapping("/usuarios")
@PreAuthorize("hasAnyRole('PROPRIETARIO', 'COORDENADOR')")
public ResponseEntity<UsuarioDto> createUsuario(@Valid @RequestBody UsuarioCreateDto) { }

@PostMapping("/alunos")
@PreAuthorize("hasAnyRole('PROPRIETARIO', 'COORDENADOR', 'PROFESSOR', 'RECEPCIONISTA')")
public ResponseEntity<AlunoDto> createAluno(@Valid @RequestBody AlunoCreateDto) { }

// Custom annotation para isolamento multi-tenant
@PostAuthorize("@academiaAccessCheck.canAccess(returnValue.academiaId, authentication)")
@GetMapping("/alunos/{id}")
public AlunoDto getAluno(@PathVariable Long id) { }
```

#### Frontend (React)

```javascript
// useAuth hook
export function useAuth() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      // Decode JWT (não validar sig no client, trust server)
      const payload = jwtDecode(token);
      setUser({
        userId: payload.userId,
        role: payload.role,
        academiaId: payload.academiaId
      });
    }
  }, []);
  
  return user;
}

// ProtectedRoute component
export function ProtectedRoute({ allowedRoles, children }) {
  const user = useAuth();
  
  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/403-forbidden" />;
  }
  
  return children;
}

// Usage
<ProtectedRoute allowedRoles={['PROPRIETARIO', 'COORDENADOR']}>
  <AdministratorPanel />
</ProtectedRoute>
```

---

### 3.6 RF-ACE-03: Bloquear Acesso Inadimplentes

#### Descrição
Se um ALUNO está inadimplente (não pagou mensalidade dentro de carência de 3 dias), seu CPF é BLOQUEADO no check-in e acesso ao app.

#### Fluxo

```
1. [RECEPCAO / APP] Tenta fazer checkin de aluno
2. [SYS] Busca MATRICULA ativa para este aluno
3. [SYS] Verifica: status_pagamento = ?
   
   IF status = "QUITADO" → Permitir checkin ✅
   
   IF status = "VENCIDO" ou "INADIMPLENTE":
   ├─ Calcula dias desde vencimento
   ├─ IF dias <= 3 (carência) → Permitir + AVISO ⚠️
   │  └─ Mostrar: "Atenção: mensalidade vencida há X dias"
   └─ IF dias > 3 → BLOQUEAR ❌
      ├─ Insert MATRICULA_BLOQUEIO
      ├─ Log: "BLOQUEIO_AUTOMATICO_INADIMPLENCIA"
      └─ Error: "Aluno bloqueado. Pague mensalidade"
```

#### Critério de Aceitação

```
✅ Carência: 3 dias exatos
   ├─ Config: CONFIG_PARAMETRO.dias_carencia_vencimento = 3
   ├─ Cálculo: TODAY - data_vencimento <= 3
   └─ Trigger automático no checkin

✅ Auditoria
   ├─ MATRICULA_BLOQUEIO.motivo = "CARENCIA_ESGOTADA"
   ├─ AUDITORIA_LOG com timestamp
   └─ Queryable por aluno

✅ Email Notificação (future)
   ├─ 1 dia antes de vencer: "Sua matrícula vence amanhã"
   ├─ No vencimento: "Sua matrícula venceu"
   ├─ Fim da carência: "Acesso bloqueado: pague mensalidade"
   └─ Após pagamento: "Acesso liberado"
```

---

### 3.7 RF-ACE-04: Recuperação de Senha

#### Descrição
Usuário que esqueceu senha pode recuperar usando email vinculado. Sistema sends one-time token (válido 30min), usuário clica link e define nova senha.

#### Fluxo

```
1. [USER] Na tela login, clique "Esqueci Senha"
2. [SYS] Mostra form: "Digite seu CPF"
3. [USER] Enter CPF
4. [SYS] Query: SELECT * FROM USUARIO WHERE cpf_hash = SHA256(cpf)
5. [SYS] If found:
   ├─ Gera token: random 32 chars (crypto.randomBytes)
   ├─ Insert: RESET_PASSWORD_TOKEN(usuario_id, token, expires_at)
   ├─ Email: "Clique para redefinir: https://app/reset?token=XXX"
   ├─ Show: "Email enviado. Verifique seu inbox"
   └─ Session timeout: 5 minutos
6. [USER] Recebe email, clica link
7. [SYS] Valida token:
   ├─ Token existe em DB?
   ├─ Não expirou? (< 30 min)
   └─ Se Valid → mostra "Nova Senha" form
8. [USER] Digite nova senha + confirma
9. [SYS] Validar:
   ├─ Força: min 8, 1 upper, 1 digit, 1 special
   ├─ Não pode reutilizar últimas 3 senhas
   └─ Senhas match
10. [SYS] Hash nova senha, update USUARIO, delete token
11. [SYS] Email: "Senha alterada com sucesso"
12. [USER] Redirect para login
```

#### Validações

| Campo | Regra | Erro |
|-------|-------|------|
| cpf | encontrado em DB | "CPF não encontrado" |
| token | exists + valid date | "Link inválido ou expirado" |
| novaSenha | min 8, 1U, 1d, 1s, não reutilizada | "Senha não atende critérios" |

---

### 3.8 RF-ACE-05: Logout

#### Descrição
Usuário clica "Logout" para terminar sua sessão. JWT token é invalidado. Próximo request sem válido token recebe 401 Unauthorized.

#### Fluxo

```
1. [USER] Na app, clica botão "Logout" (menu)
2. [SYS] 
   ├─ Delete sessionStorage: authToken
   ├─ Delete HTTP cookie com token
   ├─ Insert AUDITORIA_LOG: "LOGOUT"
   └─ Redirect para /login
3. [USER] Vê tela login
```

#### Implementação

```javascript
// Frontend logout
export function LogoutButton() {
  const handleLogout = () => {
    sessionStorage.removeItem('authToken');
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/login';
  };
  
  return <button onClick={handleLogout}>Logout</button>;
}

// Backend: Invalidate token (optional, tokens expiram automaticamente)
@PostMapping("/logout")
public ResponseEntity<?> logout(HttpServletRequest request) {
  String token = extractToken(request);
  // Insert token em blacklist (se quiser logout imediato)
  tokenBlacklistService.addToBlacklist(token);
  return ResponseEntity.ok(new MessageDto("Logged out successfully"));
}
```

---

### 3.9 RF-ACE-06: Validação de Sessão Expirada

#### Descrição
Quando JWT token expira (5 minutos), frontend detecta e redireciona para login com mensagem "Sua sessão expirou. Faça login novamente".

#### Fluxo

```
1. [USER] Working na app
2. [5 minutos passam]
3. [USER] Faz qualquer request (ex: click para salvar)
4. [SYS] Verifica JWT:
   ├─ Token.exp < CURRENT_TIME
   ├─ Se TRUE: 401 Unauthorized + error body
   └─ Se FALSE: Processa normalmente
5. [FRONTEND] Recebe 401:
   ├─ Clear sessionStorage.authToken
   ├─ Show modal: "Sessão expirada. Faça login novamente"
   ├─ 5s delay
   └─ Redirect para /login
6. [USER] Vê tela login + error toast
```

#### Implementação (Frontend)

```javascript
// Axios interceptor
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('authToken');
      alert('Sua sessão expirou. Faça login novamente.');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

### 3.10 RF-ACE-07: Controle de Sessões Simultâneas

#### Descrição
Um usuário pode ter no máximo 1 sessão ativa por vez. Se faz login em outro device/browser, sessão anterior é encerrada (ou requer confirmação).

#### Fluxo

```
1. [USER-MARIA] De casa: Login via celular
   ├─ Token criado: token_v1
   ├─ SESSION table: {usuario_id: 123, token: token_v1, ip: 192.168.1.5}
   └─ Works with token_v1

2. [USER-MARIA] No trabalho: Login via PC
   ├─ Backend detecta: já existe sessão ativa
   ├─ Opções:
   │  A) Auto-replace: Delete session_v1, create session_v2
   │  B) Ask: "Você já conectado em outro lugar. Desconectar dele?"
   └─ Usar opção A (simpler, production-standard)

3. [BACKEND]
   ├─ Delete old token: token_v1
   ├─ Create new token: token_v2
   ├─ Send logout event (optional: notify via email)
   └─ Return token_v2 to new login

4. [OLD-SESSION]
   ├─ Next request com token_v1
   ├─ Backend: Token não encontrado/revoked
   ├─ Return 401
   └─ Frontend redirects to login: "Deslogado de outro dispositivo"
```

---

## 4. Especificações Técnicas

### 4.1 Stack de Tecnologia

#### Backend

```
Java 17+
Spring Boot 3.0+
├─ spring-boot-starter-web (REST API)
├─ spring-boot-starter-data-jpa (ORM)
├─ spring-boot-starter-security (Auth)
├─ spring-boot-starter-validation (JSR-380)
└─ spring-boot-starter-mail (Email)

Database
├─ PostgreSQL 14+
├─ Flyway (migrations)
└─ JDBC connection pool (HikariCP)

Security
├─ JWT (jjwt library)
├─ BCrypt (spring-security-crypto)
└─ Spring Security filters

Testing
├─ JUnit 5
├─ Mockito
└─ TestContainers (PostgreSQL container)
```

#### Frontend

```
Node.js 18+
React 18+
├─ react-hook-form (forms)
├─ zod (validation)
├─ axios (HTTP client)
├─ react-router-dom (routing)
└─ zustand or Redux (state management)

UI/CSS
├─ Tailwind CSS or Material-UI
└─ react-toastify (notifications)

Testing
├─ Jest
├─ React Testing Library
└─ MSW (Mock Service Worker)
```

### 4.2 API Endpoints (Backend)

```
POST   /api/v1/auth/login              (RF-ACE-01)
POST   /api/v1/auth/refresh-token      (RF-ACE-01)
POST   /api/v1/auth/forgot-password    (RF-ACE-04)
POST   /api/v1/auth/reset-password     (RF-ACE-04)
POST   /api/v1/auth/logout             (RF-ACE-05)

POST   /api/v1/academias               (RF-CAD-01)
GET    /api/v1/academias/{id}          (RF-CAD-01)
PUT    /api/v1/academias/{id}          (RF-CAD-01)
GET    /api/v1/academias               (RF-CAD-01, list)

POST   /api/v1/usuarios                (RF-CAD-02)
GET    /api/v1/usuarios/{id}           (RF-CAD-02)
PUT    /api/v1/usuarios/{id}           (RF-CAD-02)
DELETE /api/v1/usuarios/{id}           (RF-CAD-02)
GET    /api/v1/usuarios                (RF-CAD-02, list)

POST   /api/v1/alunos                  (RF-CAD-03)
GET    /api/v1/alunos/{id}             (RF-CAD-03)
PUT    /api/v1/alunos/{id}             (RF-CAD-03)
GET    /api/v1/alunos                  (RF-CAD-03, list)

POST   /api/v1/checkins                (RF-ACE-03, utiliza)
GET    /api/v1/authorization/check     (RF-ACE-02, check role)
```

---

## 5. Critério de Aceitação (Integrado com RNFs)

### Checklist Funcional

```
✅ RF-CAD-01 (Academia)
   [✓] Criar academia com dados obrigatórios
   [✓] Validação CEP + phone format
   [✓] Unique constraint (nome + CEP)
   [✓] Proprietário vinculado automaticamente
   [✓] Email confirmação enviado

✅ RF-CAD-02 (Usuário)
   [✓] Criar usuário com role específico
   [✓] Senha hash com BCrypt cost=10
   [✓] CPF valid + unique
   [✓] Email unique
   [✓] Auditoria logged

✅ RF-CAD-03 (Aluno)
   [✓] Criar aluno com dados pessoais
   [✓] Responsável obrigatório se < 18
   [✓] Contato armazenado separadamente
   [✓] CPF optional, mas se present → valid

✅ RF-ACE-01 (Login)
   [✓] CPF + senha authentication
   [✓] JWT token gerado (5min expiry)
   [✓] Senha hashed com BCrypt
   [✓] Failed attempts tracked (5 attempts → 15min block)
   [✓] Auditoria logged (sucesso + falha)

✅ RF-ACE-02 (Autorização)
   [✓] Role-based access control (RBAC)
   [✓] 4 roles implementados (PROP, COORD, PROF, RECV)
   [✓] Multi-tenant isolation (academia_id)
   [✓] Frontend + backend authorization
   [✓] 401 Unauthorized retorno se denied

✅ RF-ACE-03 (Bloquear Inadimplentes)
   [✓] Carência 3 dias após vencimento
   [✓] Trigger automático na tentativa checkin
   [✓] MATRICULA_BLOQUEIO registra
   [✓] Auditoria completa

✅ RF-ACE-04 (Recuperação Senha)
   [✓] Email com token one-time
   [✓] Token expiry 30 minutos
   [✓] Nova senha validada
   [✓] Histórico de senhas (não reutilizar últimas 3)
   [✓] Email confirmação

✅ RF-ACE-05 (Logout)
   [✓] Token removido (sessionStorage)
   [✓] Cookie deletado
   [✓] Auditoria logged
   [✓] Redirect para login

✅ RF-ACE-06 (Sessão Expirada)
   [✓] 401 Unauthorized quando token < exp
   [✓] Frontend detecta + redirect
   [✓] Toast message "Sessão expirada"
   [✓] Redireciona para /login

✅ RF-ACE-07 (Sessões Simultâneas)
   [✓] Max 1 sessão ativa por usuário
   [✓] Nova login → desconecta anterior
   [✓] Old session recebe 401 next request
   [✓] SESSION table tracks ativo
```

### Performance (RNF-06)

```
✅ Login < 1 segundo (P95)
   ├─ DB query: < 100ms
   ├─ BCrypt password check: < 200ms
   ├─ JWT generation: < 50ms
   └─ Total: < 350ms typical, 500ms worst-case

✅ User Creation < 500ms
   ├─ Validações: < 100ms
   ├─ Password hash: < 200ms
   ├─ DB insert: < 100ms
   └─ Total: < 400ms

✅ Load test simulated (50 concurrent users)
   ├─ P95 latency: < 2 segundos
   ├─ P99 latency: < 5 segundos
   └─ No timeout errors
```

### Security (RNF-13, RNF-14)

```
✅ Password Security
   [✓] BCrypt cost ≥ 10
   [✓] Never plain-text in logs
   [✓] Never returned in API
   [✓] 2-layer validation (client + server)

✅ JWT Security
   [✓] HS256 signature
   [✓] 5-minute expiry
   [✓] HttpOnly cookie (no JS access)
   [✓] Secure flag (HTTPS only)

✅ Database Security
   [✓] CPF armazenado como SHA256
   [✓] Email unique índices (prevent enumeration)
   [✓] Prepared statements (no SQL injection)
   [✓] Row-Level Security (RLS) para multi-tenant

✅ Auditoria Completa
   [✓] Todos logins tracked
   [✓] Todos user creates/deletes tracked
   [✓] IP addresses logged
   [✓] Queryable por data/usuário/operação
```

---

## 6. Casos de Teste (QA)

### Test Suite: AlunoService

```java
@DisplayName("RF-CAD-03: Cadastro Aluno")
class AlunoServiceTest {
  
  @Test
  void deveCriarAlunoMaiorDeIdadeComCPF() { }
  
  @Test
  void deveCriarAlunoMenorDeIdadeComResponsavel() { }
  
  @Test
  void deveRejeitarAlunoMenorSemResponsavel() { }
  
  @Test
  void deveValidarCPFAlgoritmo() { }
  
  @Test
  void deveValidarDataNascimentoValida() { }
  
  @Test
  void deveImpedirCPFDuplicado() { }
  
  @Test
  void deveRegistrarEmAUDITORIA_LOG() { }
}
```

### Test Suite: AuthenticationService

```java
@DisplayName("RF-ACE-01: Autenticação Login")
class AuthenticationServiceTest {
  
  @Test
  void deveLoginComCPFSenhaValidos() { }
  
  @Test
  void deveRejeitar_CPFInvalido() { }
  
  @Test
  void deveRejeitar_SenhaErrada() { }
  
  @Test
  void deveBloquear_Apos5TentativasFalhadas() { }
  
  @Test
  void deveGerarJWTTokenCom5MinExpiry() { }
  
  @Test
  void deveLarcarInvalidCpfException() { }
  
  @Test
  void deveHasharSenhaComBCryptCost10() { }
}
```

### Frontend: AlunoForm.test.jsx

```javascript
describe('AlunoForm Component', () => {
  it('deve renderizar form com 3 steps', () => { });
  
  it('deve validar nome completo (3-255 chars)', () => { });
  
  it('deve validar data nascimento (< 100 years)', () => { });
  
  it('deve mostrar responsável field quando < 18', () => { });
  
  it('deve validar CPF algoritmo mod-11', () => { });
  
  it('deve enviar dados para API', () => { });
  
  it('deve mostrar erro se API retorna 409 (duplicate)', () => { });
});
```

---

## 7. Plano de Implementação

### Timeline Sprint SPEC-001

```
Dia 1 (Hoje, 2 abr):
├─ Backend setup (entities, repositories, services)
├─ Frontend setup (components, forms, routing)
├─ Database migrations (Flyway)
└─ Local dev env testado

Dia 2 (3 abr):
├─ Backend: 50% APIs implementadas
├─ Frontend: 50% screens mocked
├─ Integration tests iniciados
└─ Peer code review

Dia 2-3 (4-5 abr):
├─ Backend: 100% APIs complete
├─ Frontend: 100% screens connected
├─ All tests passing
├─ SonarQube quality gates passed
└─ Ready for QA/staging
```

### Dependencies

```
Bloqueia: PLANs (PLAN-001, PLAN-002, PLAN-003) — depois SPEC-001 100%
```

---

## 8. Referências Finais

| Documento | Link | Propósito |
|-----------|------|-----------|
| Glossário | glossario.md | Terminologia padronizada |
| Guia Padrões | guia-padroes-codigo-convencoes.md | Implementação padrão |
| Matriz RF | matriz-rastreabilidade.md | Rastreabilidade RF |
| Modelo Dados | modelo-dados-conceitual.md | Schema DD |
| RNFs | requisitos-nao-funcionais-detalhados.md | Critério aceitação |
| CONTRIBUTING | CONTRIBUTING.md | Processo PR/code review |

---

## Checklist de Aceita Fase 2

```
SPEC-001 Aceitação (antes de passar para SPEC-002):

Backend:
[✓] Todas 8 APIs de login + cadastro implementadas
[✓] Testes unitários: cobertura ≥ 80%
[✓] Testes integração com PostgreSQL: 100% pass
[✓] SonarQube quality gates: pass
[✓] Security scan (OWASP): 0 critical issues
[✓] Performance load test: P95 < 2s

Frontend:
[✓] Todas 7 screens + forms implementados
[✓] Testes React: cobertura ≥ 80%
[✓] End-to-end tests: login flow completo
[✓] Accessibility: WCAG 2.1 AA
[✓] Bundle size: < 200KB gzipped
[✓] Lighthouse: score ≥ 80

Database:
[✓] Migrations Flyway executadas
[✓] All constraints validated
[✓] Indexes created
[✓] Audit triggers working

Documentation:
[✓] README.md atualizado
[✓] API docs (Swagger) gerado
[✓] Setup local environment documentado
[✓] Troubleshooting guide criado

DevOps:
[✓] Docker image buildado
[✓] CI/CD pipeline testado
[✓] Staging deployment succeed
[✓] Smoke tests passed
```

---

**Status**: 🟢 PRONTO PARA DEV  
**Criado**: 2 de abril de 2026  
**Próxima**: SPEC-002 (após SPEC-001 completa)  
**Owner**: Tech Lead  
**Aplicação**: SpringBoot + React + PostgreSQL

