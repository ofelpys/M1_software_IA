# PLAN-006 — Equipamento & Salas (Implementação Técnica)

> **Versão**: 1.0  
> **Data**: 3 de abril de 2026  
> **Baseado em**: SPEC-006-equipamento-salas.md  
> **RFs Cobertas**: RF-EQUIP-01 a 08 (8 RFs)  
> **Rastreabilidade Explícita**: RF-EQUIP-01, RF-EQUIP-02, RF-EQUIP-03, RF-EQUIP-04, RF-EQUIP-05, RF-EQUIP-06, RF-EQUIP-07, RF-EQUIP-08, RF-PROF-04  
> **Tempo Estimado**: 6 horas

---

## 1. Tabelas Principais

```sql
TABLE sala {
  sala_id BIGSERIAL PRIMARY KEY
  academia_id SMALLINT NOT NULL REFERENCES academia(academia_id)
  numero_sala VARCHAR(20) -- A1, Piso2-Sala3
  nome_sala VARCHAR(100) -- 'Sala de Musculação', 'Estúdio de Yoga'
  
  capacidade_maxima SMALLINT DEFAULT 30
  tipo_sala ENUM('MUSCULAÇÃO', 'YOGA', 'CROSSFIT', 'CARDIO', 'MULTIDISCIPLINAR')
  
  equipamentos JSON -- Array de IDs de equipamentos
  ativo BOOLEAN DEFAULT TRUE
  
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
}

TABLE equipamento {
  equipamento_id BIGSERIAL PRIMARY KEY
  academia_id SMALLINT NOT NULL REFERENCES academia(academia_id)
  sala_id BIGINT REFERENCES sala(sala_id)
  
  nome VARCHAR(150) NOT NULL
  modelo VARCHAR(100)
  numero_serie VARCHAR(100) UNIQUE
  tipo ENUM('MUSCULAÇÃO', 'CARDIO', 'YOGA', 'PILATES', 'OUTRO')
  
  data_aquisicao DATE
  data_ultima_manutencao DATE
  proxima_manutencao DATE
  valor_aquisicao NUMERIC(10,2)
  
  status ENUM('ATIVO', 'MANUTENÇÃO', 'DANIFICADO', 'OBSOLETO') DEFAULT 'ATIVO'
  localizacao VARCHAR(200)
  
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
}

TABLE manutencao_equipamento {
  manutencao_id BIGSERIAL PRIMARY KEY
  equipamento_id BIGINT NOT NULL REFERENCES equipamento(equipamento_id)
  
  tipo_manutencao ENUM('PREVENTIVA', 'CORRETIVA', 'EMERGENCIAL')
  data_inicio DATE NOT NULL
  data_conclusao DATE
  
  descricao TEXT
  custo NUMERIC(10,2)
  responsavel VARCHAR(150)
  observacoes TEXT
  
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
}

TABLE agenda_sala {
  agenda_id BIGSERIAL PRIMARY KEY
  sala_id BIGINT NOT NULL REFERENCES sala(sala_id)
  professor_id BIGINT REFERENCES professor_academia(professor_academia_id)
  
  data_hora_inicio TIMESTAMP NOT NULL
  data_hora_fim TIMESTAMP NOT NULL
  
  tipo_atividade VARCHAR(50)
  capacidade_reservada SMALLINT
  
  status ENUM('AGENDADA', 'CANCELADA', 'REALIZADA') DEFAULT 'AGENDADA'
  
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  EXCLUDE USING gist (sala_id WITH =, data_hora_inicio WITH &&, data_hora_fim WITH &&)
     -- Previne conflito de horários
}
```

---

## 2. API REST (12 Endpoints)

```
GET    /api/salas (Listar)
POST   /api/salas (Criar)
GET    /api/salas/{id}/agenda-dia?data=YYYY-MM-DD (Agenda do dia)
GET    /api/salas/{id}/disponibilidade (Horários livres)

GET    /api/equipamentos (Inventário)
POST   /api/equipamentos (Adicionar)
PUT    /api/equipamentos/{id} (Atualizar status)
GET    /api/equipamentos/{id}/manutencoes (Histórico)

POST   /api/manutencoes (Registrar manutenção)
PUT    /api/manutencoes/{id} (Atualizar)
GET    /api/manutencoes/proximas (Próximas manutenções)

POST   /api/agenda-sala (Agendar sala)
```

---

## 3. React Components

```jsx
// SalasInventario.jsx, EditEquipamento.jsx, AgendaSalaCalendario.jsx
```

---

**Tempo Estimado**: 6 horas
