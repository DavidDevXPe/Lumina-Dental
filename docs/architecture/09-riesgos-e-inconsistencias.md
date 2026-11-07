# 09. Riesgos e inconsistencias

## 9.1 Criterio

- **Confirmado**: el valor aparece en la exportación consultada o en el proyecto local.
- **Riesgo potencial**: podría causar daño si se presenta como hecho o se implementa sin decisión.
- **Pendiente/no verificable**: requiere fuente externa, negocio, profesional sanitario o prueba de ejecución.

## 9.2 Registro de inconsistencias de Stitch

| Dato | Valores encontrados | Fuente | Riesgo | Decisión pendiente | Recomendación |
| --- | --- | --- | --- | --- | --- |
| Ubicación | Velázquez 64; Serrano 84; Claudio Coello 48; Marqués de Salamanca 14; Velázquez 74 | Pantallas de contacto, servicios, reserva, portal y confirmaciones | Alto: dirección errónea puede causar llegada a una sede inexistente | Confirmar una única sede real | Mantener solo placeholder explícito hasta verificación. |
| Ciudad/país | Madrid/Salamanca en Stitch; Lima/Perú en la demo local | Stitch vs `App.tsx`/`index.html` | Alto: jurisdicción, SEO y contacto contradictorios | Confirmar mercado objetivo | No mezclar contenido de Madrid con la demo de Lima. |
| Teléfonos | Varios números `+34 91...`, además de números de WhatsApp distintos | Exportaciones transaccionales y de contacto | Alto: comunicaciones a terceros | Confirmar canal oficial | Configurar un único contacto desde backend/CMS aprobado. |
| Especialista Mateo | Dr. Mateo Soria; Dr. Mateo Arriaga | Reserva, equipo, portal y confirmaciones | Alto: identidad y credenciales ambiguas | Confirmar nombre real o eliminar perfil | Localmente marcar perfil ficticio, como ya se hace. |
| Otros profesionales | Dra. Elena Valdés; Dra. Sofía Larrea; Dra. Clara Mendoza | Variantes de equipo y reserva | Alto: no usar nombres/credenciales sin autorización | Definir equipo real | Crear fichas solo a partir de datos verificados. |
| Duración | 60 minutos; hasta 90 minutos; acceso sensorial 11:35 | FAQ, reservas, emails y confirmaciones | Alto: afecta agenda y precio | Diferenciar duración clínica, preparación y bloque de sala | Modelar `serviceDuration` y `operationalBuffer` por servicio. |
| Fechas | Miércoles 22 de octubre de 2025; viernes 24 de octubre de 2025 | Gestión, confirmación y emails | Alto: ejemplos aparentan citas reales o inconsistentes | Elegir datos sintéticos coherentes | Usar fecha fija claramente ficticia o datos generados en sandbox. |
| Horas | 10:30, 11:30, 11:35, 11:45 | Reservas, correos y confirmaciones | Medio/alto: contradicción operativa | Definir si es hora de cita o ritual de llegada | Etiquetar zona horaria y separar llegada de cita. |
| Importe | 90 €, 90,00 €, depósito, fianza, honorario diagnóstico, 100% deducible | FAQ, reserva, pagos y portal | Alto: obligación comercial y contable | Aprobar precio, impuestos, deducibilidad y reembolso | No implementar cobro hasta tener política versionada. |
| Cancelación | Reembolso íntegro en algunas pantallas; retención con menos de 24 h en FAQ; sin penalización en otras | FAQ, gestión y confirmaciones | Alto: conflicto contractual | Aprobación legal/comercial | Mostrar una única política con fecha de vigencia. |
| Registros y credenciales | CS-9941, CS-11482/M, CS-14920, CS-10492, ISO y COEM | Footer, portal y confirmaciones | Crítico: posible representación engañosa | Verificación documental | Eliminar del producto real hasta comprobar cada registro. |
| Servicios y claims | “Cero dolor”, “predictibilidad absoluta”, materiales y protocolos concretos | Home, FAQ, reservas y confirmaciones | Alto: promesa clínica/comercial | Revisión de profesional y legal | Sustituir por lenguaje prudente y verificable. |
| Amenities | Parking, Bose, aromaterapia, matcha, sedación, ritual sensorial | Confirmaciones, contacto y gestión | Medio/alto: expectativas y responsabilidad | Confirmar si existe cada servicio | Mantener como concepto o quitarlo. |

