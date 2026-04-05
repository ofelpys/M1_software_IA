package com.forcatotal.m1.api.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DesbloqueioRequest(
    @NotBlank String aluno,
    @NotNull @Min(0) Integer diasAtraso
) {
}
