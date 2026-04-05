package com.forcatotal.m1.api.service;

import com.forcatotal.m1.api.dto.InsumoRequest;
import com.forcatotal.m1.api.dto.InsumoResponse;
import java.sql.Statement;
import java.util.List;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Service;

@Service
public class InsumoService {

  private final JdbcTemplate jdbcTemplate;

  public InsumoService(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
  }

  public InsumoResponse create(InsumoRequest request) {
    KeyHolder keyHolder = new GeneratedKeyHolder();

    jdbcTemplate.update(connection -> {
      var statement = connection.prepareStatement(
          "INSERT INTO insumo_produto(produto, categoria, estoque, status) VALUES (?, ?, ?, ?)",
          Statement.RETURN_GENERATED_KEYS);
      statement.setString(1, request.produto());
      statement.setString(2, request.categoria());
      statement.setInt(3, request.estoque());
      statement.setString(4, request.status());
      return statement;
    }, keyHolder);

    Long id = extractId(keyHolder);
    return new InsumoResponse(id, request.produto(), request.categoria(), request.estoque(), request.status());
  }

  public List<InsumoResponse> list() {
    return jdbcTemplate.query(
        "SELECT insumo_id, produto, categoria, estoque, status FROM insumo_produto ORDER BY insumo_id DESC",
        (rs, rowNum) -> new InsumoResponse(
            rs.getLong("insumo_id"),
            rs.getString("produto"),
            rs.getString("categoria"),
            rs.getInt("estoque"),
            rs.getString("status")));
  }

  private Long extractId(KeyHolder keyHolder) {
    Number key = null;
    if (keyHolder.getKeyList() != null && !keyHolder.getKeyList().isEmpty()) {
      Object value = keyHolder.getKeyList().get(0).get("INSUMO_ID");
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
