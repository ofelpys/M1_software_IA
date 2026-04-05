# SPEC-002 — Financeiro (Pagamentos, Comissões, Inadimplência)

> **Versão**: 1.0  
> **Data**: 2 de abril de 2026  
> **Módulos**: M03 (Financeiro) + M05 (Professores - Comissão)  
> **Status**: 🟢 PRONTO PARA DESENVOLVIMENTO  
> **RFs Incluídos**: RF-FIN-01 a 09 (9 RFs)  
> **Bloqueadores**: ✅ ZERO (DUV-03 resolvida: comissão por aluno mensal)

---

> Nota de escopo MVP: esta SPEC orienta a entrega do MVP operacional. Requisitos de robustez em nivel enterprise ficam como evolucao futura e nao sao criterio de aceite desta fase.

## 1. Visão Geral

### Propósito
Especificar funcionalidades de **gestão financeira** da academia: registro de pagamentos, cálculo de comissões de professores, rastreamento de inadimplência, e geração de comprovantes/recibos.

### Escopo
- ✅ Registro de Pagamento (mensalidade de aluno)
- ✅ Rastreamento de Inadimplência (automático após carência)
- ✅ Cálculo de Comissão (por aluno ativo mensal)
- ✅ Geração de Recibos (aluno + professor)
- ✅ Dashboard Financeiro (KPIs) — será em SPEC-003
- ✅ Relatório de Comissões (histórico) — será em SPEC-003
- ✅ Cancelamento/Bloqueio de Aluno
- ✅ Ajustes de Débito/Crédito (correções)
- ✅ Integração com Check-in (validação de impedimentos)

### Não Incluso (Futuro)
- ❌ Payment Gateway integrado (Stripe, PIX) — Fase 3
- ❌ Boleto automático geração — Fase 3
- ❌ Recebimento via Cartão — Fase 3
- ❌ Conciliação bancária — Fase 3
- ❌ Relatório de impostos (RPA, EFD-Contribuições) — Futuro

---

## 2. Referências Críticas

| Documento | Seção | Referência |
|-----------|-------|-----------|
| [DUV Resolutions](../.copilot/memory/duv-resolutions.md) | DUV-03 | Modelo comissão = Alunos × VLA × % |
| [Glossário](../00-originais/glossario.md) | Comissão, Inadimplência, Recibo | Terminologia |
| [Matriz Rastreabilidade](../02-mapa/matriz-rastreabilidade.md) | M03, M05 RFs | Mapeamento RFs → Tabelas |
| [Modelo Dados](../02-mapa/modelo-dados-conceitual.md) | PAGAMENTO, COMISSAO_CALCULO, MATRICULA_BLOQUEIO | Schema |
| [RNFs Detalhados](../02-mapa/requisitos-nao-funcionais-detalhados.md) | RNF-05, 06 | Rentabilidade, Performance |
| [SPEC-001](./SPEC-001-cadastro-acesso.md) | RF-ACE-03 | Bloqueio alunos (carência 3 dias) |

---

## 3. Requisitos Funcionais Detalhados

### 3.1 RF-FIN-01: Registrar Pagamento de Aluno

#### Descrição
Permitir que COORDENADOR, RECEPCIONISTA ou SISTEMA registre o recebimento de pagamento de uma mensalidade de aluno. Pode ser manual (entrada pelo RECEPCAO) ou automático (webhook de payment gateway).

#### Casos de Uso

**UC-FIN-001: Recepcionista Registra Pagamento Manual**

```
Ator: RECEPCIONISTA
Pré: Aluno matrícula ativa, pagamento vencido ou próximo vencer

1. [RECV] Acessa "Registrar Pagamento" ou "Financeiro"
2. [SYS] Mostra busca: "Digite CPF ou nome do aluno"
3. [RECV] Digita: "João Silva" ou "123.456.789-00"
4. [SYS] Query: ALUNO + MATRICULA vigente
   └─ Mostra: Nome, Plano, Valor, Status (ATIVO/BLOQUEADO)
5. [SYS] Se BLOQUEADO: Aviso "Aluno bloqueado por inadimplência"
6. [RECV] Clica "Registrar Pagamento"
7. [RECV] Preenche:
   ├─ Valor: R$500,00 (sugerido: valor plano)
   ├─ Data: 02/04/2026 (hoje)
   ├─ Forma: Dinheiro | Débito | Crédito | PIX
   └─ Observação: (opcional) "Pagamento em 2x"
8. [SYS] Valida:
   ├─ Valor > 0
   ├─ Data ≤ hoje
   └─ Aluno existe + matrícula ativa
9. [RECV] Confirma "Registrar"
10. [SYS]
    ├─ Insert PAGAMENTO(aluno, valor, data, forma)
    ├─ Update MATRICULA.status_pagamento:
    │  ├─ If total_pago == valor_mensal → "QUITADO"
    │  ├─ If total_pago < valor_mensal → "PARCIAL"
    │  ├─ If hoje > data_vencimento + 3 dias → "INADIMPLENTE"
    │  └─ Else → "ATIVO"
    ├─ Delete MATRICULA_BLOQUEIO (if before was blocked)
    ├─ Insert AUDITORIA_LOG
    ├─ Send email aluno: "Pagamento recebido"
    ├─ Print/Email recibo
    └─ Return: receipt_id + comprovante
11. [RECV] Vê sucesso: "Pagamento registrado. Recibo: #12345"
```

