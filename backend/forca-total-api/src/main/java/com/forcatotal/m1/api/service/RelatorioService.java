package com.forcatotal.m1.api.service;

import com.forcatotal.m1.api.dto.RelatorioKpiResponse;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

@Service
public class RelatorioService {

  private final JdbcTemplate jdbcTemplate;

  public RelatorioService(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
  }

  public RelatorioKpiResponse getKpis() {
    long alunosCadastrados = count("SELECT COUNT(1) FROM aluno");
    long checkinsLiberados = count("SELECT COUNT(1) FROM registro_acesso WHERE acesso_liberado = TRUE");
    long checkinsNegados = count("SELECT COUNT(1) FROM registro_acesso WHERE acesso_liberado = FALSE");
    long desbloqueiosRegistrados = count("SELECT COUNT(1) FROM desbloqueio_acesso");
    long comunicacoesProcessadas = count("SELECT COUNT(1) FROM comunicacao_disparo WHERE ok_processado = TRUE");

    return new RelatorioKpiResponse(
        alunosCadastrados,
        checkinsLiberados,
        checkinsNegados,
        desbloqueiosRegistrados,
        comunicacoesProcessadas);
  }

  private long count(@NonNull String sql) {
    Long value = jdbcTemplate.queryForObject(sql, Long.class);
    return value != null ? value : 0L;
  }
}
