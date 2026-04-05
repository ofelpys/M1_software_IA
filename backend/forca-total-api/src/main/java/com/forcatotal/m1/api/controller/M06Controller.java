package com.forcatotal.m1.api.controller;

import com.forcatotal.m1.api.dto.EquipamentoRequest;
import com.forcatotal.m1.api.dto.EquipamentoResponse;
import com.forcatotal.m1.api.service.EquipamentoService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class M06Controller {

  private final EquipamentoService equipamentoService;

  public M06Controller(EquipamentoService equipamentoService) {
    this.equipamentoService = equipamentoService;
  }

  @PostMapping("/api/equipamentos")
  public ResponseEntity<EquipamentoResponse> create(@Valid @RequestBody EquipamentoRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(equipamentoService.create(request));
  }

  @GetMapping("/api/equipamentos")
  public ResponseEntity<List<EquipamentoResponse>> list() {
    return ResponseEntity.ok(equipamentoService.list());
  }
}
