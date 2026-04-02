# SPEC-003 — Relatórios e Dashboards (Gerenciais, Financeiros, Operacionais)

> **Versão**: 1.0  
> **Data**: 2 de abril de 2026  
> **Módulos**: M03 (Financeiro) + M07 (Relatórios/Dashboards)  
> **Status**: 🟢 PRONTO PARA DESENVOLVIMENTO  
> **RFs Inclusos**: RF-REL-01 a 09 (9 RFs)  
> **Bloqueadores**: ✅ ZERO (DUV-03 resolvida: comissão por aluno mensal)

---

## 1. Visão Geral

### Propósito
Especificar funcionalidades de **relatórios e dashboards gerenciais** da academia: visualização de KPIs financeiros, análise de inadimplência, comissões de professores, receitas, presença de alunos e geração de relatórios exportáveis (Excel, PDF).

### Escopo
- ✅ Dashboard Financeiro (proprietário/coordenador) — KPIs overview
- ✅ Relatório de Pagamentos (histórico) — detalhado por aluno
- ✅ Relatório de Inadimplência (status bloqueados)
- ✅ Relatório de Comissões (por professor, período)
- ✅ Relatório de Receitas (período, categoria)
- ✅ Relatório de Alunos (status, ativos, inativos, cancelados)
- ✅ Relatório de Presença/Check-in (frequência, recorrência)
- ✅ Gráficos/Charts (visualização de trends)
- ✅ Export Relatórios (Excel, PDF, CSV)

### Não Incluso (Futuro)
- ❌ Business Intelligence (Power BI, Tableau) — Fase 4
- ❌ Análise preditiva (ML) — Fase 4
- ❌ Relatório de impostos (RPA, EFD) — Futuro
- ❌ Conciliação bancária automática — Futuro

---

## 2. Referências Críticas

| Documento | Seção | Referência |
|-----------|-------|-----------|
| [DUV Resolutions](../.copilot/memory/duv-resolutions.md) | DUV-03 | Modelo comissão = Alunos × VLA × % |
| [Glossário](../00-originais/glossario.md) | Dashboard, KPI, Inadimplência | Terminologia |
| [Matriz Rastreabilidade](../02-mapa/matriz-rastreabilidade.md) | M07 RFs | Mapeamento RFs |
| [Modelo Dados](../02-mapa/modelo-dados-conceitual.md) | PAGAMENTO, COMISSAO, CHECK_IN | Schema |
| [RNFs Detalhados](../02-mapa/requisitos-nao-funcionais-detalhados.md) | RNF-05, 06 | Performance, Rentabilidade |
| [SPEC-001](./SPEC-001-cadastro-acesso.md) | RF-ACE | Autenticação |
| [SPEC-002](./SPEC-002-financeiro.md) | RF-FIN | Pagamentos, Comissões |

---

## 3. Requisitos Funcionais Detalhados

### 3.1 RF-REL-01: Dashboard Financeiro (Proprietário/Coordenador)

#### Descrição
Painel gerencial apresentando KPIs financeiros principais: receita do mês, inadimplência %, comissões a pagar, fluxo de caixa. Atualizado em tempo real (com cache de 5 minutos).

#### Casos de Uso

**UC-REL-001: Proprietário Acessa Dashboard Financeiro**

```
Ator: PROPRIETARIO
Pré: Autenticado, primeira vez no app

1. [PROP] Acessa "Dashboard" ou home
2. [SYS] Load dashboard com cache (5 min)
3. [SYS] Mostra cards KPI:
   ├─ Card 1: Receita Mês
   │  ├─ Valor: R$47.500,00
   │  ├─ Trend: ↑ +15% vs mês anterior
   │  └─ Quebra: ✓ À vista, ✓ Cartão, ✓ Boleto
   ├─ Card 2: Inadimplência
   │  ├─ % Alunos bloqueados: 8.5%
   │  ├─ Valor em atraso: R$4.250,00
   │  └─ Trend: ↓ -2% vs mês anterior
   ├─ Card 3: Comissão Professores
   │  ├─ Total a pagar: R$9.500,00
   │  ├─ Status: 15 CALCULADAS, 5 PAGAS
   │  └─ Vencimento: 30 de abril
   ├─ Card 4: Alunos Ativos
   │  ├─ Total: 560 alunos
   │  ├─ Novo este mês: +23
   │  └─ Churn: -5 cancelados
   └─ Card 5: Taxa de Ocupação (Salas)
      ├─ Disponível: 85/100 slots
      ├─ Ocupação: 85%
      └─ Pico: 18:00-19:00

4. [SYS] Gráfico receita (últimos 12 meses)
   └─ Line chart: Jan R$40k → Fev R$42k → Mar R$45k → Abr R$47.5k

5. [SYS] Gráfico alunos vs inadimplência
   └─ Bar chart: Alunos ativos vs bloqueados

6. [SYS] Botões ação:
   ├─ [ Visualizar Inadimplentes ]
   ├─ [ Aprovar Comissões ]
   ├─ [ Gerar Relatório Financeiro ]
   └─ [ Exportar Dashboard ]

7. [PROP] Click "Visualizar Inadimplentes"
8. [SYS] Navigate para RF-REL-03 com filtro pré-selecionado
```

