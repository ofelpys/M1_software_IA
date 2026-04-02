# Requisitos Não-Funcionais Detalhados + Restrições Técnicas

> **Versão**: 1.0  
> **Data**: 2 de abril de 2026  
> **Propósito**: Expandir RNF/ROP com critérios de aceitação, métricas e stack técnica  
> **Base**: 14 RNFs + 9 ROPs do documento original  
> **Público**: Arquitetos, Tech Leads, QA

---

## 1. Requisitos Não-Funcionais Detalhados (RNF)

### 🟥 RNF-01 — Interface Simples e Intuitiva

| Atributo | Descrição |
|---|---|
| **Descrição Expandida** | A interface deve ser simples, com poucos passos por operação, linguagem clara e botões facilmente identificáveis. Não deve exigir documentação para operações comuns. |
| **Critério de Aceitação** | ✅ Operações críticas (check-in, consulta aluno, registrar pagamento) devem ser completadas em ≤ 3 cliques. ✅ Mensagens de erro em português claro. ✅ Sem jargão técnico (ex: "Aluno não encontrado" em vez de "404 Not Found"). ✅ Botões com labels descritivos (ex: "Permitir Acesso" em vez de "OK"). |
| **Métrica de Validação** | Teste de usabilidade com 5 recepcionistas com pouca familiaridade técnica: ≥ 80% completam tarefas sem ajuda. |
| **Componentes Impactados** | Frontend (React): Design System, componentes, validações locais |
| **Prioridade** | 🔴 CRÍTICA |
| **Risk se Violado** | Recepcionistas gastam 30 min/dia em dúvidas → perda de produtividade, frustração. |
| **Stack Técnico** | React UI Library: Material-UI ou Ant Design (componentes prontos, acessibilidade). |

---

### 🟥 RNF-02 — Acessibilidade para Usuários com Baixa Familiaridade Técnica

| Atributo | Descrição |
|---|---|
| **Descrição Expandida** | O sistema deve ser utilizável por pessoas com pouca familiaridade com computador, sem treinamento extenso. |
| **Critério de Aceitação** | ✅ Teclado + mouse (sem atalhos complexos). ✅ Sem autocomplete/código complexo. ✅ Campos com placeholder descritivo. ✅ Validações com aviso antes de destruir dados (ex: "Tem certeza que quer cancelar matrícula?"). ✅ Suporte a fonte grande (escalável até 200%). |
| **Métrica de Validação** | Teste de 5 usuários sem experiência desktop: ≥ 90% não precisam de ajuda. |
| **Componentes Impactados** | Frontend (React): Componentes acessíveis, validações. Documentação Operacional. |
| **Prioridade** | 🔴 CRÍTICA |
| **Risk se Violado** | Atendimento inferior, taxa de erro alta (ex: deletar cadastro por acidente). |
| **Stack Técnico** | WCAG 2.1 AA compliance. Keyboard navigation. |

---

### 🟥 RNF-03 — Autenticação e Perfis de Acesso

| Atributo | Descrição |
|---|---|
| **Descrição Expandida** | O sistema deve possuir autenticação por usuário e senha com perfis de acesso por função (proprietário, coordenador, professor, atendente). Cada rol ve apenas seus dados. |
| **Critério de Aceitação** | ✅ Login com email ou CPF + senha. ✅ 4 perfis: PROPRIETARIO (visão rede), COORDENADOR (visão unidade), PROFESSOR (dados pessoais + alunos), RECEPCIONISTA (check-in, consulta básica). ✅ Logout automático após 30 min de inatividade. ✅ Dashboard diferente por perfil. ✅ Coordenador não vê dados de outra unidade. |
| **Métrica de Validação** | Teste: Coordenador unidade A tenta acessar dados unidade B → ❌ Negado. Professor tenta ver comissão de outro professor → ❌ Negado. |
| **Componentes Impactados** | Backend (Spring Security), Frontend (React Routes), BD (USUARIO, USUARIO_ACADEMIA, PROFESSOR_PERMISSAO). |
| **Prioridade** | 🔴 CRÍTICA |
| **Risk se Violado** | Vazamento de dados, fraude (coordenador altera comissão de outro). |
| **Stack Técnico** | Spring Security + JWT Token (5 min validade) + Refresh Token (7 dias). Bcrypt para senha (cost=10). |
| **Validações** | Senha: min 8 chars, 1 maiúscula, 1 número, 1 especial. Tentativas falhas: bloqueio após 5 tentativas (15 min). |

