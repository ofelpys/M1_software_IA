export const PLANO_VALORES = Object.freeze({
  Mensal: 150,
  Anual: 120,
  Premium: 100,
});

export function getPlanoValor(plano) {
  return PLANO_VALORES[plano] || 0;
}

export function formatCurrencyBRL(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value || 0));
}