#### Database Query

```sql
-- KPI: Receita mês
SELECT SUM(valor_pago) FROM PAGAMENTO
WHERE EXTRACT(MONTH FROM data_pagamento) = CURRENT_MONTH;

-- KPI: Inadimplência
SELECT COUNT(*) FROM MATRICULA
WHERE status_pagamento = 'INADIMPLENTE';

-- KPI: Comissão a pagar
SELECT SUM(valor_total) FROM COMISSAO_CALCULO
WHERE status_calculo IN ('CALCULADA', 'APROVADA')
AND EXTRACT(MONTH FROM periodo_mes) = CURRENT_MONTH;

-- KPI: Alunos ativos
SELECT COUNT(*) FROM MATRICULA
WHERE status_pagamento != 'CANCELADO'
AND ativo = true;
```

#### Validações

```
✅ Apenas PROPRIETARIO e COORDENADOR podem acessar
✅ Data mês atual por defecto
✅ Cache 5 minutos
✅ Load < 1 segundo (cached)
✅ Gráficos responsive (mobile/desktop)
```

---

### 3.2 RF-REL-02: Relatório de Pagamentos (Histórico)

#### Descrição
Relatório detalhado de todos pagamentos recebidos, com filtros por período, aluno, forma de pagamento, status. Exportável em Excel.

#### Casos de Uso

**UC-REL-002: Coordenador Gera Relatório Pagamentos**

```
Ator: COORDENADOR
Pré: Autenticado

1. [COORD] Acessa "Relatórios → Pagamentos"
2. [SYS] Form filtros:
   ├─ Data: [01/04/2026__] até [30/04/2026__]
   ├─ Aluno: [________________________] (busca)
   ├─ Forma: [Todos▼]
   │  ├─ Dinheiro
   │  ├─ Débito
   │  ├─ Crédito
   │  └─ PIX
   ├─ Status: [Todos▼]
   │  ├─ Quitado
   │  ├─ Parcial
   │  └─ Atrasado
   └─ [Filtrar] [Limpar] [Exportar Excel]

3. [COORD] Seleciona: Período (01-30 abr), Status "Quitado"
4. [COORD] Click "Filtrar"
5. [SYS] Query + return lista:
   ├─ ID | Data | Aluno | Valor | Forma | Status | Ação
   ├─ 001 | 02/04 | João Silva | R$500 | PIX | Quitado | [Ver]
   ├─ 002 | 03/04 | Maria Santos | R$1000 | Débito | Quitado | [Ver]
   └─ ... (100+ registros paginados)

6. [COORD] Click [Exportar Excel]
7. [SYS] Gera arquivo:
   ├─ Filename: Relatorio_Pagamentos_2026-04-02.xlsx
   ├─ Colunas: ID, Data, Aluno, CPF, Valor, Forma, Status, Observação
   ├─ Summary row: Total R$47.500,00
   └─ Timestamp: 2026-04-02 14:30:25

8. [COORD] Download inicia automaticamente
```

#### Screen Layout

```
┌────────────────────────────────────────────────┐
│  RELATÓRIO DE PAGAMENTOS                       │
├────────────────────────────────────────────────┤
│ Filtros: Data [__] até [__]                    │
│          Aluno [_________]                     │
│          Forma [Todos▼]                        │
│          Status [Todos▼]                       │
│                             [Filtrar][Exportar]│
├────────────────────────────────────────────────┤
│ Resultados: 47 pagamentos encontrados          │
├────────────────────────────────────────────────┤
│ ID   | Data    | Aluno         | Valor    | ...│
│──────┼─────────┼───────────────┼──────────┤...│
│ 0001 │ 02/04   │ João Silva    │ R$500    │...│
│ 0002 │ 03/04   │ Maria Santos  │ R$1.000  │...│
│ 0003 │ 04/04   │ Pedro Costa   │ R$500    │...│
│ ...  │ ...     │ ...           │ ...      │...│
├────────────────────────────────────────────────┤
│                                                │
│ Total: R$47.500,00 | Média: R$1.010,64        │
└────────────────────────────────────────────────┘
```

