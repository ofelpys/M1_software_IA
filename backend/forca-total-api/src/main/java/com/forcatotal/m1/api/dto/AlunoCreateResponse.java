package com.forcatotal.m1.api.dto;

public record AlunoCreateResponse(Long id, AlunoPayload aluno) {

  public record AlunoPayload(
      String nome,
      String cpf,
      String email,
      String telefone,
      String dataNascimento,
      String endereco,
      String objetivo,
      String contatoEmergencia,
      String plano,
      String unidade,
      String status) {
  }
}
