import { useCallback, useEffect, useState } from 'react';
import Badge from '../components/Badge';
import CadastroForm from '../modules/m01-cadastro-acesso/CadastroForm';
import { inativarAlunoComFallback, listarAlunos } from '../modules/m01-cadastro-acesso/m01Gateway';

export default function CadastroScreen() {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [editAluno, setEditAluno] = useState(null);

  const loadAlunos = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listarAlunos();
      setAlunos(data);
    } catch (err) {
      const message = err?.message || 'Falha ao carregar alunos do backend.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAlunos();
  }, [loadAlunos]);

  const handleInativar = async (id) => {
    if (!id) {
      return;
    }

    const result = await inativarAlunoComFallback(id);
    if (!result.ok) {
      setFeedback({ type: 'error-box', text: result.error || 'Falha ao inativar matrícula.' });
      return;
    }

    setFeedback({ type: 'success-box', text: `Matrícula #${id} inativada com sucesso. (API real)` });
    if (editAluno?.id === id) {
      setEditAluno(null);
    }
    await loadAlunos();
  };

  return (
    <>
      <div className="grid split-6-6">
        <section className="panel">
          <CadastroForm
            onSaved={async () => {
              setEditAluno(null);
              setFeedback(null);
              await loadAlunos();
            }}
            editAluno={editAluno}
          />
        </section>
        <section className="panel">
          <h3>Validação de status</h3>
          <div className="badge-row">
            <Badge type="active">Ativo</Badge>
            <Badge type="debt">Inadimplente</Badge>
            <Badge type="trial">Trial</Badge>
            <Badge type="premium">Premium</Badge>
            <Badge type="info">Plano</Badge>
          </div>
        </section>
      </div>

      <div className="grid split-6-6">
        <section className="panel">
          <h3>Alunos cadastrados (API)</h3>
          {feedback?.text && <div className={`feedback-box ${feedback.type}`}>{feedback.text}</div>}
          {loading && <p>Carregando alunos...</p>}
          {!loading && error && <div className="feedback-box error-box">{error}</div>}
          <table className="compact-table">
            <thead><tr><th>ID</th><th>Aluno</th><th>Unidade</th><th>Plano</th><th>Status</th><th>Ações</th></tr></thead>
            <tbody>
              {!loading && !error && alunos.length === 0 && (
                <tr><td colSpan="6">Nenhum aluno cadastrado.</td></tr>
              )}
              {!loading && !error && alunos.map((item) => {
                const aluno = item?.aluno || {};
                const isInativo = aluno?.ativo === false;
                return (
                  <tr key={item?.id || `${aluno?.cpf || 'sem-cpf'}-${aluno?.nome || 'aluno'}`}>
                    <td>{item?.id ?? '-'}</td>
                    <td>{aluno?.nome || '-'}</td>
                    <td>{aluno?.unidade || '-'}</td>
                    <td>{aluno?.plano || '-'}</td>
                    <td>
                      {isInativo ? <Badge type="debt">Inativo</Badge> : <Badge type="active">Ativo</Badge>}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          className="btn-ghost btn-xs"
                          onClick={() => {
                            setFeedback(null);
                            setEditAluno({ id: item?.id, ...aluno });
                          }}
                          disabled={!item?.id || isInativo}
                        >
                          Alterar
                        </button>
                        <button
                          type="button"
                          className="btn-ghost btn-xs"
                          onClick={() => handleInativar(item?.id)}
                          disabled={!item?.id || isInativo}
                        >
                          Inativar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section className="panel">
          <h3>Auditoria recente</h3>
          <table className="compact-table">
            <thead><tr><th>Operador</th><th>Ação</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td>recepcao-centro</td><td>Cadastro aluno</td><td><Badge type="success">OK</Badge></td></tr>
              <tr><td>coord-zona-sul</td><td>Atualização cadastro</td><td><Badge type="info">Revisado</Badge></td></tr>
              <tr><td>recepcao-zona-norte</td><td>Tentativa check-in</td><td><Badge type="alert">Negado</Badge></td></tr>
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
}
