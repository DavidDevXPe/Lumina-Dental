import { randomUUID } from 'node:crypto'
import type { AppointmentRecord, AppointmentRequestInput, AppointmentRequestRecord, AvailabilitySlot, DashboardSummary, ProfessionalRecord, RequestStatus, ServiceRecord } from '../../shared/contracts.js'
import { canTransitionRequest, intervalsOverlap, isSlotAvailable } from '../../shared/domain.js'
import { demoAppointments, demoAvailability, demoClinicId, demoProfessionals, demoRequests, demoServices } from '../fixtures/demo.js'
import { ConflictError, DomainError } from '../domain/errors.js'
import type { AdminSessionRecord, AdminUserRecord, AuditEventRecord, AvailabilityQuery, BlockedTimeRecord, LuminaRepository, NotificationRecord } from './types.js'

interface DemoState {
  services: ServiceRecord[]
  professionals: ProfessionalRecord[]
  requests: AppointmentRequestRecord[]
  appointments: AppointmentRecord[]
  blockedTimes: BlockedTimeRecord[]
  notifications: NotificationRecord[]
  audit: AuditEventRecord[]
  admins: AdminUserRecord[]
  sessions: AdminSessionRecord[]
}

const copy = <T>(value: T): T => structuredClone(value)
const now = () => new Date().toISOString()
const toMinutes = (value: string) => { const [hours, minutes] = value.split(':').map(Number); return hours * 60 + minutes }
const toTime = (value: number) => `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`
const weekday = (date: string) => { const day = new Date(`${date}T12:00:00Z`).getUTCDay(); return day === 0 ? 7 : day }
const durationEnd = (start: string, duration: number) => toTime(toMinutes(start) + duration)

export function createDemoRepository(): DemoRepository {
  return new DemoRepository({
    services: copy(demoServices), professionals: copy(demoProfessionals), requests: copy(demoRequests), appointments: copy(demoAppointments),
    blockedTimes: [{ id: 'blocked-demo-001', professionalId: 'professional-demo-elena', date: '2030-05-20', startTime: '13:00', endTime: '14:00', reason: 'Bloqueo demo de mantenimiento', active: true, isDemo: true }],
    notifications: [], audit: [], admins: [], sessions: [],
  })
}

export class DemoRepository implements LuminaRepository {
  constructor(private readonly state: DemoState) {}

  async listServices() { return copy(this.state.services.filter((service) => service.status === 'active')) }
  async listAdminServices() { return copy(this.state.services) }
  async listProfessionals(serviceId?: string) { return copy(this.state.professionals.filter((professional) => professional.status === 'active' && (!serviceId || professional.serviceIds.includes(serviceId)))) }
  async listAdminProfessionals() { return copy(this.state.professionals) }
  async getService(id: string) { return copy(this.state.services.find((service) => service.id === id)) }
  async getProfessional(id: string) { return copy(this.state.professionals.find((professional) => professional.id === id)) }
  async setServiceStatus(id: string, status: ServiceRecord['status']) { const service = this.state.services.find((candidate) => candidate.id === id); if (!service) throw new DomainError('NOT_FOUND', 'Servicio no encontrado.', 404); service.status = status; return copy(service) }
  async setProfessionalStatus(id: string, status: ProfessionalRecord['status']) { const professional = this.state.professionals.find((candidate) => candidate.id === id); if (!professional) throw new DomainError('NOT_FOUND', 'Especialista no encontrado.', 404); professional.status = status; return copy(professional) }

