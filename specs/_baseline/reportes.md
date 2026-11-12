# Spec base: Reportes

> Comportamiento actual del módulo de reportes.
> Backend: `controllers/reportes.py`, `modules/db/solicitudes.py`.
> Frontend: `src/views/reportes/`, `src/stores/reportes/`, `src/api/reportes.ts`,
> `src/components/features/reportes/`, `src/composables/useTimeDelta.ts`.

---

## 1. Propósito y alcance

Los reportes permiten:

- ver los pendientes del área como árbol de reenvíos;
- medir la actividad de una persona por mes;
- buscar solicitudes por código;
- analizar áreas consultadas;
- listar solicitudes externas, internas y crudas;
- exportar resultados a CSV.

Fuera de alcance: operaciones sobre solicitudes (ver `solicitudes.md`).

---

## 2. Acceso y permisos

| Reporte | Requisito |
| --- | --- |
| Pendientes del área | Sesión iniciada |
| Indicadores por persona | Sesión iniciada |
| Buscar por código | Sesión iniciada |
| Áreas consultadas | Área con `rol_key = 'AR'` |
| Solicitudes externas | Área AR |
| Solicitudes internas | Área AR |
| Solicitudes crudas (`raw`) | Área AR |

La restricción AR se aplica en el backend con `Validate.auth_from_AR` y devuelve
HTTP 403 si no se cumple. El frontend no debe ser la única barrera.

Constantes de dominio:

```ts
DIRECCION_ADMINISTRACION_ID = 2
AREAS_AR = [2, 46, 47]
```

| Área | Nombre |
| --- | --- |
| 2 | Dirección de Administración de la Red |
| 46 | Departamento de Administración |
| 47 | Departamento de Planificación y Provisión |

---

## 3. Reportes

### 3.1 Pendientes del área

```http
GET /reportes/pendientes_del_area
```

Sin parámetros. Devuelve un **array de árboles**; cada árbol es un array de nodos:

```ts
{
  id, codigo, leaf, parent, children: number[],
  estado: number, destino: number, root: boolean
}
```

Reglas:

- Si el usuario es `supervisor`: solicitudes con `origen == auth.user.area`.
- Si no: solicitudes con `remitente == auth.user_id`.
- Excluye estado 4.
- Cada árbol se genera con `traversal()` y usa la tabla `solicitud` (ids, no textos).
- Un nodo es `leaf` cuando no tiene hijas.

### 3.2 Indicadores por persona

```http
GET /reportes/indicadores_del_usuario?user_id=:id&month=:m&year=:y
```

Devuelve filas con:

```ts
{
  id, codigo, estado,
  supervisor: boolean, tramitador: boolean,
  solicitado_en, tramitador_en, respuesta_en, terminado_en,
  hijo_en?, hijo_terminado_en?
}
```

Reglas de selección:

- Solicitudes donde el usuario es `tramitador` **o** `supervisor`.
- Terminadas en el mes/año seleccionado **o** aún sin terminar y solicitadas en o antes
  de ese mes/año.
- `estado` es el id numérico, no el nombre.
- Para el tramitador se añaden:
  - `hijo_en`: fecha de la primera hija creada;
  - `hijo_terminado_en`: fecha de la última hija terminada.

Cálculos del frontend (`usePersonasQuery`):

| Vista | Fórmula |
| --- | --- |
| Demora de asignación | `timeDeltaW(solicitado_en, tramitador_en)` |
| Demora de evaluación | `timeDeltaW(respuesta_en, terminado_en)` |
| Demora total supervisor | asignación + evaluación |
| Demora de reenvío | `timeDeltaW(tramitador_en, hijo_en)` si hay hija; `0` si no |
| Demora de respuesta | `timeDeltaW(hijo_terminado_en, respuesta_en)` si hay hija terminada; `timeDeltaW(tramitador_en, respuesta_en)` si no hay hija |
| Demora total tramitador | reenvío + respuesta |

Notas:

- Los cálculos son **del frontend**; el backend solo devuelve fechas.
- `timeDeltaW` cuenta minutos laborables: L–V, 8:00–12:00 y 12:30–17:30; viernes hasta
  16:30.
