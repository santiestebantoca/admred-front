# Spec base: Solicitudes

> Comportamiento actual del módulo de solicitudes.
> Backend: `controllers/solicitudes.py`, `controllers/notas.py`,
> `controllers/notificaciones.py`, `modules/db/solicitudes.py`,
> `models/db_callbacks.py`.
> Frontend: `src/views/solicitudes/`, `src/stores/solicitudes/`,
> `src/components/features/solicitudes/`, `src/api/solicitudes.ts`.

---

## 1. Propósito y alcance

Una **solicitud** es una demanda formal de un área (origen) a otra (destino).
El módulo cubre:

- creación de la solicitud original;
- reenvío a otra área, que genera una solicitud hija;
- asignación a un tramitador del área destino;
- respuesta del tramitador;
- aprobación o rechazo del supervisor;
- evaluación del remitente;
- notas, adjuntos y notificaciones asociadas.

Fuera de alcance: reportes globales (ver `reportes.md`) y administración de catálogos
(ver `administracion.md`).

---

## 2. Modelo y estados

### Campos relevantes de `db.solicitud`

| Campo | Contenido |
| --- | --- |
| `id` | Identificador |
| `codigo` | Código visible `S-YY-NNNN` |
| `objetivo` | Texto de la demanda |
| `origen` | Área que crea la solicitud |
| `destino` | Área que debe atenderla |
| `tipo` | Tipo de solicitud (`db.tipo`) |
| `estado` | 1–4 |
| `remitente` | Usuario que la creó |
| `supervisor` | Supervisor que la asignó o reenvió |
| `tramitador` | Usuario asignado para responder |
| `padre` | Solicitud de la que proviene (reenvío) |
| `solicitado_en` | Fecha de creación |
| `tramitador_en` | Fecha de asignación |
| `respuesta_en` | Fecha de respuesta |
| `terminado_en` | Fecha de aprobación |
| `cumplir_en` | Fecha compromiso |
| `observaciones` | Respuesta del tramitador |
| `evaluacion` | Calificación del remitente (1–5) |

### Estados

| Id | Nombre | Significado operativo |
| --- | --- | --- |
| 1 | **Solicitado** | Creada, sin asignar |
| 2 | **En proceso** | Asignada a un tramitador |
| 3 | **En evaluación** | Respondida, pendiente de aprobación del supervisor |
| 4 | **Terminada** | Aprobada y cerrada |

### Máquina de estados

```text
                 crear
                   │
                   ▼
              ┌──────────┐   asignar    ┌────────────┐   responder   ┌───────────────┐
              │ Solicitado│ ───────────▶ │ En proceso │ ────────────▶ │ En evaluación │
              │    (1)   │               │    (2)     │               │      (3)      │
              └──────────┘               └────────────┘               └───────────────┘
                   │                          ▲                              │
                   │ reenviar (crea hija)     │ aprobar = 0                  │ aprobar = 1
                   ▼                          │                              ▼
              nueva solicitud            En proceso                       Terminada
              con padre_id                    (2)                             (4)
                                                                               │
                                                                               │ evaluar
                                                                               ▼
                                                                          evaluacion
```

Regla adicional del reenvío: al crear una hija, el **padre** pasa de estado 1 a 2 y se
le asigna como supervisor y tramitador al usuario que reenvía.

---

## 3. Actores y permisos

Los permisos se calculan en `GET /solicitudes/solicitudes/:id` y se devuelven en
`detalle.permisos`. Las acciones `PUT` vuelven a validar el permiso en el backend; la UI
solo debe ofrecer las acciones permitidas.

| Permiso | Condición calculada |
| --- | --- |
| `asignar` | Estado < 3 **y** el usuario es `supervisor` del área destino |
| `reenviar` | (`estado == 2` y es tramitador) **o** (`estado == 1` y es supervisor del área destino) |
| `responder` | `estado == 2` **y** es el tramitador |
| `aprobar` | `estado == 3` **y** es el supervisor asignado |
| `evaluar` | `estado == 4`, sin `evaluacion` **y** es el remitente |
| `comentar` | Estado < 4 **y** es supervisor, tramitador o remitente |

