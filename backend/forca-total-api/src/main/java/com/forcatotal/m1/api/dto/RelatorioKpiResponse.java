package com.forcatotal.m1.api.dto;

public record RelatorioKpiResponse(
    long alunosCadastrados,
    long checkinsLiberados,
    long checkinsNegados,
    long desbloqueiosRegistrados,
    long comunicacoesProcessadas
) {
}
