import { describe, expect, it } from 'vitest'
import { validateAppointmentForm } from './validation'

describe('validateAppointmentForm', () => {
  it('accepts a complete demo request', () => {
    expect(validateAppointmentForm({ name: 'Ana Pérez', email: 'ana@correo.pe', interest: 'evaluacion', message: '' })).toEqual({})
  })
  it('returns focused errors for incomplete fields', () => {
    expect(validateAppointmentForm({ name: 'A', email: 'correo', interest: '', message: '' })).toMatchObject({ name: 'Escribe tu nombre.', email: 'Revisa tu correo electrónico.', interest: 'Elige un motivo de consulta.' })
  })
})
