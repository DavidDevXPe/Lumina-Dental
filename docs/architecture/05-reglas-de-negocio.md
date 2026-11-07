# 05. Reglas de negocio propuestas

Estas reglas son una base de diseño, no políticas comerciales vigentes. Todo valor monetario, duración, ventana temporal o consecuencia debe ser aprobado antes de exponerse a pacientes.

## 5.1 Disponibilidad de especialistas

1. La disponibilidad se calcula en la zona horaria de la sede.
2. Una franja debe estar habilitada para el servicio, especialista, sala y recursos necesarios.
3. Los bloques de descanso, vacaciones, mantenimiento y citas existentes son excluyentes.
4. La respuesta de disponibilidad incluye una versión o timestamp para revalidación.
5. El cliente no puede declarar una franja como disponible; solo solicitarla.
6. La configuración de disponibilidad debe tener vigencia y auditoría.

## 5.2 Duración de servicios

1. Cada servicio tiene una duración base y, si procede, tiempo de preparación y limpieza.
2. La duración mostrada al público debe coincidir con la utilizada por la agenda.
3. Si la duración depende de una evaluación, debe mostrarse como orientativa y no bloquearse sin confirmación.
4. Las referencias de Stitch incluyen 60 y 90 minutos; no se adopta ninguna como regla definitiva.

## 5.3 Bloqueo temporal

1. Una selección de horario crea un bloqueo con expiración corta y visible.
2. El bloqueo pertenece a una intención de reserva, no al navegador sin identidad operativa.
3. Si expira, el horario vuelve a estar disponible sin acción manual.
4. Un reintento con la misma clave idempotente no crea otra reserva.
5. El pago no debe prolongar indefinidamente el bloqueo sin una política explícita.

## 5.4 Confirmación y doble reserva

1. Solo existe una reserva confirmada cuando el servidor ha validado disponibilidad y requisitos de pago/garantía.
2. El servidor usa una transacción y una restricción de no solapamiento apropiada para sede, sala y especialista.
3. La cita incluye una versión; las mutaciones con versión obsoleta fallan con conflicto recuperable.
4. La pantalla de éxito no es evidencia suficiente si no hay confirmación persistida.

## 5.5 Pagos y depósitos

1. El importe observado de 90,00 € en Stitch se documenta como ejemplo, no como precio aprobado.
2. Cada operación se asocia a una moneda, impuestos, concepto y versión de política.
3. El frontend nunca recibe ni almacena PAN/CVV; el proveedor debe alojar el formulario sensible.
4. La aplicación del importe al tratamiento requiere una regla contable aprobada.
5. Los reembolsos se solicitan contra una transacción original y se concilian por webhook.
6. Un pago pendiente no confirma una cita salvo que la política aprobada lo permita y el estado lo refleje.

## 5.6 Reprogramaciones

1. Se revalida identidad, cita, ventana temporal, disponibilidad y política.
2. La nueva franja se bloquea antes de liberar la antigua.
3. El cambio es atómico desde la perspectiva del paciente: o se aplica completo o se conserva la cita anterior.
4. Se mantiene el historial de cambios sin sobrescribir los valores originales.
5. La notificación comunica la fecha efectiva, zona horaria y estado del pago.

## 5.7 Cancelaciones

1. La interfaz muestra la consecuencia económica antes de pedir confirmación.
2. La política debe definir ventanas, excepciones y reembolsos; Stitch presenta variantes incompatibles.
3. La cancelación libera el recurso solo después de persistir el cambio.
4. No se borra la cita: se conserva un estado cancelado y un evento de auditoría.

## 5.8 Recordatorios

1. Se generan desde una cita confirmada y se cancelan/reprograman al cambiar el estado.
2. No incluyen diagnóstico ni documentación clínica.
3. El paciente debe controlar canales y preferencias de comunicación.
4. Los reintentos no deben duplicar mensajes ni revelar si existe una cuenta.

## 5.9 Estados y permisos

| Acción | Paciente | Recepción | Profesional | Administrador |
| --- | --- | --- | --- | --- |
| Ver sus propias citas | Sí | Según asignación | Según agenda | Sí |
| Crear reserva | Sí | Sí | No por defecto | Sí |
| Cambiar catálogo/precio | No | No | No | Sí, con auditoría |
| Ver datos clínicos | Solo propios autorizados | Mínimo operativo | Según necesidad asistencial | No por defecto |
| Reembolsar | No | Según política | No | Según segregación |
| Exportar documentos | Solo con control | No por defecto | Según rol | Auditado y restringido |

## 5.10 Reglas de contenido clínico

- No prometer “cero dolor”, predictibilidad absoluta, garantías clínicas o resultados sin evidencia y aprobación profesional.
- No usar perfiles de stock, nombres de Stitch o credenciales ficticias como profesionales reales.
- No mostrar registro sanitario, certificación, dirección, teléfono o precio hasta verificar la fuente.
- Mantener una etiqueta de demo en la experiencia de portafolio.

