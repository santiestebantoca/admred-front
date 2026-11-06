# AGENTS.md

Guía para agentes de IA (y personas) que trabajen en este repositorio. Describe la
arquitectura real, los patrones que ya usa el código y las reglas que conviene respetar
para que los cambios encajen con el resto del proyecto.

---

## 1. Idioma

- Responder **siempre en español**, en todas las respuestas y en cualquier sesión.
- El código, los nombres de archivos, los identificadores y los mensajes de commit se
  mantienen en el idioma en que ya esté el proyecto; esta preferencia aplica a la
  comunicación con el usuario.
- Los textos de interfaz, los comentarios y los mensajes de validación están en español.
  Mantén ese idioma al añadir nuevos. Los campos que vienen del backend (por ejemplo
  `first_name`, `solicitado_en`, `registration_key`) **no se renombran**.

## 2. Contexto del sistema

Este repositorio es el **frontend** (Vue 3 + Vite) de `admred`.
El **backend** es la aplicación web2py `admred`, en `D:\proyectos\web2py\applications\admred`
(models, controllers y vistas web2py). Ambos forman un mismo sistema: al cambiar un
contrato de API conviene revisar los dos lados.

Correspondencia habitual entre capas:

- `src/views/admin/<recurso>/` ↔ `controllers/admin_<recurso>.py`
- `src/api/<recurso>.ts` ↔ controlador REST del recurso en web2py
- `src/stores/<recurso>/` ↔ controladores REST y modelos (`models/db.py`)
- `src/types/models.ts` ↔ campos y estructuras de `models/db.py`

La API se sirve como `/<controlador>/<acción>` (por ejemplo `/usuarios/usuarios`,
`/solicitudes/solicitudes`, `/reportes/pendientes_del_area`). No es una API REST
"pura": hay acciones con nombre propio y respuestas con formas distintas según el
endpoint.

---

## 3. Stack y comandos

### Stack principal

| Área | Tecnología |
| --- | --- |
| Framework | Vue 3.5 (`<script setup>`) + Vite 8 |
| Lenguaje | JavaScript y TypeScript mezclados (TS laxo, `strict: false`) |
| UI | Bootstrap 5.3 + `bootstrap-vue-next` (BVN) + SCSS |
| Estado del servidor | `@pinia/colada` (sobre Pinia 4) |
| Estado global escaso | Pinia + `pinia-plugin-persistedstate` |
| Rutas | `vue-router` 5 con **hash history** |
| HTTP | `axios` con instancia e interceptores propios |
| Utilidades | `@vueuse/core`, `@vueuse/components`, `mitt`, `vue-tippy`, `@tidyjs/tidy` |
| Iconos | `unplugin-icons` (`@iconify/json`) + `unplugin-vue-components` |
| Fechas | `vanillajs-datepicker` + helpers propios |

No hay framework de tests ni pipeline de CI en el repositorio. `vite build` no ejecuta
`vue-tsc`: usa `npm run typecheck` para comprobar los tipos.

### Scripts (`package.json`)

```bash
npm install

npm run dev           # Vite con HTTPS local (mkcert) y proxy /admred → https://localhost:8000
npm run dev_corp      # Vite en 172.17.48.90 con mode=corp
npm run build         # Build de producción
npm run build_admred  # Build con --base=/admred/static/ (publicación bajo web2py)
npm run preview
npm run lint          # ESLint (flat config) con --fix sobre .vue/.js/.ts
npm run typecheck     # vue-tsc --noEmit (0 errores)
```

Notas:

- `npm run dev` requiere un `.env.local` (ignorado por git) con `VITE_API_URL="/admred"`
  para que las peticiones pasen por el proxy de Vite. Sin él, el navegador intentaría
  hablar directamente con el certificado autofirmado de web2py.
- No hay script de formato: aplica el formato del editor y respeta el estilo del archivo
  que estés tocando (2 espacios, comillas simples, sin punto y coma).
- Antes de dar por terminado un cambio: `npm run lint`, `npm run typecheck` y, si toca
  lógica de build o rutas, `npm run build` (o `npm run build_admred` para verificar la
  base de publicación).

---

## 4. Mapa del proyecto

