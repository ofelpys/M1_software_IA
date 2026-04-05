import { useEffect, useState } from 'react';
import Badge from '../components/Badge';
import { listarEquipamentosComFallback } from '../modules/m06-equipamentos-salas/m06Gateway';

export default function EquipamentosScreen() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    let mounted = true;
    listarEquipamentosComFallback().then((result) => {
      if (mounted) {
        setRows(result.rows);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="grid split-8-4">
      <section className="panel">
        <h3>Inventário e manutenção</h3>
        <table className="compact-table">
          <thead><tr><th>Equipamento</th><th>Unidade</th><th>Status</th><th>Próx. manutenção</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.nome}-${row.unidade}`}>
                <td>{row.nome}</td>
                <td>{row.unidade}</td>
                <td><Badge type={row.status === 'Ativo' ? 'active' : row.status === 'Revisao' ? 'alert' : 'debt'}>{row.status}</Badge></td>
                <td>{row.proximaManutencao || '-'}</td>
              </tr>
            ))}
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
