# Glossário de Termos — Rede Força Total Academias

> **Versão**: 1.0  
> **Data**: 2 de abril de 2026  
> **Escopo**: Terminologia técnica, funcional e operacional do sistema M1  
> **Público**: Desenvolvedores, analistas, coordenadores, proprietário

---

## A

### Academia
**Definição**: Unidade física da rede Força Total onde ocorrem aulas, avaliações e atendimento ao público.

- **Sinônimos**: Filial, Unidade, Ponto de Funcionamento
- **Contexto**: Sistema suporta 5 academias em operação, com possibilidade de expansão
- **Atributos**: Código único, nome, endereço, telefone, coordenador responsável, horário de funcionamento
- **Exemplo**: Academia Centro (001), Academia Bairro A (002)
- **Relacionamentos**: 
  - 1:N com Alunos (via Matrículas)
  - 1:N com Professores (alocação)
  - 1:N com Equipamentos

### Acesso (Controle de)
**Definição**: Gerenciamento da autorização de entrada de alunos nas academias.

- **Sinônimos**: Controle de entrada, Check-in/Check-out
- **Contexto**: Registra presença, valida status de pagamento, bloqueia automaticamente inadimplentes
- **Fluxo**: 
  1. Aluno chega na recepção
  2. Recepcionista consulta status (ativo/suspenso/inadimplente)
  3. Se ativo: check-in registrado → aluno entra
  4. Se inadimplente: bloqueio automático → acesso negado
- **Métodos possíveis**:
  - Manual: Recepcionista registra no sistema
  - Futuro: Integração com catraca eletrônica (DP-CATRACA-001)

### Ativo (Status)
**Definição**: Classificação de aluno cujas pendências estão quitadas e mensalidade vigente.

- **Sinônimos**: Regularizado, Liberado
- **Condições**: 
  - Mensalidade paga ou em dia
  - Sem suspensão disciplinar
  - Sem cancelamento registrado
  - Acesso à academia: **PERMITIDO**
- **Transições possíveis**: → Suspenso | → Inadimplente | → Cancelado

### Ativo (Operacional)
**Definição**: Recurso material da operação (equipamento, insumo, etc.).

- **Exemplos**: Máquinas de musculação, pesos livres, toalhas, produtos de limpeza
- **Gestão**: Controle de inventário, manutenção, validade

### Avaliação Física
**Definição**: Documento que registra medidas corporais de aluno em um ponto no tempo.

- **Sinônimos**: Ficha de avaliação, Composição corporal
- **Dados coletados**: 
  - Peso, altura, IMC
  - Medidas: cintura, peito, quadril, etc.
  - Percentual de gordura
  - Relatório técnico (opcional)
- **Frequência recomendada**: A cada 30 dias (configurável)
- **Responsável**: Professor designado ou Personal Trainer
- **Histórico**: Sistema preserve todas as avaliações para análise de evolução
- **Ações associadas**: Criar ou ajustar plano de treino com base em progresso

---

## B

### Bloqueio Automático
**Definição**: Ação do sistema que nega acesso a aluno quando condição de bloqueio é acionada.

- **Motivos**: 
  - Inadimplência (após X dias de atraso — configurável)
  - Suspensão disciplinar (manual)
  - Cancelamento
- **Fluxo**: 
  1. Sistema detecta condição (ex.: aluno 10 dias atrasado)
  2. Status muda para "Bloqueado"
  3. Recepção vê "Acesso negado" ao consultar
  4. Aluno não consegue fazer check-in
- **Desbloqueio**: Manual, por coordenador ou proprietário (com registro)

### Bônus
**Definição**: Incentivo financeiro adicional à comissão base de professor.

- **Tipos**: 
  - Performance (ex.: quantidade de alunos novos captados)
  - Assiduidade (ex.: 100% de aulas dadas no mês)
  - Resultado (ex.: aumento de receita da unidade)
