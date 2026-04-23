import { useState } from 'react';
import CadastroForm from '../modules/m01-cadastro-acesso/CadastroForm';

export default function CadastroScreen() {
  const [feedback, setFeedback] = useState(null);

  return (
    <>
      <section className="panel">
        <CadastroForm
          onSaved={async () => {
            setFeedback(null);
          }}
        />
        {feedback?.text && <div className={`feedback-box ${feedback.type}`}>{feedback.text}</div>}
      </section>
    </>
  );
}
