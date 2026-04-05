package com.forcatotal.m1.api.service;

import com.forcatotal.m1.api.dto.ComunicacaoDisparoRequest;
import com.forcatotal.m1.api.dto.ComunicacaoDisparoResponse;
import com.forcatotal.m1.api.dto.NotificacaoResponse;
import com.forcatotal.m1.api.dto.PreferenciaNotificacaoRequest;
import com.forcatotal.m1.api.dto.PreferenciaNotificacaoResponse;
import java.util.List;
import java.util.Optional;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class ComunicacaoService {

  private final JdbcTemplate jdbcTemplate;

  public ComunicacaoService(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
  }

  public ComunicacaoDisparoResponse disparar(ComunicacaoDisparoRequest request) {
    boolean processed = Boolean.TRUE.equals(request.ok());
    String message;

    if (Boolean.TRUE.equals(request.ok())) {
      message = "Disparo persistido no backend.";
    } else {
      message = "Falha no envio. Status RETRY agendado para 5 minutos.";
    }

    jdbcTemplate.update(
        """
            INSERT INTO comunicacao_disparo(canal, segmento, mensagem, ok_solicitado, ok_processado, resposta)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
        request.canal(),
        request.segmento(),
        request.mensagem(),
        request.ok(),
        processed,
        message);

      jdbcTemplate.update(
        """
          INSERT INTO notificacao(canal, segmento, mensagem, status)
          VALUES (?, ?, ?, ?)
          """,
        request.canal(),
        request.segmento(),
        request.mensagem(),
        processed ? "ENVIADA" : "RETRY");

    return new ComunicacaoDisparoResponse(processed, message);
  }

      public List<NotificacaoResponse> listNotificacoes() {
      return jdbcTemplate.query(
        "SELECT notificacao_id, canal, segmento, mensagem, status FROM notificacao ORDER BY notificacao_id DESC",
        (rs, rowNum) -> new NotificacaoResponse(
          rs.getLong("notificacao_id"),
          rs.getString("canal"),
          rs.getString("segmento"),
          rs.getString("mensagem"),
          rs.getString("status")));
      }

      public PreferenciaNotificacaoResponse upsertPreferencias(Long usuarioId, PreferenciaNotificacaoRequest request) {
      jdbcTemplate.update(
        """
          MERGE INTO preferencia_notificacao KEY(usuario_id)
          VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
          """,
        usuarioId,
        request.emailHabilitado(),
        request.smsHabilitado(),
        request.pushHabilitado());

      return new PreferenciaNotificacaoResponse(
        usuarioId,
        request.emailHabilitado(),
        request.smsHabilitado(),
        request.pushHabilitado());
      }

      public Optional<PreferenciaNotificacaoResponse> getPreferencias(Long usuarioId) {
      List<PreferenciaNotificacaoResponse> items = jdbcTemplate.query(
        "SELECT usuario_id, email_habilitado, sms_habilitado, push_habilitado FROM preferencia_notificacao WHERE usuario_id = ?",
        (rs, rowNum) -> new PreferenciaNotificacaoResponse(
          rs.getLong("usuario_id"),
          rs.getBoolean("email_habilitado"),
          rs.getBoolean("sms_habilitado"),
          rs.getBoolean("push_habilitado")),
        usuarioId);

      return items.stream().findFirst();
      }
}
