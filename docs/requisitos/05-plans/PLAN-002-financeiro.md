# PLAN-002 — Financeiro (Implementação Técnica)

> **Versão**: 1.0  
> **Data**: 3 de abril de 2026  
> **Baseado em**: SPEC-002-financeiro.md  
> **RFs Cobertas**: RF-FIN-01 a 09 (9 RFs)  
> **Rastreabilidade Explícita**: RF-FIN-01, RF-FIN-02, RF-FIN-03, RF-FIN-04, RF-FIN-05, RF-FIN-06, RF-FIN-07, RF-FIN-08, RF-FIN-09, RF-ACE-03  
> **Tempo Estimado**: 8 horas

---

## 1. Modelagem de Banco de Dados

### 1.1 Tabelas Principais

```sql
TABLE pagamento {
  pagamento_id BIGSERIAL PRIMARY KEY
  matricula_id BIGINT NOT NULL REFERENCES matricula(matricula_id)
  aluno_id BIGINT NOT NULL REFERENCES aluno(aluno_id)
  academia_id SMALLINT NOT NULL REFERENCES academia(academia_id)
  
  valor_original NUMERIC(10,2) NOT NULL
  valor_juros NUMERIC(10,2) DEFAULT 0.00
  valor_multa NUMERIC(10,2) DEFAULT 0.00
  valor_total NUMERIC(10,2) NOT NULL
  
  forma_pagamento ENUM('PIX', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'BOLETO', 'DINHEIRO') NOT NULL
  status_pagamento ENUM('PENDENTE', 'PROCESSANDO', 'APROVADO', 'RECUSADO', 'CANCELADO') DEFAULT 'PENDENTE'
  
  data_pagamento_esperada DATE NOT NULL
  data_pagamento_efetiva DATE
  data_confirmacao TIMESTAMP
  
  comprovante_path VARCHAR(500)
  observacoes TEXT
  
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  processado_por BIGINT REFERENCES usuario(usuario_id)
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  atualizado_por BIGINT REFERENCES usuario(usuario_id)
}

TABLE inadimplencia {
  inadimplencia_id BIGSERIAL PRIMARY KEY
  aluno_id BIGINT NOT NULL REFERENCES aluno(aluno_id) ON DELETE CASCADE
  academia_id SMALLINT NOT NULL REFERENCES academia(academia_id)
  
  valor_devido NUMERIC(12,2) NOT NULL
  valor_juros_acumulado NUMERIC(10,2) DEFAULT 0.00
  valor_multa_acumulada NUMERIC(10,2) DEFAULT 0.00
  
  data_vencimento_primeira_parcela DATE NOT NULL
  dias_atraso SMALLINT DEFAULT 0
  
  status ENUM('EM_DIA', 'ATRASADO', 'BLOQUEADO', 'QUITADO', 'CANCELADO') DEFAULT 'ATRASADO'
  data_bloqueio TIMESTAMP
  data_desbloqueio TIMESTAMP
  bloqueado_por BIGINT REFERENCES usuario(usuario_id)
  
  data_quitacao DATE
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
}

TABLE comissao_calculo {
  comissao_id BIGSERIAL PRIMARY KEY
  professor_id BIGINT NOT NULL REFERENCES usuario(usuario_id)
  academia_id SMALLINT NOT NULL REFERENCES academia(academia_id)
  
  periodo_mes DATE NOT NULL -- 1º dia do mês (ex: 2026-04-01)
  
  total_alunos_ativos SMALLINT NOT NULL
  valor_plano_medio NUMERIC(10,2) NOT NULL
  percentual_comissao NUMERIC(5,2) NOT NULL -- 15.00
  
  valor_total NUMERIC(12,2) NOT NULL
  
  status_calculo ENUM('CALCULADA', 'APROVADA', 'PAGA') DEFAULT 'CALCULADA'
  data_calculo TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  data_aprovacao TIMESTAMP
  data_pagamento TIMESTAMP
  
  aprovado_por BIGINT REFERENCES usuario(usuario_id)
  pago_por BIGINT REFERENCES usuario(usuario_id)
  
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  
  UNIQUE(professor_id, academia_id, periodo_mes)
}

TABLE comissao_pagamento {
  comissao_pagamento_id BIGSERIAL PRIMARY KEY
  comissao_id BIGINT NOT NULL REFERENCES comissao_calculo(comissao_id)
  
  data_pagamento DATE NOT NULL
  valor_pago NUMERIC(12,2) NOT NULL
  forma_pagamento ENUM('TRANSFERENCIA', 'CHEQUE', 'PIX') NOT NULL
  comprovante_path VARCHAR(500)
  
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  criado_por BIGINT REFERENCES usuario(usuario_id)
}

TABLE configuracao_financeira {
  config_id SMALLSERIAL PRIMARY KEY
  academia_id SMALLINT REFERENCES academia(academia_id) -- NULL = global
  
  taxa_juros_ao_dia NUMERIC(5, 3) DEFAULT 0.05 -- 0.05% ao dia = 1.5% ao mês
  taxa_multa_atraso NUMERIC(5, 2) DEFAULT 10.00 -- R$ 10,00 fixa
  percentual_multa_atraso NUMERIC(5, 2) DEFAULT 0 -- ou % do valor
  
  dias_carencia_bloqueio SMALLINT DEFAULT 3
  taxa_comissao_padrao NUMERIC(5, 2) DEFAULT 15.00 -- % para professores
  
  data_pagamento_professores SMALLINT DEFAULT 5 -- Dia do mês
  
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
}
```

