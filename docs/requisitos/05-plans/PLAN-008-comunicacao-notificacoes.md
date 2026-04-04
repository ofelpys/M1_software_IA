# PLAN-008 — Comunicação & Notificações (Implementação Técnica)

> **Versão**: 1.0  
> **Data**: 3 de abril de 2026  
> **Baseado em**: SPEC-008-comunicacao-notificacoes.md  
> **RFs Cobertas**: RF-COM-01 a 05 (5 RFs)  
> **Tempo Estimado**: 4 horas

---

## 1. Tabelas Principais

```sql
TABLE notificacao {
  notificacao_id BIGSERIAL PRIMARY KEY
  usuario_id BIGINT NOT NULL REFERENCES usuario(usuario_id) ON DELETE CASCADE
  
  tipo ENUM('MATRICULA_VENCIDA', 'AULA_PROXIMA', 'COMISSAO_DISPONIVEL', 'ALERTA_ESTOQUE', 'MENSAGEM')
  titulo VARCHAR(200) NOT NULL
  conteudo TEXT NOT NULL
  
  canal ENUM('EMAIL', 'SMS', 'PUSH', 'APP') NOT NULL
  
  status ENUM('PENDENTE', 'ENVIADA', 'LIDA', 'FALHA') DEFAULT 'PENDENTE'
  data_envio TIMESTAMP
  data_leitura TIMESTAMP
  
  link_relacionado VARCHAR(500) -- Ex: /alunos/123/matricula
  
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
}

TABLE template_notificacao {
  template_id SMALLSERIAL PRIMARY KEY
  tipo_notificacao VARCHAR(50) NOT NULL UNIQUE
  
  titulo_template VARCHAR(200) WITH VARIABLE {nome_aluno}, {data}, etc
  conteudo_template TEXT WITH VARIABLES
  
  canais ENUM('EMAIL', 'SMS', 'PUSH')[]
  ativo BOOLEAN DEFAULT TRUE
  
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
}

TABLE log_comunicacao {
  log_id BIGSERIAL PRIMARY KEY
  usuario_destinatario_id BIGINT REFERENCES usuario(usuario_id)
  
  tipo_comunicacao VARCHAR(50)
  canal VARCHAR(30)
  
  status_envio ENUM('SUCESSO', 'FALHA', 'RETRY') NOT NULL
  mensagem_erro TEXT
  
  tentativas SMALLINT DEFAULT 1
  proxima_tentativa TIMESTAMP
  
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
}

TABLE preferencia_usuario {
  preferencia_id BIGSERIAL PRIMARY KEY
  usuario_id BIGINT NOT NULL REFERENCES usuario(usuario_id) ON DELETE CASCADE UNIQUE
  
  notificacoes_email BOOLEAN DEFAULT TRUE
  notificacoes_sms BOOLEAN DEFAULT TRUE
  notificacoes_push BOOLEAN DEFAULT TRUE
  notificacoes_app BOOLEAN DEFAULT TRUE
  
  horario_silencioso_inicio TIME
  horario_silencioso_fim TIME
  
  frequencia_digest ENUM('DIARIA', 'SEMANAL', 'NUNCA') DEFAULT 'DIARIA'
  
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
}
```

---

## 2. API REST (10 Endpoints)

```
GET    /api/notificacoes (Listar do usuário)
GET    /api/notificacoes/{id} (Detalhe)
PUT    /api/notificacoes/{id}/marcar-como-lida (Marcar lida)

POST   /api/usuarios/{id}/preferencias (Salvar preferências)
GET    /api/usuarios/{id}/preferencias (Buscar preferências)

POST   /api/comunicacoes/email-teste (Enviar test email)
GET    /api/comunicacoes/status (Status sistema SMS/Email)

POST   /api/templates/notificacao (Criar template - Admin)
PUT    /api/templates/{id} (Editar template)
GET    /api/templates (Listar templates)
```

---

## 3. Integrações Externas

```java
// Email: SendGrid ou AWS SES
// SMS: Twillio ou ClickSend
// Push: Firebase Cloud Messaging (FCM)

@Service
public class EmailService {
  public void enviarNotificacao(Notificacao notif) {
    // SendGrid API call
  }
}

@Service
public class SMSService {
  public void enviarSMS(String telefone, String mensagem) {
    // Twillio API call
  }
}

@Service
public class PushNotificationService {
  public void enviarPush(String deviceToken, Notificacao notif) {
    // FCM API call
  }
}
```

---

## 4. React Components

```jsx
// NotificacoesPage.jsx, PreferenciasNotificacoes.jsx
```

---

## 5. Schedulers

```java
// Diário: Verificar matrículas próximas a vencer
@Scheduled(cron = "0 0 * * *")
public void notificarMatriculasVencimento() { ... }

// Diário às 6h: Notificar aulas do dia
@Scheduled(cron = "0 6 * * *")
public void notificarAulasDia() { ... }

// 5º dia do mês: Notificar comissão disponível
@Scheduled(cron = "0 8 5 * *")
public void notificarComissao() { ... }

// Diário às 22h30: Digest diário (se usuario preferir)
@Scheduled(cron = "0 22 30 * * *")
public void enviarDigestDiario() { ... }
```

---

## 6. Critérios de Aceição

```
✅ Notificações
  ☑ Email funcional (teste + produção)
  ☑ SMS funcional (teste + produção)
  ☑ Push notifications (opcional - Fase 1)
  ☑ Preferências de usuário respeitadas

✅ API
  ☑ 10 endpoints funcionando
  ☑ Retry automático em caso de falha

✅ React
  ☑ Centro de notificações
  ☑ Preferências customizáveis

✅ Logs
  ☑ Todas tentativas de envio registradas
  ☑ Auditoria de falhas
```

---

**Tempo Estimado**: 4 horas  
**Status**: 📋 Pronto para desenvolvimento