#### Fluxo Principal

```
1. [USER] Navigate "Financeiro → Registrar Pagamento"
2. [SYS] Load form busca de aluno
3. [USER] Type CPF or name
4. [SYS] Query + autocomplete list
5. [USER] Select aluno
6. [SYS] Show matrícula + status:
   ├─ Nome: João Silva
   ├─ Plano: R$500/mês
   ├─ Status: VENCIDO (7 dias)
   ├─ Débito: R$500
   ├─ Carência restante: 0 dias (bloqueado)
   └─ Mostrar avisos em vermelho
7. [USER] Click "Registrar Pagamento"
8. [SYS] Form:
   ├─ Valor: [R$500___] (prefilled)
   ├─ Data: [02/04/2026___] (today preset)
   ├─ Forma: [Dinheiro▼]
   └─ Obs: [________________]
9. [USER] Validate + confirm
10. [SYS]
    ├─ Insert PAGAMENTO
    ├─ Update MATRICULA status
    ├─ Liberar aluno (remove bloqueio)
    ├─ Email receipt
    └─ Show "Pago com sucesso"
```

#### Validações

| Campo | Regra | Erro |
|-------|-------|------|
| alunoId | encontrado, matrícula ativa | "Aluno não encontrado ou sem matrícula" |
| valor | > 0, ≤ limite | "Valor deve ser positivo" |
| data | ≤ hoje, ≥ data_vencimento_anterior | "Data inválida" |
| forma | enum (Dinheiro, Débito, Crédito, PIX, Boleto) | "Forma inválida" |

#### Regras de Negócio

```
RN-FIN-001: Pagamento atualiza status matricula
            └─ Se total_pago ≥ valor_mensal → QUITADO
               Se total_pago < valor_mensal → PARCIAL
               Se vencido + > 3 dias carência → INADIMPLENTE

RN-FIN-002: Pagamento remove bloqueio automático
            ├─ Delete MATRICULA_BLOQUEIO
            └─ Aluno pode fazer checkin novamente

RN-FIN-003: Comprovante gerado automaticamente
            ├─ Email ao aluno
            ├─ Imprimível em tela
            └─ Arquivo PDF (future)

RN-FIN-004: Auditoria completa
            ├─ Quem registrou (usuario_id)
            ├─ IP address
            └─ Timestamp
```

#### Database Schema

```sql
INSERT INTO PAGAMENTO (
    aluno_id, academia_id, valor_pago, data_pagamento,
    forma_pagamento, observacao, responsavel_id, criado_em
) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP);

-- Update matrícula status (trigger automático)
TRIGGER TRG_UPDATE_MATRICULA_STATUS_AFTER_PAGAMENTO:
  └─ When PAGAMENTO inserted
  └─ Recalculate MATRICULA.status_pagamento
  └─ Delete MATRICULA_BLOQUEIO if status = QUITADO/PARCIAL

-- Log auditoria
INSERT INTO AUDITORIA_LOG (
    usuario_id, tabela_modificada, operacao, registro_id,
    valores_antes, valores_depois, ip_address, data_hora
) VALUES (?, 'PAGAMENTO', 'INSERT', new_pagamento_id, NULL, ?, ?, ?);
```

#### Critério de Aceitação

```
✅ Pagamento registrado em BD
   └─ PAGAMENTO table: insert com todos campos

✅ Status matrícula atualizado
   ├─ Se quitado: status = QUITADO
   ├─ Se parcial: status = PARCIAL
   └─ Se inadimplente: status = INADIMPLENTE (with reason)

✅ Bloqueio removido (automático)
   ├─ MATRICULA_BLOQUEIO deleted
   └─ Aluno pode fazer checkin

✅ Auditoria rastreada
   ├─ AUDITORIA_LOG registra
   ├─ Quem registrou (usuario_id), IP, timestamp
   └─ Queryable depois

✅ Comprovante gerado/emailed
   ├─ Email template com dados
   ├─ Imprimível
   └─ Receipt ID unique
```

---

### 3.2 RF-FIN-02: Rastreamento de Inadimplência (Automático)

#### Descrição
Sistema monitora automaticamente quando alunos não pagam mensalidade. Após 3 dias de carência, aluno vira INADIMPLENTE e CREATE bloqueio automático (impedindo checkin).

#### Casos de Uso

**UC-FIN-002: Sistema Detecta Vencimento + Aplica Bloqueio**

