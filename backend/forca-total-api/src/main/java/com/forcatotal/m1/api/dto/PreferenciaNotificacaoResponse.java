package com.forcatotal.m1.api.dto;

public record PreferenciaNotificacaoResponse(Long usuarioId, Boolean emailHabilitado, Boolean smsHabilitado, Boolean pushHabilitado) {
}