---

### 🟥 RNF-04 — Auditoria Completa (Rastreabilidade)

| Atributo | Descrição |
|---|---|
| **Descrição Expandida** | Todas as operações críticas devem ser registradas para auditoria: data, hora, usuário, ação, entidade modificada. Histórico imutável. |
| **Critério de Aceitação** | ✅ Todo CREATE/UPDATE/DELETE registrado em `AUDITORIA_LOG`. ✅ Valores antes/depois para UPDATE (JSON). ✅ IP e user agent do navegador. ✅ Não permitir deletar auditoria. ✅ Relatório: "Quem alterou comissão de professor X em Y data?" em ≤ 5s. |
| **Métrica de Validação** | Query de auditoria retorna: [timestamp, usuario, acao, tabela, valores_antes, valores_depois, ip]. |
| **Componentes Impactados** | Backend (Interceptors/AOP em Spring), BD (AUDITORIA_LOG com índices). |
| **Prioridade** | 🔴 CRÍTICA |
| **Risk se Violado** | Impossível investigar fraudes, não conformidade com regulação. |
| **Stack Técnico** | Spring AOP + @Aspect para logging automático. Trigger em BD para operações diretas SQL. |
| **Retenção de Dados** | Mínimo 3 anos (configurável). |

---

### 🟡 RNF-05 — Persistência de Dados Confiável

| Atributo | Descrição |
|---|---|
| **Descrição Expandida** | O sistema deve persistir dados de forma confiável, com backup automático periódico. Sem perda de dados por crash/falha. |
| **Critério de Aceitação** | ✅ Transações ACID em todas operações. ✅ Backup automático 1x/dia (full) + a cada 6h (incremental). ✅ Backup armazenado em local diferente (cloud ou servidor backup). ✅ Teste de restore: backup restaurado com sucesso a cada backup. ✅ RTO (Recovery Time Objective): ≤ 4 horas. RPO (Recovery Point Objective): ≤ 6 horas. |
| **Métrica de Validação** | Simular falha de BD: pode restaurar último backup? Quantas operações perdidas? |
| **Componentes Impactados** | BD (PostgreSQL com WAL), Infraestrutura (backup scripts, storage). |
| **Prioridade** | 🔴 CRÍTICA |
| **Risk se Violado** | Perda de pagamentos, matrículas, histórico. Impossibilidade de operar. |
| **Stack Técnico** | PostgreSQL 14+ com Point-in-Time Recovery (PITR). S3/Google Cloud Storage para backup. pgBackRest ou Barman para gestão. |

---

### 🟥 RNF-06 — Performance: Tempo de Resposta < 2 segundos

| Atributo | Descrição |
|---|---|
| **Descrição Expandida** | O tempo de resposta das operações comuns (check-in, consulta de aluno) deve ser < 2 segundos (P95). |
| **Critério de Aceitação** | ✅ Check-in: < 1 segundo (99th percentile). ✅ Consulta aluno: < 500ms. ✅ Listar aulas de professor: < 1 segundo para 100 aulas. ✅ Dashboard KPI: < 2 segundos (computado a cada 5 min, cachê). ✅ Search aluno por CPF: < 300ms. |
| **Métrica de Validação** | Load test com 50 usuários simultâneos por 10 min: P95 latência < 2s. |
| **Componentes Impactados** | Backend (queries otimizadas, caching), BD (índices, query plans), Frontend (lazy loading, paginação). |
| **Prioridade** | 🔴 CRÍTICA |
| **Risk se Violado** | Fila na recepção, atraso em operações, frustração de usuários. |
| **Stack Técnico** | Redis para cache (sessão, aluno status). PostgreSQL índices (B-tree, partial). Spring Boot Connection Pool. |
| **Otimizações BD** | - `INDEX (aluno_id, academia_id)` em MATRICULA - `INDEX (profesor_id, data_aula)` em AULA - Prepared Statements - Connection queuing |
| **Caching Strategy** | Cache 10 min: Aluno status, configurações. Cache 5 min: Totalizações (inadimplência, KPIs). |

---

### 🟡 RNF-07 — Escalabilidade Multi-Unidade

