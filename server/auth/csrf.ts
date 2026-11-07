import { timingSafeEqual } from 'node:crypto'
import type { FastifyRequest } from 'fastify'
import { hashToken } from './session.js'
import type { AdminSessionRecord } from '../repositories/types.js'

export function hasValidCsrf(request: FastifyRequest, session: AdminSessionRecord): boolean {
  const token = request.headers['x-csrf-token']
  if (typeof token !== 'string') return false
  const actual = Buffer.from(hashToken(token))
  const expected = Buffer.from(session.csrfTokenHash)
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}