## 9.3 Estado local frente a las contradicciones

La implementación local no reproduce las direcciones, teléfonos, registros ni precios de Stitch. Usa Lima/Perú, ubicación ficticia, correo `.demo`, perfiles demostrativos y textos que indican que no representan una clínica real. Esto reduce el riesgo de presentar datos de Stitch como hechos, pero la diferencia debe mantenerse documentada si el diseño se vuelve a sincronizar.

## 9.4 Riesgos de implementación

| Riesgo | Gravedad | Evidencia o condición | Mitigación |
| --- | --- | --- | --- |
| Confundir exportación HTML con producto funcional | Alta | Stitch tiene inline JS, CDN y estados simulados | Matriz de pantallas y contratos separados. |
| Introducir salud clínica en un formulario comercial | Alta | Campo de notas/preferencias | Minimizar campos y bloquear datos sensibles en demo. |
| Doble reserva por concurrencia | Alta | Agenda aún inexistente | Restricción transaccional y pruebas de carrera. |
| Confirmar pago desde el navegador | Alta | Flujo de pago solo diseñado | Webhook firmado e idempotente. |
| Fuga mediante QR/documentos | Crítica | Portal/QR muestran datos clínicos diseñados | Tokens revocables, URLs firmadas y auditoría. |
| Dependencia de URLs privadas de Stitch | Media | HTML exportado contiene URLs AIDA | Assets locales con licencia documentada. |
| Accesibilidad incompleta | Media | Tabs y menú local requieren revisión de teclado/foco | Tests de interacción y navegador real. |
| Políticas contradictorias | Alta | Depósito/cancelación/duración varían | Decision log antes de API y copy. |

## 9.5 Decisiones que requieren aprobación

1. Ubicación y jurisdicción definitivas.
2. Datos reales o estrategia explícita de contenido ficticio.
3. Catálogo y claims clínicos aprobados.
4. Duraciones y capacidad por servicio.
5. Depósito, pago, reembolso y cancelación.
6. Alcance del portal y qué documentos pueden exponerse.
7. Proveedor de identidad, pagos, comunicaciones, archivos y agenda.
8. Responsable legal y profesional de revisar seguridad y privacidad.

## 9.6 Observaciones estáticas de la demo local

| Observación | Estado | Impacto |
| --- | --- | --- |
| El menú móvil expone `aria-expanded`, pero no se observa `aria-controls`, cierre con Escape ni devolución de foco | Confirmado en `src/App.tsx` | Riesgo de navegación de teclado y lectores de pantalla; validar en navegador antes de corregir. |
| El selector de servicios usa `tablist`, `tab` y `tabpanel`, pero no enlaza `aria-controls`/`aria-labelledby` ni implementa flechas de teclado | Confirmado en `src/App.tsx` | Semántica incompleta para el patrón de tabs. |
| El FAQ referencia un ID cuyo contenido solo se monta cuando está abierto | Confirmado en `src/App.tsx` | `aria-controls` puede apuntar a un elemento inexistente en estado cerrado. |
| Los errores tienen `aria-invalid`, pero no una asociación explícita mediante `id`/`aria-describedby` | Confirmado en `src/App.tsx` | Un lector de pantalla puede no anunciar el mensaje junto al campo. |
| Formulario sin `action`/petición y con `preventDefault()`; el estado vive en React | Confirmado en `src/App.tsx` | No hay envío ni persistencia, aunque los valores permanecen en memoria mientras la vista está montada. |
| Pruebas solo para `validateAppointmentForm` | Confirmado en `src/lib/validation.test.ts` | Menú, FAQ, tabs, formulario y accesibilidad siguen sin pruebas automatizadas. |

Estas observaciones son hallazgos estáticos; no sustituyen una revisión de teclado, lector de pantalla, contraste o renderizado real.

