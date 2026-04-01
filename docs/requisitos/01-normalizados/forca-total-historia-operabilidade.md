# Rede Força Total Academias — História do Problema e Operabilidade

> **Fonte**: `ForcaTotal_Historia_Operabilidade.docx`  
> **Data**: Documento técnico-acadêmico  
> **Proprietário**: Jonathan Rodrigues Barbosa  
> **Contexto**: 5 anos de mercado | 5 unidades ativas | ~2000 alunos | 40+ profissionais

---

## 1. História Narrativa do Problema

### 1.1 Contexto Inicial

Jonathan Rodrigues Barbosa iniciou sua trajetória no setor fitness há cinco anos, fundando a primeira unidade da **Rede Força Total Academias** em um bairro popular. O modelo adotado foi deliberadamente acessível:
- Mensalidades competitivas
- Equipamentos de qualidade
- Professores presentes e dedicados

O sucesso foi rápido. Em menos de dois anos, a segunda unidade foi aberta. Hoje, a rede conta com **cinco unidades espalhadas em diferentes bairros**:
- **Alunos matriculados**: Ultrapassa 2.000
- **Equipe**: Mais de 40 profissionais (professores, recepcionistas, coordenadores, suporte)
- **Crescimento**: Real e expressivo, porém descontrolado

### 1.2 O Problema Fundamental

O crescimento foi real, mas a **estrutura de controle não cresceu no mesmo ritmo**.

Nos primeiros anos, Jonathan conseguia:
- Acompanhar tudo de perto
- Conhecer alunos pelo nome
- Saber quem estava inadimplente
- Controlar escala de professores "de cabeça"
- Resolver problemas conforme apareciam

**Com 5 unidades, isso se tornou impossível.**

### 1.3 Problemas Visíveis Identificados

#### **Problema 1: Cadastro Fragmentado de Alunos**

Cada unidade criou sua própria forma de registrar os matriculados:
- Unidade A: Planilha Google Sheets
- Unidade B: Software genérico de academia (adquirido há 3 anos)
- Unidade C: Fichas físicas em pastas

**Consequência**: Quando Jonathan precisa saber quantos alunos ativos a rede tem no **total**, nenhum gerente consegue dar a resposta com segurança. Os números batem diferente a cada consulta.

**Evidência**: Duplicidades, fichas perdidas, inconsistências.

#### **Problema 2: Cobrança de Mensalidades Desorganizada**

Sem um sistema centralizado de financeiro, cada unidade cobra do seu jeito:
- Algumas enviam lembretes por WhatsApp
- Outras dependem que o aluno lembre de pagar na recepção
- Controle de inadimplência não existe de forma consolidada

**Consequência**: Jonathan sabe que há alunos devendo, mas não consegue enxergar o total nem tomar ação coordenada.

**Impacto financeiro**: Perda de receita, não-rastreabilidade de débitos.

#### **Problema 3: Controle de Acesso Precário**

Alunos com plano em múltiplas unidades enfrentam dificuldades para serem reconhecidos em locais diferentes.

**Exemplos reais**:
- Pessoas entraram em unidades sem ser alunos ativos (recepcionista não tinha como confirmar status)
- Fraudes possíveis
- Situações constrangedoras com clientes legítimos

**Evidência**: Não há integração entre unidades no momento do acesso.

#### **Problema 4: Gestão Manual de Professores**

Escala de horários é feita manualmente por cada coordenador de unidade, **sem padronização**:
- Comissões por aulas avulsas ou planos personalizados = calculadas no final do mês com base em anotações
- Jonathan já pagou a mais em pelo menos 3 ocasiões
- Sem rastreamento claro do que cada professor gerou

**Risco**: Fraude, erros de cálculo, falta de rastreabilidade.

#### **Problema 5: Equipamentos e Estoque no Improviso**

- Não existe calendário de manutenção preventiva
- Descoberta de quebra: quando aluno reclama ou professor avisa
- Itens (toalhas, limpeza, escritório): comprados quando acabam, sem planejamento
- Sem controle de estoque mínimo

**Impacto**: Downtime de equipamento, gastos descontrolados.

#### **Problema 6: Falta de Visão Gerencial Integrada**

