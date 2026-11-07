# 04. Flujos y estados

## 4.1 Nueva reserva

```mermaid
flowchart TD
  A[Visitante abre CTA] --> B[Selecciona motivo y servicio]
  B --> C[Selecciona especialista opcional]
  C --> D[Consulta disponibilidad]
  D -->|sin franjas| E[Mostrar alternativas]
  D -->|franja válida| F[Crear bloqueo temporal]
  F --> G[Capturar datos mínimos y preferencias]
  G --> H[Mostrar resumen y condiciones]
  H -->|rechaza| I[Descartar bloqueo]
  H -->|acepta| J[Crear intento de pago o garantía]
  J -->|pendiente| K[Esperar proveedor/webhook]
  J -->|rechazado| L[Liberar bloqueo y mostrar recuperación]
  K -->|confirmado| M[Confirmar cita]
  M --> N[Emitir pase/token y notificaciones]
```

La confirmación debe depender de un evento de backend o una respuesta verificada del proveedor, nunca de un botón que el cliente pueda falsificar.

## 4.2 Pago

```mermaid
flowchart TD
  A[Resumen aprobado] --> B[Crear PaymentIntent idempotente]
  B --> C[Proveedor solicita autenticación 3DS]
  C -->|requiere acción| D[Cliente completa acción]
  C -->|no requiere| E[Proveedor procesa]
  D --> E
  E -->|éxito| F[Webhook verificado]
  E -->|fallo| G[Pago rechazado]
  F --> H[Registrar pago y aplicar regla aprobada]
  H --> I[Confirmar cita]
  G --> J[Permitir reintento o cancelar bloqueo]
```

## 4.3 Reprogramación

```mermaid
flowchart TD
  A[Paciente autenticado o token válido] --> B[Consultar cita y versión]
  B --> C[Solicitar nueva fecha/hora]
  C --> D[Revalidar política y disponibilidad]
  D -->|inválida| E[Mostrar motivo y alternativas]
  D -->|válida| F[Bloquear nueva franja]
  F --> G[Confirmar cambio con control de versión]
  G -->|conflicto| H[Liberar nuevo bloqueo y pedir recarga]
  G -->|éxito| I[Liberar franja anterior]
  I --> J[Actualizar pase y enviar notificación]
```

## 4.4 Cancelación

```mermaid
flowchart TD
  A[Solicitud de cancelación] --> B[Autenticar y cargar cita]
  B --> C[Evaluar política aprobada]
  C --> D[Mostrar consecuencias y confirmar]
  D -->|no confirma| E[Conservar cita]
  D -->|confirma| F[Marcar cancelación]
  F --> G[Liberar disponibilidad]
  G --> H{¿Hay importe a reembolsar?}
  H -->|sí| I[Crear reembolso y seguir webhook]
  H -->|no| J[Registrar sin reembolso]
  I --> K[Notificar resultado]
  J --> K
```

## 4.5 Autenticación del paciente

```mermaid
flowchart TD
  A[Introducir email o teléfono] --> B[Enviar desafío de un solo uso]
  B --> C{¿Desafío válido y vigente?}
  C -->|no| D[Rechazar sin revelar si existe cuenta]
  C -->|sí| E[Crear sesión segura]
  E --> F[Aplicar autorización por paciente]
  F --> G[Portal y citas permitidos]
  G --> H[Caducidad, cierre o revocación]
```

## 4.6 Estados propuestos

### Cita

| Estado | Puede pasar a | Condición |
| --- | --- | --- |
| `draft` | `held`, `cancelled` | Datos locales aún incompletos. |
| `held` | `pending_payment`, `expired`, `cancelled` | Franja bloqueada con TTL. |
| `pending_payment` | `confirmed`, `payment_failed`, `expired` | Intento pendiente. |
| `confirmed` | `reschedule_pending`, `cancelled`, `completed`, `no_show` | Reserva aceptada por servidor. |
| `reschedule_pending` | `confirmed`, `cancelled` | Nueva franja en proceso. |
| `completed` | `closed` | Cierre administrativo posterior. |
| `cancelled` | `refunded` o `closed` | Depende de la política y del pago. |

### Pago

`created → requires_action → authorized → captured → partially_refunded/refunded` y ramas `failed`, `cancelled`, `disputed`.

### Sesión

`requested → challenged → authenticated → active → expired/revoked`.

### Notificación

`queued → sent → delivered` o `failed → retry_exhausted`, con contenido versionado y sin datos clínicos innecesarios.

## 4.7 Estados que la demo local sí representa

- Formulario vacío, errores de validación y confirmación demostrativa.
- Menú abierto/cerrado.
- Tratamiento activo.
- FAQ abierto/cerrado.

La demo no representa los estados de reserva, pago, sesión, portal ni notificaciones anteriores.

