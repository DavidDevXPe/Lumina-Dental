import { createHash, randomBytes, randomUUID } from 'node:crypto'
import type { FastifyRequest } from 'fastify'
import type { AdminRole } from '../../shared/contracts.js'
import type { AdminSessionRecord, AdminUserRecord, LuminaRepository } from '../repositories/types.js'

export const sessionCookie = 'lumina_session'
export const csrfCookie = 'lumina_csrf'
export const hashToken = (token: string) => createHash('sha256').update(token).digest('hex')

export interface AuthContext { user: AdminUserRecord; session: AdminSessionRecord }

export async function createSession(repo: LuminaRepository, user: AdminUserRecord, ttlHours: number) {
  const token = randomBytes(32).toString('base64url')
  const csrfToken = randomBytes(24).toString('base64url')
  const session: AdminSessionRecord = { id: `session-${randomUUID()}`, adminUserId: user.id, tokenHash: hashToken(token), csrfTokenHash: hashToken(csrfToken), expiresAt: new Date(Date.now() + ttlHours * 60 * 60 * 1000).toISOString(), revokedAt: null }
  await repo.saveSession(session)
  return { token, csrfToken, session }
}

export async function getAuthContext(repo: LuminaRepository, request: FastifyRequest): Promise<AuthContext | undefined> {
  const token = request.cookies[sessionCookie]
  if (!token) return undefined
  const session = await repo.getSessionByTokenHash(hashToken(token))
  if (!session) return undefined
  const user = await repo.getAdminById(session.adminUserId)
  return user ? { user, session } : undefined
}

export function hasRole(role: AdminRole, allowed: AdminRole[]): boolean {
  return allowed.includes(role)
}