Jonathan **não tem visão gerencial integrada** da rede:
- Para saber faturamento do mês: ligar para cada gerente e esperar compilação manual
- Para saber quantos alunos cancelaram em 30 dias: pesquisa em cada unidade separadamente
- Decisões sobre expansão, ajuste de preço, desempenho de professores = baseadas em **percepção, não em dados**

**Risco crítico**: Decisões mal informadas, desperdício de recursos.

---

## 2. Quadro Consolidado dos Problemas Observados

| Bloco | Problema | Impacto | Severidade |
|---|---|---|---|
| **Cadastro** | Fragmentação de alunos entre unidades | Impossibilidade de visão consolidada | 🔴 CRÍTICA |
| **Acesso** | Sem integração entre unidades | Fraudes, constrangimento, perda de controle | 🔴 CRÍTICA |
| **Financeiro** | Cobrança desorganizada | Perda de receita, inadimplência descontrolada | 🔴 CRÍTICA |
| **RH (Professores)** | Escala e comissões manuais | Erros de cálculo, possível fraude | 🟠 ALTA |
| **Equipamentos** | Manutenção reativa, não preventiva | Downtime, gastos não planejados | 🟠 ALTA |
| **Gestão** | Falta de relatórios consolidados | Decisões baseadas em percepção | 🟠 ALTA |

---

## 3. Perguntas de Operabilidade com Respostas Sugeridas

> **Importante**: As respostas abaixo são **sugestões preliminares**, não decisões finais. Devem ser confirmadas com Jonathan e coordenadores em entrevistas.

### 3.1 Infraestrutura e Uso do Sistema

| Pergunta | Resposta Sugerida |
|---|---|
| Quantos computadores/terminais por unidade? | Mínimo 2-3: recepção principal, back-office (coordenador), professor |
| O sistema será centralizado (cloud) ou local? | Cloud/web (acesso centralizado, sem instalação local) |
| Qual será o período de migração de sistema antigo para novo? | Faseado: 1-2 semanas piloto em uma unidade, depois rollout para as demais |
| Será necessário suporte offline? | Inicial: não. Futuro possível se internet instável. |
| Qual será o volume esperado de picos de acesso? | Picos em check-in (7-9h, 18-20h), consulta leve no painel |

### 3.2 Cadastro de Alunos e Controle de Acesso

| Pergunta | Resposta Sugerida |
|---|---|
| Cadastro único por aluno ou por matrícula/unidade? | Cadastro único de aluno, com múltiplas matrículas (uma por unidade) |
| Documentos necessários (CPF, RG, foto)? | CPF obrigatório, RG e foto opcionais |
| Controle de acesso: manual ou integrado com catraca? | Inicial: manual na recepção (leitura de status). Futuro: integração com catraca |
| Alunos bloqueados automaticamente após X dias de inadimplência? | Sim, recomendado 7 dias após vencimento |
| É permitido alugar ou compartilhar plano entre colegas? | Não. Um plano = um CPF. Cônjuges = registros separados. |

### 3.3 Financeiro, Mensalidades e Inadimplência

| Pergunta | Resposta Sugerida |
|---|---|
| Qual a data padrão de vencimento de mensalidade? | Data fixa por aluno (ex.: dia 10 de cada mês) |
| Formas de pagamento aceitas? | Dinheiro, débito, crédito, PIX |
| Carência antes de bloqueio de acesso? | 7 dias após vencimento (com avisos prévios) |
| Será possível parcelar atrasos? | Sim, via análise de caso. Registrado no sistema. |
| Quem autoriza cancelamento de aluno? | Coordenador de unidade ou administrador central |

### 3.4 Professores, Escala e Comissões

| Pergunta | Resposta Sugerida |
|---|---|
| Quantas unidades um professor pode atuar? | Uma ou mais (mesmo professor em múltiplas unidades) |
| Modelo de comissionamento? | Por aula ministrada (% da receita) + bônus de desempenho (opcional) |
| Como registrar aulas: automático ou manual? | Manual: recurso de agenda + confirmação do professor |
| Relatório de comissão: mensal ou contínuo? | Mensal, com prévia visível a partir do dia 15 |
| Sistema de ponto eletrônico dos professores? | Não. Controle por agenda de aulas + presença confirmada. |

### 3.5 Avaliação Física e Acompanhamento do Aluno

