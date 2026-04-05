package com.forcatotal.m1.api.controller;

import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

  @GetMapping("/")
  public ResponseEntity<Map<String, Object>> home() {
    return ResponseEntity.ok(Map.of(
        "service", "forca-total-api",
        "status", "UP",
        "health", "/actuator/health"));
  }
}