### 1.2 VIEWs & Relatórios

```sql
-- View: Inadimplência Atual
CREATE VIEW inadimplencia_atual AS
SELECT 
  a.aluno_id,
  a.nome,
  a.cpf,
  ac.academia_id,
  ac.nome AS academia,
  i.valor_devido + i.valor_juros_acumulado + i.valor_multa_acumulada as valor_total,
  i.dias_atraso,
  i.status,
  m.data_vencimento
FROM inadimplencia i
JOIN aluno a ON i.aluno_id = a.aluno_id
JOIN academia ac ON i.academia_id = ac.academia_id
JOIN matricula m ON a.aluno_id = m.aluno_id AND i.academia_id = m.academia_id
WHERE i.status = 'ATRASADO' OR i.status = 'BLOQUEADO'
ORDER BY i.dias_atraso DESC;

-- View: Fluxo de Caixa Mensal
CREATE VIEW fluxo_caixa_mensal AS
SELECT 
  DATE_TRUNC('month', p.data_pagamento_efetiva::timestamp)::date as mes,
  ac.academia_id,
  ac.nome AS academia,
  COUNT(DISTINCT p.pagamento_id) as total_pagamentos,
  SUM(p.valor_total) FILTER (WHERE p.status_pagamento = 'APROVADO') as receita_total,
  SUM(p.valor_juros) FILTER (WHERE p.status_pagamento = 'APROVADO') as juros_total,
  COUNT(DISTINCT CASE WHEN p.status_pagamento = 'RECUSADO' THEN p.pagamento_id END) as pagamentos_recusados
FROM pagamento p
JOIN academia ac ON p.academia_id = ac.academia_id
WHERE p.data_pagamento_efetiva IS NOT NULL
GROUP BY DATE_TRUNC('month', p.data_pagamento_efetiva::timestamp), ac.academia_id, ac.nome;

-- View: Comissões Pendentes
CREATE VIEW comissoes_pendentes AS
SELECT 
  c.comissao_id,
  u.nome AS professor,
  ac.nome AS academia,
  c.periodo_mes,
  c.valor_total,
  c.status_calculo,
  c.data_calculo
FROM comissao_calculo c
JOIN usuario u ON c.professor_id = u.usuario_id
JOIN academia ac ON c.academia_id = ac.academia_id
WHERE c.status_calculo != 'PAGA'
ORDER BY c.data_calculo ASC;

-- View: Renda por Academia
CREATE VIEW renda_por_academia AS
SELECT 
  ac.academia_id,
  ac.nome,
  DATE_TRUNC('month', p.data_pagamento_efetiva)::date as mes,
  COUNT(DISTINCT p.pagamento_id) as total_transacoes,
  SUM(p.valor_original) FILTER (WHERE p.status_pagamento = 'APROVADO') as receita_base,
  SUM(p.valor_juros) FILTER (WHERE p.status_pagamento = 'APROVADO') as receita_juros,
  SUM(p.valor_total) FILTER (WHERE p.status_pagamento = 'APROVADO') as receita_total
FROM pagamento p
JOIN academia ac ON p.academia_id = ac.academia_id
WHERE p.data_pagamento_efetiva IS NOT NULL
GROUP BY ac.academia_id, ac.nome, DATE_TRUNC('month', p.data_pagamento_efetiva);

-- View: Alunos em Risco (frequência + inadimplência)
CREATE VIEW alunos_em_risco AS
SELECT 
  a.aluno_id,
  a.nome,
  COUNT(DISTINCT ra.registro_acesso_id) as frequencia_ultima_semana,
  CASE WHEN i.inadimplencia_id IS NOT NULL THEN TRUE ELSE FALSE END as tem_inadimplencia,
  i.dias_atraso,
  m.data_vencimento
FROM aluno a
LEFT JOIN registro_acesso ra ON a.aluno_id = ra.aluno_id 
  AND ra.data_hora_entrada >= CURRENT_DATE - INTERVAL '7 days'
LEFT JOIN inadimplencia i ON a.aluno_id = i.aluno_id AND i.status IN ('ATRASADO', 'BLOQUEADO')
LEFT JOIN matricula m ON a.aluno_id = m.aluno_id
GROUP BY a.aluno_id, a.nome, i.inadimplencia_id, i.dias_atraso, m.data_vencimento;
```

