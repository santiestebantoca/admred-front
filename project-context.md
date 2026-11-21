# project-context.md

> Contexto persistente del proyecto **admred** (frontend).
> Leer este archivo antes de analizar, modificar o crear cualquier funcionalidad.
> Última revisión: 2026-11-12.

---

## 1. Qué es este repositorio

Frontend de **ADM Red**, sistema de gestión de solicitudes entre áreas de ETECSA.
Permite registrar, asignar, reenviar, responder, aprobar, evaluar y reportar
solicitudes, además de administrar usuarios, áreas y tipos de solicitud.

Este repositorio contiene **solo el frontend** (Vue 3 + Vite). El backend es una
aplicación **web2py** independiente:

```text
D:\proyectos\web2py\applications\admred
```

Ambos lados forman un mismo sistema. Si cambia un contrato de API, revisar los dos.

---

## 2. Stack tecnológico exacto

Versiones resueltas en `package-lock.json`:

| Área | Tecnología | Versión |
| --- | --- | --- |
| Framework | Vue | 3.5.44 |
| Bundler | Vite | 8.3.5 |
| Lenguaje | TypeScript | 6.0.3 (`strict: false`, `noImplicitAny: false`) |
| Rutas | vue-router | 5.4.0, **hash history** |
| Estado global | Pinia | 4.1.0 |
| Estado del servidor | @pinia/colada | 1.4.9 |
| Persistencia Pinia | pinia-plugin-persistedstate | 4.7.1 |
| UI | Bootstrap | 5.3.8 |
| Componentes UI | bootstrap-vue-next (BVN) | 1.2.2 |
| HTTP | axios | 1.21.0 |
| Utilidades reactivas | @vueuse/core y @vueuse/components | 15.0.0 |
| Transformación de datos | @tidyjs/tidy | 2.6.1 |
| Fechas | vanillajs-datepicker | 1.3.4 |
| Tooltips | vue-tippy | 6.8.0 |
| Eventos | mitt | 3.0.1 |
| Iconos | unplugin-icons | 24.0.0 |
| Auto-import UI | unplugin-vue-components | 32.1.0 |
| Estilos | sass | 1.107.1 |
| Calidad | eslint 10.14.0, vue-tsc 3.3.14 | — |

Notas:

- No hay framework de tests ni pipeline de CI.
- `vite build` **no** ejecuta `vue-tsc`; usar `npm run typecheck`.
- Los componentes de BVN y los iconos se auto-importan; no hace falta registrarlos.
- `components.d.ts` es generado; no editar a mano.

### Scripts

```bash
npm install
npm run dev           # Vite HTTPS local + proxy /admred -> https://localhost:8000
npm run dev_corp      # Vite en 172.17.48.90, mode=corp
npm run build         # Build de producción
npm run build_admred  # Build con --base=/admred/static/
npm run preview
npm run lint          # ESLint flat config con --fix
npm run typecheck     # vue-tsc --noEmit (debe dar 0 errores)
```

Verificación mínima antes de cerrar un cambio:

```bash
npm run lint
npm run typecheck
npm run build          # o build_admred si afecta la base de publicación
```

---

## 3. Arquitectura general y flujo de datos

```text
Vista / componente Vue
  ├─ composable de UI (filtros, paginación, fechas, CSV, feedback)
  ├─ provide/inject de contexto de sección y de recurso
  └─ store del dominio (Pinia Colada)
        └─ módulo API (src/api/<recurso>.ts)
              └─ instancia axios `api` (src/api/client)
                    └─ backend web2py (/<controlador>/<acción>)
```

### Capas y responsabilidades

