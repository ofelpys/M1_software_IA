import { getApiErrorMessage, requestJson } from '../../services/httpClient.js';
import { apiRoutes } from '../../services/apiRoutes.js';
import { desbloquearAluno } from '../../services/mockApi.js';
import { buildM02DesbloqueioRequest, parseM02DesbloqueioResponse } from '../../contracts/m02.contract.js';

export async function desbloquearInadimplenteComFallback(row) {
  try {
    const requestBody = buildM02DesbloqueioRequest(row);
    const data = await requestJson(apiRoutes.m02.desbloqueioInadimplencia, {
      method: 'POST',
      body: requestBody,
    });
    const parsed = parseM02DesbloqueioResponse(data);

    return {
      row: { ...row, status: 'Ativo', unlocked: true },
      message: parsed.message || `${row.aluno} desbloqueado com registro de operador.`,
      source: 'api',
    };
  } catch (error) {
    const fallback = await desbloquearAluno(row);
    return {
      row: fallback,
      message: `${fallback.aluno} desbloqueado com registro de operador.`,
      source: 'mock',
      fallbackNotice: getApiErrorMessage(error),
    };
  }
}
