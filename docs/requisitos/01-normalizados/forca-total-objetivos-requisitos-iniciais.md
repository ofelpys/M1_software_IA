# Rede Força Total Academias — Objetivo do Sistema e Requisitos Iniciais

> **Fonte**: `ForcaTotal_Objetivos_Requisitos_Iniciais.docx`  
> **Documento complementar**: Segue `forca-total-historia-operabilidade.md`  
> **Proprietário**: Jonathan Rodrigues Barbosa  
> **Contexto**: 5 unidades ativas, 2.000+ alunos, 40+ profissionais

---

## 1. Premissas Adotadas

- O sistema será desenvolvido para uma **rede de academias de médio porte** (5 unidades em operação, operação crescente).
- Uso abrangerá **perfis variados**: recepcionistas (pouca familiaridade técnica), professores, coordenadores de unidade, proprietário (visão gerencial centralizada).
- **Stack tecnológico**: React (frontend), Java Spring Boot (backend), PostgreSQL (banco de dados).
- Os requisitos abaixo representam um **ponto de partida consistente** e podem ser refinados em entrevistas com coordenadores e observação de rotina real.
- **Arquitetura multi-unidade desde o início**: Nenhuma reescrita ao abrir novas academias no futuro.
- **Acesso centralizado**: O sistema funcionará via internet, garantindo acesso de todas as unidades, com **resiliência para operação básica em caso de instabilidade de conexão** (futuro).
- **Não é projeto greenfield**: Há dados legados e operações já em andamento que devem ser migrados de forma segura.

---

## 2. Objetivo Geral do Sistema

**Integrar e centralizar a operação de uma rede de academias, fornecendo visibilidade consolidada ao proprietário, ferramentas de gestão por unidade e operação simplificada para recepcionistas e professores.**

Objetivos de negócio:
- Eliminar fragmentação de dados entre unidades
- Garantir controle financeiro e de acesso centralizado
- Reduzir retrabalho e erros manuais
- Fornecer base de dados para decisões estratégicas

---

## 3. Objetivos Específicos (OS)

| Código | Objetivo Específico |
|---|---|
| **OS-01** | Centralizar cadastro de alunos, eliminando duplicidades e fichas físicas desconectadas entre unidades |
| **OS-02** | Controlar mensalidades, inadimplência e fluxo de caixa de forma consolidada e por unidade |
| **OS-03** | Gerenciar acesso dos alunos às unidades, integrando com catraca (futuro) ou registro manual, com bloqueio automático de inadimplentes |
| **OS-04** | Registrar e acompanhar avaliações físicas e planos de treino dos alunos, preservando histórico mesmo com troca de professor |
| **OS-05** | Controlar escala e comissões dos professores, cruzando horas previstas com horas realizadas |
| **OS-06** | Acompanhar manutenção preventiva e corretiva dos equipamentos, reduzindo paradas inesperadas |
| **OS-07** | Controlar estoque de insumos da recepção, materiais de limpeza e outros itens operacionais, com alertas de reposição |
| **OS-08** | Fornecer ao proprietário painel gerencial em tempo real com indicadores consolidados de toda a rede |
| **OS-09** | Permitir comunicação estruturada com alunos, com registro de avisos e campanhas por unidade ou para toda a rede |
| **OS-10** | Suportar múltiplas unidades na mesma plataforma sem exigir reescrita de código |

---

## 4. Escopo Inicial do Sistema

### 4.1 Incluído no Escopo

