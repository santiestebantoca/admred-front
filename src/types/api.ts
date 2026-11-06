/**
 * Contratos de transporte del API: parámetros de consulta, envoltorios de
 * listado y proyecciones que devuelven los endpoints.
 *
 * Los modelos de dominio (Create/Update/Detalle) viven en `models.ts`.
 * Las filas de tablas y vistas viven en `backend.ts`.
 *
 * Fuente: controladores de `D:\proyectos\web2py\applications\admred`.
 */

import type {
  AreaVistaRow,
  AuthGroupRow,
  NivelRow,
  SolicitudRawRow,
  SolicitudVistaRow,
  TipoRow,
  VwUsuarioRow,
} from './backend'

/** Identificador que puede venir del router (string) o de la base (number). */
export type Id = number | string

/** Meta de los listados que no se paginan en servidor. */
export interface MetaListado {
  total: number
  /** Solo presente cuando el endpoint recibió `page` y `limit`. */
  page?: number
  limit?: number
  totalPages?: number
  hasNext?: boolean
  hasPrev?: boolean
}

/** Meta de los listados paginados en servidor. */
export interface MetaPaginada extends MetaListado {
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

/** Envoltorio `{ data, meta }` de los listados. */
export interface ListResponse<T> {
  data: T[]
  meta: MetaListado
}

/** Envoltorio `{ data, meta }` de los listados paginados. */
export interface PaginatedResponse<T> extends ListResponse<T> {
  meta: MetaPaginada
}

/** Parámetros comunes de paginación en servidor. */
export interface PaginacionParams {
  page?: number
  limit?: number
}

/** Parámetros comunes de búsqueda de texto. */
export interface BusquedaParams {
  search?: string
  search_in?: string[]
}

/** Errores de validación que devuelve web2py (`validate_and_*`). */
export type ErroresDeValidacion = Record<string, string>

/** Resultado de `validate_and_insert` (web2py). */
export interface InsertResult {
  /** `null` cuando hay errores de validación. */
  id: number | null
  errors: ErroresDeValidacion
}

/** Resultado de `Set.validate_and_update` (web2py). */
export interface UpdateResult {
  /** `null` cuando hay errores de validación. */
  updated: number | null
  errors: ErroresDeValidacion
}

// ---------------------------------------------------------------------------
// Usuarios
// ---------------------------------------------------------------------------

export interface UsuariosParams extends BusquedaParams, PaginacionParams {
  nombre?: string
  area?: Id
  rol?: Id
  estado?: string
}

/** Proyección de `vw_usuario` que devuelve `GET /usuarios/usuarios`. */
export type UsuarioListaItem = Pick<
  VwUsuarioRow,
  'id' | 'name' | 'username' | 'registration_key'
>

export type UsuariosListaResponse = ListResponse<UsuarioListaItem>

/** `GET /auth/users`: opciones para personificar. */
export type UsuarioOpcion = Pick<VwUsuarioRow, 'id' | 'name' | 'username'>

export interface AuthUsersParams {
  search?: string
}

// ---------------------------------------------------------------------------
// Áreas
// ---------------------------------------------------------------------------

export interface AreasParams extends BusquedaParams, PaginacionParams {
  nombre?: string
  padre?: Id
  nivel?: Id
  rol_key?: boolean
}

/** Proyección de la vista `areas` que devuelve `GET /areas/areas`. */
export type AreaListaItem = Pick<
  AreaVistaRow,
  'id' | 'nombre' | 'padre' | 'nivel' | 'rol_key'
>

export type AreasListaResponse = ListResponse<AreaListaItem>

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export interface TiposParams extends BusquedaParams, PaginacionParams {
  nombre?: string
  descripcion?: string
  /** `'0'` (sin uso) o el máximo de usos para "poco uso". */
  uso?: string
}

/** Proyección de `tipo` que devuelve `GET /tipos/tipos`. */
export type TipoListaItem = Pick<TipoRow, 'id' | 'nombre' | 'descripcion'>

export type TiposListaResponse = ListResponse<TipoListaItem>

// ---------------------------------------------------------------------------
// Catálogos
// ---------------------------------------------------------------------------

/** `GET /destinos/destinos`: array plano. */
export type DestinoOpcion = Pick<AreaVistaRow, 'id' | 'nombre'>

export interface DestinosParams {
  /** Rango `"min,max"` (limitby de web2py). */
  limit?: string
  search?: string
}

/** `GET /niveles/niveles`: array plano. */
export type NivelesResponse = NivelRow[]

/** `GET /auth_groups/auth_groups`: array plano. */
export type AuthGroupsResponse = AuthGroupRow[]

/** `GET /tramitadores/tramitadores`: array plano. */
export type TramitadorOpcion = Pick<VwUsuarioRow, 'id' | 'name'>

export interface TramitadoresParams {
  search?: string
}

/** `GET /consultadas/consultadas`: array plano. */
export interface ConsultadaRow {
  /** Nombre del área de destino (vista `solicitudes`). */
  destino: string
  destino_id: number
}

export interface ConsultadasParams {
  desde: string
  hasta: string
  origen_id?: Id
  origen_nivel?: number | number[]
}

/** `GET /demandantes/demandantes`: array plano. */
export interface DemandanteRow {
  /** Nombre del área de origen (vista `solicitudes`). */
  origen: string
  origen_id: number
}

export interface DemandantesParams {
  desde: string
  hasta: string
  destino_id?: number
  origen_nivel?: number | number[]
}

// ---------------------------------------------------------------------------
// Solicitudes
// ---------------------------------------------------------------------------

export type Tray = 'recibidas' | 'enviadas'
export type EstadoLista = 'pendientes' | 'terminadas'
export type Periodo = 1 | 2 | 3 | 4
export type EstadoId = 1 | 2 | 3 | 4

export interface SolicitudesParams extends BusquedaParams {
  tray: Tray
  state: EstadoLista
  status?: EstadoId
  period?: Periodo
}

/**
 * Fila del listado `GET /solicitudes/solicitudes` (sin id).
 *
 * El backend usa `db.executesql`, por lo que cada fila es una tupla y no un
 * objeto. La posición 6 es `origen` cuando `tray=recibidas` y `destino`
 * cuando `tray=enviadas`.
 */
export type SolicitudListaTupla = [
  id: number,
  codigo: string,
  objetivo: string,
  estado: string,
  solicitado_en: string,
  terminado_en: string | null,
  area: string,
  padre_id: number | null,
]

export type SolicitudesListaResponse = ListResponse<SolicitudListaTupla>

/** Parámetros de `GET /notas/notas` y `GET /bitacoras/bitacoras`. */
export interface SolicitudIdParams {
  solicitudId: Id
}

// ---------------------------------------------------------------------------
// Notificaciones
// ---------------------------------------------------------------------------

export interface SolicitudResumen {
  id: number
  codigo: string
}

export interface NotificacionesResponse {
  pendientes: {
    recibidas: {
      total: number
      por_asignar: SolicitudResumen[]
      por_responder: SolicitudResumen[]
      por_aprobar: SolicitudResumen[]
    }
    enviadas: {
      total: number
    }
  }
}

// ---------------------------------------------------------------------------
// Autenticación
// ---------------------------------------------------------------------------

/** Respuesta de `user()` en `controllers/auth.py`. */
export interface AuthUser {
  id: number
  name: string
  username: string
  email: string | null
  movil: string | null
  fijo: string | null
  admin: boolean
  supervisor: boolean
  /** `auth.user_groups`: nombre del grupo -> id del grupo. */
  user_groups: Record<string, number>
  is_impersonating: boolean
  can_impersonate: boolean
  AR: boolean
  DAR: boolean
  area: number
  area_nombre: string
}

// ---------------------------------------------------------------------------
// Reportes
// ---------------------------------------------------------------------------

/**
 * Nodo de `traversal()` en `reportes.pendientes_del_area`.
 * `estado` y `destino` son ids: la consulta usa la tabla `solicitud`.
 */
export interface NodoRecorridoPendiente {
  id: number
  codigo: string
  leaf: boolean
  parent: number | null
  children: number[]
  estado: number
  destino: number
  root: boolean
}

/**
 * Nodo de `traversal_render()` en los reportes de solicitudes.
 * La consulta usa la vista `solicitudes`, por lo que los textos ya vienen
 * resueltos.
 */
export interface NodoRecorridoReporte {
  id: number
  codigo: string
  leaf: boolean
  parent: number | null
  children: number[]
  estado: string
  destino: string
  origen: string
  root: boolean
}

/** `GET /reportes/pendientes_del_area`: array de árboles. */
export type ReportePendientesResponse = NodoRecorridoPendiente[][]

/**
 * Fila de `GET /reportes/indicadores_del_usuario`.
 * `supervisor` y `tramitador` se convierten en booleanos en el controlador.
 */
export interface ReportePersonaRow {
  id: number
  codigo: string | null
  /** Id del estado: `db.solicitud.estado` no se expande. */
  estado: number | null
  supervisor: boolean
  tramitador: boolean
  solicitado_en: string | null
  tramitador_en: string | null
  respuesta_en: string | null
  terminado_en: string | null
  /** Fecha de la primera hija creada (solo si es tramitador). */
  hijo_en?: string | null
  /** Fecha de la última hija terminada (solo si es tramitador). */
  hijo_terminado_en?: string | null
}

export interface ReportesPersonasParams {
  user_id: Id
  month: number
  year: number
}

/** `GET /reportes/buscar_codigo`: array plano. */
export interface ReporteCodigoRow {
  id: number
  codigo: string | null
  objetivo: string | null
  solicitado_en: string | null
  terminado_en: string | null
  /** Nombre del área (el controlador sustituye el id). */
  origen: string
  /** Nombre del área (el controlador sustituye el id). */
  destino: string
}

export interface ReportesCodigosParams {
  codigo: string
}

/** `GET /reportes/areas_consultadas`: array plano. */
export interface ReporteAreaConsultadaRow {
  /** Nombre del área de destino (vista `solicitudes`). */
  destino: string
  solicitado_en: string | null
  terminado_en: string | null
}

export interface ReportesAreasConsultadasParams {
  desde: string
  hasta: string
  origen?: number
  curso?: 1 | 2
}

/** Fila base de `solicitudes_externas` y `solicitudes_internas`. */
export interface ReporteSolicitudRow {
  id: number
  codigo: string | null
  objetivo: string | null
  origen: string
  destino: string
  solicitado_en: string | null
  terminado_en: string | null
  estado: string
  /** Descendientes del árbol de reenvíos (la raíz se excluye). */
  related: NodoRecorridoReporte[]
}

export interface ReportesSolicitudesExternasParams {
  desde: string
  hasta: string
  origen?: number
  estado?: EstadoId | EstadoId[]
  codigo?: string
  objetivo?: string
}

export interface ReportesSolicitudesInternasParams
  extends ReportesSolicitudesExternasParams {
  destino?: number
}

export interface ReportesSolicitudesRawParams {
  desde: string
  hasta: string
  destino_id: number
}

/** `GET /reportes/solicitudes_raw`: array plano. */
export type ReporteSolicitudRawRow = SolicitudRawRow

/**
 * Fila de la vista `solicitudes` usada por el detalle de una solicitud.
 * Se reexporta por comodidad para los modelos de `models.ts`.
 */
export type SolicitudVista = SolicitudVistaRow

// ---------------------------------------------------------------------------
// Uploads
// ---------------------------------------------------------------------------

export interface UploadsParams {
  id?: Id
  solicitud_id?: Id
  /** `1` adjuntos de la solicitud, `2` adjuntos de la respuesta. */
  tipo?: number
}
