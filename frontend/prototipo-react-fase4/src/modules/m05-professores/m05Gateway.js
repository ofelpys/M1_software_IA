import { getApiErrorMessage, requestJson } from '../../services/httpClient.js';
import { apiRoutes } from '../../services/apiRoutes.js';

const defaultRows = [
  { nome: 'Joao Gomes', especialidade: 'Musculacao', status: 'Ativo', comissao: 3420 },
  { nome: 'Carla Souza', especialidade: 'Pilates', status: 'Ativo', comissao: 2980 },
  { nome: 'Marcos Ferreira', especialidade: 'Funcional', status: 'Ativo', comissao: 1210 },
];

export async function listarProfessoresComFallback() {
  try {
    const data = await requestJson(apiRoutes.m05.professores);
    const rows = Array.isArray(data) ? data : [];
    return { rows, source: 'api' };
  } catch (error) {
    return { rows: defaultRows, source: 'mock', fallbackNotice: getApiErrorMessage(error) };
  }
}
