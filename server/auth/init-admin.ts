import { randomUUID } from 'node:crypto'
import { createDatabase } from '../db/client.js'
import { hashPassword } from './passwords.js'
import { PostgresRepository } from '../repositories/postgres-repository.js'

const connectionString = process.env.DATABASE_URL
const email = process.env.ADMIN_EMAIL
const password = process.env.ADMIN_PASSWORD
if (!connectionString || !email || !password) throw new Error('DATABASE_URL, ADMIN_EMAIL y ADMIN_PASSWORD son obligatorios para admin:init')
const { pool } = createDatabase(connectionString)
try {
  const repository = new PostgresRepository(pool)
  await repository.saveAdminUser({ id: `admin-${randomUUID()}`, email, passwordHash: await hashPassword(password), role: 'admin', active: true, isDemo: true })
  console.log(`Administrador demo creado para ${email}. La contraseña no se muestra ni se almacena en el repositorio.`)
} finally {
  await pool.end()
}
