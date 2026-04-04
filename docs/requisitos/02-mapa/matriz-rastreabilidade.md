# Matriz de Rastreabilidade: Requisitos → Módulos → Tabelas

> **Versão**: 1.1  
> **Data**: 4 de abril de 2026  
> **Propósito**: Mapear cada Requisito Funcional (RF) → Módulo → Tabelas impactadas + status de decisão  
> **Uso**: Validar cobertura completa, identificar impactos, alinhar SPECs e PLANs

---

## Legenda

| Coluna | Significado |
|---|---|
| **RF** | Identificador do Requisito Funcional (ex: RF-CAD-01) |
| **Descrição** | O que o sistema deve fazer (do doc de objetivos) |
| **Módulo** | M01-M08 (módulo que implementa) |
| **Tabelas** | Entidades de BD que são criadas/lidas/atualizadas/deletadas |
| **DUV** | Dúvida aberta que impacta este RF (se houver) |
| **Status** | **Claro** (pronto p/ SPEC), **Aberto** (aguarda DUV), **Descoped** (fora escopo) |

---

## M01 — Cadastros e Matrículas

| RF | Descrição | Módulo | Tabelas | DUV | Status |
|---|---|---|---|---|---|
| **RF-CAD-01** | Permitir cadastrar aluno com dados básicos | M01 | `aluno`, `endereco`, `contato` | — | ✅ Claro |
| **RF-CAD-02** | Criar múltiplas matrículas para mesmo aluno em unidades diferentes | M01 | `aluno`, `matricula`, `academia` | — | ✅ Claro |
| **RF-CAD-03** | Validar unicidade de CPF (sem duplicatas de aluno) | M01 | `aluno` (constraint UNIQUE) | — | ✅ Claro |
| **RF-CAD-04** | Registrar data matrícula, plano inicial, vencimento mensalidade, perfil aluno | M01 | `matricula`, `plano`, `aluno_perfil` | — | ✅ Claro |
| **RF-CAD-05** | Permitir cadastrar professor com nome, CPF, especialidades, telefone, email, data contratação | M01 | `professor`, `especialidade`, `professor_especialidade` (junction) | — | ✅ Claro |
| **RF-CAD-06** | Permitir cadastrar coordenador de unidade com dados básicos e unidade responsável | M01 | `usuario` (role=COORDENADOR), `academia`, `usuario_academia` (junction) | — | ✅ Claro |
| **RF-CAD-07** | Permitir classificar alunos por status: ativo, suspenso, cancelado, inadimplente | M01 | `aluno_status`, `matricula_status` | — | ✅ Claro |
| **RF-CAD-08** | Registrar histórico de alterações em cadastros (auditoria) | M01 | `auditoria_log`, `aluno`, `professor`, `usuario` | — | ✅ Claro |

---

## M02 — Controle de Acesso

| RF | Descrição | Módulo | Tabelas | DUV | Status |
|---|---|---|---|---|---|
| **RF-ACE-01** | Registrar check-in do aluno na unidade | M02 | `checkin_log` (data, hora, academia, aluno, status_resultado) | — | ✅ Claro |
| **RF-ACE-02** | Permitir consultar status de aluno em tempo real na recepção | M02 | `aluno`, `matricula`, `matricula_status`, `checkin_log` (para histórico) | — | ✅ Claro |
| **RF-ACE-03** | Bloquear automaticamente acesso de aluno inadimplente após 3 dias de atraso (configurável) | M02 | `config_parametro` (dias_carencia), `matricula_status`, `checkin_log` | — | ✅ Claro |
| **RF-ACE-04** | Registrar motivo de bloqueio (inadimplência, suspensão, cancelamento) | M02 | `matricula_bloqueio` (motivo_enum, data_bloqueio, responsavel) | — | ✅ Claro |
| **RF-ACE-05** | Permitir desbloqueio manual por coordenador/proprietário com registro | M02 | `matricula_bloqueio` (desbloqueado_em, desbloqueado_por, motivo_desbloqueio) | — | ✅ Claro |
| **RF-ACE-06** | Fornecer relatório de acesso por período (ex: 30 dias) | M02 | `checkin_log` (query com date range) | — | ✅ Claro |
| **RF-ACE-07** | Permitir integração futura com catraca eletrônica (via API) | M02 | `catraca_dispositivo` (future), `catraca_log` (future) | **DUV-01, DP-CATRACA-001** | 🔴 Descoped |

---

## M03 — Financeiro e Mensalidades