Validaciones del backend:

- **Asignar**: exige membresía `supervisor`, área del usuario igual al destino y
  tramitador del área destino.
- **Responder**: exige ser el `tramitador` de la solicitud.
- **Aprobar**: exige ser el `supervisor` de la solicitud.
- **Evaluar**: exige ser el `remitente`.
- **Comentar**: exige ser tramitador, remitente o supervisor de la solicitud.

> `AR` no concede permisos de acción sobre solicitudes; solo afecta a reportes.

> **Importante**: las validaciones del backend comprueban la relación del usuario con la
> solicitud, pero **no el estado** en `PUT`. La máquina de estados se garantiza por la UI;
> una llamada directa a la API podría ejecutar una transición fuera de orden.

---

## 4. Endpoints

### 4.1 Listado

```http
GET /solicitudes/solicitudes
```

Parámetros:

| Parámetro | Valores | Efecto |
| --- | --- | --- |
| `tray` | `recibidas` \| `enviadas` | Bandeja |
| `state` | `pendientes` \| `terminadas` | Filtro de estado |
| `period` | `1`–`4` | Periodo de terminadas |
| `status` | `1`–`4` | Estado concreto |
| `codigo` | texto | Búsqueda por código |
| `objetivo` | texto | Búsqueda por objetivo |
| `origen` | texto | Búsqueda por área origen |
| `destino` | texto | Búsqueda por área destino |
| `search` | texto | Búsqueda libre |
| `search_in` | array | Campos donde buscar |
| `page`, `limit` | enteros | Paginación en servidor |

Reglas de bandeja:

- **Recibidas**: si el usuario es `supervisor`, todas las del área destino; si no, las
  que tiene asignadas como tramitador.
- **Enviadas**: si es `supervisor`, todas las del área origen; si no, las que él creó.

`pendientes` excluye estado 4. `terminadas` incluye solo estado 4 y aplica el periodo:

| `period` | Ventana |
| --- | --- |
| `1` o ausente | Últimos 14 días |
| `2` | Último mes |
| `3` | Últimos 6 meses |
| `4` | Último año |

Respuesta paginada:

```json
{
  "data": [[id, codigo, objetivo, estado, solicitado_en, terminado_en, area, padre_id]],
  "meta": { "total": 0, "page": 1, "limit": 20, "totalPages": 0, "hasNext": false, "hasPrev": false }
}
```

`data` son **tuplas**, no objetos. La posición 6 es `origen` en recibidas y `destino`
en enviadas. Este orden es contrato y está tipado en `SolicitudListaTupla`.

### 4.2 Detalle

```http
GET /solicitudes/solicitudes/:id
```

Devuelve la solicitud con:

- `origen`, `destino` y `tipo` expandidos a fila;
- `estado` expandido a `{ id, nombre }`;
- `remitente`, `supervisor` y `tramitador` desde `vw_usuario`;
- `padre` (resumen) y `hijos` (array de resúmenes);
- `cant_nota`;
- `adjuntos_solicitud` (tipo 1) y `adjuntos_respuesta` (tipo 2);
- `permisos`.

### 4.3 Crear

```http
POST /solicitudes/solicitudes
```

Solicitud original:

```ts
{ destino, objetivo, adjuntos, tipo, cumplir_en? }
```

Reenvío:

```ts
{ padre, destino, objetivo, adjuntos, tipo, cumplir_en? }
```

El backend completa:

- `codigo` con la secuencia `S-YY-NNNN`;
- `solicitado_en = request.now`;
- `origen = auth.user.area`;
- `remitente = auth.user_id`;
- `estado = 1`.

Si viene `padre`, además actualiza el padre: `supervisor = tramitador = auth.user_id`,
`tramitador_en = now`, `estado = 2`.