| Módulo | Conteúdo |
|---|---|
| **M01 — Cadastros e Matrículas** | Alunos, professores, coordenadores, fornecedores, categorias de planos |
| **M02 — Controle de Acesso** | Check-in/check-out de alunos, bloqueio automático, histórico de acesso |
| **M03 — Financeiro e Mensalidades** | Recebimentos, inadimplência, formas de pagamento, relatórios de caixa |
| **M04 — Avaliação Física e Planos** | Fichas de avaliação, histórico de evolução, planos de treino, metas |
| **M05 — Professores e Comissões** | Agenda de aulas, escala, comissões, desempenho, pré-visualização de ganhos |
| **M06 — Equipamentos e Estoque** | Inventário de equipamentos, manutenção preventiva/corretiva, estoque de insumos |
| **M07 — Relatórios Gerenciais** | Dashboard proprietário, relatórios por unidade, consolidados, KPIs em tempo real |
| **M08 — Comunicação com Alunos** | Avisos, campanhas, comunicados por email/SMS (futuro), histórico de mensagens |

### 4.2 Incluído de Forma Simplificada (Futuro)

- Integração com catraca de acesso (hardware)
- Automação de cobrança (conexão com gateways de pagamento)
- Aplicativo mobile para alunos (acompanhamento de treino)
- Integração com plataformas de delivery de suplementos
- Sistema de agendamento de avaliações

### 4.3 Fora do Escopo Inicial

- Contabilidade completa (apenas fluxo de caixa operacional)
- Emissão de notas fiscais/recibos de receita
- Integração bancária completa
- Departamento de RH (folha de pagamento)
- BI avançado (apenas dashboards operacionais)
- Automações industriais
- Integrações externas complexas

---

## 5. Requisitos Funcionais Iniciais

### 5.1 Cadastros e Matrículas (RF-CAD)

| Código | Descrição | Origem |
|---|---|---|
| **RF-CAD-01** | O sistema deve permitir cadastrar aluno com dados básicos: nome, CPF, RG, data de nascimento, telefone, email, endereço. | OS-01, CAD-01 |
| **RF-CAD-02** | O sistema deve permitir criar múltiplas matrículas para o mesmo aluno em unidades diferentes. | OS-01, CAD-02 |
| **RF-CAD-03** | O sistema deve validar unicidade de CPF (sem duplicatas de aluno). | OS-01, CAD-01 |
| **RF-CAD-04** | O sistema deve registrar data de matrícula, plano inicial, data de vencimento de mensalidade, perfil de aluno (bronze/prata/ouro = customizável). | OS-02 |
| **RF-CAD-05** | O sistema deve permitir cadastrar professor com nome, CPF, especialidades, telefone, email, data de contratação. | OS-05 |
| **RF-CAD-06** | O sistema deve permitir cadastrar coordenador de unidade com nome, CPF, telefone, email, unidade responsável. | OS-10 |
| **RF-CAD-07** | O sistema deve permitir classificar alunos por status: ativo, suspenso, cancelado, inadimplente. | OS-02, OS-03 |
| **RF-CAD-08** | O sistema deve registrar histórico de alterações em cadastros (auditoria): quem alterou, quando, o quê. | Auditoria |

### 5.2 Controle de Acesso (RF-ACE)

| Código | Descrição | Origem |
|---|---|---|
| **RF-ACE-01** | O sistema deve registrar check-in do aluno na unidade (data, hora, unidade, aluno). | OS-03 |
| **RF-ACE-02** | O sistema deve permitir consultar status de aluno em tempo real na recepção (ativo, suspenso, inadimplente). | OS-03, ACE-01 |
| **RF-ACE-03** | O sistema deve bloquear automaticamente acesso de aluno inadimplente após X dias de atraso (configurável). | OS-03, ACE-03 |
| **RF-ACE-04** | O sistema deve registrar motivo de bloqueio (inadimplência, suspensão disciplinar, cancelamento). | OS-03 |
| **RF-ACE-05** | O sistema deve permitir desbloqueio manual por coordenador ou proprietário (com registro). | OS-03 |
| **RF-ACE-06** | O sistema deve fornecer relatório de acesso por período (ex.: últimos 30 dias). | OS-08 |
| **RF-ACE-07** | O sistema deve permitir integração futura com catraca eletrônica (via API). | OS-03 (futuro) |

