/**
 * Modelos de dominio del frontend: formularios (Create/Update) y detalles que
 * devuelven los controladores de web2py.
 *
 * - Las filas crudas de tablas y vistas están en `backend.ts`.
 * - Los envoltorios y parámetros del API están en `api.ts`.
 *
 * Fuente de los detalles: controladores `areas.py`, `tipos.py`, `usuarios.py`,
 * `solicitudes.py`, `notas.py` y `bitacoras.py`.
 */

import type {
  AdjuntoVistaRow,
  AreaRow,
  AuthGroupRow,
  EstadoRow,
  FechaHora,
  NivelRow,
  SolicitudVistaRow,
  TipoRow,
  VwUsuarioRow,
} from './backend'
import type { Id } from './api'

/** Permisos contextuales que añaden los detalles de área, tipo y usuario. */
export interface PermisosEliminar {
  eliminar: boolean
}

// ---------------------------------------------------------------------------
// Áreas
// ---------------------------------------------------------------------------

export interface AreaCreate {
  nombre: string
  /** Los selects de BVN trabajan con el id numérico de la fila. */
  padre: number | null
  nivel: number | null
}

export interface AreaUpdate extends AreaCreate {
  id: Id
}

/**
 * `GET /areas/areas/:id`.
 * `padre` y `nivel` se expanden a sus filas y `modified_by` se sustituye por
 * el nombre del usuario.
 */
export interface AreaDetalle
  extends Omit<AreaRow, 'padre' | 'nivel' | 'modified_by'> {
  padre: AreaRow | null
  nivel: NivelRow | null
  modified_by: string | null
  permisos: PermisosEliminar
}

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export interface TipoCreate {
  nombre: string
  descripcion: string | null
}

export interface TipoUpdate extends TipoCreate {
  id: Id
}

/**
 * `GET /tipos/tipos/:id`.
 * `uso` es un campo virtual con la cantidad de solicitudes de ese tipo y
 * `modified_by` se sustituye por el nombre del usuario.
 */
export interface TipoDetalle extends Omit<TipoRow, 'modified_by'> {
  uso: number
  modified_by: string | null
  permisos: PermisosEliminar
}

// ---------------------------------------------------------------------------
// Usuarios
// ---------------------------------------------------------------------------

export interface UsuarioCreate {
  first_name: string | null
  last_name: string | null
  username: string | null
  email: string | null
  /** Los selects de BVN trabajan con el id numérico de la fila. */
  area: number | null
  fijo: string | null
  movil: string | null
  grupos: number[]
}

export interface UsuarioUpdate extends UsuarioCreate {
  id: Id
  registration_key?: string | null
}

/**
 * `GET /usuarios/usuarios/:id`.
 * `area` se expande a su fila, `grupos` a las filas de `auth_group` y
 * `modified_by` se sustituye por el nombre del usuario.
 */
export interface UsuarioDetalle {
  id: number
  first_name: string | null
  last_name: string | null
  username: string | null
  email: string | null
  registration_key: string | null
  area: AreaRow | null
  fijo: string | null
  movil: string | null
  modified_on: FechaHora | null
  modified_by: string | null
  grupos: AuthGroupRow[]
  permisos: PermisosEliminar
}

// ---------------------------------------------------------------------------
// Solicitudes
// ---------------------------------------------------------------------------

/** Permisos contextuales de la solicitud para el usuario autenticado. */
export interface SolicitudPermisos {
  asignar: boolean
  reenviar: boolean
  responder: boolean
  aprobar: boolean
  evaluar: boolean
  comentar: boolean
}

/** Usuario tal como lo devuelve la vista `vw_usuario`. */
export type UsuarioSolicitud = VwUsuarioRow

/**
 * Fila de la vista `solicitudes` que acompaña al detalle (padre e hijos).
 * `origen`, `destino` y `estado` son los textos de la vista.
 */
export type SolicitudEsquema = Pick<
  SolicitudVistaRow,
  'id' | 'codigo' | 'origen' | 'destino' | 'estado' | 'origen_id' | 'destino_id'