- `timeDeltaWToDH` convierte minutos a días/horas con jornada de 528 minutos.
- La vista separa «Como supervisor» y «Como tramitador» según los booleanos.

### 3.3 Buscar por código

```http
GET /reportes/buscar_codigo?codigo=:texto
```

- Búsqueda por contenido (`contains`), no exacta.
- Devuelve como máximo 10 filas.
- `origen` y `destino` se sustituyen por el nombre del área.
- Devuelve `id`, `codigo`, `objetivo`, `solicitado_en`, `terminado_en`, `origen`,
  `destino`.

### 3.4 Áreas consultadas

```http
GET /reportes/areas_consultadas?desde=YYYY-MM-DD&hasta=YYYY-MM-DD&origen=&curso=
```

Parámetros:

| Parámetro | Efecto |
| --- | --- |
| `desde`, `hasta` | Rango por `solicitado_en`; `hasta` incluye el día completo |
| `origen` | Área origen; si falta, se usan las tres áreas AR |
| `curso` | `1` original (`padre == null`), `2` reenviada (`padre != null`), vacío = cualquiera |

Devuelve filas `{ destino, solicitado_en, terminado_en }`.

El frontend agrupa por `destino` y calcula:

| Columna | Cálculo |
| --- | --- |
| Presentadas | Total de filas del área |
| Terminadas | Filas con `terminado_en` |
| Eficacia (%) | `terminadas / presentadas * 100`, redondeado a 1 decimal |
| Demora promedio HL | Media de `timeDeltaW` en horas truncadas |
| Demora promedio DL | Media convertida con `timeDeltaWToDH` |

Además añade una fila **«Sub total»** con la suma de todas las áreas.

### 3.5 Solicitudes externas

```http
GET /reportes/solicitudes_externas?desde=&hasta=&origen=&estado=&codigo=&objetivo=
```

Reglas:

- Rango por `solicitado_en`; `hasta` incluye el día completo.
- `origen` es un área **externa** a la VPOR.
- Si no se indica `origen`, se usan las áreas cuyo nivel tiene `alcance = 'externo'`.
- El destino siempre es `DIRECCION_ADMINISTRACION_ID` (2).
- `estado` acepta un valor o una lista.
- `codigo` y `objetivo` buscan por contenido.
- Cada fila incluye `related`: descendientes del árbol de reenvíos, sin la raíz.

### 3.6 Solicitudes internas

```http
GET /reportes/solicitudes_internas?desde=&hasta=&origen=&estado=&codigo=&objetivo=&destino=
```

Reglas:

- Solo solicitudes originales (`padre == null`).
- Si no se indica `origen`, se usan las áreas de niveles con `alcance = 'interno'`
  **excluyendo** las áreas AR.
- `destino` es opcional y filtra por un área concreta.
- `estado`, `codigo` y `objetivo` funcionan igual que en externas.
- Cada fila incluye `related` con los descendientes.

### 3.7 Solicitudes crudas

```http
GET /reportes/solicitudes_raw?desde=&hasta=&destino_id=
```

- Requiere AR.
- Rango por `solicitado_en`; `hasta` incluye el día completo.
- `destino_id` es obligatorio.
- Lee de `vw_solicitudes_raw` y ordena por código.
- Devuelve datos de la solicitud y de su hija:
  `codigo`, `destino_id`, `origen`, `objetivo`, `solicitado_en`, `terminado_en`,
  `h_codigo`, `h_destino`, `h_objetivo`, `h_solicitado_en`, `h_terminado_en`,
  `supervisor`, `tramitador`.
- Reporte solicitado para análisis de efectividad del Departamento de Provisión y sus
  hijas.

---

## 4. Reglas de negocio

1. La restricción AR es **del backend**; el frontend solo oculta opciones.
2. Los rangos de fecha son inclusivos en el día final (`hasta + ' 23:59:59'`).
3. `solicitudes_internas` excluye el árbol de reenvíos como raíz: solo originales.
4. `areas_consultadas` agrupa por destino, no por origen.
5. Los indicadores por persona incluyen pendientes anteriores al periodo, no solo las
   terminadas en el mes.
