import { createDatabase } from './db/client.js'
import { loadConfig } from './config.js'
import { buildApp } from './app.js'
import { createDemoRepository } from './repositories/demo-repository.js'
import { PostgresRepository } from './repositories/postgres-repository.js'
import { hashPassword } from './auth/passwords.js'

const config = loadConfig()
let closeDatabase: (() => Promise<void>) | undefined
const repository = config.repositoryMode === 'postgres'
  ? (() => { if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL es obligatorio con REPOSITORY_MODE=postgres'); const { db: _db, pool } = createDatabase(process.env.DATABASE_URL); closeDatabase = () => pool.end(); return new PostgresRepository(pool) })()
  : createDemoRepository()

if (config.repositoryMode === 'demo' && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
  await repository.saveAdminUser({ id: 'admin-demo-env', email: process.env.ADMIN_EMAIL, passwordHash: await hashPassword(process.env.ADMIN_PASSWORD), role: 'admin', active: true, isDemo: true })
}

const app = await buildApp({ repository, config })
await app.listen({ port: config.port, host: '127.0.0.1' })
console.log(`Lúmina API escuchando en http://127.0.0.1:${config.port} (${config.repositoryMode})`)

const shutdown = async () => { await app.close(); await closeDatabase?.(); process.exit(0) }
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
