# Design

## Context

- `models/db_.py` ya declara `solicitud.actividad` con `requires=IS_IN_SET(['PROV', 'ADMIN'])`, pero la tabla se define con `migrate=False`: el campo debe existir en la base de datos desplegada.
- `controllers/solicitudes.py` ya incluye `db.solicitud.actividad` en el `GET` del detalle, pero el `PUT` de asignar y el `POST` de reenvío no lo leen ni lo validan.
- El frontend no declara `actividad` en `SolicitudDetalle` ni en `SolicitudRow`, y no la muestra ni la escribe.
- La jerarquía de áreas se puede resolver con `area.nivel` y `area.padre`. `controllers/destinos.py` ya compara `area.nivel` con `6` y `7`, lo que confirma el uso de esos identificadores.
- Las acciones de solicitud son rutas anidadas que renderizan modales sobre el detalle; el detalle provee `solicitud:solicitud` y las vistas de acción lo consumen con `inject`.
- La línea base advierte que las acciones `PUT` validan la relación del usuario con la solicitud, pero no el estado, y que el `POST` de reenvío no valida el permiso de reenvío.

## Goals / Non-Goals

**Goals:**

- Detectar en el backend las solicitudes nivel 7 → nivel 6 y exponer esa condición en el detalle.
- Permitir que solo el supervisor del área destino defina `PROV` o `ADMIN`, una única vez, en estado 1 o 2.
- Bloquear la asignación y el reenvío mientras falte la actividad.
- Mostrar la actividad en el detalle y pedirla mediante un modal antes de la acción.
- Mantener el cambio acotado al detalle, sin tocar listado, reportes ni vistas SQL.

**Non-Goals:**

- Añadir la actividad al listado de solicitudes, a `vw_solicitudes_raw` o a los reportes.
- Registrar la definición en la bitácora o enviar notificaciones.
- Hacer backfill de solicitudes existentes.
- Cambiar las reglas de permisos de asignación o reenvío más allá de la actividad.
- Introducir nuevas claves de query o stores.

## Decisions

### 1. La regla se calcula en el backend

Se añade un helper `requiere_actividad(solicitud)` que devuelve verdadero cuando `origen.nivel == 7` y `destino.id == origen.padre`. El detalle expone:

- `actividad`: `"PROV" | "ADMIN" | null`;
- `requiere_actividad`: booleano;
- `puede_definir_actividad`: booleano, verdadero solo si requiere actividad, está nula, el usuario es supervisor del área destino y el estado es 1 o 2.

Así la interfaz no duplica la jerarquía de niveles ni la regla de autorización. Si mañana la clasificación aplica a otros niveles, se cambia en un solo lugar.

Alternativa considerada: calcular la condición en el frontend a partir de `origen.nivel` y `origen.padre`. Se descarta porque obliga a replicar la regla y a conocer los ids de nivel en la UI.

### 2. La actividad se guarda con un `PUT` dedicado

El modal confirma con:

```http
PUT /solicitudes/solicitudes/:id
{ "actividad": "PROV" | "ADMIN" }
```

La rama se evalúa antes que las acciones existentes y solo actualiza `actividad`. El backend valida:

- que la solicitud requiera actividad;
- que el estado sea 1 o 2;
- que el usuario sea supervisor del área destino;
- que `solicitud.actividad` sea `null` (escritura única).

Errores: `422` con `{ actividad: ["..."] }` para validación y `403` para autorización.

Ventajas frente a enviar la actividad junto con la asignación o el reenvío:

- los payloads de asignar y reenviar no cambian;
- el reenvío no necesita actualizar el padre y crear la hija en la misma petición;
- la actividad queda registrada aunque el usuario cancele el formulario de la acción, lo cual es coherente con que sea una propiedad de la solicitud.

Alternativa considerada: incluir `actividad` en el `PUT` de asignar y en el `POST` de reenvío. Se descarta porque amplía dos contratos y mezcla dos responsabilidades.

### 3. Solo el supervisor del área destino define la actividad

La autorización de la nueva rama es equivalente a la de asignar: membresía `supervisor` y área del usuario igual al destino. El tramitador no puede escribirla.

Consecuencia: en una solicitud en estado 2 sin actividad, el tramitador no puede reenviar hasta que el supervisor la defina. El supervisor puede hacerlo abriendo la acción de asignar (permitida en estado 2), definiendo la actividad y luego reasignando o cancelando. La UI del tramitador muestra un aviso explícito en lugar de un formulario que fallará.

Alternativa considerada: permitir al tramitador como excepción. Se descarta porque la regla acordada reserva la escritura al supervisor.

### 4. El modal de actividad es un paso previo dentro de las vistas de acción

