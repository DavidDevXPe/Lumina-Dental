# Registro de verificación del MVP-1

Este registro distingue comandos ejecutados de comprobaciones todavía pendientes.

## Ejecutado durante la implementación

| Comando | Resultado real |
| --- | --- |
| `npm.cmd install fastify @fastify/cookie drizzle-orm pg argon2` | Completado; 75 paquetes añadidos, 0 vulnerabilidades reportadas. Scripts nativos quedaron bloqueados por la política local y `argon2`/`esbuild` se pudieron importar. |
| `npm.cmd install --save-dev tsx @types/node @types/pg` | Completado; 6 paquetes añadidos, 0 vulnerabilidades reportadas. |
| `npm.cmd test -- --run shared/validation.test.ts shared/domain.test.ts src/lib/validation.test.ts` | PASS: 3 archivos, 7 tests. |
| `npm.cmd test -- --run server/db/schema.test.ts server/repositories/demo-repository.test.ts` | PASS: 2 archivos, 4 tests. |
| `npm.cmd test -- --run server/api.test.ts server/repositories/demo-repository.test.ts` | PASS: 2 archivos, 6 tests. |
| `npm.cmd test -- --run src/components/BookingFlow.test.tsx src/lib/validation.test.ts` | PASS: 2 archivos, 4 tests. |
| `npm.cmd test -- --run src/components/AdminPanel.test.tsx src/components/BookingFlow.test.tsx` | PASS: 2 archivos, 3 tests. |
| `npm.cmd run typecheck` | PASS en los últimos ciclos de Tasks 3–7. |
| `npm.cmd run server:build` | PASS; TypeScript backend compilado a `dist-server/`. |
| `npm.cmd test` | PASS: 13 archivos, 31 tests aprobados, 0 fallidos. |
| `npm.cmd run build` | PASS; TypeScript y Vite completaron el bundle de producción. |
| `pg_isready` | PostgreSQL local acepta conexiones en `:5432`. |
| Conexión passwordless con `pg` | PENDIENTE: el servidor exige contraseña y no existe una credencial autorizada en el entorno. |

## Verificación final tras el cierre del panel administrativo

| Comando | Resultado real |
| --- | --- |
| `npm.cmd run typecheck` | PASS; comprobación final tras exponer los controles de estado del catálogo. |
| `npm.cmd test` | PASS: 13 archivos, 31 tests aprobados, 0 fallidos. |
| `npm.cmd run server:build` | PASS; backend TypeScript compilado. |
| `npm.cmd run build` | PASS; TypeScript y Vite completaron el bundle de producción. |

## Pendiente

- Migración, seed y pruebas de persistencia PostgreSQL después de configurar `DATABASE_URL`.
- Revisión visual real en navegador a los cuatro viewports.
- Revisión manual de foco, teclado, contraste y lectores de pantalla.

