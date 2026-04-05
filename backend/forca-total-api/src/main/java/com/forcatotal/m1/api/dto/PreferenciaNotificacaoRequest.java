package com.forcatotal.m1.api.dto;

import jakarta.validation.constraints.NotNull;

public record PreferenciaNotificacaoRequest(
    @NotNull Boolean emailHabilitado,
    @NotNull Boolean smsHabilitado,
    @NotNull Boolean pushHabilitado
) {
}
