# SPEC-007 — Insumos e Produtos (Estoque, Compras, Produtos à Venda)

> **Versão**: 1.0  
> **Data**: 2 de abril de 2026  
> **Módulos**: M07 (Insumos)  
> **Status**: 🟢 PRONTO PARA DESENVOLVIMENTO  
> **RFs Inclusos**: RF-INSUMO-01 a 08 (8 RFs)  
> **Bloqueadores**: ✅ ZERO (DUV-07 resolvida: Whey 1kg R$160, Creatina 250g R$49,99)

---

> Nota de escopo MVP: esta SPEC orienta a entrega do MVP operacional. Requisitos de robustez em nivel enterprise ficam como evolucao futura e nao sao criterio de aceite desta fase.

## 1. Visão Geral

### Propósito
Especificar funcionalidades de **gerenciamento de insumos, estoque e produtos à venda**: cadastro de insumos de limpeza/mantimentos, controle de estoque com alertas, gestão de compras com fornecedores, e catálogo de produtos para venda aos alunos (suplementos, bebidas).

### Escopo
- ✅ Cadastrar Insumo (limpeza, manutenção, materiais consumíveis)
- ✅ Cadastrar Produto Venda (suplementos, bebidas - e-commerce)
- ✅ Controle Estoque (quantidade, local, validade)
- ✅ Alertas Estoque (baixa quantidade, validade próxima)
- ✅ Gestão Compras (requisição, pedido, recebimento, NF)
- ✅ Rastreamento Fornecedores (contato, histórico preço)
- ✅ Histórico Uso Insumos (quem usou, quando, quanto)
- ✅ Relatório Estoque (valor total, rotatividade, desperdício)

### Não Incluso (Futuro)
- ❌ Integração com ERP/WMS — Futuro
- ❌ Venda online (Stripe, PIX) — Fase 3
- ❌ Análise nutricional produtos — Futuro

---

## 2. Referências Críticas

| Documento | Seção | Referência |
|-----------|-------|-----------|
| [DUV Resolutions](../.copilot/memory/duv-resolutions.md) | DUV-07 | Whey 1kg R$160, Creatina 250g R$49,99 |
| [Glossário](../00-originais/glossario.md) | Insumo, Estoque, Fornecedor | Terminologia |
| [Modelo Dados](../02-mapa/modelo-dados-conceitual.md) | INSUMO, PRODUTO_VENDA, ESTOQUE | Schema |
| [SPEC-002](./SPEC-002-financeiro.md) | RF-FIN | Pagamentos (compras) |

---

## 3. Requisitos Funcionais Detalhados

### 3.1 RF-INSUMO-01: Cadastrar Insumo (Limpeza, Manutenção, Consumíveis)

#### Descrição
PROPRIETARIO/COORDENADOR cadastra insumos: materiais de limpeza, mantimentos, consumíveis para equipamentos. Com categoria, unidade, marca, preço unitário, fornecedor.

#### Casos de Uso

**UC-INSUMO-001: Coordenador Cadastra Insumo**

```
Ator: COORDENADOR
Pré: Autenticado

1. [COORD] Acessa "Gestão → Insumos"
2. [SYS] Mostra lista + botão [ + Novo Insumo ]
3. [COORD] Click [ + Novo ]
4. [SYS] Form:
   ├─ Nome: [Álcool 70% (1L)______________]
   ├─ Categoria: [Limpeza▼]
   │  ├─ Limpeza
   │  ├─ Manutenção Equipamento
   │  ├─ Segurança/Higiene
   │  ├─ Outros
   ├─ Marca: [BOMBRIL_____________]
   ├─ Código Barras: [7896000000123____]
   ├─ Unidade: [Litro▼]
   │  ├─ Litro, Kg, Unidade, Caixa
   ├─ Preço Unitário: [R$8,50________]
   ├─ Fornecedor: [Distribuidora X▼]
   ├─ Estoque Mínimo: [10 litros______]
   ├─ Estoque Máximo: [50 litros______]
   ├─ Local Armazenamento: [Almoxarifado 1▼]
   ├─ Data Validade: [30/12/2026____]
   ├─ Ativo: [✓] Checkbox
   └─ [ Salvar ]

5. [COORD] Click "Salvar"
6. [SYS]
   ├─ Insert INSUMO
   ├─ Auditoria
   └─ Return insumo_id
```

