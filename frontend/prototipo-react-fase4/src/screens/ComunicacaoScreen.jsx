import Badge from '../components/Badge';
import CommunicationPanel from '../components/domain/CommunicationPanel';

export default function ComunicacaoScreen() {
  return (
    <div className="grid split-6-6">
      <section className="panel">
        <CommunicationPanel />
      </section>

      <section className="panel">
        <h3>Histórico de envios</h3>
        <table className="compact-table">
          <thead><tr><th>Data</th><th>Canal</th><th>Público</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>04/04 18:00</td><td>Email</td><td>Inadimplentes</td><td><Badge type="success">Enviado</Badge></td></tr>
            <tr><td>04/04 12:40</td><td>Push</td><td>Todos ativos</td><td><Badge type="info">Fila</Badge></td></tr>
            <tr><td>03/04 19:10</td><td>SMS</td><td>Trial</td><td><Badge type="alert">Parcial</Badge></td></tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
