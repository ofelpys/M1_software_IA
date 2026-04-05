import { getApiErrorMessage, requestJson } from '../../services/httpClient.js';
import { apiRoutes } from '../../services/apiRoutes.js';
import { dispararComunicacao } from '../../services/mockApi.js';
import { buildM08DisparoRequest, parseM08DisparoResponse } from '../../contracts/m08.contract.js';
import { isStrictFallback } from '../../services/integrationPolicy.js';

export async function dispararComunicacaoComFallback(payload) {
  try {
    const requestBody = buildM08DisparoRequest(payload);
    const data = await requestJson(apiRoutes.m08.disparoComunicacao, {
      method: 'POST',
      body: requestBody,
    });
    const parsed = parseM08DisparoResponse(data);

    const ok = parsed.ok;
    return {
      type: ok ? 'success-box' : 'error-box',
      text: parsed.message || (ok ? 'Comunicação enviada com sucesso. Status: ENVIADA.' : 'Falha no envio. Status: RETRY agendado para 5 minutos.'),
      source: 'api',
    };
  } catch (error) {
    if (isStrictFallback('m08')) {
      return {
        type: 'error-box',
        text: `${getApiErrorMessage(error)} Modo estrito ativo: disparo nao foi persistido no backend.`,
        source: 'api-error',
      };
    }

    const fallback = await dispararComunicacao({ ok: payload.ok });
    return {
      ...fallback,
      source: 'mock',
      fallbackNotice: getApiErrorMessage(error),
    };
  }
}
