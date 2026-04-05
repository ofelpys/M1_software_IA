package com.forcatotal.m1.api;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Sql(
    executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD,
    statements = {
      "DROP TABLE IF EXISTS preferencia_notificacao",
      "DROP TABLE IF EXISTS notificacao",
      "DROP TABLE IF EXISTS comunicacao_disparo",
      "DROP TABLE IF EXISTS pagamento",
      "DROP TABLE IF EXISTS desbloqueio_acesso",
      "DROP TABLE IF EXISTS registro_acesso",
      "DROP TABLE IF EXISTS aluno",
      "CREATE TABLE aluno (aluno_id BIGSERIAL PRIMARY KEY, nome VARCHAR(150) NOT NULL, cpf CHAR(14) NOT NULL UNIQUE, email VARCHAR(255) NOT NULL, plano VARCHAR(60) NOT NULL, ativo BOOLEAN NOT NULL DEFAULT TRUE, criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)",
      "CREATE TABLE registro_acesso (registro_acesso_id BIGSERIAL PRIMARY KEY, aluno_id BIGINT, cpf CHAR(14) NOT NULL, status_informado VARCHAR(30) NOT NULL, acesso_liberado BOOLEAN NOT NULL, mensagem VARCHAR(255) NOT NULL, criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)",
      "CREATE TABLE desbloqueio_acesso (desbloqueio_id BIGSERIAL PRIMARY KEY, aluno_id BIGINT NOT NULL, aluno_nome VARCHAR(150) NOT NULL, dias_atraso INTEGER NOT NULL, criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)",
      "CREATE TABLE pagamento (pagamento_id BIGSERIAL PRIMARY KEY, aluno_nome VARCHAR(150) NOT NULL, valor NUMERIC(10, 2) NOT NULL, status VARCHAR(30) NOT NULL, ativo BOOLEAN NOT NULL DEFAULT TRUE, criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)",
      "CREATE TABLE comunicacao_disparo (disparo_id BIGSERIAL PRIMARY KEY, canal VARCHAR(30) NOT NULL, segmento VARCHAR(120) NOT NULL, mensagem TEXT NOT NULL, ok_solicitado BOOLEAN NOT NULL, ok_processado BOOLEAN NOT NULL, resposta VARCHAR(255) NOT NULL, criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)",
      "CREATE TABLE notificacao (notificacao_id BIGSERIAL PRIMARY KEY, canal VARCHAR(30) NOT NULL, segmento VARCHAR(120) NOT NULL, mensagem TEXT NOT NULL, status VARCHAR(30) NOT NULL, criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)",
      "CREATE TABLE preferencia_notificacao (usuario_id BIGINT PRIMARY KEY, email_habilitado BOOLEAN NOT NULL DEFAULT TRUE, sms_habilitado BOOLEAN NOT NULL DEFAULT TRUE, push_habilitado BOOLEAN NOT NULL DEFAULT TRUE, atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)"
    })
class P0IntegrationFlowTests {

  @Autowired
  private MockMvc mockMvc;

  @Test
  void shouldRunAlunoCrudAndCheckinFlow() throws Exception {
    String createAluno = """
        {
          "nome": "Maria Silva",
          "cpf": "123.456.789-10",
          "email": "maria@forcatotal.com",
          "plano": "OURO"
        }
        """;

    mockMvc.perform(post("/api/alunos")
        .contentType("application/json")
            .content(createAluno))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").isNumber())
        .andExpect(jsonPath("$.aluno.nome").value("Maria Silva"));

    mockMvc.perform(get("/api/alunos"))
        .andExpect(status().isOk())
      .andExpect(jsonPath("$[0].aluno.cpf").value("123.456.789-10"));

    String checkin = """
        {
          "cpf": "123.456.789-10",
          "status": "em_dia"
        }
        """;

    mockMvc.perform(post("/api/acesso/checkin")
          .contentType("application/json")
            .content(checkin))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.ok").value(true));

    mockMvc.perform(delete("/api/alunos/1"))
        .andExpect(status().isNoContent());

    mockMvc.perform(post("/api/acesso/checkin")
          .contentType("application/json")
            .content(checkin))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.ok").value(false));
  }

  @Test
  void shouldRunPagamentoCrudFlow() throws Exception {
    String createPagamento = """
        {
          "aluno": "Maria Silva",
          "valor": 199.90,
          "status": "PENDENTE"
        }
        """;

    mockMvc.perform(post("/api/pagamentos")
        .contentType("application/json")
            .content(createPagamento))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").isNumber())
        .andExpect(jsonPath("$.status").value("PENDENTE"));

    mockMvc.perform(get("/api/pagamentos"))
        .andExpect(status().isOk())
      .andExpect(jsonPath("$[0].aluno").value("Maria Silva"));

    String updatePagamento = """
        {
          "aluno": "Maria Silva",
          "valor": 199.90,
          "status": "APROVADO"
        }
        """;

    mockMvc.perform(put("/api/pagamentos/1")
          .contentType("application/json")
            .content(updatePagamento))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.status").value("APROVADO"));

    mockMvc.perform(delete("/api/pagamentos/1"))
        .andExpect(status().isNoContent());
  }

  @Test
  void shouldRunComunicacaoAndPreferenciasFlow() throws Exception {
    String disparo = """
        {
          "canal": "EMAIL",
          "segmento": "inadimplentes",
          "mensagem": "Regularize seu plano",
          "ok": false
        }
        """;

    mockMvc.perform(post("/api/comunicacoes/disparos")
          .contentType("application/json")
            .content(disparo))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.ok").value(false));

    mockMvc.perform(get("/api/notificacoes"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].status").value("RETRY"));

    String preferencias = """
        {
          "emailHabilitado": true,
          "smsHabilitado": false,
          "pushHabilitado": true
        }
        """;

    mockMvc.perform(post("/api/usuarios/7/preferencias")
          .contentType("application/json")
            .content(preferencias))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.usuarioId").value(7))
        .andExpect(jsonPath("$.smsHabilitado").value(false));

    mockMvc.perform(get("/api/usuarios/7/preferencias"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.usuarioId").value(7))
        .andExpect(jsonPath("$.emailHabilitado").value(true));
  }

  @Test
  void shouldReturnStandardErrorPayloadOnValidationFailure() throws Exception {
    String invalidAluno = """
        {
          "nome": "Jo",
          "cpf": "123",
          "email": "email-invalido",
          "plano": ""
        }
        """;

    mockMvc.perform(post("/api/alunos")
          .contentType("application/json")
            .content(invalidAluno))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.status").value(400))
        .andExpect(jsonPath("$.error").value("Bad Request"))
        .andExpect(jsonPath("$.path").value("/api/alunos"))
        .andExpect(jsonPath("$.message").exists())
        .andExpect(jsonPath("$.timestamp").exists());
  }
}