#### Database Schema

```sql
CREATE TABLE INSUMO (
    insumo_id SERIAL PRIMARY KEY,
    academia_id SMALLINT NOT NULL REFERENCES ACADEMIA(academia_id),
    
    nome VARCHAR(150) NOT NULL,
    categoria ENUM('LIMPEZA', 'MANUTENCAO', 'SEGURANCA', 'OUTRO'),
    marca VARCHAR(100),
    codigo_barras VARCHAR(50),
    
    unidade VARCHAR(20),  -- 'L', 'Kg', 'Un', 'Caixa'
    preco_unitario NUMERIC(10,2) NOT NULL,
    
    fornecedor_id SERIAL REFERENCES FORNECEDOR(fornecedor_id),
    
    estoque_minimo NUMERIC(10,2),
    estoque_maximo NUMERIC(10,2),
    local_armazenamento VARCHAR(100),
    
    data_validade DATE,
    
    ativo BOOLEAN DEFAULT true,
    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_academia (academia_id),
    INDEX idx_categoria (categoria)
);
```

---

### 3.2 RF-INSUMO-02: Cadastrar Produto Venda (Suplementos, Bebidas, Whey/Creatina)

#### Descrição
PROPRIETARIO/COORDENADOR cadastra produtos para venda aos alunos: suplementos, bebidas, whey protein (1kg R$160), creatina (250g R$49,99). Com descrição, preço, estoque inicial.

#### Casos de Uso

**UC-INSUMO-002: Coordenador Cadastra Produto Venda**

```
Ator: COORDENADOR
Pré: Autenticado

1. [COORD] Acessa "Loja → Produtos"
2. [COORD] Click [ + Novo Produto ]
3. [SYS] Form:
   ├─ Nome: [Whey Protein Gold Standard 1kg]
   ├─ Descrição: [Proteína isolada 90%, sabor chocolate...]
   ├─ SKU: [WHEY-GOLD-1KG]
   ├─ Marca: [Optimum Nutrition____]
   ├─ Categoria: [Suplemento▼]
   │  ├─ Proteína
   │  ├─ Creatina
   │  ├─ Pré-treino
   │  ├─ Bebida
   │  └─ Outro
   ├─ Preço Venda: [R$160,00________]
   ├─ Status: [Ativo▼]
   ├─ Estoque Inicial: [50 unidades___]
   ├─ Foto: [Upload IMG]
   └─ [ Salvar ]

4. [COORD] Click "Salvar"
5. [SYS]
   ├─ Insert PRODUTO_VENDA
   ├─ Insert ESTOQUE_PRODUTO com quantidade inicial
   ├─ Auditoria
   └─ Produto aparece na loja (app/web)

6. [ALUNO] Acessa "Loja → Suplementos"
7. [SYS] Mostra:
   ├─ Whey Protein Gold Standard 1kg
   ├─ Preço: R$160,00
   ├─ Foto: [imagem]
   ├─ Descrição: "Proteína isolada 90%..."
   ├─ Estoque: 50 unidades disponíveis
   ├─ Avaliação: 4.8/5 (23 reviews)
   └─ [ Comprar ]
```

#### Database Schema

```sql
CREATE TABLE PRODUTO_VENDA (
    produto_id SERIAL PRIMARY KEY,
    academia_id SMALLINT NOT NULL REFERENCES ACADEMIA(academia_id),
    
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    sku VARCHAR(50) UNIQUE,
    marca VARCHAR(100),
    
    categoria_produto VARCHAR(50),  -- PROTEINA, CREATINA, PRE_TREINO, BEBIDA
    preco_venda NUMERIC(12,2) NOT NULL,
    preco_custo NUMERIC(12,2),  -- Opcional, para cálculo margem
    
    status ENUM('ATIVO', 'INATIVO', 'DESCONTINUADO') DEFAULT 'ATIVO',
    
    foto_url VARCHAR(255),
    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_academia (academia_id),
    INDEX idx_sku (sku)
);
```

---

### 3.3 RF-INSUMO-03: Controle de Estoque (Quantidade, Local, Validade)

#### Descrição
Rastreamento em tempo real de quantidade em estoque, local (almoxarifado), data de validade. Atualiza com cada entrada/saída.

