# SPEC-005 — Professores (Currículo, Disponibilidade, Comissão, Avaliação)

> **Versão**: 1.0  
> **Data**: 2 de abril de 2026  
> **Módulos**: M05 (Professores)  
> **Status**: 🟢 PRONTO PARA DESENVOLVIMENTO  
> **RFs Inclusos**: RF-PROF-01 a 08 (8 RFs)  
> **Bloqueadores**: ✅ ZERO (DUV-02 resolvida: PC/Desktop)

---

## 1. Visão Geral

### Propósito
Especificar funcionalidades de **gerenciamento de professores**: cadastro de dados curriculares, disponibilidade/horários, especialidades, avaliação/feedback de alunos, rastreamento de comissões, e geração de relatórios de performance.

### Escopo
- ✅ Cadastro Professor (dados pessoais + curriculares)
- ✅ Especialidades (qual tipo de aula/treino ministram)
- ✅ Disponibilidade/Horários (agenda de trabalho)
- ✅ Aulas/Treinos (turmas associadas)
- ✅ Feedback de Alunos (avaliação do professor)
- ✅ Comissão (rastreamento mensal)
- ✅ Relatório Performance (alunos, presença, feedback)
- ✅ Exclusão/Bloqueio (desativar professor)

### Não Incluso (Futuro)
- ❌ App mobile (iOS/Android) — Fase 3
- ❌ Certificações profissionais (CRNF, CREF) integration — Futuro
- ❌ Planejamento de treino automático (AI) — Fase 4

---

## 2. Referências Críticas

| Documento | Seção | Referência |
|-----------|-------|-----------|
| [DUV Resolutions](../.copilot/memory/duv-resolutions.md) | DUV-02 | PC/Desktop interface |
| [DUV Resolutions](../.copilot/memory/duv-resolutions.md) | DUV-03 | Comissão = Alunos × VLA × % |
| [Glossário](../00-originais/glossario.md) | Professor, Especialidade, Comissão | Terminologia |
| [Modelo Dados](../02-mapa/modelo-dados-conceitual.md) | PROFESSOR, AULA, COMISSAO | Schema |
| [SPEC-001](./SPEC-001-cadastro-acesso.md) | RF-ACE | Autenticação PROFESSOR |
| [SPEC-002](./SPEC-002-financeiro.md) | RF-FIN-03 | Cálculo Comissão mesal |
| [SPEC-003](./SPEC-003-relatorios-dashboards.md) | RF-REL-04 | Relatório Comissões |
| [SPEC-004](./SPEC-004-avaliacao-evolucao.md) | RF-AVAL | Evolução alunos |

---

## 3. Requisitos Funcionais Detalhados

### 3.1 RF-PROF-01: Cadastrar Professor (Dados Pessoais + Curricula)

#### Descrição
PROPRIETARIO/COORDENADOR cadastra novo professor com dados pessoais, endereço, contato, documentos (CPF, RG), especialidades, certificações e taxa de comissão.

#### Casos de Uso

**UC-PROF-001: Coordenador Cadastra Professor**

```
Ator: COORDENADOR
Pré: Autenticado

1. [COORD] Acessa "Gestão → Professores"
2. [SYS] Mostra lista + botão [ + Novo Professor ]
3. [COORD] Click [ + Novo ]
4. [SYS] Form em 4 abas:

   ABA 1: Dados Pessoais
   ├─ Nome: [Pedro Santos Silva_____________]
   ├─ CPF: [123.456.789-01____________]
   ├─ RG: [12.345.678-9______________]
   ├─ Sexo: [Masculino▼]
   ├─ Data Nascimento: [15/01/1985____]
   ├─ Email: [pedro.santos@email.com__]
   └─ Telefone: [(11) 98765-4321_____]

   ABA 2: Endereço
   ├─ CEP: [01234-567_]
   ├─ Endereço: [Rua X, 123____]
   ├─ Bairro: [Centro______]
   ├─ Cidade: [São Paulo__]
   └─ Estado: [SP▼]

   ABA 3: Specialized
   ├─ Especialidades: (checkboxes)
   │  ├─ [✓] Musculação
   │  ├─ [✓] Crossfit
   │  ├─ [ ] Pilates
   │  ├─ [ ] Yoga
   │  └─ [ ] Natação
   ├─ Certificações: [CREF #123456, CRNF___]
   ├─ Experiência (anos): [8 anos]
   └─ Bio: [Especialista em força. Atua há 8...]

   ABA 4: Financeira
   ├─ Percentual comissão: [15%_____]
   │  (padrão 15%, pode variar)
   ├─ Banco: [Itaú▼]
   ├─ Agência: [0001____]
   ├─ Conta: [12345678-9_____]
   ├─ Tipo: [Corrente▼]
   └─ Ativo: [✓] Checkbox

5. [COORD] Fill all fields + Click "Salvar"
6. [SYS]
   ├─ Insert PROFESSOR
   ├─ Cria usuário associado (role=PROFESSOR, SPEC-001 RF-CAD-02)
   ├─ Send email: "Bem-vindo! Seus dados foram cadastrados"
   ├─ Auditoria
   └─ Return professor_id
```