| Atributo | Descrição |
|---|---|
| **Descrição Expandida** | O sistema deve ser escalável para suportar múltiplas unidades sem perda de performance. |
| **Critério de Aceitação** | ✅ Suportar 5-10 academias simultâneas sem degradação. ✅ Suportar crescimento a 2.000→5.000 alunos. ✅ Suportar 50→500 aulas/mês sem queda de performance. ✅ Multi-tenant: dados separados por academia_id (sem cross-unidade leak). ✅ Relatórios consolidados processam em < 5s mesmo com 5 academias. |
| **Métrica de Validação** | Load test: 500 usuários (100 por akademia) simultâneos com 10k aulas registradas: P95 < 2s. |
| **Componentes Impactados** | BD (particionamento futuro, índices), Backend (query optimization, cache), Frontend (paginação). |
| **Prioridade** | 🟡 ALTA |
| **Risk se Violado** | Impossível expandir para 10+ academias. Slow queries ao crescer. |
| **Stack Técnico** | PostgreSQL com PARTITION por academia (futuro). Spring Data JPA com Specification pattern. Elasticsearch para search (futuro). |
| **Row-Level Security** | BD policy: `academia_id` em todas queries (DML e SELECT). |

---

### 🟥 RNF-08 — Mensagens de Erro Claras

| Atributo | Descrição |
|---|---|
| **Descrição Expandida** | O sistema deve apresentar mensagens de erro compreensíveis ao usuário. Sem error codes técnicos. |
| **Critério de Aceitação** | ✅ Erro: "CPF já cadastrado" (em vez de "CONSTRAINT VIOLATION"). ✅ Erro: "Aluno não encontrado" (em vez de "404"). ✅ Erro: "Validação falhou: Campo email inválido" (em vez de "VALIDATION_FAILED"). ✅ Mensagens em português. ✅ Ação sugerida: "Verifique o CPF digitado ou contate suporte". |
| **Métrica de Validação** | Teste: 10 usuários veem erros? Entendem o que fazer? ≥ 80% sim. |
| **Componentes Impactados** | Backend (Exception Handling), Frontend (Error Toast/Modal). |
| **Prioridade** | 🟡 ALTA |
| **Risk se Violado** | Usuários não sabem o que fazer, tickets de suporte aumentam. |
| **Stack Técnico** | Spring ControllerAdvice para centralizar exceções. Custom Exception classes com mensagens pré-definidas. |

---

### 🟥 RNF-09 — Arquitetura em Camadas

| Atributo | Descrição |
|---|---|
| **Descrição Expandida** | O sistema deve ser organizado em camadas coerentes (frontend, backend, banco de dados). Sem acoplamento. |
| **Critério de Aceitação** | ✅ Frontend: React (UI). ✅ Backend: Spring Boot (REST API). ✅ BD: PostgreSQL. ✅ Comunicação: HTTP/REST (não direto ao BD). ✅ Cada camada tem responsabilidade clara. ✅ Possível trocar BD sem afetar frontend. |
| **Métrica de Validação** | Code review: Nenhum import do BD direto no frontend. Nenhum SQL no frontend. |
| **Componentes Impactados** | Arquitetura geral. |
| **Prioridade** | 🔴 CRÍTICA |
| **Risk se Violado** | Impossível manutenção, retrabalho futuro, código spaghetti. |
| **Stack Técnico** | Frontend: React + Redux (state management). Backend: Spring Boot (Controller → Service → Repository). BD: PostgreSQL via JDBC. |

---

### 🟡 RNF-10 — Linguagem da Academia

| Atributo | Descrição |
|---|---|
| **Descrição Expandida** | Os nomes de telas, campos e relatórios devem refletir a linguagem cotidiana das academias. |
| **Critério de Aceitação** | ✅ Campo: "Academia" não "Site/Unit". ✅ Campo: "Aluno" não "Customer/Member". ✅ Campo: "Professores" não "Trainers/Instructors". ✅ Tela: "Check-in" não "Clock-In". ✅ Relatório: "Fluxo de Caixa" não "Revenue Stream". ✅ Glossário consultado em toda nomenclatura. |
| **Métrica de Validação** | Teste: 10 recepcionistas leem interface, entendem labels? ≥ 90% sim. |
| **Componentes Impactados** | Frontend (labels, help texts). Documentação. |
| **Prioridade** | 🟡 ALTA |
| **Risk se Violado** | Confusão de usuários, baixa adoção. |
| **Stack Técnico** | i18n (Internationalization) em React para fácil tradução/ajuste. |

