import type { AdminRole, AppointmentRequestInput, AppointmentRequestRecord, AvailabilitySlot, BlockedTimeRecord, DashboardSummary, ProfessionalRecord, ServiceRecord } from '../../shared/contracts'

export class ApiClientError extends Error {
  constructor(public readonly code: string, message: string, public readonly fieldErrors?: Record<string, string>, public readonly status = 500) { super(message) }
}

function readCookie(name: string): string | undefined {
  return document.cookie.split('; ').find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1)
}

async function request<T>(url: string, init: RequestInit = {}): Promise<T> {
  const method = init.method ?? 'GET'
  const headers = new Headers(init.headers)
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  if (method !== 'GET' && method !== 'HEAD') {
    const csrf = readCookie('lumina_csrf')
    if (csrf) headers.set('x-csrf-token', decodeURIComponent(csrf))
  }
  const response = await fetch(`/api/v1${url}`, { ...init, headers, credentials: 'include' })
  const payload = await response.json().catch(() => ({})) as { data?: T; code?: string; message?: string; fieldErrors?: Record<string, string>; requestId?: string }
  if (!response.ok) throw new ApiClientError(payload.code ?? 'REQUEST_FAILED', payload.message ?? 'No se pudo completar la solicitud.', payload.fieldErrors, response.status)
  return payload.data as T
}

export const apiClient = {
  getServices: () => request<ServiceRecord[]>('/services'),
  getProfessionals: (serviceId?: string) => request<ProfessionalRecord[]>(`/professionals${serviceId ? `?serviceId=${encodeURIComponent(serviceId)}` : ''}`),
  getAvailability: (query: { serviceId: string; professionalId: string; date: string }) => request<AvailabilitySlot[]>(`/availability?serviceId=${encodeURIComponent(query.serviceId)}&professionalId=${encodeURIComponent(query.professionalId)}&date=${encodeURIComponent(query.date)}`),
  createAppointmentRequest: (input: AppointmentRequestInput) => request<AppointmentRequestRecord>('/appointment-requests', { method: 'POST', body: JSON.stringify(input) }),
  login: (email: string, password: string) => request<{ id: string; email: string; role: AdminRole; isDemo: true }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  logout: () => request<{ loggedOut: true }>('/auth/logout', { method: 'POST' }),
  me: () => request<{ id: string; email: string; role: AdminRole; isDemo: true }>('/auth/me'),
  dashboard: () => request<DashboardSummary>('/admin/dashboard'),
  requests: () => request<AppointmentRequestRecord[]>('/admin/requests'),
  appointments: () => request('/admin/appointments'),
  notifications: () => request('/admin/notifications'),
  audit: () => request<Array<{ id: string; action: string; entityType: string; createdAt: string }>>('/admin/audit'),
  services: () => request<ServiceRecord[]>('/admin/services'),
  professionals: () => request<ProfessionalRecord[]>('/admin/professionals'),
  updateServiceStatus: (id: string, status: ServiceRecord['status']) => request<ServiceRecord>(`/admin/services/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  updateProfessionalStatus: (id: string, status: ProfessionalRecord['status']) => request<ProfessionalRecord>(`/admin/professionals/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  blockedTimes: () => request<BlockedTimeRecord[]>('/admin/blocked-times'),
  createBlockedTime: (input: Omit<BlockedTimeRecord, 'id' | 'isDemo'>) => request<BlockedTimeRecord>('/admin/blocked-times', { method: 'POST', body: JSON.stringify(input) }),
  transitionRequest: (id: string, action: 'review' | 'confirm' | 'reject' | 'cancel', body?: { date: string; startTime: string }) => request<AppointmentRequestRecord | { request: AppointmentRequestRecord; appointment: unknown }>(`/admin/requests/${id}/${action}`, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
}