| Capa | Ubicación | Responsabilidad |
| --- | --- | --- |
| Vistas | `src/views/` | Páginas por ruta; contenedores de layout y formularios |
| Layouts | `src/layouts/` | `MainLayout`, `AltLayout`, `AuthLayout` |
| Shell | `src/components/layout/` | Header, Footer, Drawer, Page, PageContainer, Layout |
| Features | `src/components/features/` | Componentes con dominio (solicitudes, admin, reportes, auth) |
| Commons | `src/components/commons/` | Componentes genéricos reutilizables |
| Composables | `src/composables/` | Lógica reactiva reutilizable sin dominio de servidor |
| Stores | `src/stores/` | Queries/mutations de Pinia Colada por dominio |
| API | `src/api/` | Un módulo por recurso + cliente axios central |
| Tipos | `src/types/` | `backend.ts` (filas), `api.ts` (transporte), `models.ts` (dominio) |
| Claves | `src/lib/query-keys.ts` | Claves jerárquicas de caché |
| Rutas | `src/router/index.ts` | Definición completa y guards |

### Flujo típico de lectura

1. La ruta entrega props a la vista (`id`, `back`, `linkCrear`, callbacks).
2. La vista usa un composable de lista (`useXLista`) que combina filtros y paginación.
3. El composable llama a `useXQuery`, que usa `useQuery` de Colada.
4. La query llama al módulo `src/api/<recurso>.ts`.
5. El módulo usa la instancia `api` y devuelve `res.data`.
6. La vista pinta tabla/esqueleto/indicador según `isPending` / `isLoading`.

### Flujo típico de escritura

1. Formulario valida localmente y llama a `mutateAsync` de una mutation.
2. La mutation ejecuta `api.create/update/delete`.
3. `onMutate` cancela queries en vuelo de las claves afectadas.
4. `onSuccess` invalida listas/detalles (y notificaciones si aplica).
5. La vista muestra toast de éxito y navega con el callback `back`/`backLista`.
6. Los errores de validación (422) se muestran por campo; el resto ya se notifica globalmente.

### Reglas de reparto

- Estado del servidor → **Pinia Colada** (`src/stores/`).
- Estado local de UI → **composables** (no stores Pinia clásicos).
- Peticiones HTTP → siempre por `src/api/<recurso>.ts`; nunca axios directo en vistas.
- Lógica pura reutilizable → `src/composables/`.
- Contratos → `src/types/backend.ts`, `src/types/api.ts`, `src/types/models.ts`.

---

## 4. Contrato con el backend web2py

La API no es REST pura: se sirve como `/<controlador>/<acción>` y las formas de
respuesta varían por endpoint.

Convenciones del backend:

- Sesión por **cookie**; no hay tokens en el frontend (`withCredentials: true`).
- Fechas: `datetime` como `"YYYY-MM-DD HH:mm:ss"`, `date` como `"YYYY-MM-DD"`.
- Campos `reference` se serializan como id numérico.
- Listados paginados: `{ data, meta: { total, page, limit, totalPages, hasNext, hasPrev } }`.
- Listados sin paginar: `{ data, meta: { total } }`.
- Algunos catálogos devuelven un **array plano** (destinos, niveles, grupos, tramitadores,
  consultadas, demandantes).
- Errores de validación: HTTP 422 con `{ campo: ["mensaje"] }` o `{ errors: {...} }`.
- **Actividad territorial**: `GET /solicitudes/solicitudes/:id` expone `actividad`,
  `requiere_actividad` y `puede_definir_actividad`. Se escribe con
  `PUT { actividad: "PROV" | "ADMIN" }`; sin actividad, asignar y reenviar responden 422.

### Endpoints usados por el frontend

| Recurso | Endpoints principales |
| --- | --- |
| Auth | `GET/POST/DELETE /auth/login`, `POST /auth/impersonate/:id`, `GET /auth/users` |
| Solicitudes | `GET/POST /solicitudes/solicitudes`, `GET/PUT /solicitudes/solicitudes/:id` |
| Notas | `GET/POST /notas/notas` |
| Bitácoras | `GET /bitacoras/bitacoras` |
| Uploads | `POST /uploads/uploads`, `DELETE /uploads/uploads/:id` |
| Notificaciones | `GET /notificaciones/notificaciones` |
| Usuarios | `GET/POST /usuarios/usuarios`, `GET/PUT/DELETE /usuarios/usuarios/:id` |
| Áreas | `GET/POST /areas/areas`, `GET/PUT/DELETE /areas/areas/:id` |
| Tipos | `GET/POST /tipos/tipos`, `GET/PUT/DELETE /tipos/tipos/:id` |
| Catálogos | `/destinos/destinos`, `/niveles/niveles`, `/auth_groups/auth_groups`, `/tramitadores/tramitadores`, `/consultadas/consultadas`, `/demandantes/demandantes` |
| Reportes | `/reportes/pendientes_del_area`, `/reportes/indicadores_del_usuario`, `/reportes/buscar_codigo`, `/reportes/areas_consultadas`, `/reportes/solicitudes_externas`, `/reportes/solicitudes_internas`, `/reportes/solicitudes_raw` |

