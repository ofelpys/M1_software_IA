function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function checkinRapido({ cpf, status }) {
  await sleep(150);
  const value = cpf?.trim() || 'Não informado';
  if (status === 'ativo') {
    return { type: 'success-box', text: `Check-in liberado para CPF ${value}. Registro efetuado.` };
  }
  if (status === 'inadimplente') {
    return { type: 'error-box', text: `Acesso negado para CPF ${value}. Motivo: inadimplência.` };
  }
  return { type: 'error-box', text: `Acesso bloqueado para CPF ${value}. Encaminhar coordenação.` };
}

export async function desbloquearAluno(row) {
  await sleep(120);
  return { ...row, status: 'Ativo', unlocked: true };
}

export async function dispararComunicacao({ ok }) {
  await sleep(180);
  if (ok) {
    return { type: 'success-box', text: 'Comunicação enviada com sucesso. Status: ENVIADA.' };
  }
  return { type: 'error-box', text: 'Falha no envio. Status: RETRY agendado para 5 minutos.' };
}

export async function salvarAluno(payload) {
  await sleep(160);
  const cpf = payload.cpf || '';
  const isValid = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf);
  if (!isValid) {
    return { ok: false, error: 'CPF inválido no formato 000.000.000-00.' };
  }
  return { ok: true, id: Date.now(), aluno: payload };
}
