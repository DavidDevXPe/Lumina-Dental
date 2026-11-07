# 12. Alcance definitivo del MVP-1

## Estado

El contexto y el alcance funcional del MVP-1 están **APROBADOS** por el propietario. La aprobación es funcional y documental: no autoriza todavía implementar backend, instalar dependencias, contratar proveedores ni recoger datos reales.

| Área | Estado |
| --- | --- |
| Demo preparada para comercialización | **APROBADO** |
| Perú, PEN y `America/Lima` | **APROBADO** |
| Datos ficticios y separación demo/comercial | **APROBADO** |
| Alcance funcional del MVP-1 | **APROBADO** |
| Ciudad, sede, catálogo, horarios, precios y profesionales concretos | **PENDIENTE** |
| Implementación técnica y proveedores | **PROPUESTO / PENDIENTE** |

## Contexto aprobado

- Modalidad: **demo preparada para comercialización**.
- País de referencia: **Perú**.
- Moneda de referencia: **PEN**.
- Zona horaria: **`America/Lima`**.
- Idioma de trabajo: español.
- Datos: **ficticios y aislados**.
- Evolución: la demo y una futura operación comercial tendrán configuración, datos, credenciales e integraciones separadas.

No se inventan ciudad, dirección, razón social, teléfonos, precios ni datos de profesionales.

## Objetivo

Construir un producto demostrativo funcional que presente una clínica odontológica ficticia, simule una solicitud y administración de citas y pueda evolucionar hacia una solución comercial para clínicas reales.

La demo no debe aparentar que existen una clínica real, una agenda real, pacientes reales, pagos reales o comunicaciones reales.

## Alcance funcional aprobado

### A. Sitio público

- Landing profesional.
- Catálogo de servicios.
- Presentación de especialistas demostrativos.
- Instalaciones y ambiente.
- Preguntas frecuentes.
- Contacto.
- SEO y accesibilidad.

El contenido comercial concreto, los claims, la ciudad y los datos identificativos siguen pendientes de aprobación.

### B. Sistema de solicitudes y reservas demostrativas

- Solicitud de cita.
- Selección de servicio.
- Selección de especialista.
- Preferencia de fecha y horario.
- Validación de disponibilidad.
- Confirmación manual por administración.
- Reprogramación y cancelación controladas.

Los estados de solicitud y cita deben mantenerse separados. Una preferencia o confirmación demostrativa no es una reserva comercial real.

### C. Panel administrativo demostrativo

- Inicio de sesión aislado o simulado.
- Gestión de solicitudes.
- Gestión de servicios.
- Gestión de especialistas ficticios.
- Configuración de horarios.
- Estados de solicitudes.
- Registro de acciones administrativas.

El panel solo operará sobre fixtures o datos de demo hasta que exista una aprobación específica de seguridad, privacidad y operación comercial.

### D. Notificaciones

- Simulación de confirmaciones y cambios.
- Sin envío real de correo, SMS o WhatsApp en esta etapa.

### E. Pagos

- Sin transacciones reales.
- Sin depósitos obligatorios.
- No se conserva el importe de 90 € de pantallas anteriores como precio aprobado.
- Toda demostración de pago, si se incluye en el futuro, debe identificarse claramente como simulación.

### F. Portal clínico excluido

Queda fuera del MVP-1:

- historia clínica;
- radiografías;
- escaneos 3D;
- prescripciones;
- documentos sanitarios;
- información médica de pacientes.

## Privacidad y datos

La demo utiliza datos ficticios y aislados de cualquier futura operación comercial. El formulario demostrativo no debe solicitar DNI, diagnósticos, antecedentes médicos, medicamentos, radiografías, escaneos, prescripciones, tarjetas ni información clínica sensible.

La recopilación de datos reales exige una aprobación específica de privacidad, seguridad y cumplimiento de la normativa peruana aplicable. Esa aprobación no está incluida.

## Arquitectura mantenida como propuesta

- Frontend React + TypeScript + Vite.
- Backend desacoplado mediante API.
- Base de datos relacional, evaluando PostgreSQL.
- Autenticación administrativa.
- Separación de configuración demo/producción.
- Integraciones externas mediante adaptadores reemplazables.

La elección de framework backend, ORM, infraestructura y proveedores queda pendiente; no se instala nada por este documento.

## Fuera de alcance

- Backend conectado a datos reales.
- Base de datos de pacientes.
- Pagos, depósitos y reembolsos reales.
- Correo, mensajería o calendario externos.
- Portal clínico y archivos sanitarios.
- Proveedores definitivos.
- Datos locales, precios o credenciales no aprobados.

## Dependencias de entrada para la siguiente fase

1. Definir catálogo, duraciones y horarios ficticios.
2. Resolver ciudad/sede solo si se quiere mostrar ubicación.
3. Confirmar reglas de cancelación y reprogramación.
4. Elegir arquitectura técnica y dependencias exactas.
5. Aprobar seguridad, privacidad y entorno demo antes de cualquier dato real.
6. Aprobar proveedores e integraciones por separado.

## Criterios de aceptación funcional

- Se puede recorrer sitio, catálogo, especialistas, instalaciones, FAQ y contacto.
- Los datos de clínica, equipo, sede, precio y agenda son ficticios o placeholders identificados.
- Se puede solicitar, revisar y simular cambios de una cita.
- La confirmación administrativa se identifica como demostrativa.
- No se envían comunicaciones reales ni se realizan pagos.
- El formulario no solicita datos clínicos, DNI ni tarjetas.
- Los datos demo no se mezclan con configuración comercial.
- La navegación, los formularios, FAQ y estados tienen criterios de accesibilidad verificables.
- Build, tests y revisión visual solo se declaran después de ejecutarse en una fase autorizada.