---

### 🟡 RNF-11 — Manutenibilidade e Extensibilidade

| Atributo | Descrição |
|---|---|
| **Descrição Expandida** | O sistema deve ser facilmente mantível e expansível sem acoplamento excessivo entre módulos. |
| **Critério de Aceitação** | ✅ Módulos independentes (M01-M08). ✅ Adicionar novo módulo sem afetar existentes. ✅ DRY (Don't Repeat Yourself): código reutilizável. ✅ SOLID principles. ✅ Testes unitários ≥ 80% cobertura. ✅ Documentação técnica atualizada. |
| **Métrica de Validação** | Code review: Cyclomatic complexity < 5 por método. |
| **Componentes Impactados** | Backend (code structure), Frontend (component modularization). |
| **Prioridade** | 🟡 ALTA |
| **Risk se Violado** | Mudanças simples quebram tudo. Retrabalho alto. Difícil onboarding de novos devs. |
| **Stack Técnico** | Clean Code principles. Spring Design patterns. React Hooks. Jest/Mockito para testes. |

---

### 🟢 RNF-12 — Suporte a Internet Lenta/Instável (Futuro)

| Atributo | Descrição |
|---|---|
| **Descrição Expandida** | O sistema deve suportar operações críticas mesmo com internet lenta (futuro: modo offline parcial). |
| **Critério de Aceitação** | ✅ Operações críticas (check-in) funcionam com 3G (500ms latência). ✅ Mensagens de erro explicam atraso (não freeze). ✅ Futuro (v2): Sincronização offline para check-in. |
| **Métrica de Validação** | Teste com latência simulada 500ms: check-in responde em < 1s mesmo assim. |
| **Componentes Impactados** | Frontend (retry logic, UX feedback), Backend (async processing). |
| **Prioridade** | 🟢 MÉDIA (futuro) |
| **Risk se Violado** | Inoperável em conexão lenta (problema em academias em desenvolvimento). |
| **Stack Técnico** | Exponential backoff para retry. Service Worker (futuro offline). |

---

### 🟥 RNF-13 — Segurança de Autenticação

| Atributo | Descrição |
|---|---|
| **Descrição Expandida** | A autenticação deve usar mecanismo seguro (hash bcrypt, não texto plano). Senhas não armazenadas em logs. |
| **Critério de Aceitação** | ✅ Senhas com hash bcrypt (cost=10+). ✅ Sem texto plano em logs. ✅ HTTPS obrigatório (TLS 1.2+). ✅ CORS restrito a domínios conhecidos. ✅ Rate limiting no login (5 tentativas/15min). ✅ Sessions não armazenadas em URL. |
| **Métrica de Validação** | Teste: Hash de senha em BD é bcrypt? Log não contém senha? HTTPS com certificado válido? |
| **Componentes Impactados** | Backend (Spring Security), Infraestrutura (TLS cert). |
| **Prioridade** | 🔴 CRÍTICA |
| **Risk se Violado** | Vazamento de senhas, acesso não autorizado. |
| **Stack Técnico** | Spring Security PasswordEncoder (BCryptPasswordEncoder). Let's Encrypt para HTTPS. |

---

### 🟥 RNF-14 — Validação em 2 Camadas

| Atributo | Descrição |
|---|---|
| **Descrição Expandida** | O sistema deve validar dados tanto no frontend (UX) quanto no backend (segurança). |
| **Critério de Aceitação** | ✅ Frontend: Validação client-side para UX rápida (ex: email format). ✅ Backend: Validação server-side para segurança (ex: não confiar em cliente). ✅ Campo obrigatório em frontend avisa imediatamente. ✅ Hacker envia payload inválido? Backend rejeita. |
| **Métrica de Validação** | Teste: Contorna validação frontend? Backend ainda rejeita? |
| **Componentes Impactados** | Frontend (form validation), Backend (request validation). |
| **Prioridade** | 🔴 CRÍTICA |
| **Risk se Violado** | Dados corrompidos, possibilidade de injeção de SQL/XSS. |
| **Stack Técnico** | Frontend: react-hook-form + Zod. Backend: Spring Validator + @Valid. |

---

## 2. Requisitos Operacionais Detalhados (ROP)

### 🔴 ROP-01 — Ponto de Acesso em Cada Unidade

| Atributo | Descrição |
|---|---|
| **Descrição** | Deve existir pelo menos um ponto de acesso ao sistema em cada unidade (recepção) operando em tempo integral. |
| **Critério de Aceitação** | ✅ 5 academias = 5 computadores (mínimo). ✅ Navegador Chrome/Firefox/Edge. ✅ Conexão internet (banda: 5Mbps mínimo). ✅ Sistema operacional: Windows 10+, macOS, Linux. ✅ Sem requerimentos de app nativo/instalação. |
| **Impacto** | Todos os M01-M08 dependem disso. |
| **Infraestrutura** | Notebook ou desktop com 4GB RAM, SSD 256GB. Roteador WiFi 5GHz em cada unidade. |

---

### 🔴 ROP-02 — Check-in em Máximo 3 Interações

| Atributo | Descrição |
|---|---|
| **Descrição** | O fluxo de check-in do aluno deve ser concluído em ≤ 3 interações de tela, não comprometendo ritmo de recepção. |
| **Critério de Aceitação** | ✅ Fluxo: 1) Abre tela check-in. 2) Digita CPF ou seleciona aluno (autocomplete). 3) Clica "Permitir Acesso" ou vê motivo de bloqueio. ✅ Tempo total ≤ 30 segundos (manual + sistema). ✅ Aluno 2.000+ suporta busca por CPF em < 300ms. |
| **Impacto** | M02 (Controle de Acesso). Frontend + Backend performance. |
| **Design Pattern** | Search com autocomplete (debounce 300ms). |