```
Ator: SISTEMA (Scheduler job, não usuário manual)
Trigger: Diário às 06:00 AM

1. [JOB] Execute scheduled task: "Atualizar inadimplências"
2. [JOB] Query:
   SELECT m.* FROM MATRICULA m
   WHERE m.ativo = true
   AND m.status_pagamento IN ('VENCIDO', 'PARCIAL')
   AND EXTRACT(DAY FROM NOW() - m.data_vencimento) > 3

3. [JOB] Para cada matrícula encontrada:
   a) Calcula dias_atraso = TODAY - data_vencimento
   b) IF dias_atraso > 3:
      ├─ Update MATRICULA.status = INADIMPLENTE
      ├─ Insert MATRICULA_BLOQUEIO:
      │  ├─ aluno_id
      │  ├─ motivo = 'CARENCIA_ESGOTADA'
      │  ├─ data_bloqueio = TODAY
      │  └─ removido_em = NULL
      ├─ Insert AUDITORIA_LOG (SISTEMA user)
      ├─ Send email aluno: "Acesso bloqueado: pague mensalidade"
      ├─ Send email coordenador: "X alunos bloqueados por inadimplência"
      └─ Update dashboard KPI: inadimplência count

4. [JOB] Retorna:
   ├─ Total processado: 47 alunos
   ├─ Bloqueados: 12 novos
   ├─ Reativados (pagaram): 3
   └─ Log stored em logs/inadimplencia-JOB.log
```

#### Fluxo Automático

```
Timeline de Inadimplência para aluno João:

4 mai (quinta) - Vencimento
├─ Status: ATIVO
├─ Email: "Sua mensalidade venceu hoje"
└─ Checkin: ✅ Permitido

5 mai (sexta) - +1 dia carência
├─ Status: VENCIDO
├─ Email: (nenhum, apenas warning se consulta app)
└─ Checkin: ✅ Permitido (carência ativa)

6 mai (sábado) - +2 dias
├─ Status: VENCIDO
├─ No email overnight
└─ Checkin: ✅ Permitido

7 mai (domingo) - +3 dias
├─ Status: VENCIDO
├─ No email overnight
└─ Checkin: ✅ Permitido (último dia carência)

8 mai (segunda) 06:00 AM - JOB roda
├─ [JOB] dias_atraso = 4 > 3
├─ [JOB] Insert MATRICULA_BLOQUEIO
├─ Update status = INADIMPLENTE
├─ Email: "Acesso bloqueado. Pague para continuar"
└─ Coordenador email: "1 aluno em implantação"

8 mai (segunda) - Qualquer checkin
├─ [RECEPCAO] Tenta checkin João
├─ [SYS] Query MATRICULA_BLOQUEIO
├─ [SYS] Encontra bloqueio
├─ [SYS] ❌ Nega checkin: "Aluno bloqueado"
└─ [RECEPCAO] Direciona para pagar

9 mai (terça) - João paga
├─ [RECV] Registra pagamento (prev RF-FIN-01)
├─ [SQL] Delete MATRICULA_BLOQUEIO
├─ [SQL] Update status = QUITADO
├─ Email: "Bem-vindo! Acesso liberado"
└─ Próximo checkin: ✅ Permitido
```

#### Implementação (Backend)

```java
@Component
@Slf4j
public class InadimplenciaScheduler {
    
    @Scheduled(cron = "0 6 * * *")  // 06:00 AM daily
    public void atualizarInadimplências() {
        log.info("Job iniciado: atualizarInadimplências");
        
        // Query: matriculas vencidas + carência expirada
        List<Matricula> matriculas = matriculaRepository
            .findVencidasComCarenciaExpirada(3);  // 3 dias carência
        
        for (Matricula m : matriculas) {
            if (!m.temBloqueio()) {  // Evitar duplicar
                // Insert bloqueio
                MatriculaBloqueio bloqueio = new MatriculaBloqueio();
                bloqueio.setAluno(m.getAluno());
                bloqueio.setMotivo("CARENCIA_ESGOTADA");
                bloqueio.setDataBloqueio(LocalDate.now());
                bloqueioRepository.save(bloqueio);
                
                // Update status
                m.setStatusPagamento(StatusMatricula.INADIMPLENTE);
                matriculaRepository.save(m);
                
                // Auditoria
                auditoriaService.log("MATRICULA", "UPDATE", m.getId(), 
                    "{"status_antes":"VENCIDO"}", 
                    "{"status_depois":"INADIMPLENTE"}");
                
                // Email
                emailService.enviar(m.getAluno().getEmail(), 
                    "Aviso: Sua matrícula foi bloqueada", 
                    "template_bloqueio_inadimplencia");
            }
        }
        
        log.info("Job concluído: {} matriculas processadas", matriculas.size());
    }
}
```

#### Regras de Negócio

