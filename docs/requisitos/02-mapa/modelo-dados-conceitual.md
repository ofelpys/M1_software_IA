# Modelo de Dados Conceitual — ERD Sistema Força Total

> **Versão**: 1.0  
> **Data**: 2 de abril de 2026  
> **Propósito**: Diagrama conceitual de todas as entidades, relacionamentos e atributos  
> **Base**: Matriz de Rastreabilidade (35 RFs claros)  
> **Status**: Pronto para transformar em SQL DDL

---

## 1. Diagrama Conceitual (Textual)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    MODELO DADOS — FORÇA TOTAL ACADEMIAS                 │
└─────────────────────────────────────────────────────────────────────────┘

    ┌─────────────┐
    │  ACADEMIA   │ ◄──┐
    ├─────────────┤    │
    │ academia_id │    │
    │ nome        │    │
    │ endereco    │    │ 1:N
    │ telefone    │    │
    │ horario_fun │    │
    └─────────────┘    │
         ▲ 1            │
         │              │
         │ N:1          │
         │     ┌────────────────────┐
         ├──────► USUARIO          │
         │     ├────────────────────┤
         │     │ usuario_id         │
         │     │ email              │
    ┌────┴─────────┤ senha_hash      │
    │    N:1       │ role_enum       │
    │              │ academia_id (FK)│◄──┐
    │     ┌────────────────────┐    │    │
    │     │  COORD_UNIDADE     │    │    │
    │     │  (view user role)  │    │    │
    │     └────────────────────┘    │    │
    │                                │    │
    ├────────────────────────────────┤    │
    │                                │    │
    │     ┌─────────────────┐        │    │ 1:N
    │     │  MATRICULA      │        │    │
    ├────────► ├─────────────────────┼────┘
    │     │ matricula_id    │        │
    │ 1:N │ aluno_id (FK)   │        │
    │     │ academia_id (FK)│────────┘
    │     │ plano_id (FK)   │
    │     │ data_matricula  │
    │     │ data_vencimento │
    │     │ status_enum     │
    │     └─────────────────┘
    │            ▲
    │            │ 1:N
    │            │
    ├───────────────────┬─────────────────────────────┐
    │                   │                             │
    │     ┌─────────────────────────┐                 │
    │     │ MATRICULA_STATUS        │                 │
    │     │ (bloqueios/histórico)   │                 │
    │     ├─────────────────────────┤                 │
    │     │ matricula_status_id     │                 │
    │     │ matricula_id (FK)       │                 │
    │     │ status_enum             │                 │
    │     │ data_mudanca            │                 │
    │     │ motivo                  │                 │
    │     └─────────────────────────┘                 │
    │                                                  │
    │     ┌───────────────────────────────────────┐   │
    │     │ MATRICULA_BLOQUEIO                    │   │
    │     │ (histórico de bloqueios/desbloqueios) │   │
    │     ├───────────────────────────────────────┤   │
    │     │ bloqueio_id                           │   │
    │     │ matricula_id (FK)                     │───┘
    │     │ motivo_bloqueio_enum                  │
    │     │ data_bloqueio                         │
    │     │ responsavel_bloqueio_id (FK)          │
    │     │ data_desbloqueio (nullable)           │
    │     │ desbloqueado_por_id (FK, nullable)    │
    │     │ motivo_desbloqueio_texto (nullable)   │
    │     └───────────────────────────────────────┘
    │
    │     ┌──────────────────────┐
    │     │ PAGAMENTO            │
    │     ├──────────────────────┤
    │     │ pagamento_id         │
    │     │ matricula_id (FK)    │───┐
    │     │ data_pagamento       │   │ 1:N
    │     │ valor                │   │
    │     │ forma_pagamento_enum │   │
    │     │ juros_aplicados      │   │
    │     │ multa_aplicada       │   │
    │     │ usuario_registrou_id │   │
    │     └──────────────────────┘   │
    │                                 │
    └─────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                     ALUNO (PESSOA)                       │
