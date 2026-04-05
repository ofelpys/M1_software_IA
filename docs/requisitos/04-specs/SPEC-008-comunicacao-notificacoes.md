# SPEC-008 — Comunicação e Notificações (Email, Push, SMS, Templates)

> **Versão**: 1.0  
> **Data**: 2 de abril de 2026  
> **Módulos**: M08 (Comunicação)  
> **Status**: 🟢 PRONTO PARA DESENVOLVIMENTO  
> **RFs Inclusos**: RF-COM-01 a 05 (5 RFs)  
> **Bloqueadores**: ✅ ZERO

---

> Nota de escopo MVP: esta SPEC orienta a entrega do MVP operacional. Requisitos de robustez em nivel enterprise ficam como evolucao futura e nao sao criterio de aceite desta fase.

## 1. Visão Geral

### Propósito
Especificar funcionalidades de **comunicação e notificações multicanal** da academia: envio de emails transacionais e marketing, push notifications na app, templates customizáveis, rastreamento de entrega, e preferências de comunicação do usuário.

### Escopo
- ✅ Sistema de Email (transacional, marketing, templates)
- ✅ Push Notifications (web/mobile alerts)
- ✅ SMS (opcional, integrável)
- ✅ Templates de Mensagens (customizáveis por academia)
- ✅ Gerenciar Preferências (opt-in/opt-out, canais)
- ❌ Campanha Marketing automática (future)
- ❌ Chatbot/WhatsApp (future)

### Não Incluso (Futuro)
- ❌ WhatsApp Business integration — Fase 4
- ❌ Chatbot IA — Fase 4
- ❌ Campaign marketing automática — Futuro
- ❌ SMS gateway (caro) — Futuro

---

## 2. Referências Críticas

| Documento | Seção | Referência |
|-----------|-------|-----------|
| [Glossário](../00-originais/glossario.md) | Comunicação, Notificação | Terminologia |
| [SPEC-001](./SPEC-001-cadastro-acesso.md) | RF-ACE | Autenticação usuário |
| [SPEC-002](./SPEC-002-financeiro.md) | RF-FIN | Notificações pagamento |
| [SPEC-003](./SPEC-003-relatorios-dashboards.md) | RF-REL | Relatórios email |
| [SPEC-004](./SPEC-004-avaliacao-evolucao.md) | RF-AVAL-05 | Email certificado |
| [SPEC-007](./SPEC-007-insumos-produtos.md) | RF-INSUMO-04 | Alertas estoque |

---

## 3. Requisitos Funcionais Detalhados

### 3.1 RF-COM-01: Sistema de Email (Transacional, Templates, Customização)

#### Descrição
Sistema centralizado de envio de emails: templates para eventos (login, pagamento, alerta estoque, certificado, comissão, etc). Cada academia pode customizar templates com logo, cores, assinatura.

#### Casos de Uso

**UC-COM-001: Sistema Envia Email Transacional**

```
Ator: SISTEMA (automático)
Trigger: Evento (pagamento, alerta, certificado, etc)

1. [EVENT] Evento disparado: Aluno registra pagamento (SPEC-002 RF-FIN-01)

2. [SYS] Lookup template:
   ├─ Tipo: "PAGAMENTO_RECEBIDO"
   ├─ Academia: Força Total São Paulo
   ├─ Template customizado: sim
   └─ Load: template_id = 123

3. [SYS] Prepara email:
   ├─ Para: aluno_email (joao@example.com)
   ├─ Assunto: Template {{academia_nome}}: Pagamento recebido ✓
   │  └─ Resultado: "Força Total: Pagamento recebido ✓"
   ├─ Corpo HTML (template engine Thymeleaf/Freemarker):
   │  ├─ Logo academia (customizado)
   │  ├─ Saudação: "Olá {{aluno_nome}}"
   │  ├─ Detalhes:
   │  │  ├─ Valor: {{valor_pago}}
   │  │  ├─ Data: {{data_pagamento}}
   │  │  ├─ Forma: {{forma_pagamento}}
   │  │  └─ Referência: {{recibo_id}}
   │  ├─ Próximo vencimento: {{proxima_vencimento}}
   │  ├─ Link ação: "Visualizar comprovante" → recibo.pdf
   │  ├─ Cores/fonts: customizado academia
   │  └─ Rodapé: Logo + Endereço
   └─ CC: coordenador (opcional)

4. [SYS] Valida:
   ├─ Email válido
   ├─ Usuário não marcou "não enviar"
   └─ Preferences: "Pagamento" = ativo

5. [SYS] Envia via SMTP (SendGrid ou AWS SES):
   ├─ Provider: SendGrid (recomendado)
   ├─ Priority: normal
   ├─ Retry: 3x se falha
   └─ Timeout: 5s

6. [SYS] Logged:
   ├─ Insert COMUNICACAO_LOG
   ├─ Status: ENVIADO
   ├─ Timestamp: 02/04/2026 14:30:25
   ├─ Provider: "SENDGRID"
   ├─ Message ID: "sg-xxxxx"
   └─ Tracking ativo (webhooks)

7. [ALUNO] Recebe email em 1-2 segundos ✓
```

