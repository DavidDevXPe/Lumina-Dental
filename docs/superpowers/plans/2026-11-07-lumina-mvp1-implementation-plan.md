# Lúmina Dental MVP-1 Implementation Plan

> **For agentic workers:** Use `executing-plans` to implement this plan task-by-task. No commits are created because the project authorization explicitly prohibits commits and push.

**Goal:** Implement a functional, demonstrative MVP-1 for Lúmina Dental with a public React flow, modular Fastify API, PostgreSQL persistence path, protected admin panel, simulated notifications and evidence-based tests.

**Architecture:** A modular monolith exposes REST `/api/v1`. Domain services depend on repository interfaces, with a deterministic demo repository for local/tests and a Drizzle/PostgreSQL repository for configured local persistence. The existing editorial React/Vite frontend remains the visual base and gains public booking and admin states without a generic dashboard template.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS v4, Fastify, Drizzle ORM, `pg`, `argon2`, Vitest, jsdom.

**Spec:** `docs/superpowers/specs/2026-11-07-lumina-mvp1-design.md`; functional authority: `docs/architecture/12-alcance-definitivo-mvp.md` and `13-especificacion-funcional-aprobacion.md`.

## Global Constraints

- Work only in `C:\Users\hecto\OneDrive\Desktop\demo-clinica-dental`.
- Keep all content, professionals, location, schedules and requests demonstrative; never add medical data or official claims.
- No real payment, email, SMS, WhatsApp, calendar, portal clinical, publish, deploy, MCP, hooks, commits or push.
- Keep React/Vite/Tailwind/Lucide and the Warm Editorial Atelier palette and local assets/fonts.
- Never store credentials or contact form data in `localStorage`; do not ship a default admin password.
- Use `America/Lima` for local schedule presentation and UTC for persisted instants.
- Do not use destructive database reset, drop or truncate operations.

## Review Focus

- A request must never become a confirmed appointment automatically; test the state boundary in the domain service.
- Two confirmations for one professional and overlapping interval must produce one success and one `409`/conflict; test both demo and PostgreSQL paths where available.
- Expired/invalid sessions, CSRF failures and insufficient roles must not reach admin mutations; test negative cases.
- Unknown service/professional/date/slot and oversized or clinical-looking form content must return bounded validation errors without persistence.
- The frontend must preserve accessible labels, focus/error association, menu keyboard behavior and demo warnings while API states load or fail.

---

### Task 1: Dependency and build configuration

**Files:**
- Modify: `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`
- Create: `tsconfig.server.json`
- Test: command-level typecheck after implementation

**Interfaces:**
- Produces scripts `typecheck`, `server:dev`, `server:build`, `db:migrate`, `db:seed` and server compiler settings consumed by later tasks.

- [ ] Add only required runtime/dev packages: Fastify, cookie plugin, Drizzle ORM, `pg`, `argon2`, `tsx`, `@types/node`, and `@types/pg` if required by installed package metadata.
- [ ] Add `typecheck`, `server:dev`, `server:build`, `db:migrate` and `db:seed` scripts without changing existing `test` or `build` behavior.
- [ ] Configure Vite `/api` proxy to `http://localhost:3001` for local development.
- [ ] Add a server TypeScript project that compiles `server/` and `shared/` without emitting into `src/`.
- [ ] Run `npm.cmd install` and `npm.cmd run typecheck`; record real output and resolve only caused errors.

### Task 2: Shared contracts, validation and domain model

**Files:**
- Create: `shared/contracts.ts`, `shared/validation.ts`, `shared/domain.ts`
- Modify: `src/lib/validation.ts`, `src/lib/validation.test.ts`
- Test: `shared/validation.test.ts`, `shared/domain.test.ts`

**Interfaces:**
- `AppointmentRequestInput`, `AvailabilitySlot`, `ServiceRecord`, `ProfessionalRecord`, `ApiError`, `AdminRole`, `RequestStatus`, `AppointmentStatus`.
- `validateAppointmentRequest(input): FieldErrors` and `isSlotAvailable(existing, candidate): boolean`.