#### Database Query

```sql
SELECT 
  p.pagamento_id,
  p.data_pagamento,
  a.nome AS aluno_nome,
  a.cpf,
  p.valor_pago,
  p.forma_pagamento,
  m.status_pagamento,
  p.observacao
FROM PAGAMENTO p
JOIN ALUNO a ON p.aluno_id = a.aluno_id
JOIN MATRICULA m ON p.aluno_id = m.aluno_id
WHERE p.data_pagamento BETWEEN ? AND ?
  AND (p.forma_pagamento = ? OR ? = 'TODOS')
  AND (m.status_pagamento = ? OR ? = 'TODOS')
ORDER BY p.data_pagamento DESC;
```

---

### 3.3 RF-REL-03: Relatório de Inadimplência

#### Descrição
Lista detalhada de alunos com histórico de pagamento vencido/atrasado, dias em atraso, dias de carência restante, recomendações de ação.

#### Casos de Uso

**UC-REL-003: Coordenador Monitora Inadimplência**

```
Ator: COORDENADOR
Pré: Autenticado

1. [COORD] Acessa "Relatórios → Inadimplência"
2. [SYS] Carrega lista:
   ├─ Filtro: Status [Bloqueados▼]
   │  - Bloqueados (carência expirada)
   │  - Vencidos (até 3 dias)
   │  - Todos inadimplentes
   ├─ Filtro: Período atraso [Até 30 dias▼]
   └─ [Filtrar] [Exportar] [Enviar Email Em Massa]

3. [SYS] Return lista:
   ├─ ID | Aluno | CPF | Dias Atraso | Valor Devido | Status | Ação
   ├─ 1 | João Silva | 123.456.789-00 | 4 dias | R$500 | BLOQUEADO | [Desbloquear]
   ├─ 2 | Maria Santos | 987.654.321-00 | 12 dias | R$1.000 | BLOQUEADO | [Desbloquear]
   └─ ... (8 alunos)

4. [COORD] Click [Enviar Email Em Massa]
5. [SYS] Form:
   ├─ Template: [Padrão (cobrança gentil)▼]
   │            [Aviso de bloqueio]
   │            [Último aviso]
   │            [Custom: ___________]
   ├─ Prova: [Preview de email]
   └─ [Enviar para 8 alunos]

6. [COORD] Confirm "Enviar"
7. [SYS]
   ├─ Send 8 emails (async)
   ├─ Log cada email em AUDITORIA_LOG
   ├─ Insert em EMAIL_ENVIADO (tracking)
   └─ Return "8 emails enviados com sucesso"
```

#### Database Query

```sql
SELECT 
  m.matricula_id,
  a.aluno_id,
  a.nome,
  a.cpf,
  EXTRACT(DAY FROM NOW() - m.data_vencimento) AS dias_atraso,
  (m.valor_mensal - COALESCE(SUM(p.valor_pago), 0)) AS valor_devido,
  m.status_pagamento,
  mb.motivo AS bloqueio_motivo
FROM MATRICULA m
JOIN ALUNO a ON m.aluno_id = a.aluno_id
LEFT JOIN PAGAMENTO p ON m.aluno_id = p.aluno_id 
  AND EXTRACT(MONTH FROM p.data_pagamento) = EXTRACT(MONTH FROM m.data_vencimento)
LEFT JOIN MATRICULA_BLOQUEIO mb ON m.aluno_id = mb.aluno_id AND mb.removido_em IS NULL
WHERE m.status_pagamento IN ('VENCIDO', 'INADIMPLENTE', 'PARCIAL')
  AND EXTRACT(DAY FROM NOW() - m.data_vencimento) > 0
GROUP BY m.matricula_id, a.aluno_id, m.status_pagamento, mb.motivo
ORDER BY dias_atraso DESC;
```

---

### 3.4 RF-REL-04: Relatório de Comissões (Professores)

#### Descrição
Relatório histórico de comissões calculadas, aprovadas e pagas. Detalhado por professor, período, status. Com rastreamento de retenções e ajustes.

#### Casos de Uso

**UC-REL-004: Proprietário Gera Relatório Comissões**

