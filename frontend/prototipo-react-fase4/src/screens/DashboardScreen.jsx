import { useEffect, useMemo, useState } from 'react';
import Badge from '../components/Badge';
import MetricCard from '../components/domain/MetricCard';
import { atualizarAlunoComFallback, atualizarStatusAlunoComFallback, listarAlunos } from '../modules/m01-cadastro-acesso/m01Gateway';
import { formatCpf, isCpfComplete } from '../utils/cpf';
import { formatCurrencyBRL, getPlanoValor } from '../utils/planos';

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
  {
    id: 1,
    nome: 'Ana Martins',
    cpf: '000.000.000-01',
    email: 'ana@exemplo.com',
    telefone: '(11) 99999-0001',
    dataNascimento: '1996-02-14',
    endereco: 'Rua A, 123 - Centro',
    objetivo: 'Hipertrofia',
    contatoEmergencia: 'Maria - (11) 90000-0001',
    plano: 'Premium',
    status: 'Ativo',
    presenca: '95%',
    unidade: 'Centro',
  },
  {
    id: 2,
    nome: 'Rafael Silva',
    cpf: '000.000.000-02',
    email: 'rafael@exemplo.com',
    telefone: '(11) 99999-0002',
    dataNascimento: '1991-07-08',
    endereco: 'Av. B, 78 - Zona Sul',
    objetivo: 'Condicionamento',
    contatoEmergencia: 'Paulo - (11) 90000-0002',
    plano: 'Mensal',
    status: 'Inadimplente',
    presenca: '61%',
    unidade: 'Zona Sul',
  },
  {
    id: 3,
    nome: 'Larissa Pinto',
    cpf: '000.000.000-03',
    email: 'larissa@exemplo.com',
    telefone: '(11) 99999-0003',
    dataNascimento: '1999-11-28',
    endereco: 'Rua C, 456 - Leste',
    objetivo: 'Emagrecimento',
    contatoEmergencia: 'Joao - (11) 90000-0003',
    plano: 'Anual',
    status: 'Ativo',
    presenca: '88%',
    unidade: 'Leste',
  },
];

const STATUS_OPTIONS = ['Ativo', 'Inadimplente', 'Bloqueado'];

function mapStatus(status) {
  const value = String(status || '').trim();
  if (value === 'Inadimplente' || value === 'Bloqueado') {
    return value;
  }
  return 'Ativo';
}

