# SPEC-006 — Equipamento e Salas (Inventário, Manutenção, Disponibilidade)

> **Versão**: 1.0  
> **Data**: 2 de abril de 2026  
> **Módulos**: M06 (Equipamento)  
> **Status**: 🟢 PRONTO PARA DESENVOLVIMENTO  
> **RFs Inclusos**: RF-EQUIP-01 a 08 (8 RFs)  
> **Bloqueadores**: ✅ ZERO

---

## 1. Visão Geral

### Propósito
Especificar funcionalidades de **gerenciamento de equipamentos e salas**: cadastro de máquinas/equipamentos, salas de aula, rastreamento de manutenção, disponibilidade/bloqueios, relatórios de estado e depreciação.

### Escopo
- ✅ Cadastrar Equipamento (máquinas, pesos, acessórios)
- ✅ Cadastrar Sala (capacidade, recursos, horários disponíveis)
- ✅ Registro Manutenção (preventiva, corretiva, data, custo)
- ✅ Bloqueio Equipamento (danificado, manutenção, indisponível)
- ✅ Histórico Uso Equipamento (qual aluno/aula usou)
- ✅ Relatório Estado Equipamentos (bom, regular, manutenção)
- ✅ Cálculo Depreciação (valor residual, custo mensal)
- ✅ Alertas Manutenção (preventiva vencida, uso excessivo)

### Não Incluso (Futuro)
- ❌ IoT sensors (smart equipment tracking) — Fase 4
- ❌ Automação manutenção (requisição automática pecas) — Futuro
- ❌ Computer vision (postura equipment check) — Fase 4

---

## 2. Referências Críticas

| Documento | Seção | Referência |
|-----------|-------|-----------|
| [Glossário](../00-originais/glossario.md) | Equipamento, Manutenção, Sala | Terminologia |
| [Modelo Dados](../02-mapa/modelo-dados-conceitual.md) | EQUIPAMENTO, SALA_AULA, MANUTENCAO | Schema |
| [SPEC-001](./SPEC-001-cadastro-acesso.md) | RF-ACE | Autenticação |
| [SPEC-005](./SPEC-005-professores.md) | RF-PROF-04 | Aulas/Salas |

---

## 3. Requisitos Funcionais Detalhados

### 3.1 RF-EQUIP-01: Cadastrar Equipamento (Máquinas, Pesos, Acessórios)

#### Descrição
PROPRIETARIO/COORDENADOR cadastra equipamentos da academia: máquinas de musculação, pesos livres, barras, cordas, bolas, etc. Com série, data compra, valor, especificações.

#### Casos de Uso

**UC-EQUIP-001: Coordenador Cadastra Equipamento**

```
Ator: COORDENADOR
Pré: Autenticado

1. [COORD] Acessa "Gestão → Equipamentos"
2. [SYS] Mostra lista + botão [ + Novo Equipamento ]
3. [COORD] Click [ + Novo ]
4. [SYS] Form:
   ├─ Nome: [Supino Leg Press Smith Machine____]
   ├─ Tipo: [Máquina▼]
   │  ├─ Máquina estação
   │  ├─ Peso livre
   │  ├─ Acessório
   │  ├─ Cardio
   │  └─ Outro
   ├─ Marca: [LIFE FITNESS______]
   ├─ Modelo: [LF-1000____________]
   ├─ Série: [SN-123456__________]
   ├─ Data Compra: [01/01/2023____]
   ├─ Valor Compra: [R$15.000,00____]
   ├─ Vida Útil (anos): [10 anos____]
   ├─ Localização: [Salas Musculação 1▼]
   ├─ Peso/Carga (se aplicável): [300kg____]
   ├─ Especificações: [Suporta até 300kg...]
   ├─ Status: [Novo/Funcional▼]
   ├─ Ativo: [✓] Checkbox
   └─ Foto (optional): [Upload foto]

5. [COORD] Click "Salvar"
6. [SYS]
   ├─ Insert EQUIPAMENTO
   ├─ Calcula depreciação mensal
   ├─ Auditoria
   └─ Return equipamento_id
```

#### Database Schema

