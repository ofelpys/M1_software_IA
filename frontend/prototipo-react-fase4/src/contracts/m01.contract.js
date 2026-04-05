function assertObject(value, name) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${name} inválido.`);
  }
}

export function buildM01AlunoCreateRequest(payload) {
  return {
    nome: String(payload?.nome || '').trim(),
    cpf: String(payload?.cpf || '').trim(),
    email: String(payload?.email || '').trim(),
    plano: String(payload?.plano || '').trim(),
    unidade: String(payload?.unidade || '').trim(),
  };
}

export function parseM01AlunoCreateResponse(data) {
  assertObject(data, 'Resposta de cadastro');

  return {
    id: data.id,
    aluno: data.aluno,
  };
}

export function buildM01CheckinRequest(payload) {
  return {
    cpf: String(payload?.cpf || '').trim(),
    status: String(payload?.status || '').trim(),
  };
}

export function parseM01CheckinResponse(data) {
  assertObject(data, 'Resposta de check-in');

  return {
    ok: data.ok !== false,
    message: data.message,
  };
}
