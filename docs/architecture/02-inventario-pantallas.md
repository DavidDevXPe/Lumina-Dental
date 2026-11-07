# 02. Inventario y trazabilidad de pantallas

## Resumen

El listado de pantallas expone **29 entradas** para el proyecto `projects/17904738159341963128`. Los metadatos del proyecto contienen además 5 instancias ocultas o auxiliares, por lo que el inventario total de instancias es **34**. No todas son pantallas de producto.

- El listado visible incluye 14 entradas desktop, 14 mobile (una de ellas la variante responsive general) y 1 imagen de referencia sin `deviceType`.
- Los metadatos añaden 3 pantallas ocultas (`985...`, `b267...`, `fc4...`) y 2 entradas auxiliares: una imagen oculta y un recurso sin etiqueta. También existe una instancia duplicada de `image.png` asociada al mismo recurso de referencia.

Las dimensiones de origen observadas son 2560 px de ancho para desktop y 780 px para mobile. Las dimensiones no equivalen necesariamente a un viewport de producción; son lienzos de diseño/exportación.

La demo local implementa una sola página React. Por eso, salvo la experiencia pública parcial, las filas siguientes son **diseñadas en Stitch, no implementadas localmente**.

## Matriz de pantallas

| ID corto | Pantalla | Área / variante | Objetivo y acciones | Anterior → siguiente | Estado local |
| --- | --- | --- | --- | --- | --- |
| `985b7a3782b34651b65f7be46a88a80e` | Boutique Studio Desktop Experience | Sitio público desktop, 2560×18240 | Hero, enfoque, servicios, recorrido, equipo, espacio, FAQ, contacto y footer; navegar por anclas y pedir cita. | Entrada → secciones públicas / contacto | Parcial: estructura e interacciones equivalentes en `App.tsx`, no flujo completo. |
| `b26732a5320948ae9995c5da34287c81` | Boutique Studio Immersive Experience | Variante pública desktop oculta, instancia 1280×8697 | Variante inmersiva de la experiencia boutique. | Entrada → secciones públicas | No implementada; variante de diseño oculta. |
| `4ab264716f8c405baa04f1230b9a374d` | Versión Móvil Responsive | Sitio público mobile, 780×12426 | Reordenar contenido público, CTA y formulario para móvil. | Entrada → contacto | Parcial: responsive y menú local; no pantalla independiente. |
| `ad9d48eaa5bf47c4a8e335891d4e25d3` | Servicios & Tratamientos Biomiméticos Desktop | Catálogo desktop, 2560×11472 | Explorar tratamientos, detalle y CTA de reserva. | Inicio → reserva | No implementada como pantalla separada. |
| `ecf5fe6b38ad49849d6fce132ed672fd` | Servicios & Tratamientos Móvil | Catálogo mobile, 780×11840 | Consumir catálogo y contactar desde móvil. | Inicio → reserva | No implementada como pantalla separada. |
| `35a5d77159b5499cb39e3b151d1ba96a` | Especialistas & Equipo Clínico Desktop | Equipo desktop, 2560×12718 | Presentar perfiles, especialidades y CTA. | Inicio → contacto/reserva | No implementada; la demo usa perfiles ficticios simplificados. |
| `deb9a515551b4052b5964919a72c2af4` | Especialistas & Equipo Clínico Móvil | Equipo mobile, 780×11238 | Consultar especialistas y solicitud de contacto. | Inicio → contacto/reserva | No implementada como pantalla separada. |
| `d787cbc9bfc0468183e9b14a40f79969` | El Espacio & Arquitectura Sensorial Desktop | Espacio desktop, 2560×13260 | Mostrar instalaciones, ambiente y llegada. | Inicio → contacto | Parcial: sección `#espacio` local con recursos y datos ficticios. |
| `8b7b36218ae548c99d38a5205256cbbc` | El Espacio & Experiencia Móvil | Espacio mobile, 780×9874 | Mostrar ambiente y protocolos de bienvenida. | Inicio → contacto | Parcial: sección responsive local. |
| `ce23faf624b544ec8073a56efb632f25` | FAQ & Filosofía Biomimética Desktop | FAQ desktop, 2560×6996 | Filtrar/abrir preguntas sobre enfoque, tiempos y depósitos. | Inicio → contacto | Parcial: acordeón local sin filtros ni políticas reales. |
| `f0055d3f00a045bca64fb7f4063aed87` | FAQ & Filosofía Móvil | FAQ mobile, 780×4436 | Resolver dudas y contactar. | Inicio → contacto | Parcial: acordeón local responsive. |
| `43b116dbe0304ad7aa7519e1d7f21310` | Contacto & Localización Desktop | Contacto desktop, 2560×5796 | Solicitar cita, ver ubicación, parking y canales. | Inicio/servicio → confirmación | Parcial: formulario demostrativo y ubicación ficticia; sin envío. |
| `5ab8d35e51b449c0a98cfbe856f1eb24` | Contacto & Concierge Móvil | Contacto mobile, 780×7122 | Solicitar contacto y preferencias de atención. | Inicio/servicio → confirmación | Parcial: formulario local; no concierge real. |
| `2109c5b8071a47e287788b77b567277f` | Menú Desplegable Móvil | Estado de navegación mobile, 780×1836 | Abrir/cerrar navegación y acceder a secciones. | Cualquier sección → sección elegida | Parcial: botón y enlaces locales; falta gestión de foco/Escape. |
| `295dc6e4ba1142058326a851dec15414` | Modal de Reserva Escritorio con Microinteracciones & Atajo ESC | Reserva desktop, 2560×2048 | Abrir modal, avanzar por pasos y cerrar con ESC. | Inicio → pasos de reserva | No implementada. |
| `fc4fa957080e49a086e71e79e7cc1a71` | Modal de Reserva Escritorio Paso a Paso | Variante oculta, instancia 1280×1024 | Variante del modal y sus pasos. | Inicio → datos/pago | No implementada; instancia oculta. |
| `6400830fd9844eb5b73558066d4be962` | Reserva de Cita Móvil Paso a Paso | Reserva mobile, 780×4334 | Motivo, especialista, fecha, hora y preferencias. | Inicio → pago/confirmación | No implementada. |
| `a1c18510fa39481891ab4448278d34fb` | Confirmación de Cita & Pasarela de Reserva | Pago desktop, 2560×5260 | Revisar reserva, elegir pago/garantía y autorizar depósito. | Reserva → éxito | No implementada; no existe pago local. |
| `cec2718aa8cd427c8f792aad284b7da3` | Confirmación de Cita Móvil & Pasarela de Reserva | Pago mobile, 780×6418 | Completar autorización en móvil. | Reserva → éxito | No implementada. |
| `17baa87a397d42788628ce2f99f9637b` | Confirmación Exitosa de Reserva & Pase Digital | Éxito desktop, 2560×6044 | Mostrar código/pase, cita y acciones de calendario/reprogramación. | Pago aprobado → gestión | No implementada. |
| `0fa9c3949a92464f9e7fd08c90e51d1d` | Confirmación Exitosa Móvil & Pase Digital | Éxito mobile, 780×7242 | Mostrar confirmación y pase digital. | Pago aprobado → gestión | No implementada. |
| `4e34414f12414fd0bcad2fb7955561aa` | Gestión y Reprogramación de Reserva | Gestión desktop, 2560×7118 | Cambiar fecha, horario, especialista/preferencias o cancelar. | Cita confirmada → nueva confirmación | No implementada. |
| `f2bd5a442b7c4d78a46e8f54a4558b68` | Gestión y Reprogramación de Reserva Móvil | Gestión mobile, 780×7558 | Gestionar cita desde móvil. | Cita confirmada → nueva confirmación | No implementada. |
| `0a960d67357a4f91baef23e04eceedc7` | Confirmación Exitosa de Reprogramación Desktop | Reprogramación exitosa desktop, 2560×6422 | Confirmar nueva fecha, pase y políticas mostradas. | Gestión → cita actualizada | No implementada. |
| `22262aa195464dc98f431c5f84a8c57b` | Confirmación Exitosa de Reprogramación Móvil | Reprogramación exitosa mobile, 780×5664 | Confirmar cambio en móvil. | Gestión → cita actualizada | No implementada. |
| `5f682e8cbfe74a06b20b151dbfff7123` | Email Transaccional de Reprogramación Confirmada | Email desktop, 2560×6198 | Presentar comunicación transaccional imprimible/guardable. | Reprogramación → notificación | No implementada. |
| `ea3534c24f674e91bb8b7a67886d9084` | Email Transaccional Móvil de Reprogramación | Email mobile, 780×5172 | Representar correo en cliente móvil. | Reprogramación → notificación | No implementada. |
| `2232550556734e89982f586a4912880d` | Portal del Paciente & Historial Desktop | Portal desktop, 2560×7270 | Citas, documentos, tratamientos, pagos y visor clínico. | Login → portal | No implementada y no debe simularse como segura. |
| `66973a87d7524f9b808685aa7dad7da9` | Portal del Paciente Móvil | Portal mobile, 780×3820 | Consultar resumen y documentos desde móvil. | Login → portal | No implementada. |
| `54c7cb5cf9dd42c886506c5de08da876` | Mapa de Flujo de Navegación & Simulador Interactivo | Prototipo desktop, 2560×3392 | Documentar rutas, simular pasos y filtrar matriz. | Herramienta interna de diseño | No es una pantalla de producto local. |
| `3614fe49b43a448e97549a3119f5c6e0` | Experiencia Interactiva & Motion | Prototipo desktop, 2560×16848 | Explorar motion, FAQ y formulario en una exportación alternativa. | Prototipo → secciones | No es la implementación local. |
| `16796846946682543758` | `image.png` | Recurso de referencia, 1504×926 | Imagen suelta, no flujo ni pantalla identificable. | N/A | No se usa como pantalla local. |
| `dbbf1664-a06b-457f-a669-9f422057341c` | `image.png` (instancia auxiliar) | Imagen asociada a `167968...`, 512×315 | Variante/instancia de recurso gráfico. | N/A | No es una pantalla de producto. |
| `dc97def7-cba1-47c2-bc0e-e395e11309b8` | `image.png` (instancia oculta) | Imagen auxiliar oculta, 358×115 | Recurso gráfico sin flujo identificable. | N/A | No es una pantalla de producto. |
| `assets_02350d5dc5d3427883c52c87df46c490` | Recurso sin etiqueta | Instancia auxiliar, 960×540 | Entrada de asset sin nombre funcional ni `deviceType`. | N/A | No clasificable como pantalla; requiere identificación si se necesita. |