```
Ator: PROPRIETARIO
Pré: Autenticado

1. [PROP] Acessa "Financeiro → Relatório Comissões"
2. [SYS] Form filtros:
   ├─ Professor: [Todos▼]
   ├─ Período: [Abril 2026▼] (mes/ano)
   ├─ Status: [Todos▼]
   │  ├─ Calculadas
   │  ├─ Aprovadas
   │  ├─ Pagas
   │  └─ Retidas
   └─ [Filtrar] [Exportar] [Imprimir]

3. [PROP] Click "Filtrar"
4. [SYS] Return relatório:
   ├─ Header: Relatório Comissões - Abril 2026
   ├─ Total período: R$47.500,00
   └─ Breakdown por professor:

   │ Professor | Alunos | VLA Médio | % Comissão | Total Comissão | Status │
   ├───────────┼────────┼───────────┼────────────┼────────────────┼────────┤
   │ Julia Sales | 15 | R$625 | 15% | R$3.200 | PAGA (05/04) │
   │ Pedro Santos | 10 | R$625 | 15% | R$2.150 | CALCULADA │
   │ Ana Ferreira | 12 | R$625 | 15% | R$2.550 | RETIDA (desc. -R$100) │
   │ Total | 37 | | | R$47.500 | |

5. [PROP] Click [Exportar]
6. [SYS] Gera Excel com tabs:
   ├─ Tab 1: Summary
   ├─ Tab 2: Detalhado por professor
   ├─ Tab 3: Histórico pagamentos
   └─ Tab 4: Retenções/ajustes
```

#### Database Query

```sql
SELECT 
  p.professor_id,
  p.nome AS professor_nome,
  cc.periodo_mes,
  cc.total_alunos_ativos,
  cc.valor_plano_medio,
  cc.percentual_comissao,
  cc.valor_total,
  cc.status_calculo,
  cp.data_pagamento,
  cp.forma_pagamento
FROM COMISSAO_CALCULO cc
JOIN PROFESSOR p ON cc.professor_id = p.professor_id
LEFT JOIN COMISSAO_PAGAMENTO cp ON cc.comissao_id = cp.comissao_id
WHERE EXTRACT(MONTH FROM cc.periodo_mes) = ?
  AND (cc.professor_id = ? OR ? = 0)
  AND (cc.status_calculo = ? OR ? = 'TODOS')
ORDER BY p.nome, cc.periodo_mes;
```

---

### 3.5 RF-REL-05: Relatório de Receitas (Período, Categoria, Professor)

#### Descrição
Análise de receitas por período, desagregada por categoria (mensalidades, produtos, aulas extras), professores com maior faturamento.

#### Screen Layout

```
┌────────────────────────────────────────────────────┐
│  RELATÓRIO DE RECEITAS                             │
├────────────────────────────────────────────────────┤
│ Período: [01/04/2026__] até [30/04/2026__]         │
│ Categoria: [Todas▼]                                │
│ Professor: [Todos▼]                                │
│                                  [Filtrar][Excel]  │
├────────────────────────────────────────────────────┤
│                                                    │
│ TOTAL RECEITA: R$47.500,00                         │
│ Média/dia: R$1.583,33                              │
│ Crescimento vs mês anterior: ↑ +15%                │
│                                                    │
├────────────────────────────────────────────────────┤
│ BREAKDOWN POR CATEGORIA:                           │
│                                                    │
│ Mensalidades: R$42.500,00 (89.5%)  ████████████   │
│ Produtos: R$3.500,00 (7.4%)         ██              │
│ Aulas Extras: R$1.500,00 (3.1%)     ┘              │
│                                                    │
├────────────────────────────────────────────────────┤
│ TOP 5 PROFESSORES POR FATURAMENTO:                 │
│                                                    │
│ 1. Julia Sales - R$47.500                           │
│ 2. Pedro Santos - R$35.000                          │
│ 3. Ana Ferreira - R$28.000                          │
│ ... (more)                                         │
└────────────────────────────────────────────────────┘
```

---

### 3.6 RF-REL-06: Relatório de Alunos (Ativos, Inativos, Cancelados)

#### Descrição
Listagem completa de alunos com status (ativo, inativo, cancelado), data de matrícula, última atividade (check-in), plano contratado. Filtros por data, status, plano.

#### Database Query

