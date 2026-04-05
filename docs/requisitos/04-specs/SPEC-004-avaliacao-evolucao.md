# SPEC-004 — Avaliação e Evolução de Alunos (Testes, Progresso, Certificados)

> **Versão**: 1.0  
> **Data**: 2 de abril de 2026  
> **Módulos**: M04 (Avaliação)  
> **Status**: 🟢 PRONTO PARA DESENVOLVIMENTO  
> **RFs Inclusos**: RF-AVAL-01 a 08 (8 RFs)  
> **Bloqueadores**: ✅ ZERO

---

> Nota de escopo MVP: esta SPEC orienta a entrega do MVP operacional. Requisitos de robustez em nivel enterprise ficam como evolucao futura e nao sao criterio de aceite desta fase.

## 1. Visão Geral

### Propósito
Especificar funcionalidades de **avaliação, progresso e evolução de alunos**: registro de testes físicos (força, resistência, flexibilidade), tracking de evolução corporal, geração de certificados e diplomas, relatórios de progresso para alunos/professors.

### Escopo
- ✅ Criar Tipo de Teste (força, resistência, flexibilidade, etc)
- ✅ Registrar Resultado Teste (data, aluno, teste, valor)
- ✅ Calcular Progresso (comparação antes x depois)
- ✅ Tabela de Progresso (histórico testes)
- ✅ Gerar Certificado (progresso atingido)
- ✅ Relatório Evolução (aluno/professor)
- ✅ Comparar Alunos (benchmark)
- ✅ Metas de Progresso (targets)

### Não Incluso (Futuro)
- ❌ AI análise postura (computer vision) — Fase 4
- ❌ Wearable integration (Apple Watch, Fitbit) — Fase 4
- ❌ App mobile (iOS/Android) — Fase 3

---

## 2. Referências Críticas

| Documento | Seção | Referência |
|-----------|-------|-----------|
| [Glossário](../00-originais/glossario.md) | Avaliação, Teste, Evolução | Terminologia |
| [Modelo Dados](../02-mapa/modelo-dados-conceitual.md) | TESTE, RESULTADO_TESTE, EVOLUCAO_ALUNO | Schema |
| [SPEC-001](./SPEC-001-cadastro-acesso.md) | RF-CAD, RF-ACE | Autenticação |
| [SPEC-002](./SPEC-002-financeiro.md) | RF-FIN | Alunos ativos |
| [SPEC-003](./SPEC-003-relatorios-dashboards.md) | RF-REL | Relatórios |

---

## 3. Requisitos Funcionais Detalhados

### 3.1 RF-AVAL-01: Criar/Gerenciar Tipos de Teste

#### Descrição
Permitir COORDENADOR/PROPRIETARIO configurar quais testes serão aplicados na academia. Ex: Peso, Altura, IMC, Força (supino), Resistência (Cooper), Flexibilidade (Wells), Abdominal.

#### Casos de Uso

**UC-AVAL-001: Coordenador Cadastra Tipo de Teste**

```
Ator: COORDENADOR
Pré: Autenticado

1. [COORD] Acessa "Configurações → Tipos de Testes"
2. [SYS] Mostra lista de testes existentes:
   ├─ Peso (kg)
   ├─ Altura (cm)
   ├─ IMC (kg/m²)
   ├─ Força Supino (kg)
   ├─ Cooper 12min (metros)
   └─ [ + Novo ]

3. [COORD] Click [ + Novo ]
4. [SYS] Form:
   ├─ Nome Teste: [Abdominal 1min___]
   ├─ Código: [ABDOM_1MIN]
   ├─ Unidade: [repetições▼]
   ├─ Tipo avaliação: [Numérico▼]
   │  ├─ Numérico (valor)
   │  ├─ Sim/Não
   │  └─ Escala (1-10)
   ├─ Melhor é: [Maior▼]
   │  ├─ Maior (crescimento = melhor)
   │  └─ Menor (redução = melhor, ex peso)
   ├─ Meta padrão: [50 repetições]
   ├─ Fórmula cálculo (optional): [____]
   └─ Ativo: [✓] Checkbox

5. [COORD] Confirm
6. [SYS]
   ├─ Insert TIPO_TESTE
   ├─ Auditoria
   └─ Return "Tipo de teste criado"
```

#### Database Schema