#### Database Schema

```sql
CREATE TABLE PROFESSOR (
    professor_id SERIAL PRIMARY KEY,
    academia_id SMALLINT NOT NULL REFERENCES ACADEMIA(academia_id),
    usuario_id INTEGER NOT NULL REFERENCES USUARIO(usuario_id),
    
    nome VARCHAR(150) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    rg VARCHAR(15),
    data_nascimento DATE,
    sexo CHAR(1),  -- 'M', 'F'
    email VARCHAR(150),
    telefone VARCHAR(20),
    
    endereco VARCHAR(255),
    numero VARCHAR(10),
    complemento VARCHAR(100),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado CHAR(2),
    cep VARCHAR(10),
    
    especialidades TEXT[],  -- Array de especialidades
    certificacoes TEXT,
    experiencia_anos SMALLINT,
    bio TEXT,
    
    percentual_comissao NUMERIC(5,2) DEFAULT 15.00,
    banco VARCHAR(50),
    agencia VARCHAR(10),
    conta VARCHAR(20),
    tipo_conta VARCHAR(20),  -- 'CORRENTE', 'POUPANCA'
    
    ativo BOOLEAN DEFAULT true,
    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_academia (academia_id),
    INDEX idx_ativo (ativo)
);
```

---

### 3.2 RF-PROF-02: Editar Dados Professor (Manutenção)

#### Descrição
Permitir COORDENADOR atualizar dados de professor: especialidades, percentual comissão, status ativo/inativo.

#### Casos de Uso

**UC-PROF-002: Coordenador Edita Professor**

```
Ator: COORDENADOR
Pré: Professor cadastrado

1. [COORD] Acessa "Gestão → Professores"
2. [COORD] Search: "Pedro Santos"
3. [COORD] Click em professor
4. [SYS] Mostra dados + botão [Editar]
5. [COORD] Click [Editar]
6. [SYS] Form edição (mesma estrutura do cadastro)
7. [COORD] Modifica: Especialidades (+ Yoga), Comissão (15% → 18%)
8. [COORD] Click "Salvar"
9. [SYS]
   ├─ Update PROFESSOR
   ├─ Log auditoria (valores antes/depois)
   ├─ Email: "Dados atualizados com sucesso"
   └─ Return sucesso
```

---

### 3.3 RF-PROF-03: Definir Disponibilidade/Horários

#### Descrição
Permitir PROFESSOR (ou COORDENADOR) definir seus horários de trabalho: dias da semana, hora início/fim, intervalos de almoço.

#### Casos de Uso

**UC-PROF-003: Professor Define Seu Horário**

```
Ator: PROFESSOR (ou COORDENADOR editando)
Pré: Autenticado

1. [PROF] Acessa "Meus Dados → Disponibilidade"
2. [SYS] Mostra form:
   ├─ Segunda: [09:00] até [18:00], Intervalo [12:00-13:00]
   ├─ Terça: [09:00] até [18:00], Intervalo [12:00-13:00]
   ├─ Quarta: [09:00] até [18:00], Intervalo [12:00-13:00]
   ├─ Quinta: [09:00] até [18:00], Intervalo [12:00-13:00]
   ├─ Sexta: [09:00] até [18:00], Intervalo [12:00-13:00]
   ├─ Sábado: [ ] Não trabalha
   └─ Domingo: [ ] Não trabalha

3. [PROF] Click "Salvar"
4. [SYS]
   ├─ Insert PROFESSOR_DISPONIBILIDADE (per day)
   ├─ Auditoria
   └─ Horários salvos
```

#### Database Schema

```sql
CREATE TABLE PROFESSOR_DISPONIBILIDADE (
    disponibilidade_id SERIAL PRIMARY KEY,
    professor_id INTEGER NOT NULL REFERENCES PROFESSOR(professor_id),
    academia_id SMALLINT NOT NULL,
    
    dia_semana SMALLINT NOT NULL,  -- 0=Dom, 1=Seg, 2=Ter, ..., 6=Sab
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    intervalo_inicio TIME,  -- Intervalo/almoço
    intervalo_fim TIME,
    
    ativo BOOLEAN DEFAULT true,
    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE (professor_id, dia_semana),
    INDEX idx_professor (professor_id)
);
```