### Cliente HTTP

`src/api/client/client.ts`:

- `baseURL: import.meta.env.VITE_API_URL`
- `withCredentials: true`
- `timeout: 120000`
- Cabecera `X-Requested-With: XMLHttpRequest`
- `paramsSerializer.indexes = null` → arrays como `search_in=a,b`.
- Cada petición incrementa/decrementa el contador global de `useActividadRed`.
- Normaliza errores en `errors.ts`:
  `NetworkError`, `AuthenticationError`, `AuthorizationError`, `NotFoundError`,
  `ValidationError`, `ServerError`, `ApiError`, con type guards.

Errores globales:

- Red, servidor, 401, 403 y 404 emiten el evento `mitt` `error`.
- `useErroresGlobalesToast` los muestra y deduplica.
- **No duplicar esos toasts en las vistas.**
- En vistas, usar `errorDeApi` solo para validaciones (422).
- `401` en cualquier endpoint distinto del login emite `unauthorized` y redirige a
  `auth-login` con `?next=`.

---

## 5. Autenticación y sesión

- `useAuthQuery` consulta `GET /auth/login` con `staleTime: Infinity`.
- `useLogin` escribe directamente la caché de `queryKeys.auth.user()`.
- `useLogout` escribe `null` en esa misma clave.
- El guard `beforeEach` espera a que `useAuthQuery().isPending` sea `false` y, si la ruta
  requiere autenticación y no hay usuario, redirige a login con `?next=`.
- `afterEach` ejecuta logout en rutas con `meta.logout` y guarda la carpeta de
  solicitudes en `admred_router_folder` (sessionStorage) cuando `meta.saveFolder`.
- El login fallido se muestra inline en el formulario; no genera toast global ni redirección.
- La personificación solo se ofrece si `authUser.can_impersonate` es `true`; el backend
  además valida una lista cerrada de ids.

Objeto `AuthUser` relevante:

```ts
{
  id, name, username, email, movil, fijo,
  admin, supervisor,
  user_groups,
  is_impersonating, can_impersonate,
  AR, DAR,
  area, area_nombre
}
```

`AR` habilita reportes globales y administración de áreas/tipos.
`DAR` existe en el contrato, pero el frontend no lo usa para menús.

---

## 6. Enrutado

- `createWebHashHistory()`.
- Rutas agrupadas: `routesAuth`, `routesSolicitudes`, `routesReportes`, `routesAdmin`.
- Nombres en **kebab-case** y jerárquicos:
  - `admin-usuarios`, `admin-usuario`, `admin-usuario-editar`, `admin-usuario-eliminar`.
  - `solicitudes-solicitud`, `solicitudes-solicitud-asignar`, `…-reenviar`, `…-responder`,
    `…-aprobar`, `…-evaluar`, `…-registro`, `…-notas`.
- Carga diferida con `() => import('@/views/...')`.
- Los `props` de ruta convierten ids con `parseInt` y exponen callbacks de navegación
  (`back`, `linkSolicitud`, `setSolicitudId`, `setUsuarioId`, etc.).
- Las acciones de detalle se anidan para mantener montada la vista padre y mostrar el
  modal/acción encima.
- La raíz `/` y `/home` redirigen a `/solicitudes`.
- 404 → `src/views/not_found.vue`.

---

## 7. Estado del servidor (Pinia Colada)

