import test from 'node:test';
import assert from 'node:assert/strict';

globalThis.fetch = async (url, options = {}) => {
  const path = String(url);

  if (path.endsWith('/m01/alunos') || path.endsWith('/api/alunos')) {
    return {
      ok: true,
      json: async () => ({
        id: 101,
        aluno: JSON.parse(options.body),
      }),
    };
  }

  if (path.endsWith('/m01/checkins') || path.endsWith('/api/acesso/checkin')) {
    return {
      ok: true,
      json: async () => ({
        ok: true,
        message: 'Check-in persistido no backend.',
      }),
    };
  }

  if (path.endsWith('/m02/inadimplencia/desbloqueios') || /\/api\/acesso\/\d+\/desbloquear$/.test(path)) {
    return {
      ok: true,
      json: async () => ({
        message: 'Desbloqueio persistido no backend.',
      }),
    };
  }

  if (path.endsWith('/m08/comunicacoes/disparos') || path.endsWith('/api/comunicacoes/disparos')) {
    return {
      ok: true,
      json: async () => ({
        ok: true,
        message: 'Disparo persistido no backend.',
      }),
    };
  }

  return {
    ok: false,
    status: 404,
    json: async () => ({ message: 'Not found' }),
  };
};

test('fluxo crítico integrado (cadastro -> check-in -> financeiro -> comunicação)', async () => {
  const { salvarAlunoComFallback, checkinComFallback } = await import('../../src/modules/m01-cadastro-acesso/m01Gateway.js');
  const { desbloquearInadimplenteComFallback } = await import('../../src/modules/m02-financeiro/m02Gateway.js');
  const { dispararComunicacaoComFallback } = await import('../../src/modules/m08-comunicacao/m08Gateway.js');

  const cadastro = await salvarAlunoComFallback({
    nome: 'Ana Martins',
    cpf: '12345678901',
    email: 'ana@teste.com',
    plano: 'Mensal',
    unidade: 'Centro',
  });
  assert.equal(cadastro.ok, true);
  assert.equal(cadastro.source, 'api');

  const checkin = await checkinComFallback({
    cpf: '12345678901',
    status: 'ativo',
  });
  assert.equal(checkin.source, 'api');
  assert.equal(checkin.type, 'success-box');

  const financeiro = await desbloquearInadimplenteComFallback({
    alunoId: 101,
    aluno: 'Rafael Silva',
    dias: 4,
    status: 'Inadimplente',
    unlocked: false,
  });
  assert.equal(financeiro.source, 'api');
  assert.equal(financeiro.row.status, 'Ativo');

  const comunicacao = await dispararComunicacaoComFallback({
    canal: 'Email',
    segmento: 'Inadimplentes',
    mensagem: 'Mensagem de teste',
    ok: true,
  });
  assert.equal(comunicacao.source, 'api');
  assert.equal(comunicacao.type, 'success-box');
});
