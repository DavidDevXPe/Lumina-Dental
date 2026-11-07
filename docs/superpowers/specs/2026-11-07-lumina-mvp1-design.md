# Lúmina Dental MVP-1 — Diseño de implementación

## Intención

Convertir la landing actual en una demo funcional preparada para comercialización: catálogo y especialistas servidos por API, flujo de solicitud de cita con disponibilidad, panel administrativo protegido y notificaciones internas simuladas. El producto seguirá siendo demostrativo, sin pagos, mensajes externos ni datos clínicos.

## Objetivos

- Mantener la identidad Warm Editorial Atelier, recursos locales y responsive actual.
- Separar frontend público, panel administrativo, API, dominio, persistencia, validación y fixtures.
- Permitir ejecutar el flujo completo con fixtures sin depender de servicios externos.
- Persistir en PostgreSQL cuando exista una base local configurada y demostrar la misma lógica con un repositorio demo determinista.
- Proteger el panel con sesiones HttpOnly, CSRF, roles, validación servidor, rate limiting básico y auditoría.
- Cubrir reglas de disponibilidad, estados, conflictos y validación con Vitest.

## No objetivos

- Pagos, depósitos, correo, SMS, WhatsApp o calendario reales.
- Historia clínica, radiografías, escaneos, prescripciones o documentos sanitarios.
- Datos reales, credenciales profesionales, ubicación real o precios oficiales.
- Publicación, despliegue, MCP, hooks, commits o cambios fuera del proyecto.

## Enfoques considerados

1. **Frontend con fixtures:** conserva el alcance visual, pero no cumple API, autenticación, persistencia ni concurrencia.
2. **Backend monolítico acoplado a `App.tsx`:** reduce archivos iniciales, pero mezcla transporte, dominio y presentación y hace insegura la evolución.
3. **Monolito modular con API REST y repositorios intercambiables:** añade estructura inicial, pero permite probar el dominio sin PostgreSQL y conserva una ruta clara a producción. Es la opción elegida porque cumple el MVP sin microservicios ni servicios externos.

## Diseño elegido

El backend será Fastify + TypeScript con `/api/v1`, rutas delgadas, servicios de dominio y repositorios. Drizzle ORM sobre `pg` ejecutará consultas parametrizadas contra PostgreSQL; la migración SQL será manual y revisable. Un `DemoRepository` comparte los contratos y las reglas con el repositorio PostgreSQL.

El frontend conservará la landing y sus estilos, y añadirá una ruta lógica pública de solicitud y un área administrativa accesible mediante un selector de vista. Se usará `fetch` encapsulado, sin guardar credenciales o datos de contacto en `localStorage`. El panel tendrá una estética oscura/verde coherente, no una plantilla genérica.

### Flujo público

```text
servicios → especialista → fecha → franja disponible → datos demo → resumen → solicitud recibida
```

La creación nunca confirma automáticamente una cita. La confirmación, rechazo, reprogramación y cancelación son acciones administrativas.

### Flujo administrativo

```text
login → sesión + CSRF → dashboard → solicitud → confirmar/rechazar/reprogramar/cancelar
                                      ↘ servicios / especialistas / horarios / bloqueos / auditoría
```

La primera cuenta se crea mediante un comando local explícito que exige `ADMIN_EMAIL` y `ADMIN_PASSWORD` por entorno; no hay contraseña por defecto en código.

## Modelo y contratos

Se implementarán `ClinicConfiguration`, `Service`, `Professional`, `ProfessionalService`, `AvailabilityRule`, `BlockedTime`, `AppointmentRequest`, `Appointment`, `AdminUser`, `AdminSession`, `NotificationEvent` y `AuditEvent`. Las solicitudes y citas tendrán estados distintos; no habrá estados de pago.

Endpoints públicos: `GET /services`, `GET /professionals`, `GET /availability`, `POST /appointment-requests`. Endpoints administrativos: auth login/logout/me, dashboard, solicitudes y transiciones, catálogo, profesionales, disponibilidad/bloqueos, notificaciones y auditoría. Los errores usarán un sobre estable con `code`, `message`, `fieldErrors` y `requestId`.

La confirmación PostgreSQL se hará en una transacción y usará una exclusión de intervalos por profesional para devolver `409` cuando exista solapamiento. El adaptador demo aplicará la misma comprobación en memoria.

## Seguridad y datos

Las contraseñas se almacenarán con Argon2id. Las sesiones usarán cookies HttpOnly/SameSite y token hash en servidor; CSRF protegerá mutaciones autenticadas. La validación servidor limitará cadenas, fechas y paginación. El rate limit será pequeño y en memoria para el entorno demo. Logs y auditoría redaccionarán secretos y datos de contacto innecesarios.

Todos los fixtures llevarán `isDemo=true`. El formulario mostrará: “Entorno demostrativo. No introduzcas información personal ni médica real”.

## Verificación

- Tests unitarios de validación, dominio, disponibilidad, conflictos, auth y permisos.
- Tests de API contra repositorio demo.
- Migración y seed PostgreSQL solo si `pg_isready` confirma un servidor autorizado.
- `npm.cmd test`, `npm.cmd run typecheck` y `npm.cmd run build` con resultados reales.
- No se afirmará revisión visual de navegador si no se dispone de navegador real.

## Decisiones del constructor

- Se mantiene el frontend en una SPA durante este MVP; React Router no se añade si el flujo se puede resolver con rutas de estado, evitando una dependencia innecesaria.
- Se usa un repositorio demo explícito para que `npm test` y la demo local no dependan de PostgreSQL; esto no sustituye la verificación de persistencia PostgreSQL.
- Se usa `argon2` como dependencia runtime porque la arquitectura aprobó Argon2id; si la instalación nativa falla en este Node, se detendrá la sustitución y se documentará, no se cambiará silenciosamente el algoritmo.

