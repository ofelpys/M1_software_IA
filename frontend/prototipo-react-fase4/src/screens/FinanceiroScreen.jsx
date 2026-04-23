import { useEffect, useState } from 'react';
import Badge from '../components/Badge';
import DelinquencyTable from '../components/domain/DelinquencyTable';
import { desbloquearInadimplenteComFallback, excluirAlunoPermanente } from '../modules/m02-financeiro/m02Gateway';
import { listarAlunos } from '../modules/m01-cadastro-acesso/m01Gateway';
import { formatCurrencyBRL, getPlanoValor } from '../utils/planos';

export default function FinanceiroScreen() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  const loadRows = async () => {
    setLoading(true);
    try {
      const data = await listarAlunos();
      const mapped = (Array.isArray(data) ? data : [])
        .map((item) => ({
          alunoId: item?.id,
          aluno: item?.aluno?.nome || '-',
          unidade: item?.aluno?.unidade || 'Centro',
          plano: item?.aluno?.plano || 'Mensal',
          dias: 3 + (Number(item?.id || 0) % 12),
          status: item?.aluno?.status || 'Ativo',
          unlocked: false,
        }))
        .filter((row) => row.status === 'Inadimplente' || row.status === 'Bloqueado');
      setRows(mapped);
    } catch (error) {
      setFeedback({ type: 'error-box', text: `Falha ao carregar inadimplentes: ${error?.message || 'erro desconhecido'}` });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRows();
  }, []);

  const unlock = async (index) => {
    const result = await desbloquearInadimplenteComFallback(rows[index]);
    if (result.source === 'api' || result.source === 'mock') {
      await loadRows();
    }
    const suffix = result.source === 'mock' ? ' (modo simulado)' : ' (API real)';
    const detail = result.fallbackNotice ? ` ${result.fallbackNotice}` : '';
    const isError = result.source === 'api-error';
    setFeedback({
      type: isError ? 'error-box' : 'success-box',
      text: `${result.message}${suffix}${detail}`,
    });
  };

  const removePermanente = async (index) => {
    const target = rows[index];
    if (!target?.alunoId) {
      setFeedback({ type: 'error-box', text: 'Nao foi possivel identificar o aluno para exclusao.' });
      return;
    }

    const shouldDelete = window.confirm(
      `Confirma a exclusao PERMANENTE de ${target.aluno}? Esta acao remove os dados do banco e nao pode ser desfeita.`,
    );

    if (!shouldDelete) {
      return;
    }

    try {
      await excluirAlunoPermanente(target.alunoId);
      setFeedback({ type: 'success-box', text: `${target.aluno} foi excluido permanentemente do banco.` });
      await loadRows();
    } catch (error) {
      setFeedback({
        type: 'error-box',
        text: `Falha ao excluir permanentemente ${target.aluno}: ${error?.message || 'erro desconhecido'}`,
      });
    }
  };

  const totalAtrasado = rows.reduce((sum, row) => sum + getPlanoValor(row.plano), 0);

  return (
    <>
      <div className="grid split-8-4">
        <section className="panel">
          <h3>Fluxo financeiro rápido</h3>
          <table className="compact-table">
            <thead><tr><th>Data</th><th>Descrição</th><th>Valor</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td>04/04</td><td>Mensalidades recebidas</td><td>{formatCurrencyBRL(18200)}</td><td><Badge type="success">OK</Badge></td></tr>
              <tr><td>04/04</td><td>Comissões previstas</td><td>R$ 7.980</td><td><Badge type="alert">Revisão</Badge></td></tr>
              <tr><td>03/04</td><td>Boletos em atraso (real)</td><td>{formatCurrencyBRL(totalAtrasado)}</td><td><Badge type="debt">Inadimplente</Badge></td></tr>
            </tbody>
          </table>
        </section>
        <section className="panel">
          <h3>Ações</h3>
          <button className="btn-primary">Gerar recibo</button>
          <button className="btn-ghost">Exportar CSV</button>
        </section>
      </div>

      <div className="grid split-8-4">
        <section className="panel">
          {loading && <p>Carregando inadimplentes...</p>}
          <DelinquencyTable rows={rows} onUnlock={unlock} onDelete={removePermanente} feedback={feedback} />
        </section>

        <section className="panel">
          <h3>Regra aplicada</h3>
          <p>Bloqueio automático após 3 dias de carência.</p>
          <p>Desbloqueio manual exige registro de operador.</p>
        </section>
      </div>
    </>
  );
}
