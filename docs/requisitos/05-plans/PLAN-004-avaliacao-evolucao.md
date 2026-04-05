# PLAN-004 — Avaliação & Evolução (Implementação Técnica)

> Versão: 1.1  
> Data: 5 de abril de 2026  
> Baseado em: SPEC-004-avaliacao-evolucao.md  
> RFs Cobertas: RF-AVAL-01 a 08  
> Situação do documento: alinhado ao estado real do projeto (MVP operacional)

---

> Nota de escopo MVP: este PLAN descreve implementacao tecnica orientada ao MVP operacional. Itens tipicos de plataforma enterprise entram como backlog de evolucao.

## 1. Diagnóstico Real (Abr/2026)

- Backend implementado: criação e listagem de avaliações.
- Frontend implementado: tela de avaliação integrada ao gateway.
- Banco implementado para este módulo: `avaliacao_evolucao` (modelo simplificado).
- Não implementado ainda: metas estruturadas, certificados e trilha evolutiva completa por teste.

---

## 2. Escopo de Dados Ajustado

### 2.1 Tabela real já existente

- `avaliacao_evolucao`

### 2.2 Tabelas alvo sob demanda funcional

- `teste_fisico`
- `resultado_teste`
- `meta_aluno`
- `certificado_aluno`

Observação: neste estágio, uma tabela simplificada atende ao fluxo operacional; expansão deve seguir necessidades validadas em produção.

---

## 3. API Real vs Alvo

### 3.1 Endpoints implementados

- `POST /api/avaliacoes`
- `GET /api/avaliacoes`

### 3.2 Endpoints pendentes

- histórico detalhado por aluno/teste
- metas por aluno
- emissão e download de certificado

---

## 4. Backlog Priorizado

1. P0: padronizar campos de evolução e status da avaliação.
2. P1: incluir histórico temporal por aluno.
3. P1: incluir metas e acompanhamento de atingimento.
4. P2: geração de certificado e relatórios comparativos.

---

## 5. Critérios de Aceite Atualizados

- Implementado (MVP): registrar e consultar avaliações.
- Parcial: análise evolutiva consolidada.
- Pendente: metas, certificados e trilhas avançadas.

---

## 6. Status

Status real: funcional para avaliação básica, sem cobertura completa do escopo avançado.