```sql
SELECT 
  a.aluno_id,
  a.nome,
  a.cpf,
  a.email,
  m.status_pagamento,
  m.data_matricula,
  COALESCE(MAX(ci.data_checkin), m.data_matricula) AS ultima_atividade,
  m.plano_id,
  pl.nome AS plano_nome,
  pl.valor AS plano_valor,
  (DATE_PART('day', NOW() - m.data_matricula)) AS dias_academiado
FROM ALUNO a
JOIN MATRICULA m ON a.aluno_id = m.aluno_id
LEFT JOIN PLANO pl ON m.plano_id = pl.plano_id
LEFT JOIN CHECK_IN ci ON a.aluno_id = ci.aluno_id
WHERE m.academia_id = ?
  AND (m.status_pagamento = ? OR ? = 'TODOS')
GROUP BY a.aluno_id, m.matricula_id
ORDER BY COALESCE(MAX(ci.data_checkin), m.data_matricula) DESC;
```

---

### 3.7 RF-REL-07: Relatório de Presença/Check-in (Frequência, Recorrência)

#### Descrição
Análise de frequência de alunos: quantas vezes comparecidos, padrão de dias, horários mais populares, tendência de adesão.

#### Casos de Uso

**UC-REL-007: Coordenador Monitora Frequência**

```
Ator: COORDENADOR
Pré: Autenticado

1. [COORD] Acessa "Relatórios → Presença"
2. [SYS] Carrega dashboard:
   ├─ Filtro: Período [Última semana▼]
   │            [Últimos 30 dias]
   │            [Este mês]
   │            [Customizado: ___]
   ├─ Filtro: Aluno [_________] (busca)
   └─ [Filtrar] [Exportar]

3. [SYS] Return análise:
   ├─ Card: Check-ins este período
   │  └─ Total: 3.450 check-ins
   │  └─ Alunos únicos: 560
   │  └─ Média/aluno: 6.16 check-ins
   │  └─ Trend: ↑ +12% vs período anterior
   
   ├─ Card: Horário mais populares
   │  └─ 18:00 (347 check-ins)
   │  └─ 19:00 (298 check-ins)
   │  └─ 17:00 (245 check-ins)
   
   ├─ Card: Dias menos populares
   │  └─ Segunda (450) ← dia com menos adesão
   │  └─ Sexta (520) ← dia com mais adesão
   
   ├─ Gráfico: Linha (check-ins/dia últimos 30 dias)
   └─ Tabela: Top 20 alunos mais assíduos

4. [COORD] Click aluno específico
5. [SYS] Mostra histórico individual
```

#### Database Query

```sql
SELECT 
  DATE(ci.data_checkin) AS data,
  EXTRACT(DOW FROM ci.data_checkin)::TEXT AS dia_semana,
  EXTRACT(HOUR FROM ci.data_checkin)::TEXT AS horario,
  COUNT(*) AS total_checkins
FROM CHECK_IN ci
WHERE ci.academia_id = ?
  AND ci.data_checkin BETWEEN ? AND ?
GROUP BY DATE(ci.data_checkin), dia_semana, horario
ORDER BY data DESC, horario;
```

---

### 3.8 RF-REL-08: Gráficos/Charts (Visualização de Trends)

#### Descrição
Componentes React reutilizáveis para visualização de dados: Line charts (receita), Bar charts (inadimplência), Pie charts (categoria), Heatmaps (horários). Usando Recharts ou Chart.js.

#### Exemplos Gráficos

```
Linha: Receita últimos 12 meses
┌─────────────────────────────────────┐
│                                 47.5k
│                              ╱        
│                           ╱    
│                        ╱        
│                     ╱    
│                  ╱    
│               ╱    
│            ╱    
│         ╱    
│      ╱    
│   ╱    
│╱    
└─────────────────────────────────────┘
Jan  Fev  Mar  Abr  Mai  Jun  Jul...

Pizza: Categoria Receita
┌────────────────────────────┐
│     ╱──────╲               │
│   ╱          ╲             │
│  │            │            │
│  │ Mensalid.  │ 89.5%      │
│  │            │            │
│   ╲          ╱             │
│     ╲──────╱              │
│     7.4%│3.1%             │
└────────────────────────────┘
 Produtos  Extras

Barras: Alunos Ativos vs Bloqueados
┌──────────────────────────────┐
│ ████████████████ 560 Ativos  │
│ ██ 47 Bloqueados             │
└──────────────────────────────┘
```

#### React Component (Exemplo)

```jsx
// Recharts: Revenue Chart
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={revenueData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
  </LineChart>
</ResponsiveContainer>

// Pie Chart: Revenue by Category
<ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie data={categoryData} dataKey="value" label>
      {categoryData.map((entry, index) => 
        <Cell key={`cell-${index}`} fill={COLORS[index]} />
      )}
    </Pie>
  </PieChart>
</ResponsiveContainer>
```

