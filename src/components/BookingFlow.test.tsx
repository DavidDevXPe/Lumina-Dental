import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { BookingFlow } from './BookingFlow'

describe('BookingFlow', () => {
  let root: Root
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    vi.stubGlobal('fetch', vi.fn(async (url: string) => {
      if (url.endsWith('/services')) return { ok: true, status: 200, json: async () => ({ data: [{ id: 'service-demo', clinicId: 'clinic-demo', slug: 'demo', name: 'Servicio demo', description: 'Descripción demo', durationMinutes: 60, status: 'active', isDemo: true, professionalIds: ['professional-demo'] }] }) }
      if (url.includes('/professionals')) return { ok: true, status: 200, json: async () => ({ data: [{ id: 'professional-demo', clinicId: 'clinic-demo', displayName: 'Profesional Demo', specialty: 'Perfil ficticio', bio: 'Demo', imageAssetKey: null, status: 'active', isDemo: true, serviceIds: ['service-demo'] }] }) }
      return { ok: true, status: 200, json: async () => ({ data: [{ id: 'slot-demo', serviceId: 'service-demo', professionalId: 'professional-demo', date: '2030-05-20', startTime: '10:00', endTime: '11:00', timeZone: 'America/Lima', isAvailable: true, isDemo: true }] }) }
    }))
    root = createRoot(container)
  })

  afterEach(() => { root.unmount(); container.remove(); vi.unstubAllGlobals() })

  it('exposes the demo warning and accessible step heading', async () => {
    await act(async () => { root.render(<BookingFlow />); await Promise.resolve() })
    expect(container.textContent).toContain('Entorno demostrativo. No introduzcas información personal ni médica real.')
    expect(container.querySelector('legend')?.textContent).toContain('1. Elige un servicio')
  })

  it('shows field errors instead of advancing without a service', async () => {
    await act(async () => { root.render(<BookingFlow />); await Promise.resolve() })
    const button = [...container.querySelectorAll('button')].find((element) => element.textContent?.includes('Ver horarios demo')) as HTMLButtonElement
    await act(async () => { button.click(); await Promise.resolve() })
    expect(container.textContent).toContain('Selecciona un servicio.')
    expect(container.textContent).toContain('Selecciona un especialista demo.')
  })
})
