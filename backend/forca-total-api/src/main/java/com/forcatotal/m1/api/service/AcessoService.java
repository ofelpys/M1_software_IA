package com.forcatotal.m1.api.service;

import com.forcatotal.m1.api.dto.CheckinRequest;
import com.forcatotal.m1.api.dto.CheckinResponse;
import com.forcatotal.m1.api.dto.DesbloqueioRequest;
import com.forcatotal.m1.api.dto.DesbloqueioResponse;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class AcessoService {

  private final AlunoService alunoService;
  private final JdbcTemplate jdbcTemplate;

  public AcessoService(AlunoService alunoService, JdbcTemplate jdbcTemplate) {
    this.alunoService = alunoService;
    this.jdbcTemplate = jdbcTemplate;
  }

  public CheckinResponse checkin(CheckinRequest request) {
    var statusAluno = alunoService.findStatusByCpf(request.cpf());
    boolean hasAluno = statusAluno.isPresent();
    String statusAtual = statusAluno.orElse("Nao encontrado");
    boolean bloqueadoFinanceiro = "Inadimplente".equalsIgnoreCase(statusAtual) || "Bloqueado".equalsIgnoreCase(statusAtual);
    boolean ok = hasAluno && !bloqueadoFinanceiro;
    String message;

    if (!hasAluno) {
      message = "Aluno nao encontrado para o CPF informado.";
    } else if (bloqueadoFinanceiro) {
      message = "Este aluno esta bloqueado por inadimplencia.";
    } else {
      message = "Check-in persistido no backend.";
    }

    jdbcTemplate.update(
        """
            INSERT INTO registro_acesso(aluno_id, cpf, status_informado, acesso_liberado, mensagem)
            VALUES ((SELECT aluno_id FROM aluno WHERE cpf = ?), ?, ?, ?, ?)
            """,
        request.cpf(),
        request.cpf(),
        statusAtual,
        ok,
        message);

    return new CheckinResponse(ok, message);
  }

  public DesbloqueioResponse desbloquear(Long alunoId, DesbloqueioRequest request) {
    boolean alunoAtualizado = alunoService.updateStatus(alunoId, "Ativo");
    if (!alunoAtualizado) {
      return new DesbloqueioResponse("Aluno nao encontrado para desbloqueio. Verifique o alunoId informado.");
    }

    jdbcTemplate.update(
        """
            INSERT INTO desbloqueio_acesso(aluno_id, aluno_nome, dias_atraso)
            VALUES (?, ?, ?)
            """,
        alunoId,
        request.aluno(),
        request.diasAtraso());

    return new DesbloqueioResponse("Desbloqueio registrado para alunoId=" + alunoId + " e status atualizado para Ativo.");
  }
}
