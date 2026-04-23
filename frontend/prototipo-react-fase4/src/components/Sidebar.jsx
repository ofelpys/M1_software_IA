const items = [
  { key: 'dashboard', label: 'Painel', icon: '[DB]' },
  { key: 'recepcao', label: 'Recepção', icon: '[RCP]' },
  { key: 'cadastro', label: 'Cadastro', icon: '[CAD]' },
  { key: 'financeiro', label: 'Financeiro', icon: '[FIN]' },
  { key: 'equipamentos', label: 'Equipamentos', icon: '[EQP]' },
  { key: 'relatorios', label: 'Relatórios [Estático]', icon: '[REL]' },
  { key: 'avaliacao', label: 'Avaliação [Estático]', icon: '[AVL]' },
  { key: 'professores', label: 'Professores [Estático]', icon: '[PRF]' },
  { key: 'insumos', label: 'Insumos [Estático]', icon: '[INS]' },
  { key: 'comunicacao', label: 'Comunicação [Estático]', icon: '[COM]' },
  { key: 'operacao', label: 'Operação [Estático]', icon: '[OPS]' },
];

export default function Sidebar({ active, onChange }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">FT</span>
        <div>
          <h1>Força Total</h1>
          <p>Sistema Operacional</p>
        </div>
      </div>

      <nav className="menu">
        {items.map((item) => (
          <button
            key={item.key}
            className={`menu-item ${active === item.key ? 'is-active' : ''}`}
            onClick={() => onChange(item.key)}
          >
            <span className="menu-icon">{item.icon}</span> {item.label}
          </button>
        ))}
      </nav>

      <section className="preview-card">
        <h2>Preview de KPI</h2>
        <div className="mini-chart" aria-hidden="true">
          <span style={{ height: '32%' }}></span>
          <span style={{ height: '56%' }}></span>
          <span style={{ height: '44%' }}></span>
          <span style={{ height: '74%' }}></span>
          <span style={{ height: '68%' }}></span>
          <span style={{ height: '82%' }}></span>
          <span style={{ height: '59%' }}></span>
        </div>
      </section>
    </aside>
  );
}
