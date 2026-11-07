import type { AppointmentStatus, RequestStatus } from './contracts.js'

export interface TimeInterval {
  start: string
  end: string
}

export function intervalsOverlap(a: TimeInterval, b: TimeInterval): boolean {
  return a.start < b.end && b.start < a.end
}

export function isSlotAvailable(existing: TimeInterval[], candidate: TimeInterval): boolean {
  return !existing.some((interval) => intervalsOverlap(interval, candidate))
}

const requestTransitions: Record<RequestStatus, RequestStatus[]> = {
  received: ['under_review', 'closed'],
  under_review: ['confirmed_manual', 'rejected', 'reschedule_requested', 'cancellation_requested', 'closed'],
  confirmed_manual: ['reschedule_requested', 'cancellation_requested', 'closed'],
  rejected: ['closed'],
  reschedule_requested: ['confirmed_manual', 'rejected', 'closed'],
  cancellation_requested: ['closed'],
  closed: [],
}

const appointmentTransitions: Record<AppointmentStatus, AppointmentStatus[]> = {
  confirmed: ['reschedule_requested', 'cancellation_requested', 'cancelled', 'completed', 'closed'],
  reschedule_requested: ['confirmed', 'cancelled', 'closed'],
  cancellation_requested: ['cancelled', 'closed'],
  cancelled: ['closed'],
  completed: ['closed'],
  closed: [],
}

export function canTransitionRequest(from: RequestStatus, to: RequestStatus): boolean {
  return requestTransitions[from].includes(to)
}

export function canTransitionAppointment(from: AppointmentStatus, to: AppointmentStatus): boolean {
  return appointmentTransitions[from].includes(to)
}
