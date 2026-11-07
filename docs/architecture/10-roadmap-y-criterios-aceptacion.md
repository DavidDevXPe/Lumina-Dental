# 10. Roadmap y criterios de aceptación

## Fase 1: sitio público

**Objetivo:** publicar una experiencia comercial honesta, accesible y visualmente fiel al sistema aprobado.

**Funcionalidades:** hero, servicios, equipo verificado o marcado como demo, espacio, FAQ, contacto, menú responsive, SEO básico y assets locales.

**Dependencias:** contenido aprobado, licencia de imágenes/fuentes, identidad de marca, ubicación o placeholders.

**Riesgos:** claims clínicos, datos ficticios presentados como reales, desbordamiento móvil, falta de foco.

**Entregables:** componentes públicos, contenido versionado, documentación de recursos, pruebas de interacción y revisión visual real.

**Aceptación:**

- Todas las CTA llevan a una acción existente o están marcadas como conceptuales.
- No se envían ni persisten datos si el producto sigue siendo demo.
- Los textos, alt, foco, teclado, menú y FAQ son revisados en navegador.
- No existen direcciones, registros, precios o personas no verificadas presentados como reales.

**Pruebas:** unitarias de validación, interacción de menú/FAQ/tabs, teclado, responsive en viewports acordados, contraste y revisión manual.

## Fase 2: reservas y disponibilidad

**Objetivo:** permitir una reserva real sin doble asignación.

**Funcionalidades:** catálogo versionado, disponibilidad, bloqueo temporal, datos mínimos, preferencias, resumen y cita.

**Dependencias:** backend, PostgreSQL, identidad o mecanismo seguro de invitación, reglas de duración y calendario operativo.

**Riesgos:** carreras, zona horaria, doble reserva, datos incompletos, abandonos.

**Entregables:** API, modelo de agenda, restricciones transaccionales, panel operativo mínimo y auditoría.

**Aceptación:** no se puede confirmar una franja ocupada; el bloqueo expira; reintentos son idempotentes; el servidor revalida cada paso.

**Pruebas:** unitarias de reglas, integración de concurrencia, expiración, zona horaria, autorización, accesibilidad y pruebas de contrato API.

## Fase 3: pagos y confirmaciones

**Objetivo:** cobrar o garantizar una reserva con estados conciliables.

**Funcionalidades:** PaymentIntent, 3DS, webhook, depósito/pago, confirmación, pase y notificaciones.

**Dependencias:** política aprobada, proveedor de pagos, responsable contable, plantillas y consentimiento de comunicaciones.

**Riesgos:** confirmar por cliente, webhooks duplicados, reembolsos incorrectos, datos de tarjeta.

**Entregables:** adaptador de PSP, estados de pago, conciliación, emails/SMS y política versionada.

**Aceptación:** ningún PAN/CVV pasa por el backend propio; solo webhook firmado confirma; cada operación es idempotente; los fallos tienen recuperación.

**Pruebas:** sandbox del proveedor, webhook repetido/fuera de orden, 3DS, rechazo, timeout, reembolso, notificación y seguridad.

## Fase 4: gestión de citas

**Objetivo:** consultar, reprogramar y cancelar con reglas claras.

**Dependencias:** cita confirmada, autenticación, política de cambios, agenda y pagos.

**Riesgos:** liberar franja equivocada, cambios simultáneos, reembolso contradictorio.

**Aceptación:** cambio atómico, historial conservado, política visible y notificación solo después de persistir.

**Pruebas:** control de versión, concurrencia, ventanas, cancelación, reembolso y regresión de notificaciones.

## Fase 5: portal del paciente

**Objetivo:** ofrecer acceso autenticado a información operativa y clínica autorizada.

**Dependencias:** gobierno de datos, identidad, roles, documentos y soporte.

**Riesgos:** IDOR, fuga por URL, sesión débil, exportación no auditada.

**Aceptación:** un paciente no puede leer recursos ajenos; documentos expiran; cada acceso sensible queda auditado; recuperación no enumera cuentas.

**Pruebas:** autorización negativa, expiración, revocación, descarga, logs, accesibilidad y revisión de threat model.

## Fase 6: funcionalidades clínicas avanzadas

**Objetivo:** integrar historia clínica, prescripciones e imágenes/escaneos solo con requisitos profesionales.

**Dependencias:** responsable sanitario, interoperabilidad, DICOM/STL, visor, retención y evaluación de impacto.

**Riesgos:** interpretación clínica incorrecta, archivos corruptos, indisponibilidad, privacidad.

**Aceptación:** solo roles autorizados ven documentos; se preserva integridad y procedencia; existe recuperación; las exportaciones están justificadas y auditadas.

**Pruebas:** ficheros válidos/inválidos, permisos, recuperación, rendimiento, accesibilidad del visor y validación clínica.

## Fase 7: seguridad, QA y producción

**Objetivo:** operar de forma verificable y recuperable.

**Funcionalidades:** monitorización, alertas, copias, restauración, gestión de secretos, incidentes, QA y documentación.

**Dependencias:** todas las fases anteriores y aprobación legal/profesional.

**Riesgos:** falsa sensación de cumplimiento, deuda operativa, cambios sin auditoría.

**Aceptación:** no hay check de producción sin evidencia de pruebas, restauración, permisos, logs, privacidad y revisión humana.

**Pruebas:** regresión, carga razonable, seguridad estática/dinámica autorizada, accesibilidad, backup/restore, smoke y respuesta a incidentes.

## Priorización

El MVP comercial debe terminar en la Fase 3 o 4, antes de construir el portal clínico. El acceso a historia, radiografías y escaneos 3D no es un requisito para validar la propuesta comercial y eleva de forma importante el riesgo, el coste y las obligaciones de seguridad.

## Puerta de aprobación para la siguiente fase

Antes de modificar la aplicación deben aprobarse, como mínimo:

1. Qué pantalla o recorrido se implementará primero.
2. Qué datos seguirán siendo ficticios.
3. Copys, precios, duración, ubicación y política de contacto.
4. Si el formulario continúa siendo una demo sin persistencia.
5. Criterios de accesibilidad y viewports de aceptación.
6. Si se autoriza cualquier dependencia o integración nueva.