- [ ] Write failing tests for required fields, bounded strings, synthetic-contact warning, state transitions and overlapping intervals.
- [ ] Implement shared types and pure validation with no database or framework imports.
- [ ] Keep the public input limited to service, professional, date, slot, name, email, interest, notes, preferred channel and `isDemo=true`.
- [ ] Run the focused Vitest tests and then the existing validation tests.

### Task 3: Database schema, migration and fixtures

**Files:**
- Create: `server/db/schema.ts`, `server/db/client.ts`, `server/db/migrate.ts`, `server/db/seed.ts`, `db/migrations/0001_initial.sql`, `server/fixtures/demo.ts`, `.env.example`, `src/vite-env.d.ts` update only if needed.
- Test: `server/db/schema.test.ts` or static migration assertions

**Interfaces:**
- `createDatabase(url)`, `runMigrations(url)`, `seedDatabase(url)`.
- Drizzle tables for configuration, services, professionals, professional-service relation, availability rules, blocked times, requests, appointments, admin users/sessions, notifications and audit events.

- [ ] Write migration assertions for required tables, FKs, indexes, `is_demo`, UTC timestamps, role/status checks and the non-overlapping appointment constraint.
- [ ] Implement reviewable SQL using `CREATE TABLE IF NOT EXISTS`; never reset, drop or truncate.
- [ ] Implement Drizzle schema aligned with SQL and fixtures with synthetic emails such as `.invalid` or `.demo`.
- [ ] Implement migrations/seed as explicit scripts; seed must be idempotent and must not create a public default admin password.
- [ ] Run static/schema tests; run migration/seed only after checking a local PostgreSQL server and record whether it was available.

### Task 4: Repository interfaces and demo/PostgreSQL implementations

**Files:**
- Create: `server/repositories/types.ts`, `server/repositories/demo-repository.ts`, `server/repositories/postgres-repository.ts`, `server/domain/availability.ts`, `server/domain/appointments.ts`, `server/domain/requests.ts`
- Test: `server/domain/*.test.ts`, `server/repositories/demo-repository.test.ts`

**Interfaces:**
- `LuminaRepository` methods for catalog, availability, requests, appointments, admin sessions, notifications and audit.
- Domain services `createAppointmentRequest`, `confirmAppointmentRequest`, `rejectAppointmentRequest`, `proposeReschedule`, `requestCancellation`.

- [ ] Write failing tests for catalog reads, request creation, confirmation, rejection, rescheduling, cancellation and conflict behavior.
- [ ] Implement the demo repository with copied fixture state per test and deterministic IDs.
- [ ] Implement PostgreSQL repository queries through Drizzle, with short transactions and parameterized queries.
- [ ] Revalidate service/professional/slot inside confirmation and return a typed conflict for overlap.
- [ ] Run domain and repository tests; classify PostgreSQL tests as skipped when no server exists.

### Task 5: Fastify app, authentication, authorization and API routes

**Files:**
- Create: `server/config.ts`, `server/errors.ts`, `server/auth/passwords.ts`, `server/auth/session.ts`, `server/auth/csrf.ts`, `server/plugins/auth.ts`, `server/rate-limit.ts`, `server/app.ts`, `server/index.ts`, `server/routes/public.ts`, `server/routes/admin.ts`, `server/routes/auth.ts`, `server/routes/admin-data.ts`
- Test: `server/api.test.ts`, `server/auth.test.ts`

**Interfaces:**
- `buildApp(options): Promise<FastifyInstance>` with injected repository and `secureCookies` flag.
- REST endpoints under `/api/v1`: public catalog/professionals/availability/appointment-requests; auth login/logout/me; admin dashboard, requests, transitions, catalog, professionals, availability/blocks, notifications and audit.