- **Cálculo**: Configurável por unidade ou por professor
- **Frequência**: Geralmente mensal (configurável)
- **Nota**: DUV-03 ainda define modelo exato

---

## C

### Cadastro
**Definição**: Registro de informações de uma pessoa, equipamento ou entidade no sistema.

- **Tipos**: 
  - Cadastro de Aluno
  - Cadastro de Professor
  - Cadastro de Coordenador
  - Cadastro de Fornecedor
- **Validações básicas**: 
  - CPF único (sem duplicatas)
  - Email válido
  - Data de nascimento coerente
- **Auditoria**: Registro de qui criou, quando e quem já modificou

### Cancelado (Status)
**Definição**: Classificação de aluno cuja relação com academia foi encerrada permanentemente.

- **Causas possíveis**: 
  - Solicitação do aluno
  - Non-compliance disciplinar
  - Falta de pagamento prolongada (inadimplência máxima)
- **Acesso à academia**: **NEGADO**
- **Histórico**: Dados não são apagados (preservação para auditoria)
- **Reversão**: Geralmente não é permitida (opcional: reativação como novo cadastro)

### Catraca
**Definição**: Dispositivo eletrônico de controle de acesso (futuro).

- **Status atual**: Descoped (DP-CATRACA-001)
- **Função pretendida**: 
  - Ler cartão ou RFID do aluno
  - Validar status em tempo real
  - Registrar automaticamente check-in
  - Liberar ou bloquear porta
- **Integração**: Via API entre catraca e backend do sistema
- **Nota**: Operação atual é 100% manual (recepcionista registra)

### Check-in / Check-out
**Definição**: Ato de registrar entrada e/ou saída de aluno na academia.

- **Check-in**: Marcação de entrada (obrigatória)
- **Check-out**: Marcação de saída (opcional, registro para histórico de presença)
- **Via**: 
  - Manual: Recepcionista clica no sistema
  - Futuro: Catraca automática
- **Registro**: Data, hora, academia, aluno, validação de status
- **Prazo**: Deve ser concluído em ≤ 3 interações de tela (ROP-02)

### Comissão
**Definição**: Remuneração variável de professor vinculada a indicadores de desempenho.

- **Modelo**: DUV-03 aberto
- **Possibilidades**:
  - Por aula ministrada (% sobre valor da aula)
  - Por aluno ativo atribuído
  - Por plano de treino vendido
  - Combinação dos acima (peso configurável)
- **Cálculo**: Mensal (configurável)
- **Visualização**: Professor pode acessar pré-visualização de ganho estimado
- **Auditoria**: Histórico completo de cálculos por período

### Cônjuge / Dependente
**Definição**: Pessoa vinculada a aluno em plano compartilhado (DUV-04 aberta).

- **Status**: Questão em aberto se academias permitem
- **Se SIM**: Impacto em modelo de matrícula, check-in, coleta de dados
- **Se NÃO**: Cada pessoa precisa de cadastro e matrícula separados

### Coordenador de Unidade
**Definição**: Gestor responsável por uma ou mais academias específicas.

- **Perfil de acesso**: Dados daquela(s) unidade(s) + relatórios consolidados dela(s)
- **Responsabilidades**: 
  - Supervisão de recepcionistas e professores
  - Aprovação de requisições (compra, comissões excepcionais)
  - Resolução de inadimplência
  - Manutenção preventiva de equipamentos
- **Diferença do Proprietário**: Visão local vs. visão de rede inteira

---

## D

### Desbloqueio Manual
**Definição**: Ação autorizada de liberar aluno bloqueado antes de resolver a causa do bloqueio.

- **Contexto**: Ex.: aluno com 5 dias de atraso, mas com comprovante de pagamento em processamento
- **Permissão**: Coordenador ou Proprietário
- **Registro**: Data, hora, quem desbloqueou, motivo justificado
- **Auditoria**: Todas as ações rastreáveis

### Dia de Carência
**Definição**: Período de tolerância após vencimento de mensalidade antes de bloqueio automático.

