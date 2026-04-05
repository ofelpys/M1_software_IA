import { getEnv } from './env.js';

const routeProfiles = {
  legacy: {
    m01: {
      alunos: '/m01/alunos',
      checkin: '/m01/checkins',
    },
    m02: {
      desbloqueioInadimplencia: '/m02/inadimplencia/desbloqueios',
      pagamentos: '/api/pagamentos',
    },
    m03: {
      relatoriosKpis: '/api/relatorios/kpis',
    },
    m04: {
      avaliacoes: '/api/avaliacoes',
    },
    m05: {
      professores: '/api/professores',
    },
    m06: {
      equipamentos: '/api/equipamentos',
    },
    m07: {
      insumos: '/api/insumos',
    },
    m08: {
      disparoComunicacao: '/m08/comunicacoes/disparos',
      notificacoes: '/api/notificacoes',
    },
  },
  canonical: {
    m01: {
      alunos: '/api/alunos',
      checkin: '/api/acesso/checkin',
    },
    m02: {
      desbloqueioInadimplencia: '/api/acesso/{alunoId}/desbloquear',
      pagamentos: '/api/pagamentos',
    },
    m03: {
      relatoriosKpis: '/api/relatorios/kpis',
    },
    m04: {
      avaliacoes: '/api/avaliacoes',
    },
    m05: {
      professores: '/api/professores',
    },
    m06: {
      equipamentos: '/api/equipamentos',
    },
    m07: {
      insumos: '/api/insumos',
    },
    m08: {
      disparoComunicacao: '/api/comunicacoes/disparos',
      notificacoes: '/api/notificacoes',
    },
  },
};

const profile = String(getEnv('VITE_API_ROUTE_PROFILE', 'legacy')).trim().toLowerCase();

export const apiRoutes = routeProfiles[profile] || routeProfiles.legacy;
