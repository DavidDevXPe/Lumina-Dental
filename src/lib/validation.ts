import { validateAppointmentRequest, type FieldErrors } from '../../shared/validation'

export type AppointmentForm = { name: string; email: string; interest: string; message: string }
export type FormErrors = Partial<Record<keyof AppointmentForm, string>>

export function validateAppointmentForm(form: AppointmentForm): FormErrors {
  const errors = validateAppointmentRequest({
    serviceId: 'demo-contact',
    professionalId: 'demo-contact',
    date: '2030-01-01',
    startTime: '09:00',
    name: form.name,
    email: form.email,
    interest: form.interest,
    notes: form.message,
    preferredChannel: 'email',
    isDemo: true,
  })
  return mapFormErrors(errors)
}

function mapFormErrors(errors: FieldErrors): FormErrors {
  return {
    name: errors.name,
    email: errors.email,
    interest: errors.interest,
    message: errors.notes,
  }
}
