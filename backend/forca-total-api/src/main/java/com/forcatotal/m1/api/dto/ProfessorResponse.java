package com.forcatotal.m1.api.dto;

import java.math.BigDecimal;

public record ProfessorResponse(Long id, String nome, String especialidade, String status, BigDecimal comissao) {
}
