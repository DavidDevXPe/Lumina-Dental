import type { AdminRole, AppointmentRecord, AppointmentRequestInput, AppointmentRequestRecord, AvailabilitySlot, DashboardSummary, ProfessionalRecord, RequestStatus, ServiceRecord, ServiceStatus } from '../../shared/contracts.js'

export interface AdminUserRecord {
  id: string
  email: string
  passwordHash: string
  role: AdminRole
  active: boolean
  isDemo: true
}

export interface AdminSessionRecord {
  id: string
  adminUserId: string
  tokenHash: string
  csrfTokenHash: string
  expiresAt: string
  revokedAt: string | null
}

export interface NotificationRecord {
  id: string
  type: string
  channel: 'simulated'
  status: 'queued' | 'simulated' | 'failed'
  requestId?: string
  appointmentId?: string
  createdAt: string
  isDemo: true
}

export interface AuditEventRecord {
  id: string
  adminUserId: string | null
  action: string
  entityType: string
  entityId: string | null
  requestId: string
  createdAt: string
  isDemo: true
}

export interface BlockedTimeRecord {
  id: string
  professionalId: string
  date: string
  startTime: string
  endTime: string
  reason: string
  active: boolean
  isDemo: true
}

export interface AvailabilityQuery {
  serviceId: string
  professionalId: string
  date: string
}

export interface LuminaRepository {
  listServices(): Promise<ServiceRecord[]>
  listAdminServices(): Promise<ServiceRecord[]>
  listProfessionals(serviceId?: string): Promise<ProfessionalRecord[]>
  listAdminProfessionals(): Promise<ProfessionalRecord[]>
  getService(id: string): Promise<ServiceRecord | undefined>
  getProfessional(id: string): Promise<ProfessionalRecord | undefined>
  setServiceStatus(id: string, status: ServiceStatus): Promise<ServiceRecord>
  setProfessionalStatus(id: string, status: ServiceStatus): Promise<ProfessionalRecord>
  getAvailability(query: AvailabilityQuery): Promise<AvailabilitySlot[]>
  createAppointmentRequest(input: AppointmentRequestInput): Promise<AppointmentRequestRecord>
  listRequests(status?: RequestStatus): Promise<AppointmentRequestRecord[]>
  getRequest(id: string): Promise<AppointmentRequestRecord | undefined>
  reviewRequest(id: string): Promise<AppointmentRequestRecord>
  confirmRequest(id: string): Promise<{ request: AppointmentRequestRecord; appointment: AppointmentRecord }>
  rejectRequest(id: string): Promise<AppointmentRequestRecord>
  proposeReschedule(id: string, date: string, startTime: string): Promise<AppointmentRequestRecord>
  requestCancellation(id: string): Promise<AppointmentRequestRecord>
  listAppointments(): Promise<AppointmentRecord[]>
  listNotifications(): Promise<NotificationRecord[]>
  listAudit(): Promise<AuditEventRecord[]>
  listBlockedTimes(): Promise<BlockedTimeRecord[]>
  createBlockedTime(input: Omit<BlockedTimeRecord, 'id' | 'isDemo'>): Promise<BlockedTimeRecord>
  getDashboardSummary(): Promise<DashboardSummary>
  getAdminByEmail(email: string): Promise<AdminUserRecord | undefined>
  getAdminById(id: string): Promise<AdminUserRecord | undefined>
  saveAdminUser(user: AdminUserRecord): Promise<AdminUserRecord>
  saveSession(session: AdminSessionRecord): Promise<void>
  getSessionByTokenHash(tokenHash: string): Promise<AdminSessionRecord | undefined>
  revokeSession(id: string): Promise<void>
  recordAudit(event: Omit<AuditEventRecord, 'id' | 'createdAt' | 'isDemo'>): Promise<void>
}