---

### 🔴 ROP-03 — Painel de Inadimplência Sem Relatório Manual

| Atributo | Descrição |
|---|---|
| **Descrição** | O painel de inadimplência deve estar acessível ao coordenador de cada unidade e ao proprietário sem gerar relatório manual. |
| **Critério de Aceitação** | ✅ Coordenador loga e vê inadimplência da sua unidade em tempo real. ✅ Proprietário vê consolidado rede toda. ✅ Filtro por academia, período, valor mínimo. ✅ Dados atualizar a cada check-in/pagamento (< 1 min). |
| **Impacto** | M03 (Financeiro) + M07 (Relatórios). |
| **Implementação** | Dashboard/Widget em tempo real via WebSocket (atualizar sem refresh). |

---

### 🟡 ROP-04 — Professores Consultam Dados Sem Papéis Físicos

| Atributo | Descrição |
|---|---|
| **Descrição** | Professores devem conseguir consultar ficha e plano de treino de um aluno sem papéis físicos ou depender de terceiros. |
| **Critério de Aceitação** | ✅ Professor loga no sistema. ✅ Seleciona aluno de sua lista. ✅ Vê: ficha (peso, medidas), plano treino (exercícios, séries), feedback anterior. ✅ Pode consultar mesmo offline (futuro: cache local). ✅ Pode editar observações/feedback online. |
| **Impacto** | M04 (Avaliação), M05 (Professores), DUV-02 (desktop vs celular). |
| **Design Pattern** | Se celular (DUV-02=SIM): App web responsivo. Se desktop: Tela dedicada. |

---

### 🔴 ROP-05 — Dashboard Proprietário como Ponto de Entrada

| Atributo | Descrição |
|---|---|
| **Descrição** | O painel gerencial do proprietário deve ser ponto de entrada padrão (após login), exibindo KPIs críticos imediatamente. |
| **Critério de Aceitação** | ✅ Jonathan loga → vê dashboard (não menu vazio). ✅ KPIs visíveis em 2 segundos: alunos ativos, receita mês, inadimplência %, cancelamentos. ✅ Filtro por período e academia. ✅ Link rápido para detalhes (clica "inadimplência" → vê alunos atrasados). |
| **Impacto** | M07 (Relatórios) + Frontend. |
| **Implementação** | React Dashboard com widgets (recharts ou similar). Cache 5min. |

---

### 🟡 ROP-06 — Alertas Automáticos Sem Consulta Manual

