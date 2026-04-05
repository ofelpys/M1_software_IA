import Badge from '../components/Badge';
import CadastroForm from '../modules/m01-cadastro-acesso/CadastroForm';

export default function CadastroScreen() {
  return (
    <>
      <div className="grid split-6-6">
        <section className="panel">
          <CadastroForm />
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
          <h3>Histórico de acesso (M01)</h3>
          <table className="compact-table">
            <thead><tr><th>Data/Hora</th><th>Aluno</th><th>Resultado</th></tr></thead>
            <tbody>
              <tr><td>05/04 06:12</td><td>Ana Martins</td><td><Badge type="active">Liberado</Badge></td></tr>
              <tr><td>05/04 06:18</td><td>Rafael Silva</td><td><Badge type="debt">Bloqueado</Badge></td></tr>
              <tr><td>05/04 06:22</td><td>Larissa Pinto</td><td><Badge type="active">Liberado</Badge></td></tr>
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
