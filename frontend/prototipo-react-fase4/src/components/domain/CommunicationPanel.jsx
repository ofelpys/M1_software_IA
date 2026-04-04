import { useState } from 'react';
import { dispararComunicacaoComFallback } from '../../modules/m08-comunicacao/m08Gateway';

export default function CommunicationPanel() {
  const [feedback, setFeedback] = useState(null);
  const [canal, setCanal] = useState('Email');
  const [segmento, setSegmento] = useState('Inadimplentes');
  const [mensagem, setMensagem] = useState('');

  const send = async (ok) => {
    const result = await dispararComunicacaoComFallback({
      canal,
      segmento,
      mensagem,
      ok,
    });
    const suffix = result.source === 'mock' ? ' (modo simulado)' : ' (API real)';
    const detail = result.fallbackNotice ? ` ${result.fallbackNotice}` : '';
    setFeedback({ ...result, text: `${result.text}${suffix}${detail}` });
  };

  return (
    <>
      <h3>Disparo de comunicados</h3>
      <form className="form-grid" onSubmit={(e) => e.preventDefault()}>
        <label>
          Canal
          <select value={canal} onChange={(e) => setCanal(e.target.value)}>
            <option>Email</option>
            <option>SMS</option>
            <option>Push</option>
          </select>
        </label>
        <label>
          Segmento
          <select value={segmento} onChange={(e) => setSegmento(e.target.value)}>
            <option>Inadimplentes</option>
            <option>Todos ativos</option>
            <option>Trial</option>
          </select>
        </label>
        <label>
          Mensagem
          <input value={mensagem} onChange={(e) => setMensagem(e.target.value)} placeholder="Escreva o comunicado" />
        </label>
        <div className="row-actions">
          <button className="btn-primary" type="button" onClick={() => send(true)}>
            Enviar agora
          </button>
          <button className="btn-ghost" type="button" onClick={() => send(false)}>
            Simular falha
          </button>
        </div>
      </form>
      {feedback && <div className={`feedback-box ${feedback.type}`}>{feedback.text}</div>}
    </>
  );
}