- **Exemplo**: Carência de 5 dias = aluno atrasado até dia 5 pode entrar, bloqueio ocorre no dia 6
- **Definição**: DUV-06 aberta (configurável)
- **Variação**: Pode ser diferente por tipo de plano ou unidade

---

## E

### Equipamento
**Definição**: Bem físico da academia necessário para funcionamento operacional.

- **Exemplos**: 
  - Máquinas de musculação: leg press, supino, esteira
  - Pesos livres: halteres, barras
  - Acessórios: colchonetes, cordas, bolas
- **Gestão**: 
  - Inventário com código, localização, data de aquisição
  - Histórico de manutenção (preventiva e corretiva)
  - Status: Operacional | Em Manutenção | Descartado
- **Manutenção**: Cuidados preventivos regulares para evitar quebras

### Especialidade (Professor)
**Definição**: Área de conhecimento ou tipo de aula que professor conduz.

- **Exemplos**: Musculação, Cardio, Pilates, Yoga, Dança, CrossFit, Funcional
- **Múltiplas especialidades**: Um professor pode ter mais de uma
- **Vínculo**: Usado para alocação de aulas e atribuição de alunos

### Estoque de Insumos
**Definição**: Controle de materiais consumíveis necessários para operação.

- **Exemplos**: 
  - Toalhas
  - Produtos de limpeza
  - Papel toalha
  - Sabonete
  - Desinfetante
- **Operações**: Entrada (compra), saída (uso), controle de mínimo
- **Alerta automático**: Quando estoque cai abaixo do mínimo configurado

---

## F

### Filial
**Sinônimo de**: Academia, Unidade

### Franqueado
**Definição**: (Possível futuro) Proprietário de academia franqueada da rede.

- **Nota**: Não é escopo inicial (usuário é Jonathan, proprietário único atual de 5 academias)

### Frequência (Taxa de)
**Definição**: Métrica que mede quantas vezes aluno compareceu vs. quanto tempo está ativo.

- **Cálculo**: (Check-ins últimos 30 dias) / (Dias que academia esteve aberta nos últimos 30)
- **Relatório**: RF-REL-06 oferece essa visibilidade
- **Uso**: Identificar alunos inativos, estratégia de retenção

---

## G

### Ganho (Professor)
**Sinônimo**: Comissão estimada

---

## H

### Histórico
**Definição**: Registro temporal completo de alterações, ações ou evolução de uma entidade.

- **Exemplos**:
  - Histórico de avaliação física (múltiplas medições no tempo)
  - Histórico de acesso (check-ins registrados)
  - Histórico de comissão (cálculos mensais)
  - Histórico de alteração de cadastro (auditoria: quem, quando, o quê)
- **Preservação**: Nenhum dado histórico deve ser apagado (apenas marcado como cancelado se necessário)

### Horário de Funcionamento
**Definição**: Período diário durante o qual academia está aberta.

- **Exemplo**: Segunda a sexta 06:00 - 22:00, Sábado 08:00 - 18:00, Domingo fechado
- **Impacto**: Cálculo de frequência, alertas de manutenção, planejamento de aulas

---

## I

### Inadimplência
**Definição**: Situação onde aluno tem mensalidade vencida e não paga.

- **Status**: Aluno passa de "Ativo" para "Inadimplente" quando ultrapassa carência
- **Sinônimos**: Atraso, Mora
- **Ações**: 
  - Bloqueio automático de acesso
  - Notificação ao aluno
  - Relatório consolidado ao coordenador
- **Resolução**: Aluno paga → volta a "Ativo"
- **Relatório**: RF-FIN-04 oferece visão consolidada de inadimplência

### Inadimplente (Status)
**Definição**: Classificação de aluno com mensalidade vencida além do período de carência.