### 5.3 Financeiro e Mensalidades (RF-FIN)

| Código | Descrição | Origem |
|---|---|---|
| **RF-FIN-01** | O sistema deve registrar recebimento de mensalidade com data, valor, aluno, unidade, forma de pagamento. | OS-02, FIN-01 |
| **RF-FIN-02** | O sistema deve permitir registrar pagamentos parciais (ex.: aluno paga 50% agora, 50% depois). | OS-02 |
| **RF-FIN-03** | O sistema deve calcular automaticamente juros/multa por atraso (taxa e método configuráveis por unidade). | OS-02, FIN-04 |
| **RF-FIN-04** | O sistema deve fornecer visão consolidada de inadimplência por unidade e total da rede. | OS-02, FIN-02 |
| **RF-FIN-05** | O sistema deve permitir gerar boleto/recibo de pagamento (para envio ao aluno). | OS-02 |
| **RF-FIN-06** | O sistema deve registrar todas as formas de pagamento: dinheiro, débito, crédito, PIX. | OS-02 |
| **RF-FIN-07** | O sistema deve permitir parcelamento de atrasos (via análise de caso, com registro de autorização). | OS-02 |
| **RF-FIN-08** | O sistema deve fornecer relatório de fluxo de caixa por período (entrada, saída, saldo). | OS-08 |
| **RF-FIN-09** | O sistema deve integrar dados de receita por professor (para cálculo de comissão). | OS-05 |

### 5.4 Avaliação Física e Planos de Treino (RF-AVAL)

| Código | Descrição | Origem |
|---|---|---|
| **RF-AVAL-01** | O sistema deve permitir registrar avaliação física de aluno com dados: peso, altura, composição corporal, medidas (cintura, peito, etc.). | OS-04 |
| **RF-AVAL-02** | O sistema deve registrar data de avaliação, profissional responsável (personal ou professor), unidade. | OS-04 |
| **RF-AVAL-03** | O sistema deve preservar histórico de avaliações (evolução do aluno ao longo do tempo). | OS-04 |
| **RF-AVAL-04** | O sistema deve sugerir reavaliação quando data anterior ultrapassa X dias (configurável, padrão 30 dias). | OS-04 |
| **RF-AVAL-05** | O sistema deve permitir criar planos de treino (template ou customizado) vinculado a aluno e professor. | OS-04 |
| **RF-AVAL-06** | O sistema deve permitir consultar plano de treino mesmo com mudança de professor (histórico preservado). | OS-04 |
| **RF-AVAL-07** | O sistema deve registrar metas de treino: quantas séries, repetições, exercícios por dia. | OS-04 |
| **RF-AVAL-08** | O sistema deve permitir feedback de professor: progressão, observações, ajustes recomendados. | OS-04 |

### 5.5 Professores, Escala e Comissões (RF-PROF)

| Código | Descrição | Origem |
|---|---|---|
| **RF-PROF-01** | O sistema deve permitir criar agenda de aulas por professor: data, hora, local (unidade), modalidade (musculação, cardio, etc.). | OS-05, PROF-01 |
| **RF-PROF-02** | O sistema deve permitir associar alunos a um professor (aulas privadas, grupos). | OS-05 |
| **RF-PROF-03** | O sistema deve registrar presença confirmada do professor em cada aula. | OS-05, PROF-02 |
| **RF-PROF-04** | O sistema deve calcular comissão por aula ministrada (com % configurável por tipo de aula). | OS-05, PROF-02 |
| **RF-PROF-05** | O sistema deve fornecer pré-visualização de comissão ao professor (acesso ao seu próprio ganho estimado). | OS-05 |
| **RF-PROF-06** | O sistema deve registrar bônus de desempenho (opcional, por unidade). | OS-05 |
| **RF-PROF-07** | O sistema deve gerar relatório de comissão mensal por professor com detalhamento de aulas. | OS-05 |
| **RF-PROF-08** | O sistema deve permitir designar professor responsável por avaliações físicas (perfil). | OS-04 |

