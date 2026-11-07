import { useEffect, useState, type FormEvent } from 'react'
import { Check, ClipboardList, LogIn, LogOut, RefreshCw, ShieldCheck, X } from 'lucide-react'
import type { AdminRole, AppointmentRequestRecord, BlockedTimeRecord, DashboardSummary, ProfessionalRecord, ServiceRecord } from '../../shared/contracts'
import { apiClient, ApiClientError } from '../lib/api'
import '../admin.css'

interface User { id: string; email: string; role: AdminRole; isDemo: true }

export function AdminPanel() {
  const [user, setUser] = useState<User | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [requests, setRequests] = useState<AppointmentRequestRecord[]>([])
  const [services, setServices] = useState<ServiceRecord[]>([])
  const [professionals, setProfessionals] = useState<ProfessionalRecord[]>([])
  const [audit, setAudit] = useState<Array<{ id: string; action: string; entityType: string; createdAt: string }>>([])
  const [blockedTimes, setBlockedTimes] = useState<BlockedTimeRecord[]>([])
  const [view, setView] = useState<'requests' | 'catalog' | 'schedule' | 'audit'>('requests')
  const [blockForm, setBlockForm] = useState({ professionalId: '', date: '2030-05-20', startTime: '13:00', endTime: '14:00', reason: 'Bloqueo demo de mantenimiento' })
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')

  const load = async () => {
    setBusy(true)
    try {
      const canOperateRequests = user?.role !== 'editor'
      const [nextSummary, nextRequests, nextServices, nextProfessionals, nextBlockedTimes] = await Promise.all([
        apiClient.dashboard(),
        canOperateRequests ? apiClient.requests() : Promise.resolve([]),
        apiClient.services(),
        apiClient.professionals(),
        canOperateRequests ? apiClient.blockedTimes() : Promise.resolve([]),
      ])
      setSummary(nextSummary)
      setRequests(nextRequests)
      setServices(nextServices)
      setProfessionals(nextProfessionals)
      setBlockedTimes(nextBlockedTimes)
      setBlockForm((current) => ({ ...current, professionalId: current.professionalId || nextProfessionals[0]?.id || '' }))
      if (user?.role === 'admin') setAudit(await apiClient.audit())
    } catch (error) {
      setNotice(error instanceof ApiClientError ? error.message : 'No se pudo cargar el panel demo.')
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => { apiClient.me().then(setUser).catch(() => setUser(null)) }, [])
  useEffect(() => { if (user) void load() }, [user])

  const login = async (event: FormEvent) => {
    event.preventDefault()
    setBusy(true)
    setLoginError('')
    try {
      setUser(await apiClient.login(email, password))
      setPassword('')
    } catch (error) {
      setLoginError(error instanceof ApiClientError ? error.message : 'No se pudo iniciar sesión.')
    } finally {
      setBusy(false)
    }
  }

  const transition = async (id: string, action: 'confirm' | 'reject' | 'cancel') => {
    setBusy(true)
    setNotice('')
    try {
      await apiClient.transitionRequest(id, action)
      await load()
      setNotice('Acción demo registrada y notificación simulada creada.')
    } catch (error) {
      setNotice(error instanceof ApiClientError ? error.message : 'No se pudo actualizar la solicitud.')
    } finally {
      setBusy(false)
    }
  }

  const toggleService = async (service: ServiceRecord) => {
    setBusy(true)
    try {
      await apiClient.updateServiceStatus(service.id, service.status === 'active' ? 'inactive' : 'active')
      await load()
      setNotice('Estado del servicio demo actualizado.')
    } catch (error) {
      setNotice(error instanceof ApiClientError ? error.message : 'No se pudo actualizar el servicio demo.')
    } finally {
      setBusy(false)
    }
  }

  const toggleProfessional = async (professional: ProfessionalRecord) => {
    setBusy(true)
    try {
      await apiClient.updateProfessionalStatus(professional.id, professional.status === 'active' ? 'inactive' : 'active')
      await load()
      setNotice('Estado del perfil demo actualizado.')
    } catch (error) {
      setNotice(error instanceof ApiClientError ? error.message : 'No se pudo actualizar el perfil demo.')
    } finally {
      setBusy(false)
    }
  }

  const logout = async () => {
    try { await apiClient.logout() } finally { setUser(null); setSummary(null) }
  }

  const createBlock = async (event: FormEvent) => {
    event.preventDefault()
    setBusy(true)
    try {
      await apiClient.createBlockedTime({ ...blockForm, active: true })
      await load()
      setNotice('Bloqueo demo creado. La disponibilidad se recalculará en la API.')
    } catch (error) {
      setNotice(error instanceof ApiClientError ? error.message : 'No se pudo crear el bloqueo demo.')
    } finally {
      setBusy(false)
    }
  }

  if (!user) {
    return (
      <section className="admin-panel admin-login" aria-labelledby="admin-title">
        <div className="admin-login-copy">
          <span className="admin-eyebrow"><ShieldCheck size={15} /> Área operativa demo</span>
          <h2 id="admin-title">Un pequeño centro de control para una experiencia cuidada.</h2>
          <p>Acceso local para revisar solicitudes ficticias. No uses credenciales reales ni introduzcas información de pacientes.</p>
        </div>
        <form onSubmit={login} className="admin-login-form">
          <label>Correo de administración<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" required placeholder="admin@example.invalid" /></label>
          <label>Contraseña local<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>
          {loginError && <p className="admin-error" role="alert">{loginError}</p>}
          <button className="admin-primary" type="submit" disabled={busy}><LogIn size={16} /> {busy ? 'Validando…' : 'Entrar al panel'}</button>
          <small>La cuenta debe crearse con el comando local `npm.cmd run admin:init`.</small>
        </form>
      </section>
    )
  }

  const canEditCatalog = user.role === 'admin' || user.role === 'editor'

  return (
    <section className="admin-panel" aria-labelledby="admin-title">
      <header className="admin-header">
        <div>
          <span className="admin-eyebrow"><ShieldCheck size={15} /> Lúmina · operaciones demo</span>
          <h2 id="admin-title">Panel de coordinación</h2>
          <p>Fixtures aislados · rol {user.role} · sin comunicaciones externas</p>
        </div>
        <div className="admin-header-actions">
          <button className="admin-icon-button" type="button" onClick={() => void load()} disabled={busy} aria-label="Actualizar panel"><RefreshCw size={17} /></button>
          <button className="admin-logout" type="button" onClick={() => void logout()}><LogOut size={16} /> Salir</button>
        </div>
      </header>

      {notice && <p className="admin-notice" role="status">{notice}</p>}
      <div className="admin-metrics">
        {[
          ['Solicitudes pendientes', summary?.pendingRequests ?? '—'],
          ['Citas confirmadas', summary?.confirmedAppointments ?? '—'],
          ['Servicios activos', summary?.activeServices ?? '—'],
          ['Avisos simulados', summary?.simulatedNotifications ?? '—'],
        ].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
      </div>

      <nav className="admin-tabs" aria-label="Secciones del panel">
        <button className={view === 'requests' ? 'is-active' : ''} type="button" onClick={() => setView('requests')}><ClipboardList size={16} /> Solicitudes</button>
        <button className={view === 'catalog' ? 'is-active' : ''} type="button" onClick={() => setView('catalog')}>Catálogo y equipo</button>
        {(user.role === 'admin' || user.role === 'operator') && <button className={view === 'schedule' ? 'is-active' : ''} type="button" onClick={() => setView('schedule')}>Horarios y bloqueos</button>}
        {user.role === 'admin' && <button className={view === 'audit' ? 'is-active' : ''} type="button" onClick={() => setView('audit')}>Auditoría</button>}
      </nav>

      {view === 'requests' && (
        <div className="admin-content">
          <div className="admin-content-heading"><div><span className="admin-eyebrow">Bandeja de entrada</span><h3>Solicitudes para revisar</h3></div><span>{requests.length} registros demo</span></div>
          <div className="admin-request-list">
            {requests.length ? requests.map((request) => (
              <article className="admin-request" key={request.id}>
                <div className="admin-request-main">
                  <span className={`admin-status status-${request.status}`}>{request.status.replaceAll('_', ' ')}</span>
                  <h4>{request.name}</h4>
                  <p>{request.email} · {request.date} · {request.startTime} · {request.preferredChannel}</p>
                  <small>{services.find((service) => service.id === request.serviceId)?.name ?? request.serviceId} · {professionals.find((professional) => professional.id === request.professionalId)?.displayName ?? request.professionalId}</small>
                  <em>{request.notes || 'Sin notas de conversación.'}</em>
                </div>
                <div className="admin-request-actions">
                  {['received', 'under_review'].includes(request.status) && <><button type="button" onClick={() => void transition(request.id, 'confirm')} disabled={busy}><Check size={15} /> Confirmar</button><button type="button" onClick={() => void transition(request.id, 'reject')} disabled={busy}><X size={15} /> Rechazar</button></>}
                  {request.status === 'confirmed_manual' && <button type="button" onClick={() => void transition(request.id, 'cancel')} disabled={busy}><X size={15} /> Solicitar cancelación</button>}
                </div>
              </article>
            )) : <p className="admin-empty">No hay solicitudes para mostrar.</p>}
          </div>
        </div>
      )}

      {view === 'catalog' && (
        <div className="admin-content admin-catalog">
          <div>
            <span className="admin-eyebrow">Catálogo demo</span>
            <h3>Servicios demo</h3>
            {services.map((service) => (
              <article key={service.id}>
                <div className="admin-catalog-item-head"><div><strong>{service.name}</strong><span>{service.durationMinutes} min · {service.status}</span></div>{canEditCatalog && <button className="admin-catalog-toggle" type="button" onClick={() => void toggleService(service)} disabled={busy} aria-pressed={service.status === 'active'}>{service.status === 'active' ? 'Desactivar' : 'Activar'}</button>}</div>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
          <div>
            <span className="admin-eyebrow">Perfiles demostrativos</span>
            <h3>Especialistas</h3>
            {professionals.map((professional) => (
              <article key={professional.id}>
                <div className="admin-catalog-item-head"><div><strong>{professional.displayName}</strong><span>{professional.specialty} · {professional.status}</span></div>{canEditCatalog && <button className="admin-catalog-toggle" type="button" onClick={() => void toggleProfessional(professional)} disabled={busy} aria-pressed={professional.status === 'active'}>{professional.status === 'active' ? 'Desactivar' : 'Activar'}</button>}</div>
                <p>{professional.bio}</p>
              </article>
            ))}
          </div>
        </div>
      )}

      {view === 'schedule' && (
        <div className="admin-content admin-schedule">
          <div>
            <span className="admin-eyebrow">Reglas demo</span>
            <h3>Disponibilidad configurable</h3>
            <p>Los horarios base son lunes a viernes, 09:00–17:00, en `America/Lima`. Los bloqueos afectan la consulta pública.</p>
            <form onSubmit={createBlock} className="admin-block-form">
              <label>Especialista<select value={blockForm.professionalId} onChange={(event) => setBlockForm({ ...blockForm, professionalId: event.target.value })}>{professionals.map((professional) => <option key={professional.id} value={professional.id}>{professional.displayName}</option>)}</select></label>
              <label>Fecha<input type="date" value={blockForm.date} onChange={(event) => setBlockForm({ ...blockForm, date: event.target.value })} /></label>
              <div className="admin-schedule-times"><label>Inicio<input type="time" value={blockForm.startTime} onChange={(event) => setBlockForm({ ...blockForm, startTime: event.target.value })} /></label><label>Fin<input type="time" value={blockForm.endTime} onChange={(event) => setBlockForm({ ...blockForm, endTime: event.target.value })} /></label></div>
              <label>Motivo demo<input value={blockForm.reason} onChange={(event) => setBlockForm({ ...blockForm, reason: event.target.value })} /></label>
              <button type="submit" className="admin-primary" disabled={busy}>Crear bloqueo demo</button>
            </form>
          </div>
          <div>
            <span className="admin-eyebrow">Bloqueos registrados</span>
            <h3>Agenda protegida</h3>
            <div className="admin-block-list">{blockedTimes.map((blocked) => <article key={blocked.id}><strong>{blocked.date} · {blocked.startTime}–{blocked.endTime}</strong><span>{professionals.find((professional) => professional.id === blocked.professionalId)?.displayName ?? blocked.professionalId}</span><p>{blocked.reason}</p></article>)}</div>
          </div>
        </div>
      )}

      {view === 'audit' && (
        <div className="admin-content">
          <div className="admin-content-heading"><div><span className="admin-eyebrow">Trazabilidad</span><h3>Acciones administrativas</h3></div></div>
          <div className="admin-audit-list">{audit.map((event) => <div key={event.id}><strong>{event.action}</strong><span>{event.entityType} · {new Date(event.createdAt).toLocaleString('es-PE')}</span></div>)}</div>
        </div>
      )}
    </section>
  )
}
