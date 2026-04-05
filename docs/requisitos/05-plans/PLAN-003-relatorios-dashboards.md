# PLAN-003 — Relatórios & Dashboards (Implementação Técnica)

> Versão: 1.1  
> Data: 5 de abril de 2026  
> Baseado em: SPEC-003-relatorios-dashboards.md  
> RFs Cobertas: RF-REL-01 a 09  
> Situação do documento: alinhado ao estado real do projeto (MVP operacional)

---

> Nota de escopo MVP: este PLAN descreve implementacao tecnica orientada ao MVP operacional. Itens tipicos de plataforma enterprise entram como backlog de evolucao.

## 1. Diagnóstico Real (Abr/2026)

- Backend implementado: endpoint único de KPI consolidado (`GET /api/relatorios/kpis`).
- Frontend implementado: tela de dashboard/relatórios conectada ao gateway com fallback.
- Banco implementado: sem camada dedicada de views materializadas neste momento.
- Não implementado ainda: exportações, relatórios segmentados, benchmark entre academias e stack analítica avançada.

---

## 2. Escopo de Dados Ajustado

### 2.1 Estrutura real atual

- KPIs consolidados calculados por consulta de serviço.
- Sem dependência de múltiplas views, Redis ou scheduler obrigatório nesta fase.

### 2.2 Estrutura alvo quando demanda aumentar

- views para frequência, inadimplência, comissões e renda por período.
- camada de export (PDF/CSV/XLSX) sob feature flag.
- cache e materialização apenas com evidência de gargalo.

---

## 3. API Real vs Alvo

### 3.1 Endpoint implementado

- `GET /api/relatorios/kpis`

### 3.2 Endpoints pendentes

- endpoints específicos de frequência, inadimplência, comissões e comparativos.
- exportação parametrizada por período e formato.

---

## 4. Backlog Priorizado

1. P0: consolidar contrato de KPIs com filtros mínimos (período e status).
2. P1: adicionar relatórios tabulares por domínio (financeiro/acesso/professores).
3. P1: adicionar export CSV.
4. P2: evoluir para PDF/XLSX e painéis avançados.

---

## 5. Critérios de Aceite Atualizados

- Implementado (MVP): KPI consolidado disponível e consumido no frontend.
- Parcial: visualizações e filtros avançados.
- Pendente: exportações e suíte completa de relatórios do SPEC.

---

## 6. Status

Status real: módulo de relatórios em operação básica, sem cobertura total do escopo analítico planejado.
