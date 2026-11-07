import { describe, expect, it } from 'vitest'
import { ConflictError } from '../domain/errors.js'
import { createDemoRepository } from './demo-repository.js'

const requestInput = {
  serviceId: 'service-demo-estetica', professionalId: 'professional-demo-elena', date: '2030-05-20', startTime: '10:00', name: 'Ana Demo', email: 'ana@example.invalid', interest: 'evaluacion', notes: '', preferredChannel: 'email' as const, isDemo: true as const,
}

describe('DemoRepository', () => {
  it('filters professionals by service and creates a pending request', async () => {
    const repo = createDemoRepository()
    expect((await repo.listProfessionals('service-demo-alineacion')).map((professional) => professional.id)).toEqual(['professional-demo-mateo'])
    const request = await repo.createAppointmentRequest(requestInput)
    expect(request.status).toBe('received')
    expect((await repo.listNotifications())[0].type).toBe('request_received')
  })

  it('excludes an occupied slot and returns a controlled conflict on confirmation', async () => {
    const repo = createDemoRepository()
    const occupied = await repo.getAvailability({ serviceId: 'service-demo-prevencion', professionalId: 'professional-demo-mateo', date: '2030-05-21' })
    expect(occupied.find((slot) => slot.startTime === '11:00')?.isAvailable).toBe(false)
    await expect(repo.confirmRequest('request-demo-conflict')).rejects.toBeInstanceOf(ConflictError)
  })

  it('confirms a request into a separate appointment', async () => {
    const repo = createDemoRepository()
    const request = await repo.createAppointmentRequest({ ...requestInput, startTime: '14:00' })
    const result = await repo.confirmRequest(request.id)
    expect(result.request.status).toBe('confirmed_manual')
    expect(result.appointment.status).toBe('confirmed')
    expect(result.appointment.requestId).toBe(request.id)
  })
})
