import { describe, expect, it } from 'vitest'
import { hasValidationErrors, validateAppointmentRequest } from './validation.js'

const validRequest = {
  serviceId: 'service-demo-estetica',
  professionalId: 'professional-demo-elena',
  date: '2030-05-20',
  startTime: '10:00',
  name: 'Ana Demo',
  email: 'ana@example.invalid',
  interest: 'evaluacion',
  notes: '',
  preferredChannel: 'email' as const,
  isDemo: true as const,
}

describe('validateAppointmentRequest', () => {
  it('accepts a complete synthetic request', () => {
    expect(validateAppointmentRequest(validRequest)).toEqual({})
  })

  it('rejects incomplete and medical-looking notes', () => {
    const errors = validateAppointmentRequest({ ...validRequest, name: 'A', email: 'bad', notes: 'Mi diagnóstico y radiografía' })
    expect(hasValidationErrors(errors)).toBe(true)
    expect(errors).toMatchObject({ name: 'Escribe tu nombre.', email: 'Revisa tu correo electrónico.' })
    expect(errors.notes).toContain('No introduzcas')
  })

  it('rejects a non-demo request', () => {
    expect(validateAppointmentRequest({ ...validRequest, isDemo: false })).toMatchObject({ isDemo: 'Solo se aceptan solicitudes del entorno demo.' })
  })
})