Claves en `src/lib/query-keys.ts`, jerárquicas:

```ts
queryKeys.solicitudes.root        // ['solicitudes']
queryKeys.solicitudes.listas()    // ['solicitudes', 'lista']
queryKeys.solicitudes.lista(f)    // ['solicitudes', 'lista', {...f}]
queryKeys.solicitudes.detalles()  // ['solicitudes', 'detalle']
queryKeys.solicitudes.detalle(id) // ['solicitudes', 'detalle', id]
```

Reglas:

- Cada recurso usa su propio `root` (`usuarios`, `areas`, `tipos`, `reportes`, …).
- Invalidar `listas()` / `detalles()`, no toda la caché.
- `isPending` = aún no hay datos (esqueleto inicial).
- `isLoading` = hay petición en curso, incluso refresco (indicador inline).
- `placeholderData: (previousData) => previousData` para listas y reportes que no deben
  parpadear.
- `staleTime: Infinity` solo en catálogos estables (auth, áreas de opciones, grupos,
  niveles, destinos).
- `useSolicitudesQuery` usa `staleTime` de 5 minutos y calcula `isStale` con un reloj local.
- `useNotificacionesQuery` usa `autoRefetch: true` y `staleTime: 60_000`.

Mutaciones:

- `onMutate`: `cancelQueries` de las claves afectadas.
- `onSuccess`: `invalidateQueries` de listas y detalles; en solicitudes también
  `notificaciones.listas()`.
- En vistas se usa `mutateAsync` y `asyncStatus`; `loading` se deriva con
  `computed(() => asyncStatus.value === 'loading')`.

---

## 8. Convenciones de código y estilos

### Formato

- Indentación de 2 espacios.
- Comillas simples.
- Sin punto y coma en la mayoría de archivos (respetar el archivo que se edite).
- Componentes Vue en **PascalCase** (`ListaGrid.vue`, `BotonEnvio.vue`).
- Composables y stores en **camelCase** con prefijo `use`.
- Directorios en minúsculas; rutas dinámicas con carpeta `[id]`.
- Alias `@` → `src/`.
- Imports absolutos para cruzar capas; relativos solo entre hermanos.

### SFC

Orden habitual:

1. `<script setup>` (o `<script lang="ts" setup>`).
2. `defineProps` / `defineModel` al principio, antes de los imports.
3. Imports.
4. Estado, computados, queries/mutations y funciones.
5. `<template>`.
6. `<style scoped lang="scss">`.

- Usar `defineModel()` para contratos `v-model`.
- Usar `defineOptions({ inheritAttrs: false })` al envolver componentes y reenviar `$attrs`.
- No reemplazar los callbacks de ruta (`back`, `linkCrear`, `setXId`) por `router.push`
  dentro de la vista.

### TypeScript

- Todo `src/` migrado a TS, pero `strict: false` y `noImplicitAny: false`.
- No introducir tipos estrictos en archivos que no los usan.
- Importar tipos con `import type`.
- Evitar `any` explícito; usar adaptadores tipados o `unknown` + comprobación.
- `npm run typecheck` debe quedar en 0 errores.

### Comentarios

- En español.
- Explicar el **porqué** de decisiones no obvias (accesibilidad, BVN, orden de peticiones).
- No repetir lo que ya dice el código.

### Provide / inject

Claves namespaced con `:`:

```text
app:mobile, app:xlDown
layout:header, layout:page, layout:view
admin:title, admin:usuarios:usuarioId, admin:usuarios:linkCrear
usuario:usuario, area:area, tipo:tipo
solicitud:solicitud
solicitudes:tray, solicitudes:state, solicitudes:solicitudId,
solicitudes:linkSolicitud, solicitudes:setSolicitudId, solicitudes:filaExpandida
reportes:title, reportes:linkSolicitud
```

Se proveen `computed(() => props.x)` para mantener reactividad.

### Iconos y BVN

