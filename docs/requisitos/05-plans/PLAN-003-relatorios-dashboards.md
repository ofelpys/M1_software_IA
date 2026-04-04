# PLAN-003 — Relatórios & Dashboards (Implementação Técnica)

> **Versão**: 1.0  
> **Data**: 3 de abril de 2026  
> **Baseado em**: SPEC-003-relatorios-dashboards.md  
> **RFs Cobertas**: RF-REL-01 a 09 (9 RFs)  
> **Rastreabilidade Explícita**: RF-REL-01, RF-REL-02, RF-REL-03, RF-REL-04, RF-REL-05, RF-REL-06, RF-REL-07, RF-REL-08, RF-REL-09  
> **Tempo Estimado**: 6 horas

---

## 1. VIEWs Agregadas (Relatórios)

```sql
-- Dashboard KPIs (Tempo real)
CREATE VIEW dashboard_kpis AS
SELECT 
  COUNT(DISTINCT a.aluno_id) as total_alunos,
  COUNT(DISTINCT CASE WHEN m.status='ATIVA' THEN a.aluno_id END) as alunos_ativos,
  COUNT(DISTINCT CASE WHEN m.status='BLOQUEADA_INADIMPLENCIA' THEN a.aluno_id END) as alunos_bloqueados,
  COUNT(DISTINCT CASE WHEN i.status='ATRASADO' THEN a.aluno_id END) as alunos_inadimplentes,
  SUM(p.valor_total) FILTER (WHERE p.status_pagamento = 'APROVADO' AND DATE_TRUNC('month', p.data_pagamento_efetiva) = DATE_TRUNC('month', CURRENT_DATE)) as receita_mes,
  COUNT(DISTINCT ba.aluno_id) as alunos_com_bloqueio_ativo
FROM aluno a
LEFT JOIN matricula m ON a.aluno_id = m.aluno_id
LEFT JOIN pagamento p ON a.aluno_id = p.aluno_id
LEFT JOIN inadimplencia i ON a.aluno_id = i.aluno_id
LEFT JOIN bloqueio_acesso ba ON a.aluno_id = ba.aluno_id AND ba.ativo = TRUE;

-- Relatório: Frequência de Alunos
CREATE VIEW relatorio_frequencia AS
SELECT 
  a.aluno_id,
  a.nome,
  ac.academia_id,
  ac.nome AS academia,
  DATE_TRUNC('month', ra.data_hora_entrada) as mes,
  COUNT(ra.registro_acesso_id) as total_acessos,
  MAX(ra.data_hora_entrada) as ultimo_acesso,
  ROUND((COUNT(ra.registro_acesso_id)::numeric / 30) * 100, 2) as frequencia_percentual,
  CASE
    WHEN (COUNT(ra.registro_acesso_id)::numeric / 30) >= 0.8 THEN 'EXCELENTE'
    WHEN (COUNT(ra.registro_acesso_id)::numeric / 30) >= 0.6 THEN 'BOA'
    WHEN (COUNT(ra.registro_acesso_id)::numeric / 30) >= 0.4 THEN 'MÉDIA'
    ELSE 'BAIXA'
  END as categoria_frequencia
FROM aluno a
JOIN academia ac ON TRUE  -- Pode ter matrícula em várias academias
LEFT JOIN matricula m ON a.aluno_id = m.aluno_id AND m.academia_id = ac.academia_id
LEFT JOIN registro_acesso ra ON a.aluno_id = ra.aluno_id AND ra.academia_id = ac.academia_id
GROUP BY a.aluno_id, a.nome, ac.academia_id, ac.nome, DATE_TRUNC('month', ra.data_hora_entrada);

-- Relatório: Inadimplência Detalhada
CREATE VIEW relatorio_inadimplencia_detalhado AS
SELECT 
  i.inadimplencia_id,
  a.nome AS aluno,
  a.cpf,
  ac.nome AS academia,
  i.valor_devido,
  i.valor_juros_acumulado,
  i.valor_multa_acumulada,
  (i.valor_devido + i.valor_juros_acumulado + i.valor_multa_acumulada) as valor_total_devido,
  i.dias_atraso,
  i.data_vencimento_primeira_parcela,
  i.status,
  CASE
    WHEN i.dias_atraso <= 7 THEN 'LEVE'
    WHEN i.dias_atraso <= 30 THEN 'MODERADA'
    ELSE 'CRÍTICA'
  END as categoria_risco
FROM inadimplencia i
JOIN aluno a ON i.aluno_id = a.aluno_id
JOIN academia ac ON i.academia_id = ac.academia_id
WHERE i.status IN ('ATRASADO', 'BLOQUEADO')
ORDER BY i.dias_atraso DESC;

-- Relatório: Comissões de Professores
CREATE VIEW relatorio_comissoes_professores AS
SELECT 
  u.usuario_id,
  u.nome AS professor,
  ac.academia_id,
  ac.nome AS academia,
  c.periodo_mes,
  c.total_alunos_ativos,
  c.valor_plano_medio,
  c.percentual_comissao,
  c.valor_total,
  c.status_calculo,
  CASE
    WHEN c.status_calculo = 'PAGA' THEN 'PAGO'
    WHEN c.status_calculo = 'APROVADA' THEN 'APROVADO'
    ELSE 'PENDENTE'
  END as status_pagamento
FROM comissao_calculo c
JOIN usuario u ON c.professor_id = u.usuario_id
JOIN academia ac ON c.academia_id = ac.academia_id
ORDER BY c.periodo_mes DESC, ac.academia_id;

-- Relatório: Renda por Academia (Consolidado)
CREATE VIEW relatorio_renda_academias AS
SELECT 
  ac.academia_id,
  ac.nome AS academia,
  DATE_TRUNC('month', p.data_pagamento_efetiva)::date as mes,
  COUNT(DISTINCT p.pagamento_id) as total_transacoes,
  SUM(p.valor_original) FILTER (WHERE p.status_pagamento = 'APROVADO') as receita_base,
  SUM(p.valor_juros) FILTER (WHERE p.status_pagamento = 'APROVADO') as receita_juros,
  SUM(p.valor_multa) FILTER (WHERE p.status_pagamento = 'APROVADO') as receita_multa,
  SUM(p.valor_total) FILTER (WHERE p.status_pagamento = 'APROVADO') as receita_total,
  SUM(CASE WHEN p.status_pagamento = 'RECUSADO' THEN p.valor_total ELSE 0 END) as valor_recusado
FROM pagamento p
JOIN academia ac ON p.academia_id = ac.academia_id
GROUP BY ac.academia_id, ac.nome, DATE_TRUNC('month', p.data_pagamento_efetiva)
ORDER BY mes DESC, ac.academia_id;
```

