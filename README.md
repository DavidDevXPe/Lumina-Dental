# Lúmina Dental — demo comercial

Demo de DavidDevX para una clínica dental ficticia. La interfaz sigue la estructura editorial del proyecto privado de Stitch **Lúmina Dental Boutique Studio** y está construida con React, TypeScript, Vite, Tailwind CSS y Vitest.

## Estado

- Landing editorial con hero, manifiesto, tratamientos, recorrido de primera visita, perfiles demostrativos, galería del espacio, FAQ y formulario.
- El menú móvil, el acordeón FAQ y la validación del formulario funcionan localmente.
- El formulario no envía ni almacena información.
- Ubicación, equipo, métricas y textos clínicos son ficticios y no representan una clínica real.

## Recursos visuales de Stitch

Los 11 archivos siguientes se exportaron del proyecto de Stitch y se guardan localmente en `src/assets/images/`. Se descargaron mediante la variante de mayor resolución disponible en el recurso (`w2048`); actualmente tienen entre 768 y 1408 px de ancho.

| Archivo | Uso |
| --- | --- |
| `stitch-hero.webp` | Hero y suite de tratamiento |
| `stitch-veneer.webp` | Tratamiento de estética y cerámica |
| `stitch-aligner.webp` | Ortodoncia invisible |
| `stitch-scan.webp` | Implantología guiada |
| `stitch-hygiene.webp` | Profilaxis Air-Flow |
| `stitch-dentist.webp` | Perfil demostrativo de especialista |
| `stitch-orthodontist.webp` | Perfil demostrativo de ortodoncista |
| `stitch-surgeon.webp` | Perfil demostrativo de cirujana |
| `stitch-lounge.webp` | Sala de espera biofílica |
| `stitch-diagnostics.webp` | Gabinete de diagnóstico y recorrido |
| `stitch-chair.webp` | Sillón dental y galería del espacio |

Son recursos del proyecto de diseño de Stitch. No deben reutilizarse fuera de este proyecto sin revisar los permisos y condiciones aplicables a la cuenta. Las personas y espacios se presentan como referencias visuales o perfiles ficticios, nunca como profesionales, sede o evidencia clínica real de Lúmina Dental.

## Tipografías locales

Playfair Display y Plus Jakarta Sans se sirven desde `src/assets/fonts/` mediante `@font-face`, sin peticiones de fuente en tiempo de ejecución. Se conservan los avisos de SIL Open Font License 1.1 en `src/assets/fonts/OFL.txt`.

## Dependencias

Producción: `react`, `react-dom`, `lucide-react`.

Desarrollo: `vite`, `@vitejs/plugin-react`, `typescript`, `tailwindcss`, `@tailwindcss/vite`, `vitest`, `jsdom`, `@types/react`, `@types/react-dom`.

## Comprobaciones

```bash
npm.cmd run build
npm.cmd test
```

La revisión visual en navegador real sigue siendo pendiente.

## MVP-1 funcional local

La demo incluye un API Fastify bajo `/api/v1`, flujo de solicitud de cita, disponibilidad demo, autenticación administrativa, panel de solicitudes, catálogo/perfiles, bloqueos de agenda y notificaciones simuladas. El frontend conserva la identidad editorial, imágenes y fuentes locales.

Dependencias añadidas para el MVP: `fastify`, `@fastify/cookie`, `drizzle-orm`, `pg`, `argon2`; herramientas locales: `tsx`, `@types/node` y `@types/pg`. No se conectan servicios externos.

Consulta [docs/implementation/mvp-1-local.md](docs/implementation/mvp-1-local.md) para ejecutar el modo demo o PostgreSQL local. El estado verificable se registra en [docs/implementation/verification-log.md](docs/implementation/verification-log.md).