- BVN se auto-importa (`BTable`, `BFormGroup`, `BModal`, …).
- Iconos con etiqueta estática: `<ILucidePlus />`, `<IBiSearch />`.
- Iconos dinámicos: `<UIcon :name="'lucide-…'" />`; si falta en el mapa de
  `src/components/commons/unplugin-icons/UIcon.vue`, registrarlo allí.
- Envoltorios propios:
  - `BotonEnvio.vue`: botón de envío con spinner, texto de progreso y bloqueo.
  - `BFormButtons.vue`: fila de acciones de formulario.
  - `BSearchInput.vue`: búsqueda con debounce/lazy.
  - `BModalNext.vue` / `BModalPlus.vue`: modales con minimización tipo cápsula.
  - `TablePagination.vue`: paginación de servidor.

---

## 9. Formularios, listados y feedback

### Formularios

Patrón canónico:

```ts
const form = ref<XCreate>({ /* … */ })
const errors = ref<Record<string, any>>({})
const errorState = computed(() => ({
  campo: {
    state: errors.value.campo ? false : null,
    invalidFeedback: errors.value.campo,
    onInput: () => errors.value.campo = null
  }
}))
const { mutateAsync: crear, asyncStatus } = useXCreate()
const loading = computed(() => asyncStatus.value === 'loading')

const submit = () => {
  if (loading.value || !validate()) return
  crear(form.value)
    .then(() => { exito('…'); props.back() })
    .catch(err => {
      isValidationError(err) && (errors.value = err.errors)
      errors.value.form = 'Error al crear el registro.'
    })
}
```

Reglas:

- `BForm @submit.prevent="submit" :aria-busy="loading"`.
- `BFormGroup` recibe `v-bind="errorState.campo"`.
- Guarda anti-duplicado: `if (loading.value) return`.
- `BotonEnvio` con `:loading` y `texto-cargando` en español.
- Botón Cancelar con `:disabled="loading"`.
- Validación local con patrones de `@/constants`.
- Errores 422 → `isValidationError(err) → err.errors`.
- Tras éxito: `useNotificaciones().exito(...)` y navegación por callback.
- `density="3"` para separación vertical habitual.

### Listados

Pipeline:

```text
useXFiltro → useXLista → useXQuery → ListaGrid → ListaFiltro
```

- Paginación **en servidor** (`page`, `limit`, `meta.total`).
- `TablePagination` con `v-model:page` y `v-model:per-page`.
- Carga inicial → `TablaEsqueleto`.
- Refresco con datos previos → `IndicadorCarga inline` dentro de
  `.indicador-actualizacion`.
- Texto vacío contextual: distinguir «no hay registros» de «no coinciden con los filtros».

### Feedback y accesibilidad

- **Barra global** (`BarraProgreso`): peticiones HTTP y navegaciones pendientes.
- **Envío** (`BotonEnvio`): spinner, texto de progreso, `aria-busy`, doble envío bloqueado.
- **Carga** (`IndicadorCarga`): en bloque para carga inicial; `inline` para refrescos.
- **Toasts** (`useNotificaciones`): `exito`, `error`, `aviso`, `info`, `errorDeApi`.
  Posición `bottom-center`; duraciones por variante.
- **Errores globales** (`useErroresGlobalesToast`): deduplica por tipo+mensaje.
- `aria-busy` en formularios y contenedores que se refrescan.
- `role="status"` + `aria-live="polite"` en indicadores; spinner `aria-hidden`.
- Etiquetas visibles en formularios; `aria-label` en botones con solo icono.
- Respetar `prefers-reduced-motion` en animaciones nuevas.

---

## 10. Estilos

Entrada: `src/assets/css/main.scss`, orden:

```text
datepicker → tokens → utilities → overrides → density → admred
```

- Usar variables CSS de Bootstrap (`--bs-primary`, `--bs-gray-600`,
  `--bs-border-color`, `--bs-surface-*`, `--bs-estado-*`).
- Tokens propios en `_tokens.scss`: superficies `--bs-surface-1..5`, `--bs-brand`,
  estados de solicitud, tamaños de fuente pequeños.