| Atributo | Descrição |
|---|---|
| **Descrição** | Alertas de equipamento em manutenção, estoque mínimo e reavaliação física pendente devem aparecer automaticamente. |
| **Critério de Aceitação** | ✅ Coordenador loga e vê badge: "3 equipamentos em manutenção", "5 alunos para reavaliação", "Estoque de toalhas crítico". ✅ Notificação por email (configurável). ✅ Alertas em tempo real (< 1min após trigger). |
| **Impacto** | M06 (Equipamento), M04 (Avaliação), Backend (Jobs). |
| **Implementação** | Scheduled jobs (Quartz/Spring Scheduler) a cada 5min. WebSocket para notificações em tempo real. |

---

### 🟢 ROP-07 — Interface Responsiva (Desktop/Tablet/Mobile)

| Atributo | Descrição |
|---|---|
| **Descrição** | O sistema deve prever uso predominantemente via navegador, responsivo para desktop, tablet e mobile. |
| **Critério de Aceitação** | ✅ Desktop (1920px): layout completo, coluna dupla. ✅ Tablet (768px): layout stack, menu hambúrguer. ✅ Mobile (375px): single column, touch-friendly (buttons 44px min). ✅ Funcionalidade igual em todos (não degradar). |
| **Impacto** | Frontend (React). DUV-02 impacta (professor: computador vs celular?). |
| **Framework** | Tailwind CSS ou Bootstrap com breakpoints. |
| **Teste** | Resposive design test em 5 breakpoints. |

---

### 🟡 ROP-08 — Operações Críticas Simples para Usuários Inexperientes

| Atributo | Descrição |
|---|---|
| **Descrição** | Operações críticas de recepção (consulta de cadastro, liberação de acesso) devem ser possíveis mesmo por usuários com pouca familiaridade digital. |
| **Critério de Aceitação** | ✅ Check-in: 1 clique. ✅ Consulta aluno: 1 campo + Enter. ✅ Sem modais complexas. ✅ Sem required fields ocultos. ✅ Tutorial inline (tooltip na primeira vez). |
| **Impacto** | Frontend (UX), RNF-01, RNF-02. |
| **Design Pattern** | Progressive Disclosure (ocultar opções avançadas sob "Mostrar mais"). |

---

### 🔴 ROP-09 — Rastreabilidade de Usuário (Sem Ações Anônimas)

| Atributo | Descrição |
|---|---|
| **Descrição** | Todas as operações relevantes devem ser rastreáveis por usuário responsável. Sem ações anônimas. |
| **Critério de Aceitação** | ✅ Check-in: registra quem fez (recepcionista ID). ✅ Bloqueio manual: registra quem bloqueou. ✅ Pagamento: registra quem registrou. ✅ Auditoria completa (RNF-04). ✅ Sem "admin" genérico fazer operações. |
| **Impacto** | RNF-04 (Auditoria). Backend (middleware). |
| **Implementação** | Spring Security: @AuthenticationPrincipal injetado em todos endpoints. |

---

## 3. Restrições Técnicas por Stack

### 🖥️ Frontend (React)

```
Requisitos Técnicos:
  ├─ React 18+ (Hooks, Suspense)
  ├─ Redux ou Zustand (state management)
  ├─ React Router v6+ (routing)
  ├─ Axios ou Fetch API (HTTP)
  ├─ Tailwind CSS ou Material-UI (styling)
  ├─ React Hook Form (form handling)
  ├─ Zod ou Yup (schema validation)
  ├─ Jest + React Testing Library (tests ≥ 80%)
  ├─ ESLint + Prettier (code quality)
  └─ Vite ou CRA (build tool)

Performance Targets:
  ├─ Bundle size < 200KB (gzipped)
  ├─ Lighthouse score ≥ 80
  ├─ First Contentful Paint (FCP) < 1.5s
  ├─ Largest Contentful Paint (LCP) < 2.5s
  └─ Time to Interactive (TTI) < 3.5s

Accessibility:
  ├─ WCAG 2.1 AA compliance
  ├─ Keyboard navigation (Tab, Arrow keys)
  ├─ Screen reader compatible (semantic HTML)
  ├─ Color contrast ≥ 4.5:1
  └─ Font scalable up to 200%

Browsers Supported:
  ├─ Chrome/Edge 90+ (Chromium)
  ├─ Firefox 88+
  ├─ Safari 14+ (iOS)
  └─ Graceful degradation para IE11 (optional)
```

