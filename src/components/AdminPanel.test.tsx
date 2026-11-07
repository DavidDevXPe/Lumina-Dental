import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AdminPanel } from './AdminPanel'

describe('AdminPanel', () => {
  let root: Root
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, status: 401, json: async () => ({ code: 'AUTH_REQUIRED', message: 'Inicia sesión para continuar.' }) })))
    root = createRoot(container)
  })

  afterEach(() => { root.unmount(); container.remove(); vi.unstubAllGlobals() })

  it('starts behind a real login form without default credentials', async () => {
    await act(async () => { root.render(<AdminPanel />); await Promise.resolve() })
    expect(container.querySelector('input[type="email"]')).not.toBeNull()
    expect(container.querySelector('input[type="password"]')?.getAttribute('value')).not.toBe('demo-password-123')
    expect(container.textContent).toContain('No uses credenciales reales')
  })
})
