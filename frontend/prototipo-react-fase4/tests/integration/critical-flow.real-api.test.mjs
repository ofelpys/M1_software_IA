import test from 'node:test';
import assert from 'node:assert/strict';

const runRealApiTests = String(process.env.RUN_REAL_API_TESTS || '').toLowerCase() === 'true';
const baseUrl = process.env.REAL_API_BASE_URL || '';

if (runRealApiTests && baseUrl) {
  process.env.VITE_API_BASE_URL = baseUrl;
  process.env.VITE_API_STRICT_MODE = 'true';
}

test('fluxo crítico em API real (staging)', { skip: !(runRealApiTests && baseUrl) }, async () => {
  const { salvarAlunoComFallback, checkinComFallback } = await import('../../src/modules/m01-cadastro-acesso/m01Gateway.js');
  const { desbloquearInadimplenteComFallback } = await import('../../src/modules/m02-financeiro/m02Gateway.js');
  const { dispararComunicacaoComFallback } = await import('../../src/modules/m08-comunicacao/m08Gateway.js');

  const ts = Date.now();
  const cpf = String(10000000000 + (ts % 89999999999));

  const cadastro = await salvarAlunoComFallback({
    nome: `Teste Staging ${ts}`,
    cpf,
    email: `teste.staging.${ts}@mailinator.com`,
    plano: 'Mensal',
  });

  assert.equal(cadastro.ok, true, `Cadastro falhou: ${cadastro.error || 'sem detalhe'}`);
  assert.equal(cadastro.source, 'api');

  const checkin = await checkinComFallback({
    cpf,
    status: 'ativo',
  });
  assert.equal(checkin.source, 'api');
  assert.equal(checkin.type, 'success-box');

  const financeiro = await desbloquearInadimplenteComFallback({
    aluno: 'Rafael Silva',
    dias: 4,
    status: 'Inadimplente',
    unlocked: false,
  });
  assert.equal(financeiro.source, 'api');

  const comunicacao = await dispararComunicacaoComFallback({
    canal: 'Email',
    segmento: 'Inadimplentes',
    mensagem: `Teste staging ${ts}`,
    ok: true,
  });
  assert.equal(comunicacao.source, 'api');
  assert.equal(comunicacao.type, 'success-box');
});
