import { getApiErrorMessage, requestJson } from '../../services/httpClient.js';
import { apiRoutes } from '../../services/apiRoutes.js';

const defaultRows = [
  { aluno: 'Ana Martins', teste: 'Forca MMII', evolucao: '+12%', status: 'Meta' },
  { aluno: 'Rafael Silva', teste: 'Resistencia', evolucao: '+4%', status: 'Acompanhando' },
  { aluno: 'Larissa Pinto', teste: 'Composicao corporal', evolucao: '-8% gordura', status: 'Meta' },
];

export async function listarAvaliacoesComFallback() {
  try {
    const data = await requestJson(apiRoutes.m04.avaliacoes);
    const rows = Array.isArray(data) ? data.map((item) => ({
      aluno: item.aluno,
      teste: item.teste,
      evolucao: item.evolucao,
      status: item.status,
    })) : [];
    return { rows, source: 'api' };
  } catch (error) {
    return { rows: defaultRows, source: 'mock', fallbackNotice: getApiErrorMessage(error) };
  }
}