---

### 3.4 RF-PROF-04: Associar Aulas/Turmas (Alocação)

#### Descrição
COORDENADOR aloca professor a turmas/aulas específicas: qual professor, qual aula, quantos alunos inscritos, horário.

#### Casos de Uso

**UC-PROF-004: Coordenador Aloca Professor a Aula**

```
Ator: COORDENADOR
Pré: Professor + Aula cadastrados

1. [COORD] Acessa "Gestão → Aulas"
2. [COORD] Busca aula: "Musculação 18:00"
3. [COORD] Click em aula
4. [SYS] Mostra detalhes + botão [Editar]
5. [COORD] Click [Editar]
6. [SYS] Form:
   ├─ Nome Aula: [Musculação Iniciantes___]
   ├─ Tipo: [Musculação▼]
   ├─ Horário: [Segunda 18:00 - 19:00____]
   ├─ Sala: [Musculação 1▼]
   ├─ Capacidade: [30]
   ├─ Professor: [Pedro Santos Silva▼]
   ├─ Inscritos: [25/30]
   ├─ Status: [ATIVA▼]
   └─ [ Salvar ]

7. [COORD] Click "Salvar"
8. [SYS]
   ├─ Update AULA (professor_id)
   ├─ Send email professor: "Nova aula alocada"
   ├─ Send email alunos: "Professor alocado"
   ├─ Auditoria
   └─ Sucesso
```

#### Database Schema (Expandido)

```sql
CREATE TABLE AULA (
    aula_id SERIAL PRIMARY KEY,
    academia_id SMALLINT NOT NULL,
    professor_id INTEGER NOT NULL REFERENCES PROFESSOR(professor_id),
    
    nome VARCHAR(150) NOT NULL,
    tipo_aula VARCHAR(50),  -- Musculação, Yoga, CrossFit, etc
    descricao TEXT,
    
    dia_semana SMALLINT NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    sala_id SMALLINT REFERENCES SALA_AULA(sala_id),
    
    capacidade_maxima SMALLINT,
    status ENUM('ATIVA', 'SUSPENSA', 'CANCELADA') DEFAULT 'ATIVA',
    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_professor (professor_id),
    INDEX idx_dia (dia_semana)
);

-- Inscrição de alunos em aulas
CREATE TABLE AULA_INSCRICAO (
    inscricao_id BIGSERIAL PRIMARY KEY,
    aula_id SERIAL NOT NULL REFERENCES AULA(aula_id),
    aluno_id INTEGER NOT NULL REFERENCES ALUNO(aluno_id),
    academia_id SMALLINT NOT NULL,
    
    data_inscricao DATE DEFAULT CURRENT_DATE,
    ativo BOOLEAN DEFAULT true,
    
    UNIQUE (aula_id, aluno_id)
);
```

---

### 3.5 RF-PROF-05: Feedback/Avaliação de Professor (Alunos)

#### Descrição
Alunos podem avaliar professor em escala 1-5 (estrelas) com comentário opcional. Agregado em nota média por professor.

#### Casos de Uso

**UC-PROF-005: Aluno Avalia Professor**

```
Ator: ALUNO
Pré: Frequentou aula

1. [ALUNO] Acessa "Minhas Aulas → Histórico"
2. [ALUNO] Vê aula: "Musculação 18:00 - Prof. Pedro"
3. [ALUNO] Click [ Avaliar ]
4. [SYS] Form:
   ├─ Qual era seu nível antes: [Iniciante▼]
   ├─ Conhecimento do professor: [★★★★☆] (4/5)
   ├─ Didática/Explicação: [★★★★★] (5/5)
   ├─ Motivação: [★★★★☆] (4/5)
   ├─ Atendimento personalizado: [★★★☆☆] (3/5)
   ├─ Ambiente da aula: [★★★★★] (5/5)
   ├─ Comentário (opcional): [Professor muito bom, mas poderia...]
   └─ Anônimo: [✓] Checkbox
   └─ [ Enviar ]

5. [ALUNO] Click "Enviar"
6. [SYS]
   ├─ Insert FEEDBACK_PROFESSOR
   ├─ Recalcula média professor
   ├─ Log auditoria
   └─ Sucesso

7. [PROF] Vê na app: Feedback recebido (anônimo)
   └─ Nota média: 4.2/5 (25 feedbacks)
```

#### Database Schema