```text
src/
├── api/                 # Un módulo por recurso + cliente axios central
│   ├── client/          # api, interceptores, errores tipados, eventos mitt
│   └── <recurso>.ts     # p. ej. usuarios.ts, solicitudes.ts, reportes.ts
├── assets/
│   ├── css/             # SCSS global: tokens, utilidades, overrides, densidad
│   ├── images/          # Avatares y recursos estáticos
│   ├── mime/            # Iconos por tipo MIME (usados por FileIcon)
│   └── transitions/     # Transiciones CSS globales
├── components/
│   ├── commons/         # Componentes genéricos reutilizables (sin dominio)
│   │   ├── bootstrap-vue-next/  # Envoltorios/extensiones de BVN
│   │   ├── tree/        # Árbol genérico
│   │   └── unplugin-icons/      # UIcon (iconos dinámicos)
│   ├── features/        # Componentes con dominio (admin, solicitudes, reportes…)
│   └── layout/          # Shell de la aplicación (Header, Drawer, Page…)
├── composables/         # Lógica reactiva reutilizable (UI, fechas, CSV, errores…)
├── constants/           # Opciones de selects, patrones, mensajes de error
├── layouts/             # MainLayout, AltLayout, AuthLayout
├── lib/
│   └── query-keys.ts    # Claves jerárquicas de Pinia Colada
├── router/
│   └── index.ts         # Definición completa de rutas y guards
├── stores/              # Un directorio por dominio (queries/mutations de Colada)
├── types/
│   ├── backend.ts       # Filas crudas de tablas y vistas de web2py
│   ├── api.ts           # Parámetros, envoltorios y proyecciones del API
│   ├── models.ts        # Interfaces Create/Update/Detalle del dominio
│   └── unplugin-icons.d.ts
├── views/               # Páginas por sección; rutas anidadas y vistas de acción
│   ├── admin/<recurso>/ # index.vue + crear.vue + [id]/{index,editar,eliminar}.vue
│   ├── auth/
│   ├── reportes/
│   ├── solicitudes/
│   └── not_found.vue
├── App.vue              # BApp, defaults, breakpoints, barra global, idle
├── main.ts              # Bootstrap de la app (Pinia, Colada, router, BVN, Tippy)
└── vite-env.d.ts
```

Directorios y archivos de la raíz relevantes:

- `vite.config.js`: plugins, alias `@`, proxy de desarrollo.
- `components.d.ts`: **generado** por `unplugin-vue-components`; no editar a mano.
- `vite.config.d.ts`, `tsconfig.node.tsbuildinfo`: artefactos generados; no editar.
- `.env`, `.env.local`, `.env.production`, `.env.corp`: configuración de `VITE_API_URL`.

---

## 5. Arquitectura por capas

El flujo habitual es:

```text
Vista / componente
   ├─ composable de UI (filtros, paginación, feedback…)
   └─ store del dominio (useXQuery / useXCreate / …)
          └─ módulo api (xApi)
                 └─ instancia axios `api` (src/api/client)
                        └─ backend web2py
```

Reglas de reparto:

- **Estado del servidor** → Pinia Colada (`useQuery`, `useMutation`) en `src/stores/`.
- **Estado local de UI** → composables (`useUsuariosFiltro`, `useUsuariosLista`, etc.).
  No se crean stores Pinia clásicos para esto.
- **Peticiones HTTP** → siempre a través de `src/api/<recurso>.ts`; nunca `axios` directo
  desde vistas o componentes.
- **Lógica pura reutilizable** (fechas, CSV, tamaño de archivo, límite de texto) →
  `src/composables/`.
- **Contratos de datos** → `src/types/backend.ts` (filas), `src/types/api.ts`
  (envoltorios y params) y `src/types/models.ts` (Create/Update/Detalle).

---

## 6. Convenciones generales de código

### Estilo y formato

- Indentación de 2 espacios; comillas simples; sin punto y coma en la mayoría de archivos
  (respeta el archivo que edites).
- Componentes Vue en **PascalCase** (`ListaGrid.vue`, `BotonEnvio.vue`).
- Composables y stores en **camelCase** con prefijo `use` (`useUsuariosQuery.ts`).
- Directorios en minúsculas; rutas dinámicas con carpeta `[id]`.
- Alias `@` → `src/`. Usa imports absolutos para cruzar capas y relativos solo entre
  archivos hermanos.
- Los nombres de objetos API son `<recurso>Api` (`usuariosApi`, `solicitudesApi`) y se
  importan como `api` dentro de su store para acortar las llamadas.

### SFC: orden y forma

La convención observada en el proyecto:

1. `<script setup>` (o `<script lang="ts" setup>`).
2. `defineProps` / `defineModel` **al principio**, antes de los imports.
3. Imports.
4. Estado, computados, queries/mutations y funciones.
5. `<template>`.
6. `<style scoped lang="scss">` (o `<style scoped>`).

```vue
<script setup>
const props = defineProps({
  usuarioId: Number,
  back: Function
})

import { computed, ref } from 'vue'
import { useUsuarioUpdate } from '@/stores/usuarios'

// …
</script>
```

- Usa `defineModel()` para contratos `v-model` (filtros, paginación, inputs reutilizables).
- Usa `defineOptions({ inheritAttrs: false })` cuando envuelvas un componente y quieras
  reenviar `$attrs` explícitamente (ver `BotonEnvio.vue`).
- Los props que vienen del router suelen ser funciones u objetos de navegación:
  `back`, `linkCrear`, `editar`, `eliminar`, `setUsuarioId`, `linkSolicitud`, `rutaBase`.
  No los reemplaces por `router.push` dentro de la vista: respeta el contrato existente.

### JavaScript vs TypeScript

- Todo `src/` está migrado a TypeScript (`.ts` y SFC con `<script lang="ts" setup>`).
  `tsconfig.json` mantiene `strict: false`, `noImplicitAny: false` y `allowJs: true`.