- **Condições**: Mensalidade vencida por mais de X dias (carência configurável)
- **Acesso à academia**: **NEGADO** (bloqueio automático)
- **Ação necessária**: Pagamento para voltar a "Ativo"
- **Transições**: Ativo → Inadimplente → Ativo (após pagamento)

### Inapto (Equipamento)
**Conceito relacionado**: Equipamento em manutenção, não disponível para uso

## Insumo
**Sinônimo**: Estoque de Insumos

---

## J

### Juros / Multa
**Definição**: Incremento percentual na mensalidade por atraso no pagamento.

- **Configuração**: 
  - Taxa e método (juros simples, composto, multa fixa)
  - Diferente por unidade (opcional)
- **Cálculo**: Automático (RF-FIN-03)
- **Exemplo**: 2% de multa por mês em atraso, máximo 10%

---

## K

### KPI (Key Performance Indicator)
**Definição**: Indicador chave de desempenho exibido no dashboard gerencial.

- **Exemplos**:
  - Total de alunos ativos (por unidade + consolidado)
  - Receita do mês (consolidada + por módulo: mensalidades, aulas extras)
  - Taxa de inadimplência (%)
  - Taxa de cancelamento (%)
  - Frequência média de alunos (presença)
  - Desempenho por professor (receita gerada)
- **Atualização**: Tempo real (≤ 2 segundos de latência — RNF-06)

---

## M

### Manutenção Corretiva
**Definição**: Reparo de equipamento que sofreu falha ou defeito.

- **Registro**: Data, hora, problema, solução, custo, responsável
- **Status do equipamento**: Mudança para "Em Manutenção" (indisponível)
- **Histórico**: Preservação de todos os reparos para análise de padrões
- **Exemplo**: Esteira parou de funcionar → reparada em 2 dias → custo R$ 500

### Manutenção Preventiva
**Definição**: Serviço regular em equipamento para evitar falhas.

- **Calendário**: Ex.: revisão completa a cada 6 meses
- **Exemplo**: Limpeza interna, revisão de cabos, lubrificação de articulações
- **Status do equipamento**: Pode permanecer "Operacional" se for rápido, ou ir para "Em Manutenção"
- **Benefício**: Reduz paradas inesperadas e prolonga vida útil

### Matrícula
**Definição**: Contrato de vinculação entre aluno e academia para um período.

- **Atributos**:
  - Aluno (1)
  - Academia (1)
  - Data de matrícula
  - Plano (tipo de serviço)
  - Data de vencimento (quando próximo pagamento é devido)
  - Status (ativo, suspenso, cancelado)
  - Histórico de pagamentos
- **Multiplicidade**: Um aluno pode ter múltiplas matrículas (uma por academia)
- **Diferença de Aluno**: Aluno é a pessoa, Matrícula é o vínculo com academia + plano
- **Cancelamento**: Pode ser feito a qualquer momento com registro de motivo

### Mensalidade
**Definição**: Valor recorrente cobrado do aluno pelo direito de usar a academia mensalmente.

- **Sinônimo**: Taxa mensal, Anuidade (se feita anualmente)
- **Vencimento**: Configurável (ex.: todo dia 5 do mês)
- **Formas de pagamento**: Dinheiro, débito, crédito, PIX (RF-FIN-06)
- **Relatório**: RF-FIN-01 e RF-FIN-08 rastreiam receita

### Métricas
**Contexto**: Sistema calcula e exibe métricas operacionais para decisão (ex.: KPIs, frequência, comissão)

---

## N

### Não Funcional (Requisito)
**Definição**: Atributo de qualidade do sistema (não é funcionalidade, é como a funcionalidade é entregue).

- **Exemplos**:
  - Interface simples (RNF-01)
  - Segurança de autenticação (RNF-13)
  - Performance < 2 segundos (RNF-06)
  - Escalabilidade para múltiplas unidades (RNF-07)

### Notificação
**Definição**: Mensagem automática enviada ao aluno sobre evento relevante.

