# PLAN-005 — Professores (Implementação Técnica)

> **Versão**: 1.0  
> **Data**: 3 de abril de 2026  
> **Baseado em**: SPEC-005-professores.md  
> **RFs Cobertas**: RF-PROF-01 a 08 (8 RFs)  
> **Rastreabilidade Explícita**: RF-PROF-01, RF-PROF-02, RF-PROF-03, RF-PROF-04, RF-PROF-05, RF-PROF-06, RF-PROF-07, RF-PROF-08, RF-CAD-02, RF-FIN-03, RF-REL-04  
> **Tempo Estimado**: 6 horas

---

## 1. Tabelas Principais

```sql
TABLE professor_academia {
  professor_academia_id BIGSERIAL PRIMARY KEY
  usuario_id BIGINT NOT NULL REFERENCES usuario(usuario_id)
  academia_id SMALLINT NOT NULL REFERENCES academia(academia_id)
  
  especialidades TEXT[] -- Array: ['Musculação', 'Pilates', 'Yoga']
  bio TEXT
  telefone_contato VARCHAR(20)
  
  salario_base NUMERIC(10,2)
  comissao_percentual NUMERIC(5,2) DEFAULT 15.00
  
  status ENUM('ATIVO', 'INATIVO', 'AFASTADO') DEFAULT 'ATIVO'
  data_admissao DATE
  data_rescisao DATE
  
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  UNIQUE(usuario_id, academia_id)
}

TABLE horario_professor {
  horario_id BIGSERIAL PRIMARY KEY
  professor_id BIGINT NOT NULL REFERENCES professor_academia(professor_academia_id)
  
  horas_segunda INT[]    -- [[09,10], [14,15], ...] formato 24h
  horas_terca INT[]
  horas_quarta INT[]
  horas_quinta INT[]
  horas_sexta INT[]
  horas_sabado INT[]
  horas_domingo INT[] -- NULL se não trabalha
  
  atualizad_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
}

TABLE performance_professor {
  performance_id BIGSERIAL PRIMARY KEY
  professor_id BIGINT NOT NULL REFERENCES professor_academia(professor_academia_id)
  academia_id SMALLINT NOT NULL REFERENCES academia(academia_id)
  
  periodo_mes DATE NOT NULL
  
  total_alunos SMALLINT
  taxa_retencao NUMERIC(5,2) -- % de alunos que renovam
  satisfacao_media NUMERIC(3,2) -- 0-5.0
  aulas_lecionadas SMALLINT
  falta_taxa NUMERIC(5,2) -- % de faltas
  
  pontuacao_geral NUMERIC(5,2) -- 0-100
  categoria ENUM('EXCELENTE', 'BOM', 'ADEQUADO', 'PRECISA_MELHORIA')
  
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  UNIQUE(professor_id, academia_id, periodo_mes)
}

TABLE aula_professor {
  aula_id BIGSERIAL PRIMARY KEY
  professor_id BIGINT NOT NULL REFERENCES professor_academia(professor_academia_id)
  academia_id SMALLINT NOT NULL REFERENCES academia(academia_id)
  
  tipo_aula VARCHAR(50) -- 'Musculação', 'Yoga', 'HIIT', etc
  data_hora TIMESTAMP NOT NULL
  duracao_minutos SMALLINT DEFAULT 60
  sala_numero SMALLINT
  capacidade_maxima SMALLINT
  
  status ENUM('AGENDADA', 'REALIZADA', 'CANCELADA') DEFAULT 'AGENDADA'
  presencas SMALLINT -- Quantos alunos compareceram
  cancelamento_motivo VARCHAR(255)
  
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
}

TABLE inscricao_aula {
  inscricao_id BIGSERIAL PRIMARY KEY
  aula_id BIGINT NOT NULL REFERENCES aula_professor(aula_id)
  aluno_id BIGINT NOT NULL REFERENCES aluno(aluno_id)
  
  data_inscricao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  compareceu BOOLEAN
  nota_satisfacao NUMERIC(1,0) -- 1-5
  feedback TEXT
  
  UNIQUE(aula_id, aluno_id)
}
```

---

## 2. API REST (14 Endpoints)

```
GET    /api/professores (Listar)
GET    /api/professores/{id} (Detalhes)
POST   /api/professores/{id}/horarios (Atualizar horários)

GET    /api/professores/{id}/performance (Relatório performance)
GET    /api/professores/{id}/comissao (Comissão)

POST   /api/aulas (Agendar aula)
GET    /api/aulas?academia=1&mes=04 (Listar aulas)
PUT    /api/aulas/{id} (Editar aula)
DELETE /api/aulas/{id} (Cancelar aula)

POST   /api/aulas/{id}/inscricao (Aluno se inscreve)
POST   /api/aulas/{id}/presenca (Marcar presença)
GET    /api/aulas/{id}/presencas (Listas presentes)

GET    /api/professores/ranking (Top performers)
```

---

## 3. React Components

```jsx
// ProfessorPage.jsx, HorariosForm, PerformanceGrafico, AulasAgendaForm
```

---

## 4. Triggers/Functions

```sql
-- Calcular performance automaticamente
-- Atualizar comissão baseado em performance
-- Notificar professor sobre aula próxima
```

---

**Tempo Estimado**: 6 horas
