# Glossário Rápido — Referência em Tabela

> **Versão**: 1.0  
> **Data**: 2 de abril de 2026  
> **Uso**: Consulta rápida durante SPECs e desenvolvimento

---

## Referência Rápida por Termo

| Termo | Definição Resumida | Sinônimos | Status | Módulo |
|---|---|---|---|---|
| **Academia** | Unidade física da rede | Filial, Unidade | Ativo | M01, M02 |
| **Acesso** | Gerencio de autorização de entrada | Controle de entrada | Ativo | M02 |
| **Ativo (Status)** | Aluno com pendências quitadas | Regularizado | Ativo | M02, M03 |
| **Avaliação Física** | Medidas corporais de aluno em ponto no tempo | Ficha de avaliação | Ativo | M04 |
| **Bloqueio Automático** | Negação de acesso por inadimplência/suspensão | — | Ativo | M02 |
| **Bônus** | Incentivo financeiro adicional à comissão | Bonificação | Ativo | M05 |
| **Cadastro** | Registro de pessoa/equipamento/entidade | — | Ativo | M01 |
| **Cancelado (Status)** | Aluno cuja relação com academia encerrou | — | Ativo | M02, M03 |
| **Catraca** | Dispositivo eletrônico de controle de acesso (futuro) | — | Descoped | M02 |
| **Check-in** | Marcação de entrada de aluno | Entrada | Ativo | M02 |
| **Check-out** | Marcação de saída de aluno | Saída | Ativo | M02 |
| **Comissão** | Remuneração variável de professor | Ganhos | Aberto (DUV-03) | M05 |
| **Coordenador** | Gestor responsável por 1+ academias | Gestor local | Ativo | M01, M07 |
| **Cônjuge/Dependente** | Pessoa vinculada a aluno em plano compartilhado | — | Aberto (DUV-04) | M01 |
| **Desbloqueio Manual** | Liberação autorizada de aluno bloqueado | — | Ativo | M02 |
| **Dia de Carência** | Período de tolerância antes de bloqueio | Tolerância | Aberto (DUV-06) | M02, M03 |
| **Equipamento** | Bem físico para operação da academia | Máquina, ativo | Ativo | M06 |
| **Especialidade (Prof)** | Área de conhecimento/tipo de aula | Modalidade | Ativo | M05 |
| **Estoque de Insumos** | Controle de materiais consumíveis | Insumos | Ativo | M06 |
| **Frequência (taxa)** | Métrica de comparecimento de aluno | Presença | Ativo | M02, M07 |
| **Histórico** | Registro temporal completo de alterações | Evolução | Ativo | Todos |
| **Inadimplência** | Situação de aluno com mensalidade vencida | Atraso, mora | Ativo | M03, M07 |
| **Inadimplente (Status)** | Aluno com mensalidade vencida além carência | Atrasado | Ativo | M02, M03 |
| **Juros/Multa** | Incremento % na mensalidade por atraso | Taxa de atraso | Ativo | M03 |
| **KPI** | Indicador chave de desempenho | Métrica | Ativo | M07 |
| **Manutenção Corretiva** | Reparo de equipamento com falha | Conserto | Ativo | M06 |
| **Manutenção Preventiva** | Serviço regular para evitar falhas | Revisão | Ativo | M06 |
| **Matrícula** | Contrato de aluno com academia + plano | — | Ativo | M01, M03 |
| **Mensalidade** | Valor recorrente mensal by aluno | Taxa mensal | Ativo | M03 |
| **Notificação** | Mensagem automática ao aluno sobre evento | Aviso | Ativo | M08 |
| **Objetivo Específico (OS)** | Resultado mensurável que sistema deve alcançar | — | Ativo | Todos |
| **Perfil de Acesso** | Conjunto de permissões por função | Papel, role | Ativo | Todos |
| **Perfil de Aluno** | Classificação por nível de investimento | Categoria | Ativo | M01, M03 |
| **Plano (Treino)** | Exercícios, séries, reps para aluno | Program@ de treino | Ativo | M04 |
| **Plano (Serviço)** | Categoria de adesão (básico, completo, etc) | Tipo de matrícula | Ativo | M01, M03 |
| **Ponto (Funcionários)** | Registro de presença de funcionários | — | Futuro (DUV-05) | Fora escopo |
| **Professor** | Profissional que conduz aulas/avaliações | Personal, treinador | Ativo | M01, M04, M05 |
| **Proprietário** | Jonathan Rodrigues Barbosa | Dono | Ativo | M07 |
| **Recebimento** | Transação de entrada de dinheiro | Pagamento recebido | Ativo | M03 |
| **Recepcionista/Atendente** | Profissional de recepção | Atendente | Ativo | M01, M02 |
| **Rede (Força Total)** | Conjunto de academias sob mesmo proprietário | Sistema | Ativo | Arquitetura |
| **Relatório** | Documento com dados consolidados | Report, saída | Ativo | M07 |
| **Requisito Funcional (RF)** | Coisa que o sistema deve fazer | Funcionalidade | Ativo | Todos |
| **Requisito Não-Funcional (RNF)** | Atributo de qualidade do sistema | Qualidade | Ativo | Todos |
| **Requisito Operacional (ROP)** | Restrição de uso em operação | — | Ativo | Todos |
| **Saída (Estoque)** | Consumo/retirada de insumo | Consumo | Ativo | M06 |
| **Suspenso (Status)** | Aluno temporariamente impedido de acessar | Suspenso/bloqueado | Ativo | M02, M03 |
| **Template (Mensagem)** | Mensagem pré-formatada reutilizável | — | Ativo | M08 |
| **Unidade** | Sinônimo de academia | Filial | Ativo | M01, M02 |
| **Usuário** | Pessoa que acessa o sistema | Conta | Ativo | Todos |
| **Vencimento (Mensalidade)** | Data em que próxima parcela é devida | Data de vencimento | Ativo | M03 |