```sql
CREATE TABLE TIPO_TESTE (
    tipo_teste_id SMALLSERIAL PRIMARY KEY,
    academia_id SMALLINT NOT NULL,
    
    nome VARCHAR(100) NOT NULL,
    codigo VARCHAR(50) UNIQUE,
    descricao TEXT,
    
    unidade VARCHAR(50),  -- 'kg', 'cm', 'repetições', 'segundos'
    tipo_avaliacao ENUM('NUMERICO', 'SIM_NAO', 'ESCALA'),
    melhor_valor ENUM('MAIOR', 'MENOR'),  -- crescimento vs redução
    
    meta_padrao NUMERIC(10,2),
    formula_calculo VARCHAR(255),  -- Ex: "peso / (altura^2)"
    
    ativo BOOLEAN DEFAULT true,
    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (academia_id) REFERENCES ACADEMIA(academia_id),
    INDEX idx_academia (academia_id)
);
```

---

### 3.2 RF-AVAL-02: Registrar Resultado Teste (Aluno Individual)

#### Descrição
Registrar resultado de um teste para um aluno específico em uma data determinada. Com observações de professor.

#### Casos de Uso

**UC-AVAL-002: Professor Registra Teste Aluno**

```
Ator: PROFESSOR
Pré: Autenticado, tipo teste criado

1. [PROF] Acessa "Avaliação → Meus Alunos"
2. [SYS] Mostra lista alunos do professor
3. [PROF] Search: "João Silva"
4. [PROF] Click aluno → "Histórico Testes"
5. [SYS] Mostra testes já realizados:
   ├─ Peso: 85kg (02/04/2026)
   ├─ Altura: 178cm (01/04/2026)
   ├─ IMC: 23.9 (02/04/2026)
   └─ [ + Adicionar Novo Teste ]

6. [PROF] Click [ + Adicionar ]
7. [SYS] Form:
   ├─ Tipo Teste: [Força Supino▼]
   ├─ Data: [02/04/2026]
   ├─ Valor: [120,5 kg]
   ├─ Observação: [Boa forma, mantém ritmo]
   └─ Foto (optional): [Upload]

8. [PROF] Confirm
9. [SYS]
   ├─ Insert RESULTADO_TESTE
   ├─ Calcula progresso vs resultado anterior (if exists)
   ├─ Updates EVOLUCAO_ALUNO
   ├─ Auditoria
   └─ Email ao aluno: "Novo teste registrado"
```

#### Database Schema

```sql
CREATE TABLE RESULTADO_TESTE (
    resultado_id BIGSERIAL PRIMARY KEY,
    aluno_id INTEGER NOT NULL REFERENCES ALUNO(aluno_id),
    tipo_teste_id SMALLINT NOT NULL REFERENCES TIPO_TESTE(tipo_teste_id),
    academia_id SMALLINT NOT NULL,
    
    data_teste DATE NOT NULL,
    valor_resultado NUMERIC(10,2) NOT NULL,
    
    professor_id INTEGER NOT NULL REFERENCES PROFESSOR(professor_id),
    observacao TEXT,
    foto_url VARCHAR(255),
    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_aluno_tipo (aluno_id, tipo_teste_id),
    INDEX idx_data (data_teste),
    UNIQUE (aluno_id, tipo_teste_id, data_teste)  -- 1 teste por tipo por dia
);
```

---

### 3.3 RF-AVAL-03: Calcular Progresso (Antes x Depois)

#### Descrição
Sistema calcula automaticamente o progresso de um aluno comparando resultado atual vs resultado anterior (última avaliação).

#### Fórmulas

```
Progresso % = ((Valor_Agora - Valor_Antes) / Valor_Antes) × 100

Exemplos:
├─ Força Supino: 100kg → 120kg = (20/100) × 100 = +20% ✅
├─ Peso: 85kg → 82kg = (-3/85) × 100 = -3.5% ✅
├─ Repetições Abdom: 40 → 50 = (10/40) × 100 = +25% ✅
└─ Flexibilidade (Wells): 15cm → 18cm = (3/15) × 100 = +20% ✅
```

#### Database Schema

```sql
CREATE TABLE EVOLUCAO_ALUNO (
    evolucao_id BIGSERIAL PRIMARY KEY,
    aluno_id INTEGER NOT NULL REFERENCES ALUNO(aluno_id),
    tipo_teste_id SMALLINT NOT NULL REFERENCES TIPO_TESTE(tipo_teste_id),
    academia_id SMALLINT NOT NULL,
    
    valor_inicial NUMERIC(10,2),
    valor_anterior NUMERIC(10,2),
    valor_atual NUMERIC(10,2),
    
    progresso_percentual NUMERIC(5,2),  -- Ex: 20.50
    meta_atingida BOOLEAN,
    data_ultima_atualizacao DATE,
    
    resultado_id_anterior BIGINT REFERENCES RESULTADO_TESTE(resultado_id),
    resultado_id_atual BIGINT REFERENCES RESULTADO_TESTE(resultado_id),
    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (aluno_id, tipo_teste_id),
    INDEX idx_aluno (aluno_id),
    INDEX idx_progresso (progresso_percentual)
);
```

