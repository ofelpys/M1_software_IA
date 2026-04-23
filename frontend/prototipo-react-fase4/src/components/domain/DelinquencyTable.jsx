import Badge from '../Badge';

export default function DelinquencyTable({ rows, onUnlock, onDelete, feedback }) {
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
          {rows.length === 0 && (
            <tr>
              <td colSpan="4">Nenhum aluno inadimplente no momento.</td>
            </tr>
          )}
          {rows.map((row, index) => (
            <tr key={row.alunoId || `${row.aluno}-${index}`}>
              <td>{row.aluno}</td>
              <td>{row.dias}</td>
              <td>
                <Badge type={row.status === 'Ativo' ? 'active' : 'debt'}>{row.status}</Badge>
              </td>
              <td>
                <button className="btn-ghost btn-xs" type="button" onClick={() => onUnlock(index)} disabled={row.unlocked}>
                  {row.unlocked ? 'Desbloqueado' : 'Desbloquear'}
                </button>
                <button
                  className="btn-ghost btn-xs"
                  type="button"
                  onClick={() => onDelete(index)}
                  style={{ marginLeft: 8 }}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {feedback?.text && <div className={`feedback-box ${feedback.type || 'success-box'}`}>{feedback.text}</div>}
    </>
  );
}
