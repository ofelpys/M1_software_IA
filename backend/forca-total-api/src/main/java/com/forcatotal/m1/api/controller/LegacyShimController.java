package com.forcatotal.m1.api.controller;

import com.forcatotal.m1.api.dto.AlunoCreateRequest;
import com.forcatotal.m1.api.dto.AlunoCreateResponse;
import com.forcatotal.m1.api.dto.CheckinRequest;
import com.forcatotal.m1.api.dto.CheckinResponse;
import com.forcatotal.m1.api.dto.ComunicacaoDisparoRequest;
import com.forcatotal.m1.api.dto.ComunicacaoDisparoResponse;
import com.forcatotal.m1.api.dto.DesbloqueioRequest;
import com.forcatotal.m1.api.dto.DesbloqueioResponse;
import com.forcatotal.m1.api.service.AcessoService;
import com.forcatotal.m1.api.service.AlunoService;
import com.forcatotal.m1.api.service.ComunicacaoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LegacyShimController {

  private final AlunoService alunoService;
  private final AcessoService acessoService;
  private final ComunicacaoService comunicacaoService;

  public LegacyShimController(
      AlunoService alunoService,
      AcessoService acessoService,
      ComunicacaoService comunicacaoService) {
    this.alunoService = alunoService;
    this.acessoService = acessoService;
    this.comunicacaoService = comunicacaoService;
  }

  @PostMapping("/m01/alunos")
  public ResponseEntity<AlunoCreateResponse> legacyCreateAluno(@Valid @RequestBody AlunoCreateRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(alunoService.create(request));
  }

  @PostMapping("/m01/checkins")
  public ResponseEntity<CheckinResponse> legacyCheckin(@Valid @RequestBody CheckinRequest request) {
    return ResponseEntity.ok(acessoService.checkin(request));
  }

  @PostMapping("/m02/inadimplencia/desbloqueios")
  public ResponseEntity<DesbloqueioResponse> legacyDesbloqueio(@Valid @RequestBody DesbloqueioRequest request) {
    return ResponseEntity.ok(acessoService.desbloquear(0L, request));
  }

  @PostMapping("/m08/comunicacoes/disparos")
  public ResponseEntity<ComunicacaoDisparoResponse> legacyDisparo(@Valid @RequestBody ComunicacaoDisparoRequest request) {
    return ResponseEntity.ok(comunicacaoService.disparar(request));
  }
}