### 5.6 Equipamentos, Estoque e Manutenção (RF-EQUIP)

| Código | Descrição | Origem |
|---|---|---|
| **RF-EQUIP-01** | O sistema deve permitir registrar equipamentos por unidade: descrição, modelo, data de aquisição, localização. | OS-06, OPE-01 |
| **RF-EQUIP-02** | O sistema deve permitir registrar manutenção preventiva com calendário (ex.: esteeira a cada 6 meses). | OS-06, OPE-01 |
| **RF-EQUIP-03** | O sistema deve registrar manutenção corretiva: data, problema, solução, custo, responsável. | OS-06, OPE-01 |
| **RF-EQUIP-04** | O sistema deve marcar equipamento como "em manutenção" (indisponível para uso). | OS-06 |
| **RF-EQUIP-05** | O sistema deve permitir controlar estoque de insumos (toalhas, produtos de limpeza, papel, etc.). | OS-07, OPE-02 |
| **RF-EQUIP-06** | O sistema deve registrar entrada e saída de insumos (data, quantidade, responsável). | OS-07, OPE-02 |
| **RF-EQUIP-07** | O sistema deve gerar alerta automático quando estoque cai abaixo do mínimo configurado. | OS-07, OPE-03 |
| **RF-EQUIP-08** | O sistema deve permitir criar requisição de compra de reposição (com aprovação do coordenador/proprietário). | OS-07 |

### 5.7 Relatórios e Painel Gerencial (RF-REL)

| Código | Descrição | Origem |
|---|---|---|
| **RF-REL-01** | O sistema deve fornecer dashboard proprietário com KPIs: alunos ativos (total + por unidade), receita do mês, inadimplência, cancelamentos. | OS-08, GEST-01 |
| **RF-REL-02** | O sistema deve permitir visualizar dados consolidados da rede e detalhados por unidade (com filtro). | OS-08, GEST-01 |
| **RF-REL-03** | O sistema deve gerar relatório de vendas (novas matrículas) por período e unidade. | OS-08 |
| **RF-REL-04** | O sistema deve gerar relatório de cancelamentos com motivo e período. | OS-08 |
| **RF-REL-05** | O sistema deve gerar relatório de receita vs inadimplência por unidade. | OS-08 |
| **RF-REL-06** | O sistema deve gerar relatório de frequência de alunos no check-in (taxa de comparecimento). | OS-08 |
| **RF-REL-07** | O sistema deve gerar relatório de desempenho de professor (quantidade de alunos, receita gerada). | OS-08 |
| **RF-REL-08** | O sistema deve gerar relatório de equipamentos em manutenção e custos acumulados. | OS-08 |
| **RF-REL-09** | O sistema deve permitir exportar relatórios em formatos: PDF, Excel, CSV. | OS-08 |

### 5.8 Comunicação com Alunos (RF-COM)

| Código | Descrição | Origem |
|---|---|---|
| **RF-COM-01** | O sistema deve permitir enviar avisos/comunicados para aluno específico ou grupo (por unidade ou rede). | OS-09 |
| **RF-COM-02** | O sistema deve registrar histórico de comunicações (data, conteúdo, alunos atingidos). | OS-09 |
| **RF-COM-03** | O sistema deve permitir criar templates de mensagens (para reuso). | OS-09 |
| **RF-COM-04** | O sistema deve notificar aluno de vencimento de mensalidade (automático ou manual). | OS-09, FIN-04 |
| **RF-COM-05** | O sistema deve permitir envio futuro de comunicados (agendamento). | OS-09 |

---

## 6. Requisitos Não Funcionais Iniciais (RNF)

