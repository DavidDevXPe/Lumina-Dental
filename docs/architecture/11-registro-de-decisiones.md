# 11. Registro centralizado de decisiones

## Estado y alcance

La Fase 2 queda cerrada en lo funcional con las decisiones confirmadas por el propietario. Este documento no autoriza modificar código, instalar dependencias, crear backend, configurar una base de datos ni contratar proveedores.

- **APROBADO:** confirmado expresamente por el propietario del producto.
- **PROPUESTO:** recomendación preparada para la siguiente decisión.
- **PENDIENTE:** requiere información adicional o aprobación específica.

## Decisiones aprobadas

| ID | Decisión | Impacto | Alternativas consideradas | Recomendación operativa | Responsable | Estado |
| --- | --- | --- | --- | --- | --- |
| A-01 | Demo preparada para comercialización | Crítico | Demo visual; producto real inmediato; modalidad híbrida | Mantener fronteras claras para evolucionar sin presentar la demo como operación real. | PO | **APROBADO** |
| A-02 | País de referencia: Perú | Crítico | Otro país; país no definido | Usar Perú como contexto; no inventar ciudad, sede o datos de negocio. | PO | **APROBADO** |
| A-03 | Moneda de referencia: PEN | Alto | EUR; moneda no mostrada | Usar PEN como referencia de formato; no publicar importes no aprobados. | PO | **APROBADO** |
| A-04 | Zona horaria: `America/Lima` | Alto | UTC; zona del navegador; otra zona | Aplicarla a preferencias, disponibilidad y futura persistencia. | PO | **APROBADO** |
| A-05 | Datos de demostración ficticios | Crítico | Datos reales; datos mixtos | Mantener fixtures etiquetados y aislados. | PO | **APROBADO** |
| A-06 | Separación demo/comercial | Crítico | Configuración compartida; entornos separados | Separar datos, credenciales, configuración e integraciones. | PO + técnico | **APROBADO** |
| A-07 | Alcance funcional del MVP-1 | Crítico | Solo landing; sitio + reservas; sitio + pagos | Aprobar el conjunto de sitio público, solicitud de cita, administración demostrativa y notificaciones simuladas descrito en `12`. | PO | **APROBADO** |
| A-08 | Disponibilidad y confirmación | Alto | Reserva automática; solicitud sin disponibilidad; modelo híbrido | Preferencia de fecha/hora, validación de disponibilidad y confirmación manual. | PO + operaciones | **APROBADO** |
| A-09 | Panel administrativo demostrativo | Alto | Sin panel; panel local; panel comercial | Incluir gestión aislada de solicitudes, servicios, especialistas, horarios y estados. | PO + técnico | **APROBADO** |
| A-10 | Notificaciones | Medio | Sin notificación; mensajes reales; simulación | Simular confirmaciones y cambios dentro de la demo, sin envío externo. | PO + operaciones | **APROBADO** |
| A-11 | Exclusiones del MVP-1 | Crítico | Pagos/portal clínico/integraciones reales | Excluir pagos reales, depósitos obligatorios, mensajes reales, historia clínica y datos sanitarios. | PO | **APROBADO** |

Estas decisiones no convierten la demo en una clínica real ni autorizan tratar datos reales.

## Propuestas para la Fase 3

