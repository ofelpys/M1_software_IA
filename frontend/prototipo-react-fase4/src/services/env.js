export function getEnv(name, fallback = undefined) {
  const viteEnv = import.meta.env?.[name];
  if (viteEnv !== undefined && viteEnv !== null && viteEnv !== '') {
    return viteEnv;
  }

  if (typeof process !== 'undefined' && process?.env?.[name] !== undefined && process.env[name] !== '') {
    return process.env[name];
  }

  return fallback;
}