#### Database Schema

```sql
CREATE TABLE TEMPLATE_COMUNICACAO (
    template_id SERIAL PRIMARY KEY,
    academia_id SMALLINT NOT NULL REFERENCES ACADEMIA(academia_id),
    
    tipo ENUM('PAGAMENTO_RECEBIDO', 'ALERTA_VENCIMENTO', 'CERTIFICADO', 
              'ALERTA_ESTOQUE', 'COMISSAO_PAGA', 'ALUNO_BLOQUEADO', 
              'MANUTENCAO_EQUIPAMENTO', 'ALERTA_PRESENCA', 'BOAS_VINDAS'),
    
    nome VARCHAR(100),
    descricao TEXT,
    
    assunto VARCHAR(255),  -- Template com {{variables}}
    corpo_html LONGTEXT,   -- HTML com Thymeleaf syntax
    
    cores_primaria VARCHAR(7),  -- #FF5733
    cores_secundaria VARCHAR(7),
    logo_url VARCHAR(255),
    
    ativo BOOLEAN DEFAULT true,
    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE (academia_id, tipo),
    INDEX idx_academia (academia_id)
);

CREATE TABLE COMUNICACAO_LOG (
    log_id BIGSERIAL PRIMARY KEY,
    academia_id SMALLINT NOT NULL,
    usuario_id INTEGER NOT NULL REFERENCES USUARIO(usuario_id),
    template_id SERIAL REFERENCES TEMPLATE_COMUNICACAO(template_id),
    
    tipo_canal ENUM('EMAIL', 'PUSH', 'SMS'),
    destinatario VARCHAR(255),  -- email, phone, deviceId
    
    assunto VARCHAR(255),
    corpo_resumo TEXT,
    
    status ENUM('ENVIADO', 'FALHA', 'BOUNCE', 'SPAM', 'LIDO', 'CLICADO'),
    provider VARCHAR(50),  -- 'SENDGRID', 'AWS_SES', 'FCM'
    message_id VARCHAR(255),
    
    data_envio TIMESTAMP,
    data_entrega TIMESTAMP,
    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_usuario (usuario_id),
    INDEX idx_status (status)
);
```

---

### 3.2 RF-COM-02: Push Notifications (Web/Mobile, Real-time)

#### Descrição
Notificações em tempo real para app/web: alertas de pagamento vencido, certificado atingido, aula cancelada, comissão paga, mensagem do professor, etc.

#### Casos de Uso

**UC-COM-002: Aluno Recebe Push Notification**