---

## Por Status

### Termos Ativos (100% claros, sem DUV)
**Total**: 40+

Academia, Acesso, Ativo, Avaliação Física, Bloqueio, Bônus, Cadastro, Cancelado, Check-in/out, Coordenador, Desbloqueio, Equipamento, Especialidade, Estoque, Frequência, Histórico, Inadimplência, Inadimplente, Juros, KPI, Manutenção, Matrícula, Mensalidade, Notificação, OS, Perfil de Acesso, Plano (Treino), Professor, Proprietário, Recebimento, Recepcionista, Rede, Relatório, RF, RNF, ROP, Saída, Suspenso, Template, Usuário, Vencimento

### Termos Abertos (Aguardando DUV)
**Total**: 5

| Termo | DUV | Impacto |
|---|---|---|
| **Comissão** | DUV-03 | Modelo pode mudar radicalmente (aula vs aluno vs plano) |
| **Catraca** | DUV-01, DP-CATRACA-001 | Pode ser descoped ou redefinido |
| **Acesso Professor** | DUV-02 | Desktop vs celular muda implementação |
| **Cônjuge/Dependente** | DUV-04 | Se SIM, redefine matrícula |
| **Dia de Carência** | DUV-06 | Número de dias é configurável |
| **Ponto Funcionários** | DUV-05 | Pode entrar ou sair do escopo |

---

## Por Módulo

| Módulo | Termos Principais | Count |
|---|---|---|
| **M01 (Cadastro/Matrícula)** | Academia, Aluno, Matrícula, Cadastro, Perfil de Aluno, Coordenador, Professor, Usuário | 8 |
| **M02 (Controle de Acesso)** | Check-in, Check-out, Acesso, Status (Ativo/Suspenso/Inadimplente), Bloqueio, Desbloqueio, Catraca, Frequência | 8 |
| **M03 (Financeiro)** | Mensalidade, Recebimento, Inadimplência, Juros, Carência, Vencimento, Matrícula | 7 |
| **M04 (Avaliação/Treino)** | Avaliação Física, Plano de Treino, Histórico, Especialidade | 4 |
| **M05 (Comissão/Prof)** | Professor, Comissão, Bônus, Escala, Desempenho | 5 |
| **M06 (Equipamento/Estoque)** | Equipamento, Manutenção (Preventiva/Corretiva), Estoque, Saída | 5 |
| **M07 (Relatórios)** | Relatório, Dashboard, KPI, Proprietário, Coordenador | 5 |
| **M08 (Comunicação)** | Notificação, Template, Histórico de Comunicações | 3 |

---

## Perfis de Usuário e Seus Termos-Chave

| Perfil | Termos Principais | Acesso |
|---|---|---|
| **Proprietário** | Rede, Relatório, KPI, Dashboard, Todas academias | Rede inteira |
| **Coordenador** | Academia, Coordenador, Relatório, Inadimplência, Supervisão | Unidade(s) responsável(is) |
| **Professor** | Professor, Plano de Treino, Avaliação Física, Comissão, Alunos atribuídos | Dados pessoais + alunos |
| **Recepcionista** | Academia, Aluno, Check-in, Status, Acesso, Mensalidade | Unidade + info básica aluno |

---

## Status Atualizado (2 de abril de 2026)

- ✅ **Glossário completo criado** — 50+ termos documentados com contexto
- ✅ **Rastreabilidade mantida** — Cada termo vinculado a Módulos, RFs, DUVidas
- ⏳ **5 termos em aberto** — Aguardando resolução de DUVidas críticas
- 📋 **Próximo**: Tabela de Rastreabilidade Requisitos ↔ Módulos