- La comprobación de tipos es `npm run typecheck` (`vue-tsc --noEmit`) y debe quedar en
  **0 errores**.
- No introduzcas tipos estrictos (`strictNullChecks`, `noImplicitAny`) en un archivo que
  no los usa: mantén la coherencia con los archivos vecinos.
- Importa tipos con `import type`, respetando las tres capas:
  - `@/types/backend` → filas crudas de tablas y vistas de web2py.
  - `@/types/api` → parámetros, envoltorios (`ListResponse<T>`, `UpdateResult`…) y
    proyecciones que devuelven los endpoints.
  - `@/types/models` → modelos de dominio (`Create`, `Update`, `Detalle`) y las formas
    que consumen las vistas.
- Evita `any` explícito. Para fronteras donde una librería tipa mal (por ejemplo
  `BTable.selected-items` o `defineModel`), usa adaptadores tipados (ver
  `src/composables/useSelectedItems.ts`) o `unknown` + comprobación.
- `src/lib/query-keys.ts`, `src/types/*` y los stores principales están en TS: si añades
  un recurso, sigue ese patrón.

### Comentarios

- En español, explicando el **porqué** de una decisión no obvia (accesibilidad,
  comportamiento de BVN, orden de peticiones, etc.). Evita comentarios que repitan lo que
  ya dice el código.

---

## 7. Capa API

### Cliente central

`src/api/client/client.ts` crea la instancia `api`:

- `baseURL: import.meta.env.VITE_API_URL`
- `withCredentials: true` (la sesión viaja por cookie; no hay tokens en el frontend)
- `timeout: 120000`
- cabecera `X-Requested-With: XMLHttpRequest`
- `paramsSerializer.indexes = null` (arrays como `search_in=a,b`, no `search_in[]=a`)

Además:

- Cada petición incrementa/decrementa el contador global de `useActividadRed`, que alimenta
  `BarraProgreso`.
- Los errores se normalizan en `src/api/client/errors.ts`:
  `NetworkError`, `AuthenticationError`, `AuthorizationError`, `NotFoundError`,
  `ValidationError`, `ServerError`, `ApiError`, con type guards (`isApiError`,
  `isNetworkError`, `isValidationError`).
- Los errores de red/servidor/401/403/404 ya se notifican globalmente mediante eventos
  `mitt` (`events.emit('error', …)`). **No dupliques esos toasts en las vistas.**
- El evento `unauthorized` se escucha en `main.js` para redirigir a login con `?next=`.
  El intento fallido de login (POST) no redirige y se muestra inline en el formulario.
- `initAxiosInterceptors()` se invoca en `main.js` después de crear router y Pinia.

### Módulos de recurso

Un archivo por recurso en `src/api/`, con la forma:

```ts
import { api } from './client'

export const usuariosApi = {
  getAll: (params = {}) => api.get('/usuarios/usuarios', { params }).then(res => res.data),
  create: (data) => api.post('/usuarios/usuarios', data).then(res => res.data),
  delete: (id) => api.delete(`/usuarios/usuarios/${id}`).then(res => res.data),
  getById: (id) => api.get(`/usuarios/usuarios/${id}`).then(res => res.data),
  update: (id, data) => api.put(`/usuarios/usuarios/${id}`, data).then(res => res.data),
}
```

Pautas:

- Devuelve siempre `res.data` (la capa de stores no conoce Axios).
- Tipa cada llamada con el genérico de Axios: `api.get<ListResponse<T>>(...)`. El tipo de
  retorno debe salir de `src/types/api.ts` (envoltorios y proyecciones) o
  `src/types/models.ts` (detalles).
- No añadas métodos que el backend no exponga; verifica el controlador web2py.
- `reportes.ts` agrupa sub-objetos (`pendientes`, `personas`, `codigos`, `solicitudes.raw`,
  etc.) porque son acciones distintas bajo el mismo controlador.
- `uploads.ts` usa `FormData` y acepta `AxiosRequestConfig` para progreso de subida.
- Las respuestas de listado suelen ser `{ data: [...], meta: { total } }`; algunos
  endpoints devuelven un array plano (por ejemplo destinos). Comprueba la forma real antes
  de asumir `meta.total`.

### Cómo añadir un recurso

1. Crea `src/api/<recurso>.ts` con los métodos necesarios y sus tipos.
2. Añade las filas/vistas necesarias en `src/types/backend.ts` y los params, envoltorios y
   proyecciones en `src/types/api.ts`.
3. Añade sus claves en `src/lib/query-keys.ts`.
4. Crea `src/stores/<recurso>/` con `index.ts` (barrel), queries y mutations.
5. Añade interfaces en `src/types/models.ts` si el recurso lo necesita.
6. Crea la ruta en `src/router/index.ts`.
7. Crea vistas en `src/views/...` y componentes de feature si aplica.
8. Verifica el contrato contra el backend web2py y ejecuta `npm run typecheck`.

---

## 8. Estado del servidor con Pinia Colada

### Claves de consulta