| Pergunta | Resposta Sugerida |
|---|---|
| Quem pode fazer avaliação física? | Apenas profissionais designados (personal trainer ou professor especializado) |
| Frequência de reavaliação sugerida? | A cada 30 dias (configurável) |
| Dados coletados por avaliação?Peso, altura, composição corporal (gordura, massa magra), medidas (cintura, etc.) |
| Planos de treino são por aluno ou podem ser templates? | Templates iniciais + customização por professor |
| Histórico de treino deve ser preservado com troca de professor? | Sim, essencial para continuidade |

### 3.6 Equipamentos, Estoque e Manutenção

| Pergunta | Resposta Sugerida |
|---|---|
| Controle de estoque: apenas materiais de recepção ou inclui equipamentos? | Ambos: materiais (toalhas, básico) + controle de equipamentos (esteeiras, pesos, etc.) |
| Manutenção preventiva é obrigatória? | Sim, com calendário sugerido (ex.: esteeira de 6 em 6 meses) |
| Cada unidade tem seu próprio estoque ou há central? | Cada unidade tem seu estoque. Possível transferência futura entre unidades. |
| Alertas de estoque mínimo? | Sim, automático. Exemplo: quando toalhas < 20 unidades |
| Quem autoriza compra de reposição? | Coordenador de unidade cria requisição → Administrador aprova |

### 3.7 Relatórios Gerenciais e Visão da Rede

| Pergunta | Resposta Sugerida |
|---|---|
| Qual o painel principal para Jonathan (proprietário)? | Dashboard com KPIs: alunos ativos (total + por unidade), receita, inadimplência, cancelamentos |
| Frequência de envio de relatórios? | Sob demanda (acesso web) + opcional semanal/mensal por e-mail (futuro) |
| Quem tem acesso a relatórios consolidados? | Proprietário + coordenadores (com filtro por unidade) |
| Comparação entre unidades? | Suportada. Exemplo: receita por unidade, alunos ativos por unidade. |
| Histórico de dados: quando começa a retenção? | Desde primeiro uso do sistema (retroativo quando migrado) |

---

## 4. Problemas Mapeados por Categoria

### A. Cadastral
- CAD-01: Múltiplos sistemas de cadastro de alunos
- CAD-02: Sem integração entre unidades
- CAD-03: Fichas físicas desorganizadas

### B. Acesso e Segurança
- ACE-01: Sem controle de acesso de alunos entre unidades
- ACE-02: Possibilidade de fraude no check-in
- ACE-03: Falta de bloqueio automático de inadimplentes

### C. Financeiro
- FIN-01: Cobrança desorganizada (sem padrão)
- FIN-02: Inadimplência não visível de forma consolidada
- FIN-03: Sem rastreamento de pagamentos por método
- FIN-04: Sem controle de baixa de pagamento automática

### D. Gestão de Professores
- PROF-01: Escala manual sem padronização
- PROF-02: Comissões calculadas manualmente (risco de erro/fraude)
- PROF-03: Sem histórico de desempenho do professor

### E. Operacional
- OPE-01: Manutenção reativa, não preventiva
- OPE-02: Sem controle de estoque de insumos
- OPE-03: Sem alertas de reposição

### F. Gestão
- GEST-01: Sem visão consolidada da rede
- GEST-02: Relatórios manuais, demorados
- GEST-03: Decisões baseadas em percepção, não dados

---

## 5. Ativo Crítico a Proteger

**A maior necessidade identificada é a VISIBILIDADE.**

Jonathan precisa **enxergar a rede como um todo, em tempo real**, sem depender de:
- Planilhas manuais
- Ligações para gerentes
- Compilações manuais de dados

---

## 6. Stack Tecnológico Recomendado

Conforme orientação técnica do projeto:
- **Frontend**: React
- **Backend**: Java com Spring Boot
- **Banco de Dados**: PostgreSQL (conforme specs do projeto)
- **Deployment**: Cloud (web-based)

---

## 7. Encerramento

Este documento estabelece a **história do problema** e não substitui:
- Entrevistas de campo
- Observação de rotina em cada unidade
- Refinamento técnico posterior

Seu propósito é criar uma **base consistente** para:
- Definição de objetivo do sistema
- Mapeamento de requisitos funcionais e não funcionais
- Modelagem de dados
- Decisões de arquitetura

O próximo passo é a **normalização de requisitos** (documento: `forca-total-objetivos-requisitos-iniciais.md`).
