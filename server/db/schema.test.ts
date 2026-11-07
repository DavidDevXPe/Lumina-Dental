import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

describe('initial migration', () => {
  it('contains the approved entities and booking safety constraints', () => {
    const migration = readFileSync(resolve(process.cwd(), 'db/migrations/0001_initial.sql'), 'utf8')
    expect(migration).toContain('CREATE TABLE IF NOT EXISTS appointment_requests')
    expect(migration).toContain('CREATE TABLE IF NOT EXISTS appointments')
    expect(migration).toContain('CREATE TABLE IF NOT EXISTS notification_events')
    expect(migration).toContain('EXCLUDE USING gist')
    expect(migration).toContain("status IN ('confirmed', 'reschedule_requested')")
    expect(migration).toContain('is_demo BOOLEAN NOT NULL DEFAULT TRUE')
    expect(migration).not.toMatch(/DROP TABLE|TRUNCATE TABLE|migrate reset/i)
  })
})
