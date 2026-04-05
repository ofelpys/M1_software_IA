package com.forcatotal.m1.api.service;

import com.forcatotal.m1.api.dto.PagamentoRequest;
import com.forcatotal.m1.api.dto.PagamentoResponse;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Service;

@Service
public class PagamentoService {

  private final JdbcTemplate jdbcTemplate;

  public PagamentoService(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
  }

  public PagamentoResponse create(PagamentoRequest request) {
    KeyHolder keyHolder = new GeneratedKeyHolder();

    jdbcTemplate.update(connection -> {
      var statement = connection.prepareStatement(
          "INSERT INTO pagamento(aluno_nome, valor, status) VALUES (?, ?, ?)",
          Statement.RETURN_GENERATED_KEYS);
      statement.setString(1, request.aluno());
      statement.setBigDecimal(2, request.valor());
      statement.setString(3, request.status());
      return statement;
    }, keyHolder);

    Long id = extractId(keyHolder);
    return new PagamentoResponse(id, request.aluno(), request.valor(), request.status());
  }

  public List<PagamentoResponse> list() {
    return jdbcTemplate.query(
        "SELECT pagamento_id, aluno_nome, valor, status FROM pagamento WHERE ativo = TRUE ORDER BY pagamento_id DESC",
        (rs, rowNum) -> new PagamentoResponse(
            rs.getLong("pagamento_id"),
            rs.getString("aluno_nome"),
            rs.getBigDecimal("valor"),
            rs.getString("status")));
  }

  public Optional<PagamentoResponse> updateStatus(Long pagamentoId, PagamentoRequest request) {
    int updated = jdbcTemplate.update(
        "UPDATE pagamento SET aluno_nome = ?, valor = ?, status = ?, atualizado_em = CURRENT_TIMESTAMP WHERE pagamento_id = ? AND ativo = TRUE",
        request.aluno(),
        request.valor(),
        request.status(),
        pagamentoId);

    if (updated == 0) {
      return Optional.empty();
    }

    return findById(pagamentoId);
  }

  public boolean softDelete(Long pagamentoId) {
    int updated = jdbcTemplate.update(
        "UPDATE pagamento SET ativo = FALSE, atualizado_em = CURRENT_TIMESTAMP WHERE pagamento_id = ? AND ativo = TRUE",
        pagamentoId);
    return updated > 0;
  }

  public Optional<PagamentoResponse> findById(Long pagamentoId) {
    List<PagamentoResponse> items = jdbcTemplate.query(
        "SELECT pagamento_id, aluno_nome, valor, status FROM pagamento WHERE pagamento_id = ? AND ativo = TRUE",
        (rs, rowNum) -> new PagamentoResponse(
            rs.getLong("pagamento_id"),
            rs.getString("aluno_nome"),
            rs.getBigDecimal("valor"),
            rs.getString("status")),
        pagamentoId);
    return items.stream().findFirst();
  }

  private Long extractId(KeyHolder keyHolder) {
    Number key = null;
    if (keyHolder.getKeyList() != null && !keyHolder.getKeyList().isEmpty()) {
      Object value = keyHolder.getKeyList().get(0).get("PAGAMENTO_ID");
      if (value instanceof Number number) {
        key = number;
      }
    }
    if (key == null) {
      key = keyHolder.getKey();
    }
    return key != null ? key.longValue() : null;
  }
}
