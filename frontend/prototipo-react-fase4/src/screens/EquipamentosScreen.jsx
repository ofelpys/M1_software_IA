import { useEffect, useState } from 'react';
import Badge from '../components/Badge';
import { criarEquipamentoComFallback, listarEquipamentosComFallback } from '../modules/m06-equipamentos-salas/m06Gateway';

const initialForm = {
  nome: '',
  unidade: 'Centro',
  status: 'Ativo',
  proximaManutencao: '',
};

export default function EquipamentosScreen() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [form, setForm] = useState(initialForm);

  const loadEquipamentos = async () => {
    setLoading(true);
    const result = await listarEquipamentosComFallback();
    setRows(result.rows || []);

    if (result.source === 'api-error') {
      setFeedback({ type: 'error-box', text: result.error || 'Falha ao carregar equipamentos.' });
    } else if (result.source === 'mock') {
      const detail = result.fallbackNotice ? `${result.fallbackNotice} ` : '';
      setFeedback({ type: 'warning-box', text: `${detail}Exibindo dados de contingencia.` });
    }

    setLoading(false);
  };

  useEffect(() => {
    let mounted = true;
    loadEquipamentos().then(() => {
      if (!mounted) {
        return;
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const onChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onCreate = async () => {
    if (!form.nome || !form.unidade || !form.status) {
      setFeedback({ type: 'error-box', text: 'Preencha nome, unidade e status para cadastrar o item.' });
      return;
    }

    const result = await criarEquipamentoComFallback(form);
    if (!result.ok) {
      setFeedback({ type: 'error-box', text: result.error || 'Falha ao cadastrar equipamento.' });
      return;
    }

    if (result.source === 'mock') {
      const detail = result.fallbackNotice ? `${result.fallbackNotice} ` : '';
      setFeedback({ type: 'warning-box', text: `${detail}Item salvo em contingencia local.` });
      setRows((prev) => [result.data, ...prev]);
      setForm(initialForm);
      return;
    }

    setFeedback({ type: 'success-box', text: 'Novo item cadastrado com sucesso. (API real)' });
    setForm(initialForm);
    await loadEquipamentos();
  };

  return (
    <div className="grid split-8-4">
      <section className="panel">
        <h3>Inventário e manutenção</h3>
        {feedback?.text && <div className={`feedback-box ${feedback.type}`}>{feedback.text}</div>}
        <table className="compact-table">
          <thead><tr><th>Equipamento</th><th>Unidade</th><th>Status</th><th>Próx. manutenção</th></tr></thead>
          <tbody>
            {loading && (
              <tr><td colSpan="4">Carregando equipamentos...</td></tr>
            )}
            {!loading && rows.length === 0 && (
              <tr><td colSpan="4">Nenhum equipamento cadastrado.</td></tr>
            )}
            {rows.map((row) => (
              <tr key={`${row.id || 'sem-id'}-${row.nome}-${row.unidade}`}>
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
        <h3>Novo item</h3>
        <form className="form-grid" onSubmit={(e) => e.preventDefault()}>
          <label>
            Nome do equipamento
            <input
              value={form.nome}
              onChange={(e) => onChange('nome', e.target.value)}
              placeholder="Ex.: Remada baixa R2"
            />
          </label>
          <label>
            Unidade
            <select value={form.unidade} onChange={(e) => onChange('unidade', e.target.value)}>
              <option>Centro</option>
              <option>Zona Sul</option>
              <option>Zona Norte</option>
              <option>Leste</option>
              <option>Oeste</option>
            </select>
          </label>
          <label>
            Status
            <select value={form.status} onChange={(e) => onChange('status', e.target.value)}>
              <option>Ativo</option>
              <option>Revisao</option>
              <option>Inativo</option>
            </select>
          </label>
          <label>
            Próx. manutenção
            <input
              value={form.proximaManutencao}
              onChange={(e) => onChange('proximaManutencao', e.target.value)}
              placeholder="Ex.: 18/04"
            />
          </label>
          <button type="button" className="btn-primary" onClick={onCreate}>Cadastrar item</button>
        </form>
      </section>
    </div>
  );
}