```
Ator: SISTEMA (automático)
Trigger: Meta atingida (SPEC-004 RF-AVAL-05)

1. [EVENT] Aluno João atinge meta de abdominais

2. [SYS] Remove cache do aluno
   ├─ Calculus result: 50 repetições (meta era 30)
   ├─ Status: META_ATINGIDA = TRUE
   └─ Gera certificado

3. [SYS] Dispara push notification:
   ├─ Tipo: "META_ATINGIDA"
   ├─ Usuário: joao@example.com
   ├─ Lookup FCM token: "efIx2Ku...abc" (do app)
   ├─ Payload:
   │  ├─ title: "🎉 Parabéns, João!"
   │  ├─ body: "Você atingiu 50 abdominais! Meta era 30!"
   │  ├─ icon: URL certificado
   │  ├─ action: "OPEN_CERTIFICADO"
   │  ├─ data: { certificado_id: 123, tipo_teste: "ABDOM_1MIN" }
   │  └─ ttl: 7 dias (se não achar app online)

4. [SYS] Envia via Firebase Cloud Messaging (FCM):
   ├─ Provider: FCM (Google)
   ├─ Priority: HIGH
   ├─ Timeout: 2s
   └─ Retry: 3x

5. [ALUNO_APP] Recebe notificação:
   ├─ Sistema: Android/iOS/Web browser
   ├─ Exibição: Toast ou badge
   ├─ Som: confetti sound (customizável)
   ├─ Click: abre certificado na app
   └─ Timestamp: 02/04/2026 15:45:12

6. [SYS] Log:
   ├─ Insert COMUNICACAO_LOG
   ├─ Status: ENVIADO (entrega confirmada por FCM)
   ├─ Provider: FCM
   ├─ Message ID: "projects/xxx/messages/123456"
   └─ Data entrega: timestamp

7. [ALUNO] Vê notificação → clica → certificado abre ✓
```

#### Push Notification Types (Built-in)

```
1. ALERTA_PAGAMENTO_VENCIDO
   └─ "Seu pagamento vence em 3 dias. Clique para pagar."

2. META_ATINGIDA
   └─ "🎉 Parabéns! Você atingiu sua meta de [teste]!"

3. AULA_CANCELADA
   └─ "Aula de [tipo] com [prof] foi cancelada. Novo: [data/hora]"

4. PROFESSOR_MENSAGEM
   └─ "Prof. Pedro deixou feedback: [resumo]"

5. COMISSAO_PAGA
   └─ "Prof., sua comissão de março foi paga! R$3.200"

6. CERTIFICADO_GERADO
   └─ "[Tipo teste] certificado gerado. Compartilhe!"

7. ALERTA_ESTOQUE_BAIXO
   └─ "Coord., [insumo] com estoque baixo. Reorder?"

8. MANUTENCAO_EQUIPAMENTO
   └─ "Equipamento [nome] em manutenção até [data]"

9. CHECK_IN_CONFIRMADO
   └─ "Check-in confirmado! Bem-vindo à Força Total"

10. BLOQUEIO_ALUNO
    └─ "Sua matrícula foi temporariamente bloqueada. Pague para continuar."
```

#### Database Schema

```sql
CREATE TABLE DISPOSITIVO_PUSH (
    dispositivo_id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES USUARIO(usuario_id),
    academia_id SMALLINT NOT NULL,
    
    fcm_token VARCHAR(500) NOT NULL,  -- Firebase Cloud Messaging token
    tipo_dispositivo VARCHAR(50),  -- 'ANDROID', 'IOS', 'WEB'
    
    ativo BOOLEAN DEFAULT true,
    ultimo_acesso TIMESTAMP,
    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_usuario (usuario_id)
);

-- COMUNICACAO_LOG já cobrido em RF-COM-01
```

---

### 3.3 RF-COM-03: Integração com Channels (Email, Push, SMS Centralizado)

#### Descrição
Interface unificada para envio em múltiplos canais. COORDENADOR pode efetuar bulk send (ex: email para todos alunos com pagamento vencido).

#### Casos de Uso

**UC-COM-003: Coordenador Envia Email em Massa**

