import { getApiErrorMessage, requestJson } from '../../services/httpClient.js';
import { apiRoutes } from '../../services/apiRoutes.js';
import { isStrictFallback } from '../../services/integrationPolicy.js';

const defaultRows = [
  { nome: 'Leg Press 45', unidade: 'Centro', status: 'Ativo', proximaManutencao: '12/04' },
  { nome: 'Esteira X900', unidade: 'Zona Sul', status: 'Revisao', proximaManutencao: '06/04' },
  { nome: 'Banco Supino Reto', unidade: 'Zona Norte', status: 'Inativo', proximaManutencao: 'Em manutencao' },
];

export async function listarEquipamentosComFallback() {
  try {
    const data = await requestJson(apiRoutes.m06.equipamentos);
    const rows = Array.isArray(data) ? data : [];
    return { rows, source: 'api' };
  } catch (error) {
    if (isStrictFallback('m06')) {
      return { rows: [], source: 'api-error', error: getApiErrorMessage(error) };
    }
    return { rows: defaultRows, source: 'mock', fallbackNotice: getApiErrorMessage(error) };
  }
}

export async function criarEquipamentoComFallback(payload) {
  try {
    const data = await requestJson(apiRoutes.m06.equipamentos, {
      method: 'POST',
      body: payload,
    });
    return { ok: true, data, source: 'api' };
  } catch (error) {
    if (isStrictFallback('m06')) {
      return {
        ok: false,
        source: 'api-error',
        error: `${getApiErrorMessage(error)} Modo estrito ativo: item nao foi persistido no backend.`,
      };
    }

    return {
      ok: true,
      source: 'mock',
      data: { ...payload, id: `mock-${Date.now()}` },
      fallbackNotice: getApiErrorMessage(error),
    };
  }
}
