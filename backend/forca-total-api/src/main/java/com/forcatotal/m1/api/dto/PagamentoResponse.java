package com.forcatotal.m1.api.dto;

import java.math.BigDecimal;

public record PagamentoResponse(Long id, String aluno, BigDecimal valor, String status) {
}