#### Casos de Uso

**UC-INSUMO-003: Sistema Rastreia Estoque**

```
Ator: SISTEMA (automático)
Trigger: Entrada de compra, uso de insumo, venda de produto

1a. [ENTRADA] Coordenador recebe compra:
    ├─ Álcool 70% (20 litros)
    ├─ Click "Receber compra"
    └─ [SYS] Insert MOVIMENTO_ESTOQUE
       ├─ tipo: ENTRADA
       ├─ insumo_id
       ├─ quantidade: +20
       ├─ saldo_anterior: 30
       ├─ saldo_novo: 50
       ├─ motivo: COMPRA_NF #12345
       └─ data_hora: 02/04/2026 10:30

1b. [SAÍDA] Professor usa álcool na limpeza:
    ├─ Registra uso (manual ou automático)
    ├─ [SYS] Insert MOVIMENTO_ESTOQUE
       ├─ tipo: SAIDA
       ├─ insumo_id
       ├─ quantidade: -2
       ├─ saldo_anterior: 50
       ├─ saldo_novo: 48
       ├─ motivo: LIMPEZA_SALA
       └─ auditoria: responsavel, hora

1c. [VENDA] Aluno compra whey protein:
    ├─ Click "Comprar"
    ├─ [SYS] Insert ESTOQUE_VENDA
       ├─ tipo: VENDA
       ├─ produto_id: WHEY-GOLD-1KG
       ├─ quantidade: -1
       ├─ saldo_anterior: 50
       ├─ saldo_novo: 49
       └─ venda_id: linked

2. [COORD] Acessa "Gestão → Estoque"
3. [SYS] Dashboard:
   ├─ Álcool 70%: 48L de 50L máx (96%)
   ├─ Whey Protein: 49 un de 50 un (98%)
   ├─ Creatina: 12 un de 30 un (40%) ⚠️
   └─ Click para mais detalha
```

#### Database Schema

```sql
CREATE TABLE ESTOQUE_INSUMO (
    estoque_id SERIAL PRIMARY KEY,
    insumo_id SERIAL NOT NULL REFERENCES INSUMO(insumo_id),
    academia_id SMALLINT NOT NULL,
    
    quantidade_atual NUMERIC(10,2),
    data_ultima_atualizacao TIMESTAMP,
    
    UNIQUE (insumo_id, academia_id)
);

CREATE TABLE MOVIMENTO_ESTOQUE (
    movimento_id BIGSERIAL PRIMARY KEY,
    insumo_id SERIAL NOT NULL REFERENCES INSUMO(insumo_id),
    academia_id SMALLINT NOT NULL,
    
    tipo ENUM('ENTRADA', 'SAIDA', 'AJUSTE'),
    quantidade NUMERIC(10,2),
    
    saldo_anterior NUMERIC(10,2),
    saldo_novo NUMERIC(10,2),
    
    motivo VARCHAR(100),  -- 'COMPRA_NF', 'LIMPEZA_SALA', 'AJUSTE_INVENTARIO'
    documento_id VARCHAR(50),  -- Número NF, recebimento, etc
    
    responsavel_id INTEGER REFERENCES USUARIO(usuario_id),
    data_movimento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_insumo (insumo_id),
    INDEX idx_data (data_movimento)
);
```

---

### 3.4 RF-INSUMO-04: Alertas Estoque (Baixa Quantidade, Validade Próxima)

#### Descrição
Sistema monitora estoque diariamente e gera alertas quando: quantidade cai abaixo do mínimo, data de validade está próxima (30 dias), ou insumo venceu.

#### Casos de Uso

**UC-INSUMO-004: Sistema Gera Alertas Estoque**

