import { useEffect, useState } from 'react';
import Badge from '../components/Badge';
import { listarProfessoresComFallback } from '../modules/m05-professores/m05Gateway';

export default function ProfessoresScreen() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    let mounted = true;
    listarProfessoresComFallback().then((result) => {
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
        <div className="panel-head"><h3>Equipe de professores</h3><input type="search" placeholder="Buscar professor" /></div>
        <table className="compact-table">
          <thead><tr><th>Professor</th><th>Especialidade</th><th>Status</th><th>Comissão</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.nome}-${row.especialidade}`}>
                <td>{row.nome}</td>
                <td>{row.especialidade}</td>
                <td><Badge type="active">{row.status}</Badge></td>
                <td>R$ {Number(row.comissao).toLocaleString('pt-BR')}</td>
              </tr>
            ))}
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
