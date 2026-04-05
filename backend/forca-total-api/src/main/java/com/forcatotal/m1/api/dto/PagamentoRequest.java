package com.forcatotal.m1.api.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record PagamentoRequest(
    @NotBlank String aluno,
    @NotNull @DecimalMin("0.01") BigDecimal valor,
    @NotBlank String status
) {
}
