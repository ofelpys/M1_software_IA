package com.forcatotal.m1.api;

import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("local")
class FlywayMigrationSmokeTests {

  @Autowired
  private JdbcTemplate jdbcTemplate;

  @Test
  void shouldApplyFlywayMigrationsOnStartup() {
    Integer appliedMigrations = jdbcTemplate.queryForObject(
        "SELECT COUNT(1) FROM \"flyway_schema_history\" WHERE \"success\" = TRUE",
        Integer.class);

    assertTrue(appliedMigrations != null && appliedMigrations > 0,
        "Esperado ao menos uma migration Flyway aplicada");
  }
}