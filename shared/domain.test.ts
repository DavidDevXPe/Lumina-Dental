import { describe, expect, it } from 'vitest'
import { canTransitionAppointment, canTransitionRequest, intervalsOverlap, isSlotAvailable } from './domain.js'

describe('availability domain', () => {
  it('detects partial overlap and keeps adjacent slots available', () => {
    expect(intervalsOverlap({ start: '10:00', end: '11:00' }, { start: '10:30', end: '11:30' })).toBe(true)
    expect(intervalsOverlap({ start: '10:00', end: '11:00' }, { start: '11:00', end: '12:00' })).toBe(false)
    expect(isSlotAvailable([{ start: '10:00', end: '11:00' }], { start: '11:00', end: '12:00' })).toBe(true)
  })
})

describe('state transitions', () => {
  it('keeps initial requests separate from confirmed appointments', () => {
    expect(canTransitionRequest('received', 'under_review')).toBe(true)
    expect(canTransitionRequest('received', 'confirmed_manual')).toBe(false)
    expect(canTransitionAppointment('confirmed', 'cancelled')).toBe(true)
    expect(canTransitionAppointment('cancelled', 'confirmed')).toBe(false)
  })
})
