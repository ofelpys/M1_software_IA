# DUV Resolutions — Decisões Finais

> **Data Resolução**: 2 de abril de 2026, 15:00 UTC  
> **Proprietário**: Jonathan Rodrigues Barbosa  
> **Status**: ✅ TODAS RESOLVIDAS

---

## 📋 Decisões Finais por DUV

### ✅ DUV-02: Interface — PC vs Celular?

**DECISÃO FINAL**: PC (Desktop)  
**Data Resolução**: 2 de abril de 2026

```
Justificativa: Professor utiliza PC na sala de aula
├─ Desktop fixo disponível
├─ Não precisa carregar dispositivo
└─ Interface pode ser mais complexa/dados-rich
```

**Impacto nos Arquivos**:

| Documento | Mudança | Status |
|-----------|---------|--------|
| [Guia de Padrões](guia-padroes-codigo-convencoes.md) | Frontend pode ter UI mais complexa (teclado+mouse) | ✅ Aprovado |
| Frontend Components | React components não precisa ser mobile-first | ✅ Design adptado |
| ROP-02 ("3-click check-in") | Ainda válido (3 clicks no desktop) | ✅ OK |
| RNF-01 ("Interface simples") | Simples para PROFESSOR usar, não aluno | ✅ OK |

**RFs Afetados**:
- RF-PROF-01: Check-in pelo professor ✅
- RF-PROF-02: Visualizar alunos ✅
- ROP-02: 3 clicks para check-in ✅

**Technical Stack Decision**:
```
Frontend:
├─ React 18+ (desktop-optimized)
├─ Material-UI ou Ant Design (desktop components)
├─ Full keyboard+mouse support
├─ Resolução: 1280x720 minimum
└─ NOT mobile-responsive (not required)

Backend:
├─ Same API GraphQL/REST
└─ Respostas podem ter mais dados

Database:
└─ No changes
```

---

### ✅ DUV-03: Modelo de Comissão — POR ALUNO

**DECISÃO FINAL**: Comissão Mensalmente por Aluno Ativo  
**Data Resolução**: 2 de abril de 2026

```
Modelo: Professor recebe % do valor do plano × número de alunos ativos/mês

Fórmula:
┌─────────────────────────────────────┐
│ Comissão = Alunos_Ativos × VLA × %  │
│                                       │
│ VLA = Valor do Plano / 30 dias       │
│ % = Percentual de comissão (a definir)
│                                       │
│ Ex: 20 alunos × R$500/30 × 15%       │
│   = 20 × 16,67 × 0,15                │
│   = R$50/dia × 30 dias               │
│   = R$1.500/mês                      │
└─────────────────────────────────────┘
```

**Impacto nos Arquivos**:

| Documento | Mudança | Status |
|-----------|---------|--------|
| [Modelo Dados](../02-mapa/modelo-dados-conceitual.md) | Schema COMISSAO_CALCULO atualizado | ⏳ PRECISA ATUALIZAR |
| [Matriz Rastreabilidade](../02-mapa/matriz-rastreabilidade.md) | RF-PROF-04,05,07 agora desbloqueados | ⏳ ATUALIZAR marca |
| [RNFs Detalhados](../02-mapa/requisitos-nao-funcionais-detalhados.md) | Cálculo de comissão agora definido | ✅ OK |
| Backend Logic | Implementar cálculo Alunos × VLA × % | ⏳ DEV TASK |
| Tests | Cobertura para comissão calculations | ⏳ DEV TASK |

**RFs Desbloqueados** (eram bloqueados por DUV-03):
- ✅ RF-PROF-04: Calcular comissão mensal
- ✅ RF-PROF-05: Consultar comissão professor
- ✅ RF-PROF-07: Gerar recibo comissão
- ✅ RF-FIN-09: Dashboard comissões a pagar
- ✅ RF-REL-07: Relatório histórico comissões

**Database Schema Impact**:

