function assertObject(value, name) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${name} inválido.`);
  }
}

export function buildM01AlunoCreateRequest(payload) {
  const unidade = String(payload?.unidade || '').trim() || 'Centro';
  const status = String(payload?.status || '').trim() || 'Ativo';

  return {
    nome: String(payload?.nome || '').trim(),
    cpf: String(payload?.cpf || '').trim(),
    email: String(payload?.email || '').trim(),
    telefone: String(payload?.telefone || '').trim(),
    dataNascimento: String(payload?.dataNascimento || '').trim(),
    endereco: String(payload?.endereco || '').trim(),
    objetivo: String(payload?.objetivo || '').trim(),
    contatoEmergencia: String(payload?.contatoEmergencia || '').trim(),
    plano: String(payload?.plano || '').trim(),
    unidade,
    status,
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
  };
}

export function parseM01CheckinResponse(data) {
  assertObject(data, 'Resposta de check-in');

  return {
    ok: data.ok !== false,
    message: data.message,
  };
}
