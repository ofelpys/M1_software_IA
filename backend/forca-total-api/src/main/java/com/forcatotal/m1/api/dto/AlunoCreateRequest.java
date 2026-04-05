package com.forcatotal.m1.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AlunoCreateRequest(
    @NotBlank @Size(min = 3, max = 150) String nome,
    @NotBlank @Pattern(regexp = "^\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}$") String cpf,
    @NotBlank @Email String email,
    @NotBlank String plano,
    @NotBlank String unidade
) {
}