```sql
CREATE TABLE EQUIPAMENTO (
    equipamento_id SERIAL PRIMARY KEY,
    academia_id SMALLINT NOT NULL REFERENCES ACADEMIA(academia_id),
    
    nome VARCHAR(150) NOT NULL,
    tipo ENUM('MAQUINA', 'PESO_LIVRE', 'ACESSORIO', 'CARDIO', 'OUTRO'),
    marca VARCHAR(100),
    modelo VARCHAR(100),
    serie VARCHAR(150) UNIQUE,
    
    data_compra DATE NOT NULL,
    valor_compra NUMERIC(12,2) NOT NULL,
    vida_util_anos SMALLINT DEFAULT 10,
    
    sala_id SMALLINT REFERENCES SALA_AULA(sala_id),
    peso_carga NUMERIC(10,2),  -- Para equipamentos com carga
    
    especificacoes TEXT,
    status ENUM('NOVO', 'BOM', 'REGULAR', 'RUIM', 'DANIFICADO', 'MANUTENCAO') DEFAULT 'NOVO',
    ativo BOOLEAN DEFAULT true,
    
    foto_url VARCHAR(255),
    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_academia (academia_id),
    INDEX idx_status (status)
);
```

---

### 3.2 RF-EQUIP-02: Cadastrar Sala (Capacidade, Recursos, Horários)

#### Descrição
PROPRIETARIO/COORDENADOR cadastra salas da academia: nome, capacidade, recursos disponíveis (TV, som, espelhos), horários de funcionamento.

#### Casos de Uso

**UC-EQUIP-002: Coordenador Cadastra Sala**

```
Ator: COORDENADOR
Pré: Autenticado

1. [COORD] Acessa "Gestão → Salas"
2. [COORD] Click [ + Nova Sala ]
3. [SYS] Form:
   ├─ Nome: [Sala Musculação 1____________]
   ├─ Tipo: [Musculação▼]
   ├─ Capacidade máxima: [30 pessoas______]
   ├─ Capacidade de aulas: [20 pessoas____]
   ├─ Área (m²): [80 m²__________]
   ├─ Recursos:
   │  ├─ [✓] Espelhos
   │  ├─ [✓] Som/Áudio
   │  ├─ [✓] TV/Monitor
   │  ├─ [✓] Ar Condicionado
   │  └─ [ ] Estacionamento exclusivo
   ├─ Horário Abertura: [06:00___]
   ├─ Horário Fechamento: [23:00___]
   ├─ Ativo: [✓] Checkbox
   └─ [ Salvar ]

4. [COORD] Click "Salvar"
5. [SYS]
   ├─ Insert SALA_AULA
   ├─ Auditoria
   └─ Sucesso
```

#### Database Schema

```sql
CREATE TABLE SALA_AULA (
    sala_id SMALLSERIAL PRIMARY KEY,
    academia_id SMALLINT NOT NULL REFERENCES ACADEMIA(academia_id),
    
    nome VARCHAR(100) NOT NULL,
    tipo VARCHAR(50),  -- 'MUSCULACAO', 'YOGA', 'CARDIO', 'FUNCIONAL'
    
    capacidade_maxima SMALLINT NOT NULL,
    capacidade_aulas SMALLINT,
    area_m2 NUMERIC(8,2),
    
    recursos TEXT[],  -- Array: 'ESPELHOS', 'SOM', 'TV', 'AR_CONDICIONADO'
    
    hora_abertura TIME,
    hora_fechamento TIME,
    
    ativo BOOLEAN DEFAULT true,
    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_academia (academia_id)
);
```

---

### 3.3 RF-EQUIP-03: Registro de Manutenção (Preventiva, Corretiva)

#### Descrição
Registrar manutenção de equipamento: data, tipo (preventiva/corretiva), custo, técnico, descrição. Geração de alertas para manutenção vencida.

#### Casos de Uso

**UC-EQUIP-003: Coordenador Registra Manutenção**

