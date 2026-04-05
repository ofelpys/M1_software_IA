import { useEffect, useMemo, useState } from 'react';
import Badge from '../components/Badge';
import MetricCard from '../components/domain/MetricCard';
import { listarAlunos } from '../modules/m01-cadastro-acesso/m01Gateway';

function AvatarCell({ initials, name, online }) {
  return (
    <div className="avatar-cell">
      <span className="avatar">{initials}</span>
      <span className={`presence ${online ? 'online' : 'offline'}`}></span>
      <span>{name}</span>
    </div>
  );
}

const fallbackRows = [
  { id: 1, nome: 'Ana Martins', plano: 'Premium', status: 'Premium', presenca: '95%', unidade: 'Centro' },
  { id: 2, nome: 'Rafael Silva', plano: 'Mensal', status: 'Inadimplente', presenca: '61%', unidade: 'Zona Sul' },
  { id: 3, nome: 'Larissa Pinto', plano: 'Plano anual', status: 'Ativo', presenca: '88%', unidade: 'Leste' },
];

function mapStatus(plano, ativo) {
  if (ativo === false) {
    return 'Inadimplente';
  }
  if (String(plano || '').toLowerCase() === 'premium') {
    return 'Premium';
  }
  return 'Ativo';
}

export default function DashboardScreen({ selectedUnidade = 'Todas' }) {
  const [rows, setRows] = useState(fallbackRows);

  useEffect(() => {
    let mounted = true;

    listarAlunos()
      .then((data) => {
        if (!mounted || !Array.isArray(data) || data.length === 0) {
          return;
        }

        const mapped = data.map((item) => {
          const aluno = item?.aluno || {};
          const nome = String(aluno?.nome || 'Aluno').trim();
          const initials = nome
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0].toUpperCase())
            .join('') || 'AL';

          return {
            id: item?.id,
            nome,
            initials,
            plano: aluno?.plano || 'Mensal',
            status: mapStatus(aluno?.plano, aluno?.ativo),
            presenca: aluno?.ativo === false ? '0%' : '80%',
            unidade: aluno?.unidade || 'Centro',
            online: aluno?.ativo !== false,
          };
        });

        setRows(mapped);
      })
      .catch(() => {
        if (mounted) {
          setRows(fallbackRows);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const unidadesDisponiveis = useMemo(() => {
    const values = Array.from(new Set(rows.map((row) => row.unidade).filter(Boolean)));
    return values;
  }, [rows]);

  const rowsFiltradas = useMemo(() => {
    if (selectedUnidade === 'Todas') {
      return rows;
    }
    return rows.filter((row) => row.unidade === selectedUnidade);
  }, [rows, selectedUnidade]);

  const alunosAtivos = rowsFiltradas.filter((row) => row.status !== 'Inadimplente').length;
  const planosTrial = rowsFiltradas.filter((row) => String(row.plano).toLowerCase().includes('trial')).length;

  return (
    <>
      <div className="grid metrics-grid">
        <MetricCard tone="critical" label="Inadimplência" value="14,2%" badgeType="alert" badgeText="Alerta" />
        <MetricCard tone="ok" label="Alunos ativos" value={String(alunosAtivos)} badgeType="success" badgeText="Ativo" />
        <MetricCard tone="info" label="Receita do mês" value="R$ 486.900" badgeType="info" badgeText="Consolidado" />
        <MetricCard tone="warning" label="Planos trial" value={String(planosTrial)} badgeType="trial" badgeText="Trial" />
      </div>

      <div className="panel unit-panel">
        <h3>Unidade da Força Total</h3>
        <div className="badge-row">
          {unidadesDisponiveis.map((unidade) => (
            <Badge key={unidade} type={selectedUnidade === unidade ? 'active' : 'info'}>{unidade}</Badge>
          ))}
          <Badge type="plan">Selecionada: {selectedUnidade}</Badge>
        </div>
      </div>

      <div className="grid split-8-4">
        <section className="panel">
          <div className="panel-head">
            <h3>Alunos e status por unidade</h3>
            <input type="search" placeholder="Buscar CPF ou nome" />
          </div>
          <table className="compact-table">
            <thead><tr><th>Aluno</th><th>Unidade</th><th>Plano</th><th>Status</th><th>Presença</th></tr></thead>
            <tbody>
              {rowsFiltradas.length === 0 && (
                <tr><td colSpan="5">Nenhum aluno cadastrado para a unidade selecionada.</td></tr>
              )}
              {rowsFiltradas.map((row) => {
                const badgeType = row.status === 'Premium' ? 'premium' : row.status === 'Inadimplente' ? 'debt' : 'active';
                return (
                  <tr key={row.id || `${row.nome}-${row.unidade}`}>
                    <td><AvatarCell initials={row.initials || 'AL'} name={row.nome} online={row.online !== false} /></td>
                    <td>{row.unidade}</td>
                    <td>{row.plano}</td>
                    <td><Badge type={badgeType}>{row.status}</Badge></td>
                    <td>{row.presenca}</td>
                  </tr>
                );
              })}
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