---

### 3.4 RF-AVAL-04: Tabela de Progresso (Histórico Aluno)

#### Descrição
Visualização em tabela de todos os testes de um aluno com cálculo de progresso histórico e visualização visual de evolução.

#### Screen Layout

```
┌──────────────────────────────────────────────────────────┐
│  EVOLUÇÃO: João Silva (CPF: 123.456.789-00)              │
├──────────────────────────────────────────────────────────┤
│ Data matrícula: 01/01/2024  |  Meses na academia: 15    │
│ Status: ATIVO  |  Plano: Premium                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ Teste              | Jan/26  | Fev/26  | Mar/26  | Abr/26 │ Progresso
│────────────────────┼─────────┼─────────┼─────────┼────────┼──────────│
│ Peso (kg)          | 86      | 84      | 82      | 80     | ↓ -7.0%  │
│ IMC (kg/m²)        | 25.2    | 24.7    | 24.1    | 23.5   | ↓ -6.7%  │
│ Força Supino (kg)  | 100     | 105     | 112     | 120    | ↑ +20%   │
│ Cooper 12min (m)   | 2200    | 2300    | 2400    | 2500   | ↑ +13.6% │
│ Abdominal 1min     | 35      | 38      | 44      | 50     | ↑ +42.8% │
│ Flexibilidade (cm) | 12      | 13      | 15      | 18     | ↑ +50%   │
│                                                  Desde: Jan/26 │
└──────────────────────────────────────────────────────────┘

[ Gerar Certificado ]  [ Exportar PDF ]  [ Enviar ao Aluno ]
```

#### API Endpoint

```
GET /api/v1/alunos/{id}/evolucao?periodo=ultimo_ano
Response:
{
  "aluno_id": 123,
  "nome": "João Silva",
  "periodo_desde": "2025-04-01",
  "evolucoes": [
    {
      "tipo_teste_id": 1,
      "nome_teste": "Peso",
      "unidade": "kg",
      "valor_inicial": 86,
      "valor_atual": 80,
      "progresso_percentual": -7.0,
      "meta_atingida": true,
      "historico": [
        { "data": "2026-01-15", "valor": 86 },
        { "data": "2026-02-01", "valor": 84 },
        { "data": "2026-03-01", "valor": 82 },
        { "data": "2026-04-02", "valor": 80 }
      ]
    },
    ...
  ]
}
```

---

### 3.5 RF-AVAL-05: Gerar Certificado (Progresso Atingido)

#### Descrição
Quando aluno atinge meta em um teste, sistema pode gerar certificado digital comprovando o milestone.

#### Casos de Uso

**UC-AVAL-005: Aluno Atinge Meta e Recebe Certificado**

```
Ator: SISTEMA
Trigger: Resultado teste inserido, progresso >= meta

1. [SYS] Insert RESULTADO_TESTE para João
2. [SYS] Calcula: progresso_percentual = +50% (meta era 30%)
3. [SYS] Verifica: meta_atingida = TRUE
4. [SYS] Gera certificado:
   ├─ Tipo: PDF digital
   ├─ Template: "Certificado de Progresso Physical"
   ├─ Dados:
   │  ├─ Nome aluno
   │  ├─ Teste: Abdominais
   │  ├─ Meta: 30 repetições
   │  ├─ Resultado: 50 repetições
   │  ├─ Data: 02/04/2026
   │  └─ Assinatura: Logo academia
   ├─ Salva em: storage/certificados/ALU-123-ABDOM-20260402.pdf
   └─ Insert CERTIFICADO table

5. [SYS] Email aluno:
   ├─ Assunto: "Parabéns! Você atingiu sua meta! 🎉"
   ├─ Anexo: PDF certificado
   └─ Link: "Visualizar certificado"

6. [ALUNO] Recebe email + certificado
```

#### Database Schema

```sql
CREATE TABLE CERTIFICADO (
    certificado_id BIGSERIAL PRIMARY KEY,
    aluno_id INTEGER NOT NULL REFERENCES ALUNO(aluno_id),
    tipo_teste_id SMALLINT NOT NULL REFERENCES TIPO_TESTE(tipo_teste_id),
    academia_id SMALLINT NOT NULL,
    
    data_emissao DATE DEFAULT CURRENT_DATE,
    meta_atingida NUMERIC(10,2),
    valor_atingido NUMERIC(10,2),
    
    arquivo_url VARCHAR(255),  -- PDF location
    hash_validacao VARCHAR(64),  -- SHA256 para verificação autenticidade
    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_aluno (aluno_id),
    INDEX idx_data (data_emissao)
);
```

