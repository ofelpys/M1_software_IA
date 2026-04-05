package com.forcatotal.m1.api.service;

import com.forcatotal.m1.api.dto.ProfessorRequest;
import com.forcatotal.m1.api.dto.ProfessorResponse;
import java.sql.Statement;
import java.util.List;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Service;

@Service
public class ProfessorService {

  private final JdbcTemplate jdbcTemplate;

  public ProfessorService(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
  }

  public ProfessorResponse create(ProfessorRequest request) {
    KeyHolder keyHolder = new GeneratedKeyHolder();

    jdbcTemplate.update(connection -> {
      var statement = connection.prepareStatement(
          "INSERT INTO professor(nome, especialidade, status, comissao) VALUES (?, ?, ?, ?)",
          Statement.RETURN_GENERATED_KEYS);
      statement.setString(1, request.nome());
      statement.setString(2, request.especialidade());
      statement.setString(3, request.status());
      statement.setBigDecimal(4, request.comissao());
      return statement;
    }, keyHolder);

    Long id = extractId(keyHolder);
    return new ProfessorResponse(id, request.nome(), request.especialidade(), request.status(), request.comissao());
  }

  public List<ProfessorResponse> list() {
    return jdbcTemplate.query(
        "SELECT professor_id, nome, especialidade, status, comissao FROM professor ORDER BY professor_id DESC",
        (rs, rowNum) -> new ProfessorResponse(
            rs.getLong("professor_id"),
            rs.getString("nome"),
            rs.getString("especialidade"),
            rs.getString("status"),
            rs.getBigDecimal("comissao")));
  }

  private Long extractId(KeyHolder keyHolder) {
    Number key = null;
    if (keyHolder.getKeyList() != null && !keyHolder.getKeyList().isEmpty()) {
      Object value = keyHolder.getKeyList().get(0).get("PROFESSOR_ID");
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
