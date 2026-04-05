package com.forcatotal.m1.api.dto;

import jakarta.validation.constraints.NotBlank;

public record EquipamentoRequest(
    @NotBlank String nome,
    @NotBlank String unidade,
    @NotBlank String status,
    String proximaManutencao
) {
}