```
Ator: SISTEMA (daily job 06:00 AM)
Trigger: Daily scheduler

1. [JOB] Execute: "Verificar saúde estoque"

2. [JOB] Check 1: Quantidade abaixo do mínimo
   ├─ Query: estoques < estoque_minimo
   ├─ Result: Álcool 70% tem 5L (min 10L)
   ├─ Action: Insert ALERTA_ESTOQUE (tipo: BAIXO_MINIMO)
   └─ Email: "Álcool com estoque baixo, reorder"

3. [JOB] Check 2: Validade próxima (< 30 dias)
   ├─ Query: date_validade BETWEEN NOW() AND NOW() + 30 dias
   ├─ Result: Álcool tem validade em 20 dias
   ├─ Action: Insert ALERTA_ESTOQUE (tipo: VALIDADE_PROXIMA)
   └─ Email: "Álcool vence em 20 dias"

4. [JOB] Check 3: Já venceu
   ├─ Query: date_validade < NOW()
   ├─ Result: Desinfetante vencido em 5 dias
   ├─ Action: Insert ALERTA_ESTOQUE (tipo: VENCIDO)
   └─ Email crítica: "Desinfetante vencido! Remover!"

5. [COORD] App notificações:
   ├─ 🔴 1 crítico: Desinfetante vencido
   ├─ 🟡 2 avisos: Álcool + Creatina em risco
   └─ 🔵 1 info: Outro insumo close ao mínimo

6. [COORD] Click alerta
7. [SYS] Sugere ações:
   ├─ "Criar requisição compra"
   ├─ "Usar antes da validade"
   └─ "Descartar e remover do estoque"
```

#### Database Schema

```sql
CREATE TABLE ALERTA_ESTOQUE (
    alerta_id BIGSERIAL PRIMARY KEY,
    insumo_id SERIAL NOT NULL REFERENCES INSUMO(insumo_id),
    academia_id SMALLINT NOT NULL,
    
    tipo_alerta ENUM('BAIXO_MINIMO', 'VALIDADE_PROXIMA', 'VENCIDO'),
    severidade ENUM('CRITICA', 'AVISO', 'INFO'),
    
    descricao TEXT,
    data_alerta DATE DEFAULT CURRENT_DATE,
    lido BOOLEAN DEFAULT false,
    descartado BOOLEAN DEFAULT false,
    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_insumo (insumo_id),
    INDEX idx_severidade (severidade)
);
```

---

### 3.5 RF-INSUMO-05: Gestão de Compras (Requisição, Pedido, Recebimento, NF)

#### Descrição
Workflow completo de compra: coordenador cria requisição, transforma em pedido, recebe mercadoria, registra NF e paga (SPEC-002).

#### Casos de Uso

**UC-INSUMO-005: Coordenador Cria Requisição Compra**

```
Ator: COORDENADOR
Pré: Autenticado, alerta ou necessidade de reorder

1. [COORD] Click alerta "Álcool com estoque baixo"
2. [SYS] Form pré-preenchido:
   ├─ Insumo: [Álcool 70% 1L preço R$8,50]
   ├─ Quantidade solicitada: [30 litros______]
   ├─ Fornecedor: [Distribuidora X▼]
   ├─ Urgência: [Normal▼]
   │  ├─ Normal
   │  ├─ Média
   │  └─ Urgente
   └─ Observação: [_______________________]

3. [COORD] Click "Criar Requisição"
4. [SYS]
   ├─ Insert REQUISICAO_COMPRA
   ├─ Status: AGUARDANDO_APROVACAO
   ├─ Email proprietario: "Nova requisição"
   └─ Return requisicao_id

5. [PROP] Aprova requisição (opcional workflow)
6. [COORD] Click "Transformar em Pedido"
7. [SYS]
   ├─ Insert PEDIDO_COMPRA
   ├─ Email fornecedor: "Novo pedido" (manual depois)
   ├─ Status: PEDIDO_ENVIADO
   └─ Referência para acompanhamento

8. [DEPOIS] Coordenador recebe entrega:
   ├─ Click "Receber Mercadoria"
   ├─ [SYS] Form:
   │  ├─ Pedido: [#12345]
   │  ├─ Data Recebimento: [02/04/2026]
   │  ├─ Quantidade Recebida: [30L______]
   │  ├─ Status Produto: [Bom▼]
   │  ├─ NF: [123456789________]
   │  ├─ Valor NF: [R$255,00_______]
   │  └─ Data Vencimento: [30/12/2026____]
   └─ [ Confirmar Recebimento ]

9. [SYS] (após confirmação)
   ├─ Update ESTOQUE_INSUMO (+30L)
   ├─ Insert MOVIMENTO_ESTOQUE (ENTRADA)
   ├─ Insert NOTA_FISCAL
   ├─ Update PEDIDO_COMPRA.status = RECEBIDO
   ├─ Email: "Compra recebida e em estoque"
   ├─ Register no financeiro (SPEC-002) como despesa
   └─ Alerta resolvido ✓
```

