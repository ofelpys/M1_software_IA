package com.forcatotal.m1.api.controller;

import com.forcatotal.m1.api.dto.ProfessorRequest;
import com.forcatotal.m1.api.dto.ProfessorResponse;
import com.forcatotal.m1.api.service.ProfessorService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class M05Controller {

  private final ProfessorService professorService;

  public M05Controller(ProfessorService professorService) {
    this.professorService = professorService;
  }

  @PostMapping("/api/professores")
  public ResponseEntity<ProfessorResponse> create(@Valid @RequestBody ProfessorRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(professorService.create(request));
  }

  @GetMapping("/api/professores")
  public ResponseEntity<List<ProfessorResponse>> list() {
    return ResponseEntity.ok(professorService.list());
  }
}