### 🔧 Backend (Spring Boot)

```
Requisitos Técnicos:
  ├─ Java 17+ (LTS)
  ├─ Spring Boot 3.0+ (dependencies BOM managed)
  ├─ Spring Data JPA (ORM, Hibernate 6+)
  ├─ Spring Security + JWT (authentication)
  ├─ Spring Validation (@Valid, @NotNull)
  ├─ Spring AOP (@Aspect para logging/auditoria)
  ├─ Spring Boot Actuator (health checks, metrics)
  ├─ Lombok (reduce boilerplate)
  ├─ MapStruct (DTO mapping)
  ├─ JUnit 5 + Mockito (tests ≥ 80%)
  ├─ SonarQube (code quality gate)
  └─ Maven 3.8+ (build)

Performance Targets:
  ├─ P95 latência < 2s (RNF-06)
  ├─ Throughput ≥ 100 req/s
  ├─ Memory footprint < 512MB (base)
  ├─ Connection pool: 10-20 conexões
  └─ CPU utilization < 70% em carga normal

Security:
  ├─ Spring Security + OIDC/OAuth2 (future)
  ├─ HTTPS TLS 1.2+ required
  ├─ SQL injection prevention (PreparedStatements)
  ├─ XSS protection (input validation)
  ├─ CSRF protection (@EnableWebSecurity)
  ├─ CORS restricted to known domains
  ├─ Rate limiting (5 req/s por IP login)
  ├─ Password bcrypt cost=10+
  └─ Sensitive data encryption (PII fields)

Error Handling:
  ├─ @ControllerAdvice centralizado
  ├─ Custom exception hierarchy
  ├─ Mensagens de erro em português
  ├─ Logging estruturado (JSON format)
  └─ Rastreamento de stack trace apenas em DEV
```

### 🗄️ Banco de Dados (PostgreSQL)

```
Requisitos Técnicos:
  ├─ PostgreSQL 14+ (JSON, Full-Text Search)
  ├─ Character set: UTF-8
  ├─ Collation: pt_BR
  ├─ Timezone: America/Sao_Paulo
  ├─ Backup: pgBackRest ou Barman (daily full + hourly incr)
  ├─ Replication: Streaming replication (future HA)
  ├─ Connection pooling: PgBouncer (50-100 conexões main)
  ├─ Monitoring: pg_stat_statements, pgAdmin4
  └─ Upgrade path: Minor versions yearly

Constraints de Integridade:
  ├─ PRIMARY KEY em todas tabelas
  ├─ FOREIGN KEY para integridade referencial
  ├─ UNIQUE constraints (CPF, email duplicação)
  ├─ CHECK constraints (valores válidos)
  ├─ NOT NULL onde apropriado
  ├─ DEFAULT values (created_at, updated_at)
  └─ Triggers para auditoria automática

Performance Targets:
  ├─ 90% queries < 100ms
  ├─ Index scan não table scan (full scan < 5%)
  ├─ Query plan stable (não variações)
  ├─ Vacuum/Analyze nightly
  ├─ Bloat < 20% (reindex quarterly)
  └─ Backup restore time < 4 horas

Arquitetura:
  ├─ Read replica (future load distribution)
  ├─ Partition by academia_id (future, 10K+ rows)
  ├─ Archive old data (CHECKIN_LOG > 2 anos move para cold storage)
  ├─ Materialized views para relatórios complexos
  └─ Row-Level Security (vide RNF-03 isolamento)
```

### 🚀 Infraestrutura

```
Requisitos de Deployment:
  ├─ Container: Docker (multi-stage build)
  ├─ Orquestração: Kubernetes ou Docker Compose
  ├─ Load Balancer: Nginx reverse proxy
  ├─ Cache: Redis 7+ (session, query cache)
  ├─ Monitoring: Prometheus + Grafana
  ├─ Logging: ELK Stack (Elasticsearch + Logstash + Kibana)
  ├─ CI/CD: GitHub Actions ou GitLab CI
  └─ Certificates: Let's Encrypt (auto-renew)

Ambientes:
  ├─ DEV: Local machine (Docker Compose)
  ├─ STAGING: Cloud staging server (AWS/GCP/Azure)
  ├─ PROD: Cloud production (multi-region future)
  └─ Backup PROD: Separate storage region

SLA:
  ├─ Availability: 99.5% (< 3.6 min downtime/mês)
  ├─ RTO (Recovery Time Objective): ≤ 4 horas
  ├─ RPO (Recovery Point Objective): ≤ 6 horas
  ├─ Maintenance window: Sábado 02:00-04:00 (BR time)
  └─ Disaster recovery plan: Documented e testado 6x/ano
```