#### Database Schema

```sql
CREATE TABLE REQUISICAO_COMPRA (
    requisicao_id BIGSERIAL PRIMARY KEY,
    academia_id SMALLINT NOT NULL,
    insumo_id SERIAL NOT NULL REFERENCES INSUMO(insumo_id),
    
    quantidade NUMERIC(10,2),
    urgencia VARCHAR(20),  -- NORMAL, MEDIA, URGENTE
    
    solicitado_por INTEGER NOT NULL REFERENCES USUARIO(usuario_id),
    status ENUM('AGUARDANDO_APROVACAO', 'APROVADA', 'REJEITADA', 'TRANSFORMADA') DEFAULT 'AGUARDANDO_APROVACAO',
    
    observacao TEXT,
    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_insumo (insumo_id),
    INDEX idx_status (status)
);

CREATE TABLE PEDIDO_COMPRA (
    pedido_id BIGSERIAL PRIMARY KEY,
    academia_id SMALLINT NOT NULL,
    requisicao_id BIGINT NOT NULL REFERENCES REQUISICAO_COMPRA(requisicao_id),
    fornecedor_id SERIAL NOT NULL REFERENCES FORNECEDOR(fornecedor_id),
    
    numero_pedido VARCHAR(50),
    data_pedido DATE,
    quantidade NUMERIC(10,2),
    valor_total NUMERIC(12,2),
    
    status ENUM('PEDIDO_ENVIADO', 'EM_TRANSITO', 'RECEBIDO', 'CANCELADO') DEFAULT 'PEDIDO_ENVIADO',
    
    data_entrega_estimada DATE,
    data_recebimento_real DATE,
    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_fornecedor (fornecedor_id),
    INDEX idx_status (status)
);

CREATE TABLE NOTA_FISCAL (
    nf_id BIGSERIAL PRIMARY KEY,
    academia_id SMALLINT NOT NULL,
    pedido_id BIGINT NOT NULL REFERENCES PEDIDO_COMPRA(pedido_id),
    
    numero_nf VARCHAR(50) UNIQUE,
    serie VARCHAR(10),
    data_emissao DATE,
    
    valor_total NUMERIC(12,2),
    impostos NUMERIC(12,2),
    
    arquivo_url VARCHAR(255),  -- PDF/XML da NF
    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 3.6 RF-INSUMO-06: Rastreamento Fornecedores (Contato, Histórico Preço)

#### Descrição
Cadastro e rastreamento de fornecedores: contato, localização, histórico de preços, avaliação (pontualidade, qualidade).

#### Casos de Uso

**UC-INSUMO-006: Coordenador Gerencia Fornecedor**

```
Ator: COORDENADOR
Pré: Autenticado