| Código | Descrição |
|---|---|
| **RNF-01** | A interface deve ser simples, com poucos passos por operação, linguagem clara e botões facilmente identificáveis. |
| **RNF-02** | O sistema deve ser utilizável por pessoas com pouca familiaridade com computador (recepcionistas, professores). |
| **RNF-03** | O sistema deve possuir autenticação por usuário e senha com perfis de acesso por função (proprietário, coordenador, professor, atendente). |
| **RNF-04** | Todas as operações críticas devem ser registradas para auditoria: data, hora, usuário, ação, entidade modificada. |
| **RNF-05** | O sistema deve persistir dados de forma confiável, com backup automático periódico. |
| **RNF-06** | O tempo de resposta das operações comuns (check-in, consulta de aluno) deve ser < 2 segundos. |
| **RNF-07** | O sistema deve ser escalável para suportar múltiplas unidades sem perda de performance. |
| **RNF-08** | O sistema deve apresentar mensagens de erro compreensíveis ao usuário (ex.: "Aluno não encontrado" em vez de "Error 404"). |
| **RNF-09** | O sistema deve ser organizado em camadas coerentes (frontend, backend, banco de dados). |
| **RNF-10** | Os nomes de telas, campos e relatórios devem refletir a linguagem cotidiana das academias. |
| **RNF-11** | O sistema deve ser facilmente mantível e expansível sem acoplamento excessivo entre módulos. |
| **RNF-12** | O sistema deve suportar operações críticas mesmo com internet lenta (futuro: modo offline parcial). |
| **RNF-13** | A autenticação deve usar mecanismo seguro (hash bcrypt/BCrypt, não armazenar senhas em texto plano). |
| **RNF-14** | O sistema deve validar dados tanto no frontend (UX) quanto no backend (segurança). |

---

## 7. Requisitos Operacionais e de Uso (ROP)

| Código | Descrição |
|---|---|
| **ROP-01** | Deve existir pelo menos um ponto de acesso ao sistema em cada unidade (recepção operando em tempo integral durante horário de funcionamento). |
| **ROP-02** | O fluxo de check-in do aluno deve ser concluído em no máximo 3 interações de tela, para não comprometer o ritmo da recepção. |
| **ROP-03** | O painel de inadimplência deve estar acessível ao coordenador de cada unidade e ao administrador da rede sem necessidade de gerar relatório manual. |
| **ROP-04** | Professores devem conseguir consultar ficha e plano de treino de um aluno sem depender de papéis físicos ou de terceiros. |
| **ROP-05** | O painel gerencial do proprietário deve ser ponto de entrada padrão do perfil administrador, exibindo os indicadores mais críticos logo após login. |
| **ROP-06** | Alertas de equipamento em manutenção, estoque mínimo e reavaliação física pendente devem aparecer automaticamente, sem necessidade de consulta manual. |
| **ROP-07** | O sistema deve prever uso predominantemente via navegador, responsivo (desktop, tablet, mobile). |
| **ROP-08** | Operações críticas de recepção (consulta de cadastro, liberação de acesso) devem ser possíveis mesmo por usuários com pouca familiaridade digital. |
| **ROP-09** | Todas as operações relevantes devem ser rastreáveis por usuário responsável (sem ações "anônimas"). |

---

## 8. Perguntas de Levantamento que Ainda Precisam ser Respondidas

> **Status**: Não respondidas. Devem ser confirmadas em entrevistas com Jonathan e coordenadores.