```
Ator: COORDENADOR
Pré: Equipamento cadastrado

1. [COORD] Acessa "Gestão → Equipamentos"
2. [COORD] Search: "Supino Leg Press"
3. [COORD] Click em equipamento
4. [SYS] Mostra histórico manutenção + botão [ + Registrar ]
5. [COORD] Click [ + Registrar ]
6. [SYS] Form:
   ├─ Data Manutenção: [02/04/2026____]
   ├─ Tipo: [Preventiva▼]
   │  ├─ Preventiva (rotina)
   │  └─ Corretiva (problema)
   ├─ Descrição: [Limpeza, óleo em cilindros...]
   ├─ Técnico: [João Silva________]
   ├─ Custo: [R$250,00__________]
   ├─ Status: [Concluída▼]
   │  ├─ Concluída
   │  ├─ Em andamento
   │  └─ Agendada
   └─ Próximo agendamento: [02/07/2026] (3 meses)

7. [COORD] Click "Salvar"
8. [SYS]
   ├─ Insert MANUTENCAO_EQUIPAMENTO
   ├─ Update EQUIPAMENTO.status (se necessário)
   ├─ Schedule alert para próxima manutenção
   ├─ Auditoria + email coordenador
   └─ Sucesso
```

#### Database Schema

```sql
CREATE TABLE MANUTENCAO_EQUIPAMENTO (
    manutencao_id BIGSERIAL PRIMARY KEY,
    equipamento_id SERIAL NOT NULL REFERENCES EQUIPAMENTO(equipamento_id),
    academia_id SMALLINT NOT NULL,
    
    tipo_manutencao ENUM('PREVENTIVA', 'CORRETIVA') NOT NULL,
    data_manutencao DATE NOT NULL,
    descricao TEXT,
    
    tecnico_nome VARCHAR(100),
    custo NUMERIC(12,2),
    
    status ENUM('AGENDADA', 'EM_ANDAMENTO', 'CONCLUIDA') DEFAULT 'CONCLUIDA',
    
    proxima_manutencao DATE,  -- Sugestão para preventiva
    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_equipamento (equipamento_id),
    INDEX idx_data (data_manutencao)
);
```

---

### 3.4 RF-EQUIP-04: Bloqueio de Equipamento (Danificado, Manutenção)

#### Descrição
Bloquear equipamento de uso quando danificado ou em manutenção. Avisos na app para alunos/professores.

#### Casos de Uso

**UC-EQUIP-004: Coordenador Bloqueia Equipamento**

```
Ator: COORDENADOR
Pré: Equipamento danificado ou em manutenção

1. [COORD] Acessa "Gestão → Equipamentos"
2. [COORD] Search: "Esteira X"
3. [COORD] Click em equipamento
4. [SYS] Botão: [ ⚠️ Bloqueie ]
5. [COORD] Click [Bloquear]
6. [SYS] Form:
   ├─ Motivo: [Danificado▼]
   │  ├─ Danificado
   │  ├─ Manutenção
   │  ├─ Limpeza profunda
   │  └─ Outro
   ├─ Descrição: [Corrente descentralizada, perigoso]
   ├─ Data bloqueio: [02/04/2026]
   ├─ Data desbloqueio estimada: [05/04/2026]
   └─ [ Bloquear ]

7. [SYS]
   ├─ Insert EQUIPAMENTO_BLOQUEIO
   ├─ Update EQUIPAMENTO.status = DANIFICADO/MANUTENCAO
   ├─ Email alunos/professores: "Equipamento indisponível até..."
   ├─ App: Exibe ⚠️ vermelho no equipamento
   └─ Auditoria

8. [DEPOIS] Quando consertado:
   ├─ [COORD] Click [Desbloquear]
   ├─ Delete EQUIPAMENTO_BLOQUEIO
   ├─ Update status = BOM
   ├─ Email notificação
   └─ Sucesso
```

#### Database Schema

```sql
CREATE TABLE EQUIPAMENTO_BLOQUEIO (
    bloqueio_id BIGSERIAL PRIMARY KEY,
    equipamento_id SERIAL NOT NULL REFERENCES EQUIPAMENTO(equipamento_id),
    academia_id SMALLINT NOT NULL,
    
    motivo ENUM('DANIFICADO', 'MANUTENCAO', 'LIMPEZA', 'OUTRO'),
    descricao TEXT,
    
    data_bloqueio DATE DEFAULT CURRENT_DATE,
    data_desbloqueio_estimada DATE,
    data_desbloqueio_real DATE,
    
    bloqueado_por INTEGER NOT NULL REFERENCES USUARIO(usuario_id),
    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_equipamento (equipamento_id)
);
```

