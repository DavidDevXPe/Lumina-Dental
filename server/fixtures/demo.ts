import type { AppointmentRecord, AppointmentRequestRecord, ProfessionalRecord, ServiceRecord } from '../../shared/contracts.js'

export const demoClinicId = 'clinic-demo-lumina'

export const demoServices: ServiceRecord[] = [
  { id: 'service-demo-estetica', clinicId: demoClinicId, slug: 'estetica-ceramica', name: 'Estética & cerámica', description: 'Conversación demostrativa sobre alternativas estéticas y restauradoras.', durationMinutes: 60, status: 'active', isDemo: true, professionalIds: ['professional-demo-elena', 'professional-demo-clara'] },
  { id: 'service-demo-alineacion', clinicId: demoClinicId, slug: 'alineacion-digital', name: 'Alineación digital', description: 'Recorrido demostrativo de planificación y acompañamiento ortodóncico.', durationMinutes: 60, status: 'active', isDemo: true, professionalIds: ['professional-demo-mateo'] },
  { id: 'service-demo-restauracion', clinicId: demoClinicId, slug: 'restauracion-guiada', name: 'Restauración guiada', description: 'Explicación demostrativa de opciones de restauración, sin recomendación clínica.', durationMinutes: 90, status: 'active', isDemo: true, professionalIds: ['professional-demo-clara'] },
  { id: 'service-demo-prevencion', clinicId: demoClinicId, slug: 'cuidado-preventivo', name: 'Cuidado preventivo', description: 'Consulta demostrativa de hábitos y cuidado preventivo personalizado.', durationMinutes: 60, status: 'active', isDemo: true, professionalIds: ['professional-demo-elena', 'professional-demo-mateo'] },
]

export const demoProfessionals: ProfessionalRecord[] = [
  { id: 'professional-demo-elena', clinicId: demoClinicId, displayName: 'Dra. Elena Valdés', specialty: 'Estética dental · perfil ficticio', bio: 'Perfil demostrativo para la presentación editorial; credenciales y experiencia por confirmar.', imageAssetKey: 'stitch-dentist.webp', status: 'active', isDemo: true, serviceIds: ['service-demo-estetica', 'service-demo-prevencion'] },
  { id: 'professional-demo-mateo', clinicId: demoClinicId, displayName: 'Dr. Mateo Soria', specialty: 'Ortodoncia digital · perfil ficticio', bio: 'Perfil demostrativo para mostrar una conversación de planificación; no representa a una persona real.', imageAssetKey: 'stitch-orthodontist.webp', status: 'active', isDemo: true, serviceIds: ['service-demo-alineacion', 'service-demo-prevencion'] },
  { id: 'professional-demo-clara', clinicId: demoClinicId, displayName: 'Dra. Clara Mendoza', specialty: 'Restauración guiada · perfil ficticio', bio: 'Perfil demostrativo para portafolio; no incluye credenciales clínicas verificadas.', imageAssetKey: 'stitch-surgeon.webp', status: 'active', isDemo: true, serviceIds: ['service-demo-estetica', 'service-demo-restauracion'] },
]

export const demoRequests: AppointmentRequestRecord[] = [
  { id: 'request-demo-001', serviceId: 'service-demo-estetica', professionalId: 'professional-demo-elena', date: '2030-05-20', startTime: '10:00', name: 'Paciente Demo', email: 'paciente@example.invalid', interest: 'evaluacion', notes: 'Solicitud sintética de ejemplo.', preferredChannel: 'email', isDemo: true, status: 'under_review', createdAt: '2030-05-01T15:00:00.000Z' },
  { id: 'request-demo-conflict', serviceId: 'service-demo-prevencion', professionalId: 'professional-demo-mateo', date: '2030-05-21', startTime: '11:00', name: 'Paciente Conflicto Demo', email: 'conflicto@example.invalid', interest: 'prevencion', notes: 'Solicitud sintética para comprobar conflicto.', preferredChannel: 'email', isDemo: true, status: 'under_review', createdAt: '2030-05-02T15:00:00.000Z' },
]

export const demoAppointments: AppointmentRecord[] = [{
  id: 'appointment-demo-001', requestId: 'request-demo-000', serviceId: 'service-demo-prevencion', professionalId: 'professional-demo-mateo', date: '2030-05-21', startTime: '11:00', endTime: '12:00', timeZone: 'America/Lima', status: 'confirmed', isDemo: true, createdAt: '2030-05-01T15:00:00.000Z',
}]

export const demoAvailability = { weekdayStart: 1, weekdayEnd: 5, startHour: 9, endHour: 17, slotMinutes: 30, timeZone: 'America/Lima' as const }