- Utilidades del proyecto:
  - Tamaños: `wh-26/30/34/36/38/50`, `w-90`, `w-110`, `max-w-700/500/400/300`.
  - Botones: variantes `flat`, `emphasis`, `flat-primary`, `flat-danger`, etc.
  - Estados: `.estado-badge[data-estado="Solicitado|En proceso|En evaluación"]`.
  - Refresco de tablas: `.indicador-actualizacion`.
  - Layout: `density="2|3"`.
- `<style scoped>` por defecto; `:deep(...)` para nodos internos de BVN.
- Estilos globales solo cuando BVN renderiza fuera del componente; anclar a una clase propia.
- Evitar estilos inline estáticos; se permiten `:style` dinámicos con custom properties.

---

## 11. Entorno y despliegue

| Archivo | Valor | Cuándo |
| --- | --- | --- |
| `.env` | `https://localhost:8000/admred` | Acceso directo por defecto |
| `.env.local` | `/admred` | Desarrollo con proxy de Vite (ignorado por git) |
| `.env.production` | `/admred` | Build de producción |
| `.env.corp` | `https://172.17.48.90:8000/admred` | `npm run dev_corp` |

- El proxy de `vite.config.js` reenvía `/admred` a `https://localhost:8000` con
  `changeOrigin: true` y `secure: false` para aceptar el certificado autofirmado de web2py.
- El servidor de desarrollo usa `vite-plugin-mkcert`.
- `build_admred` compila con `--base=/admred/static/` para publicar bajo web2py.
- El router usa hash, así que no requiere rewrites del servidor.
- No hay variables de entorno para credenciales: la sesión es por cookie.

---

## 12. Deuda técnica y zonas sensibles

- `src/types/*` y varios archivos contienen textos con caracteres mal codificados
  (`A�`, `A3`, etc.). **No “corregir” de forma masiva** sin una tarea específica.
- No hay tests automatizados; la red de seguridad es `lint`, `typecheck` y prueba manual.
- El backend tiene reglas heredadas que conviene no romper:
  - El login local de web2py omite la validación de contraseña (`request.is_local`).
  - `can_impersonate` usa una lista cerrada de ids.
  - Algunas acciones actualizan datos de forma implícita (p. ej. reenviar cambia el padre
    a “En proceso”).
- Los listados de solicitudes devuelven **tuplas**, no objetos; el orden de columnas es
  parte del contrato (`types/api.ts`).
- `useTextLimit` no recorta texto heredado que ya supere el máximo; solo impide ampliarlo.
- Los cálculos de tiempo laborable son una regla de negocio del frontend
  (`useTimeDelta`): L–V, 8:00–12:00 y 12:30–17:30; viernes hasta 16:30.
- `solicitud.actividad` está en `models/db_.py`, pero la tabla usa `migrate=False`; la
  columna debe existir en la base desplegada antes de usar la clasificación territorial.

---

## 13. Documentos relacionados

| Documento | Uso |
| --- | --- |
| `AGENTS.md` | Reglas operativas para agentes de IA en este repositorio |
| `openspec/config.yaml` | Contexto y reglas de OpenSpec para este proyecto |
| `openspec/specs/` | Contratos de comportamiento por capacidad |
| `openspec/changes/` | Cambios en curso; `archive/` guarda los completados |
| `specs/_baseline/README.md` | Índice de la referencia detallada y autenticación transversal |
| `specs/_baseline/solicitudes.md` | Detalle técnico del módulo de solicitudes |
| `specs/_baseline/administracion.md` | Detalle técnico de usuarios, áreas y tipos |
| `specs/_baseline/reportes.md` | Detalle técnico de reportes |

Antes de implementar un cambio:

1. Leer `project-context.md`.
2. Leer la capacidad de `openspec/specs/` del módulo afectado y su referencia en
   `specs/_baseline/`.
3. Revisar el código real y, si cambia un contrato, el backend web2py.
4. Para cambios de comportamiento, usar el flujo OpenSpec: explorar, proponer, aplicar y
   archivar. El delta se escribe en `openspec/changes/<cambio>/specs/` y se fusiona en
   `openspec/specs/` al archivar.