function formatPhoneBR(value) {
  const digits = String(value || '').replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export default function DashboardScreen({ selectedUnidade = 'Todas' }) {
  const [rows, setRows] = useState(fallbackRows);
  const [search, setSearch] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [savingStatusId, setSavingStatusId] = useState(null);
  const [detailAlunoId, setDetailAlunoId] = useState(null);
  const [detailForm, setDetailForm] = useState(null);
  const [savingDetail, setSavingDetail] = useState(false);

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
          const status = mapStatus(aluno?.status);

          return {
            id: item?.id,
            nome,
            cpf: aluno?.cpf || '',
            email: aluno?.email || '',
            telefone: aluno?.telefone || '',
            dataNascimento: aluno?.dataNascimento || '',
            endereco: aluno?.endereco || '',
            objetivo: aluno?.objetivo || '',
            contatoEmergencia: aluno?.contatoEmergencia || '',
            initials,
            plano: aluno?.plano || 'Mensal',
            status,
            presenca: status === 'Inadimplente' || status === 'Bloqueado' ? '0%' : '80%',
            unidade: aluno?.unidade || 'Centro',
            online: status !== 'Inadimplente' && status !== 'Bloqueado',
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

  const updateRowStatus = (currentRows, targetId, nextStatus) => currentRows.map((row) => {
    if (row.id !== targetId) {
      return row;
    }

    const normalizedStatus = mapStatus(nextStatus);
    return {
      ...row,
      status: normalizedStatus,
      online: normalizedStatus === 'Ativo',
      presenca: normalizedStatus === 'Inadimplente' || normalizedStatus === 'Bloqueado' ? '0%' : '80%',
    };
  });

  const handleStatusChange = async (row, nextStatus) => {
    if (!row?.id) {
      return;
    }

    setSavingStatusId(row.id);
    setFeedback(null);
    const result = await atualizarStatusAlunoComFallback(row.id, row, nextStatus);
    setSavingStatusId(null);

    if (!result.ok) {
      setFeedback({ type: 'error-box', text: result.error || 'Falha ao atualizar status no backend.' });
      return;
    }

    setRows((prev) => updateRowStatus(prev, row.id, nextStatus));
    if (detailAlunoId === row.id && detailForm) {
      setDetailForm((prev) => ({ ...prev, status: nextStatus }));
    }
    setFeedback({ type: 'success-box', text: `Status de ${row.nome} atualizado para ${nextStatus}.` });
  };

  const openAlunoDetail = (row) => {
    setDetailAlunoId(row.id);
    setDetailForm({
      nome: row.nome || '',
      cpf: formatCpf(row.cpf || ''),
      email: row.email || '',
      telefone: formatPhoneBR(row.telefone || ''),
      dataNascimento: row.dataNascimento || '',
      endereco: row.endereco || '',
      objetivo: row.objetivo || '',
      contatoEmergencia: row.contatoEmergencia || '',
      plano: row.plano || 'Mensal',
      unidade: row.unidade || 'Centro',
      status: mapStatus(row.status),
    });
    setFeedback(null);
  };

  const closeAlunoDetail = () => {
    setDetailAlunoId(null);
    setDetailForm(null);
  };

  const handleDetailChange = (key, value) => {
    if (key === 'cpf') {
      setDetailForm((prev) => ({ ...prev, cpf: formatCpf(value) }));
      return;
    }

    if (key === 'telefone') {
      setDetailForm((prev) => ({ ...prev, telefone: formatPhoneBR(value) }));
      return;
    }

    setDetailForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveDetail = async () => {
    if (!detailAlunoId || !detailForm) {
      return;
    }

    if (!isCpfComplete(detailForm.cpf)) {
      setFeedback({ type: 'error-box', text: 'CPF invalido. Informe os 11 digitos para salvar.' });
      return;
    }

    setSavingDetail(true);
    const result = await atualizarAlunoComFallback(detailAlunoId, detailForm);
    setSavingDetail(false);

    if (!result.ok) {
      setFeedback({ type: 'error-box', text: result.error || 'Falha ao persistir alteração do aluno.' });
      return;
    }

    setRows((prev) => prev.map((row) => {
      if (row.id !== detailAlunoId) {
        return row;
      }
      const normalizedStatus = mapStatus(detailForm.status);
      const nome = String(detailForm.nome || 'Aluno').trim() || 'Aluno';
      const initials = nome
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('') || 'AL';

      return {
        ...row,
        ...detailForm,
        nome,
        initials,
        status: normalizedStatus,
        online: normalizedStatus === 'Ativo',
        presenca: normalizedStatus === 'Inadimplente' || normalizedStatus === 'Bloqueado' ? '0%' : '80%',
      };
    }));

    setFeedback({ type: 'success-box', text: `Dados de ${detailForm.nome || 'aluno'} alterados com sucesso.` });
  };

  const hasCpfError = detailForm?.cpf && !isCpfComplete(detailForm.cpf);

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

  const rowsBuscadas = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return rowsFiltradas;
    }
    return rowsFiltradas.filter((row) => {
      const nome = String(row.nome || '').toLowerCase();
      const cpf = String(row.cpf || '').toLowerCase();
      return nome.includes(query) || cpf.includes(query);
    });
  }, [rowsFiltradas, search]);

  const alunosAtivos = rowsFiltradas.filter((row) => row.status === 'Ativo').length;
  const inadimplentes = rowsFiltradas.filter((row) => row.status === 'Inadimplente' || row.status === 'Bloqueado');
  const taxaInadimplencia = rowsFiltradas.length === 0
    ? 0
    : (inadimplentes.length / rowsFiltradas.length) * 100;

  const receitaMes = rowsFiltradas
    .filter((row) => row.status === 'Ativo')
    .reduce((sum, row) => sum + getPlanoValor(row.plano), 0);

  const inadimplenciaValor = inadimplentes.reduce((sum, row) => sum + getPlanoValor(row.plano), 0);

  const porUnidade = useMemo(() => {
    const bucket = new Map();
    rows.forEach((row) => {
      const key = row.unidade || 'Sem unidade';
      if (!bucket.has(key)) {
        bucket.set(key, { unidade: key, receita: 0, inadimplentes: 0, inadimplenciaValor: 0 });
      }
      const item = bucket.get(key);
      if (row.status === 'Ativo') {
        item.receita += getPlanoValor(row.plano);
      }
      if (row.status === 'Inadimplente' || row.status === 'Bloqueado') {
        item.inadimplentes += 1;
        item.inadimplenciaValor += getPlanoValor(row.plano);
      }
    });

    const values = Array.from(bucket.values());
    if (selectedUnidade === 'Todas') {
      return values;
    }
    return values.filter((item) => item.unidade === selectedUnidade);
  }, [rows, selectedUnidade]);

  return (
    <>
      <div className="grid metrics-grid">
        <MetricCard tone="critical" label="Inadimplência" value={`${taxaInadimplencia.toFixed(1)}%`} badgeType="alert" badgeText={`${inadimplentes.length} aluno(s)`} />
        <MetricCard tone="ok" label="Alunos ativos" value={String(alunosAtivos)} badgeType="success" badgeText="Ativo" />
        <MetricCard tone="info" label="Receita do mês" value={formatCurrencyBRL(receitaMes)} badgeType="info" badgeText={selectedUnidade} />
        <MetricCard tone="warning" label="Valor em atraso" value={formatCurrencyBRL(inadimplenciaValor)} badgeType="debt" badgeText="Financeiro" />
      </div>

      <div className="grid split-8-4">
        <section className="panel">
          <div className="panel-head">
            <h3>Alunos e status por unidade</h3>
            <input
              type="search"
              placeholder="Buscar CPF ou nome"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {feedback?.text && <div className={`feedback-box ${feedback.type}`}>{feedback.text}</div>}
          <table className="compact-table">
            <thead><tr><th>Aluno</th><th>CPF</th><th>Unidade</th><th>Plano</th><th>Status</th><th>Presença</th></tr></thead>
            <tbody>
              {rowsBuscadas.length === 0 && (
                <tr><td colSpan="6">Nenhum aluno encontrado para os filtros aplicados.</td></tr>
              )}
              {rowsBuscadas.map((row) => {
                return (
                  <tr key={row.id || `${row.nome}-${row.unidade}`}>
                    <td>
                      <div className="aluno-cell">
                        <AvatarCell initials={row.initials || 'AL'} name={row.nome} online={row.online !== false} />
                        <button type="button" className="btn-ghost btn-xs" onClick={() => openAlunoDetail(row)}>Ver +</button>
                      </div>
                    </td>
                    <td>{row.cpf || '-'}</td>
                    <td>{row.unidade}</td>
                    <td>{row.plano}</td>
                    <td>
                      <div className="status-editor-cell">
                        <select
                          value={row.status}
                          onChange={(e) => handleStatusChange(row, e.target.value)}
                          disabled={savingStatusId === row.id}
                        >
                          {STATUS_OPTIONS.map((statusOption) => (
                            <option key={statusOption} value={statusOption}>{statusOption}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td>{row.presenca}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section className="panel">
          <h3>Receita e inadimplência por unidade</h3>
          <table className="compact-table">
            <thead><tr><th>Unidade</th><th>Receita</th><th>Inadimplentes</th><th>Em atraso</th></tr></thead>
            <tbody>
              {porUnidade.length === 0 && (
                <tr><td colSpan="4">Sem dados para a unidade selecionada.</td></tr>
              )}
              {porUnidade.map((item) => (
                <tr key={item.unidade}>
                  <td>{item.unidade}</td>
                  <td>{formatCurrencyBRL(item.receita)}</td>
                  <td>{item.inadimplentes}</td>
                  <td>{formatCurrencyBRL(item.inadimplenciaValor)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="badge-row" style={{ marginTop: 12 }}>
            {unidadesDisponiveis.map((unidade) => (
              <Badge key={unidade} type={selectedUnidade === unidade ? 'active' : 'info'}>{unidade}</Badge>
            ))}
            <Badge type="plan">Selecionada: {selectedUnidade}</Badge>
          </div>
        </section>
      </div>

      {detailAlunoId && detailForm && (
        <div className="modal-overlay" onClick={closeAlunoDetail} role="presentation">
          <section className="detail-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Detalhes completos do aluno">
            <div className="detail-card-head">
              <h3>Detalhes completos do aluno</h3>
            </div>

            <div className="detail-grid">
              <label>
                Nome
                <input value={detailForm.nome} onChange={(e) => handleDetailChange('nome', e.target.value)} />
              </label>
              <label>
                CPF
                <input
                  className={hasCpfError ? 'input-error' : ''}
                  value={detailForm.cpf}
                  onChange={(e) => handleDetailChange('cpf', e.target.value)}
                />
                {hasCpfError && <small>CPF deve conter 11 digitos.</small>}
              </label>
              <label>
                Email
                <input value={detailForm.email} onChange={(e) => handleDetailChange('email', e.target.value)} />
              </label>
              <label>
                Telefone
                <input value={detailForm.telefone} onChange={(e) => handleDetailChange('telefone', e.target.value)} />
              </label>
              <label>
                Data de nascimento
                <input type="date" value={detailForm.dataNascimento} onChange={(e) => handleDetailChange('dataNascimento', e.target.value)} />
              </label>
              <label>
                Contato de emergência
                <input value={detailForm.contatoEmergencia} onChange={(e) => handleDetailChange('contatoEmergencia', e.target.value)} />
              </label>
              <label>
                Endereço
                <input value={detailForm.endereco} onChange={(e) => handleDetailChange('endereco', e.target.value)} />
              </label>
              <label>
                Objetivo
                <input value={detailForm.objetivo} onChange={(e) => handleDetailChange('objetivo', e.target.value)} />
              </label>
              <label>
                Plano
                <select value={detailForm.plano} onChange={(e) => handleDetailChange('plano', e.target.value)}>
                  <option value="Mensal">Mensal - R$ 150,00</option>
                  <option value="Anual">Anual - R$ 120,00</option>
                  <option value="Premium">Premium - R$ 100,00</option>
                </select>
              </label>
              <label>
                Unidade
                <select value={detailForm.unidade} onChange={(e) => handleDetailChange('unidade', e.target.value)}>
                  <option>Centro</option>
                  <option>Zona Sul</option>
                  <option>Zona Norte</option>
                  <option>Leste</option>
                  <option>Oeste</option>
                </select>
              </label>
            </div>

            <div className="detail-actions">
              <button type="button" className="btn-ghost" onClick={closeAlunoDetail}>Sair</button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleSaveDetail}
                disabled={savingDetail || hasCpfError}
              >
                {savingDetail ? 'Salvando...' : 'Alterar'}
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
