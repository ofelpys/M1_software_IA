import { useState } from 'react';
import { checkinComFallback } from '../../modules/m01-cadastro-acesso/m01Gateway';
import { formatCpf, isCpfComplete } from '../../utils/cpf';

export default function CheckinPanel() {
  const [cpf, setCpf] = useState('');
  const [status, setStatus] = useState('ativo');
  const [feedback, setFeedback] = useState(null);

  const runCheckin = async () => {
    if (!isCpfComplete(cpf)) {
      setFeedback({ type: 'error-box', text: 'CPF deve conter 11 dígitos.' });
      return;
    }

    const result = await checkinComFallback({ cpf, status });
    if (result.source === 'mock') {
      const detail = result.fallbackNotice ? `${result.fallbackNotice} ` : '';
      const simulatedText = result.type === 'success-box'
        ? 'Operação executada em modo simulado (sem persistência no backend).'
        : 'Validação executada em modo simulado (sem persistência no backend).';
      setFeedback({ ...result, text: `${detail}${simulatedText}` });
      return;
    }

    setFeedback({ ...result, text: `${result.text} (API real)` });
  };

  return (
    <>
      <h3>Check-in rápido (3 cliques)</h3>
      <form className="form-grid" onSubmit={(e) => e.preventDefault()}>
        <label>
          CPF do aluno
          <input
            value={cpf}
            onChange={(e) => setCpf(formatCpf(e.target.value))}
            placeholder="000.000.000-00"
            inputMode="numeric"
            maxLength={14}
          />
        </label>
        <label>
          Status simulado
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="ativo">Ativo</option>
            <option value="inadimplente">Inadimplente</option>
            <option value="bloqueado">Bloqueado</option>
          </select>
        </label>
        <button className="btn-primary" type="button" onClick={runCheckin}>
          Validar e registrar check-in
        </button>
      </form>
      {feedback && <div className={`feedback-box ${feedback.type}`}>{feedback.text}</div>}
    </>
  );
}
