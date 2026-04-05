import { useEffect, useState } from 'react';
import Badge from '../components/Badge';
import { listarInsumosComFallback } from '../modules/m07-insumos-produtos/m07Gateway';

export default function InsumosScreen() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    let mounted = true;
    listarInsumosComFallback().then((result) => {
      if (mounted) {
        setRows(result.rows);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <div className="grid split-8-4">
        <section className="panel">
          <h3>Estoque e inventario</h3>
          <table className="compact-table">
            <thead><tr><th>Produto</th><th>Categoria</th><th>Estoque</th><th>Status</th></tr></thead>
            <tbody>
              {rows.map((row) => (
                <tr key={`${row.produto}-${row.categoria}`}>
                  <td>{row.produto}</td>
                  <td>{row.categoria}</td>
                  <td>{row.estoque}</td>
                  <td><Badge type={row.status === 'Disponivel' ? 'active' : row.status === 'Baixo' ? 'alert' : 'debt'}>{row.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="panel">
          <h3>Alertas</h3>
          <ul className="checklist">
            <li><input type="checkbox" checked readOnly /> Estoque baixo monitorado</li>
            <li><input type="checkbox" checked readOnly /> Validade proxima (30 dias)</li>
            <li><input type="checkbox" checked readOnly /> Produtos expirados destacados</li>
          </ul>
        </section>
      </div>

      <div className="grid split-8-4">
        <section className="panel">
          <h3>Movimentacao de estoque</h3>
          <table className="compact-table">
            <thead><tr><th>Data</th><th>Produto</th><th>Tipo</th><th>Quantidade</th></tr></thead>
            <tbody>
              <tr><td>05/04</td><td>Whey Protein 1kg</td><td><Badge type="info">Entrada</Badge></td><td>+10</td></tr>
              <tr><td>05/04</td><td>Creatina 250g</td><td><Badge type="alert">Saida</Badge></td><td>-6</td></tr>
              <tr><td>04/04</td><td>Limpador multiuso</td><td><Badge type="debt">Saida</Badge></td><td>-2</td></tr>
            </tbody>
          </table>
        </section>

        <section className="panel">
          <h3>Requisicao de compra</h3>
          <form className="form-grid" onSubmit={(e) => e.preventDefault()}>
            <label>
              Produto
              <input placeholder="Ex: Creatina 250g" />
            </label>
            <label>
              Quantidade
              <input type="number" min="1" defaultValue="10" />
            </label>
            <button className="btn-primary" type="button">Gerar requisicao</button>
          </form>
        </section>
      </div>
    </>
  );
}
