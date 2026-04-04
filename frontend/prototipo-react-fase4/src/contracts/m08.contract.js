function assertObject(value, name) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${name} inválido.`);
  }
}

export function buildM08DisparoRequest(payload) {
  return {
    canal: String(payload?.canal || '').trim(),
    segmento: String(payload?.segmento || '').trim(),
    mensagem: String(payload?.mensagem || '').trim(),
    ok: Boolean(payload?.ok),
  };
}

export function parseM08DisparoResponse(data) {
  assertObject(data, 'Resposta de disparo');

  return {
    ok: data.ok !== false,
    message: data.message,
  };
}