```sql
-- Config parametro (NEW)
INSERT INTO CONFIG_PARAMETRO (chave, valor, descricao)
VALUES ('comissao_modelo', 'por_aluno_mensal', 'Modelo de comissionamento');
VALUES ('comissao_percentual', '15.00', 'Percentual padrão (pode variar por prof)');
VALUES ('comissao_dia_pagamento', '5', 'Dia do mês para calcular/pagar');

-- Comissao calculo (tabela)
CREATE TABLE COMISSAO_CALCULO (
    comissao_id BIGSERIAL PRIMARY KEY,
    professor_id INTEGER NOT NULL REFERENCES PROFESSOR(professor_id),
    academia_id SMALLINT NOT NULL,
    periodo_mes DATE NOT NULL,  -- ex: 2026-04-01
    
    -- Dados
    total_alunos_ativos INTEGER NOT NULL,
    valor_plano_medio NUMERIC(10,2) NOT NULL,
    percentual_comissao NUMERIC(5,2) NOT NULL,  -- 15.00
    
    -- Cálculo
    valor_total NUMERIC(12,2) NOT NULL,
    
    -- Status
    status_calculo ENUM('CALCULADA', 'APROVADA', 'PAGA') DEFAULT 'CALCULADA',
    data_calculo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_pagamento TIMESTAMP,
    
    -- Auditoria
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(professor_id, academia_id, periodo_mes)
);

-- Trigger automático para recalcular quando:
-- 1. Aluno ativo vira inativo
-- 2. Aluno inativo vira ativo
-- 3. Plano de aluno muda
```

**Business Rules**:
```
1. Aluno só conta se status = ATIVO
2. Calcula no 5º dia do mês (configurável)
3. VLA = valor plano / 30 dias
4. Percentual é configurável por professor
5. Histórico completo em AUDITORIA_LOG
6. Trigger recalcula se aluno mudar status
7. Pode ter reajuste retroativamente
```

**Technical Stack**:
```
Backend:
├─ Java calculation logic em ComissaoService
├─ Scheduled job (Spring @Scheduled) job dia 5/mês
├─ Transactional para consistency
└─ @Aspect para auditoria LOG

Frontend:
├─ Mostrar comissão mensal por professor
├─ Dashboard: "Comissões a pagar"
├─ Relatório: histórico 12 meses
└─ Exportar Excel para contabilidade

Database:
└─ Indexes: (professor_id, periodo_mes), (status_calculo)
```

---

### ✅ DUV-04: Cônjuges — NÃO Compartilham Acesso

**DECISÃO FINAL**: Cada Pessoa = Usuário Separado  
**Data Resolução**: 2 de abril de 2026

```
Modelo: Propriedade pode ter múltiplos PROPRIETARIO
├─ João = PROPRIETARIO (acesso full)
├─ Maria = PROPRIETARIO (acesso full, separadamente)
└─ Cada um loga com própria senha
    ├─ Auditoria rastreia quem fez quê
    └─ Compliant com LGPD (consentimento individual)
```

**Impacto nos Arquivos**:

| Documento | Mudança | Status |
|-----------|---------|--------|
| [Modelo Dados](../02-mapa/modelo-dados-conceitual.md) | USUARIO table = múltiplos PROPRIETARIO permitido | ✅ JÁ DESENHADO |
| [RNF-04 (Auditoria)](../02-mapa/requisitos-nao-funcionais-detalhados.md) | Cada login deixa rastro de quem é | ✅ OK |
| CONTRIB.md | Code Review deve validar table structure | ✅ OK |

**Database Impact**:

```sql
-- USUARIO table (já desenhado assim)
CREATE TABLE USUARIO (
    usuario_id SERIAL PRIMARY KEY,
    academia_id SMALLINT,  -- NULL = acesso total (proprietário)
    nome VARCHAR(255) NOT NULL,
    cpf CHAR(11) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,  -- bcrypt
    role ENUM('PROPRIETARIO', 'COORDENADOR', 'PROFESSOR', 'RECEPCIONISTA'),
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AUDITORIA_LOG (rastreia tudo)
CREATE TABLE AUDITORIA_LOG (
    log_id BIGSERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES USUARIO(usuario_id),
    tabela_modificada VARCHAR(255),
    operacao ENUM('INSERT', 'UPDATE', 'DELETE'),
    registro_id VARCHAR(255),
    valores_antes JSONB,
    valores_depois JSONB,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET
);

-- Quando João faz mudança:
INSERT INTO AUDITORIA_LOG (...) 
VALUES (usuario_id=João, tabela='MATRICULA', operacao='UPDATE', ...)

-- Quando Maria faz mudança (mesma academia):
INSERT INTO AUDITORIA_LOG (...) 
VALUES (usuario_id=Maria, tabela='MATRICULA', operacao='UPDATE', ...)
```

**RFs Afetados**: Nenhum bloqueador removido  
**RNF Afetada**: RNF-04 (Auditoria) ✅ aprovado

---

### ✅ DUV-06: Dias de Carência — 3 DIAS

**DECISÃO FINAL**: 3 Dias Corridos Após Vencimento  
**Data Resolução**: 2 de abril de 2026

