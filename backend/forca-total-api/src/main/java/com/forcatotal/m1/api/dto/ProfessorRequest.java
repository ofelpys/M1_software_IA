package com.forcatotal.m1.api.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record ProfessorRequest(
    @NotBlank String nome,
    @NotBlank String especialidade,
    @NotBlank String status,
    @NotNull @DecimalMin("0.00") BigDecimal comissao
) {
}