├─────────────────────────────────────────────────────────┤
│ aluno_id (PK)                                            │
│ cpf (UNIQUE)                                             │
│ nome                                                     │
│ data_nascimento                                          │
│ rg                                                       │
│ endereco_id (FK) → ENDERECO                              │
│ contato_id (FK) → CONTATO                                │
│ created_at                                               │
│ updated_at                                               │
│                                                          │
│ Relacionamentos:                                         │
│  - 1:N com MATRICULA (1 aluno → múltiplas matrículas)   │
│  - 1:N com CHECKIN_LOG (histórico de acessos)           │
│  - 1:N com AVALIACAO_FISICA (histórico de avaliações)   │
│  - 1:N com COMUNICACAO_ALUNO (mensagens recebidas)      │
│  - N:N com PROFESSOR via MATRICULA_PROFESSOR            │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              ENDERECO / CONTATO (Suportivo)              │
├─────────────────────────────────────────────────────────┤
│ ENDERECO:                                                │
│  - endereco_id (PK)                                      │
│  - rua, numero, complemento                              │
│  - bairro, cidade, estado, cep                           │
│                                                          │
│ CONTATO:                                                 │
│  - contato_id (PK)                                       │
│  - telefone, email, celular                              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                          PLANO                           │
├─────────────────────────────────────────────────────────┤
│ plano_id (PK)                                            │
│ nome (ex: Bronze, Prata, Ouro)                           │
│ descricao                                                │
│ preco_mensal                                             │
│ direitos_texto (quais salas/aulas inclui)                │
│ ativo_sim_nao                                            │
│                                                          │
│ Relacionamentos:                                         │
│  - 1:N com MATRICULA (vários alunos podem ter mesmo plan│
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                        PROFESSOR                         │
├─────────────────────────────────────────────────────────┤
│ professor_id (PK)                                        │
│ cpf (UNIQUE)                                             │
│ nome                                                     │
│ data_nascimento                                          │
│ contato_id (FK) → CONTATO                                │
│ data_contratacao                                         │
│ status_enum (ATIVO, INATIVO, AFASTADO)                   │
│                                                          │
│ Relacionamentos:                                         │
│  - N:N com ESPECIALIDADE (via PROFESSOR_ESPECIALIDADE)  │
│  - 1:N com AULA (professor ministra múltiplas aulas)    │
│  - 1:N com AVALIACAO_FISICA (professor faz avaliações)  │
│  - 1:N com PLANO_TREINO (professor cria planos)         │
│  - 1:N com COMISSAO_CALCULO (cálculos gerados)          │
│  - 1:N com PROFESSOR_PERMISSAO (roles do professor)     │
│  - N:N com ALUNO via MATRICULA_PROFESSOR                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              PROFESSOR_ESPECIALIDADE (N:N)               │
├─────────────────────────────────────────────────────────┤
│ professor_especialidade_id (PK)                          │
│ professor_id (FK)                                        │
│ especialidade_id (FK)                                    │
│                                                          │
│ ESPECIALIDADE:                                           │
│  - especialidade_id (PK)                                 │
│  - nome (ex: Musculação, Cardio, Pilates)                │
│  - descricao                                             │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│             MATRICULA_PROFESSOR (N:N com ALUNO)          │
├─────────────────────────────────────────────────────────┤
│ matricula_professor_id (PK)                              │
│ aluno_id (FK)                                            │
│ professor_id (FK)                                        │
│ tipo_aula_enum (PRIVADO, GRUPO, COLETIVA)                │
│ data_inicio                                              │
│ data_fim (nullable)                                      │
│                                                          │
│ Nota: Aluno pode ter múltiplos professores responsáveis │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   CHECKIN_LOG (Acesso)                   │
├─────────────────────────────────────────────────────────┤
│ checkin_id (PK)                                          │
│ aluno_id (FK)                                            │
│ academia_id (FK)                                         │
│ data_hora_checkin                                        │
│ data_hora_checkout (nullable)                            │
│ status_resultado_enum (SUCESSO, BLOQUEADO, ERRO)         │
│ motivo_bloqueio_texto (se bloqueado)                     │
│ usuario_registrou_id (FK)                                │
│                                                          │
│ INDEX: (aluno_id, academia_id, data_hora_checkin)        │
│        Para queries rápidas de acesso por período        │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              AVALIACAO_FISICA (Histórico)                │
├─────────────────────────────────────────────────────────┤
│ avaliacao_id (PK)                                        │
│ aluno_id (FK)                                            │
│ professor_id (FK) [professor que fez avaliação]          │
│ academia_id (FK)                                         │
│ data_avaliacao                                           │
│ peso_kg                                                  │
│ altura_cm                                                │
│ imc_calculado                                            │
│ percentual_gordura                                       │
│ medida_cintura_cm                                        │
│ medida_peito_cm                                          │
│ medida_quadril_cm                                        │
│ observacoes_texto                                        │
│ data_proxima_sugerida (calculado: now + dias_intervalo) │
│ created_at                                               │
│                                                          │
│ Constraint: Professor deve ter PERMISSAO AVALIADOR       │
│ (validado via PROFESSOR_PERMISSAO)                       │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│             PLANO_TREINO (Template + Customizado)        │
├─────────────────────────────────────────────────────────┤
│ plano_treino_id (PK)                                     │
│ aluno_id (FK)                                            │
│ professor_id (FK) [professor criador]                    │
│ template_id (FK, nullable) [se baseado em template]      │
│ data_criacao                                             │
│ objetivo_enum (GANHO_MASSA, PERDA_GORDURA, MANUTENCAO)   │
│ duracao_dias (ex: 12 semanas = 84 dias)                  │
│ ativo_sim_nao                                            │
│ data_revisao_sugerida (calculado)                        │
│ observacoes_texto                                        │
│                                                          │
│ Relacionamentos:                                         │
│  - 1:N com PLANO_TREINO_EJERCICIO (exercícios no plano) │
│  - 1:N com PLANO_TREINO_FEEDBACK (histórico de ajustes)  │
│                                                          │
│ Constraint: Nunca deletar, apenas marcar como inativo    │
│ (Histórico preservado mesmo com mudança de professor)    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│            PLANO_TREINO_EJERCICIO (Detalhamento)         │
├─────────────────────────────────────────────────────────┤
│ plano_ejercicio_id (PK)                                  │
│ plano_treino_id (FK)                                     │
│ ejercicio_id (FK)                                        │
│ numero_ordem (ex: exercício 1, 2, 3 do treino)           │
│ series                                                   │
│ repeticoes_min                                           │
│ repeticoes_max                                           │
│ carga_sugerida_kg                                        │
│ tempo_repouso_segundos                                   │
│ frequencia_semanal (ex: 3x por semana)                    │
│                                                          │
│ EJERCICIO (tabela de catálogo):                          │
│  - ejercicio_id (PK)                                     │
│  - nome (ex: Supino reto, Leg press)                     │
│  - descricao, grupo_muscular, dificuldade                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│           PLANO_TREINO_FEEDBACK (Ajustes/Evolução)       │
├─────────────────────────────────────────────────────────┤
│ feedback_id (PK)                                         │
│ plano_treino_id (FK)                                     │
│ professor_id (FK) [quem registrou feedback]              │
│ data_feedback                                            │
│ observacao_texto                                         │
│ progressao_observada_texto                               │
│ ajuste_recomendado_texto                                 │
│ intensidade_ajuste_enum (MANUTEM, AUMENTA, REDUZ)        │
│                                                          │
│ Nota: Histórico de evoluções do aluno ao longo do tempo  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                          AULA                            │
├─────────────────────────────────────────────────────────┤
│ aula_id (PK)                                             │
│ professor_id (FK)                                        │
│ academia_id (FK)                                         │
│ especialidade_id (FK)                                    │
│ data_aula                                                │
│ hora_inicio                                              │
│ hora_fim                                                 │
│ sala_id (FK)                                             │
│ capacidade_max                                           │
│ tipo_aula_enum (COLETIVA, GRUPO, PRIVADA)                │
│ data_criacao                                             │
│                                                          │
│ Relacionamentos:                                         │
│  - 1:N com AULA_ALUNO (alunos inscritos)                 │
│  - 1:N com AULA_PRESENCA (confirmação professor)         │
│  - 1:N com COMISSAO_CALCULO (comissão gerada)            │
│                                                          │
│ INDEX: (professor_id, data_aula), (academia_id, data)     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              AULA_ALUNO (N:N Inscrição)                  │
├─────────────────────────────────────────────────────────┤
│ aula_aluno_id (PK)                                       │
│ aula_id (FK)                                             │
│ aluno_id (FK)                                            │
│ data_inscricao                                           │
│ status_enum (INSCRITO, COMPARECEU, FALTOU, CANCELADO)    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              AULA_PRESENCA (Confirmação)                 │
├─────────────────────────────────────────────────────────┤
│ presenca_id (PK)                                         │
│ aula_id (FK)                                             │
│ professor_id (FK)                                        │
│ presente_sim_nao                                         │
│ data_confirmacao                                         │
│ usuario_confirmou_id (FK)                                │
│                                                          │
│ Nota: Crítico para cálculo de comissão (RF-PROF-04)      │
│       DUV-03: Que valor usar? (valor_aula vs %)          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│           CONFIG_COMISSAO (Parametrização)             │
├─────────────────────────────────────────────────────────┤
│ config_comissao_id (PK)                                  │
│ tipo_aula_enum (COLETIVA, GRUPO, PRIVADA)                │
│ percentual_comissao                                      │
│ valor_fixo_aula (nullable)                               │
│ academia_id (FK, nullable) [se var por unidade]          │
│ data_vigencia_inicio                                     │
│ data_vigencia_fim (nullable)                             │
│ ativo_sim_nao                                            │
│                                                          │
│ ⚠️ CRÍTICA: DUV-03 aberta. Esta tabela pode precisar     │
│    de campos adicionais dependendo do modelo de comissão │
│    (por aluno? por plano? por bônus de desempenho?)      │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│          COMISSAO_CALCULO (Cálculos Mensais)             │
├─────────────────────────────────────────────────────────┤
│ comissao_id (PK)                                         │
│ professor_id (FK)                                        │
│ mes_referencia (YYYY-MM)                                 │
│ origem_enum (AULA_PRESENCA, BONUS_DESEMPENHO, etc)       │
│ aula_id (FK, nullable) [qual aula originou]              │
│ quantidade_aulas                                         │
│ valor_base (valor total sem comissão)                    │
│ percentual_comissao                                      │
│ valor_comissao (calculado)                               │
│ data_calculo                                             │
│ data_pagamento (nullable)                                │
│ observacoes_ajustes                                      │
│                                                          │
│ INDEX: (professor_id, mes_referencia) para relatórios    │
│                                                          │
│ ⚠️ CRÍTICA: Estrutura muda conforme DUV-03 for resolvida │
│    (pode precisar de plano_id, aluno_id, etc)            │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              PROFESSOR_BONUS (Incentivos)                │
├─────────────────────────────────────────────────────────┤
│ bonus_id (PK)                                            │
│ professor_id (FK)                                        │
│ academia_id (FK)                                         │
│ mes_referencia (YYYY-MM)                                 │
│ valor_bonus                                              │
│ criterio_texto (ex: "5 novas matrículas")                │
│ autorizado_por_id (FK)                                   │
│ data_autorizacao                                         │
│ observacoes                                              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│           PROFESSOR_PERMISSAO (Roles/Autoridades)        │
├─────────────────────────────────────────────────────────┤
│ permissao_id (PK)                                        │
│ professor_id (FK)                                        │
│ tipo_permissao_enum (AVALIADOR, INSTRUTOR, GESTOR_TURMA) │
│ academia_id (FK) [permissão vale para qual(is) unidade]  │
│ data_concessao                                           │
│ ativo_sim_nao                                            │
│                                                          │
│ Nota (DUV-09): Ainda não está claro se "avaliador"       │
│                é role específico ou qualquer professor   │
│                pode fazer avaliação física                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              EQUIPAMENTO (Operacional)                   │
├─────────────────────────────────────────────────────────┤
│ equipamento_id (PK)                                      │
│ academia_id (FK)                                         │
│ descricao (ex: "Leg Press Dominó")                       │
│ modelo                                                   │
│ fabricante                                               │
│ numero_serie (UNIQUE)                                    │
│ data_aquisicao                                           │
│ localizacao_texto (ex: "Sala A, coluna 3")               │
│ status_enum (OPERACIONAL, MANUTENCAO, DESCARTADO)        │
│ data_ultima_atualizacao                                  │
│                                                          │
│ Relacionamentos:                                         │
│  - 1:N com MANUTENCAO (histórico de reparos)             │
│                                                          │
│ INDEX: (academia_id, status_enum)                        │
│        Rápidas consultas de equipamentos em uso vs maint │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│         MANUTENCAO (Preventiva + Corretiva)              │
├─────────────────────────────────────────────────────────┤
│ manutencao_id (PK)                                       │
│ equipamento_id (FK)                                      │
│ tipo_enum (PREVENTIVA, CORRETIVA)                        │
│ data_solicitacao                                         │
│ descricao_problema (nullable, só em CORRETIVA)           │
│ descricao_solucao                                        │
│ data_conclusao                                           │
│ custo_R$ (nullable)                                      │
│ responsavel_id (FK) [quem fez ou coordenou]              │
│ material_usado_texto                                     │
│ horas_trabalho (nullable)                                │
│                                                          │
│ Para PREVENTIVA: 6 meses (configurável)                  │
│ Próximo agendamento: data_conclusao + intervalo         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│          INSUMO (Estoque de Materiais)                   │
├─────────────────────────────────────────────────────────┤
│ insumo_id (PK)                                           │
│ academia_id (FK)                                         │
│ descricao (ex: "Toalha de microfibra")                    │
│ categoria_enum (HIGIENE, LIMPEZA, CONSUMO)               │
│ unidade_medida_enum (UNIDADE, KG, LITRO, ROLO)           │
│ saldo_atual                                              │
│ quantidade_minima_alerta                                 │
│ data_ultima_contagem                                     │
│                                                          │
│ Relacionamentos:                                         │
│  - 1:N com MOVIMENTACAO_INSUMO (histórico entrada/saída) │
│  - 1:N com REQUISICAO_COMPRA (pedidos)                   │
│                                                          │
│ Trigger (RF-EQUIP-07): Se saldo < minimo → ALERTA       │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│         MOVIMENTACAO_INSUMO (Entrada/Saída)              │
├─────────────────────────────────────────────────────────┤
│ movimentacao_id (PK)                                     │
│ insumo_id (FK)                                           │
│ tipo_enum (ENTRADA, SAIDA)                               │
│ quantidade                                               │
│ data_movimentacao                                        │
│ responsavel_id (FK)                                      │
│ motivo_saida_enum (CONSUMO, PERDA, DEVOLUCAO, DESCARTE)  │
│ numero_documento_entrada (nullable, ex: NF)              │
│                                                          │
│ Trigger: Atualizar insumo.saldo_atual                    │
│ INDEX: (insumo_id, data_movimentacao)                    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│          REQUISICAO_COMPRA (Pedidos)                     │
├─────────────────────────────────────────────────────────┤
│ requisicao_id (PK)                                       │
│ insumo_id (FK)                                           │
│ quantidade_solicitada                                    │
│ data_requisicao                                          │
│ solicitante_id (FK)                                      │
│ status_enum (PENDENTE, APROVADA, ENTREGUE, CANCELADA)    │
│ aprovador_id (FK, nullable)                              │
│ data_aprovacao (nullable)                                │
│ data_entrega_prevista (nullable)                         │
│ data_entrega_real (nullable)                             │
│ observacoes                                              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│          COMUNICACAO (Avisos aos Alunos)                 │
├─────────────────────────────────────────────────────────┤
│ comunicacao_id (PK)                                      │
│ tipo_enum (AVISO, NOTIFICACAO_VENCIMENTO, CAMPAINHA)     │
│ conteudo_texto                                           │
│ usuarios_solicitante_id (FK)                             │
│ academia_id (FK, nullable) [NULL = toda rede]            │
│ data_criacao                                             │
│ data_agendada_envio (nullable)                           │
│ status_enum (RASCUNHO, AGENDADA, ENVIADA, CANCELADA)     │
│ data_envio_real (nullable)                               │
│                                                          │
│ Relacionamentos:                                         │
│  - 1:N com COMUNICACAO_ALUNO (para cada aluno recebido)  │
│  - M:1 com COMUNICACAO_TEMPLATE (se baseado em template) │
│                                                          │
│ INDEX: (data_agendada_envio, status_enum)                │
│        Para job que processa agendamentos                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│         COMUNICACAO_ALUNO (Entrega Individual)           │
├─────────────────────────────────────────────────────────┤
│ comunicacao_aluno_id (PK)                                │
│ comunicacao_id (FK)                                      │
│ aluno_id (FK)                                            │
│ data_envio                                               │
│ status_enum (ENVIADA, LIDA, FALHA)                       │
│ data_leitura (nullable)                                  │
│ canal_envio_enum (EMAIL, SMS, NOTIFICACAO_APP)           │
│                                                          │
│ Nota: Permite rastreabilidade individual do envio        │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│         COMUNICACAO_TEMPLATE (Reutilizáveis)             │
├─────────────────────────────────────────────────────────┤
│ template_id (PK)                                         │
│ nome (ex: "Notificação de vencimento")                    │
│ conteudo_template (com placeholders {{aluno}}, {{data}}) │
│ tipo_enum (AVISO, NOTIFICACAO_VENCIMENTO, etc)           │
│ ativo_sim_nao                                            │
│ data_criacao                                             │
│ criado_por_id (FK)                                       │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│         CONFIG_PARAMETRO (Configurações)                 │
├─────────────────────────────────────────────────────────┤
│ parametro_id (PK)                                        │
│ chave (UNIQUE, ex: "DIAS_CARENCIA", "DIAS_PROX_AVAL")    │
│ valor (JSON ou texto)                                    │
│ descricao                                                │
│ tipo_dado_enum (INT, DECIMAL, STRING, BOOLEAN, ENUM)     │
│ data_ultima_alteracao                                    │
│ alterado_por_id (FK)                                     │
│                                                          │
│ Valores críticos para este projeto:                      │
│  - DIAS_CARENCIA (default 5, DUV-06)                     │
│  - TAXA_JUROS_PERCENT (default 2%)                       │
│  - DIAS_PROX_AVALIACAO (default 30)                      │
│  - DIAS_NOTIFICACAO_VENCIMENTO (default 3)               │
│  - (E estrutura de comissão conforme DUV-03)             │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│            FORMA_PAGAMENTO (Enum)                        │
├─────────────────────────────────────────────────────────┤
│ forma_pagamento_id (PK)                                  │
│ nome (DINHEIRO, CARTAO_DEBITO, CARTAO_CREDITO, PIX)      │
│ ativo_sim_nao                                            │
│                                                          │
│ (Pode ser apenas ENUM na BD, não tabela)                 │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│            AUDITORIA_LOG (Histórico de Alterações)       │
├─────────────────────────────────────────────────────────┤
│ auditoria_id (PK)                                        │
│ tabela_modificada (ex: "ALUNO", "MATRICULA")              │
│ id_registro_modificado                                   │
│ operacao_enum (CREATE, UPDATE, DELETE)                   │
│ usuario_id (FK)                                          │
│ data_hora                                                │
│ valores_antes_json (nullable, se UPDATE)                 │
│ valores_depois_json (nullable, se UPDATE)                │
│ endereco_ip (opcional)                                   │
│                                                          │
│ INDEX: (tabela_modificada, data_hora)                    │
│        Para auditorias rápidas                           │
│                                                          │
│ (RFC-CAD-08: Registrar história de alterações de cadastr│
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│          USUARIO / AUTENTICACAO (Acesso)                 │
├─────────────────────────────────────────────────────────┤
│ usuario_id (PK)                                          │
│ email (UNIQUE)                                           │
│ cpf (opcional, UNIQUE)                                   │
│ senha_hash (bcrypt, nunca texto plano)                   │
│ nome_completo                                            │
│ role_enum (PROPRIETARIO, COORDENADOR, PROFESSOR, RECEPCIONISTA) │
│ academia_id (FK, nullable) [NULL = acesso a todas]       │
│ ativo_sim_nao                                            │
│ data_criacao                                             │
│ data_ultimo_login (nullable)                             │
│ tentativas_login_falhas                                  │
│ bloqueado_sim_nao (após tentativas)                       │
│                                                          │
│ Nota: role define perfil de acesso (RNF-03)              │
│       Usar RBAC (Role-Based Access Control)              │
│                                                          │
│ INDEX: (email, ativo_sim_nao)                            │
│        Para login rápido                                 │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│             SALA_AULA (Localização de Aulas)             │
├─────────────────────────────────────────────────────────┤
│ sala_id (PK)                                             │
│ academia_id (FK)                                         │
│ nome (ex: "Sala A", "Sala de Pilates")                    │
│ capacidade_max                                           │
│ equipamentos_disponibilidade_json                        │
│ horario_funcionamento_json                               │
│ ativo_sim_nao                                            │
│                                                          │
│ INDEX: (academia_id)                                     │
│        Listar salas de uma academia                      │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│           DOCUMENTO_SAIDA (Boletos, Recibos)             │
├─────────────────────────────────────────────────────────┤
│ documento_id (PK)                                        │
│ tipo_enum (BOLETO, RECIBO, COMPROVANTE)                  │
│ aluno_id (FK)                                            │
│ valor                                                    │
│ data_geracao                                             │
│ data_validade (nullable, ex: boleto 3 dias)              │
│ numero_documento (ex: número do boleto)                  │
│ conteudo_gerado_pdf_blob (nullable)                       │
│ status_enum (GERADO, ENVIADO, PAGO, VENCIDO)             │
│ data_envio (nullable)                                    │
│ usuario_solicitante_id (FK)                              │
└─────────────────────────────────────────────────────────┘

```

---

## 2. Resumo de Entidades

| Entidade | Tipo | Registros Est. | Notas |
|---|---|---|---|
| **ACADEMIA** | Mestrado | 5 | Poucas, crescimento lento |
| **ALUNO** | Principal | 2.000+ | Crescimento com matrículas |
| **MATRICULA** | Principal | 2.000+ (1:1 aluno/academia inicialmente) | Chave para ligá tudo |
| **PROFESSOR** | Principal | 40+ | Poucos, crescimento controlado |
| **USUARIO** | Suporte | 50-100 | Recepcionistas, coordenadores |
| **CHECKIN_LOG** | Histórico | 1M+/ano | Consultas rápidas, arquivamento futuro |
| **PAGAMENTO** | Transacional | 2.500/mês | Crítico para fluxo de caixa |
| **AULA** | Transacional | 500+/mês | Dinâmico conforme agendamento |
| **COMISSAO_CALCULO** | Transacional | 40+/mês | Mensal |
| **AVALIACAO_FISICA** | Histórico | 50-100/mês | Consultado frequentemente |
| **PLANO_TREINO** | Histórico | 500+ | Consultado por professor/aluno |
| **EQUIPAMENTO** | Mestrado | 50-200 | Depende da academia tamanho |
| **MANUTENCAO** | Histórico | 100+/ano | Consultado para análise de custos |
| **CONFIG_PARAMETRO** | Mestrado | 10-20 | Poucas, críticas |

---

## 3. Relacionamentos Críticos (Integridade)

### M02 → M03 (Acesso ↔ Financeiro)

```
MATRICULA
  ├─ MATRICULA_STATUS (status do aluno: ativo/bloqueado/etc)
  │   └─ Trigger ao criar PAGAMENTO
  │      IF novo PAGAMENTO quitou débito THEN status = ATIVO
  │
  ├─ PAGAMENTO
  │   └─ Trigger ao criar/deletar
  │      Atualizar MATRICULA_STATUS
  │      Se em_dia() THEN status=ATIVO
  │      Se atrasado(dias > carencia) THEN status=INADIMPLENTE
  │
  └─ CHECKIN_LOG
      └─ Validar contra MATRICULA_STATUS.status = ATIVO
         Se bloqueado → checkin falha
```

### M05 → M07 (Professores ↔ Relatórios)

```
PROFESSOR
  ├─ AULA (aulas agendadas)
  │   ├─ AULA_PRESENCA (confirmação)
  │   │   └─ Origem de COMISSAO_CALCULO
  │   │
  │   └─ AULA_ALUNO (alunos inscritos)
  │       └─ Origem de MATRICULA_PROFESSOR
  │
  ├─ COMISSAO_CALCULO (cálculos mensais)
  │   └─ RF-REL-07: Relatório de desempenho
  │
  └─ PROFESSOR_BONUS (bônus adicionais)
      └─ RF-REL-07: Incluso no total ganho
```

### M04 → M07 (Avaliação ↔ Relatórios)

```
AVALIACAO_FISICA
  ├─ Aluno_id → ALUNO
  │   └─ RF-REL-06: Frequência de checks
  │
  ├─ Professor_id → PROFESSOR
  │   └─ Validação: PROFESSOR_PERMISSAO.AVALIADOR
  │
  └─ Data_proxima_sugerida
      └─ Dashboard: Alertar de reavaliações pendentes
```

---

## 4. Decisões Críticas Bloqueadas (DUV)

### ⚠️ DUV-03 — Modelo de Comissão

**Entidades impactadas**:
- `CONFIG_COMISSAO`: Pode precisar de campos para "por_aluno", "por_plano", "bônus_desempenho"
- `COMISSAO_CALCULO`: Estrutura de cálculo muda
- `PROFESOR_BONUS`: Pode ser consolidado em COMISSAO_CALCULO ou tabela separada

**Cenários possíveis**:

```
1. POR AULA (simples):
   CONFIG_COMISSAO(tipo_aula, %)
   COMISSAO_CALCULO(aula_id, valor_aula × %)

2. POR ALUNO (complexo):
   CONFIG_COMISSAO(tipo_aluno, valor_mensal_por_aluno)
   COMISSAO_CALCULO(aluno_count, valor_mensal_por_aluno × count)

3. HÍBRIDO (realista):
   CONFIG_COMISSAO(
     tipo_aula,
     pct_comissao_aula,
     bonus_se_novo_aluno_mês,
     bonus_se_x_aulas_mes,
     etc
   )
   COMISSAO_CALCULO(origem_enum, valor, origem_id, valor_comissao)
```

**Ação**: Aguardar DUV-03 respondida para finalizar BD schema

### 🟡 DUV-06 — Dias de Carência

**Entidades impactadas**:
- `CONFIG_PARAMETRO.DIAS_CARENCIA`

**Default proposto**: 5 dias (pode ser refinado depois)

### 🟡 DUV-09 — Professor Designado para Avaliação

**Entidades impactadas**:
- `PROFESSOR_PERMISSAO.TIPO_PERMISSAO_ENUM`

**Default proposto**: Qualquer professor pode fazer avaliação (sem constraint, pode ser refinado depois)

---

## 5. Índices Recomendados (Performance)

```sql
-- Acesso rápido:
INDEX idx_checkin_aluno_data ON CHECKIN_LOG(aluno_id, data_hora_checkin DESC);
INDEX idx_matricula_status_aluno ON MATRICULA(aluno_id, status_enum);
INDEX idx_pagamento_data ON PAGAMENTO(data_pagamento DESC);

-- Relatórios:
INDEX idx_aula_professor_data ON AULA(professor_id, data_aula DESC);
INDEX idx_comissao_mes ON COMISSAO_CALCULO(professor_id, mes_referencia DESC);
INDEX idx_checkin_academia ON CHECKIN_LOG(academia_id, data_hora_checkin DESC);

-- Estoque:
INDEX idx_insumo_saldo ON INSUMO(quantidade_minima_alerta, saldo_atual);
INDEX idx_mov_insumo_data ON MOVIMENTACAO_INSUMO(insumo_id, data_movimentacao DESC);

-- Auditoria:
INDEX idx_auditoria_tabela_data ON AUDITORIA_LOG(tabela_modificada, data_hora DESC);
```

---

## 6. Constraints e Validações

### Constraints de Integridade

```
-- Aluno pode ter múltiplas matrículas, uma por academia
UNIQUE(aluno_id, academia_id) ON MATRICULA

-- Professor não pode ter comissão de 0% ou > 100%
CHECK(percentual_comissao > 0 AND percentual_comissao <= 100) ON CONFIG_COMISSAO

-- Data de fim sempre >= data de início
CHECK(data_fim >= data_inicio) ON MATRICULA_PROFESSOR

-- Histórico: nunca deletar verificações
TRIGGER antes_delete ON AVALIACAO_FISICA
  → RAISE ERROR "Avaliações são históricas, marque como inativa"

-- Acesso: bloquear se inadimplente
TRIGGER antes_checkin ON CHECKIN_LOG
  → VALIDATE matricula_status = ATIVO
```

---

## 7. Próximos Passos

1. **V Alidação com Jonathan** (1h) — Confirmar estrutura geral
2. **Resolver DUV-03** (comissão) — Ajustar `CONFIG_COMISSAO` e `COMISSAO_CALCULO`
3. **Gerar SQL DDL** — Executar migrations em PostgreSQL
4. **Criar Views** — Para relatórios (RF-REL-01 a 09)
5. **Criar Stored Procedures** — Para cálculos complexos (comissão, inadimplência)
6. **Iniciar SPEC-001** — Usando este ERD como base

---

**Última atualização**: 2 de abril de 2026  
**Status**: Pronto para transformar em PostgreSQL DDL  
**Bloqueadores**: DUV-03 (comissão), DUV-06 (dias carência), DUV-09 (avaliador)