---

## 2. API REST (12 Endpoints + Export)

```
GET  /api/relatorios/dashboard                    → KPIs executivo (time-series)
GET  /api/relatorios/dashboard/academias          → KPIs por academia
GET  /api/relatorios/frequencia?mes=04-2026       → Frequência de alunos
GET  /api/relatorios/inadimplencia?dias_minimo=3  → Lista com filtros
GET  /api/relatorios/inadimplencia/risco-alto     → Análise de risco
GET  /api/relatorios/comissoes?mes=04-2026        → Comissões dos professores
GET  /api/relatorios/renda-academias?mes=04-2026  → Consolidado 5 academias
GET  /api/relatorios/performance-alunos           → Top/Bottom performers
GET  /api/relatorios/fluxo-caixa?periodo=ultimo_ano
GET  /api/relatorios/comparativo-academias        → Benchmarking

Export endpoints:
GET  /api/relatorios/export?relatorio=frequencia&format=pdf
GET  /api/relatorios/export?relatorio=inadimplencia&format=excel
GET  /api/relatorios/export?relatorio=comissoes&format=csv
```

---

## 3. React Componentes

```jsx
// DashboardPage.jsx
<Container>
  <Grid container spacing={2}>
    <Grid item xs={12} sm={6} md={3}>
      <KPICard title="Alunos Ativos" value="1.234" trend="+5%" color="success" />
    </Grid>
    <Grid item xs={12} sm={6} md={3}>
      <KPICard title="Receita (R$)" value="45.000" trend="+12%" color="success" />
    </Grid>
    <Grid item xs={12} sm={6} md={3}>
      <KPICard title="Inadimplência %" value="8.5%" trend="-2%" color="warning" />
    </Grid>
    <Grid item xs={12} sm={6} md={3}>
      <KPICard title="Bloqueados" value="105" trend="+1" color="error" />
    </Grid>
    
    <Grid item xs={12} md={6}>
      <LineChart
        data={receitaUltimos12Meses}
        title="Receita Últimos 12 Meses"
        dataKey="receita"
      />
    </Grid>
    
    <Grid item xs={12} md={6}>
      <PieChart
        data={distribuicaoAcademias}
        title="Distribuição por Academia"
      />
    </Grid>
    
    <Grid item xs={12}>
      <Inadimplentes10TopTable />
    </Grid>
  </Grid>
</Container>

// RelatorioFrequenciaPage.jsx
<Container>
  <Tabs>
    <Tab label="Tabela">
      <DataTable
        data={frequenciaAlunos}
        columns={['nome', 'academia', 'frequencia%', 'ultimoAcesso', 'categoria']}
        sortBy="frequencia%"
        descending
      />
    </Tab>
    <Tab label="Gráfico">
      <BarChart data={frequenciaAlunosTop20} />
    </Tab>
  </Tabs>
</Container>

// RelatorioInadimplenciaPage.jsx
<Container>
  <Filters>
    <Select label="Academia" />
    <Select label="Período">
      <option>Últimos 7 dias</option>
      <option>Últimos 30 dias</option>
      <option>Últimos 90 dias</option>
    </Select>
    <RangeSlider label="Dias em Atraso" min={1} max={180} />
  </Filters>
  
  <DataTable
    data={indefinentes}
    columns={['aluno', 'academia', 'valorDevido', 'diasAtraso', 'risco', 'acao']}
    actions={['Contatar', 'Bloquear', 'Desbloquear']}
  />
</Container>

// ExportModal.jsx
<Dialog>
  <Select label="Tipo de Relatório">
    <option>Frequência</option>
    <option>Inadimplência</option>
    <option>Comissões</option>
    <option>Renda</option>
  </Select>
  
  <Select label="Formato">
    <option>PDF</option>
    <option>Excel (.xlsx)</option>
    <option>CSV</option>
  </Select>
  
  <DateRange label="Período" />
  
  <Button onClick={handleExport}>Gerar e Baixar</Button>
</Dialog>
```

