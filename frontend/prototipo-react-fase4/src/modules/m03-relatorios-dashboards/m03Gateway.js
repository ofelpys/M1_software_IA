import { getApiErrorMessage, requestJson } from '../../services/httpClient.js';
import { apiRoutes } from '../../services/apiRoutes.js';

export async function listarKpisComFallback() {
  try {
    const data = await requestJson(apiRoutes.m03.relatoriosKpis);
    return { data, source: 'api' };
  } catch (error) {
    return {
      data: {
        alunosCadastrados: 0,
        checkinsLiberados: 0,
        checkinsNegados: 0,
        desbloqueiosRegistrados: 0,
        comunicacoesProcessadas: 0,
      },
      source: 'mock',
      fallbackNotice: getApiErrorMessage(error),
    };
  }
}
