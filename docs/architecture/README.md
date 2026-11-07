# Arquitectura maestra de Lúmina Dental

Esta carpeta documenta la arquitectura funcional, técnica y de negocio para evolucionar la demo de **Lúmina Dental** hacia un producto odontológico profesional. La documentación no implementa backend, reservas, pagos, portal clínico ni integraciones.

## Estado de fases

- **Fase 2:** cerrada funcionalmente. `11`, `12` y `13` registran el alcance MVP-1 aprobado y las decisiones de producto que siguen pendientes.
- **Fase 3:** arquitectura implementada localmente bajo `server/`, `shared/` y `db/`, sin publicar ni conectar servicios externos. Las decisiones de proveedores comerciales siguen pendientes.

## Orden recomendado de lectura

1. `01-vision-y-alcance.md`: objetivo, límites y separación entre demo, MVP y producción.
2. `02-inventario-pantallas.md`: trazabilidad de las pantallas disponibles en Stitch.
3. `03-arquitectura-funcional.md`: módulos, recorridos y responsabilidades.
4. `04-flujos-y-estados.md`: diagramas y máquinas de estados.
5. `05-reglas-de-negocio.md`: reglas propuestas pendientes de validación.
6. `06-modelo-conceptual-datos.md`: entidades y relaciones conceptuales.
7. `07-arquitectura-tecnica.md`: alternativas documentadas anteriormente.
8. `08-seguridad-y-privacidad.md`: controles funcionales y de privacidad.
9. `09-riesgos-e-inconsistencias.md`: contradicciones y decisiones abiertas.
10. `10-roadmap-y-criterios-aceptacion.md`: plan y criterios anteriores.
11. `11-registro-de-decisiones.md`: cierre de decisiones de Fase 2.
12. `12-alcance-definitivo-mvp.md`: alcance funcional aprobado del MVP-1.
13. `13-especificacion-funcional-aprobacion.md`: requisitos y puertas de aprobación.
14. `14-arquitectura-tecnica-definitiva.md`: selección recomendada de arquitectura.
15. `15-arquitectura-backend-y-api.md`: módulos y contratos API propuestos.
16. `16-modelo-datos-y-persistencia.md`: entidades, integridad y persistencia.
17. `17-seguridad-y-control-acceso.md`: autenticación, autorización y controles.
18. `18-frontend-y-organizacion-modulos.md`: evolución modular del frontend actual.
19. `19-infraestructura-y-entornos.md`: separación demo, test y producción futura.
20. `20-testing-y-criterios-calidad.md`: estrategia y puertas de calidad.
21. `21-decisiones-arquitectura-adr.md`: registro ADR técnico.

## Fuentes y evidencia

- **Implementación local:** `src/App.tsx`, `src/lib/validation.ts`, `src/lib/validation.test.ts`, `src/styles.css`, `src/studio.css`, `src/main.tsx`, `vite.config.ts`, `index.html`, `package.json` y `src/assets/`.
- **Diseño:** proyecto privado de Stitch `projects/17904738159341963128`, titulado **Lúmina Dental Boutique Studio**.
- **Exportaciones de Stitch:** 29 entradas listadas por el MCP; incluyen variantes responsive, estados transaccionales, prototipos y una imagen de referencia.
- **Evidencia confirmada:** visible en código local o en una exportación consultada.
- **Propuesta:** decisión necesaria para evolucionar el producto; requiere aprobación del responsable correspondiente.

## Convenciones

- La clínica, profesionales, direcciones, registros, precios, citas y testimonios son ficticios mientras no exista una fuente autorizada.
- Un diseño de Stitch no demuestra que una función exista ni que una integración sea segura.
- El formulario local es una simulación: valida en memoria, no hace peticiones y no persiste datos.
- Los documentos `01`–`10` se conservan como antecedentes y no fueron modificados en este cierre.

## Estado local resumido

La aplicación local es una landing React/Vite de una sola página con hero, manifiesto, tratamientos, recorrido, equipo demostrativo, espacio, FAQ y footer. Tiene menú móvil, selector de tratamientos y acordeón FAQ. No contiene servidor, autenticación, base de datos, pagos, calendario, notificaciones, archivos clínicos ni visor de imágenes médicas.