>

/** Adjunto del detalle: fila de la vista `adjuntos` (incluye el upload). */
export type AdjuntoSolicitud = AdjuntoVistaRow

/** `GET /solicitudes/solicitudes/:id`. */
export interface SolicitudDetalle {
  id: number
  codigo: string | null
  objetivo: string | null
  origen: AreaRow | null
  destino: AreaRow | null
  tipo: TipoRow | null
  estado: EstadoRow | null
  remitente: UsuarioSolicitud | null
  supervisor: UsuarioSolicitud | null
  tramitador: UsuarioSolicitud | null
  padre: SolicitudEsquema | null
  hijos: SolicitudEsquema[]
  solicitado_en: FechaHora | null
  tramitador_en: FechaHora | null
  respuesta_en: FechaHora | null
  terminado_en: FechaHora | null
  cumplir_en: FechaHora | null
  observaciones: string | null
  evaluacion: number | null
  cant_nota: number
  adjuntos_solicitud: AdjuntoSolicitud[]
  adjuntos_respuesta: AdjuntoSolicitud[]
  permisos: SolicitudPermisos
}

/** `POST /solicitudes/solicitudes` (solicitud original). */
export interface SolicitudCreate {
  destino: number | null
  objetivo: string | null
  adjuntos: number[]
  tipo: number | null
  cumplir_en?: string | null
}

/** `POST /solicitudes/solicitudes` con `padre` (reenvío). */
export interface SolicitudCreateFromParent extends SolicitudCreate {
  padre: number
}

/** `PUT` con `tramitador`: asignar o reasignar. */
export interface SolicitudAsignada {
  id: Id
  tramitador?: number | null
  tipo?: number | null
}

/** `PUT` con `observaciones`: responder la solicitud. */
export interface SolicitudRespondida {
  id: Id
  observaciones: string | null
  adjuntos: number[]
}

/** `PUT` con `aprobado`: aprobar (`'1'`) o desaprobar (`'0'`). */
export interface SolicitudAprobada {
  id: Id
  aprobado: '0' | '1' | null
  nota?: string | null
}

/** `PUT` con `evaluacion`: calificar la respuesta. */
export interface SolicitudEvaluada {
  id: Id
  evaluacion: number
}

/**
 * Cuerpo de `PUT /solicitudes/solicitudes/:id`.
 * El controlador decide la acción según la clave presente.
 */
export type SolicitudUpdate =
  | SolicitudAsignada
  | SolicitudRespondida
  | SolicitudAprobada
  | SolicitudEvaluada

/** Cuerpo de la petición, sin el `id` que va en la ruta. */
export type SolicitudUpdatePayload =
  | Omit<SolicitudAsignada, 'id'>
  | Omit<SolicitudRespondida, 'id'>
  | Omit<SolicitudAprobada, 'id'>
  | Omit<SolicitudEvaluada, 'id'>

// ---------------------------------------------------------------------------
// Notas y bitácoras
// ---------------------------------------------------------------------------

/** Papel del autor de la nota, calculado en `controllers/notas.py`. */
export type NotaComo = 'tramitador' | 'supervisor' | 'remitente'

/** `GET /notas/notas`. */
export interface Nota {
  id: number
  fecha: FechaHora | null
  texto: string | null
  evento: string | null
  autor: VwUsuarioRow
  como: NotaComo
}

/** `POST /notas/notas`. */
export interface NotaCreate {
  texto: string | null
  solicitud: Id
}

/** `GET /bitacoras/bitacoras`. */
export interface BitacoraDetalle {
  id: number
  solicitud: number | null
  fecha: FechaHora | null
  accion: string | null
  por: number | null
  argumentos: string | null
  /** Autor expandido a la vista `vw_usuario`. */
  by: VwUsuarioRow | null
}

// ---------------------------------------------------------------------------
// Autenticación
// ---------------------------------------------------------------------------

export interface LoginCredentials {
  username: string
  password: string
}