- **Exemplos**:
  - Vencimento de mensalidade próximo (RF-COM-04)
  - Reavaliação física recomendada
  - Bloqueio por inadimplência
- **Canal**: Email, SMS (futuro), notificação push no app

---

## O

### Objetivo Específico (OS)
**Definição**: Resultado mensurável que o sistema deve alcançar.

- **Exemplo**: OS-01: "Centralizar cadastro de alunos, eliminando duplicidades"
- **Uso**: Origem dos requisitos funcionais
- **Total**: 10 objetivos específicos (OS-01 a OS-10)

---

## P

### Performance
**Definição**: Velocidade e responsividade do sistema.

- **Métrica**: Tempo de resposta deve ser < 2 segundos (RNF-06) para operações comuns
- **Operações comuns**: Check-in, consulta de aluno, geração de relatório simples

### Perfil de Acesso
**Definição**: Conjunto de permissões atribuído a usuário baseado em função.

- **Perfis**: 
  - Proprietário (visão rede inteira + controle administrativo)
  - Coordenador (visão unidade(s) responsável(eis))
  - Professor (visão pessoal + alunos atribuídos)
  - Recepcionista/Atendente (operações básicas: check-in, consulta)
- **Implementação**: Controle de acesso baseado em papel (RBAC)

### Perfil de Aluno
**Definição**: Classificação de aluno por nível de investimento ou serviços.

- **Exemplo**: Bronze | Prata | Ouro
- **Diferenças**: Acesso a salas, prioridade de agendamento, aulas extras incluídas
- **Configuração**: Customizável por academia

### Personal Trainer
**Sinônimo**: Professor (com especialidade em treinamento personalizado)

### Plano (de Treino)
**Definição**: Documento que especifica exercícios, séries, repetições e repouso para aluno.

- **Atributos**:
  - Aluno (1)
  - Professor responsável (1)
  - Data de criação
  - Objetivo (ex.: ganho de massa, perda de gordura, manutenção)
  - Exercícios listados com séries/reps/carga
  - Duração sugerida (ex.: 12 semanas)
  - Atualizações/histórico
- **Preservação**: Histórico mantido mesmo se professor sair ou aluno trocar de professor
- **Feedback**: Professor pode registrar progressão e ajustes recomendados (RF-AVAL-08)

### Plano (de Serviço / Tipo de Matrícula)
**Definição**: Categoria de adesão que define direitos e custos para aluno.

- **Exemplos**: 
  - Plano básico (acesso a musculação)
  - Plano completo (musculação + aulas colativas)
  - Plano aulas (apenas aulas, sem acesso a musculação)
- **Atributos**: Nome, preço mensal, direitos (quais salas/aulas inclui)
- **Compartilhado**: DUV-04 em aberto se cônjuges podem compartilhar

### Ponto (de Funcionários)
**Definição**: Sistema de registro de presença de funcionários (professores, recepcionistas).

- **Status**: DUV-05 aberta se será eletrônico ou lançamento manual
- **Fora do escopo inicial**: Não é prioridade (apenas comissão de professor está em escopo)

### Professor
**Definição**: Profissional que conduz aulas, cria planos de treino e faz avaliações físicas.

- **Atributos**:
  - Nome, CPF, especialidades, telefone, email
  - Data de contratação
  - Academias onde trabalha (1 ou mais)
  - Disponibilidade / horários
- **Acesso**: DUV-02 aberta se será computador fixo ou celular
- **Comissão**: RF-PROF-04, entidade recebe com base em aulas/alunos
- **Nota**: Algumas academias têm "profissional autônomo" — modelo ainda a definir

### Programa
**Conceito**: Conjunto de módulos do sistema que formam uma solução integrada

### Proprietário
**Definição**: Jonathan Rodrigues Barbosa, dono da rede Força Total Academias.

- **Acesso**: Proprietário (perfil administrativo total, visão de rede inteira)
- **Responsabilidades**: Decisões estratégicas, aprovação de exceções, acesso ao dashboard gerencial
- **Visibilidade**: Dados consolidados em tempo real de todas as 5 academias