```sql
CREATE TABLE FEEDBACK_PROFESSOR (
    feedback_id BIGSERIAL PRIMARY KEY,
    professor_id INTEGER NOT NULL REFERENCES PROFESSOR(professor_id),
    aluno_id INTEGER NOT NULL REFERENCES ALUNO(aluno_id),
    academia_id SMALLINT NOT NULL,
    aula_id SERIAL REFERENCES AULA(aula_id),
    
    nota_conhecimento SMALLINT,  -- 1-5
    nota_didatica SMALLINT,
    nota_motivacao SMALLINT,
    nota_atendimento SMALLINT,
    nota_ambiente SMALLINT,
    
    nota_media NUMERIC(3,2),  -- Calculada
    
    comentario TEXT,
    anonimo BOOLEAN DEFAULT true,
    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_professor (professor_id),
    INDEX idx_nota_media (nota_media)
);
```

---

### 3.6 RF-PROF-06: Rastreamento Comissão (Mensal)

#### Descrição
Sistema rastreia comissão calculada mensalmente baseada em alunos ativos (SPEC-002 RF-FIN-03). Professor pode visualizar histórico.

#### Casos de Uso

**UC-PROF-006: Professor Vê Comissão Mensal**

```
Ator: PROFESSOR
Pré: Autenticado

1. [PROF] Acessa "Financeiro → Minhas Comissões"
2. [SYS] Mostra histórico:
   ├─ Abril 2026: R$3.200,00 (15 alunos, 15% comissão) - PAGA
   ├─ Março 2026: R$3.050,00 (15 alunos) - APROVADA
   ├─ Fevereiro 2026: R$2.900,00 (12 alunos) - CALCULADA
   └─ Janeiro 2026: R$2.750,00 (10 alunos) - PAGA

3. [PROF] Click em mês
4. [SYS] Mostra detalhes:
   ├─ Total alunos ativos: 15
   ├─ Valor plano médio: R$625/mês
   ├─ Percentual comissão: 15%
   ├─ Cálculo: 15 × R$625 × 15% = R$1.406,25
   ├─ Status: PAGA (05/04/2026)
   └─ [ Visualizar Recibo ]
```

---

### 3.7 RF-PROF-07: Relatório Performance (Alunos, Presença, Feedback)

#### Descrição
Professor pode gerar relatório de performance: quantos alunos/aulas, presença média, feedback médio, progresso alunos.

#### Casos de Uso

**UC-PROF-007: Professor Gera Relatório Performance**

```
Ator: PROFESSOR
Pré: Autenticado

1. [PROF] Acessa "Relatórios → Minha Performance"
2. [SYS] Mostra dashboard:
   ├─ Aulas ministradas: 48 (últimos 12 meses)
   ├─ Total de alunos: 35 únicos
   ├─ Presença média: 82% (presença em relação a inscritos)
   ├─ Avaliação média: 4.4/5 (24 feedbacks)
   ├─ Taxa sucesso alunos: 76% (atingiram meta)
   └─ Comissão YTD: R$31.200,00

3. [PROF] Click "Filtrar por período"
4. [SYS] Form:
   ├─ Período: [Últimos 30 dias▼]
   ├─ Tipo aula: [Todas▼]
   └─ [Filtrar]

5. [PROF] Click "Exportar PDF"
6. [SYS] Gera PDF com gráficos + auditoria
```

---

### 3.8 RF-PROF-08: Inativar/Bloquear Professor

#### Descrição
PROPRIETARIO/COORDENADOR pode inativar professor (não pode mais ministrar aulas, mas histórico preservado) ou bloquear permanentemente.

#### Casos de Uso

**UC-PROF-008: Coordenador Inativa Professor**

```
Ator: COORDENADOR
Pré: Professor cadastrado

1. [COORD] Acessa "Gestão → Professores"
2. [COORD] Search: "Pedro Santos"
3. [COORD] Right-click ou menu ⋮
4. [SYS] Menu:
   ├─ [ Editar ]
   ├─ [ Inativar ]
   ├─ [ Bloquear Permanentemente ]
   └─ [ Ver Histórico ]

5. [COORD] Click [Inativar]
6. [SYS] Confirm: "Desativar professor? Não poderá ministrar aulas."
7. [COORD] Confirm
8. [SYS]
   ├─ Update PROFESSOR.ativo = false
   ├─ Suspender aulas futuras
   ├─ Email professor: "Conta desativada"
   ├─ Email alunos: "Professor indisponível"
   └─ Auditoria

9a. [DEPOIS] Se coordenador quiser reativar:
    ├─ Click [Reativar]
    ├─ PROFESSOR.ativo = true
    └─ Sucesso

9b. [OU] Se BLOQUEIO permanente:
    ├─ Click [Bloquear Permanentemente]
    ├─ Confirm (irreversível)
    ├─ Update PROFESSOR_BLOQUEIO
    └─ Professor nunca pode voltar
```