No se crean rutas nuevas. `asignar.vue` y `reenviar.vue` renderizan condicionalmente:

1. si `puede_definir_actividad`, el componente `SolicitarActividad.vue`;
2. si requiere actividad y el usuario no puede definirla, un aviso de bloqueo;
3. en caso contrario, el formulario normal de la acción.

Cuando la actividad se guarda, la mutación invalida el detalle y la vista muestra el formulario de la acción. Esto cubre también el acceso directo por hash a la ruta de la acción.

Alternativa considerada: una ruta `solicitudes-solicitud-actividad` que después navega a la acción. Se descarta para no añadir rutas, props y navegación adicional.

### 5. Escritura única y datos heredados

El backend rechaza cualquier segundo intento de escritura, incluso con el mismo valor. La UI deja de ofrecer el modal cuando `actividad` ya está definida.

Las solicitudes existentes en estado 3 o 4 sin actividad se dejan como están: no tienen acciones de asignar ni reenviar. Las que estén en estado 1 o 2 se bloquean hasta que el supervisor defina la actividad. No se hace backfill.

### 6. Contrato y capas del frontend

- `src/types/models.ts`: `ActividadSolicitud`, campos nuevos en `SolicitudDetalle` y variante `SolicitudActividadDefinida` en `SolicitudUpdate` / `SolicitudUpdatePayload`.
- `src/types/backend.ts`: `actividad` en `SolicitudRow`.
- `src/constants/index.ts`: opciones `PROV` → «Provisión» y `ADMIN` → «Administración».
- `src/stores/solicitudes/useSolicitudUpdate.ts`: sin cambios; la mutación ya invalida listas, detalles y notificaciones.
- `src/components/features/solicitudes/[id]/SolicitarActividad.vue`: modal con `BFormRadioGroup`, `BotonEnvio`, errores inline y aviso de escritura única.
- `src/views/solicitudes/[id]/asignar.vue` y `reenviar.vue`: paso previo y aviso de bloqueo.
- `src/views/solicitudes/[id]/index.vue`: muestra la actividad cuando está definida.
- No se toca `src/router/index.ts` ni `AccionesMenu.vue`.

## Risks / Trade-offs

- **Solicitud en estado 2 sin actividad y tramitador bloqueado** → el aviso indica que el supervisor debe definirla; el supervisor puede hacerlo desde la acción de asignar y cancelar después. Se documenta como dependencia operativa.
- **El backend no valida el estado en las acciones existentes** → la nueva rama sí valida estados 1 y 2, pero las transiciones fuera de orden siguen siendo una deuda conocida. No se corrige aquí.
- **El `POST` de reenvío no valida el permiso de reenvío** → se añade solo la guarda de actividad, no el endurecimiento del permiso. Queda como deuda existente.
- **La actividad puede quedar definida aunque el usuario cancele la acción** → es intencional: la actividad describe la solicitud, no la asignación. Se explica en el modal.
- **Dependencia de los ids de nivel 6 y 7** → se usa la misma convención que `destinos.py`. Si el catálogo cambia, el helper debe actualizarse.
- **`migrate=False`** → el campo debe existir en la base de datos desplegada. Si no existe, el `GET` y el `PUT` fallarán. Verificar el esquema antes de desplegar.
- **Dos modales en la misma vista** → se renderizan de forma condicional, uno a la vez, y el cierre del modal de actividad no debe navegar hacia atrás después de guardar. Se usa una bandera de éxito para evitar el `back()` en `@hidden`.
- **Sin visibilidad en listado ni reportes** → aceptado en esta versión; la actividad solo se consulta en el detalle.

## Migration Plan

1. Verificar en la base de datos desplegada que `solicitud.actividad` existe y admite `NULL`, `PROV` y `ADMIN`.
2. Desplegar el backend: helper, flags del detalle, rama `PUT { actividad }` y guardas de asignar/reenviar.
3. Desplegar el frontend: tipos, constante, componente, vistas y detalle.
4. Verificar manualmente los escenarios de la spec, incluido el caso heredado de estado 2 sin actividad.
5. Ejecutar `npm run lint` y `npm run typecheck`; añadir `npm run build` si se toca configuración de publicación.
6. Actualizar `specs/_baseline/solicitudes.md` y `project-context.md` al archivar el cambio.

Rollback: revertir las guardas del backend y la UI. Los valores de `actividad` ya guardados son inofensivos y pueden conservarse.

## Open Questions

Ninguna que cambie el enfoque, la spec o el desglose de tareas. La bitácora y el backfill quedan explícitamente fuera de alcance y pueden tratarse en cambios posteriores.
