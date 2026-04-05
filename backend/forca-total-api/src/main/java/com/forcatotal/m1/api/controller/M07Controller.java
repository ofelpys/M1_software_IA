package com.forcatotal.m1.api.controller;

import com.forcatotal.m1.api.dto.InsumoRequest;
import com.forcatotal.m1.api.dto.InsumoResponse;
import com.forcatotal.m1.api.service.InsumoService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class M07Controller {

  private final InsumoService insumoService;

  public M07Controller(InsumoService insumoService) {
    this.insumoService = insumoService;
  }

  @PostMapping("/api/insumos")
  public ResponseEntity<InsumoResponse> create(@Valid @RequestBody InsumoRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(insumoService.create(request));
  }

  @GetMapping("/api/insumos")
  public ResponseEntity<List<InsumoResponse>> list() {
    return ResponseEntity.ok(insumoService.list());
  }
}