Respuesta: `{ id, errors }`. Errores de validación → HTTP 422.

### 4.4 Actualizar / ejecutar acción

```http
PUT /solicitudes/solicitudes/:id
```

El backend decide la acción por la **clave presente** en el cuerpo:

| Clave | Acción | Efectos |
| --- | --- | --- |
| `tramitador` | Asignar o reasignar | `supervisor = auth.user_id`, `tramitador_en = now`, `estado = 2` |
| `observaciones` | Responder | `respuesta_en = now`, `estado = 3`; sincroniza adjuntos de respuesta |
| `aprobado = '1'` | Aprobar | `estado = 4`, `terminado_en = now` |
| `aprobado = '0'` | Rechazar | `estado = 2`; el frontend puede añadir nota con evento `Respuesta rechazada` |
| `evaluacion` | Evaluar | Guarda la calificación |

Respuestas:

- Asignar devuelve el número de filas actualizadas.
- Responder y evaluar devuelven `{ updated, errors }`.
- Errores de validación → HTTP 422.
- Sin permiso → HTTP 403.

### 4.5 Notas

```http
GET  /notas/notas?solicitudId=:id
POST /notas/notas
```

- `GET` devuelve las notas ordenadas por id, con `autor` y `como`
  (`tramitador`, `supervisor` o `remitente`).
- `POST` exige ser tramitador, remitente o supervisor.
- El backend rellena `tramitador` o `supervisor` según quién escribe; para el remitente
  deja ambos vacíos.
- **No se puede comentar una solicitud terminada desde la UI** (`permisos.comentar`),
  aunque el backend solo valida la relación con la solicitud.

### 4.6 Notificaciones

```http
GET /notificaciones/notificaciones
```

Devuelve:

```ts
{
  pendientes: {
    recibidas: { total, por_asignar[], por_responder[], por_aprobar[] },
    enviadas: { total }
  }
}
```

- `por_asignar`: estado 1 en el área destino, solo supervisores.
- `por_responder`: estado 2 asignadas al usuario.
- `por_aprobar`: estado 3 supervisadas por el usuario.
- Los totales usan las mismas reglas de bandeja que el listado.

### 4.7 Adjuntos

```http
POST   /uploads/uploads
DELETE /uploads/uploads/:id
```

- Tipo 1: adjuntos de la solicitud.
- Tipo 2: adjuntos de la respuesta.
- Al responder, se eliminan los adjuntos de respuesta heredados que no vengan en el
  array `adjuntos`. Es seguro porque el upload de la respuesta no se comparte.

### 4.8 Bitácora

```http
GET /bitacoras/bitacoras?solicitudId=:id
```

Registra automáticamente eventos de creación, asignación, respuesta, aprobación,
rechazo y evaluación desde `models/db_callbacks.py`. Es solo lectura.

---

## 5. Reglas de negocio

1. **Código**: `S-<año de 2 dígitos>-<consecutivo de 4 dígitos>`; el consecutivo se
   reinicia cada año.
2. **Origen y remitente** los impone el backend; el frontend no los envía.
3. **Crear una hija** cambia implícitamente el padre a estado 2 y le asigna el usuario
   actual como supervisor y tramitador.
4. **Asignar** exige que el tramitador pertenezca al área destino.
5. **Responder** sincroniza los adjuntos de respuesta y elimina los no incluidos.
6. **Rechazar** devuelve la solicitud a estado 2 y conserva supervisor y tramitador.
7. **Aprobar** es la única transición a estado 4 y fija `terminado_en`.
8. **Evaluar** solo se permite una vez y solo al remitente.
9. Los listados de bandeja **no** son simétricos: supervisor ve por área; el resto por
   usuario.
10. Los permisos de UI y las validaciones del backend deben coincidir; si divergen,
    el backend manda.
