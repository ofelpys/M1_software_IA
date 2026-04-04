import { getApiBaseUrl } from './httpClient';

const HEALTH_PATH = import.meta.env?.VITE_API_HEALTH_PATH || '/health';

function resolveHealthUrl() {
  if (HEALTH_PATH.startsWith('http://') || HEALTH_PATH.startsWith('https://')) {
    return HEALTH_PATH;
  }

  const base = getApiBaseUrl().replace(/\/$/, '');
  const path = HEALTH_PATH.startsWith('/') ? HEALTH_PATH : `/${HEALTH_PATH}`;
  return `${base}${path}`;
}

export async function checkApiHealth(timeoutMs = 2500) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const url = resolveHealthUrl();

  try {
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
    });

    if (!response.ok) {
      return {
        status: 'offline',
        message: `API indisponível (HTTP ${response.status})`,
      };
    }

    return {
      status: 'online',
      message: 'API online',
    };
  } catch (error) {
    if (error?.name === 'AbortError') {
      return {
        status: 'offline',
        message: 'API indisponível (timeout)',
      };
    }

    return {
      status: 'offline',
      message: 'API indisponível (sem conexão)',
    };
  } finally {
    clearTimeout(timer);
  }
}