Todas las claves viven en `src/lib/query-keys.ts` y son jerárquicas:

```ts
export const queryKeys = {
  usuarios: {
    root: ['usuarios'],
    listas: () => [...queryKeys.usuarios.root, 'lista'],
    lista: (filtros) => [...queryKeys.usuarios.listas(), { ...filtros }],
    detalles: () => [...queryKeys.usuarios.root, 'detalle'],
    detalle: (id) => [...queryKeys.usuarios.detalles(), id],
  },
  // …
}
```

Reglas:

- Usa `root`, `listas()`, `lista(filtros)`, `detalles()` y `detalle(id)` con esa forma.
- Al invalidar, hazlo sobre `listas()`/`detalles()` (o una clave concreta si buscas una
  actualización quirúrgica), nunca sobre toda la caché sin motivo.
- Cada recurso usa su propio `root`: `tipos` → `['tipos', …]`, `areas` → `['areas', …]`.
  No reutilices las claves de otro recurso.

### Queries de lectura

Patrón de lista (`useUsuariosQuery.ts`):

```ts
export function useUsuariosQuery(params = {}) {
  const { data, isPending, isLoading } = useQuery({
    key: () => queryKeys.usuarios.lista(toValue(params)),
    query: () => api.getAll(toValue(params)),
    placeholderData: (previousData) => previousData,
  })

  return {
    usuarios: computed(() => data.value?.data),
    meta: computed(() => data.value?.meta),
    isPending,
    isLoading,
  }
}
```

Pautas:

- Acepta `params` como objeto, `ref` o `computed`, y normalízalo con `toValue()` tanto en
  la clave como en la petición. Así la query reacciona a filtros y paginación.
- Usa `enabled: () => !!toValue(id)` para detalles que dependen de un id opcional.
- Usa `staleTime: Infinity` solo en datos de catálogo que no cambian (auth, áreas,
  destinos, grupos); no lo pongas por defecto.
- Devuelve alias de dominio (`usuarios`, `usuario`, `solicitud`, `meta`) y los flags
  `isPending` / `isLoading`. No expongas el objeto crudo de Colada salvo necesidad.
- `placeholderData: (previousData) => previousData` es el patrón para listas y detalles que
  no deben “parpadear” al cambiar de página o refrescar.

### Mutations

Patrón (`useUsuarioUpdate.ts`):

```ts
export function useUsuarioUpdate() {
  const queryCache = useQueryCache()

  return useMutation<any, UsuarioUpdate>({
    mutation: ({ id, ...updatedData }) => api.update(id, updatedData),

    onMutate: () => {
      queryCache.cancelQueries({ key: queryKeys.usuarios.listas() })
      queryCache.cancelQueries({ key: queryKeys.usuarios.detalles() })
    },

    onSuccess: () => {
      queryCache.invalidateQueries({ key: queryKeys.usuarios.listas() })
      queryCache.invalidateQueries({ key: queryKeys.usuarios.detalles() })
    }
  })
}
```

Pautas:

- `onMutate`: cancela consultas en vuelo de las claves afectadas.
- `onSuccess`: invalida listas y detalles; si la mutación afecta notificaciones o
  solicitudes, invalida también esas claves (ver `useSolicitudUpdate`).
- `useLogin` / `useLogout` escriben directamente la caché de `queryKeys.auth.user()`
  (`setQueryData`). Mantén ese comportamiento: `useAuthQuery` usa `staleTime: Infinity`.
- En las vistas se consume `mutateAsync` y `asyncStatus`; `loading` se deriva con
  `computed(() => asyncStatus.value === 'loading')`.
- Para subidas con progreso, el payload es `{ data, onProgress }` (ver
  `useUploadCreate`).

### Stores: composables vs Pinia

- La mayoría de “stores” son **composables** que crean estado por consumidor. Esto es
  intencional: dos listas en pantalla no comparten filtros.
- El único `defineStore` real es `useSolicitudesFiltro`, con
  `persist: { storage: sessionStorage, pick: ['status', 'period', 'search'] }`.
  Solo crea un store Pinia si el estado debe sobrevivir a la navegación o compartirse
  entre vistas; si no, usa un composable.
- Cada dominio expone un `index.ts` que reexporta sus hooks. Importa siempre desde el
  barrel (`@/stores/usuarios`), no desde el archivo interno.
- Patrón de lista completa (`useUsuariosLista.ts`): combina filtros + página + límite,
  resetea a página 1 al cambiar filtros con `watch(filtro, …, { flush: 'sync' })` y
  construye los `params` que espera el API.
- Patrón de catálogo para selects: las queries de opciones devuelven `options` como
  `{ value, text }[]`, a menudo ordenadas con `tidy(..., arrange(['text']))`.

---

## 9. Enrutado

`src/router/index.js` define todas las rutas con `createWebHashHistory()`.

Convenciones:

- Rutas agrupadas en arrays por sección: `routesAuth`, `routesSolicitudes`,
  `routesReportes`, `routesAdmin`.
