package com.forcatotal.m1.api.service;

import com.forcatotal.m1.api.dto.EquipamentoRequest;
import com.forcatotal.m1.api.dto.EquipamentoResponse;
import java.sql.Statement;
import java.util.List;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Service;

@Service
public class EquipamentoService {

  private final JdbcTemplate jdbcTemplate;

  public EquipamentoService(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
  }

  public EquipamentoResponse create(EquipamentoRequest request) {
    KeyHolder keyHolder = new GeneratedKeyHolder();

    jdbcTemplate.update(connection -> {
      var statement = connection.prepareStatement(
          "INSERT INTO equipamento(nome, unidade, status, proxima_manutencao) VALUES (?, ?, ?, ?)",
          Statement.RETURN_GENERATED_KEYS);
      statement.setString(1, request.nome());
      statement.setString(2, request.unidade());
      statement.setString(3, request.status());
      statement.setString(4, request.proximaManutencao());
      return statement;
    }, keyHolder);

    Long id = extractId(keyHolder);
    return new EquipamentoResponse(id, request.nome(), request.unidade(), request.status(), request.proximaManutencao());
  }

  public List<EquipamentoResponse> list() {
    return jdbcTemplate.query(
        "SELECT equipamento_id, nome, unidade, status, proxima_manutencao FROM equipamento ORDER BY equipamento_id DESC",
        (rs, rowNum) -> new EquipamentoResponse(
            rs.getLong("equipamento_id"),
            rs.getString("nome"),
            rs.getString("unidade"),
            rs.getString("status"),
            rs.getString("proxima_manutencao")));
  }

  private Long extractId(KeyHolder keyHolder) {
    Number key = null;
    if (keyHolder.getKeyList() != null && !keyHolder.getKeyList().isEmpty()) {
      Object value = keyHolder.getKeyList().get(0).get("EQUIPAMENTO_ID");
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
