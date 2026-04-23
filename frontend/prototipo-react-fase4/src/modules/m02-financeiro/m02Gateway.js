import { getApiErrorMessage, requestJson } from '../../services/httpClient.js';
import { apiRoutes } from '../../services/apiRoutes.js';
import { desbloquearAluno } from '../../services/mockApi.js';
import { buildM02DesbloqueioRequest, parseM02DesbloqueioResponse } from '../../contracts/m02.contract.js';
import { isStrictFallback } from '../../services/integrationPolicy.js';

export async function desbloquearInadimplenteComFallback(row) {
  try {
    const requestBody = buildM02DesbloqueioRequest(row);
    const resolvedPath = String(apiRoutes.m02.desbloqueioInadimplencia).includes('{alunoId}')
      ? String(apiRoutes.m02.desbloqueioInadimplencia).replace('{alunoId}', String(row?.alunoId || row?.id || 0))
      : apiRoutes.m02.desbloqueioInadimplencia;

    const data = await requestJson(resolvedPath, {
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
    if (isStrictFallback('m02')) {
      return {
        row: { ...row },
        message: `${getApiErrorMessage(error)} Modo estrito ativo: desbloqueio nao foi persistido no backend.`,
        source: 'api-error',
      };
    }

    const fallback = await desbloquearAluno(row);
    return {
      row: fallback,
      message: `${fallback.aluno} desbloqueado com registro de operador.`,
      source: 'mock',
      fallbackNotice: getApiErrorMessage(error),
    };
  }
}

export async function excluirAlunoPermanente(alunoId) {
  const resolvedPath = String(apiRoutes.m02.excluirAlunoPermanente).includes('{alunoId}')
    ? String(apiRoutes.m02.excluirAlunoPermanente).replace('{alunoId}', String(alunoId || 0))
    : apiRoutes.m02.excluirAlunoPermanente;

  await requestJson(resolvedPath, {
    method: 'DELETE',
  });
}
