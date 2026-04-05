package com.forcatotal.m1.api.dto;

public record NotificacaoResponse(Long id, String canal, String segmento, String mensagem, String status) {
}