---

### 3.9 RF-REL-09: Export Relatórios (Excel, PDF, CSV)

#### Descrição
Todos relatórios podem ser exportados em múltiplos formatos: Excel (com formatação, tabs), PDF (imprimível), CSV (compatível com BI tools).

#### Casos de Uso

**UC-REL-009: Coordenador Exporta Relatório em Múltiplos Formatos**

```
Ator: COORDENADOR
Pré: Relatório (qualquer um) aberto na tela

1. [COORD] Click botão [Exportar]
2. [SYS] Menu dropdown:
   ├─ [Exportar como Excel]
   ├─ [Exportar como PDF]
   ├─ [Exportar como CSV]
   └─ [Adicionar email]

3a. [Export Excel]
   ├─ Gera arquivo: Relatorio_Pagamentos_2026-04-02.xlsx
   ├─ Incluído: Multiple tabs (summary, detalhado, charts)
   ├─ Formatação: Headers em negrito, Colunas alinhadas
   ├─ File size: ~500KB
   └─ Download automático

3b. [Export PDF]
   ├─ Gera arquivo: Relatorio_Pagamentos_2026-04-02.pdf
   ├─ Incluído: Headers, tabelas, charts como imagens
   ├─ Orientação: Portrait (tabelas), Landscape (gráficos)
   ├─ Assinatura: Rodapé com data/hora e usuário
   └─ File size: ~1.5MB

3c. [Export CSV]
   ├─ Gera arquivo: Relatorio_Pagamentos_2026-04-02.csv
   ├─ Delimitador: ; (ponto-e-vírgula, pt_BR)
   ├─ Encoding: UTF-8
   └─ Import ready (Excel, Power BI, SQL)

3d. [Adicionar email]
   ├─ Form: Email [usuario@email.com__]
   ├─ Formato: [Excel▼]
   └─ Enviar automaticamente?
```

#### Stack Técnico

```
Backend:
├─ Apache POI (Excel .xlsx)
├─ iText ou Apache PDFBox (PDF)
├─ OpenCSV (CSV)
└─ Spring Boot mail (envio)

Frontend:
├─ FileSaver.js (download)
├─ xlsx (parsing Excel no front)
└─ jsPDF (geração PDF no front, optional)
```

---

## 4. Especificações Técnicas

### 4.1 Stack

```
Backend (mesmo do SPEC-001/002)
├─ Java 17+, Spring Boot 3.0+
├─ spring-boot-starter-data-jpa
├─ spring-boot-starter-cache (Redis)
├─ Apache POI (Excel export)
├─ iText or PDFBox (PDF export)

Frontend
├─ React 18+
├─ Recharts (charting library)
├─ date-fns + moment.js (date manipulation)
├─ xlsx (Excel parsing)
├─ jsPDF (PDF generation, optional)
├─ Tailwind CSS or Material-UI

Database
├─ PostgreSQL 14+
├─ Query caching (5 min para dashboards)
└─ Indexed queries (performance)
```

### 4.2 API Endpoints

```
GET    /api/v1/dashboard/financeiro              (RF-REL-01)
GET    /api/v1/dashboard/financeiro/cache-status (health check)

GET    /api/v1/relatorios/pagamentos?filtros     (RF-REL-02)
GET    /api/v1/relatorios/pagamentos/export?fmt  (Excel/PDF/CSV)

GET    /api/v1/relatorios/inadimplencia?filtros  (RF-REL-03)
POST   /api/v1/relatorios/inadimplencia/email    (bulk email)

GET    /api/v1/relatorios/comissoes?filtros      (RF-REL-04)
GET    /api/v1/relatorios/comissoes/export?fmt   (Excel/PDF/CSV)

GET    /api/v1/relatorios/receitas?filtros       (RF-REL-05)
GET    /api/v1/relatorios/receitas/grafico       (chart data)

GET    /api/v1/relatorios/alunos?filtros         (RF-REL-06)
GET    /api/v1/relatorios/alunos/export?fmt      (Excel/PDF/CSV)

GET    /api/v1/relatorios/presenca?filtros       (RF-REL-07)
GET    /api/v1/relatorios/presenca/grafico       (chart data)

GET    /api/v1/dashboard/graficos?tipo=          (RF-REL-08)
GET    /api/v1/dashboard/graficos/export         (chart export)

POST   /api/v1/relatorios/{id}/export            (RF-REL-09)
POST   /api/v1/relatorios/{id}/email-export      (enviar por email)
```

