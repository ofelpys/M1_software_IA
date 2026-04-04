import { getApiErrorMessage, requestJson } from '../../services/httpClient.js';
import { apiRoutes } from '../../services/apiRoutes.js';
import { checkinRapido, salvarAluno } from '../../services/mockApi.js';
import { formatCpf } from '../../utils/cpf.js';
import {
  buildM01AlunoCreateRequest,
  buildM01CheckinRequest,
  parseM01AlunoCreateResponse,
  parseM01CheckinResponse,
} from '../../contracts/m01.contract.js';
import { getEnv } from '../../services/env.js';

function isStrictApiMode() {
  return String(getEnv('VITE_API_STRICT_MODE', '')).toLowerCase() === 'true';
}

function normalizeApiSave(payload, data) {
  return {
    ok: true,
    id: data?.id || Date.now(),
    aluno: data?.aluno || payload,
    source: 'api',
  };
}

export async function salvarAlunoComFallback(payload) {
  const normalizedPayload = buildM01AlunoCreateRequest({
    ...payload,
    cpf: formatCpf(payload?.cpf),
  });

  try {
    const data = await requestJson(apiRoutes.m01.alunos, {
      method: 'POST',
      body: normalizedPayload,
    });
    const parsed = parseM01AlunoCreateResponse(data);
    return normalizeApiSave(normalizedPayload, parsed);
  } catch (error) {
    if (isStrictApiMode()) {
      return {
        ok: false,
        source: 'api-error',
        error: `${getApiErrorMessage(error)} Modo estrito ativo: operação não foi persistida no backend.`,
      };
    }

    const fallback = await salvarAluno(normalizedPayload);
    return {
      ...fallback,
      source: 'mock',
      fallbackNotice: getApiErrorMessage(error),
    };
  }
}

export async function checkinComFallback(payload) {
  const normalizedPayload = buildM01CheckinRequest({
    ...payload,
    cpf: formatCpf(payload?.cpf),
  });

  try {
    const data = await requestJson(apiRoutes.m01.checkin, {
      method: 'POST',
      body: normalizedPayload,
    });
    const parsed = parseM01CheckinResponse(data);

    if (parsed.ok === true) {
      return {
        type: 'success-box',
        text: parsed.message || 'Check-in efetuado com sucesso.',
        source: 'api',
      };
    }

    return {
      type: 'error-box',
      text: parsed.message || 'Check-in não autorizado.',
      source: 'api',
    };
  } catch (error) {
    if (isStrictApiMode()) {
      return {
        type: 'error-box',
        text: `${getApiErrorMessage(error)} Modo estrito ativo: check-in não foi persistido no backend.`,
        source: 'api-error',
      };
    }

    const fallback = await checkinRapido(normalizedPayload);
    return {
      ...fallback,
      source: 'mock',
      fallbackNotice: getApiErrorMessage(error),
    };
  }
}
