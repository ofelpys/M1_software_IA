import { useState } from 'react';
import Badge from '../components/Badge';
import DelinquencyTable from '../components/domain/DelinquencyTable';
import { desbloquearInadimplenteComFallback } from '../modules/m02-financeiro/m02Gateway';

export default function FinanceiroScreen() {
  const [rows, setRows] = useState([
    { aluno: 'Rafael Silva', dias: 6, status: 'Inadimplente', unlocked: false },
    { aluno: 'Rita Nogueira', dias: 4, status: 'Inadimplente', unlocked: false },
  ]);
  const [feedback, setFeedback] = useState(null);

  const unlock = async (index) => {
    const result = await desbloquearInadimplenteComFallback(rows[index]);
    const next = rows.map((row, i) => (i === index ? result.row : row));
    setRows(next);
    const suffix = result.source === 'mock' ? ' (modo simulado)' : ' (API real)';
    const detail = result.fallbackNotice ? ` ${result.fallbackNotice}` : '';
    setFeedback(`${result.message}${suffix}${detail}`);
  };

  return (
    <>
      <div className="grid split-8-4">
        <section className="panel">
          <h3>Fluxo financeiro rápido</h3>
          <table className="compact-table">
            <thead><tr><th>Data</th><th>Descrição</th><th>Valor</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td>04/04</td><td>Mensalidades recebidas</td><td>R$ 18.200</td><td><Badge type="success">OK</Badge></td></tr>
              <tr><td>04/04</td><td>Comissões previstas</td><td>R$ 7.980</td><td><Badge type="alert">Revisão</Badge></td></tr>
              <tr><td>03/04</td><td>Boletos em atraso</td><td>R$ 12.100</td><td><Badge type="debt">Inadimplente</Badge></td></tr>
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
          <DelinquencyTable rows={rows} onUnlock={unlock} feedback={feedback} />
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
