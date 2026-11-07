# SDD ledger — plan: docs/superpowers/plans/2026-11-07-lumina-mvp1-implementation-plan.md

Ruling: The project is not a Git repository, so no isolated worktree, task commits, or Git review range can be created. The explicit authorized project directory is used as the work boundary; changes remain local and will be verified by file-scope inspection.

Pre-flight: Tasks share interfaces in order: shared contracts → repositories → API → frontend client/components → verification.

Ruling: Use `/api/v1/...` as the canonical public and admin prefix; error responses use `{ code, message, fieldErrors?, requestId }` and never expose internal details. This follows the approved API architecture and keeps the contract singular.

Ruling: Implement one demo clinic identified by a fixed `demo-clinic` configuration while keeping `clinic_id` in the persistence model. Multi-clinic behavior is not needed for MVP-1 and would add untested tenancy rules.

Ruling: PostgreSQL is the required persistence path when a local server is available; `DemoRepository` is the explicit test/demo fallback when it is not. Integration checks will be reported separately and never implied by demo tests. `btree_gist` is requested in the migration and availability will be checked before execution.

Ruling: Use deterministic demo availability: 30-minute slots, service duration from fixture (60 minutes), Monday–Friday 09:00–17:00 America/Lima, a small set of synthetic blocked times and no real holiday calendar. These values are editable fixtures, not commercial policy.

Ruling: Use request states `received → under_review → confirmed_manual | rejected | reschedule_requested | cancellation_requested → closed`; confirmed appointments use `confirmed → reschedule_requested | cancellation_requested | cancelled | completed | closed`. Reprogramming and cancellation are admin-controlled in MVP-1; the public site only creates the initial request.

Ruling: Public request fields are service, professional, preferred date/slot, name, email, interest, optional notes, preferred channel and demo flag. All stored values in demo fixtures are synthetic; notes are bounded and explicitly warned against medical data.

Ruling: Keep roles `admin`, `operator`, `editor`: admin can all admin modules, operator can requests/schedule, editor can catalog/profiles. This matches architecture document 17 and avoids introducing clinical roles.

Ruling: Run frontend and API on separate local ports with Vite proxying `/api` to Fastify. Cookies remain same-site during local development; CORS is not opened broadly. `Secure` is enabled only when configured for HTTPS.

Ruling: `REPOSITORY_MODE=demo|postgres` selects the repository; default `demo` is safe and deterministic, while `postgres` fails clearly if `DATABASE_URL` is missing. No silent fallback hides a requested persistence failure.

Ruling: The admin panel supports read/write actions for all approved demo modules; notification and audit views are read-only. This meets the MVP scope without inventing external delivery behavior.

Ruling: Add an explicit `typecheck` script (`tsc -b`) while retaining it in `build`; this provides the requested standalone evidence without changing build semantics.

Task 1: complete — dependencies installed locally; `npm.cmd test` was not part of Task 1, and `typecheck` was intentionally red before server/shared files existed.

Task 2: complete — `npm.cmd test -- --run shared/validation.test.ts shared/domain.test.ts src/lib/validation.test.ts` → 3 files, 7 tests passed.

Ruling: PostgreSQL service is running and `pg_isready` accepts connections, but both passwordless connection attempts fail because local credentials are not available in the environment. Migration/seed are implemented but not executed until a user-provided local `DATABASE_URL` is configured; no credentials were guessed or read from secret stores.

Task 3: complete — migration/schema/fixtures added; focused schema/domain tests passed (3 files, 6 tests) and `npm.cmd run typecheck` passed after fixing the validation input type.

Task 4: complete — demo and PostgreSQL repository contracts added; `npm.cmd test -- --run server/repositories/demo-repository.test.ts server/db/schema.test.ts` → 2 files, 4 tests passed; `npm.cmd run typecheck` passed.

Task 5: complete — Fastify API, Argon2id sessions, CSRF, roles, rate limits, auth routes and admin transitions added; `npm.cmd test -- --run server/api.test.ts server/repositories/demo-repository.test.ts` → 2 files, 6 tests passed; `npm.cmd run typecheck` passed.

Task 6: complete — API client, accessible multi-step booking flow, local editorial styles and safer menu/tabs/FAQ copy added; `npm.cmd test -- --run src/components/BookingFlow.test.tsx src/lib/validation.test.ts` → 2 files, 4 tests passed; `npm.cmd run typecheck` passed.

Task 7: complete — protected admin panel with dashboard, request transitions, catalog/profiles, schedule blocks and audit view added; `npm.cmd test -- --run src/components/AdminPanel.test.tsx src/components/BookingFlow.test.tsx` → 2 files, 3 tests passed; `npm.cmd run typecheck` passed after resolving the shared blocked-time type.

Task 8: complete — local operation and verification docs added; final `npm.cmd test` → 13 files, 31 tests passed; final `npm.cmd run typecheck`, `npm.cmd run server:build`, and `npm.cmd run build` passed. PostgreSQL migration/seed remain pending because local authentication credentials were unavailable.

