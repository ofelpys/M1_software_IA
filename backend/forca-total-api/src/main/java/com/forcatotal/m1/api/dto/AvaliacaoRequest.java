package com.forcatotal.m1.api.dto;

import jakarta.validation.constraints.NotBlank;

public record AvaliacaoRequest(
    @NotBlank String aluno,
    @NotBlank String teste,
    @NotBlank String evolucao,
    @NotBlank String status
) {
}