```
RN-FIN-002.1: Carência é 3 dias
              └─ Configurable em CONFIG_PARAMETRO.dias_carencia_vencimento

RN-FIN-002.2: Bloqueio automático ocorre 1x por matrícula
              ├─ Não gera múltiplos bloqueios
              └─ Se já existe MATRICULA_BLOQUEIO, não duplica

RN-FIN-002.3: Pagamento remove bloqueio
              ├─ Delete MATRICULA_BLOQUEIO
              ├─ Status volta para QUITADO/PARCIAL
              └─ Aluno pode checkin novamente

RN-FIN-002.4: Notificações automáticas
              ├─ Email aluno 1 dia antes vencer
              ├─ Email no vencimento
              ├─ Email quando bloqueado (carência esgotada)
              └─ Email quando desbloqueado (pagamento)
```

---

### 3.3 RF-FIN-03: Cálculo de Comissão de Professor (Automático)

#### Descrição
Sistema calcula automaticamente a comissão mensal de cada professor, baseado em:
- Número de alunos ativos (MATRICULA.status = ATIVO)
- Valor do plano de cada aluno
- Percentual de comissão do professor (padrão 15%, pode variar por prof)

**Fórmula**: 
```
Comissão = ∑(Alunos_Ativos × VLA × %)
  Onde:
  - Alunos_Ativos = COUNT(MATRICULA) WHERE status=ATIVO, professor_id=X
  - VLA = Valor_Plano / 30 dias
  - % = percentual comissão (15% default)
```

#### Casos de Uso

**UC-FIN-003: Sistema Calcula Comissão Mensal Automática**

```
Ator: SISTEMA (Scheduler job)
Trigger: 5º dia de cada mês às 06:00 AM (Configurável)

1. [JOB] Execute: "Calcular comissões do mês"
2. [CONFIG] Read CONFIG_PARAMETRO:
   ├─ dia_calculo_comissao = 5
   ├─ percentual_comissao_padrao = 15.00
   └─ ativo = true

3. [JOB] Query: SELECT * FROM PROFESSOR WHERE ativo=true
4. [JOB] Para cada professor:
   a) Query alunos ativos:
      SELECT COUNT(*), AVG(plano.valor)
      FROM MATRICULA m
      JOIN ALUNO a ON m.aluno_id = a.aluno_id
      WHERE m.professor_id = prof.id
      AND m.status_pagamento = 'ATIVO'
      AND m.academia_id IN (prof.academias)
   
   b) Calcula:
      - total_alunos_ativos = COUNT resultado
      - valor_plano_medio = AVG resultado
      - vla = valor_plano_medio / 30
      - percentual = professor.percentual_comissao OR config.padrao
      - valor_comissao = total_alunos_ativos × vla × percentual
   
   c) Insert COMISSAO_CALCULO:
      ├─ professor_id
      ├─ academia_id
      ├─ periodo_mes = 2026-04-01
      ├─ total_alunos_ativos
      ├─ valor_plano_medio
      ├─ percentual_comissao
      ├─ valor_total = valor_comissao
      ├─ status_calculo = CALCULADA
      └─ data_calculo = TODAY

5. [JOB] Retorna relatório:
   ├─ Total processado: 23 professores
   ├─ Total comissão gerada: R$47.500,00
   ├─ Maior: Prof X - R$3.200,00
   ├─ Menor: Prof Y - R$150,00
   └─ Erro (nenhum aluno): 3 professores (skip)

6. [JOB] Log + Email coordenador: "Comissões calculadas"
```

#### Exemplo Cálculo

```
Professor Julia Sales - Maio 2026

Alunos ativos na academia:
├─ João Silva - Plano Standard R$500/mês
├─ Maria Santos - Plano Premium R$1.000/mês
├─ Pedro Costa - Plano Standard R$500/mês
├─ Ana Ferreira - Plano Standard R$500/mês
└─ Total: 4 alunos

Cálculo:
├─ Soma valores: R$500 + R$1.000 + R$500 + R$500 = R$2.500
├─ Média: R$2.500 / 4 = R$625/aluno/mês
├─ VLA (diário): R$625 / 30 = R$20,83/dia
├─ Percentual: 15% (padrão)
├─ Comissão: 4 alunos × R$625 × 15% = R$375/mês
└─ Resultado: COMISSAO_CALCULO.valor_total = R$375,00
```

#### Validações

| Campo | Regra | Erro |
|-------|-------|------|
| professor_id | existe + ativo | "Professor não encontrado ou inativo" |
| periodo_mes | valid date | "Período inválido" |
| percentual | 0-100 | "Percentual deve estar entre 0-100" |
| unique | professor_id + periodo_mes | "Comissão já calculada para este mês" |

#### Database Schema

