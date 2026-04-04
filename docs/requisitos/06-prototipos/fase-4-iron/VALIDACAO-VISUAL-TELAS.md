# ValidaÃ§Ã£o Visual e de Telas - Fase 4 React

Data: 4 de abril de 2026
Ambiente: Preview estavel sem HMR
URL: http://localhost:4173/

## Objetivo

Validar consistÃªncia visual, navegaÃ§Ã£o e comportamento bÃ¡sico das telas antes da integraÃ§Ã£o real de API (passo 2).

## Critérios globais (todas as telas)

- Tema industrial/iron coerente (fundo escuro, contraste, destaque em vermelho de ação).
- Grid e espaçamento estáveis (12 colunas, gap visual consistente).
- Sidebar funcional e troca de telas sem falhas.
- Header com título correto para cada tela.
- Responsividade mínima em largura menor (colunas empilhando sem quebrar layout).
- Nenhuma tela em branco, nenhum texto sobreposto.

## Roteiro por tela

### 1) Painel

- Verificar 4 metric cards com barra superior por criticidade.
- Verificar tabela de alunos e status com hover nas linhas.
- Verificar bloco de ocupaÃ§Ã£o por unidade com barras de progresso.

Status: [ ] Aprovado [ ] Ajustar
Observações:

### 2) RecepÃ§Ã£o

- Validar check-in com status Ativo: deve retornar feedback de sucesso.
- Validar check-in com status Inadimplente: deve retornar feedback de bloqueio.
- Validar check-in com status Bloqueado: deve retornar encaminhamento.
- Verificar tabela de fila de recepção.

Status: [ ] Aprovado [ ] Ajustar
Observações:

### 3) Cadastro (M01)

- Verificar formulário de cadastro.
- Testar CPF inválido (exemplo: 123) e confirmar mensagem de erro.
- Testar CPF válido no formato 000.000.000-00 e confirmar sucesso.
- Verificar limpeza do formulário apÃ³s sucesso.

Status: [ ] Aprovado [ ] Ajustar
Observações:

### 4) Financeiro

- Verificar tabela de fluxo financeiro.
- Verificar ação de desbloqueio na tabela de inadimplÃªncia.
- Confirmar mudança de badge para Ativo apÃ³s desbloqueio.
- Confirmar feedback visual de desbloqueio executado.

Status: [ ] Aprovado [ ] Ajustar
Observações:

### 5) Professores

- Verificar tabela com status e valores.
- Verificar bloco de performance com barras de progresso.

Status: [ ] Aprovado [ ] Ajustar
Observações:

### 6) Equipamentos

- Verificar tabela de inventário e manutenÃ§Ã£o.
- Verificar bloco de ocupaÃ§Ã£o de salas.

Status: [ ] Aprovado [ ] Ajustar
Observações:

### 7) ComunicaÃ§Ã£o

- Testar botão Enviar agora e validar feedback de sucesso.
- Testar botão Simular falha e validar feedback de retry.
- Verificar tabela de histÃ³rico de envios.

Status: [ ] Aprovado [ ] Ajustar
Observações:

### 8) OperaÃ§Ã£o

- Verificar checklist visual e diretrizes exibidas.

Status: [ ] Aprovado [ ] Ajustar
Observações:

## Fechamento da validaÃ§Ã£o

Aprovação geral do visual:

- [ ] Aprovado para seguir ao passo 2
- [ ] Requer ajustes antes do passo 2

Ajustes priorizados (P1, P2, P3):

1. 
2. 
3. 

## Ponte para passo 2 (integraÃ§Ã£o API)

Quando a validaÃ§Ã£o acima for aprovada, seguir com:

1. Definir contratos HTTP por tela prioritÃ¡ria (M01 e RecepÃ§Ã£o primeiro).
2. Substituir funções de mockApi por client HTTP com fallback em mock.
3. Ligar estados de sucesso/erro aos retornos reais da API.
4. Registrar erros de rede/timeout no mesmo padrão de feedback-box.