| ID | Decisión | Impacto | Alternativas | Recomendación | Aprobación necesaria | Estado |
| --- | --- | --- | --- | --- | --- |
| P-01 | Arquitectura de implementación | Crítico | Monolito tradicional; modular; microservicios | Monolito modular con API desacoplada; está desarrollado como recomendación en `14`–`21`. | PO + técnico | **PROPUESTO** |
| P-02 | Backend | Alto | Node/TypeScript con otro framework; BaaS; otra plataforma | Mantener Node/TypeScript y evaluar Fastify sin instalar hasta aprobar versiones. | Técnico | **PROPUESTO** |
| P-03 | Persistencia | Alto | Solo fixtures; PostgreSQL; BaaS | Fixtures para demo y PostgreSQL para futura operación, con migraciones SQL revisables. | PO + técnico | **PROPUESTO** |
| P-04 | Autenticación administrativa | Alto | Sin login; simulación; sesiones reales | Sesiones de servidor con cookie segura para una implementación autorizada; demo aislada. | Técnico + privacidad | **PROPUESTO** |
| P-05 | Contrato de API | Alto | Sin API; REST; RPC | REST versionado `/api/v1`, JSON Schema y OpenAPI. | Técnico | **PROPUESTO** |
| P-06 | Calidad | Alto | Tests mínimos; pruebas por capas | Conservar Vitest y ampliar pruebas unitarias, API, concurrencia, a11y y revisión responsive. | Técnico + QA | **PROPUESTO** |

## Decisiones pendientes del producto

| ID | Decisión | Impacto | Alternativas | Recomendación | Responsable | Estado |
| --- | --- | --- | --- | --- | --- |
| D-01 | Ciudad y sede | Alto | Definir una sede; varias sedes; placeholder | Mantenerlo ausente o ficticio hasta recibir datos autorizados. | PO + operaciones | **PENDIENTE** |
| D-02 | Catálogo definitivo y claims | Alto | Catálogo demo; catálogo comercial; catálogo mínimo | Aprobar nombres, descripciones y afirmaciones con respaldo. | PO + clínico | **PENDIENTE** |
| D-03 | Duraciones y horarios | Alto | Fixtures; agenda propia; calendario externo | Usar fixtures para demo y definir reglas antes de disponibilidad real. | PO + operaciones | **PENDIENTE** |
| D-04 | Precios y moneda publicada | Crítico | Sin precios; precios aprobados en PEN; promociones | No publicar precios; el importe de 90 € no queda aprobado. | PO + contabilidad | **PENDIENTE** |
| D-05 | Política de cancelación | Crítico | Manual; ventana temporal; reembolso | Definirla antes de consecuencias económicas o automatización. | PO + operaciones + privacidad | **PENDIENTE** |
| D-06 | Equipo y credenciales | Alto | Perfiles ficticios; perfiles verificados; sin perfiles | Mantener perfiles demo y verificar cualquier perfil futuro. | PO + clínico | **PENDIENTE** |
| D-07 | Canales de comunicación | Medio | Simulados; correo; SMS/WhatsApp | Mantener simulación hasta aprobar proveedor y mensajes. | PO + operaciones | **PENDIENTE** |
| D-08 | Proveedores de infraestructura | Alto | Gestionado; autogestionado; BaaS | Comparar región, seguridad, coste y reversibilidad. | PO + técnico + privacidad | **PENDIENTE** |
| D-09 | Framework backend definitivo | Alto | Fastify; otro framework; BaaS | Resolver tras revisar dependencias y operación objetivo. | PO + técnico | **PENDIENTE** |
| D-10 | Proveedor de correo | Medio | Ninguno en demo; transaccional; SMTP | No seleccionar en esta fase. | PO + técnico + privacidad | **PENDIENTE** |
| D-11 | Proveedor de pagos futuro | Alto | PSP; pago manual; otro | Comparar solo después de aprobar necesidad, política e impuestos. | PO + técnico + contabilidad | **PENDIENTE** |
| D-12 | Privacidad para datos reales | Crítico | Mantener demo; evaluación peruana; operación comercial | Exigir aprobación específica de privacidad, seguridad y normativa aplicable. | PO + privacidad/legal | **PENDIENTE** |

## Bloqueadores

- D-01 bloquea SEO local y publicación de ubicación.
- D-02 bloquea contenido comercial definitivo.
- D-03 bloquea disponibilidad real.
- D-04 y D-05 bloquean precios, depósitos, reembolsos y automatización de cancelaciones.
- D-08, D-09 y D-10 bloquean la operación productiva.
- D-12 bloquea la recopilación de datos reales.

Los ADR técnicos de `21` mantienen el estado de recomendación; no deben interpretarse como aprobación de implementación.