```sql
-- CONFIG_PARAMETRO (já existe)
INSERT INTO CONFIG_PARAMETRO (chave, valor, tipo, ativo)
VALUES ('dia_calculo_comissao', '5', 'INTEGER', true),
       ('percentual_comissao_padrao', '15.00', 'NUMERIC', true);

-- COMISSAO_CALCULO (nova)
CREATE TABLE COMISSAO_CALCULO (
    comissao_id BIGSERIAL PRIMARY KEY,
    professor_id INTEGER NOT NULL REFERENCES PROFESSOR(professor_id),
    academia_id SMALLINT NOT NULL,
    periodo_mes DATE NOT NULL,
    
    total_alunos_ativos INTEGER NOT NULL,
    valor_plano_medio NUMERIC(10,2) NOT NULL,
    percentual_comissao NUMERIC(5,2) NOT NULL,
    
    valor_total NUMERIC(12,2) NOT NULL,
    
    status_calculo ENUM('CALCULADA', 'APROVADA', 'PAGA') DEFAULT 'CALCULADA',
    data_calculo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_aprovacao TIMESTAMP,
    data_pagamento TIMESTAMP,
    
    observacao TEXT,
    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(professor_id, academia_id, periodo_mes),
    INDEX idx_professor_periodo (professor_id, periodo_mes),
    INDEX idx_status_paga (status_calculo, data_pagamento)
);

-- COMISSAO_PAGAMENTO (histórico pagamentos)
CREATE TABLE COMISSAO_PAGAMENTO (
    pagamento_id BIGSERIAL PRIMARY KEY,
    comissao_id BIGINT NOT NULL REFERENCES COMISSAO_CALCULO(comissao_id),
    professor_id INTEGER NOT NULL REFERENCES PROFESSOR(professor_id),
    academia_id SMALLINT NOT NULL,
    
    valor_pago NUMERIC(12,2) NOT NULL,
    data_pagamento DATE NOT NULL,
    forma_pagamento VARCHAR(50),  -- 'transferencia', 'boleto', 'dinheiro'
    
    comprovante_url VARCHAR(255),
    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 3.4 RF-FIN-04: Gerar Recibo de Aluno

#### Descrição
Ao registrar pagamento, gerar recibo (comprovante) que pode ser:
- Enviado por email (PDF)
- Impresso em papel
- Visualizado em tela

#### Fluxo

```
1. [RECEPCAO] Registra pagamento (RF-FIN-01)
2. [SYS] Auto-gera recibo:
   ├─ Receipt ID: unico
   ├─ Template HTML:
   │  ├─ Logo academia
   │  ├─ Data, hora
   │  ├─ Aluno: nome, CPF, matrícula
   │  ├─ Período: de X para Y
   │  ├─ Valor pago
   │  ├─ Forma pagamento
   │  ├─ Assinatura/carimbo
   │  └─ Validação (recibo_id + academia)
   ├─ Email ao aluno (PDF anexo)
   └─ Store em RECIBO table (searchable)

3. [RECEPCAO] Botão "Imprimir" → print recibo
```

#### Exemplo Recibo

```
═════════════════════════════════════════════════════════
                   FORÇA TOTAL ACADEMIAS
                   Unidade: São Paulo
═════════════════════════════════════════════════════════

RECIBO DE PAGAMENTO

Recibo Nº:                      #2026-04-000145
Data:                           02 de Abril de 2026
Hora:                           14:30:25

───────────────────────────────────────────────────────

ALUNO:
  Nome:                         João Silva Santos
  CPF:                          123.456.789-00
  Matrícula:                    #ALU-001234
  Data Matrícula:               01 de Janeiro de 2024

───────────────────────────────────────────────────────

PAGAMENTO:
  Período:                      Abril de 2026
  Plano:                        Plano Standard
  Valor do Plano:               R$500,00
  Valor Pago:                   R$500,00
  Data Vencimento:              04 de Abril de 2026
  Data Pagamento:               02 de Abril de 2026
  Forma de Pagamento:           Dinheiro
  Observação:                   -

───────────────────────────────────────────────────────

RESUMO:
  ✓ Pagamento recebido com sucesso
  ✓ Matrícula ativa até 04 de Maio de 2026
  ✓ Acesso liberado para treinos

═════════════════════════════════════════════════════════
Registrado por:  Maria Silva (RECEPCIONISTA)
IP:              192.168.1.45
Assinado digitalmente por: Sistema Força Total
═════════════════════════════════════════════════════════
```

---

### 3.5 RF-FIN-05: Gerar Recibo de Comissão (Professor)

#### Descrição
Ao calcular comissão ou marcar como PAGA, gerar recibo/documento para professor comprovando o valor a receber ou recebido.

#### Casos de Uso

**UC-FIN-005: Coordenador Aprova e Paga Comissão**

```
1. [COORD] Acessa "Financeiro → Comissões"
2. [SYS] Lista comissões calculadas (status=CALCULADA):
   ├─ Prof Julia Sales - Maio 2026 - R$3.200,00 - CALCULADA
   ├─ Prof Pedro Santos - Maio 2026 - R$2.150,00 - CALCULADA
   └─ Total 15 professores - R$47.500,00