6. El cálculo de demoras es laborable y vive en el frontend; no cambia con el backend.
7. `buscar_codigo` limita a 10 resultados y no pagina.
8. Los reportes de solicitudes no paginan: devuelven todas las filas del rango.
9. `related` excluye la raíz y conserva la estructura de árbol.
10. La exportación CSV no altera los datos; solo cambia el formato.

---

## 5. Frontend

### Rutas

```text
/reportes                          reportes
/reportes/home                     reportes-home
/reportes/pendientes               reportes-pendientes
/reportes/personas                 reportes-personas
/reportes/personas/:personaId      reportes-persona
/reportes/externas                 reportes-externas
/reportes/internas                 reportes-internas
/reportes/consultadas              reportes-consultadas
/reportes/buscar                   reportes-buscar
/reportes/solicitudes              reportes-solicitudes
```

Las vistas de solicitud se anidan con `rutasSolicitud(...)` para abrir el detalle sobre
el reporte sin desmontarlo.

### Archivos

| Capa | Archivo |
| --- | --- |
| API | `src/api/reportes.ts` |
| Stores | `src/stores/reportes/` (`pendientes`, `personas`, `buscar`, `consultadas`, `solicitudes`) |
| Vistas | `src/views/reportes/` |
| Features | `src/components/features/reportes/` |
| Fechas | `src/composables/useTimeDelta.ts` |
| CSV | `src/composables/useExportCSV.ts` |
| Constantes | `src/constants/index.ts` (`AREAS_AR`, `DIRECCION_ADMINISTRACION_ID`, `CURSO_SOLICITUD`) |

### Comportamiento de la UI

- `reportes/index.vue` monta `AltLayout`, provee `reportes:title` y `reportes:linkSolicitud`.
- Cada reporte tiene su propio drawer de navegación (`ListaNavDrawer.vue`).
- Los filtros viven en `ref` locales del reporte; se aplican al enviar el formulario.
- Las queries usan `enabled` cuando faltan fechas obligatorias.
- `placeholderData` conserva el reporte anterior mientras llega el nuevo.
- Carga inicial → `IndicadorCarga` en bloque; refresco → `IndicadorCarga inline`.
- Los errores 401/403/404/red/servidor ya se notifican globalmente.
- La exportación usa `useExportCSV({ excelReady: true })` (separador `;`, BOM y saneado).

---

## 6. Casos límite conocidos

- `pendientes_del_area` devuelve ids de estado y destino; el árbol no trae nombres.
- `indicadores_del_usuario` devuelve id de estado, no texto.
- `buscar_codigo` devuelve como máximo 10 filas y no avisa de truncamiento.
- Los reportes AR no paginan; un rango amplio puede devolver muchas filas.
- `areas_consultadas` calcula la efectividad en el frontend; si `presentadas` es 0 no
  se genera fila.
- La demora media se calcula sobre las filas con fechas válidas; `timeDeltaW` maneja
  `null` como 0.
- Las fechas del backend no llevan zona horaria.
- `solicitudes_raw` depende de la vista `vw_solicitudes_raw`, no de la tabla base.

---

## 7. Criterios de verificación

- [ ] Sin área AR, los reportes globales devuelven 403 y la UI no los ofrece.
- [ ] `pendientes` usa área origen para supervisores y remitente para el resto.
- [ ] `pendientes` excluye terminadas.
- [ ] Los indicadores incluyen pendientes anteriores al mes seleccionado.
- [ ] Las demoras se calculan en minutos laborables y se muestran en HL/DL.
- [ ] `buscar_codigo` limita a 10 y devuelve nombres de área.
- [ ] `areas_consultadas` agrupa por destino y añade «Sub total».
- [ ] Internas solo incluye originales; externas usa niveles externos y destino 2.
- [ ] Los rangos incluyen el día `hasta` completo.
- [ ] La exportación CSV conserva los valores mostrados.
- [ ] `npm run lint` y `npm run typecheck` terminan sin errores.