```
Ator: COORDENADOR
Pré: Autenticado, alert inadimplência aberta (SPEC-003 RF-REL-03)

1. [COORD] Acessa "Comunicação → Relatório Inadimplência"
2. [SYS] Mostra 12 alunos bloqueados
3. [COORD] Button [Enviar Email Em Massa]
4. [SYS] Form:
   ├─ Destinatários: [✓ Todos 12 selecionados]
   ├─ Template: [Cobrança Gentil▼]
   │  ├─ Aviso de Bloqueio
   │  ├─ Último Aviso
   │  └─ Customizado
   ├─ Preview email: [mostra mock]
   ├─ Planejar envio:
   │  ├─ [ ] Agora
   │  ├─ [●] Agendar para: [02/04 20:00]
   │  └─ [ ] Teste comigo: [meu_email@...]
   ├─ Rastreamento:
   │  ├─ [✓] Confirmar entrega
   │  ├─ [✓] Rastrear aberturas
   │  └─ [✓] Rastrear cliques
   └─ [ Enviar ]

5. [COORD] Review + Click "Enviar"

6. [SYS]
   ├─ Schedule job para 20:00
   ├─ Valida preferências (opt-out)
   ├─ Prepara email (personalizado com nome, valor, etc)
   ├─ Batch send 12 emails (chunked, 100 msgs/segundo)
   ├─ Insert COMUNICACAO_LOG × 12
   ├─ Start tracking webhooks (SendGrid)
   └─ Notification: "12 emails agendados para 20:00"

7. [20:00] JOB executa → emails enviados
8. [COORD] Dashboard: "12 enviados, 11 entregues, 1 bounce"

9. [ALUNOS] Recebem emails
10. [SYS] Tracks:
    ├─ Open: João abriu 02/04 20:05
    ├─ Click: Maria clicou link 02/04 20:12
    ├─ Bounce: Pedro (email inválido)
    └─ Dashboard atualiza real-time
```

#### Database Schema

```sql
CREATE TABLE CAMPANHA_COMUNICACAO (
    campanha_id BIGSERIAL PRIMARY KEY,
    academia_id SMALLINT NOT NULL,
    criada_por INTEGER NOT NULL REFERENCES USUARIO(usuario_id),
    
    template_id SERIAL REFERENCES TEMPLATE_COMUNICACAO(template_id),
    
    tipo_campanha ENUM('EMAILS_MASSA', 'AVISOS_SISTEMA', 'MARKETING'),
    titulo VARCHAR(100),
    descricao TEXT,
    
    canais TEXT[],  -- ['EMAIL', 'PUSH']
    filtro_alvo JSONB,  -- {"status_pagamento": "VENCIDO", "dias_atraso": ">3"}
    
    total_destinatarios INTEGER,
    agenda_envio TIMESTAMP,
    
    status ENUM('RASCUNHO', 'AGENDADA', 'EM_ENVIO', 'ENVIADA', 'CANCELADA') DEFAULT 'RASCUNHO',
    
    total_enviado INTEGER DEFAULT 0,
    total_entregue INTEGER DEFAULT 0,
    total_aberto INTEGER DEFAULT 0,
    total_clicado INTEGER DEFAULT 0,
    total_bounce INTEGER DEFAULT 0,
    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    enviado_em TIMESTAMP,
    concluido_em TIMESTAMP,
    
    INDEX idx_academia (academia_id),
    INDEX idx_status (status)
);
```

---

### 3.4 RF-COM-04: Gerenciar Preferências Comunicação (Opt-in/Opt-out)

#### Descrição
Cada usuário (aluno, professor) pode escolher quais tipos de comunicação receber, por qual canal (email, push, SMS), e com qual frequência.

#### Casos de Uso

**UC-COM-004: Usuário Customiza Preferências**

```
Ator: ALUNO/PROFESSOR
Pré: Autenticado

1. [USUARIO] Acessa "Configurações → Notificações"
2. [SYS] Form com checkboxes:

   EMAIL:
   ├─ [✓] Pagamento vencido
   ├─ [✓] Certificado/Meta atingida
   ├─ [✓] Promoção/Marketing
   ├─ [✓] Relatório semanal
   └─ [✓] Aula cancelada

   PUSH NOTIFICATION:
   ├─ [✓] Pagamento vencido
   ├─ [✓] Certificado/Meta atingida
   ├─ [ ] Promoção/Marketing (desativado)
   ├─ [ ] Relatório semanal (desativado)
   └─ [✓] Aula cancelada

   SMS (se ativo):
   ├─ [✓] Pagamento vencido (urgente)
   ├─ [ ] Outros (muito caro)

   FREQUÊNCIA EMAIL:
   ├─ [●] Imediatamente (padrão)
   ├─ [ ] Diário resumido
   └─ [ ] Semanal resumido

   UNSUBSCRIBE:
   └─ [ Desinscrever de tudo ]

3. [USUARIO] Click "Salvar Preferências"

4. [SYS]
   ├─ Insert/Update PREFERENCIA_COMUNICACAO
   ├─ Auditoria
   └─ Sucesso: "Preferências salvas"

5. [Daqui em diante]
   ├─ Sistema respeita preferências
   ├─ Aluno que desativou Push → não recebe push
   ├─ Professor que selecionou diário → recebe resumo/dia
   └─ Quem fez unsubscribe total → sem nada
```

