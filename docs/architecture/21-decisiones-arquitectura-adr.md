# 21. Decisiones de arquitectura (ADR)

## Estado

Registro de decisiones técnicas recomendadas para iniciar la Fase 3. Las ADR no autorizan instalar dependencias, crear backend ni desplegar servicios. Cada ADR requiere confirmación técnica antes de implementarse.

## ADR-001 — Monolito modular con API desacoplada

- **Estado:** PROPUESTO.
- **Decisión:** una aplicación backend modular con límites internos claros y una API REST versionada.
- **Motivo:** reduce complejidad operacional del MVP, permite separar dominio y persistencia y deja una ruta de evolución sin introducir microservicios prematuros.
- **Alternativas:** monolito tradicional, módulos frontend-only, microservicios. Se descartan como opción inicial por acoplamiento, falta de backend o coste operativo mayor.

## ADR-002 — Backend Node.js/TypeScript con Fastify

- **Estado:** PROPUESTO.
- **Decisión:** Fastify como framework HTTP futuro, con rutas, esquemas y servicios separados.
- **Motivo:** encaja con el lenguaje existente y favorece contratos explícitos y pruebas HTTP aisladas.
- **Pendiente:** versión estable compatible, plugins de sesión/CSRF y estrategia de validación.

## ADR-003 — PostgreSQL y migraciones SQL revisables

- **Estado:** PROPUESTO.
- **Decisión:** PostgreSQL como base relacional; Drizzle ORM como opción inicial con SQL revisable.
- **Motivo:** transacciones, restricciones de intervalos, integridad relacional y facilidad de inspección.
- **Pendiente:** proveedor, soporte de extensión para exclusión de intervalos, backup y recuperación.

## ADR-004 — REST `/api/v1` con JSON Schema y OpenAPI

- **Estado:** PROPUESTO.
- **Decisión:** API versionada, respuestas de error estables, validación de entrada y contrato OpenAPI generado o mantenido junto al código.
- **Motivo:** separa frontend y backend y permite reemplazar consumidores sin acoplarlos a tablas.

## ADR-005 — Sesiones administrativas en servidor

- **Estado:** PROPUESTO.
- **Decisión:** cookie segura con sesión revocable en servidor y hash Argon2id para contraseñas.
- **Motivo:** limita exposición de credenciales en el navegador y permite auditoría y revocación.
- **Pendiente:** biblioteca, parámetros, expiración, CSRF y gestor de secretos.

## ADR-006 — Exclusiones del MVP-1

- **Estado:** APROBADO funcionalmente; la implementación técnica queda pendiente.
- **Decisión:** no pagos reales, depósitos obligatorios, mensajes reales, portal clínico ni información médica.
- **Motivo:** mantener la demo segura, ficticia y acotada.

## ADR-007 — Fixtures y modo demo aislado

- **Estado:** PROPUESTO.
- **Decisión:** repositorio/seed de datos sintéticos y `DEMO_MODE` con integraciones simuladas.
- **Motivo:** impedir que la demo contamine una futura operación comercial.

## ADR-008 — Instantes UTC y reglas en `America/Lima`

- **Estado:** APROBADO como contexto; implementación PROPUESTA.
- **Decisión:** persistir instantes normalizados y calcular reglas recurrentes en la zona horaria peruana.
- **Motivo:** evitar errores de disponibilidad y conservar el contexto confirmado.

## ADR-009 — React/Vite incremental, estado local y cliente HTTP pequeño

- **Estado:** PROPUESTO.
- **Decisión:** conservar el frontend actual, extraer módulos por comportamiento y aplazar una biblioteca global de estado.
- **Motivo:** reduce riesgo visual y dependencias innecesarias.

## ADR-010 — Vitest y pruebas por capas

- **Estado:** PROPUESTO.
- **Decisión:** conservar Vitest para unitarias e integración; revisión manual responsive/a11y antes de elegir automatización de navegador.
- **Motivo:** respeta el stack actual y el alcance autorizado.

## ADR-011 — Proveedores externos pendientes

- **Estado:** PENDIENTE.
- **Decisión:** no seleccionar todavía hosting, correo, pagos, almacenamiento ni observabilidad.
- **Motivo:** no hay requisitos comerciales aprobados para comparar coste, residencia, seguridad o contrato.

## Decisiones que requieren aprobación antes de implementar

1. Framework y versión exacta del backend.
2. ORM, soporte de restricciones de intervalos y proveedor PostgreSQL.
3. Biblioteca y parámetros de hash/sesión/CSRF.
4. Router y contratos compartidos del frontend.
5. Estrategia de despliegue, secretos, backups y observabilidad.
6. Cualquier integración de correo, pagos o comunicación real en una fase posterior.

