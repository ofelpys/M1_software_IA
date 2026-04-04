import Badge from '../components/Badge';
import CadastroForm from '../modules/m01-cadastro-acesso/CadastroForm';

export default function CadastroScreen() {
  return (
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
  );
}