---

### 3.5 RF-EQUIP-05: Histórico de Uso (Qual Aluno/Aula Usou)

#### Descrição
Rastreamento de qual aluno/aula usou qual equipamento. Útil para manutenção corretiva e análise de desgaste.

#### Casos de Uso

**UC-EQUIP-005: Sistema Rastreia Uso**

```
Ator: SISTEMA (automático)
Trigger: Check-in aluno em aula com equipamento

1. [ALUNO] Faz check-in na aula: "Musculação com Prof. Pedro"
2. [COORD] Pré-configurou aula com equipamentos:
   ├─ Supino Leg Press
   ├─ Hack Machine
   ├─ Hack cadeira adutora
   └─ Table barras pesos

3. [SYS] Lê esta configuração no histórico
4. [SYS] Insert EQUIPAMENTO_USO para cada:
   ├─ equipamento_id = 1
   ├─ aluno_id = 123
   ├─ aula_id = 45
   ├─ data_uso = 02/04/2026
   ├─ hora_inicio = 18:00
   ├─ hora_fim = 19:00
   └─ duracao_minutos = 60

5. [COORD] Later pode visualizar:
   ├─ Equipamento "Supino" → 450 horas uso por mês
   ├─ Estimado: consumo 3 anos vida útil em 2 anos
   └─ Recomendação: aumentar manutenção preventiva
```

#### Database Schema

```sql
CREATE TABLE EQUIPAMENTO_USO (
    uso_id BIGSERIAL PRIMARY KEY,
    equipamento_id SERIAL NOT NULL REFERENCES EQUIPAMENTO(equipamento_id),
    aluno_id INTEGER NOT NULL REFERENCES ALUNO(aluno_id),
    aula_id SERIAL NOT NULL REFERENCES AULA(aula_id),
    academia_id SMALLINT NOT NULL,
    
    data_uso DATE NOT NULL,
    hora_inicio TIME,
    hora_fim TIME,
    duracao_minutos SMALLINT,
    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_equipamento (equipamento_id),
    INDEX idx_data (data_uso)
);
```

---

### 3.6 RF-EQUIP-06: Relatório Estado Equipamentos (Bom, Regular, Manutenção)

#### Descrição
Dashboard/relatório mostrando estado de todos equipamentos: quantos bons, regulares, danificados, em manutenção. Com histórico manutenção e próximas datas.

#### Screen Layout

```
RELATÓRIO ESTADO EQUIPAMENTOS
┌─────────────────────────────────────────────────────────┐
│ Período: [Últimos 6 meses▼]                             │
│                                              [Exportar]  │
├─────────────────────────────────────────────────────────┤

RESUMO GERAL:
┌─ Total de equipamentos: 85
  ├─ 🟢 BOM: 65 (76%)
  ├─ 🟡 REGULAR: 15 (18%)
  ├─ 🔴 DANIFICADO: 3 (3%)
  └─ ⚠️ MANUTENÇÃO: 2 (2%)

EQUIPAMENTOS DANIFICADOS (3):
┌─ Esteira X - Correia danificada - Bloqueado desde 01/04
  └─ Próxima manutenção: 03/04 agendado
  
┌─ Supino Y - Cilindro vazando óleo - Bloqueado desde 31/03
  └─ Técnico: João Silva - Data: 02/04

┌─ Smith Machine Z - Sensor travado - Bloqueado desde 30/03
  └─ Manutenção em andamento (João Silva)

MANUTENÇÃO PRÓXIMA (próximos 30 dias): 12 equipamentos
├─ 02/04 - Leg Press (preventiva)
├─ 05/04 - Hack Machine (preventiva)
├─ 07/04 - Cadeira Abdutora (corretiva)
└─ ...

CUSTO MANUTENÇÃO (últimos 6 meses): R$4.250,00
├─ Preventiva: R$1.800,00 (42%)
└─ Corretiva: R$2.450,00 (58%)
```

---

### 3.7 RF-EQUIP-07: Cálculo Depreciação (Valor Residual, Custo Mensal)

#### Descrição
Sistema calcula automaticamente depreciação de equipamento (linear), valor residual atual, custo mensal. Útil para relatórios financeiros.

