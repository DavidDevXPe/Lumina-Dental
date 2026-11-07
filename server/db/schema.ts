import { boolean, date, integer, jsonb, pgTable, primaryKey, smallint, text, time, timestamp, unique, index } from 'drizzle-orm/pg-core'

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}

export const clinicConfiguration = pgTable('clinic_configuration', {
  id: text('id').primaryKey(), countryCode: text('country_code').notNull().default('PE'), currencyCode: text('currency_code').notNull().default('PEN'), timeZone: text('time_zone').notNull().default('America/Lima'), locale: text('locale').notNull().default('es-PE'), demoMode: boolean('demo_mode').notNull().default(true), ...timestamps,
})

export const services = pgTable('services', {
  id: text('id').primaryKey(), clinicId: text('clinic_id').notNull().references(() => clinicConfiguration.id), slug: text('slug').notNull(), name: text('name').notNull(), description: text('description').notNull(), durationMinutes: integer('duration_minutes').notNull(), status: text('status').notNull(), isDemo: boolean('is_demo').notNull().default(true), ...timestamps,
}, (table) => [unique('services_clinic_slug_unique').on(table.clinicId, table.slug)])

export const professionals = pgTable('professionals', {
  id: text('id').primaryKey(), clinicId: text('clinic_id').notNull().references(() => clinicConfiguration.id), displayName: text('display_name').notNull(), specialty: text('specialty').notNull(), bio: text('bio').notNull(), imageAssetKey: text('image_asset_key'), status: text('status').notNull(), isDemo: boolean('is_demo').notNull().default(true), ...timestamps,
})

export const professionalServices = pgTable('professional_services', {
  professionalId: text('professional_id').notNull().references(() => professionals.id), serviceId: text('service_id').notNull().references(() => services.id),
}, (table) => [primaryKey({ columns: [table.professionalId, table.serviceId] })])

export const availabilityRules = pgTable('availability_rules', {
  id: text('id').primaryKey(), clinicId: text('clinic_id').notNull().references(() => clinicConfiguration.id), professionalId: text('professional_id').notNull().references(() => professionals.id), weekday: smallint('weekday').notNull(), startTime: time('start_time').notNull(), endTime: time('end_time').notNull(), effectiveFrom: date('effective_from').notNull(), effectiveTo: date('effective_to'), active: boolean('active').notNull().default(true), isDemo: boolean('is_demo').notNull().default(true),
})

export const blockedTimes = pgTable('blocked_times', {
  id: text('id').primaryKey(), clinicId: text('clinic_id').notNull().references(() => clinicConfiguration.id), professionalId: text('professional_id').notNull().references(() => professionals.id), startsAt: timestamp('starts_at', { withTimezone: true }).notNull(), endsAt: timestamp('ends_at', { withTimezone: true }).notNull(), reason: text('reason').notNull(), active: boolean('active').notNull().default(true), isDemo: boolean('is_demo').notNull().default(true),
}, (table) => [index('blocked_times_professional_time_idx').on(table.professionalId, table.startsAt, table.endsAt)])

export const appointmentRequests = pgTable('appointment_requests', {
  id: text('id').primaryKey(), clinicId: text('clinic_id').notNull().references(() => clinicConfiguration.id), serviceId: text('service_id').notNull().references(() => services.id), professionalId: text('professional_id').notNull().references(() => professionals.id), preferredDate: date('preferred_date').notNull(), preferredStartTime: time('preferred_start_time').notNull(), name: text('name').notNull(), email: text('email').notNull(), interest: text('interest').notNull(), notes: text('notes').notNull().default(''), preferredChannel: text('preferred_channel').notNull(), status: text('status').notNull(), isDemo: boolean('is_demo').notNull().default(true), ...timestamps,
}, (table) => [index('appointment_requests_status_idx').on(table.status, table.createdAt)])

export const appointments = pgTable('appointments', {
  id: text('id').primaryKey(), clinicId: text('clinic_id').notNull().references(() => clinicConfiguration.id), requestId: text('request_id').notNull().unique().references(() => appointmentRequests.id), serviceId: text('service_id').notNull().references(() => services.id), professionalId: text('professional_id').notNull().references(() => professionals.id), startsAt: timestamp('starts_at', { withTimezone: true }).notNull(), endsAt: timestamp('ends_at', { withTimezone: true }).notNull(), timeZone: text('time_zone').notNull().default('America/Lima'), status: text('status').notNull(), isDemo: boolean('is_demo').notNull().default(true), ...timestamps,
}, (table) => [index('appointments_professional_time_idx').on(table.professionalId, table.startsAt, table.endsAt)])

export const adminUsers = pgTable('admin_users', {
  id: text('id').primaryKey(), email: text('email').notNull().unique(), passwordHash: text('password_hash').notNull(), role: text('role').notNull(), active: boolean('active').notNull().default(true), isDemo: boolean('is_demo').notNull().default(true), ...timestamps,
})

export const adminSessions = pgTable('admin_sessions', {
  id: text('id').primaryKey(), adminUserId: text('admin_user_id').notNull().references(() => adminUsers.id), tokenHash: text('token_hash').notNull().unique(), csrfTokenHash: text('csrf_token_hash').notNull(), expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(), revokedAt: timestamp('revoked_at', { withTimezone: true }), createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const notificationEvents = pgTable('notification_events', {
  id: text('id').primaryKey(), appointmentRequestId: text('appointment_request_id').references(() => appointmentRequests.id), appointmentId: text('appointment_id').references(() => appointments.id), type: text('type').notNull(), channel: text('channel').notNull().default('simulated'), status: text('status').notNull(), payload: jsonb('payload').notNull().default({}), createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const auditEvents = pgTable('audit_events', {
  id: text('id').primaryKey(), adminUserId: text('admin_user_id').references(() => adminUsers.id), action: text('action').notNull(), entityType: text('entity_type').notNull(), entityId: text('entity_id'), metadata: jsonb('metadata').notNull().default({}), requestId: text('request_id').notNull(), createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})
