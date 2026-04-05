CREATE TABLE IF NOT EXISTS registro_acesso (
  registro_acesso_id BIGSERIAL PRIMARY KEY,
  aluno_id BIGINT,
  cpf CHAR(14) NOT NULL,
  status_informado VARCHAR(30) NOT NULL,
  acesso_liberado BOOLEAN NOT NULL,
  mensagem VARCHAR(255) NOT NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
