import Badge from '../Badge';

export default function DelinquencyTable({ rows, onUnlock, feedback }) {
  return (
    <>
      <h3>Inadimplência e desbloqueio</h3>
      <table className="compact-table">
        <thead>
          <tr>
            <th>Aluno</th>
            <th>Dias atraso</th>
            <th>Status</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.aluno}>
              <td>{row.aluno}</td>
              <td>{row.dias}</td>
              <td>
                <Badge type={row.status === 'Ativo' ? 'active' : 'debt'}>{row.status}</Badge>
              </td>
              <td>
                <button className="btn-ghost btn-xs" type="button" onClick={() => onUnlock(index)} disabled={row.unlocked}>
                  {row.unlocked ? 'Desbloqueado' : 'Desbloquear'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {feedback && <div className="feedback-box success-box">{feedback}</div>}
    </>
  );
}
