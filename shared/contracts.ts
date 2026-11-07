export type AdminRole = 'admin' | 'operator' | 'editor'
export type ServiceStatus = 'active' | 'inactive'
export type RequestStatus =
  | 'received'
  | 'under_review'
  | 'confirmed_manual'
  | 'rejected'
  | 'reschedule_requested'
  | 'cancellation_requested'
  | 'closed'
export type AppointmentStatus =
  | 'confirmed'
  | 'reschedule_requested'
  | 'cancellation_requested'
  | 'cancelled'
  | 'completed'
  | 'closed'

export type PreferredChannel = 'email' | 'phone' | 'whatsapp'

export interface ServiceRecord {
  id: string
  clinicId: string
  slug: string
  name: string
  description: string
  durationMinutes: number
  status: ServiceStatus
  isDemo: true
  professionalIds: string[]
}

export interface ProfessionalRecord {
  id: string
  clinicId: string
  displayName: string
  specialty: string
  bio: string
  imageAssetKey: string | null
  status: ServiceStatus
  isDemo: true
  serviceIds: string[]
}

export interface AvailabilitySlot {
  id: string
  serviceId: string
  professionalId: string
  date: string
  startTime: string
  endTime: string
  timeZone: 'America/Lima'
  isAvailable: boolean
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

export interface AppointmentRequestInput {
  serviceId: string
  professionalId: string
  date: string
  startTime: string
  name: string
  email: string
  interest: string
  notes: string
  preferredChannel: PreferredChannel
  isDemo: true
}

export interface AppointmentRequestRecord extends AppointmentRequestInput {
  id: string
  status: RequestStatus
  createdAt: string
}

export interface AppointmentRecord {
  id: string
  requestId: string
  serviceId: string
  professionalId: string
  date: string
  startTime: string
  endTime: string
  timeZone: 'America/Lima'
  status: AppointmentStatus
  isDemo: true
  createdAt: string
}

export interface ApiError {
  code: string
  message: string
  fieldErrors?: Record<string, string>
  requestId: string
}

export interface DashboardSummary {
  pendingRequests: number
  confirmedAppointments: number
  activeServices: number
  activeProfessionals: number
  simulatedNotifications: number
}
