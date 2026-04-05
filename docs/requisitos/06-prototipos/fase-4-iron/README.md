# Fase 4 - Protótipo Visual Industrial/Iron

Data: 4 de abril de 2026
Status: Em andamento (Rodada 3 aplicada)
Base: PLAN-001 a PLAN-008

## Escopo MVP

Este pacote existe para validacao visual e funcional de MVP.

Nao deve ser interpretado como software enterprise final; e um artefato de prototipagem para acelerar decisoes de produto e implementacao incremental.

## Escopo deste pacote

- Protótipo navegável em HTML/CSS/JS para validação rápida.
- Aplicação do visual padrão industrial/iron definido pelo produto.
- Cobertura inicial de telas: painel, cadastro, financeiro e checklist operacional.
- Cobertura rodada 2: professores (M05), equipamentos/salas (M06) e comunicação (M08).
- Cobertura rodada 3: fluxos críticos de recepção/check-in, inadimplência/desbloqueio e feedback de envio em comunicação.

## Padrão visual aplicado

- Tipografia: Barlow Condensed (títulos) e Barlow (corpo).
- Cores: base escura (#0D0D0D -> #2E2E2E), ação primária em vermelho (#E8251F).
- Grid: 12 colunas, gap 8px.
- Sem gradientes coloridos.

## Componentes base implementados no protótipo

- Cartões de métrica com barra superior de 4px por criticidade.
- Avatares com dot de presença online/offline.
- Badges de status (ativo, inadimplente, trial, premium, informativo).
- Tabelas compactas com hover sutil.
- Inputs com estado de erro.
- Barras de progresso para ocupação por unidade.
- Sidebar com navegação por ícones/texto e preview de dashboard.

## Arquivos

- index.html
- styles.css
- app.js

## Telas atualmente navegáveis

- Painel
- Recepção
- Cadastro
- Financeiro
- Professores (M05)
- Equipamentos (M06)
- Comunicação (M08)
- Operação

## Fluxos críticos simulados (rodada 3)

- Check-in rápido com retorno visual por status.
- Desbloqueio manual de inadimplente com atualização de status.
- Envio de comunicação com estados de sucesso e falha/retry.

## Próximo passo recomendado

1. Validar com Jonathan o pacote visual e os estados de tela.
2. Ajustar copy/rótulos por módulo.
3. Iniciar implementação de Fase 5 reaproveitando o skeleton em frontend/prototipo-react-fase4.

## Roteiro de validação

- Executar checklist em: VALIDACAO-VISUAL-TELAS.md
