import { useState } from 'react';
import { salvarAlunoComFallback } from './m01Gateway';
import { formatCpf, isCpfComplete } from '../../utils/cpf';

const initial = {
  nome: '',
  cpf: '',
  email: '',
  plano: 'Mensal',
};

export default function CadastroForm() {
  const [form, setForm] = useState(initial);
  const [feedback, setFeedback] = useState(null);

  const onChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const onSave = async () => {
    if (!isCpfComplete(form.cpf)) {
      setFeedback({ type: 'error-box', text: 'CPF deve conter 11 dígitos.' });
      return;
    }

    const payload = {
      ...form,
      cpf: formatCpf(form.cpf),
    };

    const result = await salvarAlunoComFallback(payload);
    if (!result.ok) {
      setFeedback({ type: 'error-box', text: result.error });
      return;
    }
    if (result.source === 'mock') {
      const detail = result.fallbackNotice ? `${result.fallbackNotice} ` : '';
      setFeedback({
        type: 'success-box',
        text: `${detail}Cadastro executado em modo simulado (sem persistência no backend).`,
      });
      setForm(initial);
      return;
    }

    setFeedback({ type: 'success-box', text: `Cadastro salvo com sucesso. ID ${result.id}. (API real)` });
    setForm(initial);
  };

  return (
    <>
      <h3>Novo aluno (M01 - Cadastro/Acesso)</h3>
      <form className="form-grid" onSubmit={(e) => e.preventDefault()}>
        <label>
          Nome
          <input value={form.nome} onChange={(e) => onChange('nome', e.target.value)} placeholder="Nome completo" />
        </label>
        <label>
          CPF
          <input
            className={feedback?.type === 'error-box' ? 'input-error' : ''}
            value={form.cpf}
            onChange={(e) => onChange('cpf', formatCpf(e.target.value))}
            placeholder="000.000.000-00"
            inputMode="numeric"
            maxLength={14}
          />
        </label>
        <label>
          Email
          <input type="email" value={form.email} onChange={(e) => onChange('email', e.target.value)} placeholder="nome@exemplo.com" />
        </label>
        <label>
          Plano
          <select value={form.plano} onChange={(e) => onChange('plano', e.target.value)}>
            <option>Mensal</option>
            <option>Anual</option>
            <option>Premium</option>
          </select>
        </label>
        <button className="btn-primary" type="button" onClick={onSave}>
          Salvar cadastro
        </button>
      </form>
      {feedback && <div className={`feedback-box ${feedback.type}`}>{feedback.text}</div>}
    </>
  );
}