- Nombres en **kebab-case** y jerárquicos:
  - Lista: `admin-usuarios`
  - Detalle: `admin-usuario`
  - Acción: `admin-usuario-editar`, `admin-usuario-eliminar`
  - Subflujo de solicitud: `solicitudes-solicitud-asignar`, `…-responder`, `…-aprobar`…
- Carga diferida con `() => import('@/views/...')` en todas las vistas.
- Los `props` de ruta son funciones que:
  - convierten ids con `parseInt(route.params.x)`;
  - exponen callbacks de navegación (`back`, `linkSolicitud`, `setXId`) en lugar de que la
    vista use el router directamente.
- `meta`:
  - `requiresAuth: true` en secciones privadas; el `beforeEach` espera a que
    `useAuthQuery().isPending` sea `false` y redirige a `auth-login` con `?next=`.
  - `logout: true` en login/logout/expired; el `afterEach` ejecuta `useLogout()`.
  - `saveFolder: true` guarda `admred_router_folder` (`tray/state`) en `useStorage`.
- La raíz `/` redirige a `/solicitudes`; el 404 usa `views/not_found.vue`.
- Las rutas de detalle anidan las acciones (`editar`, `eliminar`, `asignar`…) para que la
  vista de detalle siga montada y el `RouterView` hijo se muestre encima.
- En solicitudes y reportes se reutiliza el helper `rutasSolicitud(...)` para generar el
  subárbol de acciones.

Al añadir una sección nueva, replica la estructura: array de rutas + vista índice que
monta el layout y hace `provide` del título/contexto + `RouterView`.

---

## 10. Vistas, layouts y componentes

### Dónde va cada cosa

- `src/views/`: páginas asociadas a rutas. Pueden ser contenedores de layout o vistas de
  acción.
- `src/components/features/<dominio>/`: piezas con conocimiento del dominio
  (`ListaGrid`, `ListaFiltro`, `AccionesMenu`, `TiemposSubCard`…).
- `src/components/commons/`: piezas genéricas sin dominio (`BotonEnvio`, `IndicadorCarga`,
  `TablaEsqueleto`, `TablePagination`, `ClampText`, `DateRangePicker`…).
- `src/components/layout/`: shell de la aplicación (`Layout`, `Header`, `Footer`,
  `Drawer`, `Page`, `PageContainer`).
- `src/layouts/`: composiciones de ese shell (`MainLayout`, `AltLayout`, `AuthLayout`).

### Patrón de sección

`src/views/admin/index.vue`, `src/views/reportes/index.vue` y
`src/views/solicitudes/index.vue`:

- Montan `AltLayout` (admin/reportes) o `MainLayout` (solicitudes).
- Hacen `provide` del título de la sección (`admin:title`, `reportes:title`).
- Pasan `HeaderContent` y `DrawerContent` por slots.
- Renderizan `RouterView` en `#page-content`.

### Patrón de recurso admin

```text
views/admin/usuarios/
├── index.vue          # Lista (v-show) + RouterView; provide de usuarioId/linkCrear/setUsuarioId
├── crear.vue          # Formulario de alta
└── [id]/
    ├── index.vue      # Detalle; provide('usuario:usuario', usuario)
    ├── editar.vue     # Formulario de edición
    └── eliminar.vue   # Confirmación de borrado
```

- `index.vue` recibe `showLista`, `usuarioId`, `linkCrear`, `setUsuarioId`; mantiene la
  lista visible con `v-show="showLista"` y deja que el `router-view` se superponga.
- El detalle recibe `showDetalle`, el id y los objetos de navegación `back`, `editar`,
  `eliminar`; hace `provide` del recurso para que `editar.vue` lo consuma con `inject`.
- Los formularios reciben `back` y, en eliminar, también `backLista`.
- Los permisos del backend se usan para mostrar acciones: `usuario.permisos.eliminar`, etc.

### Provide / inject

- Las claves son **namespaced** con `:` y describen el ámbito:
  `app:mobile`, `app:xlDown`, `layout:header`, `admin:title`,
  `admin:usuarios:usuarioId`, `usuario:usuario`, `solicitud:solicitud`,
  `solicitudes:tray`.
- Se proveen `computed(() => props.x)` para mantener la reactividad.
- En los consumidores, `inject('clave')`; si el valor puede faltar, usa el segundo
  argumento con un `ref`/`computed` por defecto (ver `components/layout`).

### Componentes de BootstrapVueNext e iconos

- `unplugin-vue-components` resuelve automáticamente los componentes de BVN (`BTable`,
  `BFormGroup`, `BModal`…) y `unplugin-icons` los iconos (`<ILucidePlus />`,
  `<IBiSearch />`). No hace falta registrarlos globalmente.
- `components.d.ts` es generado; no lo edites.
- Usa la **etiqueta estática** del icono. Para nombres dinámicos (desde datos o `v-for`),
  usa `<UIcon :name="'lucide-…'" />`; si el icono no está en el mapa de
  `src/components/commons/unplugin-icons/UIcon.vue`, regístralo allí.
