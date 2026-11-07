# Lúmina Dental MVP-1 — Operación local

## Alcance implementado

El proyecto contiene una SPA pública, un API Fastify modular y un panel administrativo demo. El modo `demo` usa `DemoRepository`; el modo `postgres` usa PostgreSQL y las tablas de `db/migrations/0001_initial.sql`. Ambos modos conservan el mismo contrato y las mismas reglas de disponibilidad.

No hay pagos, correo, SMS, WhatsApp, calendario externo, portal clínico ni datos reales.

## Requisitos

- Node.js 24.x o una versión LTS compatible con Vite 8/Fastify 5.
- PostgreSQL local para comprobar persistencia. Docker no es necesario.
- No se requieren instalaciones globales.

## Demo sin PostgreSQL

En una terminal PowerShell:

```powershell
$env:REPOSITORY_MODE = "demo"
$env:DEMO_MODE = "true"
$env:ADMIN_EMAIL = "admin@example.invalid"
$env:ADMIN_PASSWORD = "cambiar-por-una-clave-local-de-12-caracteres"
npm.cmd run server:dev
```

En otra terminal:

```powershell
npm.cmd run dev
```

Vite sirve la interfaz y redirige `/api` a Fastify en `127.0.0.1:3001`. La cuenta demo solo existe mientras el proceso está activo; no hay contraseña integrada en el código.

## PostgreSQL local

Configura una cadena de conexión local sin escribirla en el repositorio:

```powershell
$env:DATABASE_URL = "postgresql://usuario:contraseña@localhost:5432/lumina_dental_demo"
$env:REPOSITORY_MODE = "postgres"
npm.cmd run db:migrate
npm.cmd run db:seed
$env:ADMIN_EMAIL = "admin@example.invalid"
$env:ADMIN_PASSWORD = "cambiar-por-una-clave-local-de-12-caracteres"
npm.cmd run admin:init
npm.cmd run server:dev
```

La migración es idempotente y no ejecuta reset, `DROP` ni `TRUNCATE`. El seed solo inserta fixtures ficticios. `admin:init` exige la contraseña por variable de entorno, la hashea con Argon2id y no la imprime.

## Comprobaciones

```powershell
npm.cmd run typecheck
npm.cmd test
npm.cmd run server:build
npm.cmd run build
```

La persistencia PostgreSQL, la revisión visual y las pruebas en navegador deben reportarse por separado. Un resultado verde del repositorio demo no equivale a una prueba de PostgreSQL.

## API principal

- `GET /api/v1/services`
- `GET /api/v1/professionals?serviceId=...`
- `GET /api/v1/availability?serviceId=...&professionalId=...&date=...`
- `POST /api/v1/appointment-requests`
- `POST /api/v1/auth/login`, `GET /api/v1/auth/me`, `POST /api/v1/auth/logout`
- `GET /api/v1/admin/dashboard`
- `GET /api/v1/admin/requests`
- `POST /api/v1/admin/requests/:id/confirm|reject|reschedule|cancel`
- `GET/POST /api/v1/admin/blocked-times`
- `GET /api/v1/admin/notifications`, `/api/v1/admin/audit`

Las mutaciones administrativas requieren sesión, cookie y header CSRF. Los errores usan `code`, `message`, `fieldErrors` y `requestId`.

## Datos y privacidad

Todos los registros iniciales llevan marca demo. El formulario advierte que no se introduzcan datos personales ni médicos reales y rechaza campos de texto con patrones clínicos sensibles. La aplicación no es una clínica real ni una herramienta clínica.

