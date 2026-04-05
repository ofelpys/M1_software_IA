package com.forcatotal.m1.api.controller;

import com.forcatotal.m1.api.dto.AlunoCreateRequest;
import com.forcatotal.m1.api.dto.AlunoCreateResponse;
import com.forcatotal.m1.api.dto.CheckinRequest;
import com.forcatotal.m1.api.dto.CheckinResponse;
import com.forcatotal.m1.api.service.AcessoService;
import com.forcatotal.m1.api.service.AlunoService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class M01Controller {

  private final AlunoService alunoService;
  private final AcessoService acessoService;

  public M01Controller(AlunoService alunoService, AcessoService acessoService) {
    this.alunoService = alunoService;
    this.acessoService = acessoService;
  }

  @PostMapping("/api/alunos")
  public ResponseEntity<AlunoCreateResponse> createAluno(@Valid @RequestBody AlunoCreateRequest request) {
    AlunoCreateResponse response = alunoService.create(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @GetMapping("/api/alunos")
  public ResponseEntity<List<AlunoCreateResponse>> listAlunos() {
    return ResponseEntity.ok(alunoService.findAll());
  }

  @GetMapping("/api/alunos/{alunoId}")
  public ResponseEntity<AlunoCreateResponse> getAluno(@PathVariable Long alunoId) {
    return alunoService.findById(alunoId)
        .map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.notFound().build());
  }

  @PutMapping("/api/alunos/{alunoId}")
  public ResponseEntity<AlunoCreateResponse> updateAluno(
      @PathVariable Long alunoId,
      @Valid @RequestBody AlunoCreateRequest request) {
    return alunoService.update(alunoId, request)
        .map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.notFound().build());
  }

  @DeleteMapping("/api/alunos/{alunoId}")
  public ResponseEntity<Void> deleteAluno(@PathVariable Long alunoId) {
    boolean deleted = alunoService.softDelete(alunoId);
    return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
  }

  @PostMapping("/api/acesso/checkin")
  public ResponseEntity<CheckinResponse> checkin(@Valid @RequestBody CheckinRequest request) {
    CheckinResponse response = acessoService.checkin(request);
    return ResponseEntity.ok(response);
  }
}
