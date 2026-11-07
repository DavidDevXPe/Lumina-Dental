# 08. Seguridad y privacidad

## Alcance y jurisdicción

Muchas pantallas de Stitch muestran Madrid, Barrio de Salamanca, registros y teléfonos españoles. La aplicación local actual muestra deliberadamente Lima, Perú y etiqueta todos los datos como ficticios. Por tanto, **la jurisdicción real no está confirmada**.

Si el producto real se ubicara en España, los datos de salud entrarían en el régimen reforzado de categorías especiales del RGPD. La AEPD explica el régimen de datos de salud y las obligaciones del sector sanitario; el RGPD define los datos relativos a la salud y sus condiciones de tratamiento; y la LOPDGDD desarrolla el marco español. Fuentes oficiales consultadas:

- [AEPD: Tus derechos en relación con tus datos de salud](https://www.aepd.es/areas-de-actuacion/salud/tus-derechos-en-relacion-con-tus-datos-de-salud).
- [AEPD: Guía para profesionales del sector sanitario](https://www.aepd.es/es/documento/guia-profesionales-sector-sanitario.pdf).
- [EUR-Lex: Reglamento (UE) 2016/679](https://eur-lex.europa.eu/eli/reg/2016/679/spa).
- [BOE: Ley Orgánica 3/2018, texto consolidado](https://www.boe.es/eli/es/lo/2018/12/05/3/con).

Esto es una evaluación técnica preliminar, no una opinión legal, certificación RGPD ni certificación sanitaria.

## 8.1 Datos y minimización

- No solicitar diagnóstico, radiografías, historia ni datos de tarjeta en el formulario público.
- Separar datos de contacto de datos clínicos.
- Solicitar preferencias sensoriales solo si son necesarias para prestar una atención aprobada.
- No usar datos clínicos para marketing sin base y consentimiento independiente cuando corresponda.
- Definir finalidad, base jurídica, responsable, encargados, transferencias, retención y derechos antes de producción.

## 8.2 Control de acceso

1. Autenticar identidad y autorizar cada recurso por paciente, profesional, función y sede.
2. Aplicar mínimo privilegio y segregación de funciones.
3. Usar sesiones HTTP-only, Secure, SameSite apropiado, expiración y revocación.
4. Proteger recuperación de cuenta y desafíos contra enumeración, abuso y reuso.
5. Exigir controles reforzados para exportar o compartir documentos.
6. Registrar accesos a historia, documentos, pagos, cambios de permisos y sesiones privilegiadas.

## 8.3 QR y enlaces

- QR con token aleatorio, corto y revocable.
- Sin nombre completo, diagnóstico, fecha de nacimiento, teléfono, correo o historia en el payload.
- Validación online o mecanismo de expiración verificable.
- No tratar una captura de pantalla del QR como autorización permanente.
- Enlaces de documentos con expiración, alcance mínimo y autorización servidor.

## 8.4 Aplicación y API

- Validar todos los inputs en servidor y cliente.
- Codificar salidas y evitar HTML arbitrario.
- No registrar cuerpos completos, notas clínicas, tokens, secretos ni datos de tarjeta.
- Verificar firma, timestamp e idempotencia de webhooks.
- Limitar solicitudes de login, reserva, documentos, exportaciones y generación de notificaciones.
- Usar protección CSRF si la sesión se basa en cookies.
- Restringir CORS a orígenes aprobados.
- No confiar en `VITE_` para secretos: cualquier variable con ese prefijo llega al navegador.

## 8.5 Archivos clínicos

- Validar tipo, tamaño, extensión, contenido y antivirus antes de almacenar.
- Generar nombres internos; no confiar en nombres de fichero del usuario.
- Separar objetos clínicos de recursos públicos.
- Cifrar en tránsito y en reposo, con gestión de claves y rotación.
- Mantener historial de acceso y descarga.
- Definir exportación DICOM/STL, borrado, retención y recuperación antes de implementar.

## 8.6 Consentimiento, retención e incidentes

- Versionar textos de privacidad, consentimiento informado y comunicaciones.
- Guardar quién, qué versión, cuándo y para qué finalidad aceptó.
- No mezclar consentimiento clínico con marketing.
- Definir retención por categoría y un proceso de supresión/bloqueo compatible con obligaciones legales y profesionales.
- Preparar inventario de tratamientos, acuerdos con encargados, evaluación de impacto cuando proceda y plan de brechas.

## 8.7 Hallazgos sobre la demo local

| Hallazgo | Estado | Evidencia |
| --- | --- | --- |
| No hay API, autenticación ni datos persistentes | Confirmado | `App.tsx` solo usa estado React y `preventDefault()`. |
| El formulario contiene campos que podrían recibir datos personales | Confirmado | Nombre, correo, motivo y notas en `App.tsx`. |
| El texto advierte no introducir datos médicos | Confirmado | Nota visible del formulario. |
| Las personas y ubicación están etiquetadas como ficticias | Confirmado | Copys de perfiles, ubicación y footer. |
| Seguridad de producción | No verificable | No existe backend ni despliegue que auditar. |