### 4.3 Caching Strategy

```
Resource              | TTL    | Key Pattern
──────────────────────┼────────┼────────────────────
Dashboard KPI         | 5 min  | dash:financeiro:{academy_id}
Relatório Pagamentos  | 1 min  | rel:pagamentos:{period}:{academy_id}
Gráfico Receita       | 5 min  | chart:receita:{month}:{academy_id}
Inadimplência list    | 2 min  | rel:inadimpl:{academy_id}
Comissões             | 1h     | rel:comissoes:{period}:{academy_id}
```

---

## 5. Database Schema

```sql
-- Novo: Tabela para tracking de exports (auditoria)
CREATE TABLE RELATORIO_EXPORT (
    export_id BIGSERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES USUARIO(usuario_id),
    academia_id SMALLINT NOT NULL,
    
    tipo_relatorio VARCHAR(50) NOT NULL,  -- 'PAGAMENTOS', 'INADIMPL', etc
    formato_export VARCHAR(20) NOT NULL,  -- 'EXCEL', 'PDF', 'CSV'
    
    filtros_aplicados JSONB,  -- { "periodo": "2026-04", "professor_id": 5 }
    linhas_exportadas INTEGER,
    tamanho_arquivo BIGINT,  -- bytes
    
    nome_arquivo VARCHAR(255),
    url_download VARCHAR(500),  -- S3 URL (optional)
    
    enviado_email BOOLEAN DEFAULT false,
    email_destinatario VARCHAR(255),
    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_usuario (usuario_id),
    INDEX idx_tipo (tipo_relatorio)
);

-- Novo: Cache de dashboard (precomputed)
CREATE TABLE DASHBOARD_CACHE (
    cache_id BIGSERIAL PRIMARY KEY,
    academia_id SMALLINT NOT NULL,
    
    tipo_dashboard VARCHAR(50),  -- 'FINANCEIRO'
    dados_cache JSONB,  -- { "receita_mes": 47500, "inadimplencia": 8.5 }
    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expira_em TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '5 minutes'),
    
    UNIQUE(academia_id, tipo_dashboard)
);
```

---

## 6. Critério de Aceitação

### Funcional

```
✅ RF-REL-01 (Dashboard Financeiro)
   [✓] 5 KPI cards (receita, inadimplência, comissão, alunos, ocupação)
   [✓] Gráicos receita (12 meses)
   [✓] Gráficos alunos vs bloqueados
   [✓] Botões ação (filtros, exportar)
   [✓] Cache 5 minutos
   [✓] Load < 1 segundo

✅ RF-REL-02 (Relatório Pagamentos)
   [✓] Filtros por data, aluno, forma, status
   [✓] Paginação (100 por página)
   [✓] Export Excel (formatado)
   [✓] Summary row (total)
   [✓] Auditoria de export

✅ RF-REL-03 (Inadimplência)
   [✓] Lista com dias atraso calculado
   [✓] Status bloqueio/vencido
   [✓] Bulk email templates
   [✓] Tracking de emails enviados
   [✓] Botão desbloquear rápido

✅ RF-REL-04 (Comissões)
   [✓] Por professor e período
   [✓] Status CALCULADA/PAGA/RETIDA
   [✓] Rastreamento retenções
   [✓] Export multi-tab

✅ RF-REL-05 (Receitas)
   [✓] Breakdown por categoria
   [✓] Trend analysis (vs mês anterior)
   [✓] Top 5 professores
   [✓] Média/dia calculada

✅ RF-REL-06 (Alunos)
   [✓] Filtros por status, plano, data
   [✓] Última atividade rastreada
   [✓] Dias na academia calculado
   [✓] Sorting por atividade

✅ RF-REL-07 (Presença)
   [✓] Frequência por período
   [✓] Horários mais populares
   [✓] Dias menos populares
   [✓] Trend comparado com período anterior

✅ RF-REL-08 (Charts)
   [✓] Line charts (receita, check-in)
   [✓] Bar charts (inadimpl, categoria)
   [✓] Pie charts (breakdown)
   [✓] Responsive (mobile/desktop)
   [✓] Interactive (hover tooltips)

✅ RF-REL-09 (Export)
   [✓] Excel com múltiplas abas
   [✓] PDF imprimível (portrait + landscape)
   [✓] CSV com encoding pt_BR
   [✓] Assinatura digital (user + timestamp)
   [✓] Email com anexo
```

### Performance (RNF-06)