#### Database Schema

```sql
CREATE TABLE PREFERENCIA_COMUNICACAO (
    preferencia_id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES USUARIO(usuario_id),
    academia_id SMALLINT NOT NULL,
    
    -- Email preferences
    email_pagamento_vencido BOOLEAN DEFAULT true,
    email_certificado BOOLEAN DEFAULT true,
    email_promocao BOOLEAN DEFAULT true,
    email_relatorio BOOLEAN DEFAULT true,
    email_aula_cancelada BOOLEAN DEFAULT true,
    
    -- Push preferences
    push_pagamento_vencido BOOLEAN DEFAULT true,
    push_certificado BOOLEAN DEFAULT true,
    push_promocao BOOLEAN DEFAULT false,
    push_relatorio BOOLEAN DEFAULT false,
    push_aula_cancelada BOOLEAN DEFAULT true,
    
    -- SMS preferences
    sms_pagamento_urgente BOOLEAN DEFAULT true,
    sms_outros BOOLEAN DEFAULT false,
    
    -- Frequency
    email_frequencia ENUM('IMEDIATO', 'DIARIO', 'SEMANAL') DEFAULT 'IMEDIATO',
    
    -- Global opt-out
    unsubscribed BOOLEAN DEFAULT false,
    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE (usuario_id, academia_id),
    INDEX idx_usuario (usuario_id)
);
```

---

### 3.5 RF-COM-05: Rastreamento Comunicação (Histórico, Analytics, Delivery)

#### Descrição
Dashboard/histórico de todas comunicações: o que foi enviado, quando, para quem, status entrega (enviado, entregue, aberto, clicado, bounce). Com métricas (open rate, click rate).

#### Casos de Uso

**UC-COM-005: Coordenador Monitora Comunicação**

```
Ator: COORDENADOR
Pré: Autenticado

1. [COORD] Acessa "Comunicação → Histórico"
2. [SYS] Dashboard:

   ÚLTIMAS CAMPANHAS:
   ├─ Email inadimplência (02/04 20:00)
   │  ├─ Total enviado: 12
   │  ├─ Entregues: 11 (92%)
   │  ├─ Abertos: 8 (67%)
   │  ├─ Clicados: 5 (42%)
   │  └─ Bounce: 1 (8%)
   │
   ├─ Certificado (02/04 14:30)
   │  └─ Total enviado: 1
   │     Entregue: 1, Aberto: 1, Clicado: 1
   │
   └─ Promoção Whey (01/04 10:00)
      └─ Total enviado: 560
         Entregues: 558, Abertos: 342 (61%), Clicados: 128 (23%)

3. [COORD] Filter & Search:
   ├─ Período: [Últimos 7 dias▼]
   ├─ Tipo: [Email▼]
   ├─ Status: [Entregue▼]
   ├─ Usuário: [_________] (busca)
   └─ [ Filtrar ]

4. [COORD] Click campaign
5. [SYS] Mostra detalhes:
   ├─ Template: "Cobrança Gentil"
   ├─ Enviados para: [listar 12 alunos]
   │  ├─ João - enviado 02/04 20:00, entregue 20:01, aberto 20:05
   │  ├─ Maria - enviado 02/04 20:00, entregue 20:01, aberto 20:12, clicado 20:13
   │  ├─ Pedro - enviado 02/04 20:00, BOUNCE (inválido)
   │  └─ ... (9 mais)
   ├─ Gráfico: Taxa abertura por hora
   ├─ Link: Resend aos não-abertos
   └─ [ Exportar Relatório ]

6. [COORD] Click [Exportar Relatório]
7. [SYS] Gera CSV com:
   ├─ Usuário, Email, Status, Data Envio, Data Entrega, Data Abertura, etc
   ├─ Summary: 12 enviados, 11 entregues (92%), 8 abertos (67%)
   └─ Download: comunicacao_inadeimplencia_2026-04-02.csv
```

