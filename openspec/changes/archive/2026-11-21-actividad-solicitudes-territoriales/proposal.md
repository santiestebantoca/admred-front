# Proposal

## Why

Las solicitudes que un área del nivel 7 (Áreas de los Territorios) dirige a su área padre del nivel 6 (Grupo de Administración de los Territorios) deben clasificarse como actividades de **provisión** o de **administración** de la red. Hoy el campo `actividad` existe en la tabla `solicitud` y se devuelve en el detalle, pero ningún flujo lo escribe, lo valida ni lo muestra. Sin esa clasificación, el área receptora puede asignar o reenviar la solicitud sin dejar constancia de qué tipo de actividad atiende.

## What Changes

- El detalle de la solicitud expone si requiere actividad, el valor actual y si el usuario puede definirla.
- El supervisor del área destino define la actividad una única vez mediante un `PUT` dedicado, antes de asignar o reenviar.
- La asignación y el reenvío se bloquean en el backend si la solicitud requiere actividad y aún no la tiene.
- La interfaz muestra un modal de selección de actividad antes del formulario de asignar o reenviar; si el usuario no puede definirla, muestra un aviso de bloqueo.
- El detalle muestra la actividad cuando está definida.
- Quedan fuera de alcance el listado de solicitudes, los reportes, las vistas SQL, la bitácora de la definición y el backfill de solicitudes existentes.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `solicitudes`: se añade la clasificación obligatoria de actividad para solicitudes nivel 7 → nivel 6, su definición única por parte del supervisor del área destino y el bloqueo de asignación/reenvío mientras falte.

## Impact

- **Backend web2py**: `controllers/solicitudes.py` (detalle, `PUT` de asignar, `POST` de reenvío y nueva rama `PUT` de actividad); `models/db_.py` ya contiene el campo y no requiere migración.
- **Contrato de API**: `GET /solicitudes/solicitudes/:id` incorpora `requiere_actividad` y `puede_definir_actividad`; `PUT /solicitudes/solicitudes/:id` acepta `{ actividad }`; las acciones de asignar y reenviar pueden responder `422` por actividad faltante.
- **Frontend**: tipos de `solicitudes` y `models`, constante de opciones, nuevo componente de modal de actividad, vistas `asignar.vue`, `reenviar.vue` y detalle de la solicitud.
- **Documentación**: delta de la capacidad `solicitudes`, actualización de `specs/_baseline/solicitudes.md` y revisión de `project-context.md`.
- **Sin cambios** en listado, reportes, `vw_solicitudes_raw`, notificaciones ni base de datos.
