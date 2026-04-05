import { getApiErrorMessage, requestJson } from '../../services/httpClient.js';
import { apiRoutes } from '../../services/apiRoutes.js';

const defaultRows = [
  { produto: 'Whey Protein 1kg', categoria: 'Proteina', estoque: 12, status: 'Disponivel' },
  { produto: 'Creatina 250g', categoria: 'Suplemento', estoque: 4, status: 'Baixo' },
  { produto: 'Limpador multiuso', categoria: 'Limpeza', estoque: 1, status: 'Critico' },
];

export async function listarInsumosComFallback() {
  try {
    const data = await requestJson(apiRoutes.m07.insumos);
    const rows = Array.isArray(data) ? data : [];
    return { rows, source: 'api' };
  } catch (error) {
    return { rows: defaultRows, source: 'mock', fallbackNotice: getApiErrorMessage(error) };
  }
}