3. [COORD] Clica em comissão → Ver detalhes
4. [COORD] Vê breakdown:
   ├─ Total alunos ativos: 15
   ├─ Valor plano médio: R$625
   ├─ Percentual (15%): R$3.200,00 calculado
   └─ [ Gerar Recibo ] [ Marcar Pago ] [ Rejeitar ]

5. [COORD] Click "Marcar Pago"
6. [SYS] Form:
   ├─ Data pagamento: [02/04/2026__]
   ├─ Forma: [Transferência▼]
   ├─ Banco/Ag/CC: [_ITAU____] [___0001__] [___1234567890_]
   ├─ Comprovante: [Upload arquivo] (optional)
   └─ Observação: [_________________]

7. [COORD] Confirm
8. [SYS]
   ├─ Update COMISSAO_CALCULO.status = PAGA
   ├─ Insert COMISSAO_PAGAMENTO
   ├─ Gera recibo PDF (transferência comprovante)
   ├─ Email professor: "Comissão paga em sua conta"
   └─ Insert AUDITORIA_LOG

9. [PROF] Recebe email com:
   ├─ Comprovante de pagamento (PDF)
   └─ Link para acessar histórico
```

---

### 3.6 RF-FIN-06: Dashboard Financeiro — Em SPEC-003

#### Descrição (Placeholder)
Dashboard com KPIs financeiros para proprietário:
- Receita do mês (total pagamentos)
- Inadimplência (% alunos bloqueados)
- Comissões a pagar (total)
- Fluxo de caixa (gráfico)

**Nota**: Será detalhado em SPEC-003 (Relatórios)

---

### 3.7 RF-FIN-07: Relatório de Comissões — Em SPEC-003

#### Descrição (Placeholder)
Relatório histórico de comissões de professores:
- Por professor (filtro)
- Por período (range de datas)
- Status: CALCULADA, PAGA, RETIDA
- Export Excel

**Nota**: Será detalhado em SPEC-003 (Relatórios)

---

### 3.8 RF-FIN-08: Cancelar/Bloquear Aluno Manualmente

#### Descrição
Permitir que COORDENADOR ou PROPRIETARIO cancele matrícula de um aluno ou bloqueie manualmente (além do automático por inadimplência).

#### Casos de Uso

**UC-FIN-008: Coordenador Cancela Matrícula**

```
1. [COORD] Busca aluno na lista
2. [COORD] Clica "Ações → Cancelar Matrícula"
3. [SYS] Confirma: "Tem certeza? Posso recuperar?" [SIM] [NÃO]
4. [COORD] Clica SIM
5. [SYS] Form:
   ├─ Motivo: [Mudou de academia▼]
   ├─ Reembolso: [Nenhum | Proporcional]
   └─ Observação: [___________________]
6. [COORD] Confirm
7. [SYS]
   ├─ Update MATRICULA.status = CANCELADO
   ├─ Update MATRICULA.data_cancelamento = today
   ├─ Insert MATRICULA_CANCELAMENTO (history)
   ├─ Delete bloqueios relacionados
   ├─ Email aluno: "Matrícula cancelada"
   ├─ Insert AUDITORIA_LOG
   └─ Update dashboard KPI

8. [COORD] Vê confirmação + pode gerar recibo de cancela (reembolso)
```

#### Database Schema

```sql
-- Novo status em enum MATRICULA.status_pagamento
ALTER TYPE status_matricula ADD VALUE 'CANCELADO';