#### Database Schema (Expanding)

```sql
-- COMUNICACAO_LOG já cobrido em RF-COM-01
-- Expandir com webhooks de tracking

CREATE TABLE WEBHOOK_EVENTO_COMUNICACAO (
    evento_id BIGSERIAL PRIMARY KEY,
    log_id BIGINT NOT NULL REFERENCES COMUNICACAO_LOG(log_id),
    
    tipo_evento ENUM('DELIVERED', 'OPENED', 'CLICKED', 'BOUNCED', 'SPAM', 'UNSUBSCRIBED'),
    
    timestamp_evento TIMESTAMP,
    detalhes JSONB,  -- Ex: {"ip": "192.168.1.1", "user_agent": "Mozilla/5.0..."}
    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_log (log_id),
    INDEX idx_evento (tipo_evento)
);

-- Analytics summary (pre-computed)
CREATE TABLE ESTATISTICA_COMUNICACAO (
    stats_id SERIAL PRIMARY KEY,
    academia_id SMALLINT NOT NULL,
    
    data DATE,
    tipo_canal VARCHAR(20),  -- EMAIL, PUSH, SMS
    
    total_enviado INTEGER DEFAULT 0,
    total_entregue INTEGER DEFAULT 0,
    total_aberto INTEGER DEFAULT 0,
    total_clicado INTEGER DEFAULT 0,
    total_bounce INTEGER DEFAULT 0,
    
    taxa_entrega NUMERIC(5,2),  -- %
    taxa_abertura NUMERIC(5,2),  -- %
    taxa_clique NUMERIC(5,2),    -- %
    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE (academia_id, data, tipo_canal)
);
```

---

## 4. Especificações Técnicas

### 4.1 Stack

```
Backend
├─ Java 17+, Spring Boot 3.0+
├─ spring-boot-starter-mail
├─ spring-boot-starter-webflux (async)
├─ Template engine: Thymeleaf/Freemarker
├─ Firebase Admin SDK (FCM)

External Services
├─ SendGrid (email provider, $10-80/mo)
├─ Firebase Cloud Messaging (free for push)
├─ Twilio (SMS, optional, $0.01/msg)

Frontend
├─ React 18+
├─ Firebase Web SDK (for push tokens)
└─ Chart.js (analytics charts)

Database
├─ PostgreSQL 14+
└─ Triggers para atualizar stats
```

### 4.2 API Endpoints

```
GET    /api/v1/templates-comunicacao              (RF-COM-01)
POST   /api/v1/templates-comunicacao
PUT    /api/v1/templates-comunicacao/{id}

POST   /api/v1/notificacoes/push                 (RF-COM-02)
GET    /api/v1/dispositivos-push

POST   /api/v1/campanhas-comunicacao              (RF-COM-03)
GET    /api/v1/campanhas-comunicacao
GET    /api/v1/campanhas-comunicacao/{id}/status

POST   /api/v1/usuarios/{id}/preferencias        (RF-COM-04)
GET    /api/v1/usuarios/{id}/preferencias

GET    /api/v1/relatorios/comunicacao            (RF-COM-05)
GET    /api/v1/relatorios/comunicacao/analytics
POST   /api/v1/relatorios/comunicacao/export

-- Webhooks (incoming)
POST   /webhooks/sendgrid                        (delivery tracking)
POST   /webhooks/fcm                             (push delivery)
```

### 4.3 Environment Variables

```
# Email
SENDGRID_API_KEY=SG_xxxx
MAIL_FROM=noreply@forcatotal.com.br

# Push Notifications
FIREBASE_PROJECT_ID=force-total-xxxxx
FIREBASE_API_KEY=AIzaSy_xxxx
FCM_SERVER_KEY=AAAA_xxxx

# SMS (optional)
TWILIO_ACCOUNT_SID=AC_xxxx
TWILIO_AUTH_TOKEN=xxxx
TWILIO_PHONE=+5511999999999
```

