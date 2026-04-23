ALTER TABLE aluno
ADD COLUMN IF NOT EXISTS status VARCHAR(30) NOT NULL DEFAULT 'Ativo';

UPDATE aluno
SET status = CASE
  WHEN ativo = FALSE THEN 'Bloqueado'
  ELSE 'Ativo'
END
WHERE status IS NULL OR TRIM(status) = '';