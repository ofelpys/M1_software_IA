export default function OperacaoScreen() {
  return (
    <div className="grid split-6-6">
      <section className="panel">
        <h3>Checklist de operação</h3>
        <ul className="checklist">
          <li><input type="checkbox" checked readOnly /> Cards com barra de criticidade</li>
          <li><input type="checkbox" checked readOnly /> Avatares com presença</li>
          <li><input type="checkbox" checked readOnly /> Tabela compacta com hover</li>
          <li><input type="checkbox" checked readOnly /> Input com erro</li>
          <li><input type="checkbox" checked readOnly /> Sidebar com preview</li>
        </ul>
      </section>
      <section className="panel">
        <h3>Diretrizes aplicadas</h3>
        <p>Layout 12 colunas / gap 8px, base escura sem gradientes coloridos, vermelho como ação primária.</p>
      </section>
    </div>
  );
}