| RF | Descrição | Módulo | Tabelas | DUV | Status |
|---|---|---|---|---|---|
| **RF-FIN-01** | Registrar recebimento de mensalidade com data, valor, aluno, academia, forma pagamento | M03 | `pagamento` (data, valor, aluno_id, academia_id, forma_pagamento_enum, usuario_registrou) | — | ✅ Claro |
| **RF-FIN-02** | Permitir registrar pagamentos parciais | M03 | `pagamento` (parcela_num, parcela_total, valor_minimo_aceitado), `pagamento_parcela` (junction) | — | ✅ Claro |
| **RF-FIN-03** | Calcular automaticamente juros/multa por atraso (taxa configurável) | M03 | `config_parametro` (taxa_juros_percent, metodo_calculo_enum), `pagamento` (juros_aplicados, multa_aplicada) | — | ✅ Claro |
| **RF-FIN-04** | Fornecer visão consolidada de inadimplência por unidade e total rede | M03 | `matricula_status` (vencimento, status), `pagamento` (query aggregate) | — | ✅ Claro |
| **RF-FIN-05** | Permitir gerar boleto/recibo de pagamento | M03 | `documento_saida` (tipo_enum: BOLETO, RECIBO, DATA_GERACAO, aluno, valor) | — | ✅ Claro |
| **RF-FIN-06** | Registrar todas formas de pagamento: dinheiro, débito, crédito, PIX | M03 | `forma_pagamento` (enum: DINHEIRO, CARTAO_DEBITO, CARTAO_CREDITO, PIX) | — | ✅ Claro |
| **RF-FIN-07** | Permitir parcelamento de atrasos via análise de caso com autorização | M03 | `plano_pagamento_atraso` (parcelamento_em_n, condicoes, autorizado_por, data_autorizacao) | — | ✅ Claro |
| **RF-FIN-08** | Fornecer relatório fluxo de caixa por período | M03 | `pagamento` (query: entrada, saída, saldo acumulado) | — | ✅ Claro |
| **RF-FIN-09** | Integrar dados de receita por professor para cálculo de comissão por aluno mensal | M03 | `pagamento` (origem: MENSALIDADE), `comissao_calculo` (alunos_ativos × VLA × percentual) | — | ✅ Claro |

---

## M04 — Avaliação Física e Planos de Treino

| RF | Descrição | Módulo | Tabelas | DUV | Status |
|---|---|---|---|---|---|
| **RF-AVAL-01** | Permitir registrar avaliação física com dados: peso, altura, composição, medidas | M04 | `avaliacao_fisica` (peso, altura, imc_calculado, percentual_gordura, cintura, peito, quadril, data_coleta, professor_id) | — | ✅ Claro |
| **RF-AVAL-02** | Registrar data, profissional responsável, unidade | M04 | `avaliacao_fisica` (data_avaliacao, professor_id), `academia_id` | — | ✅ Claro |
| **RF-AVAL-03** | Preservar histórico de avaliações (evolução) | M04 | `avaliacao_fisica` (todas linhas mantidas, nunca deletadas) | — | ✅ Claro |
| **RF-AVAL-04** | Sugerir reavaliação quando anterior ultrapassa X dias (default 30, configurável) | M04 | `config_parametro` (dias_proxima_avaliacao), `avaliacao_fisica` (data_proxima_sugerida=data_anterior + dias) | — | ✅ Claro |
| **RF-AVAL-05** | Permitir criar planos de treino (template ou customizado) vinculado a aluno e professor | M04 | `plano_treino` (aluno_id, professor_id, data_criacao, template_id_opcional), `plano_treino_ejercicio` (junction: exercicio, series, reps, carga) | — | ✅ Claro |
| **RF-AVAL-06** | Permitir consultar plano mesmo com mudança de professor (histórico preservado) | M04 | `plano_treino` (bloquear delete, marcar como "archived"), `plano_treino_historico` (professor_anterior) | — | ✅ Claro |
| **RF-AVAL-07** | Registrar metas de treino: séries, repetições, exercícios por dia | M04 | `plano_treino_ejercicio` (serie, repeticoes, carga_sugerida, frequencia_semanal) | — | ✅ Claro |
| **RF-AVAL-08** | Permitir feedback de professor: progressão, observações, ajustes recomendados | M04 | `plano_treino_feedback` (observacao_texto, data_feedback, recomendado_ajuste, progressão_observada) | — | ✅ Claro |

---

## M05 — Professores, Escala e Comissões