-- Tabela cancelamento
CREATE TABLE MATRICULA_CANCELAMENTO (
    cancelamento_id BIGSERIAL PRIMARY KEY,
    matricula_id BIGINT NOT NULL REFERENCES MATRICULA(matricula_id),
    aluno_id INTEGER NOT NULL,
    academia_id SMALLINT NOT NULL,
    
    motivo VARCHAR(255),
    reembolso ENUM('NENHUM', 'PROPORCIONAL', 'INTEGRAL'),
    valor_reembolso NUMERIC(12,2),
    
    cancelado_por INTEGER NOT NULL REFERENCES USUARIO(usuario_id),
    data_cancelamento DATE DEFAULT CURRENT_DATE,
    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 3.9 RF-FIN-09: Ajustes de Débito/Crédito (Correções)

#### Descrição
Permitir que COORDENADOR registre ajustes (correções) em débitos ou créditos de um aluno. Ex:
- Aluno pagou R$600 mas plano é R$500 → crédito R$100
- Professor devolveu plano antigo → aluno deve R$50 → débito

#### Casos de Uso

**UC-FIN-009: Registrar Crédito por Pagamento Excedente**

```
1. [COORD] Acessa "Financeiro → Ajustes"
2. [COORD] Busca aluno: "Maria Silva"
3. [COORD] Clica "Novo Ajuste"
4. [SYS] Form:
   ├─ Aluno: [Maria Silva - #ALU-001]
   ├─ Tipo: [Crédito▼] ou [Débito]
   ├─ Valor: [100,00]
   ├─ Motivo: [Pagamento excedente - refazer]
   │           [Reembolso material - quebrado]
   │           [Ajuste administrativo]
   │           [Outro: __________________]
   └─ Data: [02/04/2026__]

5. [COORD] Confirm
6. [SYS]
   ├─ Insert AJUSTE_CREDITO_DEBITO
   ├─ Update ALUNO.saldo_credito (if crédito)
   ├─ Update MATRICULA.status (if débito)
   ├─ Email aluno: notificação
   ├─ Insert AUDITORIA_LOG
   └─ Updatek dashboard

7. [COORD] Vê sucesso
```

#### Database Schema

```sql
CREATE TABLE AJUSTE_CREDITO_DEBITO (
    ajuste_id BIGSERIAL PRIMARY KEY,
    aluno_id INTEGER NOT NULL REFERENCES ALUNO(aluno_id),
    academia_id SMALLINT NOT NULL,
    
    tipo ENUM('CREDITO', 'DEBITO') NOT NULL,
    valor NUMERIC(12,2) NOT NULL,
    motivo VARCHAR(255) NOT NULL,
    descricao TEXT,
    
    data_ajuste DATE NOT NULL,
    criado_por INTEGER NOT NULL REFERENCES USUARIO(usuario_id),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_aluno (aluno_id),
    INDEX idx_data (data_ajuste)
);
```

---

## 4. Especificações Técnicas

### 4.1 Stack

```
Backend (mesmo do SPEC-001)
├─ Java 17+, Spring Boot 3.0+
├─ spring-boot-starter-jpa
├─ spring-boot-starter-scheduler (para jobs)
├─ PostgreSQL 14+

Frontend
├─ React 18+
├─ react-hook-form + Zod (forms + validation)
├─ Chart.js / Recharts (gráficos financeiros)
├─ date-fns (date manipulation)

Scheduler
├─ Spring @Scheduled (built-in)
├─ Or Quartz scheduler (if complex)

Email
├─ Spring Mail + Thymeleaf (templates)
├─ SendGrid or AWS SES (production)
```

### 4.2 API Endpoints

```
POST   /api/v1/pagamentos               (RF-FIN-01)
GET    /api/v1/pagamentos/{id}          (RF-FIN-01)
GET    /api/v1/pagamentos?aluno=X       (RF-FIN-01, list)

GET    /api/v1/inadimplencias           (RF-FIN-02, dashboard)
GET    /api/v1/matriculas-bloqueadas    (RF-FIN-02, check status)

POST   /api/v1/comissoes/calcular       (RF-FIN-03, manual trigger)
GET    /api/v1/comissoes?professor=X&mes=Y  (RF-FIN-03, list)
PUT    /api/v1/comissoes/{id}/aprovar   (RF-FIN-05, approve)
PUT    /api/v1/comissoes/{id}/pagar     (RF-FIN-05, mark paid)

GET    /api/v1/recibos/{id}             (RF-FIN-04, fetch receipt)
POST   /api/v1/recibos/{id}/email       (RF-FIN-04, resend email)
POST   /api/v1/recibos/{id}/print       (RF-FIN-04, generate PDF)

PUT    /api/v1/matriculas/{id}/cancelar (RF-FIN-08)
POST   /api/v1/ajustes                  (RF-FIN-09, new)

GET    /api/v1/financeiro/dashboard     (RF-FIN-06 placeholder)
GET    /api/v1/relatorios/comissoes     (RF-FIN-07 placeholder)
```

---

## 5. Critério de Aceitação

### Funcional

```
✅ RF-FIN-01 (Registrar Pagamento)
   [✓] Form busca aluno + matrícula
   [✓] Validação valor > 0
   [✓] Insert PAGAMENTO table
   [✓] Update MATRICULA status automático
   [✓] Delete bloqueio if applicable
   [✓] Email recibo ao aluno
   [✓] Auditoria logged

✅ RF-FIN-02 (Rastreamento Inadimplência)
   [✓] Scheduled job 06:00 AM daily
   [✓] Query inadimplências (carência > 3 dias)
   [✓] Insert MATRICULA_BLOQUEIO automático
   [✓] Update status = INADIMPLENTE
   [✓] Email notifications
   [✓] Dashboard KPI atualizado
   [✓] Logs stored

✅ RF-FIN-03 (Cálculo Comissão)
   [✓] Scheduled job 5º dia do mês
   [✓] Query alunos ativos por professor
   [✓] Calcula: alunos × VLA × %
   [✓] Insert COMISSAO_CALCULO
   [✓] Relatório gerado
   [✓] Email coordenador

✅ RF-FIN-04 (Recibo Aluno)
   [✓] HTML template com dados
   [✓] Email PDF ao aluno
   [✓] Print via navegador
   [✓] Store RECIBO table

✅ RF-FIN-05 (Recibo Comissão)
   [✓] Form aprovação + pagamento
   [✓] Update status PAGA
   [✓] Insert COMISSAO_PAGAMENTO
   [✓] PDF gerado
   [✓] Email professor

✅ RF-FIN-08 (Cancelar Aluno)
   [✓] Form com motivo + reembolso
   [✓] Update status CANCELADO
   [✓] Delete bloqueios
   [✓] Email aluno
   [✓] Auditoria

✅ RF-FIN-09 (Ajustes)
   [✓] Form tipo (crédito/débito)
   [✓] Insert AJUSTE table
   [✓] Update saldo aluno
   [✓] Auditoria
   [✓] Email notificação
```

### Performance (RNF-06)

```
✅ Registrar pagamento: < 500ms
✅ Calcular comissão: < 2 minutos (batch job)
✅ Load dashboard: < 2 segundos
✅ Query inadimplências: < 1 segundo
✅ Gerar recibo PDF: < 3 segundos
```

### Security (RNF-13)

```
✅ Apenas COORDENADOR/RECEPCIONISTA pode registrar
✅ Apenas PROPRIETARIO pode ver dashboard
✅ Auditoria completa (quem, quando, IP)
✅ Sem valores sensíveis em logs
✅ Email seguro (não expor dados pessoais)
```

---

## 6. Test Cases

### Backend: PaymentServiceTest

```java
@DisplayName("RF-FIN-01: Registrar Pagamento")
class PaymentServiceTest {
  
  @Test
  void deveRegistrarPagamento_E_UpdatearMatriculaStatus() { }
  
  @Test
  void deveRemover_MatriculaBloqueio_AposPagamento() { }
  
  @Test
  void deveRejeitar_Valor_Negativo() { }
  
  @Test
  void deveRejeit_Aluno_Inexistente() { }
  
  @Test
  void deveRegistrarEmAUDITORIA_LOG() { }
}
```

### Backend: InadimplenciaSchedulerTest

```java
@DisplayName("RF-FIN-02: Rastreamento Inadimplência")
class InadimplenciaSchedulerTest {
  
  @Test
  void deveDetectar_MatriculasVencidas_Apos3Dias() { }
  
  @Test
  void deveCriar_MatriculaBloqueio_Automaticamente() { }
  
  @Test
  void deveNaoClicar_DuplicarBloqueio() { }
  
  @Test
  void deveEnviar_Email_Notificacao() { }
}
```

### Frontend: PaymentForm.test.jsx

```javascript
describe('PaymentForm', () => {
  it('deve buscar aluno por CPF', () => { });
  
  it('deve validar valor > 0', () => { });
  
  it('deve mostrar aviso se bloqueado', () => { });
  
  it('deve enviar pagamento para API', () => { });
  
  it('deve mostrar recibo após sucesso', () => { });
});
```

---

## 7. Timeline Sprint SPEC-002

```
Dia 1 (2 abr, hoje):
├─ Backend: Payment service implementation
├─ Database: Migrations (PAGAMENTO, COMISSAO_CALCULO, etc)
└─ Frontend: Payment form + layout

Dia 2 (3 abr):
├─ Backend: Scheduler jobs (inadimplência, comissão)
├─ Backend:50% APIs ready
├─ Frontend: Forms + connections
└─ Tests: 50% written

Dia 3 (4 abr):
├─ Backend: 100% complete
├─ Frontend: 100% complete
├─ Tests: 100% pass (80%+ coverage)
├─ SonarQube: gates pass
└─ Ready for QA

Dia 4 (5 abr):
├─ Code review + fixes
├─ Staging deployment
├─ Smoke tests
└─ Ready for SPEC-003
```

---

## 8. Referências

| Documento | Link |
|-----------|------|
| DUV Resolutions | duv-resolutions.md |
| Glossário | glossario.md |
| Modelo Dados | modelo-dados-conceitual.md |
| Guia Padrões | guia-padroes-codigo-convencoes.md |
| SPEC-001 | SPEC-001-cadastro-acesso.md |
| CONTRIBUTING | CONTRIBUTING.md |

---

## Checklist Aceita SPEC-002

```
[✓] Todas 9 RFs implementadas
[✓] Backend: 80%+ test coverage
[✓] Frontend: 80%+ test coverage
[✓] Scheduler jobs: 2 automation testado
[✓] Email templates: 4 types
[✓] Database: triggers + indexes
[✓] SonarQube: quality gates
[✓] Security: no sensitive logs
[✓] Performance: targets met
[✓] Documentation: API docs + README
```

---

**Status**: 🟢 PRONTO PARA DEV  
**Criado**: 2 de abril de 2026  
**Próxima**: SPEC-003 (Relatórios após SPEC-002 completa)  
**Owner**: Tech Lead  
**Stack**: SpringBoot + React + PostgreSQL