- [ ] Write failing API tests for public reads, request creation, login, CSRF, role denial, admin list and `409` conflict.
- [ ] Implement stable errors `{ code, message, fieldErrors, requestId }`, JSON schemas, bounded pagination and rate limiting.
- [ ] Implement Argon2id password verification, server-side session cookies, hashed tokens, expiry/revocation and generic login errors.
- [ ] Implement CSRF token issuance and required header for authenticated mutations; use `HttpOnly`, `SameSite` and `Secure` when configured.
- [ ] Register routes with auth hooks and audit every admin mutation; keep internal error details out of responses.
- [ ] Run focused API/auth tests and correct failures with systematic debugging.

### Task 6: Public booking flow and API client

**Files:**
- Create: `src/lib/api.ts`, `src/lib/api.test.ts`, `src/components/BookingFlow.tsx`
- Modify: `src/App.tsx`, `src/studio.css`, `src/styles.css`, `index.html`
- Test: `src/components/BookingFlow.test.tsx` using existing jsdom/Vitest tools only

**Interfaces:**
- `apiClient.getServices()`, `.getProfessionals(serviceId)`, `.getAvailability(params)`, `.createAppointmentRequest(input)`.
- `BookingFlow` renders accessible steps and emits a local/demo confirmation state.

- [ ] Write failing tests for step order, field errors, no request on invalid data, demo warning and success confirmation.
- [ ] Implement API client with same-origin `/api/v1`, stable error mapping, abortable reads and a demo fallback when the API is unreachable.
- [ ] Add a responsive booking section/modal preserving current hero, service tabs, FAQ, assets and typography.
- [ ] Add labels, `aria-describedby`, `aria-invalid`, focus first error, Escape close, mobile menu `aria-controls`, accessible tabs and persistent FAQ panel IDs.
- [ ] Remove copy that promises “cero dolor” or unverified clinical certainty while keeping the editorial voice.
- [ ] Run component/API client tests and inspect the diff for accidental real-clinic claims.

### Task 7: Administrative panel

**Files:**
- Create: `src/components/AdminPanel.tsx`, `src/components/AdminLogin.tsx`, `src/components/admin/AdminDashboard.tsx`, `src/components/admin/AdminRequests.tsx`, `src/components/admin/AdminCatalog.tsx`, `src/components/admin/AdminSchedule.tsx`, `src/components/admin/AdminAudit.tsx`, `src/admin.css`
- Modify: `src/App.tsx`, `src/lib/api.ts`
- Test: `src/components/AdminPanel.test.tsx`

**Interfaces:**
- Admin API methods for login/logout/me, dashboard, request transitions, catalog, schedule/blocks and audit.
- `AdminPanel` renders login or protected modules based on server session, never client-only authorization.

- [ ] Write failing tests for login states, unauthorized view, request list, confirm/reject/reschedule/cancel actions and visible simulated notifications.
- [ ] Implement a coherent editorial admin surface with forest/ivory/terracotta tokens, table/list states, filters, empty/error/retry states and keyboard focus.
- [ ] Use CSRF token from the server and include credentials only for same-origin API calls.
- [ ] Ensure all actions are disabled while pending and surface `409` availability conflicts without losing the request state.
- [ ] Run admin component tests and API tests together.

### Task 8: Documentation, verification and local operations

**Files:**
- Modify: `README.md`, `docs/architecture/README.md`, `docs/architecture/14-arquitectura-tecnica-definitiva.md` if implementation status needs updating.
- Create: `docs/implementation/mvp-1-local.md`, `docs/implementation/verification-log.md`

- [ ] Document environment variables, PostgreSQL setup without Docker, migration/seed/admin commands, demo-only limitations and exact sample commands.
- [ ] Run `npm.cmd test`, `npm.cmd run typecheck`, `npm.cmd run build` and `npm.cmd run server:build`; record exit codes and real counts.
- [ ] If PostgreSQL is available, run migration and seed and execute persistence tests; otherwise mark them NOT RUN with the exact reason.
- [ ] Run static security review of changed code, inspect generated files and ensure no secrets/default password entered the repository.
- [ ] Do not start a public server, deploy, commit or push.

