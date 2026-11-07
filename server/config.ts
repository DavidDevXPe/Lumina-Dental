export interface AppConfig {
  port: number
  repositoryMode: 'demo' | 'postgres'
  demoMode: boolean
  secureCookies: boolean
  sessionTtlHours: number
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const repositoryMode = env.REPOSITORY_MODE === 'postgres' ? 'postgres' : 'demo'
  return { port: Number(env.PORT ?? 3001), repositoryMode, demoMode: env.DEMO_MODE !== 'false', secureCookies: env.SECURE_COOKIES === 'true', sessionTtlHours: Number(env.SESSION_TTL_HOURS ?? 8) }
}