#### Fórmula

```
Depreciação Linear:
├─ Custo Anual = Valor Compra / Vida Útil (anos)
├─ Custo Mensal = Custo Anual / 12
├─ Custo Di = Custo Mensal / 30
└─ Valor Residual Atual = Valor Compra - (Custo Mensal × Meses Decorridos)

Exemplo (Supino Leg Press):
├─ Valor compra: R$15.000,00
├─ Vida útil: 10 anos
├─ Meses decorridos: 27 meses (desde jan/2024)
├─ Custo anual: R$15.000 / 10 = R$1.500/ano
├─ Custo mensal: R$1.500 / 12 = R$125/mês
├─ Custo total até agora: R$125 × 27 = R$3.375
├─ Valor residual: R$15.000 - R$3.375 = R$11.625
└─ Resta: 73 meses (6 anos e 1 mês)
```

#### Database Schema

```sql
CREATE TABLE EQUIPAMENTO_DEPRECIACAO (
    depreciacao_id SERIAL PRIMARY KEY,
    equipamento_id SERIAL NOT NULL REFERENCES EQUIPAMENTO(equipamento_id),
    academia_id SMALLINT NOT NULL,
    
    valor_compra NUMERIC(12,2),
    vida_util_anos SMALLINT,
    
    custo_anual NUMERIC(12,2),  -- Calculado
    custo_mensal NUMERIC(10,2),  -- Calculado
    
    data_ultima_atualizacao DATE,
    valor_residual_atual NUMERIC(12,2),  -- Calculado
    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE (equipamento_id)
);

-- Trigger: atualizar depreciação mensalmente
TRIGGER TRG_ATUALIZAR_DEPRECIACAO_MONTHLY
```

---

### 3.8 RF-EQUIP-08: Alertas Manutenção (Preventiva Vencida, Uso Excessivo)

#### Descrição
Sistema monitora alertas: manutenção preventiva vencida, equipamento com uso excessivo (mais horas que o esperado por mês), salas sem aula agendada, equipamentos ociosos.

#### Casos de Uso

**UC-EQUIP-008: Sistema Gera Alertas Automáticos**

```
Ator: SISTEMA (daily job)
Trigger: 08:00 AM diariamente

1. [JOB] Execute: "Verificar saúde equipamentos"

2. [JOB] Check 1: Manutenção preventiva vencida
   ├─ Query: Equipamentos com próxima_manutencao < TODAY
   ├─ Result: Leg Press (vencida há 10 dias)
   ├─ Action: Insert ALERTA_EQUIPAMENTO
   └─ Email coordenador: "Leg Press com manutenção vencida"

3. [JOB] Check 2: Uso excessivo
   ├─ Calcula uso médio mensal por equipamento
   ├─ Se uso_atual > uso_médio × 1.5 (50% acima):
   │  ├─ Flag: "Uso acima da média"
   │  ├─ Example: Esteira A = 180h/mês (vs média 120h)
   │  └─ Email: "Esteira A: considere manutenção preventiva"
   └─ Insert ALERTA_EQUIPAMENTO

4. [JOB] Check 3: Equipamentos ociosos
   ├─ Equipamentos sem uso nos últimos 30 dias
   ├─ Example: Cadeira adutora não usada há 45 dias
   └─ Email: "Avaliar se ainda necessário"

5. [COORD] App: Dashboard mostra alertas
   ├─ 🔴 1 alerta crítico (manutenção vencida)
   ├─ 🟡 3 avisos (uso excessivo)
   └─ 🔵 2 ociosos (considerar remover)

6. [COORD] Click alerta
7. [SYS] Sugere ações:
   ├─ "Agendar manutenção agora"
   ├─ "Mais informações sobre equipamento"
   └─ "Descartar alerta"
```

#### Database Schema

```sql
CREATE TABLE ALERTA_EQUIPAMENTO (
    alerta_id BIGSERIAL PRIMARY KEY,
    equipamento_id SERIAL NOT NULL REFERENCES EQUIPAMENTO(equipamento_id),
    academia_id SMALLINT NOT NULL,
    
    tipo_alerta ENUM('MANUTENCAO_VENCIDA', 'USO_EXCESSIVO', 'OCIOSO', 'VALOR_BAIXO'),
    severidade ENUM('CRITICA', 'AVISO', 'INFO'),
    
    descricao TEXT,
    data_alerta DATE DEFAULT CURRENT_DATE,
    lido BOOLEAN DEFAULT false,
    descartado BOOLEAN DEFAULT false,
    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_equipamento (equipamento_id),
    INDEX idx_severidade (severidade)
);
```

