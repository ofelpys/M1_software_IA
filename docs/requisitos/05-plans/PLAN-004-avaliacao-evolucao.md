# PLAN-004 — Avaliação & Evolução (Implementação Técnica)

> **Versão**: 1.0  
> **Data**: 3 de abril de 2026  
> **Baseado em**: SPEC-004-avaliacao-evolucao.md  
> **RFs Cobertas**: RF-AVAL-01 a 08 (8 RFs)  
> **Tempo Estimado**: 6 horas

---

## 1. Tabelas Principais

```sql
TABLE teste_fisico {
  teste_id BIGSERIAL PRIMARY KEY
  nome ENUM('FORÇA', 'RESISTÊNCIA', 'FLEXIBILIDADE', 'VELOCIDADE', 'PESO', 'IMC')
  descricao TEXT
  unidade_medida VARCHAR(20) ('kg', 'm', 'cm', 'segundos', '%')
  valor_ideal NUMERIC(10,2) -- Meta/referência
  ativo BOOLEAN DEFAULT TRUE
}

TABLE resultado_teste {
  resultado_id BIGSERIAL PRIMARY KEY
  aluno_id BIGINT NOT NULL REFERENCES aluno(aluno_id)
  teste_id BIGINT NOT NULL REFERENCES teste_fisico(teste_id)
  academia_id SMALLINT NOT NULL REFERENCES academia(academia_id)
  
  data_teste DATE NOT NULL
  valor_medido NUMERIC(10,2) NOT NULL
  valor_anterior NUMERIC(10,2) -- Para comparação
  evolucao_percentual NUMERIC(5,2) -- Calculado: ((novo - antigo) / antigo) * 100
  status_resultado ENUM('ABAIXO_META', 'PROXIMO_META', 'ATINGIU_META', 'ACIMA_META')
  
  medido_por BIGINT NOT NULL REFERENCES usuario(usuario_id) -- Professor
  observacoes TEXT
  
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
}

TABLE meta_aluno {
  meta_id SMALLSERIAL PRIMARY KEY
  aluno_id BIGINT NOT NULL REFERENCES aluno(aluno_id)
  teste_id BIGINT NOT NULL REFERENCES teste_fisico(teste_id)
  
  valor_meta NUMERIC(10,2) NOT NULL -- Meta desejada
  data_inicio DATE DEFAULT CURRENT_DATE
  data_vencimento DATE NOT NULL -- Data limite para atingir
  
  status_meta ENUM('ABERTA', 'EM_PROGRESSO', 'ATINGIDA', 'EXPIRADA', 'CANCELADA') DEFAULT 'ABERTA'
  data_atingimento DATE
  
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  UNIQUE(aluno_id, teste_id)
}

TABLE evolucao_aluno {
  evolucao_id BIGSERIAL PRIMARY KEY
  aluno_id BIGINT NOT NULL REFERENCES aluno(aluno_id) ON DELETE CASCADE
  
  periodo_mes DATE NOT NULL -- 1º dia do mês
  
  pontuacao_geral NUMERIC(5,2) -- 0-100 (média de progresso)
  testes_realizados SMALLINT
  metas_atingidas SMALLINT
  metas_totais SMALLINT
  
  categoria_evolucao ENUM('EXCELENTE', 'BOA', 'ESTÁVEL', 'NECESSITA_MELHORIAS')
  
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  UNIQUE(aluno_id, periodo_mes)
}

TABLE certificado_aluno {
  certificado_id BIGSERIAL PRIMARY KEY
  aluno_id BIGINT NOT NULL REFERENCES aluno(aluno_id)
  meta_id SMALLINT NOT NULL REFERENCES meta_aluno(meta_id)
  
  tipo_certificado ENUM('META_ATINGIDA', 'EVOLUCAO_EXCELENTE', 'PARTICIPACAO')
  data_emissao DATE DEFAULT CURRENT_DATE
  numero_certificado VARCHAR(50) UNIQUE -- Formato: CERT-ANNO-SEQUENCIAL
  
  arquivo_path VARCHAR(500)  -- Armazenar PDF gerado
  impresso BOOLEAN DEFAULT FALSE
  data_impressao DATE
  
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
}
```

---

## 2. API REST (12 Endpoints)

```
POST   /api/testes-fisicos (Criar teste - Admin)
GET    /api/testes-fisicos (Listar disponíveis)

POST   /api/alunos/{aluno_id}/resultados (Registrar resultado)
GET    /api/alunos/{aluno_id}/resultados (Histórico)
GET    /api/alunos/{aluno_id}/evolucao (Gráfico evolução)

POST   /api/alunos/{aluno_id}/metas (Criar meta)
GET    /api/alunos/{aluno_id}/metas (Metas ativas)
PUT    /api/metas/{meta_id} (Atualizar meta)

GET    /api/alunos/{aluno_id}/certificados (Listar certificados)
POST   /api/certificados/{id}/gerar-pdf (Gerar PDF)
GET    /api/certificados/{id}/download (Download)

GET    /api/alunos/{aluno_id}/dashboard-evolucao (Visão geral)
```

---

## 3. React Components

```jsx
// ResultadoTesteForm.jsx
<Form>
  <Select label="Tipo de Teste" options={['Força', 'Resistência', ...]} />
  <TextField label="Valor Medido" type="number" />
  <TextField label="Observações" multiline />
  <Button onClick={submit}>Registrar Resultado</Button>
</Form>

// GraficoEvolucao.jsx
<LineChart
  data={evolucaoAluno}
  x="data"
  y="valor"
  series={['Força', 'Resistência', 'Flexibilidade']}
/>

// MetasAluno.jsx
<Table
  data={metas}
  columns={['teste', 'meta', 'progresso%', 'dataVencimento', 'status']}
/>

// CertificadosAluno.jsx
<Grid>
  {certificados.map(cert => (
    <Card title={cert.tipo}>
      <Button onClick={() => downloadPDF(cert.id)}>Baixar PDF</Button>
    </Card>
  ))}
</Grid>
```

---

## 4. Business Rules

```
- Resultado automaticamente classificado vs meta
- Certificado emitido quando meta atingida
- Evolução recalculada mensalmente
- PDF gerado automaticamente (jsPDF)
```

---

**Tempo Estimado**: 6 horas