  async getAvailability(query: AvailabilityQuery): Promise<AvailabilitySlot[]> {
    const service = this.state.services.find((candidate) => candidate.id === query.serviceId && candidate.status === 'active')
    const professional = this.state.professionals.find((candidate) => candidate.id === query.professionalId && candidate.status === 'active' && candidate.serviceIds.includes(query.serviceId))
    if (!service || !professional || weekday(query.date) < demoAvailability.weekdayStart || weekday(query.date) > demoAvailability.weekdayEnd) return []
    const slots: AvailabilitySlot[] = []
    const lastStart = demoAvailability.endHour * 60 - service.durationMinutes
    for (let start = demoAvailability.startHour * 60; start <= lastStart; start += demoAvailability.slotMinutes) {
      const startTime = toTime(start)
      const endTime = toTime(start + service.durationMinutes)
      const occupied = [
        ...this.state.appointments.filter((appointment) => appointment.professionalId === query.professionalId && appointment.date === query.date && ['confirmed', 'reschedule_requested'].includes(appointment.status)).map((appointment) => ({ start: appointment.startTime, end: appointment.endTime })),
        ...this.state.blockedTimes.filter((blocked) => blocked.professionalId === query.professionalId && blocked.date === query.date && blocked.active).map((blocked) => ({ start: blocked.startTime, end: blocked.endTime })),
      ]
      slots.push({ id: `${query.date}-${query.professionalId}-${startTime}`, serviceId: query.serviceId, professionalId: query.professionalId, date: query.date, startTime, endTime, timeZone: 'America/Lima', isAvailable: isSlotAvailable(occupied, { start: startTime, end: endTime }), isDemo: true })
    }
    return slots
  }

  async createAppointmentRequest(input: AppointmentRequestInput): Promise<AppointmentRequestRecord> {
    const service = await this.getService(input.serviceId)
    const professional = await this.getProfessional(input.professionalId)
    if (!service || !professional || !professional.serviceIds.includes(service.id)) throw new DomainError('INVALID_SELECTION', 'El servicio y el especialista no forman una opción demo válida.', 400)
    const available = (await this.getAvailability({ serviceId: input.serviceId, professionalId: input.professionalId, date: input.date })).find((slot) => slot.startTime === input.startTime && slot.isAvailable)
    if (!available) throw new ConflictError()
    const request: AppointmentRequestRecord = { ...copy(input), id: `request-${randomUUID()}`, status: 'received', createdAt: now() }
    this.state.requests.push(request)
    this.addNotification('request_received', request.id)
    return copy(request)
  }

  async listRequests(status?: RequestStatus) { return copy(this.state.requests.filter((request) => !status || request.status === status).sort((a, b) => b.createdAt.localeCompare(a.createdAt))) }
  async getRequest(id: string) { return copy(this.state.requests.find((request) => request.id === id)) }

  async reviewRequest(id: string) {
    const request = this.mustRequest(id)
    if (request.status === 'received') request.status = 'under_review'
    else if (request.status !== 'under_review') throw new DomainError('INVALID_REQUEST_STATE', 'La solicitud no está pendiente de revisión.', 409)
    return copy(request)
  }

  async confirmRequest(id: string) {
    const request = this.mustRequest(id)
    if (request.status === 'received') request.status = 'under_review'
    if (!canTransitionRequest(request.status, 'confirmed_manual')) throw new DomainError('INVALID_REQUEST_STATE', 'La solicitud no puede confirmarse desde su estado actual.', 409)
    const service = this.mustService(request.serviceId)
    const availability = await this.getAvailability({ serviceId: request.serviceId, professionalId: request.professionalId, date: request.date })
    const slot = availability.find((candidate) => candidate.startTime === request.startTime)
    if (!slot?.isAvailable) throw new ConflictError()
    const appointment: AppointmentRecord = { id: `appointment-${randomUUID()}`, requestId: request.id, serviceId: request.serviceId, professionalId: request.professionalId, date: request.date, startTime: request.startTime, endTime: durationEnd(request.startTime, service.durationMinutes), timeZone: 'America/Lima', status: 'confirmed', isDemo: true, createdAt: now() }
    this.state.appointments.push(appointment)
    request.status = 'confirmed_manual'
    this.addNotification('request_confirmed', request.id, appointment.id)
    return { request: copy(request), appointment: copy(appointment) }
  }