---

## Q

### Qualidade (Atributo)
**Contexto**: Sistema será avaliado em qualidade: interface simples, dados confiáveis, auditoria completa

---

## R

### Rede (Força Total)
**Definição**: Conjunto de academias conectadas sob mesmo proprietário e sistema.

- **Escopo atual**: 5 academias
- **Arquitetura**: Multi-unidade desde o início (sem reescrita futura)
- **Centralização**: Dados consolidados para visão de rede

### Recebimento
**Definição**: Transação de entrada de dinheiro pela mensalidade ou serviço adicional.

- **Registro**: Data, valor, aluno, unidade, forma de pagamento (RF-FIN-01)
- **Parcialidade**: Pode haver pagamentos parciais (RF-FIN-02)
- **Relatório**: Rastreado em fluxo de caixa mensal (RF-FIN-08)

### Recepcionista / Atendente
**Definição**: Profissional que trabalha na recepção da academia.

- **Responsabilidades**: 
  - Check-in/check-out de alunos
  - Consulta de status de aluno
  - Orientação ao aluno
  - Recebimento de mensalidades (em caixa manual ou via sistema)
- **Perfil de usuário**: Pouca familiaridade técnica (interface deve ser muito simples — RNF-01, RNF-02)
- **Privacidade**: Não tem acesso a dados de outras unidades além da sua

### Registrar / Registro
**Contexto**: Ato de anotar uma informação no sistema.

- **Exemplos**: Registrar check-in, registrar comissão, registrar manutenção
- **Auditoria**: Cada registro deve ter quem, quando, o quê

### Relatório
**Definição**: Documento gerado pelo sistema com dados consolidados e análises.

- **Tipos**:
  - Relatório de acesso (RF-ACE-06)
  - Relatório de inadimplência (RF-FIN-04)
  - Relatório de fluxo de caixa (RF-FIN-08)
  - Relatório de frequência (RF-REL-06)
  - Relatório de desempenho de professor (RF-REL-07)
  - Relatório de comissão (RF-PROF-07)
- **Exportação**: PDF, Excel, CSV (RF-REL-09)
- **Acesso**: Basado em perfil (proprietário vê rede, coordenador vê unidade)

### Requisito Funcional (RF)
**Definição**: Coisa que o sistema deve fazer (funcionalidade).

- **Formato**: "O sistema deve permitir...", "O sistema deve registrar..."
- **Exemplo**: RF-CAD-01: "O sistema deve permitir cadastrar aluno com dados básicos"
- **Rastreabilidade**: Cada RF vinculado a Objetivo Específico (OS) e DUV

### Requisito Não-Funcional (RNF)
**Definição**: Atributo de qualidade que o sistema deve ter.

- **Exemplo**: RNF-06: "Tempo de resposta < 2 segundos"

### Requisito Operacional (ROP)
**Definição**: Restrição de como o sistema é usado em operação.

- **Exemplo**: ROP-02: "Check-in deve ser concluído em máx. 3 interações de tela"

### Reversão
**Contexto**: (Conceito) Se aluno cancelado pode ser reativado (não está definido)

---

## S

### Saída (Estoque)
**Definição**: Registro de consumo ou retirada de insumo do estoque.

- **Exemplo**: Recepcionista retira 10 toalhas da estante
- **Rastreamento**: Data, quantidade, responsável
- **Alerta**: Se saldo fica abaixo de mínimo, gera alerta automático

### Segurança
**Requisitos**:
  - RNF-13: Autenticação com hash bcrypt
  - RNF-03: Perfis de acesso discriminados por função
  - RNF-04: Auditoria de todas as operações

### Suspensão (Status)
**Sinônimo**: Suspenso

### Suspenso (Status)
**Definição**: Classificação de aluno temporariamente impedido de acessar academia.

