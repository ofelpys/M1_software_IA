import { getEnv } from './env.js';

const API_BASE_URL = String(getEnv('VITE_API_BASE_URL', 'http://localhost:8080/api')).replace(/\/$/, '');

class ApiClientError extends Error {
  constructor(message, { kind = 'unknown', status } = {}) {
    super(message);
    this.name = 'ApiClientError';
    this.kind = kind;
    this.status = status;
  }
}

function withTimeout(timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort('timeout'), timeoutMs);
  return { controller, clear: () => clearTimeout(timer) };
}

export async function requestJson(path, { method = 'GET', body, timeoutMs = 5000 } = {}) {
  const timeout = withTimeout(timeoutMs);
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: timeout.controller.signal,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new ApiClientError(data?.message || `HTTP ${response.status}`, {
        kind: 'http',
        status: response.status,
      });
    }

    return data;
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new ApiClientError('Tempo de resposta da API excedido.', { kind: 'timeout' });
    }

    if (error instanceof ApiClientError) {
      throw error;
    }

    if (error instanceof TypeError) {
      throw new ApiClientError('Falha de conexão com a API.', { kind: 'network' });
    }

    throw new ApiClientError('Falha inesperada ao acessar a API.', { kind: 'unknown' });
  } finally {
    timeout.clear();
  }
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export function getApiErrorMessage(error) {
  if (!error || error.name !== 'ApiClientError') {
    return 'API indisponível no momento.';
  }

  if (error.kind === 'timeout') {
    return 'API indisponível: tempo de resposta excedido.';
  }

  if (error.kind === 'network') {
    return 'API indisponível: falha de conexão.';
  }

  if (error.kind === 'http') {
    if (error.status >= 500) {
      return `API indisponível: erro interno (HTTP ${error.status}).`;
    }
    return `API indisponível: requisição rejeitada (HTTP ${error.status}).`;
  }

  return 'API indisponível no momento.';
}