### 1.3 Triggers & Functions

```sql
-- Trigger: Atualizar inadimplência quando pagamento aprovado
CREATE OR REPLACE FUNCTION atualizar_inadimplencia_apos_pagamento()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status_pagamento = 'APROVADO' THEN
    -- Reduzir valor_devido da inadimplência
    UPDATE inadimplencia
    SET valor_devido = CASE 
      WHEN (valor_devido - NEW.valor_original) <= 0 THEN 0
      ELSE (valor_devido - NEW.valor_original)
    END,
    status = CASE
      WHEN (valor_devido - NEW.valor_original) <= 0 THEN 'QUITADO'
      ELSE status
    END,
    data_quitacao = CASE
      WHEN (valor_devido - NEW.valor_original) <= 0 THEN CURRENT_DATE
      ELSE data_quitacao
    END
    WHERE aluno_id = NEW.aluno_id AND academia_id = NEW.academia_id;
    
    -- Desbloquear acesso se quitado
    DELETE FROM bloqueio_acesso
    WHERE aluno_id = NEW.aluno_id 
    AND academia_id = NEW.academia_id
    AND motivo = 'INADIMPLENCIA'
    AND (SELECT valor_devido FROM inadimplencia 
         WHERE aluno_id = NEW.aluno_id AND academia_id = NEW.academia_id) <= 0;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_pagamento_aprovado
AFTER UPDATE ON pagamento
FOR EACH ROW
WHEN (OLD.status_pagamento IS DISTINCT FROM NEW.status_pagamento)
EXECUTE FUNCTION atualizar_inadimplencia_apos_pagamento();

-- Function: Calcular juros ao dia
CREATE OR REPLACE FUNCTION calcular_juros_automatico()
RETURNS void AS $$
BEGIN
  UPDATE pagamento
  SET valor_juros = CASE
    WHEN status_pagamento = 'PENDENTE' 
    AND data_pagamento_efetiva IS NULL
    AND (CURRENT_DATE - data_pagamento_esperada) > 0
    THEN valor_original * ((CURRENT_DATE - data_pagamento_esperada) * 0.0005)
    ELSE valor_juros
  END,
  valor_total = valor_original + CASE
    WHEN status_pagamento = 'PENDENTE' 
    AND data_pagamento_efetiva IS NULL
    AND (CURRENT_DATE - data_pagamento_esperada) > 0
    THEN (valor_original * ((CURRENT_DATE - data_pagamento_esperada) * 0.0005))
    ELSE valor_juros
  END
  WHERE status_pagamento = 'PENDENTE'
  AND data_pagamento_efetiva IS NULL;
  
  -- Atualizar status de indefinência quando dias_atraso >= carência
  UPDATE inadimplencia
  SET status = 'BLOQUEADO',
      data_bloqueio = CURRENT_TIMESTAMP
  WHERE status = 'ATRASADO'
  AND dias_atraso >= (SELECT dias_carencia_bloqueio FROM configuracao_financeira LIMIT 1)
  AND data_bloqueio IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Scheduler: Executar diariamente (usar pg_cron ou application schedule)
-- SELECT cron.schedule('calcular-juros-diarios', '0 0 * * *', 'SELECT calcular_juros_automatico()');

-- Function: Calcular comissões mensais do professor
CREATE OR REPLACE FUNCTION calcular_comissoes_mensais(p_mes DATE)
RETURNS void AS $$
DECLARE
  v_professor CURSOR FOR
    SELECT DISTINCT professor_id, academia_id 
    FROM usuario_papel_academia 
    WHERE papel_id = (SELECT papel_id FROM papel WHERE nome = 'PROFESSOR')
    AND ativo = TRUE;
  v_professor_rec RECORD;
  v_alunos_ativos SMALLINT;
  v_vla_medio NUMERIC(10,2);
  v_percentual NUMERIC(5,2);
  v_comissao NUMERIC(12,2);
BEGIN
  FOR v_professor_rec IN v_professor LOOP
    -- Contar alunos ativos deste professor nesta academia
    SELECT COUNT(DISTINCT a.aluno_id)
    INTO v_alunos_ativos
    FROM matricula m
    JOIN aluno a ON m.aluno_id = a.aluno_id
    WHERE m.academia_id = v_professor_rec.academia_id
    AND m.status = 'ATIVA'
    AND m.professor_id = v_professor_rec.professor_id; -- Assumir coluna professor_id em matricula
    
    -- Calcular VLA médio
    SELECT ROUND(AVG(p.preco_mensal) / 30, 2)
    INTO v_vla_medio
    FROM matricula m
    JOIN plano p ON m.plano_id = p.plano_id
    WHERE m.academia_id = v_professor_rec.academia_id
    AND m.status = 'ATIVA';
    
    -- Buscar % customizado ou usar padrão
    SELECT taxa_comissao_padrao INTO v_percentual 
    FROM configuracao_financeira 
    WHERE academia_id = v_professor_rec.academia_id;
    
    IF v_percentual IS NULL THEN
      SELECT taxa_comissao_padrao INTO v_percentual 
      FROM configuracao_financeira WHERE academia_id IS NULL;
    END IF;
    
    v_comissao := v_alunos_ativos * v_vla_medio * (v_percentual / 100.0);
    
    -- Inserir ou atualizar cálculo
    INSERT INTO comissao_calculo(
      professor_id, academia_id, periodo_mes, 
      total_alunos_ativos, valor_plano_medio, percentual_comissao, 
      valor_total, status_calculo
    )
    VALUES(
      v_professor_rec.professor_id, v_professor_rec.academia_id, p_mes,
      v_alunos_ativos, v_vla_medio, v_percentual,
      v_comissao, 'CALCULADA'
    )
    ON CONFLICT(professor_id, academia_id, periodo_mes)
    DO UPDATE SET
      total_alunos_ativos = v_alunos_ativos,
      valor_plano_medio = v_vla_medio,
      valor_total = v_comissao,
      atualizado_em = CURRENT_TIMESTAMP;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Scheduler: Executar no 5º dia de cada mês
-- SELECT cron.schedule('calcular-comissoes', '0 0 5 * *', 'SELECT calcular_comissoes_mensais(CURRENT_DATE)');
```

