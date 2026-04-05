import { getEnv } from './env.js';

const API_BASE_URL = String(getEnv('VITE_API_BASE_URL', '/api')).trim().replace(/\/$/, '');

class ApiClientError extends Error {
  constructor(message, { kind = 'unknown', status, url } = {}) {
    super(message);
    this.name = 'ApiClientError';
    this.kind = kind;
    this.status = status;
    this.url = url;
  }
}

function withAlternateLocalhost(url) {
  if (url.includes('://127.0.0.1')) {
    return url.replace('://127.0.0.1', '://localhost');
  }
  if (url.includes('://localhost')) {
    return url.replace('://localhost', '://127.0.0.1');
  }
  return null;
}

async function doFetch(url, { method, body, signal }) {
  return fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });
}

function withTimeout(timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort('timeout'), timeoutMs);
  return { controller, clear: () => clearTimeout(timer) };
}

export async function requestJson(path, { method = 'GET', body, timeoutMs = 5000 } = {}) {
  const timeout = withTimeout(timeoutMs);
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const baseHasApiSuffix = /\/api$/i.test(API_BASE_URL);
  const pathHasApiPrefix = /^\/api(\/|$)/i.test(normalizedPath);
  const safePath = baseHasApiSuffix && pathHasApiPrefix
    ? normalizedPath.replace(/^\/api/i, '') || '/'
    : normalizedPath;
  const primaryUrl = `${API_BASE_URL}${safePath}`;
  const alternateUrl = withAlternateLocalhost(primaryUrl);
  const urlsToTry = alternateUrl ? [primaryUrl, alternateUrl] : [primaryUrl];

  try {
    let response;
    let lastNetworkError;
    let usedUrl = urlsToTry[0];

    for (const candidateUrl of urlsToTry) {
      try {
        response = await doFetch(candidateUrl, {
          method,
          body,
          signal: timeout.controller.signal,
        });
        usedUrl = candidateUrl;
        break;
      } catch (error) {
        if (error?.name === 'AbortError') {
          throw error;
        }
        if (error instanceof TypeError) {
          lastNetworkError = error;
          continue;
        }
        throw error;
      }
    }

    if (!response) {
      throw lastNetworkError || new TypeError('network');
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new ApiClientError(data?.message || `HTTP ${response.status}`, {
        kind: 'http',
        status: response.status,
        url: usedUrl,
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
      throw new ApiClientError('Falha de conexão com a API.', { kind: 'network', url: primaryUrl });
    }

    throw new ApiClientError('Falha inesperada ao acessar a API.', { kind: 'unknown', url: primaryUrl });
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
    return `API indisponível: falha de conexão${error.url ? ` (${error.url})` : ''}.`;
  }

  if (error.kind === 'http') {
    if (error.status >= 500) {
      return `API indisponível: erro interno (HTTP ${error.status}).`;
    }
    return `API indisponível: requisição rejeitada (HTTP ${error.status}).`;
  }

  return 'API indisponível no momento.';
}
