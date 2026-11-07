import { Pool } from 'pg'
import { demoClinicId, demoProfessionals, demoServices } from '../fixtures/demo.js'

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error('DATABASE_URL es obligatorio para db:seed')

const pool = new Pool({ connectionString })
try {
  await pool.query('BEGIN')
  await pool.query(
    `INSERT INTO clinic_configuration (id, country_code, currency_code, time_zone, locale, demo_mode)
     VALUES ($1, 'PE', 'PEN', 'America/Lima', 'es-PE', TRUE)
     ON CONFLICT (id) DO UPDATE SET demo_mode = TRUE, updated_at = now()`,
    [demoClinicId],
  )
  for (const service of demoServices) {
    await pool.query(
      `INSERT INTO services (id, clinic_id, slug, name, description, duration_minutes, status, is_demo)
       VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE)
       ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, duration_minutes = EXCLUDED.duration_minutes, status = EXCLUDED.status, updated_at = now()`,
      [service.id, service.clinicId, service.slug, service.name, service.description, service.durationMinutes, service.status],
    )
  }
  for (const professional of demoProfessionals) {
    await pool.query(
      `INSERT INTO professionals (id, clinic_id, display_name, specialty, bio, image_asset_key, status, is_demo)
       VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE)
       ON CONFLICT (id) DO UPDATE SET display_name = EXCLUDED.display_name, specialty = EXCLUDED.specialty, bio = EXCLUDED.bio, image_asset_key = EXCLUDED.image_asset_key, status = EXCLUDED.status, updated_at = now()`,
      [professional.id, professional.clinicId, professional.displayName, professional.specialty, professional.bio, professional.imageAssetKey, professional.status],
    )
    for (const serviceId of professional.serviceIds) {
      await pool.query('INSERT INTO professional_services (professional_id, service_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [professional.id, serviceId])
    }
    for (let weekday = 1; weekday <= 5; weekday += 1) {
      await pool.query(
        `INSERT INTO availability_rules (id, clinic_id, professional_id, weekday, start_time, end_time, effective_from, active, is_demo)
         VALUES ($1, $2, $3, $4, '09:00', '17:00', '2030-01-01', TRUE, TRUE)
         ON CONFLICT (id) DO NOTHING`,
        [`rule-${professional.id}-${weekday}`, demoClinicId, professional.id, weekday],
      )
    }
  }
  await pool.query('COMMIT')
  console.log('Fixtures demo sembradas sin credenciales administrativas.')
} catch (error) {
  await pool.query('ROLLBACK')
  throw error
} finally {
  await pool.end()
}
