package com.forcatotal.m1.api.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record InsumoRequest(
    @NotBlank String produto,
    @NotBlank String categoria,
    @NotNull @Min(0) Integer estoque,
    @NotBlank String status
) {
}
