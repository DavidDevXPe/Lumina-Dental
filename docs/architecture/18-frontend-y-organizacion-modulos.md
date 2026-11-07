# 18. Frontend y organización de módulos

## Estado

Arquitectura frontend futura para el MVP-1. El frontend actual se conserva sin refactorizar en esta fase.

## 1. Principios de continuidad

Se mantiene React + TypeScript + Vite + Tailwind CSS v4 y la identidad Warm Editorial Atelier: marfil `#FBF9F4`, verde bosque `#1A382B`, terracota `#C86446` y sage `#E3ECE7`. Los recursos locales y la tipografía ya incorporada son parte del lenguaje visual y no deben sustituirse por URLs privadas.

La migración desde el `App.tsx` actual será incremental. La arquitectura propuesta no autoriza modificar ahora la interfaz, instalar un router ni añadir una biblioteca de estado.

## 2. Rutas futuras

| Área | Ruta | Protección |
| --- | --- | --- |
| Público | `/` | Pública |
| Público | `/servicios` | Pública; puede ser una sección ancla al inicio |
| Público | `/solicitar-cita` | Pública |
| Administrativo | `/admin/login` | Pública solo para autenticación |
| Administrativo | `/admin` | Sesión y rol |
| Administrativo | `/admin/solicitudes` | Sesión y permiso operativo |
| Administrativo | `/admin/servicios` | Sesión y permiso de edición |
| Administrativo | `/admin/especialistas` | Sesión y permiso de edición |
| Administrativo | `/admin/horarios` | Sesión y permiso de configuración |
| Administrativo | `/admin/notificaciones` | Sesión; simulaciones |
| Administrativo | `/admin/auditoria` | Sesión y permiso administrativo |

El router exacto queda pendiente de revisión de dependencias. Si el flujo público puede funcionar con secciones en la demo inicial, no se debe añadir navegación multipágina solo por anticipar la futura aplicación.

## 3. Organización propuesta

```text
src/
  app/                 composición, rutas y proveedores
  pages/public/        página pública y solicitud de cita
  pages/admin/         login y vistas operativas
  components/ui/       controles accesibles y reutilizables
  components/public/   hero, servicios, equipo, FAQ y contacto
  components/appointments/ formulario y estados de solicitud
  components/admin/    tablas, filtros, estados y formularios
  lib/api/             cliente HTTP, errores y contratos
  lib/auth/            sesión y protección de rutas
  lib/validation/      esquemas compartidos sin datos sensibles
  styles/              tokens y estilos globales
  assets/              imágenes y fuentes locales
```

No es una instrucción para mover los archivos actuales de forma inmediata. Primero deben fijarse contratos API y pruebas de comportamiento.

## 4. Estado y comunicación

- Estado local para menú, FAQ, tabs, formularios y estados visuales efímeros.
- Hooks propios para cargar servicios, especialistas, disponibilidad y solicitudes.
- Cliente `fetch` pequeño con timeout, `requestId`, normalización del sobre de error y cancelación de peticiones obsoletas.
- Cache local solo para lecturas no sensibles; nunca guardar credenciales ni datos de contacto en `localStorage`.
- Estados explícitos de carga, vacío, error con reintento, éxito y sesión expirada.
- Mutaciones con idempotencia cuando una repetición podría duplicar una solicitud.

No se selecciona todavía una biblioteca global de estado. La necesidad debe demostrarse cuando existan el panel y los contratos reales.

## 5. Formularios y accesibilidad

El formulario público conservará su finalidad demostrativa y solo solicitará datos mínimos. Debe mostrar validación junto al campo, `aria-invalid`, `aria-describedby`, foco en el primer error y un anuncio de resultado. Nunca debe enviar ni almacenar datos en la demo.

El menú móvil debe conservar botón nativo, nombre accesible, `aria-expanded`, `aria-controls`, cierre por Escape, foco razonable y enlaces táctiles. Las tabs deben tener relaciones `id`/`aria-controls`, selección coherente y soporte de teclado si siguen siendo tabs. FAQ y diálogos deben anunciar su estado sin depender solo del color.

La navegación y el contenido deben usar `header`, `nav`, `main`, `section`, encabezados jerárquicos, `footer`, contraste suficiente, foco visible, `prefers-reduced-motion` y texto alternativo significativo para imágenes no decorativas.

## 6. Correspondencia con la implementación actual

| Actual | Evolución propuesta |
| --- | --- |
| `App.tsx` monolítico | Extraer páginas y componentes por comportamiento, manteniendo primero el render existente. |
| `styles.css` y `studio.css` | Consolidar solo tras revisar visualmente; conservar tokens, fuentes e imágenes locales. |
| Validación en `src/lib/validation.ts` | Reutilizar como frontera de UI y alinear con el contrato de API. |
| `sent` local del formulario | Convertir en respuesta de API solo cuando exista backend; mantener simulación durante demo. |
| Dos tests de validación | Ampliar por capas sin eliminar los existentes. |

## 7. Pendientes

Requieren decisión posterior el router, la estrategia de carga/caché, el formato final de contratos compartidos y la división exacta de páginas. Ninguna de estas decisiones justifica cambiar ahora el diseño aprobado.

