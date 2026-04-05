import { useEffect, useState } from 'react';
import Badge from '../components/Badge';
import { listarKpisComFallback } from '../modules/m03-relatorios-dashboards/m03Gateway';

export default function RelatoriosScreen() {
  const [kpis, setKpis] = useState({
    alunosCadastrados: 0,
    checkinsLiberados: 0,
    checkinsNegados: 0,
    desbloqueiosRegistrados: 0,
    comunicacoesProcessadas: 0,
  });

  useEffect(() => {
    let mounted = true;
    listarKpisComFallback().then((result) => {
      if (mounted) {
        setKpis(result.data);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <div className="grid metrics-grid">
        <article className="metric-card info">
          <span className="metric-top" />
          <p>Alunos cadastrados</p>
          <strong>{kpis.alunosCadastrados}</strong>
        </article>
        <article className="metric-card ok">
          <span className="metric-top" />
          <p>Check-ins liberados</p>
          <strong>{kpis.checkinsLiberados}</strong>
        </article>
        <article className="metric-card warning">
          <span className="metric-top" />
          <p>Desbloqueios</p>
          <strong>{kpis.desbloqueiosRegistrados}</strong>
        </article>
        <article className="metric-card critical">
          <span className="metric-top" />
          <p>Comunicacoes processadas</p>
          <strong>{kpis.comunicacoesProcessadas}</strong>
        </article>
      </div>

      <div className="grid split-8-4">
        <section className="panel">
          <h3>Relatorios gerenciais</h3>
          <table className="compact-table">
            <thead><tr><th>Relatorio</th><th>Periodo</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td>Frequencia por unidade</td><td>Abr/2026</td><td><Badge type="success">Pronto</Badge></td></tr>
              <tr><td>Inadimplencia consolidada</td><td>Abr/2026</td><td><Badge type="alert">Atualizando</Badge></td></tr>
              <tr><td>Comissao por professor</td><td>Abr/2026</td><td><Badge type="success">Pronto</Badge></td></tr>
              <tr><td>Receita por plano</td><td>Abr/2026</td><td><Badge type="info">Em fila</Badge></td></tr>
            </tbody>
          </table>
        </section>

        <section className="panel">
          <h3>Exportacao</h3>
          <button className="btn-primary" type="button">Exportar PDF</button>
          <button className="btn-ghost" type="button">Exportar Excel</button>
          <button className="btn-ghost" type="button">Exportar CSV</button>
        </section>
      </div>
    </>
  );
}