| RF | Descrição | Módulo | Tabelas | DUV | Status |
|---|---|---|---|---|---|
| **RF-PROF-01** | Criar agenda de aulas: data, hora, local (academia), modalidade | M05 | `aula` (data, hora_inicio, hora_fim, academia_id, modalidade_enum, professor_id), `sala_aula` | — | ✅ Claro |
| **RF-PROF-02** | Associar alunos a professor (aulas privadas, grupos) | M05 | `matricula_professor` (aluno_id, professor_id, tipo_enum: PRIVADO, GRUPO, AULA_COLETIVA), `aula_aluno` (junction) | — | ✅ Claro |
| **RF-PROF-03** | Registrar presença confirmada do professor em cada aula | M05 | `aula_presenca` (professor_id, aula_id, presente_sim_nao, data_registro, responsavel_confirmou) | — | ✅ Claro |
| **RF-PROF-04** | Calcular comissão por aluno ativo no mês (% configurável) | M05 | `config_comissao` (percentual_comissao), `comissao_calculo` (professor_id, periodo_mes, total_alunos_ativos, valor_total) | — | ✅ Claro |
| **RF-PROF-05** | Fornecer pré-visualização de comissão ao professor (ganho estimado) | M05 | `comissao_calculo` (query: soma mensal por professor, mostra estimativa) | — | ✅ Claro |
| **RF-PROF-06** | Registrar bônus de desempenho (opcional, por unidade) | M05 | `professor_bonus` (professor_id, academia_id, mes_referencia, valor_bonus, criterio, autorizado_por) | — | ✅ Claro |
| **RF-PROF-07** | Gerar relatório de comissão mensal por professor com detalhamento do cálculo | M05 | `comissao_calculo` (query: JOIN professor, detalhamento de cálculo) | — | ✅ Claro |
| **RF-PROF-08** | Permitir designar professor responsável por avaliações físicas (perfil/permissão) | M05 | `professor_permissao` (tipo_enum: AVALIADOR, INSTRUTOR, GESTOR_TURMA), `avaliacao_fisica` (professor_id com validate permissão) | — | ✅ Claro |

---

## M06 — Equipamentos, Estoque e Manutenção

| RF | Descrição | Módulo | Tabelas | DUV | Status |
|---|---|---|---|---|---|
| **RF-EQUIP-01** | Registrar equipamentos por unidade: descrição, modelo, data aquisição, localização | M06 | `equipamento` (academia_id, descricao, modelo, data_aquisicao, localizacao_texto, status_enum: OPERACIONAL, MANUTENCAO, DESCARTADO) | — | ✅ Claro |
| **RF-EQUIP-02** | Registrar manutenção preventiva com calendário | M06 | `manutencao_preventiva` (equipamento_id, tipo_manutencao=PREVENTIVA, proximidade_agendada, historico_datas), `calendario_manutencao` (proximo_agendamento) | — | ✅ Claro |
| **RF-EQUIP-03** | Registrar manutenção corretiva: data, problema, solução, custo, responsável | M06 | `manutencao_corretiva` (equipamento_id, tipo_manutencao=CORRETIVA, descricao_problema, descricao_solucao, data_conclusao, custo, responsavel_id) | — | ✅ Claro |
| **RF-EQUIP-04** | Marcar equipamento como em manutenção (indisponível) | M06 | `equipamento` (status="MANUTENCAO", data_inicio_manutencao, data_prevista_retorno) | — | ✅ Claro |
| **RF-EQUIP-05** | Controlar estoque de insumos (toalhas, limpeza, papel, etc) | M06 | `insumo` (academia_id, descricao, unidade_medida_enum: UNIDADE, KG, LITRO) | — | ✅ Claro |
| **RF-EQUIP-06** | Registrar entrada e saída de insumos | M06 | `movimentacao_insumo` (insumo_id, tipo_enum: ENTRADA, SAIDA, quantidade, data, responsavel_id, motivo) | — | ✅ Claro |
| **RF-EQUIP-07** | Gerar alerta automático quando estoque cai abaixo do mínimo | M06 | `config_insumo` (insumo_id, quantidade_minima), `alerta_estoque` (trigger: SALDO < MINIMO) | — | ✅ Claro |
| **RF-EQUIP-08** | Permitir criar requisição de compra de reposição com aprovação | M06 | `requisicao_compra` (insumo_id, quantidade, data_requisicao, solicitante_id, status_enum: PENDENTE, APROVADA, ENTREGUE, CANCELADA, aprovador_id) | — | ✅ Claro |