11. **El reenvío no tiene validación explícita en el POST**: cualquier usuario
    autenticado puede enviar `padre`. La restricción real es de UI (`permisos.reenviar`)
    y debe corregirse en el backend si se considera un riesgo.

---

## 6. Frontend

### Rutas

```text
/solicitudes                       solicitudes-index
/solicitudes/crear                 solicitudes-crear
/solicitudes/:id                   solicitudes-solicitud
/solicitudes/:id/asignar           solicitudes-solicitud-asignar
/solicitudes/:id/reenviar          solicitudes-solicitud-reenviar
/solicitudes/:id/responder         solicitudes-solicitud-responder
/solicitudes/:id/aprobar           solicitudes-solicitud-aprobar
/solicitudes/:id/evaluar           solicitudes-solicitud-evaluar
/solicitudes/:id/registro          solicitudes-solicitud-registro
/solicitudes/:id/notas             solicitudes-solicitud-notas
```

### Archivos

| Capa | Archivo |
| --- | --- |
| API | `src/api/solicitudes.ts`, `notas.ts`, `bitacoras.ts`, `uploads.ts`, `notificaciones.ts` |
| Stores | `src/stores/solicitudes/` (`useSolicitudesQuery`, `useSolicitudQuery`, `useSolicitudCreate`, `useSolicitudUpdate`) |
| Filtros | `useSolicitudesFiltro` (store Pinia persistido en `sessionStorage`: `status`, `period`, `search`) |
| Vistas | `src/views/solicitudes/index.vue`, `crear.vue`, `[id]/*.vue` |
| Features | `src/components/features/solicitudes/` |

### Comportamiento de la UI

- La lista se mantiene montada con `v-show`; las acciones se abren como vistas anidadas
  sobre el detalle.
- El detalle se provee como `provide('solicitud:solicitud', solicitud)`.
- Los modales de acción reciben `back` y cierran con él.
- Las mutaciones invalidan `solicitudes.listas()`, `solicitudes.detalles()` y
  `notificaciones.listas()`.
- La lista usa `useSolicitudesQuery` con `staleTime` de 5 minutos e indicador local de
  datos obsoletos.
- Los errores de validación se muestran por campo; el resto ya se notifica globalmente.

---

## 7. Casos límite conocidos

- El listado devuelve tuplas; tratar de leerlo como objetos rompe la tabla.
- La posición 6 de la tupla cambia de significado según `tray`.
- `period` solo aplica al estado `terminadas`; en `pendientes` se ignora.
- El reenvío no usa `PUT`: crea una nueva solicitud con `padre`.
- El POST de reenvío no valida el permiso `reenviar`; solo lo hace la UI.
- Las acciones `PUT` validan la relación con la solicitud, pero no el estado actual.
- El padre solo se actualiza si está en estado 1; si ya cambió, la hija se crea igual.
- Un supervisor puede reenviar una solicitud en estado 1 de su área y queda como
  supervisor/tramitador del padre.
- `evaluacion` no tiene plazo en el backend; el `TODO` de acotarlo sigue abierto.
- La UI no permite comentar terminadas, pero el backend no lo impide por sí solo.

---

## 8. Criterios de verificación

Tras un cambio en el módulo:

- [ ] Crear solicitud original genera código, estado 1, origen y remitente correctos.
- [ ] Reenviar crea hija y deja el padre en estado 2 con supervisor/tramitador actual.
- [ ] Asignar exige supervisor del destino y tramitador del destino.
- [ ] Responder guarda `respuesta_en`, pasa a estado 3 y sincroniza adjuntos tipo 2.
- [ ] Aprobar `1` pasa a estado 4 con `terminado_en`; aprobar `0` vuelve a estado 2.
- [ ] Evaluar solo funciona una vez y solo para el remitente.
- [ ] Las bandejas recibidas/enviadas respetan las reglas de supervisor vs. usuario.
- [ ] Los permisos del detalle coinciden con las validaciones del backend.
- [ ] `npm run lint` y `npm run typecheck` terminan sin errores.
