import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { sql } from 'drizzle-orm'
import { createDatabase } from './client.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error('DATABASE_URL es obligatorio para db:migrate')

const { db, pool } = createDatabase(connectionString)
try {
  const migration = await readFile(resolve(root, 'db/migrations/0001_initial.sql'), 'utf8')
  await db.execute(sql.raw(migration))
  console.log('Migración 0001_initial aplicada o ya existente.')
} finally {
  await pool.end()
}