1. [COORD] Acessa "Gestão → Fornecedores"
2. [COORD] Click [ + Novo Fornecedor ]
3. [SYS] Form:
   ├─ Nome: [Distribuidora XYZ____________]
   ├─ CNPJ: [12.345.678/0001-99________]
   ├─ Email: [vendas@distribuidora.com__]
   ├─ Telefone: [(11) 3333-4444________]
   ├─ CEP: [01234-567______]
   ├─ Endereço: [Rua XXX, 123______]
   ├─ Contato: [João Silva########]
   ├─ Pontualidade: [⭐⭐⭐⭐☆ 4/5]
   ├─ Qualidade: [⭐⭐⭐⭐⭐ 5/5]
   ├─ Obs: [Bom custo, entrega rápida...]
   └─ [ Salvar ]

4. [COORD] View histórico:
   ├─ Últimas compras: 5 pedidos
   ├─ Histórico preço Álcool 70%:
   │  ├─ Jan 2026: R$8,50/L
   │  ├─ Fev 2026: R$8,30/L
   │  └─ Abr 2026: R$8,50/L
   └─ Tendência: estável
```

#### Database Schema

```sql
CREATE TABLE FORNECEDOR (
    fornecedor_id SERIAL PRIMARY KEY,
    academia_id SMALLINT NOT NULL,
    
    nome VARCHAR(150) NOT NULL,
    cnpj VARCHAR(18) UNIQUE,
    email VARCHAR(150),
    telefone VARCHAR(20),
    
    endereco VARCHAR(255),
    cep VARCHAR(10),
    cidade VARCHAR(100),
    estado CHAR(2),
    
    contato_nome VARCHAR(100),
    contato_telefone VARCHAR(20),
    
    avaliacao_pontualidade NUMERIC(3,2),  -- 1-5
    avaliacao_qualidade NUMERIC(3,2),
    
    observacao TEXT,
    ativo BOOLEAN DEFAULT true,
    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE HISTORICO_PRECO_INSUMO (
    historico_id BIGSERIAL PRIMARY KEY,
    insumo_id SERIAL NOT NULL REFERENCES INSUMO(insumo_id),
    fornecedor_id SERIAL NOT NULL REFERENCES FORNECEDOR(fornecedor_id),
    
    preco NUMERIC(10,2),
    data_preco DATE,
    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 3.7 RF-INSUMO-07: Histórico de Uso Insumos (Quem, Quando, Quanto)

#### Descrição
Rastreamento de quem usou qual insumo, quando, em qual sala/situação. Útil para auditoria, costear operações, identificar desperdício.

#### Casos de Uso

**UC-INSUMO-007: Sistema Rastreia Uso**

```
Ator: PROFESSOR/COORDENADOR
Pré: Autenticado

1. [PROF] Após limpeza de sala
2. [PROF] Registra uso (manual):
   ├─ [Gestão → Registrar Uso Insumo]
   ├─ [SYS] Form:
   │  ├─ Insumo: [Álcool 70%▼]
   │  ├─ Quantidade usada: [0.5 litros_]
   │  ├─ Local: [Sala Musculação 1▼]
   │  ├─ Motivo: [Limpeza▼]
   │  │  ├─ Limpeza
   │  │  ├─ Vazamento
   │  │  ├─ Desperdício
   │  │  └─ Outro
   │  ├─ Data/Hora: [02/04 15:30]
   │  └─ Observação: [Limpeza pós-aula...]
   └─ [ Registrar ]

3. [SYS]
   ├─ Insert MOVIMENTO_ESTOQUE (SAIDA)
   ├─ Update ESTOQUE_INSUMO (-0.5L)
   ├─ Log completo com responsável, local, motivo
   └─ Auditoria

4. [COORD] Relatório de uso:
   ├─ Álcool 70% - Abril 2026:
   │  ├─ Total usado: 15L
   │  ├─ Limpeza: 14L (93%)
   │  ├─ Desperdício: 1L (7%)
   │  └─ Média/dia: 0.5L
   ├─ Top usuários:
   │  ├─ João (PROF): 5L
   │  ├─ Maria (COORD): 4L
   │  └─ Pedro (PROF): 3L
   └─ Recomendação: consumo dentro do esperado
```

#### Database Schema

```sql
-- Já existe em MOVIMENTO_ESTOQUE com campo responsavel_id e motivo
-- Adicionar triggers para rastreamento automático se necessário
```

---

### 3.8 RF-INSUMO-08: Relatório Estoque (Valor Total, Rotatividade, Desperdício)

#### Descrição
Dashboard/relatório análise de estoque: valor total investido, rotatividade (COGS), índices de desperdício, produtos com baixa saída.

#### Screen Layout

```
RELATÓRIO DE ESTOQUE
┌─────────────────────────────────────────────────────────┐
│ Período: [Abril 2026▼]                     [Exportar]   │
├─────────────────────────────────────────────────────────┤

RESUMO FINANCEIRO:
├─ Valor total em estoque: R$4.250,00
├─ Valor mês passado: R$4.100,00
├─ Variação: +3.7%
├─ Maior investimento: Whey Protein R$8.000 (47%)

INSUMOS (CONSUMÍVEIS):
├─ Álcool 70%: 48L (96% utilização)
├─ Desinfetante: 5L (desperdício 5%, revisar)
├─ Pano: 150 (normal, 3.5/dia)

PRODUTOS VENDA:
├─ Whey Protein: 49 un (98% vendas, r.o.t = rápido)
├─ Creatina: 12 un (40% em estoque, r.o.t = lento)
└─ Bebida: 30 un (87% vendas, r.o.t = médio)

CUSTO TOTAL MÊS (COGS):
├─ Insumos consumidos: R$425 (limpeza/manutenção)
├─ Custo produtos vendidos: R$2.100 (margem 35%)
└─ Total operacional: R$2.525

ANÁLISE DESPERDÍCIO:
├─ Álcool: -5% (dentro esperado)
├─ Desinfetante: -7% ⚠️ revisar procedimento
├─ Total desperdício: R$85 (2% do estoque)

ROTATIVIDADE (Turnover):
├─ Whey: 12x/ano (rápido, ótimo)
├─ Creatina: 4x/ano (lento, considerar reduz estoque)
├─ Bebida: 6x/ano (normal)

PRODUTOS COM BAIXA VENDA:
├─ Creatina: últimas 2 semanas, 1 un vendida
├─ Recomendação: promoção ou descontinuar
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
└─ Triggers para movement tracking
```

### 4.2 API Endpoints

```
POST   /api/v1/insumos                       (RF-INSUMO-01)
GET    /api/v1/insumos
PUT    /api/v1/insumos/{id}

POST   /api/v1/produtos-venda                (RF-INSUMO-02)
GET    /api/v1/produtos-venda
GET    /api/v1/produtos-venda/{id}

GET    /api/v1/estoque/insumos               (RF-INSUMO-03)
GET    /api/v1/estoque/produtos

GET    /api/v1/alertas/estoque               (RF-INSUMO-04)

POST   /api/v1/requisicoes-compra            (RF-INSUMO-05)
GET    /api/v1/pedidos-compra
POST   /api/v1/pedidos/{id}/receber

POST   /api/v1/fornecedores                  (RF-INSUMO-06)
GET    /api/v1/fornecedores

POST   /api/v1/movimentos-estoque            (RF-INSUMO-07)
GET    /api/v1/historico-uso/{insumo_id}

GET    /api/v1/relatorios/estoque            (RF-INSUMO-08)
GET    /api/v1/relatorios/estoque/export
```

---

## 5. Critério de Aceitação

```
✅ RF-INSUMO-01: Insumo cadastrado com categoria, preço, fornecedor
✅ RF-INSUMO-02: Produto venda criado (Whey R$160, Creatina R$49,99, etc)
✅ RF-INSUMO-03: Estoque rastreado por movimento (entrada/saída)
✅ RF-INSUMO-04: Alertas gerados (baixo mínimo, validade próxima, vencido)
✅ RF-INSUMO-05: Compra completa (requisição → pedido → recebimento → NF)
✅ RF-INSUMO-06: Fornecedor com histórico preço
✅ RF-INSUMO-07: Uso rastreado (responsável, motivo, local)
✅ RF-INSUMO-08: Relatório com valor total, rotatividade, desperdício

Performance:
✅ Load estoque: < 1s (1000+ itens)
✅ Gerar relatório: < 3s
✅ Calcular alertas: < 2s (daily job)
```

---

## 6. Test Cases

```java
@DisplayName("RF-INSUMO-01 a 08")
class InsumoServiceTest {
  @Test
  void deveCadastrar_Insumo() { }
  
  @Test
  void deveCadastrar_ProdutoVenda() { }
  
  @Test
  void deveRastrear_Movimento_Estoque() { }
  
  @Test
  void deveGerar_Alertas() { }
  
  @Test
  void deveProcessar_CompraCompleta() { }
  
  @Test
  void deveGerar_Relatorio_Estoque() { }
}
```

---

## 7. Timeline

```
Dia 1 (desenvolvimento):
├─ INSUMO + PRODUTO_VENDA tables
├─ ESTOQUE_INSUMO + MOVIMENTO_ESTOQUE
├─ API endpoints 01-02-03

Dia 2:
├─ REQUISICAO_COMPRA + PEDIDO_COMPRA + NOTA_FISCAL
├─ API endpoints 04-05-06
├─ Alertas automáticas (scheduler)

Dia 3:
├─ Rastreamento uso (RF-07)
├─ Relatório estoque + export (RF-08)
├─ Tests (80%+ coverage)
├─ SonarQube gates
└─ Ready
```

---

**Status**: 🟢 PRONTO PARA DEV  
**RFs**: 8  
**Linhas Estimadas**: ~4000  
**Stack**: SpringBoot + React + PostgreSQL  
**Próxima**: SPEC-008 (Comunicação & Notificações)