- Envoltorios propios disponibles:
  - `BotonEnvio.vue`: botón de envío con spinner, texto de progreso y bloqueo.
  - `BFormButtons.vue`: fila de acciones de formulario.
  - `BSearchInput.vue`: input de búsqueda con debounce/lazy.
  - `BModalNext.vue` / `BModalPlus.vue`: modales con minimización tipo cápsula.
  - `TablePagination.vue`: paginación de servidor.

### Breakpoints

- `App.vue` provee `app:mobile` (`< md`) y `app:xlDown` (`< xl`) con
  `useBreakpoints(breakpointsBootstrapV5)`.
- En componentes, `inject('app:mobile')`; no dupliques `matchMedia`.

---

## 11. Formularios

Patrón canónico (ver `views/admin/usuarios/crear.vue`):

```ts
const form = ref<UsuarioCreate>({ /* … */ })
const errors = ref<Record<string, any>>({})
const errorState = computed(() => ({
  first_name: {
    state: errors.value.first_name ? false : null,
    invalidFeedback: errors.value.first_name,
    onInput: () => errors.value.first_name = null
  },
  // …
}))
const { mutateAsync: crearUsuario, asyncStatus } = useUsuarioCreate()
const loading = computed(() => asyncStatus.value === 'loading')

const submit = () => {
  if (loading.value || !validate()) return
  crearUsuario(form.value)
    .then(() => {
      exito('Nuevo usuario creado.')
      props.back()
    })
    .catch(err => {
      isValidationError(err) && (errors.value = err.errors)
      errors.value.form = 'Error al crear el registro.'
    })
}
```

Reglas:

- `BForm @submit.prevent="submit" :aria-busy="loading"`.
- `BFormGroup` recibe `v-bind="errorState.campo"`; cada campo limpia su error en `onInput`.
- Guarda anti-duplicado: `if (loading.value) return` (cubre también el envío con Enter).
- Usa `BotonEnvio` con `:loading` y `texto-cargando` («Creando usuario…»,
  «Guardando cambios…», «Eliminando…»); el botón Cancelar lleva `:disabled="loading"`.
- Validación local con patrones de `@/constants` (`EMAIL_PATRON`, `TELEFONO_PATRON`) y
  mensajes en español.
- Errores de validación del backend: `isValidationError(err) → err.errors` (normalizado en
  `ValidationError`). El resto de errores ya los muestra el interceptor global.
- Tras una mutación correcta: toast de éxito con `useNotificaciones().exito(...)` y
  navegación con el callback `back` / `backLista`.
- En errores de mutación no globales, usa `errorDeApi(err, 'mensaje por defecto')`, que
  solo notifica validaciones para no duplicar los toasts del interceptor.
- `density="3"` es la separación vertical habitual entre grupos de formulario; usa las
  clases utilitarias del proyecto (`max-w-500`, `px-3`, `py-4`, `w-90`).

---

## 12. Listados y tablas

Pipeline típico (admin):

```text
useUsuariosFiltro      → estado de filtros por consumidor
useUsuariosLista       → filtros + page/limit + params + reset
useUsuariosQuery       → Colada (placeholderData, meta.total)
ListaGrid.vue          → tabla, esqueleto, paginación y refresco
ListaFiltro.vue        → v-model de cada filtro + evento reset
```

Pautas:

- Paginación **en servidor**: el API recibe `page` y `limit` y devuelve `meta.total`.
- `TablePagination` usa `v-model:page` y `v-model:per-page`; al cambiar el tamaño vuelve a
  la página 1. Deshabilítala mientras `isLoading`.
- Carga inicial → `TablaEsqueleto` con `:columnas` y `:filas`.
- Refresco con datos previos → conserva la tabla y muestra
  `<IndicadorCarga inline texto="Actualizando…" />` dentro de `.indicador-actualizacion`
  (clase global).
- Semántica de Colada: `isPending` = aún no hay datos; `isLoading` = hay petición en curso
  (incluye refrescos). No intercambies esos flags.
- Campos de tabla: array de `{ key, label, formatter?, tdClass?, sortable? }`. El
  `formatter` recibe `{ value }` y devuelve el texto mostrado.
- Selección de fila: `BTable` con `primary-key`, `selectable`, `select-mode="single"` y
  `v-model:selected-items`; sincroniza la fila activa con el id de la ruta mediante
  `watchEffect`.
- Para tablas de tuplas (filas como arrays) se usa `primary-key="0"` y `key` numérica
  (ver `features/solicitudes/grid`).
- Texto vacío contextual: distingue «no hay registros» de «no hay coincidencias con los
  filtros» usando `isFiltered`.

---

## 13. Feedback asíncrono, errores y accesibilidad

Este proyecto centraliza la retroalimentación; respétalo:

- **Barra global** (`components/commons/BarraProgreso.vue`): aparece sola con peticiones
  HTTP o navegaciones pendientes. Se alimenta de `composables/useActividadRed.ts` y de los
  interceptores de `src/api/client/client.ts`. No la actives desde cada vista.