---

## 4. Stack de Charts

```
Frontend: Recharts (React)
  ├─ LineChart (Receita temporal)
  ├─ PieChart (Distribuição)
  ├─ BarChart (Frequência, comissações)
  ├─ AreaChart (Fluxo caixa)
  └─ ScatterChart (Análise multidimensional)

Backend: Dados agregados via VIEWs (rápido!)
```

---

## 5. Performance

```
- VIEWs materializadas (refresh 1x/hora)
- Índices em data_pagamento_efetiva, status
- Cache Redis (KPIs dashboard - 5 min TTL)
- Paginação em todas listagens (50 linhas/página)
```

---

## 6. Critérios de Aceição

```
✅ VIEWs
  ☑ 5 VIEWs agregadas funcionando
  ☑ Performance < 500ms por query

✅ API
  ☑ 12 endpoints + 3 export
  ☑ Filtros: data, academia, status
  ☑ Paginação + sorting

✅ React
  ☑ Dashboard com 4 KPIs
  ☑ 4 gráficos (linha, pizza, barra, área)
  ☑ 4 páginas de relatório
  ☑ Export PDF/Excel/CSV funcional

✅ Dados
  ☑ 100% acurados (validado com auditoria)
  ☑ Sempre em dia (scheduler daily)
```

---

**Tempo Estimado**: 6 horas  
**Status**: 📋 Pronto para desenvolvimento
