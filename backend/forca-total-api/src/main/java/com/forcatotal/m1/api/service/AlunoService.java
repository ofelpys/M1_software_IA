package com.forcatotal.m1.api.service;

import com.forcatotal.m1.api.dto.AlunoCreateRequest;
import com.forcatotal.m1.api.dto.AlunoCreateResponse;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Service;

@Service
public class AlunoService {

  private final JdbcTemplate jdbcTemplate;

  public AlunoService(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
  }

  public AlunoCreateResponse create(AlunoCreateRequest request) {
    AlunoCreateResponse.AlunoPayload payload = new AlunoCreateResponse.AlunoPayload(
        request.nome(), request.cpf(), request.email(), request.plano(), request.unidade());

    KeyHolder keyHolder = new GeneratedKeyHolder();
    jdbcTemplate.update(connection -> {
      var statement = connection.prepareStatement(
          "INSERT INTO aluno(nome, cpf, email, plano, unidade) VALUES (?, ?, ?, ?, ?)",
          Statement.RETURN_GENERATED_KEYS);
      statement.setString(1, request.nome());
      statement.setString(2, request.cpf());
      statement.setString(3, request.email());
      statement.setString(4, request.plano());
        statement.setString(5, request.unidade());
      return statement;
    }, keyHolder);

    Number key = null;
    if (keyHolder.getKeyList() != null && !keyHolder.getKeyList().isEmpty()) {
      Object value = keyHolder.getKeyList().get(0).get("ALUNO_ID");
      if (value instanceof Number number) {
        key = number;
      }
    }
    if (key == null) {
      key = keyHolder.getKey();
    }
    Long id = key != null ? key.longValue() : null;

    return new AlunoCreateResponse(id, payload);
  }

  public List<AlunoCreateResponse> findAll() {
    return jdbcTemplate.query(
        """
            SELECT aluno_id, nome, cpf, email, plano
            , unidade
            FROM aluno
            WHERE ativo = TRUE
            ORDER BY aluno_id DESC
            """,
        (rs, rowNum) -> new AlunoCreateResponse(
            rs.getLong("aluno_id"),
            new AlunoCreateResponse.AlunoPayload(
                rs.getString("nome"),
                rs.getString("cpf"),
                rs.getString("email"),
                rs.getString("plano"),
                rs.getString("unidade"))));
  }

  public Optional<AlunoCreateResponse> findById(Long alunoId) {
    List<AlunoCreateResponse> items = jdbcTemplate.query(
        """
            SELECT aluno_id, nome, cpf, email, plano
            , unidade
            FROM aluno
            WHERE aluno_id = ? AND ativo = TRUE
            """,
        (rs, rowNum) -> new AlunoCreateResponse(
            rs.getLong("aluno_id"),
            new AlunoCreateResponse.AlunoPayload(
                rs.getString("nome"),
                rs.getString("cpf"),
                rs.getString("email"),
                rs.getString("plano"),
                rs.getString("unidade"))),
      alunoId);

    return items.stream().findFirst();
  }

  public Optional<AlunoCreateResponse> update(Long alunoId, AlunoCreateRequest request) {
    int updated = jdbcTemplate.update(
        """
            UPDATE aluno
            SET nome = ?, cpf = ?, email = ?, plano = ?, unidade = ?, atualizado_em = CURRENT_TIMESTAMP
            WHERE aluno_id = ? AND ativo = TRUE
            """,
        request.nome(),
        request.cpf(),
        request.email(),
        request.plano(),
          request.unidade(),
        alunoId);

    if (updated == 0) {
      return Optional.empty();
    }

    return findById(alunoId);
  }

  public boolean softDelete(Long alunoId) {
    int updated = jdbcTemplate.update(
        """
            UPDATE aluno
            SET ativo = FALSE, atualizado_em = CURRENT_TIMESTAMP
            WHERE aluno_id = ? AND ativo = TRUE
            """,
        alunoId);
    return updated > 0;
  }

  public boolean existsByCpf(String cpf) {
    Integer count = jdbcTemplate.queryForObject(
        "SELECT COUNT(1) FROM aluno WHERE cpf = ? AND ativo = TRUE",
        Integer.class,
        cpf);
    return count != null && count > 0;
  }
}
