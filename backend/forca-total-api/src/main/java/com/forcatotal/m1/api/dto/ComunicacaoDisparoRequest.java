package com.forcatotal.m1.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ComunicacaoDisparoRequest(
    @NotBlank String canal,
    @NotBlank String segmento,
    @NotBlank String mensagem,
    @NotNull Boolean ok
) {
}
