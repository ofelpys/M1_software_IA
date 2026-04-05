package com.forcatotal.m1.api.controller;

import com.forcatotal.m1.api.dto.AvaliacaoRequest;
import com.forcatotal.m1.api.dto.AvaliacaoResponse;
import com.forcatotal.m1.api.service.AvaliacaoService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class M04Controller {

  private final AvaliacaoService avaliacaoService;

  public M04Controller(AvaliacaoService avaliacaoService) {
    this.avaliacaoService = avaliacaoService;
  }

  @PostMapping("/api/avaliacoes")
  public ResponseEntity<AvaliacaoResponse> create(@Valid @RequestBody AvaliacaoRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(avaliacaoService.create(request));
  }

  @GetMapping("/api/avaliacoes")
  public ResponseEntity<List<AvaliacaoResponse>> list() {
    return ResponseEntity.ok(avaliacaoService.list());
  }
}