---

## 5. Critério de Aceitação

```
✅ RF-COM-01: Email com template customizável, variáveis, HTML
✅ RF-COM-02: Push notification real-time via FCM
✅ RF-COM-03: Email em massa com rastreamento
✅ RF-COM-04: Preferências por usuário (opt-in/opt-out)
✅ RF-COM-05: Histórico com analytics (entrega, abertura, click)

Performance:
✅ Envio email: < 5s (indiretamente async)
✅ Envio push: < 2s
✅ Load histórico: < 1s
✅ Batch 1000 emails: < 30s

Security:
✅ Sem senhas em emails
✅ Tokens expirem em 30min
✅ HTTPS/TLS todo tráego
✅ Rate limiting: 100 msgs/min por usuário
```

---

## 6. Test Cases

```java
@DisplayName("RF-COM-01 a 05")
class ComunicacaoServiceTest {
  @Test
  void deveEnviar_Email_ComTemplate() { }
  
  @Test
  void deveEnviar_PushNotification_ParaDispositivo() { }
  
  @Test
  void deveEnviar_EmailEmMassa_ComRastreamento() { }
  
  @Test
  void deveRespeitar_Preferencias_Comunicacao() { }
  
  @Test
  void deveRastrear_Delivery_Status() { }
  
  @Test
  void deveAtualizar_Analytics_Comunicacao() { }
}
```

---

## 7. Timeline

```
Dia 1 (desenvolvimento):
├─ TEMPLATE_COMUNICACAO table
├─ COMUNICACAO_LOG table
├─ Email integration (SendGrid)
├─ API endpoints 01

Dia 2:
├─ Push notifications (FCM integration)
├─ DISPOSITIVO_PUSH + FCM token management
├─ Bulk send campaign (RF-03)
├─ API endpoints 02-03

Dia 3:
├─ Preferências (RF-04)
├─ Webhook handling (delivery tracking)
├─ Analytics + reporting (RF-05)
├─ Tests (80%+ coverage)
├─ SonarQube gates
└─ Ready
```

---

## 8. Exemplos Templates

### Template 1: Pagamento Recebido

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background-color: {{cores_primaria}}; color: white; padding: 20px; }
        .content { padding: 20px; }
        .footer { background-color: #f0f0f0; padding: 10px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="{{logo_url}}" alt="Logo" height="50">
            <h1>Pagamento Recebido!</h1>
        </div>
        <div class="content">
            <h2>Olá {{aluno_nome}},</h2>
            <p>Confirmamos o recebimento do seu pagamento de matrícula.</p>
            <table>
                <tr><td>Valor:</td><td><b>R${{valor_pago}}</b></td></tr>
                <tr><td>Data:</td><td>{{data_pagamento}}</td></tr>
                <tr><td>Forma:</td><td>{{forma_pagamento}}</td></tr>
                <tr><td>Referência:</td><td>#{{recibo_id}}</td></tr>
            </table>
            <p>Próximo vencimento: <b>{{proxima_vencimento}}</b></p>
            <a href="{{link_recibo}}" style="background-color: {{cores_primaria}}; color: white; padding: 10px; border-radius: 5px;">
                Ver Comprovante
            </a>
        </div>
        <div class="footer">
            <p>{{academia_nome}} | {{academia_endereco}}</p>
            <p><a href="{{link_unsubscribe}}">Desinscrever</a></p>
        </div>
    </div>
</body>
</html>
```

### Template 2: Certificado/Meta Atingida (Push)

```
Title: 🎉 Parabéns, {{aluno_nome}}!
Body: Você atingiu {{valor_atingido}} em {{tipo_teste}}! Meta era {{valor_meta}}.
Icon: 🏆
Action: OPEN_CERTIFICADO
Data: { certificado_id: {{cert_id}} }
```

---

**Status**: 🟢 PRONTO PARA DEV  
**RFs**: 5  
**Linhas Estimadas**: ~3500  
**Stack**: SpringBoot + React + Firebase + SendGrid  
**Próxima**: ✅ TODAS SPECS COMPLETAS!