- **Envío de datos** (`BotonEnvio`): úsalo en lugar de `BButton` para crear/actualizar/
  eliminar. Gestiona spinner, texto de progreso, `aria-busy` y doble envío.
- **Carga de datos** (`IndicadorCarga`): en bloque para carga inicial; `inline` para
  refrescos. Usa textos concretos («Cargando usuarios…», «Actualizando…»).
- **Listados** (`TablaEsqueleto`): esqueleto en la carga inicial; en refrescos conserva los
  datos anteriores.
- **Toasts** (`useNotificaciones`): `exito`, `error`, `aviso`, `info`, `errorDeApi`.
  Posición `bottom-center` y duraciones por variante.
- **Errores globales** (`useErroresGlobalesToast`): escucha el evento `error` del cliente
  HTTP y deduplica por tipo+mensaje mientras el toast está visible. No añadas toasts
  manuales para errores de red, servidor, 401, 403 o 404.
- **Mensajes**: los textos de error de red/servidor están en
  `src/constants/errorMessages.ts`; si añades un caso nuevo, extiende ese archivo en lugar
  de dispersar literales.

Accesibilidad:

- `aria-busy` en formularios y contenedores que se refrescan.
- `role="status"` + `aria-live="polite"` en indicadores; el spinner va `aria-hidden`.
- Etiquetas visibles en formularios (`BFormGroup label=…`).
- `aria-label` en botones con solo icono (ver componentes de layout y modales).
- Respeta `prefers-reduced-motion` en animaciones nuevas (ver `BarraProgreso`).

---

## 14. Estilos

- Entrada SCSS: `src/assets/css/main.scss`, con orden:
  `tokens → utilities → overrides → density → admred` (además del CSS de datepicker).
- Usa **variables CSS de Bootstrap** (`--bs-primary`, `--bs-gray-600`, `--bs-border-color`,
  `--bs-surface-*`, `--bs-estado-*`) en lugar de colores literales.
- Tokens propios en `_tokens.scss`: superficies (`--bs-surface-1..5`), marca
  (`--bs-brand`), estados de solicitud y tamaños de fuente pequeños.
- Utilidades del proyecto:
  - Tamaños: `wh-26/30/34/36/38/50`, `w-90`, `w-110`, `max-w-700/500/400/300`.
  - Botones: variantes `flat`, `emphasis`, `flat-primary`, `flat-danger`, etc.
  - Estados: `.estado-badge[data-estado="Solicitado|En proceso|En evaluación"]`.
  - Refresco de tablas: `.indicador-actualizacion`.
  - Layout: `density="2|3"` para separación vertical.
- Prefiere clases utilitarias de Bootstrap y las extensiones anteriores antes de escribir
  CSS nuevo.
- `<style scoped>` por defecto. Usa `:deep(...)` para alcanzar nodos internos de BVN.
  Escribe estilos **globales** solo cuando debas alcanzar nodos que BVN renderiza fuera del
  componente (ejemplo: `BModalNext.vue`), y ancla las reglas a una clase propia para no
  afectar a otros componentes.
- Evita estilos inline estáticos. Se permiten `:style` dinámicos con custom properties
  (patrón `rootStyle` usado por `BButton`, `Drawer`, `BSearchInput`).
- Para estilos compartidos con hijos, el proyecto usa un segundo `<style lang="scss">`
  sin `scoped` con una clase contenedora (ver `.solicitud-data`).

---

## 15. Utilidades transversales (`src/composables`)

| Composable | Uso |
| --- | --- |
| `useActividadRed` | Contador global de peticiones en curso; lo usa `BarraProgreso`. |
| `useAuthUserMenu` | Acciones del menú de usuario (logout, personificar). |
| `useDates` | `formatTime`, `formatDate`, `formatHM`, `shortTime`, `shorterTime`, `listTime`. |
| `useErroresGlobalesToast` | Puente entre eventos del cliente HTTP y toasts; se instala en `App.vue`. |
| `useExportCSV` | Exportación CSV con opción `excelReady` (separador `;`, BOM, sanea saltos). |
| `useFileSize` | Formatea bytes a B/K/M/G. |
| `useNavigation` | Opciones de navegación por sección (solicitudes, reportes, admin). |
| `useNotificaciones` | Toasts de éxito/error/aviso/info y `errorDeApi`. |
| `useTeleportTarget` | Detecta un selector del DOM con backoff (para teleports). |
| `useTextLimit` | Límite de texto con aviso, respeto de texto heredado y composición IME. |
| `useTimeDelta` | Diferencias en minutos, jornada laboral y formato `Xd Yh`. |

Fechas:

- `formatTime` / `formatDate` / `formatHM` devuelven **string** (`DD/MM/YYYY HH:mm`, etc.).
- `shortTime` / `shorterTime` / `listTime` devuelven un **`Ref<string | null>`** que se
  actualiza a medianoche; úsalos directamente en plantillas o dentro de `computed`.
- `getDate` acepta `Date`, ISO, `"YYYY-MM-DD HH:mm:ss"` (formato del backend) y
  `"YYYY-MM-DD"` (datepicker). No reinventes el parseo.
