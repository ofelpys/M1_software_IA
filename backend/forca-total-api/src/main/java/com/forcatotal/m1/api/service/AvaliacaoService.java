package com.forcatotal.m1.api.service;

import com.forcatotal.m1.api.dto.AvaliacaoRequest;
import com.forcatotal.m1.api.dto.AvaliacaoResponse;
import java.sql.Statement;
import java.util.List;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Service;

@Service
public class AvaliacaoService {

  private final JdbcTemplate jdbcTemplate;

  public AvaliacaoService(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
  }

  public AvaliacaoResponse create(AvaliacaoRequest request) {
    KeyHolder keyHolder = new GeneratedKeyHolder();

    jdbcTemplate.update(connection -> {
      var statement = connection.prepareStatement(
          "INSERT INTO avaliacao_evolucao(aluno_nome, teste, evolucao, status) VALUES (?, ?, ?, ?)",
          Statement.RETURN_GENERATED_KEYS);
      statement.setString(1, request.aluno());
      statement.setString(2, request.teste());
      statement.setString(3, request.evolucao());
      statement.setString(4, request.status());
      return statement;
    }, keyHolder);

    Long id = extractId(keyHolder);
    return new AvaliacaoResponse(id, request.aluno(), request.teste(), request.evolucao(), request.status());
  }

  public List<AvaliacaoResponse> list() {
    return jdbcTemplate.query(
        "SELECT avaliacao_id, aluno_nome, teste, evolucao, status FROM avaliacao_evolucao ORDER BY avaliacao_id DESC",
        (rs, rowNum) -> new AvaliacaoResponse(
            rs.getLong("avaliacao_id"),
            rs.getString("aluno_nome"),
            rs.getString("teste"),
            rs.getString("evolucao"),
            rs.getString("status")));
  }

  private Long extractId(KeyHolder keyHolder) {
    Number key = null;
    if (keyHolder.getKeyList() != null && !keyHolder.getKeyList().isEmpty()) {
      Object value = keyHolder.getKeyList().get(0).get("AVALIACAO_ID");
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
