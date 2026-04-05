import { getEnv } from './env.js';

function normalizeMode(value) {
  const mode = String(value || '').trim().toLowerCase();
  if (mode === 'strict') return 'strict';
  return 'auto';
}

function runtimeIsProduction() {
  const runtime = String(getEnv('VITE_RUNTIME_ENV', getEnv('NODE_ENV', 'development')) || '').trim().toLowerCase();
  return runtime === 'production';
}

export function getFallbackMode(moduleKey) {
  const legacyStrict = String(getEnv('VITE_API_STRICT_MODE', '')).trim().toLowerCase() === 'true';
  if (legacyStrict && String(moduleKey || '').toLowerCase() === 'm01') {
    return 'strict';
  }

  const globalMode = normalizeMode(getEnv('VITE_API_FALLBACK_MODE', 'auto'));
  const moduleMode = normalizeMode(getEnv(`VITE_API_FALLBACK_${String(moduleKey || '').toUpperCase()}`, globalMode));

  if (moduleMode === 'auto' && runtimeIsProduction()) {
    return 'strict';
  }

  return moduleMode;
}

export function isStrictFallback(moduleKey) {
  return getFallbackMode(moduleKey) === 'strict';
}
