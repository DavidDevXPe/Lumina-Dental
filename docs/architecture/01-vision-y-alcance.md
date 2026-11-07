# 01. Visión y alcance

## Visión

Lúmina Dental debe evolucionar desde una experiencia editorial de presentación hacia un ecosistema digital que permita descubrir servicios, solicitar o reservar una cita, gestionar cambios y, solo después de resolver seguridad y cumplimiento, consultar información clínica autorizada.

La dirección visual **Warm Editorial Atelier** está definida en Stitch: marfil `#FBF9F4`, verde bosque alrededor de `#153026`, terracota alrededor de `#D46A4E`, sage y tipografías Playfair Display / Plus Jakarta Sans. La arquitectura funcional no cambia esa identidad.

## Objetivos de producto

1. Comunicar una propuesta odontológica serena sin presentar una clínica ficticia como negocio real.
2. Permitir que una persona entienda servicios, límites y próximos pasos antes de compartir información.
3. Reducir fricción en la solicitud y gestión de citas.
4. Evitar doble reserva, ambigüedad de pagos y exposición innecesaria de datos.
5. Separar la experiencia comercial pública de los datos sanitarios del portal privado.
6. Mantener trazabilidad entre diseño, reglas, API, pruebas y decisiones aprobadas.

## Actores

| Actor | Necesidad | Acceso previsto |
| --- | --- | --- |
| Visitante | Conocer enfoque, servicios, equipo y espacio; solicitar contacto. | Público, sin autenticación. |
| Paciente | Reservar, consultar, reprogramar, cancelar y revisar documentos propios. | Cuenta o enlace de acceso con verificación reforzada. |
| Profesional sanitario | Consultar agenda y datos clínicos mínimos necesarios para su atención. | Cuenta interna con autorización por función. |
| Recepción/concierge | Gestionar disponibilidad, citas, pagos operativos y comunicaciones. | Cuenta interna con permisos limitados. |
| Administrador | Configurar catálogo, usuarios, sedes, políticas y auditoría. | Acceso privilegiado, separado y auditado. |
| Proveedor externo | Procesar pago, correo, mensajería, calendario o almacenamiento. | Integración de servicio a servicio; nunca acceso indiscriminado. |

## Alcance por etapa

### Demo actual

Incluye una landing de portafolio con contenido demostrativo, 11 imágenes locales, tipografías locales, navegación por anclas, menú móvil, selector de tratamientos, FAQ y validación local del formulario.

No incluye envío, almacenamiento, login, API, pagos, disponibilidad real, agenda, consentimiento legal, historia clínica ni notificaciones reales.

### MVP comercial propuesto

- Sitio público con contenido aprobado y CMS o configuración versionada.
- Catálogo de servicios con contenido clínico revisado.
- Solicitud de cita y reserva de franjas reales.
- Cuenta o verificación segura para consultar y gestionar una cita.
- Pago o depósito mediante proveedor compatible con 3-D Secure, si el negocio lo aprueba.
- Confirmaciones y recordatorios transaccionales.
- Panel operativo mínimo para agenda y estados de cita.

### Producto de producción

- Portal de paciente con control de acceso y trazabilidad.
- Historia clínica y documentos bajo requisitos sanitarios y de retención definidos.
- Imágenes médicas y visor especializado, sin entregar ficheros sensibles mediante URL pública.
- Integraciones de calendario, pagos, correo y mensajería con contratos y planes de contingencia.
- Monitorización, copias, recuperación, auditoría, gestión de incidentes y revisión legal.

## Fuera de alcance de esta fase

- Modificar `src/App.tsx`, `src/styles.css`, `src/studio.css` o cualquier componente.
- Instalar dependencias o cambiar versiones.
- Crear backend, migraciones o infraestructura.
- Elegir políticas comerciales definitivas.
- Declarar cumplimiento legal o certificación clínica.
- Convertir textos o datos de Stitch en hechos reales.

## Principios de diseño funcional

- **Transparencia**: cada precio, depósito, duración o promesa necesita fuente aprobada.
- **Progresión**: pedir el mínimo de datos posible antes de bloquear una franja.
- **Confirmación explícita**: toda reserva, pago, reprogramación o cancelación debe tener estado observable.
- **Privacidad por defecto**: no poner datos sanitarios en URL, QR, logs ni mensajes sin necesidad.
- **Accesibilidad**: usar HTML nativo, foco visible, teclado, contraste y mensajes de error asociados.
- **Demo honesta**: mostrar el límite de la simulación cerca de la acción relevante.

## Decisiones pendientes de aprobación

1. País, ciudad y sede reales.
2. Nombre, colegiación, especialidad y disponibilidad reales del equipo.
3. Catálogo, duraciones, tarifas, impuestos y reglas de depósito.
4. Política de cambios, cancelaciones y reembolsos.
5. Jurisdicción y responsables del tratamiento de datos.
6. Proveedor de agenda, pagos, correo, mensajería y almacenamiento clínico.
7. Alcance exacto de historia clínica, DICOM, STL, radiografías y escaneos 3D.

