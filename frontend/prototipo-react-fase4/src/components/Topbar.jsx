const unidades = ['Todas', 'Centro', 'Zona Sul', 'Zona Norte', 'Leste', 'Oeste'];

export default function Topbar({
  title,
  actionLabel,
  health,
  onRefreshHealth,
  apiBaseUrl,
  active,
  selectedUnidade,
  onSelectUnidade,
}) {
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
          {apiBaseUrl ? <span>Base: {apiBaseUrl}</span> : null}
          <button type="button" className="btn-health-refresh" onClick={onRefreshHealth}>
            Atualizar
          </button>
        </div>

        {active === 'dashboard' ? (
          <label className="topbar-unit-select" title="Selecionar unidade da Força Total">
            <span>Selecionar unidade</span>
            <select value={selectedUnidade} onChange={(e) => onSelectUnidade(e.target.value)}>
              {unidades.map((unidade) => (
                <option key={unidade} value={unidade}>{unidade}</option>
              ))}
            </select>
          </label>
        ) : (
          <button className="btn-primary" title="Ação contextual desta tela (em construção)">
            {actionLabel}
          </button>
        )}
      </div>
    </header>
  );
}
