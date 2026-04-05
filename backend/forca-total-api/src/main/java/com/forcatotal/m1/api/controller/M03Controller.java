package com.forcatotal.m1.api.controller;

import com.forcatotal.m1.api.dto.RelatorioKpiResponse;
import com.forcatotal.m1.api.service.RelatorioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class M03Controller {

  private final RelatorioService relatorioService;

  public M03Controller(RelatorioService relatorioService) {
    this.relatorioService = relatorioService;
  }

  @GetMapping("/api/relatorios/kpis")
  public ResponseEntity<RelatorioKpiResponse> getKpis() {
    return ResponseEntity.ok(relatorioService.getKpis());
  }
}
