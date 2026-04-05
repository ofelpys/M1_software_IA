# Concepcao do Produto — MVP v1 (M1 Forca Total)

> Versao: 1.1  
> Data: 5 de abril de 2026  
> Status: ativo para orientacao de implementacao  
> Escopo: ciclo MVP operacional (nao-enterprise)

---

## 1. Visao de Produto

O M1 e um sistema para operacao integrada de uma rede de academias com foco em:
- reduzir retrabalho operacional na recepcao e no financeiro;
- centralizar visao minima de negocio para o proprietario;
- padronizar os fluxos criticos entre unidades.

Nesta fase, o objetivo e entregar um MVP funcional e verificavel em campo, com baixa complexidade operacional e alta rastreabilidade entre requisito, especificacao e implementacao.

---

## 2. Problemas Prioritarios a Resolver

1. Cadastro disperso e inconsistente de alunos.
2. Check-in sem regra unica de bloqueio/desbloqueio.
3. Operacao financeira basica sem padrao de fluxo.
4. Comunicacao operacional sem trilha minima de status.
5. Falta de painel consolidado minimo para decisao diaria.

---

## 3. Objetivos do MVP

1. Garantir fluxo operacional minimo de ponta a ponta: cadastro -> acesso -> financeiro -> comunicacao.
2. Disponibilizar endpoints canonicos para os modulos criticos e uso pelo frontend.
3. Entregar telas operacionais essenciais com fallback controlado para simulacao.
4. Implantar base de testes de integracao para fluxo critico e gate em CI.
5. Criar base de evolucao para modulos complementares sem inflar escopo atual.

---

## 4. Escopo MVP (In / Out)

### 4.1 Em escopo (MVP)

- M01: cadastro de aluno + operacoes basicas de acesso (check-in e desbloqueio manual).
- M02: operacao financeira minima (CRUD de pagamentos e integracao com desbloqueio).
- M08: disparo de comunicacao e preferencias por usuario.
- KPI consolidado minimo para acompanhamento.
- Backend Spring Boot + Flyway com modelo de dados minimo por modulo.
- Frontend React com fluxo critico integrado e politica de fallback definida.
- Testes de integracao (mock e real local) no pipeline.

### 4.2 Fora de escopo (pos-MVP)

- hardening enterprise completo (HA multi-regiao, SSO corporativo, observabilidade corporativa plena);
- RBAC completo multi-tenant em profundidade;
- trilha de auditoria completa por entidade;
- orquestracao de releases com requisitos de compliance corporativo.

---

## 5. Jornadas Criticas do MVP

### Jornada A — Recepcao

1. Recepcionista cadastra aluno.
2. Recepcionista executa check-in.
3. Sistema responde com status operacional (permitido/bloqueado).
4. Em caso de bloqueio financeiro, registra-se desbloqueio manual conforme regra operacional.

### Jornada B — Financeiro

1. Operador cria/atualiza/remover pagamento.
2. Operador consulta lista de pagamentos.
3. Fluxo de desbloqueio fica operacional para continuidade de atendimento.

### Jornada C — Comunicacao

1. Operador dispara comunicacao.
2. Usuario consulta notificacoes.
3. Usuario atualiza preferencias basicas.

---

## 6. Definicao de Pronto do MVP (DoD)

O MVP e considerado pronto quando:
- fluxo critico integrado estiver validado no frontend e backend;
- testes de integracao do fluxo critico passarem em CI;
- endpoints canonicos priorizados estiverem operacionais;
- documentacao de operacao e escopo estiver consistente com o estado real;
- backlog pos-MVP estiver explicitado e separado do escopo atual.

---

## 7. Metricas de Sucesso do MVP

1. Fluxo critico executavel sem bloqueio tecnico em ambiente local/staging.
2. Taxa de sucesso de testes de integracao >= 95% no pipeline da branch principal.
3. Tempo de resposta operacional aceitavel para CRUD basico e check-in.
4. Zero divergencia grave entre PLAN/SPEC e implementacao dos modulos priorizados.

---

## 8. Roadmap de Evolucao

### Onda 1 (agora)

- consolidacao MVP operacional M01/M02/M08 + KPI minimo;
- validacao tecnica em CI e ambiente local real.

### Onda 2 (curto prazo)

- ampliar cobertura dos modulos M03-M07 no mesmo padrao de contrato e testes;
- aumentar cobertura de testes de integracao e cenarios de erro.

### Onda 3 (pos-MVP)

- iniciar requisitos de robustez enterprise por prioridade de negocio;
- aprofundar seguranca, observabilidade e governanca operacional.

---

## 9. Premissas e Riscos

Premissas:
- foco em entrega incremental com trade-off consciente de complexidade;
- validacao com stakeholders guiando priorizacao.

Riscos:
- inflacao de escopo por mistura de backlog enterprise no ciclo MVP;
- inconsistencias documentais entre fases se nao houver manutencao continua;
- dependencia de decisoes pendentes para certos modulos nao-prioritarios.

Mitigacao:
- manter distincao explicita entre MVP e pos-MVP em todos os artefatos;
- usar CI e testes de integracao como criterio tecnico minimo de continuidade;
- revisar periodicamente rastreabilidade RF -> SPEC -> PLAN -> codigo.

---

## 10. Referencias

- docs/requisitos/04-specs/
- docs/requisitos/05-plans/
- docs/requisitos/02-mapa/matriz-rastreabilidade.md
- docs/requisitos/02-mapa/matriz-alinhamento-rotas-fase4-5.md
- README.md

---

## 11. Direcionamento Atual (05/04/2026)

1. O foco imediato do projeto e consolidar a concepcao do MVP e manter o escopo da Onda 1 sob controle.
2. A validacao em staging real (smoke + fluxo critico) continua obrigatoria para go-live, mas depende de URL publicada.
3. Enquanto a URL de staging nao estiver disponivel, a evolucao de documentacao, contratos e implementacao canonica nao deve ficar bloqueada.
4. Todo ajuste de escopo deve preservar a separacao explicita entre entregas MVP e backlog pos-MVP.
