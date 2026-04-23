package com.forcatotal.m1.api.controller;

import com.forcatotal.m1.api.dto.DesbloqueioRequest;
import com.forcatotal.m1.api.dto.DesbloqueioResponse;
import com.forcatotal.m1.api.dto.PagamentoRequest;
import com.forcatotal.m1.api.dto.PagamentoResponse;
import com.forcatotal.m1.api.service.AcessoService;
import com.forcatotal.m1.api.service.AlunoService;
import com.forcatotal.m1.api.service.PagamentoService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class M02Controller {

  private final AcessoService acessoService;
  private final AlunoService alunoService;
  private final PagamentoService pagamentoService;

  public M02Controller(AcessoService acessoService, AlunoService alunoService, PagamentoService pagamentoService) {
    this.acessoService = acessoService;
    this.alunoService = alunoService;
    this.pagamentoService = pagamentoService;
  }

  @PostMapping("/api/acesso/{alunoId}/desbloquear")
  public ResponseEntity<DesbloqueioResponse> desbloquear(
      @PathVariable Long alunoId,
      @Valid @RequestBody DesbloqueioRequest request) {
    return ResponseEntity.ok(acessoService.desbloquear(alunoId, request));
  }

  @PostMapping("/api/pagamentos")
  public ResponseEntity<PagamentoResponse> createPagamento(@Valid @RequestBody PagamentoRequest request) {
    return ResponseEntity.ok(pagamentoService.create(request));
  }

  @GetMapping("/api/pagamentos")
  public ResponseEntity<List<PagamentoResponse>> listPagamentos() {
    return ResponseEntity.ok(pagamentoService.list());
  }

  @PutMapping("/api/pagamentos/{pagamentoId}")
  public ResponseEntity<PagamentoResponse> updatePagamento(
      @PathVariable Long pagamentoId,
      @Valid @RequestBody PagamentoRequest request) {
    return pagamentoService.updateStatus(pagamentoId, request)
        .map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.notFound().build());
  }

  @DeleteMapping("/api/pagamentos/{pagamentoId}")
  public ResponseEntity<Void> deletePagamento(@PathVariable Long pagamentoId) {
    return pagamentoService.softDelete(pagamentoId)
        ? ResponseEntity.noContent().build()
        : ResponseEntity.notFound().build();
  }

  @DeleteMapping("/api/financeiro/alunos/{alunoId}/permanente")
  public ResponseEntity<Void> deleteAlunoPermanente(@PathVariable Long alunoId) {
    return alunoService.hardDelete(alunoId)
        ? ResponseEntity.noContent().build()
        : ResponseEntity.notFound().build();
  }
}
