import Badge from '../components/Badge';
import CheckinPanel from '../components/domain/CheckinPanel';

export default function RecepcaoScreen() {
  return (
    <div className="grid split-6-6">
      <section className="panel">
        <CheckinPanel />
      </section>

      <section className="panel">
        <h3>Fila de recepção</h3>
        <table className="compact-table">
          <thead><tr><th>Horário</th><th>Aluno</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>18:02</td><td>Bruno Matos</td><td><Badge type="active">Ativo</Badge></td></tr>
            <tr><td>18:03</td><td>Rita Nogueira</td><td><Badge type="debt">Inadimplente</Badge></td></tr>
            <tr><td>18:04</td><td>Ana Costa</td><td><Badge type="trial">Trial</Badge></td></tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