---

### 3.6 RF-AVAL-06: Relatório Evolução (Aluno Individual + Professor)

#### Descrição
Relatório PDF/Excel exportável mostrando evolução completa de um aluno com gráficos e análise.

#### Screen Layout

```
RELATÓRIO DE EVOLUÇÃO FÍSICA
┌─────────────────────────────────────────────────────┐
│ Aluno: João Silva                                   │
│ Professor: Pedro Santos                             │
│ Período: Janeiro 2026 - Abril 2026 (4 meses)       │
│ Data Relatório: 02/04/2026                          │
├─────────────────────────────────────────────────────┤

RESUMO EXECUTIVO:
├─ Progresso geral: ↑ +12.3% (meta: +10%)
├─ Testes completados: 6/6
├─ Metas atingidas: 4/6
├─ Meses na academia: 15

ANÁLISE POR TESTE:
┌─ Peso
  ├─ Jan: 86kg → Abr: 80kg
  ├─ Progresso: -7.0%
  ├─ Meta: atingida ✓
  └─ Status: EXCELENTE

┌─ Força Supino
  ├─ Jan: 100kg → Abr: 120kg
  ├─ Progresso: +20%
  ├─ Meta: atingida ✓
  └─ Status: EXCELENTE

[Gráfico linha 12 meses]

RECOMENDAÇÕES:
- Continuar com força: resultado excepcional
- Manter dieta: peso descendo bem
- Aumentar flexibilidade: ainda abaixo da meta

Assinado por: Pedro Santos (Professor)
Data: 02/04/2026
```

---

### 3.7 RF-AVAL-07: Comparar Alunos (Benchmark)

#### Descrição
Professor pode comparar progresso de seus alunos (anonimamente) para identificar tendências e estimular competição saudável.

#### Casos de Uso

**UC-AVAL-007: Professor Vê Benchmark de Alunos**

```
Ator: PROFESSOR
Pré: Autenticado

1. [PROF] Acessa "Avaliação → Benchmark"
2. [SYS] Mostra form filtros:
   ├─ Teste: [Peso▼]
   ├─ Período: [Últimos 30 dias▼]
   └─ Visualizar (anônimo/nomes)

3. [PROF] Seleciona: Teste "Força Supino", últimos 30 dias
4. [SYS] Return ranking (anônimo):
   ├─ #1: 125kg (↑ +5% vs 30 dias)
   ├─ #2: 120kg (↑ +3.3%)
   ├─ #3: 115kg (↑ +2.2%)
   ├─ #4: 110kg (→ 0%)
   ├─ #5: 100kg (↓ -4.7%)
   ├─ Média turma: 114kg
   └─ PROF: [Você está em #3]

5. [SYS] Gráfico comparativo (box plot):
   ├─ Distribuição valores
   ├─ Média + desvio padrão
   └─ Sua posição marcada
```

---

### 3.8 RF-AVAL-08: Metas de Progresso (Targets)

#### Descrição
Permitir professor/aluno definir metas por teste para motivar progresso. Sistema alertará quando meta atingida.

#### Casos de Uso

**UC-AVAL-008: Aluno Define Meta**

```
Ator: ALUNO
Pré: Autenticado, teste registrado

1. [ALUNO] Acessa "Meus Testes → Metas"
2. [SYS] Mostra testes e metas sugeridas:
   ├─ Peso atual: 80kg, Meta sugerida: 75kg (-6%)
   ├─ Força Supino atual: 120kg, Meta sugerida: 140kg (+16%)
   └─ Abdominais atual: 50, Meta sugerida: 60 (+20%)

3. [ALUNO] Click "Editar meta" para Força Supino
4. [SYS] Form:
   ├─ Teste: Força Supino
   ├─ Valor atual: 120kg
   ├─ Meta: [140kg]
   ├─ Data limite: [31/05/2026]
   └─ [ Salvar ]

5. [ALUNO] Confirm
6. [SYS]
   ├─ Insert META_ALUNO
   ├─ Calcula dias restantes
   ├─ Auditoria
   └─ Notificação: "Meta definida! 60 dias para atingir 140kg"

7. [SYS] Monitora: Se resultado_novo >= meta
   ├─ Gera certificado
   ├─ Email: "Parabéns! Você atingiu sua meta!"
```