---

## 4. Especificações Técnicas

### 4.1 Stack

```
Backend
├─ Java 17+, Spring Boot 3.0+
├─ spring-boot-starter-scheduler (daily jobs)
├─ JPA/Hibernate

Frontend
├─ React 18+
├─ Recharts (gráficos)
├─ date-fns (datas)

Database
├─ PostgreSQL 14+
└─ Triggers para depreciação automática
```

### 4.2 API Endpoints

```
POST   /api/v1/equipamentos                    (RF-EQUIP-01)
GET    /api/v1/equipamentos
GET    /api/v1/equipamentos/{id}
PUT    /api/v1/equipamentos/{id}

POST   /api/v1/salas                          (RF-EQUIP-02)
GET    /api/v1/salas
PUT    /api/v1/salas/{id}

POST   /api/v1/equipamentos/{id}/manutencao   (RF-EQUIP-03)
GET    /api/v1/equipamentos/{id}/manutencao

PUT    /api/v1/equipamentos/{id}/bloquear     (RF-EQUIP-04)
PUT    /api/v1/equipamentos/{id}/desbloquear

GET    /api/v1/equipamentos/{id}/historico-uso (RF-EQUIP-05)

GET    /api/v1/relatorios/equipamentos/estado (RF-EQUIP-06)
GET    /api/v1/relatorios/equipamentos/estado/export

GET    /api/v1/equipamentos/{id}/depreciacao  (RF-EQUIP-07)

GET    /api/v1/alertas/equipamentos           (RF-EQUIP-08)
PUT    /api/v1/alertas/equipamentos/{id}/ler
```

---

## 5. Critério de Aceitação

```
✅ RF-EQUIP-01: Equipamento cadastrado com série, valor, vida útil
✅ RF-EQUIP-02: Sala cadastrada com capacidade, recursos
✅ RF-EQUIP-03: Manutenção registrada (tipo, técnico, custo, próxima)
✅ RF-EQUIP-04: Bloqueio com motivo, data desbloqueio
✅ RF-EQUIP-05: Uso rastreado por aula/aluno
✅ RF-EQUIP-06: Relatório com breakdown status
✅ RF-EQUIP-07: Depreciação calculada automaticamente
✅ RF-EQUIP-08: Alertas gerados e notificados

Performance:
✅ Load lista equipamentos: < 1s (500+ equipamentos)
✅ Gerar relatório: < 3s
✅ Calcular alertas: < 2s (daily job)
```

---

## 6. Test Cases

```java
@DisplayName("RF-EQUIP-01 a 08")
class EquipamentoServiceTest {
  @Test
  void deveCadastrar_Equipamento() { }
  
  @Test
  void deveRegistrar_Manutencao() { }
  
  @Test
  void deveBloquear_E_Desbloquear() { }
  
  @Test
  void deveRastrear_Uso() { }
  
  @Test
  void deveCalcular_Depreciacao() { }
  
  @Test
  void deveGerar_Alertas_Manutencao() { }
}
```

---

## 7. Timeline

```
Dia 1 (desenvolvimento):
├─ EQUIPAMENTO + SALA_AULA tables
├─ MANUTENCAO_EQUIPAMENTO
├─ API endpoints 01-02-03

Dia 2:
├─ EQUIPAMENTO_BLOQUEIO + EQUIPAMENTO_USO
├─ API endpoints 04-05-06
├─ Depreciação automática (trigger)

Dia 3:
├─ Alertas automáticos (scheduler)
├─ Relatório estado + export
├─ Tests (80%+ coverage)
├─ SonarQube gates
└─ Ready
```

---

**Status**: 🟢 PRONTO PARA DEV  
**RFs**: 8  
**Linhas Estimadas**: ~4000  
**Stack**: SpringBoot + React + PostgreSQL  
**Próxima**: SPEC-007 (Insumos/Produtos)

