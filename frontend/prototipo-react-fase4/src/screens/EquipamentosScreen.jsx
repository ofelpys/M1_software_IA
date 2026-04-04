import Badge from '../components/Badge';

export default function EquipamentosScreen() {
  return (
    <div className="grid split-8-4">
      <section className="panel">
        <h3>Inventário e manutenção</h3>
        <table className="compact-table">
          <thead><tr><th>Equipamento</th><th>Unidade</th><th>Status</th><th>Próx. manutenção</th></tr></thead>
          <tbody>
            <tr><td>Leg Press 45</td><td>Centro</td><td><Badge type="active">Ativo</Badge></td><td>12/04</td></tr>
            <tr><td>Esteira X900</td><td>Zona Sul</td><td><Badge type="alert">Revisão</Badge></td><td>06/04</td></tr>
            <tr><td>Banco Supino Reto</td><td>Zona Norte</td><td><Badge type="debt">Inativo</Badge></td><td>Em manutenção</td></tr>
          </tbody>
        </table>
      </section>

      <section className="panel">
        <h3>Salas e ocupação</h3>
        <div className="progress-item"><label>Sala Musculação - 88%</label><div className="progress"><span style={{ width: '88%' }}></span></div></div>
        <div className="progress-item"><label>Sala Funcional - 63%</label><div className="progress"><span style={{ width: '63%' }}></span></div></div>
        <div className="progress-item"><label>Estúdio Yoga - 74%</label><div className="progress"><span style={{ width: '74%' }}></span></div></div>
      </section>
    </div>
  );
}