---

## 4. Matriz de Prioridades (RNF/ROP × Fase de Implementação)

| Requisito | Fase 1 | Fase 2 | Fase 3+ | Prioridade |
|---|---|---|---|---|
| RNF-01 (Interface simples) | ✅ Implementar | ✅ Refinar | ✅ Otimizar | 🔴 CRÍTICA |
| RNF-02 (Acessibilidade) | ✅ Implementar | ✅ Testar | ✅ Melhorar | 🔴 CRÍTICA |
| RNF-03 (Autenticação) | ✅ Implementar | ✅ OIDC | ✅ SSO | 🔴 CRÍTICA |
| RNF-04 (Auditoria) | ✅ Implementar | ✅ Relatório | ✅ BI | 🔴 CRÍTICA |
| RNF-05 (Backup) | ✅ Implementar | ✅ Testar restore | ✅ Automatizar | 🔴 CRÍTICA |
| RNF-06 (Performance) | ✅ Implementar | ✅ Otimizar | ✅ Escala | 🔴 CRÍTICA |
| RNF-07 (Escalabilidade) | ⏳ Arquitetura | ✅ Teste multi-unidade | ✅ Grow to 10+ | 🟡 ALTA |
| RNF-08 (Mensagens claras) | ✅ Implementar | ✅ Melhoria contínua | ✅ i18n | 🟡 ALTA |
| RNF-09 (Camadas) | ✅ Design | ✅ Code review | ✅ Manutenção | 🔴 CRÍTICA |
| RNF-10 (Linguagem Academia) | ✅ Glossário | ✅ Implementar | ✅ Refinamento | 🟡 ALTA |
| RNF-11 (Manutenibilidade) | ✅ Design | ✅ Testes | ✅ Doc técnica | 🟡 ALTA |
| RNF-12 (Internet lenta) | ⏳ Planejar | ⏳ Planejar | ✅ v2 | 🟢 MÉDIA |
| RNF-13 (Segurança auth) | ✅ Implementar | ✅ Audit | ✅ Penetration test | 🔴 CRÍTICA |
| RNF-14 (Validação 2-layer) | ✅ Implementar | ✅ Refinar | ✅ SEC review | 🔴 CRÍTICA |

---

## 5. Plano de Validação (Fase 2)

### Testes de Aceitação

```
RNF-01 (Interface): Teste com 5 recepcionistas inexperientes
RNF-03 (Autenticação): Teste de RBAC - coordenador não vê outra unidade
RNF-04 (Auditoria): Teste de trilha - "Quem mudou comissão do Prof X?"
RNF-06 (Performance): Load test 50 usuários simultâneos, P95 < 2s
RNF-08 (Mensagens): Teste de UX - usuários entendem erros?
RNF-13 (Segurança): Teste de password bcrypt + HTTPS certificado
```

### Load Testing

```
Cenário 1: 50 usuários por 10 min
  - P95 latência < 2s
  - Sem timeout de conexão
  - Sem memory leak

Cenário 2: 500 usuários pico (5 academias, 100 cada)
  - Peak throughput ≥ 50 req/s
  - P99 latência < 5s
  - CPU < 75%

Cenário 3: Backup + queries simultâneas
  - Backup não afeta performance normal
  - Query time < 2s mesmo durante backup
```

---

## 6. Próximas Ações

1. **Hoje (2 de abril):** ✅ Documento detalhado de RNF/ROP criado
2. **3 de abril:** Revisar com Tech Lead (arquitetura stack)
3. **4 de abril:** Incluir em SPEC-001 (testes de aceitação)
4. **Fase 2:** Validação prática contra cada critério

---

**Última atualização**: 2 de abril de 2026  
**Status**: Pronto para Fase 2 com critérios mensuráveis  
**Owner**: Tech Lead (validar stack e performance targets)
