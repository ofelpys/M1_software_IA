function assertObject(value, name) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${name} inválido.`);
  }
}

export function buildM02DesbloqueioRequest(row) {
  return {
    aluno: String(row?.aluno || '').trim(),
    diasAtraso: Number(row?.dias || 0),
  };
}

export function parseM02DesbloqueioResponse(data) {
  assertObject(data, 'Resposta de desbloqueio');

  return {
    message: data.message,
  };
}