- **Motivos**: 
  - Suspensão disciplinar (comportamento inadequado)
  - Solicitação do próprio aluno (férias, período probatório)
- **Acesso à academia**: **NEGADO**
- **Diferença de Cancelado**: Suspensão implica possibilidade de reativação; cancelado é permanente
- **Transições**: Ativo → Suspenso → Ativo (após levantamento da suspensão)

---

## T

### Template (de Mensagem)
**Definição**: Mensagem pré-formatada que pode ser reusada para comunicações com alunos.

- **Exemplo**: "Olá {{aluno}}, sua mensalidade vence em {{dias}} dias. Acesse..."
- **Uso**: Eficiência ao enviar comunicados em massa

### Tolerância
**Sinônimo**: Carência (período de tolerância antes de bloqueio)

### Treinador
**Sinônimo**: Professor

---

## U

### Unicidade
**Contexto**: Garantir que não há duplicatas (ex.: RF-CAD-03 garante unicidade de CPF entre alunos)

### Unidade
**Sinônimo de**: Academia

### Usuário
**Definição**: Pessoa que acessa o sistema com login e permissões definidas.

- **Tipos**: Proprietário, Coordenador, Professor, Recepcionista
- **Autenticação**: Username (email ou CPF) + Senha (hash bcrypt)
- **Rastreabilidade**: Todas as ações de usuário registradas para auditoria

---

## V

### Vencimento (de Mensalidade)
**Definição**: Data em que a próxima parcela de mensalidade é devida.

- **Exemplo**: Mensalidade vencida em 05/04/2026
- **Efeito**: Após ultrapassar carência (ex.: 05/04 + 5 dias = 10/04), aluno é marcado como inadimplente
- **Notificação**: Pode enviar aviso antes do vencimento (RF-COM-04)

### Visualização / Visualizar
**Contexto**: Ato de consultar dados no sistema (sem modificar).

- **Exemplo**: Consultar status de aluno, visualizar histórico de comissão
- **Permissões**: Cada perfil visualiza dados diferentes baseado em seu escopo

---

## W

### Workflow
**Contexto**: Fluxo de processos (ex.: cadastro → matrícula → primeiro pagamento → primeiro check-in)

---

## X

### (Não há termos iniciados com X)

---

## Y

### (Não há termos iniciados com Y)

---

## Z

### (Não há termos iniciados com Z)

---

## Notas Finais

### Termos em Aberto (DUV relacionadas)

| Termo | DUV | Nota |
|---|---|---|
| Comissão (modelo) | DUV-03 | Definição vai refinar este glossário |
| Catraca (integração) | DUV-01, DP-CATRACA-001 | Termo pode ser descoped ou redefinido |
| Acesso Professor | DUV-02 | Desktop vs celular muda implicações |
| Plano Compartilhado | DUV-04 | Se SIM, impacta definições de matrícula e aluno |

### Termos por Módulo

- **M01 (Cadastro/Matrícula)**: Aluno, Matrícula, Cadastro, Perfil de Aluno, Coordenador, Professor
- **M02 (Acesso)**: Check-in, Check-out, Acesso, Bloqueio, Desbloqueio, Status (Ativo, Inadimplente, Suspenso)
- **M03 (Financeiro)**: Mensalidade, Recebimento, Inadimplência, Juros, Carência
- **M04 (Avaliação)**: Avaliação Física, Plano de Treino, Histórico de Evolução
- **M05 (Comissão/Prof)**: Professor, Comissão, Bônus, Desempenho, Escala
- **M06 (Equipamento/Estoque)**: Equipamento, Manutenção (Preventiva, Corretiva), Estoque de Insumos
- **M07 (Relatórios)**: Relatório, Dashboard, KPI, Acesso por Filtro
- **M08 (Comunicação)**: Notificação, Template de Mensagem, Histórico de Comunicações

---

**Última atualização**: 2 de abril de 2026  
**Próxima revisão**: Após Fase 2 (SPECs) e resolução de DUVidas críticas
