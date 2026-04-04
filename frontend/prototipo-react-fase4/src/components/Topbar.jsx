export default function Topbar({ title, actionLabel, health, onRefreshHealth }) {
  const statusClass = health?.status === 'online' ? 'online' : health?.status === 'checking' ? 'checking' : 'offline';

  return (
    <header className="topbar">
      <div>
        <p className="kicker">Industrial / Iron</p>
        <h2>{title}</h2>
      </div>

      <div className="topbar-right">
        <div className={`api-health ${statusClass}`} title={health?.message || 'Status da API'}>
          <span className="dot" aria-hidden="true"></span>
          <span>{health?.message || 'Verificando API...'}</span>
          <button type="button" className="btn-health-refresh" onClick={onRefreshHealth}>
            Atualizar
          </button>
        </div>

        <button className="btn-primary" title="Ação contextual desta tela (em construção)">
          {actionLabel}
        </button>
      </div>
    </header>
  );
}
