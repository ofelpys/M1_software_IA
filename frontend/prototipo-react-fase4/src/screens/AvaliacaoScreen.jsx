import { useEffect, useState } from 'react';
import Badge from '../components/Badge';
import { listarAvaliacoesComFallback } from '../modules/m04-avaliacao-evolucao/m04Gateway';

export default function AvaliacaoScreen() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    let mounted = true;
    listarAvaliacoesComFallback().then((result) => {
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
          <h3>Avaliacoes fisicas</h3>
          <table className="compact-table">
            <thead><tr><th>Aluno</th><th>Teste</th><th>Evolucao</th><th>Status</th></tr></thead>
            <tbody>
              {rows.map((row) => (
                <tr key={`${row.aluno}-${row.teste}`}>
                  <td>{row.aluno}</td>
                  <td>{row.teste}</td>
                  <td>{row.evolucao}</td>
                  <td><Badge type={row.status === 'Meta' ? 'success' : 'info'}>{row.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="panel">
          <h3>Indicadores</h3>
          <div className="progress-item"><label>Avaliacoes concluidas - 76%</label><div className="progress"><span style={{ width: '76%' }} /></div></div>
          <div className="progress-item"><label>Alunos com meta ativa - 64%</label><div className="progress"><span style={{ width: '64%' }} /></div></div>
          <div className="progress-item"><label>Certificados emitidos - 22%</label><div className="progress"><span style={{ width: '22%' }} /></div></div>
        </section>
      </div>

      <div className="grid split-8-4">
        <section className="panel">
          <h3>Plano de evolucao</h3>
          <form className="form-grid" onSubmit={(e) => e.preventDefault()}>
            <label>
              Aluno
              <input placeholder="Buscar por nome ou CPF" />
            </label>
            <label>
              Meta principal
              <input placeholder="Ex: reduzir gordura corporal em 5%" />
            </label>
            <button className="btn-primary" type="button">Salvar meta</button>
          </form>
        </section>

        <section className="panel">
          <h3>Alertas</h3>
          <ul className="checklist">
            <li><input type="checkbox" checked readOnly /> Reavaliacao pendente em 7 dias</li>
            <li><input type="checkbox" checked readOnly /> Aluno sem progresso nos ultimos 30 dias</li>
            <li><input type="checkbox" checked readOnly /> Certificado pronto para emissao</li>
          </ul>
        </section>
      </div>
    </>
  );
}
