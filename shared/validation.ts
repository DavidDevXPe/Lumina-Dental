import type { AppointmentRequestInput, PreferredChannel } from './contracts.js'

export type FieldErrors = Partial<Record<keyof AppointmentRequestInput, string>>

const emailPattern = /^\S+@\S+\.\S+$/
const datePattern = /^\d{4}-\d{2}-\d{2}$/
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/
const sensitivePattern = /(dni|diagn[oó]stic|antecedent|medic|radiograf|escaneos?\s*3d|prescrip|historia\s+cl[ií]nica|tarjeta\s+de)/i
const channels: PreferredChannel[] = ['email', 'phone', 'whatsapp']

export function validateAppointmentRequest(input: Partial<Omit<AppointmentRequestInput, 'isDemo'>> & { isDemo?: boolean }): FieldErrors {
  const errors: FieldErrors = {}
  if (!input.serviceId) errors.serviceId = 'Selecciona un servicio.'
  if (!input.professionalId) errors.professionalId = 'Selecciona un especialista demo.'
  if (!input.name || input.name.trim().length < 2) errors.name = 'Escribe tu nombre.'
  if (input.name && input.name.trim().length > 100) errors.name = 'Usa hasta 100 caracteres.'
  if (!input.email || !emailPattern.test(input.email.trim())) errors.email = 'Revisa tu correo electrónico.'
  if (input.email && input.email.trim().length > 254) errors.email = 'Revisa tu correo electrónico.'
  if (!input.interest) errors.interest = 'Elige un motivo de consulta.'
  if (!input.date || !datePattern.test(input.date)) errors.date = 'Elige una fecha válida.'
  if (!input.startTime || !timePattern.test(input.startTime)) errors.startTime = 'Elige un horario válido.'
  if (!input.notes) input.notes = ''
  if (input.notes && input.notes.length > 280) errors.notes = 'Usa hasta 280 caracteres.'
  if (input.notes && sensitivePattern.test(input.notes)) errors.notes = 'No introduzcas información personal ni médica real.'
  if (!input.preferredChannel || !channels.includes(input.preferredChannel)) errors.preferredChannel = 'Elige un canal de contacto.'
  if (input.isDemo !== true) errors.isDemo = 'Solo se aceptan solicitudes del entorno demo.'
  return errors
}

export function hasValidationErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0
}
