# PLAN-007 — Insumos & Produtos (Implementação Técnica)

> **Versão**: 1.0  
> **Data**: 3 de abril de 2026  
> **Baseado em**: SPEC-007-insumos-produtos.md  
> **RFs Cobertas**: RF-INSUMO-01 a 08 (8 RFs)  
> **Tempo Estimado**: 6 horas

---

## 1. Tabelas Principais

```sql
TABLE categoria_produto {
  categoria_id SMALLSERIAL PRIMARY KEY
  nome VARCHAR(100) NOT NULL UNIQUE
  descricao TEXT
  ativo BOOLEAN DEFAULT TRUE
}

TABLE produto {
  produto_id BIGSERIAL PRIMARY KEY
  categoria_id SMALLINT NOT NULL REFERENCES categoria_produto(categoria_id)
  academia_id SMALLINT REFERENCES academia(academia_id) -- NULL = depósito central
  
  nome VARCHAR(150) NOT NULL
  descricao TEXT
  codigo_barras VARCHAR(50) UNIQUE
  
  quantidade_estoque SMALLINT DEFAULT 0
  quantidade_minima SMALLINT DEFAULT 10
  quantidade_maxima SMALLINT DEFAULT 100
  
  preco_custo NUMERIC(10,2)
  preco_venda NUMERIC(10,2)
  
  data_validade DATE
  data_aquisicao DATE
  
  status ENUM('ATIVO', 'ESGOTADO', 'DESCONTINUADO') DEFAULT 'ATIVO'
  
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
}

TABLE movimentacao_estoque {
  movimentacao_id BIGSERIAL PRIMARY KEY
  produto_id BIGINT NOT NULL REFERENCES produto(produto_id)
  
  tipo_movimento ENUM('ENTRADA', 'SAÍDA', 'DEVOLUÇÃO', 'AJUSTE') NOT NULL
  quantidade SMALLINT NOT NULL
  
  data_movimento TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  responsavel_id BIGINT NOT NULL REFERENCES usuario(usuario_id)
  
  motivo_descricao TEXT
  documento_referencia VARCHAR(50) -- NF, recebimento, etc
  
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
}

TABLE alerta_validade {
  alerta_id BIGSERIAL PRIMARY KEY
  produto_id BIGINT NOT NULL REFERENCES produto(produto_id)
  
  data_vencimento DATE NOT NULL
  dias_antecedencia SMALLINT DEFAULT 30 -- Alertar 30 dias antes
  
  alerta_enviado BOOLEAN DEFAULT FALSE
  data_alerta TIMESTAMP
  
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
}

TABLE requisicao_compra {
  requisicao_id BIGSERIAL PRIMARY KEY
  academia_id SMALLINT NOT NULL REFERENCES academia(academia_id)
  
  data_requisicao DATE DEFAULT CURRENT_DATE
  status ENUM('RASCUNHO', 'ENVIADA', 'APROVADA', 'RECEBIDA') DEFAULT 'RASCUNHO'
  
  valor_total NUMERIC(12,2)
  data_prevista_entrega DATE
  data_entrega_real DATE
  
  observacoes TEXT
  
  solicitado_por BIGINT NOT NULL REFERENCES usuario(usuario_id)
  aprovado_por BIGINT REFERENCES usuario(usuario_id)
  
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
}

TABLE item_requisicao {
  item_id BIGSERIAL PRIMARY KEY
  requisicao_id BIGINT NOT NULL REFERENCES requisicao_compra(requisicao_compra_id) ON DELETE CASCADE
  produto_id BIGINT NOT NULL REFERENCES produto(produto_id)
  
  quantidade_solicitada SMALLINT NOT NULL
  quantidade_recebida SMALLINT DEFAULT 0
  preco_unitario NUMERIC(10,2)
  
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
}
```

---

## 2. API REST (14 Endpoints)

```
GET    /api/produtos (Inventário)
POST   /api/produtos (Adicionar)
PUT    /api/produtos/{id} (Atualizar)

POST   /api/movimentacoes (Entrada/Saída)
GET    /api/movimentacoes?produto_id=X&mes=04 (Histórico)

GET    /api/alertas/validades (Próximos a vencer)
GET    /api/alertas/estoque-baixo (Abaixo da quantidade mínima)

GET    /api/requisicoes (Listar)
POST   /api/requisicoes (Criar requisição)
PUT    /api/requisicoes/{id} (Editar)
POST   /api/requisicoes/{id}/aprovar (Aprovar)

GET    /api/relatorios/estoque-valor (Valor total em estoque)
GET    /api/relatorios/rotatividade (Produtos mais movimentados)
```

---

## 3. React Components

```jsx
// EstoqueInventario.jsx, MovimentacaoForm.jsx, AlertasValidade.jsx
, RequisicaoCompraForm.jsx
```

---

**Tempo Estimado**: 6 horas