  async rejectRequest(id: string) { const request = this.mustRequest(id); if (request.status === 'received') request.status = 'under_review'; if (!canTransitionRequest(request.status, 'rejected')) throw new DomainError('INVALID_REQUEST_STATE', 'La solicitud no puede rechazarse desde su estado actual.', 409); request.status = 'rejected'; this.addNotification('request_rejected', request.id); return copy(request) }
  async proposeReschedule(id: string, date: string, startTime: string) { const request = this.mustRequest(id); if (request.status === 'received') request.status = 'under_review'; const available = (await this.getAvailability({ serviceId: request.serviceId, professionalId: request.professionalId, date })).find((slot) => slot.startTime === startTime && slot.isAvailable); if (!available) throw new ConflictError(); request.date = date; request.startTime = startTime; request.status = 'reschedule_requested'; this.addNotification('reschedule_proposed', request.id); return copy(request) }
  async requestCancellation(id: string) { const request = this.mustRequest(id); if (!canTransitionRequest(request.status, 'cancellation_requested')) throw new DomainError('INVALID_REQUEST_STATE', 'La solicitud no puede cancelarse desde su estado actual.', 409); request.status = 'cancellation_requested'; const appointment = this.state.appointments.find((candidate) => candidate.requestId === id); if (appointment) appointment.status = 'cancellation_requested'; this.addNotification('cancellation_requested', request.id, appointment?.id); return copy(request) }

  async listAppointments() { return copy(this.state.appointments.sort((a, b) => b.createdAt.localeCompare(a.createdAt))) }
  async listNotifications() { return copy(this.state.notifications.sort((a, b) => b.createdAt.localeCompare(a.createdAt))) }
  async listAudit() { return copy(this.state.audit.sort((a, b) => b.createdAt.localeCompare(a.createdAt))) }
  async listBlockedTimes() { return copy(this.state.blockedTimes) }
  async createBlockedTime(input: Omit<BlockedTimeRecord, 'id' | 'isDemo'>) { const blocked = { ...input, id: `blocked-${randomUUID()}`, isDemo: true as const }; this.state.blockedTimes.push(blocked); return copy(blocked) }
  async getDashboardSummary(): Promise<DashboardSummary> { return { pendingRequests: this.state.requests.filter((request) => ['received', 'under_review'].includes(request.status)).length, confirmedAppointments: this.state.appointments.filter((appointment) => appointment.status === 'confirmed').length, activeServices: this.state.services.filter((service) => service.status === 'active').length, activeProfessionals: this.state.professionals.filter((professional) => professional.status === 'active').length, simulatedNotifications: this.state.notifications.length } }

  async getAdminByEmail(email: string) { return copy(this.state.admins.find((admin) => admin.email.toLowerCase() === email.toLowerCase() && admin.active)) }
  async getAdminById(id: string) { return copy(this.state.admins.find((admin) => admin.id === id && admin.active)) }
  async saveAdminUser(user: AdminUserRecord) { const existing = this.state.admins.findIndex((candidate) => candidate.id === user.id); if (existing >= 0) this.state.admins[existing] = copy(user); else this.state.admins.push(copy(user)); return copy(user) }
  async saveSession(session: AdminSessionRecord) { this.state.sessions.push(copy(session)) }
  async getSessionByTokenHash(tokenHash: string) { return copy(this.state.sessions.find((session) => session.tokenHash === tokenHash && !session.revokedAt && new Date(session.expiresAt).getTime() > Date.now())) }
  async revokeSession(id: string) { const session = this.state.sessions.find((candidate) => candidate.id === id); if (session) session.revokedAt = now() }
  async recordAudit(event: Omit<AuditEventRecord, 'id' | 'createdAt' | 'isDemo'>) { this.state.audit.push({ ...event, id: `audit-${randomUUID()}`, createdAt: now(), isDemo: true }) }

  private mustRequest(id: string) { const request = this.state.requests.find((candidate) => candidate.id === id); if (!request) throw new DomainError('NOT_FOUND', 'Solicitud no encontrada.', 404); return request }
  private mustService(id: string) { const service = this.state.services.find((candidate) => candidate.id === id); if (!service) throw new DomainError('NOT_FOUND', 'Servicio no encontrado.', 404); return service }
  private addNotification(type: string, requestId?: string, appointmentId?: string) { this.state.notifications.push({ id: `notification-${randomUUID()}`, type, channel: 'simulated', status: 'simulated', requestId, appointmentId, createdAt: now(), isDemo: true }) }
}

export { demoClinicId }