#### Database Schema

```sql
CREATE TABLE PROFESSOR_BLOQUEIO (
    bloqueio_id BIGSERIAL PRIMARY KEY,
    professor_id INTEGER NOT NULL REFERENCES PROFESSOR(professor_id),
    academia_id SMALLINT NOT NULL,
    
    motivo VARCHAR(255),
    data_bloqueio DATE DEFAULT CURRENT_DATE,
    bloqueado_por INTEGER NOT NULL REFERENCES USUARIO(usuario_id),
    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 4. Especificações Técnicas

### 4.1 Stack

```
Backend (mesmo SPEC-001/002/003/004)
├─ Java 17+, Spring Boot 3.0+
├─ JPA/Hibernate
├─ Spring Security (role PROFESSOR)

Frontend
├─ React 18+
├─ Formik + Yup (forms + validation)
├─ Recharts (gráficos)
├─ date-fns (datas)

Database
├─ PostgreSQL 14+
└─ Triggers para média feedback
```

### 4.2 API Endpoints

```
POST   /api/v1/professores                    (RF-PROF-01, criar)
GET    /api/v1/professores                    (listar)
GET    /api/v1/professores/{id}               (fetch)
PUT    /api/v1/professores/{id}               (RF-PROF-02, editar)

POST   /api/v1/professores/{id}/disponibilidade (RF-PROF-03)
GET    /api/v1/professores/{id}/disponibilidade (fetch)

POST   /api/v1/aulas                          (RF-PROF-04, criar)
GET    /api/v1/aulas                          (listar)
PUT    /api/v1/aulas/{id}                     (editar)
POST   /api/v1/aulas/{id}/inscricoes          (aluno inscreve)

POST   /api/v1/professores/{id}/feedback      (RF-PROF-05, aluno avalia)
GET    /api/v1/professores/{id}/feedback      (fetch media)

GET    /api/v1/professores/{id}/comissoes     (RF-PROF-06)

GET    /api/v1/professores/{id}/performance   (RF-PROF-07)
POST   /api/v1/professores/{id}/performance/export (PDF/Excel)

PUT    /api/v1/professores/{id}/inativar      (RF-PROF-08)
PUT    /api/v1/professores/{id}/bloquear      (RF-PROF-08, permanente)
```

---

## 5. Critério de Aceitação

```
✅ RF-PROF-01: Professor cadastrado com dados pessoais/curricula
✅ RF-PROF-02: Dados editáveis + auditoria
✅ RF-PROF-03: Horários definíveis por dia da semana
✅ RF-PROF-04: Alocação a aulas registrada
✅ RF-PROF-05: Feedback coletável (1-5 stars) + média calculada
✅ RF-PROF-06: Comissão rastreável mensalmente
✅ RF-PROF-07: Relatório com gráficos exportável
✅ RF-PROF-08: Inativação reversível + bloqueio permanente

Performance:
✅ Load lista professores: < 1s (100+ professores)
✅ Cálculo média feedback: < 100ms
✅ Generate report: < 5s
```

---

## 6. Test Cases

```java
@DisplayName("RF-PROF-01 a 08")
class ProfessorServiceTest {
  @Test
  void deveCadastrar_Professor_ComDados_Pessoais() { }
  
  @Test
  void deveDefinir_Disponibilidade() { }
  
  @Test
  void deveAlocar_ProfessorA_Aula() { }
  
  @Test
  void deveCalcular_Media_Feedback() { }
  
  @Test
  void deveGerar_RelatorioPerformance() { }
  
  @Test
  void deveInativar_E_Reativar_Professor() { }
}
```

---

## 7. Timeline

```
Dia 1 (desenvolvimento):
├─ PROFESSOR table + PROFESSOR_DISPONIBILIDADE
├─ AULA + AULA_INSCRICAO tables
├─ API endpoints 01-02-03

Dia 2:
├─ API endpoints 04-05-06
├─ Feedback collection + média
├─ Comissão tracking (integração SPEC-002)

Dia 3:
├─ Relatório performance + export
├─ Inativar/bloquear logic
├─ Tests (80%+ coverage)
├─ SonarQube gates pass
└─ Ready
```

---

**Status**: 🟢 PRONTO PARA DEV  
**RFs**: 8  
**Linhas Estimadas**: ~4000  
**Stack**: SpringBoot + React + PostgreSQL  
**Próxima**: SPEC-006 (Equipamento/Salas)

