package com.forcatotal.m1.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record CheckinRequest(
    @NotBlank @Pattern(regexp = "^\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}$") String cpf,
    @NotBlank String status
) {
}
