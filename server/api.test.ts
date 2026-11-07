import { beforeEach, describe, expect, it } from 'vitest'
import { buildApp } from './app.js'
import { hashPassword } from './auth/passwords.js'
import type { AdminUserRecord } from './repositories/types.js'
import { createDemoRepository } from './repositories/demo-repository.js'

describe('Lumina API', () => {
  let app: Awaited<ReturnType<typeof buildApp>>
  beforeEach(async () => {
    const repository = createDemoRepository()
    const admin: AdminUserRecord = { id: 'admin-demo-001', email: 'admin@example.invalid', passwordHash: await hashPassword('demo-password-123'), role: 'admin', active: true, isDemo: true }
    await repository.saveAdminUser(admin)
    app = await buildApp({ repository, config: { port: 3001, repositoryMode: 'demo', demoMode: true, secureCookies: false, sessionTtlHours: 8 } })
  })

  it('serves the public catalog and creates only pending requests', async () => {
    const services = await app.inject({ method: 'GET', url: '/api/v1/services' })
    expect(services.statusCode).toBe(200)
    expect(services.json().data).toHaveLength(4)
    const response = await app.inject({ method: 'POST', url: '/api/v1/appointment-requests', payload: { serviceId: 'service-demo-estetica', professionalId: 'professional-demo-elena', date: '2030-05-20', startTime: '14:00', name: 'Ana Demo', email: 'ana@example.invalid', interest: 'evaluacion', notes: '', preferredChannel: 'email', isDemo: true } })
    expect(response.statusCode).toBe(201)
    expect(response.json().data.status).toBe('received')
  })

  it('protects admin mutations with login, session and CSRF', async () => {
    const unauthenticated = await app.inject({ method: 'GET', url: '/api/v1/admin/dashboard' })
    expect(unauthenticated.statusCode).toBe(401)
    const login = await app.inject({ method: 'POST', url: '/api/v1/auth/login', payload: { email: 'admin@example.invalid', password: 'demo-password-123' } })
    expect(login.statusCode).toBe(200)
    const cookies = login.cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
    const csrf = login.cookies.find((cookie) => cookie.name === 'lumina_csrf')?.value
    const dashboard = await app.inject({ method: 'GET', url: '/api/v1/admin/dashboard', headers: { cookie: cookies } })
    expect(dashboard.statusCode).toBe(200)
    const missingCsrf = await app.inject({ method: 'POST', url: '/api/v1/admin/requests/request-demo-001/reject', headers: { cookie: cookies } })
    expect(missingCsrf.statusCode).toBe(403)
    const rejected = await app.inject({ method: 'POST', url: '/api/v1/admin/requests/request-demo-001/reject', headers: { cookie: cookies, 'x-csrf-token': csrf } })
    expect(rejected.statusCode).toBe(200)
  })

  it('returns 409 when confirmation finds a slot conflict', async () => {
    const login = await app.inject({ method: 'POST', url: '/api/v1/auth/login', payload: { email: 'admin@example.invalid', password: 'demo-password-123' } })
    const cookies = login.cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
    const csrf = login.cookies.find((cookie) => cookie.name === 'lumina_csrf')?.value
    const response = await app.inject({ method: 'POST', url: '/api/v1/admin/requests/request-demo-conflict/confirm', headers: { cookie: cookies, 'x-csrf-token': csrf } })
    expect(response.statusCode).toBe(409)
    expect(response.json().code).toBe('AVAILABILITY_CONFLICT')
  })

  it('allows an editor-capable admin to manage demo catalog status', async () => {
    const login = await app.inject({ method: 'POST', url: '/api/v1/auth/login', payload: { email: 'admin@example.invalid', password: 'demo-password-123' } })
    const cookies = login.cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
    const csrf = login.cookies.find((cookie) => cookie.name === 'lumina_csrf')?.value
    const response = await app.inject({ method: 'PATCH', url: '/api/v1/admin/services/service-demo-estetica', headers: { cookie: cookies, 'x-csrf-token': csrf }, payload: { status: 'inactive' } })
    expect(response.statusCode).toBe(200)
    const services = await app.inject({ method: 'GET', url: '/api/v1/admin/services', headers: { cookie: cookies } })
    expect(services.json().data.find((service: { id: string }) => service.id === 'service-demo-estetica').status).toBe('inactive')
  })
})