- `timeDeltaW` calcula minutos laborables (L–V, 8:00–12:00 y 12:30–17:30; viernes hasta
  16:30).

Otros:

- `useExportCSV({ excelReady: true })` es el modo habitual en reportes; usa
  `exportCSV(fields, data, filename)` o `exportCSVTuplas(columns, data, filename)`.
- `useTextLimit(modelo, max)` se usa en los formularios de solicitudes para limitar
  objetivo, observaciones y notas sin romper texto heredado.
- Las subidas usan `useUploadCreate` con `FormData` y callback `onProgress`.

---

## 16. Entorno, proxy y despliegue

Variables de entorno (solo se usa `VITE_API_URL`):

| Archivo | Valor | Cuándo |
| --- | --- | --- |
| `.env` | `https://localhost:8000/admred` | Valor por defecto (acceso directo) |
| `.env.local` | `/admred` | Desarrollo con proxy de Vite (ignorado por git) |
| `.env.production` | `/admred` | Build de producción |
| `.env.corp` | `https://172.17.48.90:8000/admred` | `npm run dev_corp` |

- El proxy de `vite.config.js` reenvía `/admred` a `https://localhost:8000` con
  `changeOrigin: true` y `secure: false` para aceptar el certificado autofirmado de
  web2py. También evita CORS al mantener el mismo origen.
- El servidor de desarrollo usa `vite-plugin-mkcert` (HTTPS local).
- `build_admred` compila con `--base=/admred/static/` para publicar los assets bajo
  web2py. Usa ese script para verificar rutas de assets cuando el cambio afecte al
  despliegue.
- El router usa hash (`#/ruta`), así que no requiere rewrites del servidor.
- No hay variables de entorno para credenciales: la sesión es por cookie
  (`withCredentials: true`).

---

## 17. Reglas de oro y trampas conocidas

1. **No edites archivos generados**: `components.d.ts`, `vite.config.d.ts`,
   `tsconfig.node.tsbuildinfo`, `dist/`, `node_modules/`.
2. **No dupliques toasts de error**: red, servidor, 401, 403 y 404 ya se notifican en el
   interceptor. En vistas, usa `errorDeApi` solo para validación.
3. **No llames a `axios` directamente**: pasa por `src/api/client`.
4. **No inventes endpoints**: verifica el controlador web2py antes de añadir un método API.
5. **No compartas estado de filtros por accidente**: usa composables por consumidor; solo
   `useSolicitudesFiltro` es un store persistido.
6. **No cambies `isPending` por `isLoading`** (ni al revés) en esqueletos e indicadores.
7. **Mantén las claves de query jerárquicas**: cada recurso debe usar su propio `root`
   (`tipos` → `['tipos', …]`, `areas` → `['areas', …]`).
8. **Respeta el contrato de props de ruta** (`back`, `linkCrear`, `setXId`, …); no metas
   navegación directa con `router.push` en las vistas que ya lo reciben.
9. **No migres JS↔TS de forma masiva**; sigue el estilo del archivo y de su carpeta.
10. **Comprueba ambos lados del sistema** cuando cambie un contrato de API (frontend y
    `D:\proyectos\web2py\applications\admred`).
11. **No añadas dependencias** sin necesidad; el proyecto ya cubre HTTP, estado, fechas,
    CSV, iconos, tooltips y utilidades reactivas.
12. **Accesibilidad y feedback** no son opcionales: `aria-busy`, textos de carga concretos
    y botones de envío con `BotonEnvio`.

---

## 18. Checklist para añadir un recurso CRUD

- [ ] Revisar el controlador/modelo web2py y acordar el contrato (rutas, parámetros,
      forma de `data`/`meta`, errores de validación).
- [ ] Crear `src/api/<recurso>.ts` con los métodos necesarios.
- [ ] Añadir claves en `src/lib/query-keys.ts`.
- [ ] Añadir/ajustar interfaces en `src/types/models.ts` (`Create`, `Update`, detalle).
- [ ] Crear `src/stores/<recurso>/` con `index.ts`, `use<X>Query`, `use<X>Lista`,
      `use<X>Filtro` (si aplica) y mutations `Create/Update/Delete`.
- [ ] Añadir las rutas en `src/router/index.js` con nombres kebab-case y props function.
- [ ] Crear vistas siguiendo `views/admin/<recurso>/` (`index`, `crear`, `[id]/index`,
      `[id]/editar`, `[id]/eliminar`).
- [ ] Crear componentes de feature (`ListaGrid`, `ListaFiltro`) en
      `src/components/features/<seccion>/<recurso>/`.
- [ ] Usar `BotonEnvio`, `IndicadorCarga`, `TablaEsqueleto` y `TablePagination`.
- [ ] Añadir opciones/patrones a `src/constants/` si hacen falta.
- [ ] Añadir la entrada de navegación en `src/composables/useNavigation.ts`.
- [ ] Probar `npm run lint` y `npm run build` (o `build_admred`).
- [ ] Verificar permisos y textos en español.
