import { useEffect, useMemo, useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import DashboardScreen from './screens/DashboardScreen';
import RecepcaoScreen from './screens/RecepcaoScreen';
import CadastroScreen from './screens/CadastroScreen';
import FinanceiroScreen from './screens/FinanceiroScreen';
import RelatoriosScreen from './screens/RelatoriosScreen';
import AvaliacaoScreen from './screens/AvaliacaoScreen';
import ProfessoresScreen from './screens/ProfessoresScreen';
import EquipamentosScreen from './screens/EquipamentosScreen';
import ComunicacaoScreen from './screens/ComunicacaoScreen';
import OperacaoScreen from './screens/OperacaoScreen';
import InsumosScreen from './screens/InsumosScreen';
import { checkApiHealth } from './services/apiHealth';

const titles = {
  dashboard: 'Dashboard Executivo',
  recepcao: 'Recepção e Check-in Rápido',
  cadastro: 'Cadastro e Validação',
  financeiro: 'Painel Financeiro',
  relatorios: 'Relatórios e Dashboards',
  avaliacao: 'Avaliação e Evolução',
  professores: 'Gestão de Professores',
  equipamentos: 'Equipamentos e Salas',
  insumos: 'Insumos e Produtos',
  comunicacao: 'Comunicação e Notificações',
  operacao: 'Checklist de Operação',
};

const actionLabels = {
  dashboard: 'Nova ação',
  recepcao: 'Novo check-in',
  cadastro: 'Novo cadastro',
  financeiro: 'Novo lançamento',
  relatorios: 'Novo relatório',
  avaliacao: 'Nova avaliação',
  professores: 'Novo professor',
  equipamentos: 'Novo item',
  insumos: 'Novo insumo',
  comunicacao: 'Novo comunicado',
  operacao: 'Nova tarefa',
};

function renderScreen(key) {
  switch (key) {
    case 'recepcao':
      return <RecepcaoScreen />;
    case 'cadastro':
      return <CadastroScreen />;
    case 'financeiro':
      return <FinanceiroScreen />;
    case 'relatorios':
      return <RelatoriosScreen />;
    case 'avaliacao':
      return <AvaliacaoScreen />;
    case 'professores':
      return <ProfessoresScreen />;
    case 'equipamentos':
      return <EquipamentosScreen />;
    case 'insumos':
      return <InsumosScreen />;
    case 'comunicacao':
      return <ComunicacaoScreen />;
    case 'operacao':
      return <OperacaoScreen />;
    default:
      return <DashboardScreen />;
  }
}

export default function App() {
  const [active, setActive] = useState('dashboard');
  const [health, setHealth] = useState({ status: 'checking', message: 'Verificando API...' });
  const title = useMemo(() => titles[active] || titles.dashboard, [active]);
  const actionLabel = useMemo(() => actionLabels[active] || actionLabels.dashboard, [active]);

  const refreshHealth = async () => {
    setHealth({ status: 'checking', message: 'Verificando API...' });
    const result = await checkApiHealth();
    setHealth(result);
  };

  useEffect(() => {
    refreshHealth();
    const timer = setInterval(refreshHealth, 15000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="app-shell">
      <Sidebar active={active} onChange={setActive} />
      <main className="workspace">
        <Topbar title={title} actionLabel={actionLabel} health={health} onRefreshHealth={refreshHealth} />
        {renderScreen(active)}
      </main>
    </div>
  );
}