```
✅ Load dashboard: < 1 segundo (cached)
✅ Query relatório: < 2 segundos (no cache)
✅ Export Excel: < 5 segundos
✅ Export PDF: < 10 segundos
✅ Bulk email: < 30 segundos (async)
✅ Chart render: < 500ms
```

### Security (RNF-13)

```
✅ Apenas PROPRIETARIO/COORDENADOR podem acessar
✅ Filtro por academia (multi-tenant)
✅ Sem valores sensíveis em URLs
✅ Auditoria completa (RELATORIO_EXPORT)
✅ Sem senhas/tokens em exports
```

---

## 7. Test Cases

### Backend: DashboardServiceTest

```java
@DisplayName("RF-REL-01: Dashboard Financeiro")
class DashboardServiceTest {
  
  @Test
  void deveRetornar_KPIs_Corretos() { }
  
  @Test
  void deveFazer_Cache_5Minutos() { }
  
  @Test
  void deveAtualizar_Dashboard_AposPagamento() { }
  
  @Test
  void deveRejeitar_Acesso_SemPermissao() { }
}
```

### Backend: RelatorioServiceTest

```java
@DisplayName("RF-REL-02/03/04/05/06/07: Relatórios")
class RelatorioServiceTest {
  
  @Test
  void deveGerar_Relatório_ComFiltros() { }
  
  @Test
  void deveExportar_Excel_ComFormatacao() { }
  
  @Test
  void deveExportar_PDF_ComAssinatura() { }
  
  @Test
  void deveExportar_CSV_ComEncoding_ptBR() { }
  
  @Test
  void deveRastrear_Export_Em_AUDITORIA() { }
}
```

### Frontend: Dashboard.test.jsx

```javascript
describe('Dashboard Financeiro', () => {
  it('deve renderizar 5 KPI cards', () => { });
  
  it('deve fazer cache de 5 minutos', () => { });
  
  it('deve atualizar ao clicar refresh', () => { });
  
  it('deve mostrar gráficos receita', () => { });
});

describe('Export Relatórios', () => {
  it('deve exportar Excel com formatação', () => { });
  
  it('deve exportar PDF imprimível', () => { });
  
  it('deve enviar relatório por email', () => { });
});
```

---

## 8. Timeline Sprint SPEC-003

```
Dia 1 (2 abr, hoje):
├─ Backend: Dashboard service + KPI queries
├─ Frontend: Dashboard layout + KPI cards
└─ Database: RELATORIO_EXPORT + DASHBOARD_CACHE tables

Dia 2 (3 abr):
├─ Backend: Relatório queries (pagamentos, inadimplência)
├─ Frontend: Relatório forms + filters
├─ Charts: Recharts integration
├─ Export: Excel POI implementation
└─ Tests: 50% written

Dia 3 (4 abr):
├─ Backend: Remaining reports + PDF export
├─ Frontend: Chart components + export UI
├─ Export: PDF + CSV implementation
├─ Bulk email: Inadimplência
├─ Tests: 100% pass (80%+ coverage)
├─ SonarQube: gates pass
└─ Ready for QA

Dia 4 (5 abr):
├─ Integration testing
├─ Performance tuning (cache)
├─ Code review + fixes
├─ Staging deployment
└─ Ready for PRODUCTION
```

---

## 9. Referências

| Documento | Link |
|-----------|------|
| DUV Resolutions | duv-resolutions.md |
| Glossário | glossario.md |
| Modelo Dados | modelo-dados-conceitual.md |
| Guia Padrões | guia-padroes-codigo-convencoes.md |
| SPEC-001 | SPEC-001-cadastro-acesso.md |
| SPEC-002 | SPEC-002-financeiro.md |
| CONTRIBUTING | CONTRIBUTING.md |

---

## Checklist Aceita SPEC-003

```
[✓] Todas 9 RFs implementadas
[✓] Dashboard com 5 KPIs + cache
[✓] 6 Relatórios completos
[✓] Export: Excel + PDF + CSV
[✓] Gráficos interativos (Recharts)
[✓] Bulk email (inadimplência)
[✓] Backend: 80%+ test coverage
[✓] Frontend: 80%+ test coverage
[✓] SonarQube: quality gates
[✓] Performance: targets met
[✓] Security: no sensitive data
[✓] Documentation: API docs + README
```

---

**Status**: 🟢 PRONTO PARA DEV  
**Criado**: 2 de abril de 2026  
**Próxima**: Dev inicia SPEC-001 (hoje/amanhã)  
**Owner**: Tech Lead  
**Stack**: SpringBoot + React + PostgreSQL