#### Database Schema

```sql
CREATE TABLE META_ALUNO (
    meta_id BIGSERIAL PRIMARY KEY,
    aluno_id INTEGER NOT NULL REFERENCES ALUNO(aluno_id),
    tipo_teste_id SMALLINT NOT NULL REFERENCES TIPO_TESTE(tipo_teste_id),
    academia_id SMALLINT NOT NULL,
    
    valor_inicial NUMERIC(10,2),
    valor_meta NUMERIC(10,2),
    data_limite DATE,
    
    atingida BOOLEAN DEFAULT false,
    data_atingimento DATE,
    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (aluno_id, tipo_teste_id),
    INDEX idx_aluno (aluno_id),
    INDEX idx_atingida (atingida)
);
```

---

## 4. Especificações Técnicas

### 4.1 Stack

```
Backend
├─ Java 17+, Spring Boot 3.0+
├─ spring-boot-starter-data-jpa
├─ iText (PDF generation)
├─ Apache Commons Math (estatísticas)

Frontend
├─ React 18+
├─ Recharts (gráficos)
├─ date-fns (datas)
├─ jsPDF (PDF export)

Database
├─ PostgreSQL 14+
└─ Triggers para auto-cálculo (EVOLUCAO_ALUNO)
```

### 4.2 API Endpoints

```
POST   /api/v1/testes                         (RF-AVAL-01, criar tipo)
GET    /api/v1/testes                         (RF-AVAL-01, listar)
PUT    /api/v1/testes/{id}                    (RF-AVAL-01, editar)

POST   /api/v1/alunos/{id}/resultados         (RF-AVAL-02, registrar)
GET    /api/v1/alunos/{id}/resultados         (RF-AVAL-02, histórico)

GET    /api/v1/alunos/{id}/evolucao           (RF-AVAL-03/04, calcular + tabela)
GET    /api/v1/alunos/{id}/evolucao/graficos  (gráficos)

POST   /api/v1/certificados                   (RF-AVAL-05, gerar)
GET    /api/v1/certificados/{id}              (RF-AVAL-05, fetch)

GET    /api/v1/relatorios/evolucao/{aluno_id} (RF-AVAL-06, export)
POST   /api/v1/relatorios/evolucao/pdf        (PDF export)

GET    /api/v1/benchmark?tipo_teste=&periodo= (RF-AVAL-07)

POST   /api/v1/metas                          (RF-AVAL-08, criar)
GET    /api/v1/metas/{id}                     (RF-AVAL-08, fetch)
PUT    /api/v1/metas/{id}                     (RF-AVAL-08, atualizar)
```

---

## 5. Critério de Aceitação

```
✅ RF-AVAL-01: Tipos teste criáveis (nome, unidade, fórmula)
✅ RF-AVAL-02: Resultados registráveis com observações
✅ RF-AVAL-03: Progresso calculado automaticamente
✅ RF-AVAL-04: Tabela histórico renderizada
✅ RF-AVAL-05: Certificado gerado em PDF
✅ RF-AVAL-06: Relatório evolução exportável
✅ RF-AVAL-07: Benchmark com gráficos comparativos
✅ RF-AVAL-08: Metas definíveis e rastreáveis

Performance:
✅ Load tabela evolução: < 1s (100+ testes)
✅ Gerar PDF: < 5s
✅ Cálculo progresso: < 100ms
```

---

## 6. Test Cases

```java
@DisplayName("RF-AVAL-01 a 08")
class AvaliacaoServiceTest {
  @Test
  void deveCriar_TipoTeste() { }
  
  @Test
  void deveRegistrar_Resultado_E_Calcular_Progresso() { }
  
  @Test
  void deveGerar_Certificado_AoAtingirMeta() { }
  
  @Test
  void deveComparar_Alunos_Anonimamente() { }
}
```

---

## 7. Timeline

```
Dia 1 (desenvolvimento):
├─ TIPO_TESTE + RESULTADO_TESTE tables
├─ EVOLUCAO_ALUNO calculo automático (trigger)
└─ API endpoints 1-2

Dia 2:
├─ Tabela evolução (React component)
├─ Certificado PDF generation
└─ Benchmark queries

Dia 3:
├─ Relatório evolução + export
├─ Metas tracking
├─ Tests (80%+ coverage)
└─ Ready
```

---

**Status**: 🟢 PRONTO PARA DEV  
**RFs**: 8  
**Linhas Estimadas**: ~4000  
**Stack**: SpringBoot + React + PostgreSQL  
**Próxima**: SPEC-005 (Professores)