---

## M07 — Relatórios Gerenciais e Dashboard

| RF | Descrição | Módulo | Tabelas | DUV | Status |
|---|---|---|---|---|---|
| **RF-REL-01** | Dashboard proprietário com KPIs: alunos ativos, receita mês, inadimplência, cancelamentos | M07 | `matricula` (COUNT ativo), `pagamento` (SUM mes atual), `matricula_status` (inadimplente), `matricula_cancelamento` | — | ✅ Claro |
| **RF-REL-02** | Visualizar dados consolidados da rede e detalhados por unidade com filtro | M07 | All tables com GROUP BY academia_id | — | ✅ Claro |
| **RF-REL-03** | Gerar relatório de vendas (novas matrículas) por período e unidade | M07 | `matricula` (WHERE created_at BETWEEN dates, GROUP BY academia_id) | — | ✅ Claro |
| **RF-REL-04** | Gerar relatório de cancelamentos com motivo e período | M07 | `matricula_cancelamento` (data_cancelamento, motivo_enum, academia_id) | — | ✅ Claro |
| **RF-REL-05** | Gerar relatório de receita vs inadimplência por unidade | M07 | `pagamento` (SUM por academia), `matricula_status` (COUNT inadimplente por academia) | — | ✅ Claro |
| **RF-REL-06** | Gerar relatório de frequência de alunos no check-in (taxa de comparecimento) | M07 | `checkin_log` (COUNT), `matricula` (dias_ativo CALC), taxa = checkins / dias_ativo | — | ✅ Claro |
| **RF-REL-07** | Gerar relatório de desempenho de professor (quantidade alunos, receita gerada) | M07 | `matricula_professor` (COUNT), `pagamento` (SUM vinculado via comissão) | — | ✅ Claro |
| **RF-REL-08** | Gerar relatório de equipamentos em manutenção e custos acumulados | M07 | `manutencao_corretiva` (SUM custo, JOIN equipamento, WHERE status=MANUTENCAO) | — | ✅ Claro |
| **RF-REL-09** | Permitir exportar relatórios em PDF, Excel, CSV | M07 | (Função técnica de formatação, não cria tabelas novas) | — | ✅ Claro |

---

## M07B — Insumos e Produtos (Alinhado à SPEC-007 / PLAN-007)

| RF | Descrição | Módulo | Tabelas | DUV | Status |
|---|---|---|---|---|---|
| **RF-INSUMO-01** | Cadastrar produtos e insumos por categoria e unidade | M07B | `categoria_produto`, `produto` | — | ✅ Claro |
| **RF-INSUMO-02** | Controlar níveis de estoque (mínimo, máximo, atual) | M07B | `produto` | — | ✅ Claro |
| **RF-INSUMO-03** | Registrar movimentações de estoque (entrada, saída, devolução, ajuste) | M07B | `movimentacao_estoque` | — | ✅ Claro |
| **RF-INSUMO-04** | Permitir venda de produtos com impacto no estoque | M07B | `produto`, `movimentacao_estoque` | — | ✅ Claro |
| **RF-INSUMO-05** | Alertar produtos próximos ao vencimento e vencidos | M07B | `alerta_validade`, `produto` | — | ✅ Claro |
| **RF-INSUMO-06** | Gerar requisição de compra e acompanhar aprovação | M07B | `requisicao_compra` | — | ✅ Claro |
| **RF-INSUMO-07** | Consolidar custos de reposição e consumo por período | M07B | `movimentacao_estoque`, `produto` | — | ✅ Claro |
| **RF-INSUMO-08** | Emitir relatórios de estoque e giro de produtos | M07B | `produto`, `movimentacao_estoque`, `alerta_validade` | — | ✅ Claro |

---

## M08 — Comunicação com Alunos

| RF | Descrição | Módulo | Tabelas | DUV | Status |
|---|---|---|---|---|---|
| **RF-COM-01** | Permitir enviar avisos/comunicados para aluno individual ou grupo | M08 | `comunicacao` (aluno_id_list OR grupo_id, conteudo_texto, data_envio, usuario_solicitante_id, academia_id OR NULL=rede) | — | ✅ Claro |
| **RF-COM-02** | Registrar histórico de comunicações (data, conteúdo, alunos atingidos) | M08 | `comunicacao` (todas linhas mantidas, linked via `comunicacao_aluno`) | — | ✅ Claro |
| **RF-COM-03** | Permitir criar templates de mensagens para reuso | M08 | `comunicacao_template` (nome, conteudo_template_com_placeholders) | — | ✅ Claro |
| **RF-COM-04** | Notificar aluno de vencimento de mensalidade (automático ou manual) | M08 | `comunicacao` (tipo_enum: NOTIFICACAO_VENCIMENTO), `config_parametro` (dias_antecedencia_notificacao) | — | ✅ Claro |
| **RF-COM-05** | Permitir envio futuro de comunicados (agendamento) | M08 | `comunicacao` (data_agendada_envio, status_enum: RASCUNHO, AGENDADA, ENVIADA, CANCELADA) | — | ✅ Claro |

