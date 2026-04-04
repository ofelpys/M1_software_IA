import Badge from '../components/Badge';
import MetricCard from '../components/domain/MetricCard';

function AvatarCell({ initials, name, online }) {
  return (
    <div className="avatar-cell">
      <span className="avatar">{initials}</span>
      <span className={`presence ${online ? 'online' : 'offline'}`}></span>
      <span>{name}</span>
    </div>
  );
}

export default function DashboardScreen() {
  return (
    <>
      <div className="grid metrics-grid">
        <MetricCard tone="critical" label="Inadimplência" value="14,2%" badgeType="alert" badgeText="Alerta" />
        <MetricCard tone="ok" label="Alunos ativos" value="1.872" badgeType="success" badgeText="Ativo" />
        <MetricCard tone="info" label="Receita do mês" value="R$ 486.900" badgeType="info" badgeText="Consolidado" />
        <MetricCard tone="warning" label="Planos trial" value="54" badgeType="trial" badgeText="Trial" />
      </div>

      <div className="grid split-8-4">
        <section className="panel">
          <div className="panel-head">
            <h3>Alunos e status</h3>
            <input type="search" placeholder="Buscar CPF ou nome" />
          </div>
          <table className="compact-table">
            <thead><tr><th>Aluno</th><th>Plano</th><th>Status</th><th>Presença</th></tr></thead>
            <tbody>
              <tr><td><AvatarCell initials="AM" name="Ana Martins" online={true} /></td><td>Premium</td><td><Badge type="premium">Premium</Badge></td><td>95%</td></tr>
              <tr><td><AvatarCell initials="RS" name="Rafael Silva" online={false} /></td><td>Mensal</td><td><Badge type="debt">Inadimplente</Badge></td><td>61%</td></tr>
              <tr><td><AvatarCell initials="LP" name="Larissa Pinto" online={true} /></td><td>Plano anual</td><td><Badge type="active">Ativo</Badge></td><td>88%</td></tr>
            </tbody>
          </table>
        </section>

        <section className="panel">
          <h3>Ocupação por unidade</h3>
          <div className="progress-item"><label>Centro - 82%</label><div className="progress"><span style={{ width: '82%' }}></span></div></div>
          <div className="progress-item"><label>Zona Sul - 69%</label><div className="progress"><span style={{ width: '69%' }}></span></div></div>
          <div className="progress-item"><label>Zona Norte - 57%</label><div className="progress"><span style={{ width: '57%' }}></span></div></div>
        </section>
      </div>
    </>
  );
}