## Agrupación funcional

| Recorrido | Entradas Stitch | Lectura arquitectónica |
| --- | --- | --- |
| Sitio público | Home, responsive, servicios, equipo, espacio, FAQ, contacto, menú | Una experiencia pública compartida, con variantes de viewport. |
| Reserva | Modal desktop, reserva mobile, confirmación/pasarela | Un flujo de reserva con pasos; no debe confundirse con una página estática. |
| Post-reserva | Éxito, pase digital, email | Estados y canales de una misma reserva, no tres reservas distintas. |
| Gestión | Reprogramación, cancelación y confirmaciones | Mutaciones de una cita existente con controles de concurrencia. |
| Portal | Desktop/mobile del paciente | Área autenticada y separada del sitio público. |
| Prototipos | Mapa de flujo y motion | Material de diseño/validación, no funcionalidad de producción. |

## Trazabilidad local

| Requisito | Evidencia local | Limitación |
| --- | --- | --- |
| Navegación pública | `nav` y anclas en `src/App.tsx` | No hay router ni rutas profundas. |
| Tratamientos | `treatments`, `activeTreatment`, `role=tab` | No hay persistencia ni datos remotos. |
| FAQ | `faqs`, `openFaq`, `aria-expanded` | No hay filtros ni CMS. |
| Contacto | `AppointmentForm`, `validateAppointmentForm` | No envía ni almacena; solo valida en memoria. |
| Recursos visuales | 11 WebP en `src/assets/images/` | Procedencia de Stitch, no licencia comercial general. |
| Tipografía | `google-fonts.css` local y TTF | No se ha medido carga en navegador en esta fase. |
| Portal/pagos/agenda | Sin módulos ni endpoints | Diseñado, pendiente de implementación y decisiones. |

