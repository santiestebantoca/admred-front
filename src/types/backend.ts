/**
 * Filas de tablas y vistas tal como las expone el backend web2py.
 *
 * Fuente:
 * - `models/db_.py`      tablas físicas
 * - `models/db_views.py` vistas de base de datos
 * - `models/db.py`       tabla `auth_user` (auth.define_tables)
 *
 * Convenciones:
 * - web2py serializa `datetime` como "YYYY-MM-DD HH:mm:ss" y `date` como
 *   "YYYY-MM-DD"; por eso las fechas son `string`.
 * - Solo los campos con `notnull=True` (y las claves primarias) son no nulos.
 *   El resto se marca `| null` porque la base de datos lo permite.
 * - Los campos `reference` se serializan como el id referenciado (number).
 */

/** Fecha y hora serializada por web2py: "YYYY-MM-DD HH:mm:ss". */
export type FechaHora = string

/** Fecha serializada por web2py: "YYYY-MM-DD". */
export type Fecha = string

/**
 * Campos que `auth.signature` añade a las tablas que lo incluyen
 * (`area` y `tipo`).
 */
export interface FirmaRow {
  is_active: boolean | null
  created_on: FechaHora | null
  created_by: number | null
  modified_on: FechaHora | null
  modified_by: number | null
}

/** Fila de la tabla `upload` (models/db_.py). */
export interface UploadRow {
  id: number
  upload: string
  filename: string
  filemodified: string
  filesize: number
  /** Campo virtual `file`: URL de descarga. */
  file: string
}

/** Fila de la tabla `adjunto` (models/db_.py). */
export interface AdjuntoRow {
  id: number
  solicitud_id: number | null
  upload_id: number | null
  tipo: number | null
}

/** Fila de la tabla `nivel` (models/db_.py). */
export interface NivelRow {
  id: number
  nombre: string
  descripcion: string | null
  padre_id: number | null
  alcance: string | null
}

/** Fila de la tabla `area` (models/db_.py). */
export interface AreaRow extends FirmaRow {
  id: number
  nombre: string
  padre: number | null
  nivel: number | null
  rol_key: string | null
}

/** Fila de la tabla `tipo` (models/db_.py). */
export interface TipoRow extends FirmaRow {
  id: number
  nombre: string
  descripcion: string | null
}

/** Fila de la tabla `estado` (models/db_.py). */
export interface EstadoRow {
  id: number
  nombre: string
  descripcion: string
}

/** Fila de la tabla `solicitud` (models/db_.py). */
export interface SolicitudRow {
  id: number
  codigo: string | null
  solicitado_en: FechaHora | null
  tipo: number | null
  objetivo: string | null
  origen: number | null
  destino: number | null
  tramitador: number | null
  remitente: number | null
  estado: number | null
  respuesta_en: FechaHora | null
  terminado_en: FechaHora | null
  observaciones: string | null
  evaluacion: number | null
  supervisor: number | null
  tramitador_en: FechaHora | null
  padre: number | null
  cumplir_en: FechaHora | null
}

/** Fila de la tabla `bitacora` (models/db_.py). */
export interface BitacoraRow {
  id: number
  solicitud: number | null
  fecha: FechaHora | null
  accion: string | null
  por: number | null
  argumentos: string | null
}

/** Fila de la tabla `nota` (models/db_.py). */
export interface NotaRow {
  id: number
  solicitud: number | null
  fecha: FechaHora | null
  tramitador: number | null
  supervisor: number | null
  texto: string | null
  evento: string | null
}

/**
 * Fila de la tabla `auth_user` (auth.define_tables en gluon/authapi.py).
 * `username=True` en models/db.py.
 */
export interface AuthUserRow extends FirmaRow {
  id: number
  first_name: string | null
  last_name: string | null
  email: string | null
  username: string | null
  password: string | null
  registration_key: string | null
  reset_password_key: string | null
  registration_id: string | null
  area: number | null
  fijo: string | null
  movil: string | null
}

/** Fila de la tabla `auth_group`. */
export interface AuthGroupRow {
  id: number
  role: string | null
  description: string | null
}

/** Fila de la tabla `auth_membership`. */
export interface AuthMembershipRow {
  id: number
  user_id: number | null
  group_id: number | null
}

/**
 * Fila de la vista `vw_usuario` (models/db_views.py).
 * `name` es el nombre completo ya concatenado por la vista.
 */
export interface VwUsuarioRow {
  id: number
  name: string | null
  username: string | null
  email: string | null
  fijo: string | null
  movil: string | null
  registration_key: string | null
  created_by: number | null
  /** Nombre del área. */
  area: string | null
  area_id: number | null
}

/**
 * Fila de la vista `solicitudes` (models/db_views.py).
 * `origen`, `destino` y `estado` son los textos de la vista; sus ids están
 * en `origen_id`, `destino_id` y `estado_id`.
 */
export interface SolicitudVistaRow {
  id: number
  codigo: string | null
  objetivo: string | null
  origen: string | null
  destino: string | null
  estado: string | null
  solicitado_en: FechaHora | null
  terminado_en: FechaHora | null
  origen_id: number | null
  origen_nivel: number | null
  destino_id: number | null
  remitente_id: number | null
  tramitador_id: number | null
  supervisor_id: number | null
  tramitador_rk: string | null
  supervisor_rk: string | null
  estado_id: number | null
  padre_id: number | null
}

/**
 * Fila de la vista `areas` (models/db_views.py).
 * `padre` y `nivel` son los **nombres**; los ids están en `padre_id` y
 * `nivel_id`.
 */
export interface AreaVistaRow {
  id: number
  nombre: string | null
  padre: string | null
  nivel: string | null
  rol_key: string | null
  padre_id: number | null
  nivel_id: number | null
}

/**
 * Fila de la vista `adjuntos` (models/db_views.py).
 * Combina el adjunto con su upload y añade el campo virtual `file`.
 */
export interface AdjuntoVistaRow {
  id: number
  solicitud_id: number | null
  upload_id: number | null
  tipo: number | null
  upload: string | null
  filename: string | null
  filesize: number | null
  filemodified: string | null
  file: string | null
}

/**
 * Fila de la vista `vw_solicitudes_raw` (models/db_views.py).
 * Usada por el reporte crudo de solicitudes.
 */
export interface SolicitudRawRow {
  codigo: string | null
  destino_id: number | null
  origen: string | null
  objetivo: string | null
  solicitado_en: FechaHora | null
  terminado_en: FechaHora | null
  h_codigo: string | null
  h_destino: string | null
  h_objetivo: string | null
  h_solicitado_en: FechaHora | null
  h_terminado_en: FechaHora | null
  supervisor: string | null
  tramitador: string | null
}
