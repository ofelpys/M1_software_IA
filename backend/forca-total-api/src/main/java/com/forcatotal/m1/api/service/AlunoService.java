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

  private static final String STATUS_ATIVO = "Ativo";
  private static final String STATUS_INADIMPLENTE = "Inadimplente";
  private static final String STATUS_BLOQUEADO = "Bloqueado";

  private final JdbcTemplate jdbcTemplate;

  public AlunoService(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
  }

  public AlunoCreateResponse create(AlunoCreateRequest request) {
    String status = normalizeStatus(request.status());
    AlunoCreateResponse.AlunoPayload payload = new AlunoCreateResponse.AlunoPayload(
      request.nome(), request.cpf(), request.email(), request.telefone(), request.dataNascimento(),
      request.endereco(), request.objetivo(), request.contatoEmergencia(), request.plano(), request.unidade(), status);

    KeyHolder keyHolder = new GeneratedKeyHolder();
    jdbcTemplate.update(connection -> {
      var statement = connection.prepareStatement(
          "INSERT INTO aluno(nome, cpf, email, telefone, data_nascimento, endereco, objetivo, contato_emergencia, plano, unidade, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          Statement.RETURN_GENERATED_KEYS);
      statement.setString(1, request.nome());
      statement.setString(2, request.cpf());
      statement.setString(3, request.email());
        statement.setString(4, request.telefone());
        statement.setString(5, request.dataNascimento());
        statement.setString(6, request.endereco());
        statement.setString(7, request.objetivo());
        statement.setString(8, request.contatoEmergencia());
        statement.setString(9, request.plano());
        statement.setString(10, request.unidade());
        statement.setString(11, status);
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
            , telefone, data_nascimento, endereco, objetivo, contato_emergencia
            , unidade, status
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
                rs.getString("telefone"),
                rs.getString("data_nascimento"),
                rs.getString("endereco"),
                rs.getString("objetivo"),
                rs.getString("contato_emergencia"),
                rs.getString("plano"),
                rs.getString("unidade"),
                rs.getString("status"))));
  }

  public Optional<AlunoCreateResponse> findById(Long alunoId) {
    List<AlunoCreateResponse> items = jdbcTemplate.query(
        """
            SELECT aluno_id, nome, cpf, email, plano
            , telefone, data_nascimento, endereco, objetivo, contato_emergencia
            , unidade, status
            FROM aluno
            WHERE aluno_id = ? AND ativo = TRUE
            """,
        (rs, rowNum) -> new AlunoCreateResponse(
            rs.getLong("aluno_id"),
            new AlunoCreateResponse.AlunoPayload(
                rs.getString("nome"),
                rs.getString("cpf"),
                rs.getString("email"),
                rs.getString("telefone"),
                rs.getString("data_nascimento"),
                rs.getString("endereco"),
                rs.getString("objetivo"),
                rs.getString("contato_emergencia"),
                rs.getString("plano"),
                rs.getString("unidade"),
                rs.getString("status"))),
      alunoId);

    return items.stream().findFirst();
  }

  public Optional<AlunoCreateResponse> update(Long alunoId, AlunoCreateRequest request) {
    int updated = jdbcTemplate.update(
        """
        UPDATE aluno
        SET nome = ?, cpf = ?, email = ?, telefone = ?, data_nascimento = ?, endereco = ?, objetivo = ?, contato_emergencia = ?, plano = ?, unidade = ?, status = ?, atualizado_em = CURRENT_TIMESTAMP
            WHERE aluno_id = ? AND ativo = TRUE
            """,
        request.nome(),
        request.cpf(),
        request.email(),
      request.telefone(),
      request.dataNascimento(),
      request.endereco(),
      request.objetivo(),
      request.contatoEmergencia(),
        request.plano(),
      request.unidade(),
      normalizeStatus(request.status()),
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
        SET ativo = FALSE, status = ?, atualizado_em = CURRENT_TIMESTAMP
            WHERE aluno_id = ? AND ativo = TRUE
            """,
      STATUS_BLOQUEADO,
        alunoId);
    return updated > 0;
  }

  public boolean hardDelete(Long alunoId) {
    List<String> cpfs = jdbcTemplate.query(
        "SELECT cpf FROM aluno WHERE aluno_id = ?",
        (rs, rowNum) -> rs.getString("cpf"),
        alunoId);

    if (cpfs.isEmpty()) {
      return false;
    }

    String cpf = cpfs.get(0);

    jdbcTemplate.update(
        "DELETE FROM registro_acesso WHERE aluno_id = ? OR cpf = ?",
        alunoId,
        cpf);
    jdbcTemplate.update("DELETE FROM desbloqueio_acesso WHERE aluno_id = ?", alunoId);
    jdbcTemplate.update("DELETE FROM aluno WHERE aluno_id = ?", alunoId);
    return true;
  }

  public boolean existsByCpf(String cpf) {
    Integer count = jdbcTemplate.queryForObject(
        "SELECT COUNT(1) FROM aluno WHERE cpf = ? AND ativo = TRUE",
        Integer.class,
        cpf);
    return count != null && count > 0;
  }

  public Optional<String> findStatusByCpf(String cpf) {
    List<String> statuses = jdbcTemplate.query(
        "SELECT status FROM aluno WHERE cpf = ? AND ativo = TRUE",
        (rs, rowNum) -> rs.getString("status"),
        cpf);
    return statuses.stream().findFirst().map(this::normalizeStatus);
  }

  public boolean updateStatus(Long alunoId, String status) {
    int updated = jdbcTemplate.update(
        """
            UPDATE aluno
            SET status = ?, ativo = TRUE, atualizado_em = CURRENT_TIMESTAMP
            WHERE aluno_id = ?
            """,
        normalizeStatus(status),
        alunoId);
    return updated > 0;
  }

  private String normalizeStatus(String status) {
    String value = String.valueOf(status == null ? "" : status).trim();
    if (STATUS_INADIMPLENTE.equalsIgnoreCase(value)) {
      return STATUS_INADIMPLENTE;
    }
    if (STATUS_BLOQUEADO.equalsIgnoreCase(value)) {
      return STATUS_BLOQUEADO;
    }
    return STATUS_ATIVO;
  }
}