---

## Resumo de Impactos por Status

### ✅ Requisitos Claros (Atualizado em 4 abr 2026)

**Total mapeado**: 70+ RFs entre módulos e integrações cruzadas  
**Cobertura PLAN x Matriz**: Atualizada e alinhada  
**Complexidade**: Média/Alta

### ⛔ Requisitos Descoped

| RF | Razão | Quando |
|---|---|---|
| **RF-ACE-07** | Integração com catraca eletrônica | Futuro (DP-CATRACA-001) |

---

## Relações Críticas entre Tabelas

### Diagrama Conceitual (Simplified)

```
ALUNO
  ├─ 1:N MATRICULA (aluno pode ter matrículas em múltiplas academias)
  │   ├─ N:1 ACADEMIA
  │   ├─ N:1 PLANO
  │   ├─ 1:N MATRICULA_STATUS (histórico de bloqueios)
  │   ├─ 1:N PAGAMENTO (mensalidades e extras)
  │   ├─ 1:N MATRICULA_PROFESSOR (professor responsável)
  │   └─ 1:N AVALIACAO_FISICA
  │
  ├─ 1:N CHECKIN_LOG (acesso)
  │   └─ N:1 ACADEMIA
  │
  └─ 1:N COMUNICACAO_ALUNO (mensagens recebidas)

PROFESSOR
  ├─ N:N ESPECIALIDADE (PROFESSOR_ESPECIALIDADE)
  ├─ 1:N AULA
  │   ├─ N:1 ACADEMIA
  │   ├─ N:N ALUNO (AULA_ALUNO)
  │   └─ 1:N AULA_PRESENCA
  │
  ├─ 1:N COMISSAO_CALCULO (cálculos mensais)
  │   ├─ N:1 AULA (origem)
  │   └─ N:1 CONFIG_COMISSAO
  │
  └─ 1:N PROFESSOR_PERMISSAO (roles: avaliador, instrutor)

EQUIPAMENTO
  ├─ N:1 ACADEMIA
  └─ 1:N MANUTENCAO (PREVENTIVA, CORRETIVA)

CONFIG_PARAMETRO (tabela de configuração)
  ├─ dias_carencia (DUV-06)
  ├─ taxa_juros_percent (RF-FIN-03)
  ├─ dias_proxima_avaliacao (RF-AVAL-04)
  └─ dias_antecedencia_notificacao_vencimento (RF-COM-04)

CONFIG_COMISSAO
  ├─ tipo_aula_enum
  ├─ percentual_comissao (CRÍTICO: depende DUV-03)
```

---

## Decisões de DUV Aplicadas

| DUV | Decisão aplicada na matriz | Impacto |
|---|---|---|
| **DUV-03** | Comissão por aluno mensal | RF-FIN-09, RF-PROF-04/05/07 e RF-REL-07 liberadas |
| **DUV-06** | Carência de 3 dias | RF-ACE-03 liberada |
| **DUV-07** | Produtos iniciais definidos | RF-INSUMO-01..08 consolidadas |

---

## Próximos Passos

### 1. **V Alidação desta Matriz** (1h)
   - Verificar com Jonathan: "Todas as tabelas propostas fazem sentido?"
   - Resolver DUV-03 (comissão) = desbloqueia 4 RFs

### 2. **Criar ERD Detalhado** (3h)
   - Expandir diagrama conceitual para ERD completo (Lucidchart/Miro)
   - Incluir todos os campos, tipos, constraints, indexes
   - Resultado: Documento `modelo-dados-conceptual.md`

### 3. **Iniciar SPEC-001** (4h)
   - Usando esta matriz: RF-CAD-01 a 08 + RF-ACE-01, 02, 04, 05, 06
   - Criar fluxos de tela, casos de uso, validações

---

**Última atualização**: 2 de abril de 2026  
**Próxima revisão**: Após resolução de DUV-03 (comissão)
