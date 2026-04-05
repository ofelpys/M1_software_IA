package com.forcatotal.m1.api.controller;

import com.forcatotal.m1.api.dto.ComunicacaoDisparoRequest;
import com.forcatotal.m1.api.dto.ComunicacaoDisparoResponse;
import com.forcatotal.m1.api.dto.NotificacaoResponse;
import com.forcatotal.m1.api.dto.PreferenciaNotificacaoRequest;
import com.forcatotal.m1.api.dto.PreferenciaNotificacaoResponse;
import com.forcatotal.m1.api.service.ComunicacaoService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class M08Controller {

  private final ComunicacaoService comunicacaoService;

  public M08Controller(ComunicacaoService comunicacaoService) {
    this.comunicacaoService = comunicacaoService;
  }

  @PostMapping("/api/comunicacoes/disparos")
  public ResponseEntity<ComunicacaoDisparoResponse> disparar(@Valid @RequestBody ComunicacaoDisparoRequest request) {
    return ResponseEntity.ok(comunicacaoService.disparar(request));
  }

  @GetMapping("/api/notificacoes")
  public ResponseEntity<List<NotificacaoResponse>> listNotificacoes() {
    return ResponseEntity.ok(comunicacaoService.listNotificacoes());
  }

  @PostMapping("/api/usuarios/{usuarioId}/preferencias")
  public ResponseEntity<PreferenciaNotificacaoResponse> upsertPreferencias(
      @PathVariable Long usuarioId,
      @Valid @RequestBody PreferenciaNotificacaoRequest request) {
    return ResponseEntity.ok(comunicacaoService.upsertPreferencias(usuarioId, request));
  }

  @GetMapping("/api/usuarios/{usuarioId}/preferencias")
  public ResponseEntity<PreferenciaNotificacaoResponse> getPreferencias(@PathVariable Long usuarioId) {
    return comunicacaoService.getPreferencias(usuarioId)
        .map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.notFound().build());
  }
}