```
Timeline:
┌─────────────────────────────────────┐
│ 4 mai (quinta): Vencimento          │
│ └─ Check-in PERMITIDO ainda         │
│                                      │
│ 5 mai (sexta): +1 dia carência      │
│ └─ Check-in PERMITIDO               │
│                                      │
│ 6 mai (sábado): +2 dias carência    │
│ └─ Check-in PERMITIDO               │
│                                      │
│ 7 mai (domingo): +3 dias carência   │
│ └─ Check-in PERMITIDO               │
│                                      │
│ 8 mai (segunda): Carência ESGOTADA  │
│ └─ ❌ Check-in BLOQUEADO até pagar  │
└─────────────────────────────────────┘
```

**Impacto nos Arquivos**:

| Documento | Mudança | Status |
|-----------|---------|--------|
| [Modelo Dados](../02-mapa/modelo-dados-conceitual.md) | CONFIG_PARAMETRO.dias_carencia = 3 | ✅ UPDATE |
| [RNFs Detalhados](../02-mapa/requisitos-nao-funcionais-detalhados.md) | RNF-05 (rentabilidade) definido | ✅ OK |
| RF-ACE-03 | "Bloquear alunos inadimplentes" agora claro | ✅ Desbloqueado |

**Database Impact**:

```sql
-- CONFIG_PARAMETRO
INSERT INTO CONFIG_PARAMETRO (chave, valor, descricao, tipo)
VALUES (
    'dias_carencia_vencimento',
    '3',
    'Dias permitidos para frequentar após vencimento',
    'INTEGER'
);

-- Trigger BEFORE INSERT/UPDATE na CHECKIN_LOG
CREATE TRIGGER TRG_CHECKIN_VALIDAR_BLOQUEIO BEFORE INSERT ON CHECKIN_LOG
FOR EACH ROW
EXECUTE FUNCTION fn_validar_bloqueio_matricula();

-- Função PostgreSQL
CREATE OR REPLACE FUNCTION fn_validar_bloqueio_matricula()
RETURNS TRIGGER AS $$
DECLARE
    v_dias_carencia INTEGER;
    v_dias_atraso INTEGER;
    v_status_matricula VARCHAR;
BEGIN
    -- Buscar dias carência
    SELECT valor::INTEGER INTO v_dias_carencia
    FROM CONFIG_PARAMETRO WHERE chave = 'dias_carencia_vencimento';
    
    -- Buscar ultima matricula aluno
    SELECT m.status_pagamento, 
           EXTRACT(DAY FROM CURRENT_DATE - m.data_vencimento)::INTEGER
    INTO v_status_matricula, v_dias_atraso
    FROM MATRICULA m
    WHERE m.aluno_id = NEW.aluno_id
    ORDER BY m.data_matricula DESC LIMIT 1;
    
    -- Validar bloqueio
    IF v_dias_atraso > v_dias_carencia AND v_status_matricula = 'INADIMPLENTE' THEN
        INSERT INTO MATRICULA_BLOQUEIO (...)
        VALUES (NEW.aluno_id, 'CARENCIA_ESGOTADA', CURRENT_TIMESTAMP);
        
        RAISE EXCEPTION 'Aluno bloqueado: carência esgotada após % dias', v_dias_carencia;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**RFs Desbloqueados**:
- ✅ RF-ACE-03: Bloquear acesso alunos inadimplentes
- ✅ Dashboard "Inadimplência real-time" possível

---

### ✅ DUV-07: Vender Produtos — SIM!

**DECISÃO FINAL**: Vender 2 Produtos Iniciais  
**Data Resolução**: 2 de abril de 2026

```
Catálogo Inicial:

┌─────────────────────────────────┐
│ Whey Protein 1kg                │
│ Quantidade: 1kg                 │
│ Preço: R$ 160,00                │
│ Margem sugerida: 15-20%          │
│ Custo estimado: R$ 128-136       │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Creatina 250g                   │
│ Quantidade: 250g                │
│ Preço: R$ 49,99                 │
│ Margem sugerida: 10-15%          │
│ Custo estimado: R$ 42-44         │
└─────────────────────────────────┘
```

**Impacto nos Arquivos**:

| Documento | Mudança | Status |
|-----------|---------|--------|
| [Modelo Dados](../02-mapa/modelo-dados-conceitual.md) | **NOVO**: PRODUTO table | ⏳ ADICIONAR |
| [Matriz Rastreabilidade](../02-mapa/matriz-rastreabilidade.md) | **NOVO**: RF-PROD-01..05 | ⏳ ADICIONAR |
| [RNFs Detalhados](../02-mapa/requisitos-nao-funcionais-detalhados.md) | **NOVO**: RNF específicas para shop | ⏳ ADICIONAR |
| [Guia de Padrões](guia-padroes-codigo-convencoes.md) | OK (inclui e-commerce patterns) | ✅ OK |

**Database Schema (NOVO)**:

```sql
-- PRODUTO
CREATE TABLE PRODUTO (
    produto_id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    sku VARCHAR(50) UNIQUE NOT NULL,  -- EAN/barcode
    categoria VARCHAR(100),  -- 'whey protein', 'creatina', etc
    preco_venda NUMERIC(10,2) NOT NULL,
    preco_custo NUMERIC(10,2),
    estoque_atual INTEGER DEFAULT 0,
    estoque_minimo INTEGER DEFAULT 5,
    unidade VARCHAR(20),  -- '1kg', '250g', 'unidade'
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PEDIDO_PRODUTO (aluno compra)
CREATE TABLE PEDIDO_PRODUTO (
    pedido_id BIGSERIAL PRIMARY KEY,
    aluno_id INTEGER NOT NULL REFERENCES ALUNO(aluno_id),
    academia_id SMALLINT NOT NULL,
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('PENDENTE', 'PROCESSANDO', 'ENVIADO', 'ENTREGUE', 'CANCELADO'),
    valor_total NUMERIC(12,2) NOT NULL,
    forma_pagamento VARCHAR(50),  -- 'cartao', 'pix', 'boleto'
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PEDIDO_ITEM (itens do pedido)
CREATE TABLE PEDIDO_ITEM (
    item_id BIGSERIAL PRIMARY KEY,
    pedido_id BIGINT NOT NULL REFERENCES PEDIDO_PRODUTO(pedido_id),
    produto_id INTEGER NOT NULL REFERENCES PRODUTO(produto_id),
    quantidade INTEGER NOT NULL,
    preco_unitario NUMERIC(10,2) NOT NULL,
    subtotal NUMERIC(12,2) NOT NULL
);

-- MOVIMENTACAO_ESTOQUE
CREATE TABLE MOVIMENTACAO_ESTOQUE (
    movimentacao_id BIGSERIAL PRIMARY KEY,
    produto_id INTEGER NOT NULL REFERENCES PRODUTO(produto_id),
    tipo ENUM('ENTRADA', 'SAIDA', 'DEVOLUCAO'),
    quantidade INTEGER NOT NULL,
    motivo VARCHAR(255),
    data_movimentacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DADOS INICIAIS
INSERT INTO PRODUTO (nome, descricao, sku, categoria, preco_venda, preco_custo, unidade, estoque_atual)
VALUES 
    ('Whey Protein 1kg', 'Whey Protein concentrado sabor baunilha', 'WHEY-1KG', 'proteina', 160.00, 130.00, '1kg', 10),
    ('Creatina 250g', 'Creatina monohidratada 250g pura', 'CREAT-250G', 'creatina', 49.99, 42.00, '250g', 20);
```

**RFs Novos** (a adicionar controle de requisitos):

```
RF-PROD-01: Listar produtos disponíveis no shop
RF-PROD-02: Buscar produto por nome/categoria
RF-PROD-03: Visualizar detalhes produto (preço, descrição)
RF-PROD-04: Adicionar produto ao carrinho
RF-PROD-05: Finalizar compra com pagamento integrado
RF-PROD-06: Rastrear pedido (status)
RF-PROD-07: Histórico de compras (aluno)
RF-PROD-08: Gerenciamento estoque (admin)
```

**Frontend Features (NOVO)**:

```
├─ Shop/Loja page
│  ├─ Grid de produtos com imagens
│  ├─ Filtro por categoria (whey, creatina, etc)
│  ├─ Carrinho de compras
│  └─ Checkout (pagamento)
│
├─ Integração pagamento
│  ├─ Stripe/PayPal (cartao)
│  ├─ PIX (código QR)
│  └─ Boleto (Bradesco)
│
└─ Histórico pedidos (aluno dashboard)
```

**Backend Services (NOVO)**:

```
┌─ ProdutoService
├─ PedidoProdutoService
├─ EstoqueService
├─ PagamentoService (integração)
└─ NotificacaoService (SMS/email pedido confirmado)
```

**Stack Requirement**:

```
Payment Gateway:
├─ Stripe API (cartão)
├─ PIX integração (Bradesco/Banco do Brasil)
└─ Boleto (Gerencianet/Wirecard)

Security:
├─ PCI DSS compliance se processarmos cartão
├─ Ou usar tokenização (RECOMENDADO)
└─ Nunca guardar dados cartão em BD

Timeline:
└─ Fase 2/3 (tem que finalizar SPECs core primeiro)
```

**Classificação**: ⏳ Phase 2-3 (nice-to-have, não bloqueia MVP)

---

## 📊 Status Final das DUVs

| DUV | Questão | Resolução | Bloqueador? | Status |
|-----|---------|-----------|-----------|--------|
| **DUV-02** | PC ou Celular? | PC/Desktop | RF-PROF-01,02 | ✅ RESOLVIDA |
| **DUV-03** | Comissão modelo? | Por aluno mensal | RF-PROF-04,05,07,FIN-09,REL-07 | ✅ RESOLVIDA |
| **DUV-04** | Cônjuges compartilham? | Não (usuários separados) | RNF-04 (auditoria) | ✅ RESOLVIDA |
| **DUV-06** | Dias carência? | 3 dias | RF-ACE-03 | ✅ RESOLVIDA |
| **DUV-07** | Vender produtos? | SIM: Whey + Creatina | Phase 2/3 | ✅ RESOLVIDA |

---

## 🚀 Próximas Ações

### Imediato ✅

```
1. SPEC-001 pode começar AGORA
   ├─ 15 RFs (cadastro + acesso) = 100% desbloqueados
   ├─ Glossário pronto
   ├─ Matriz pronto
   └─ Prazo: 2 dias
   
2. SPEC-002 pode começar AGORA
   ├─ 9 RFs (financeiro) = 100% desbloqueados
   │  (era bloqueado por DUV-03, agora resolvido)
   ├─ Includes: Comissão, Pagamentos, Inadimplência
   └─ Prazo: 3 dias

3. SPEC-003 pode começar AGORA
   ├─ 9 RFs (relatórios) = 100% desbloqueados
   │  (era bloqueado por DUV-03, agora resolvido)
   ├─ Includes: Comissão reports, KPIs
   └─ Prazo: 3 dias
```

### Curto Prazo ⏳

```
4. SPEC-004 a SPEC-008
   ├─ Outros módulos (avaliação, equipamento, etc)
   └─ Prazo: Após SPECs 1-3

5. RF-PROD-01..08 (Novos produtos)
   ├─ Adicionar matriz rastreabilidade
   ├─ Adicionar RNFs para e-commerce
   └─ Prazo: Phase 2-3 (após MVP core)
```

### Modelo de Dados — REQUISITA ATUALIZAÇÃO ⏳

```
Arquivos a atualizar:
├─ [modelo-dados-conceitual.md](../02-mapa/modelo-dados-conceitual.md)
│  └─ Adicionar: PRODUTO, PEDIDO_PRODUTO, PEDIDO_ITEM, MOVIMENTACAO_ESTOQUE
│
├─ [matriz-rastreabilidade.md](../02-mapa/matriz-rastreabilidade.md)
│  ├─ Marcar RF-PROF-04,05,07,FIN-09,REL-07 como DESBLOQUEADO
│  └─ Adicionar RF-PROD-01..08 (novo módulo)
│
└─ [requisitos-nao-funcionais-detalhados.md](../02-mapa/requisitos-nao-funcionais-detalhados.md)
   └─ Adicionar RNFs para payment + e-commerce (PCI, integração)
```

---

## 📝 Rastreamento de Mudanças

| Data | DUV | Resolução | Quem | Status |
|------|-----|-----------|------|--------|
| 2026-04-02 | DUV-02 | PC/Desktop | Jonathan | ✅ Decidido |
| 2026-04-02 | DUV-03 | Por aluno mensal | Jonathan | ✅ Decidido |
| 2026-04-02 | DUV-04 | Usuários separados | Jonathan | ✅ Decidido |
| 2026-04-02 | DUV-06 | 3 dias carência | Jonathan | ✅ Decidido |
| 2026-04-02 | DUV-07 | Whey 1kg + Creatina 250g | Jonathan | ✅ Decidido |

**Observações**:
- Todas decisões confirmadas e alinhadas
- Nenhum bloqueador restante para SPECs 1-3
- Projeto está 100% apto para começar desenvolvimento
- Product features (DUV-07) podem ser refinadas em Phase 2

---

**Documento assinado digitalmente por**: Jonathan Rodrigues Barbosa  
**Data de Vigência**: 2 de abril de 2026  
**Próxima Review**: Após finalização de SPEC-001