| ID | Pergunta | Impacto |
|---|---|---|
| **DUV-01** | Quantas catracas ou pontos de controle de acesso existem em cada unidade? Há integração física ou acesso é registrado manualmente? | Arquitetura de integração hardware |
| **DUV-02** | Os professores terão acesso ao sistema via computador na academia ou precisam de acesso por celular? | Frontend mobile ou web responsivo |
| **DUV-03** | Qual é o modelo de comissionamento dos professores: por aluno ativo, por aula ministrada, por plano vendido ou combinação? | Cálculo de comissão complexo |
| **DUV-04** | Há alunos com planos compartilhados entre cônjuges ou dependentes na mesma matrícula? | Modelagem de aluno/matrícula |
| **DUV-05** | O sistema de ponto dos funcionários deve ser eletrônico, ou o controle de presença será feito por lançamento manual? | Integração com relógio de ponto |
| **DUV-06** | Qual é o prazo de carência tolerado antes do bloqueio automático de acesso por inadimplência (dias)? | Configuração de regra de negócio |
| **DUV-07** | Haverá venda de produtos físicos na recepção (suplementos, acessórios)? Se sim, o sistema deve controlar esse estoque? | Escopo de estoque |
| **DUV-08** | Jonathan deseja receber relatórios por e-mail em periodicidade fixa, ou prefere acessar o painel sob demanda? | Automação de relatórios (futuro) |
| **DUV-09** | As avaliações físicas serão feitas por qualquer professor ou apenas por profissionais designados? | Controle de permissão |
| **DUV-10** | Há necessidade de integração futura com aplicativo próprio para o aluno acompanhar treinos e evolução? | Roadmap futuro |

---

## 9. Sugestão de Organização Modular para Implementação

| Módulo | Prioridade | Motivo |
|---|---|---|
| **M01 — Cadastros e Matrículas** | 🟥 CRÍTICA (P1) | Base de dados dos alunos. Tudo depende disso. |
| **M02 — Controle de Acesso** | 🟥 CRÍTICA (P1) | Maior dor de Jonathan. Segurança e fraude. |
| **M03 — Financeiro e Mensalidades** | 🟥 CRÍTICA (P1) | Visibilidade de inadimplência consolid. |
| **M07 — Relatórios Gerenciais** | 🟥 CRÍTICA (P2) | Validador de todo o sistema. Dashboard do proprietário. |
| **M04 — Avaliação Física e Planos** | 🟡 ALTA (P3) | Diferencial operacional. |
| **M05 — Professores, Escala e Comissões** | 🟡 ALTA (P3) | RH integrada. Comissões precisam de integridade. |
| **M06 — Equipamentos, Estoque e Manutenção** | 🟡 ALTA (P4) | Operacional. Pode ser feito em paralelo. |
| **M08 — Comunicação com Alunos** | 🟢 MÉDIA (P5) | Nice-to-have inicial. Implementar depois de core. |

---

## 10. Encerramento

Este documento não substitui:
- Entrevistas especializadas
- Observação de campo nas 5 unidades
- Refinamento técnico posterior

Seu papel é consolidar com rigor a transição entre história do problema e fase de especificação inicial, criando uma **base consistente** para:
- Modelagem de dados relacional
- Definição de APIs entre frontend e backend
- Casos de uso detalhados
- Fluxos de tela e prototipagem
- Decisões de arquitetura

**42+ requisitos funcionais mapeados** cobrem 8 módulos propostos e partem diretamente dos problemas identificados na história narrativa.

**Prioridade de implementação**: Seguir impacto direto sobre Jonathan:
1. **Cadastros e Acesso** — Base de tudo
2. **Financeiro** — Soluções maiores problemas
3. **Relatórios Gerenciais** — Validador de todo o restante

**Arquitetura multi-unidade não é feature futura — é premissa de projeto.**

---

## Próximos Passos

1. ✅ História e operabilidade (normalizado)
2. ✅ Objetivos e requisitos (este documento)
3. ⏭️ **Mapa-mestre**: Consolidar conflitos, decisões pendentes, alinhamentos
4. ⏭️ **Especificações (SPECs)**: Uma SPEC por fluxo crítico
5. ⏭️ **Planos (PLANs)**: Decisões técnicas (DB, API, componentes)
6. ⏭️ **Prototipagem**: Telas em React
7. ⏭️ **Tasks**: Decomposição técnica pronta para dev
8. ⏭️ **Código**: Implementação real
