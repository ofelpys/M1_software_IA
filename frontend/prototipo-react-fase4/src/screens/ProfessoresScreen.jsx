import Badge from '../components/Badge';

export default function ProfessoresScreen() {
  return (
    <div className="grid split-8-4">
      <section className="panel">
        <div className="panel-head"><h3>Equipe de professores</h3><input type="search" placeholder="Buscar professor" /></div>
        <table className="compact-table">
          <thead><tr><th>Professor</th><th>Especialidade</th><th>Status</th><th>Comissão</th></tr></thead>
          <tbody>
            <tr><td>João Gomes</td><td>Musculação</td><td><Badge type="active">Ativo</Badge></td><td>R$ 3.420</td></tr>
            <tr><td>Carla Souza</td><td>Pilates</td><td><Badge type="premium">Plano</Badge></td><td>R$ 2.980</td></tr>
            <tr><td>Marcos Ferreira</td><td>Funcional</td><td><Badge type="trial">Trial</Badge></td><td>R$ 1.210</td></tr>
          </tbody>
        </table>
      </section>
      <section className="panel">
        <h3>Performance do mês</h3>
        <div className="progress-item"><label>Retenção média - 78%</label><div className="progress"><span style={{ width: '78%' }}></span></div></div>
        <div className="progress-item"><label>Aulas realizadas - 91%</label><div className="progress"><span style={{ width: '91%' }}></span></div></div>
        <div className="progress-item"><label>Satisfação alunos - 84%</label><div className="progress"><span style={{ width: '84%' }}></span></div></div>
      </section>
    </div>
  );
}