### 1.4 Migrations

```
V017__criar_tabela_pagamento.sql
V018__criar_tabela_inadimplencia.sql
V019__criar_tabela_comissao_calculo.sql
V020__criar_tabela_comissao_pagamento.sql
V021__criar_tabela_configuracao_financeira.sql
V022__criar_views_financeiras.sql
V023__criar_functions_financeiras.sql
V024__criar_triggers_financeiras.sql
```

---

## 2. API REST (18 Endpoints)

```
POST   /api/pagamentos (Criar pagamento)
GET    /api/pagamentos (Listar pagamentos)
PUT    /api/pagamentos/{id} (Atualizar status)
DELETE /api/pagamentos/{id} (Cancelar)
GET    /api/pagamentos/{id}/comprovante (Download comprovante)

GET    /api/inadimplencia (Lista completa)
GET    /api/inadimplencia/alunos-em-risco (Análise)
GET    /api/inadimplencia/{aluno_id} (Detalhes por aluno)
POST   /api/inadimplencia/{id}/reverter (Quitar atraso)

GET    /api/professores/{id}/comissao (Comissão prevista)
GET    /api/comissoes/mensal?mes=04-2026 (Comissões do mês)
POST   /api/comissoes/{id}/aprovar
POST   /api/comissoes/{id}/pagar
GET    /api/comissoes/historico/{professor_id}

GET    /api/financeiro/dashboard (KPIs)
GET    /api/financeiro/fluxo-caixa (Fluxo mensal)
GET    /api/financeiro/export?format=pdf
POST   /api/financeiro/backup-dados
```

---

## 3. React Components

```
FinanceiroPage.jsx
├─ RegistroPagamentoForm
├─ InadimplenciaTable
├─ ComissoesTable
├─ DashboardFinanceiro (gráficos receita × despesa)
└─ ExportFinanceiroModal

PagamentosPage.jsx (CRUD pagamentos)
InadimplenciaPage.jsx
ComissoesPage.jsx
```

---

## 4. Security

- Acesso: PROPRIETARIO + COORDENADOR
- Professores: Apenas visualizam próprias comissões
- Auditoria completa de mudanças

---

## 5. Critérios de Aceição

```
✅ Database
  ☑ 5 tabelas + 5 VIEWs
  ☑ 4 functions (juros, comissão, etc)
  ☑ 2 triggers (pagamento, inadimplencia)
  ☑ 8 migrations

✅ API
  ☑ 18 endpoints documentados
  ☑ Cálculos automáticos (juros, comissão)
  ☑ Validações de valores
  ☑ Rastreabilidade completa

✅ React
  ☑ 5 componentes de página
  ☑ Formulários + tabelas + gráficos
  ☑ Export PDF/Excel

✅ Business Rules
  ☑ Juros calculados ao dia (0.05% = 1.5%/mês)
  ☑ Multa fixa R$10 ou %
  ☑ Carência de 3 dias → bloqueio
  ☑ Comissão = Alunos × VLA × % (automática 5º dia)
```

---

**Tempo Estimado**: 8 horas  
**Status**: 📋 Pronto para desenvolvimento
