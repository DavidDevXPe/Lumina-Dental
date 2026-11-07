CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE IF NOT EXISTS schema_migrations (
  version TEXT PRIMARY KEY,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS clinic_configuration (
  id TEXT PRIMARY KEY,
  country_code TEXT NOT NULL DEFAULT 'PE',
  currency_code TEXT NOT NULL DEFAULT 'PEN',
  time_zone TEXT NOT NULL DEFAULT 'America/Lima',
  locale TEXT NOT NULL DEFAULT 'es-PE',
  demo_mode BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  clinic_id TEXT NOT NULL REFERENCES clinic_configuration(id),
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes BETWEEN 15 AND 240),
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive')),
  is_demo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (clinic_id, slug)
);

CREATE TABLE IF NOT EXISTS professionals (
  id TEXT PRIMARY KEY,
  clinic_id TEXT NOT NULL REFERENCES clinic_configuration(id),
  display_name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  bio TEXT NOT NULL,
  image_asset_key TEXT,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive')),
  is_demo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS professional_services (
  professional_id TEXT NOT NULL REFERENCES professionals(id),
  service_id TEXT NOT NULL REFERENCES services(id),
  PRIMARY KEY (professional_id, service_id)
);

CREATE TABLE IF NOT EXISTS availability_rules (
  id TEXT PRIMARY KEY,
  clinic_id TEXT NOT NULL REFERENCES clinic_configuration(id),
  professional_id TEXT NOT NULL REFERENCES professionals(id),
  weekday SMALLINT NOT NULL CHECK (weekday BETWEEN 1 AND 7),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  effective_from DATE NOT NULL,
  effective_to DATE,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  is_demo BOOLEAN NOT NULL DEFAULT TRUE,
  CHECK (end_time > start_time)
);

CREATE TABLE IF NOT EXISTS blocked_times (
  id TEXT PRIMARY KEY,
  clinic_id TEXT NOT NULL REFERENCES clinic_configuration(id),
  professional_id TEXT NOT NULL REFERENCES professionals(id),
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  reason TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  is_demo BOOLEAN NOT NULL DEFAULT TRUE,
  CHECK (ends_at > starts_at)
);

CREATE TABLE IF NOT EXISTS appointment_requests (
  id TEXT PRIMARY KEY,
  clinic_id TEXT NOT NULL REFERENCES clinic_configuration(id),
  service_id TEXT NOT NULL REFERENCES services(id),
  professional_id TEXT NOT NULL REFERENCES professionals(id),
  preferred_date DATE NOT NULL,
  preferred_start_time TIME NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  interest TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  preferred_channel TEXT NOT NULL CHECK (preferred_channel IN ('email', 'phone', 'whatsapp')),
  status TEXT NOT NULL CHECK (status IN ('received', 'under_review', 'confirmed_manual', 'rejected', 'reschedule_requested', 'cancellation_requested', 'closed')),
  is_demo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  clinic_id TEXT NOT NULL REFERENCES clinic_configuration(id),
  request_id TEXT NOT NULL UNIQUE REFERENCES appointment_requests(id),
  service_id TEXT NOT NULL REFERENCES services(id),
  professional_id TEXT NOT NULL REFERENCES professionals(id),
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  time_zone TEXT NOT NULL DEFAULT 'America/Lima',
  status TEXT NOT NULL CHECK (status IN ('confirmed', 'reschedule_requested', 'cancellation_requested', 'cancelled', 'completed', 'closed')),
  is_demo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (ends_at > starts_at)
);

CREATE INDEX IF NOT EXISTS appointments_professional_time_idx ON appointments (professional_id, starts_at, ends_at);
CREATE INDEX IF NOT EXISTS appointment_requests_status_idx ON appointment_requests (status, created_at DESC);
CREATE INDEX IF NOT EXISTS blocked_times_professional_time_idx ON blocked_times (professional_id, starts_at, ends_at);

DO $$ BEGIN
  ALTER TABLE appointments ADD CONSTRAINT appointments_no_overlap
    EXCLUDE USING gist (
      professional_id WITH =,
      tstzrange(starts_at, ends_at, '[)') WITH &&
    ) WHERE (status IN ('confirmed', 'reschedule_requested'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'operator', 'editor')),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  is_demo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id TEXT PRIMARY KEY,
  admin_user_id TEXT NOT NULL REFERENCES admin_users(id),
  token_hash TEXT NOT NULL UNIQUE,
  csrf_token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notification_events (
  id TEXT PRIMARY KEY,
  appointment_request_id TEXT REFERENCES appointment_requests(id),
  appointment_id TEXT REFERENCES appointments(id),
  type TEXT NOT NULL,
  channel TEXT NOT NULL DEFAULT 'simulated' CHECK (channel = 'simulated'),
  status TEXT NOT NULL CHECK (status IN ('queued', 'simulated', 'failed')),
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_events (
  id TEXT PRIMARY KEY,
  admin_user_id TEXT REFERENCES admin_users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  request_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO schema_migrations (version) VALUES ('0001_initial') ON CONFLICT (version) DO NOTHING;
