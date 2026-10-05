// Tipos
export interface TipoUpdate {
  id: number | string,
  nombre: string,
  descripcion: string,
}

// Usuarios
export interface UsuarioCreate {
  first_name: string
  last_name: string
  username: string
}

export interface UsuarioUpdate extends UsuarioCreate {
  id: number | string
  registration_key?: string
}

// Solicitudes
interface UsuarioSolicitud {
  id: number,
  name: string,
  username: string,
  email: string | null,
  fijo: string | null,
  movil: string | null,
  registration_key: string | null
}

interface SolicitudEsquema {
  id: number,
  codigo: string,
  origen: string,
  destino: string,
  estado: string,
  origen_id: number,
  destino_id: number,
}

interface AdjuntoSolicitud {
  id: number,
  solicitud_id: number,
  upload_id: number,
  tipo: number
}

export interface SolicitudDetalle {
  id: number,
  codigo: string,
  objetivo: string,
  origen: {
    id: number,
    nombre: string
  },
  destino: {
    id: number,
    nombre: string
  },
  tipo: {
    id: number,
    nombre: string
  },
  estado: {
    id: number,
    nombre: string
  },
  remitente: UsuarioSolicitud,
  supervisor: UsuarioSolicitud | null,
  tramitador: UsuarioSolicitud | null,
  padre: SolicitudEsquema | null,
  hijos: SolicitudEsquema[],
  solicitado_en: string,
  tramitador_en: string | null,
  respuesta_en: string | null,
  terminado_en: string | null,
  cumplir_en: string | null,
  observaciones: string | null,
  evaluacion: number | null,
  cant_nota: number,
  adjuntos_solicitud: AdjuntoSolicitud[],
  adjuntos_respuesta: AdjuntoSolicitud[],
  permisos: {
    asignar: boolean,
    reenviar: boolean,
    responder: boolean,
    aprobar: boolean,
    evaluar: boolean,
    comentar: boolean,
  }
}

export interface SolicitudCreate {
  destino: number,
  objetivo: string,
  adjuntos: number[],
  tipo: number,
  cumplir_en?: string
}

export interface SolicitudCreateFromParent {
  padre: number,
  destino: number,
  objetivo: string,
  adjuntos: number[],
  tipo: number,
  cumplir_en?: string
}

export interface SolicitudUpdate {
  id: number | string,
  tipo?: number,
  cumplir_en?: string,
  tramitador?: number
}

export interface SolicitudRespondida {
  observaciones: string,
  adjuntos: number[],
}

export interface SolicitudAprobada {
  aprobado: string,
  nota?: string,
}

export interface SolicitudEvaluada {
  evaluacion: number,
}

// Notas
export interface Nota {
  id: number,
  fecha: string,
  autor: {
    name: string,
  },
  como: string,
  texto: string,
  evento: string | null,
}

export interface NotaCreate {
  texto: string,
  solicitud: number
}

// Grupos
// export interface GrupoCreate {
//   nombre: string
//   apodo?: string
//   label?: string
//   descripcion?: string
//   pertenece?: number | string
// }

// export interface GrupoUpdate extends GrupoCreate {
//   id: number | string
// }

// Mensajes
// export interface MensajePayload {
//   destinatarios: (number | string)[]
//   texto: string
//   continua: boolean
//   previo?: number | string
// }

// Plantillas
// export interface PlantillaPayload {
//   texto: string
// }

// export interface PlantillaUpdate extends PlantillaPayload {
//   id: number | string
// }

// Suscriptores
// export interface SuscriptorCreate {
//   nombre: string
//   cargo?: string
//   telefono?: string
//   correo?: string
//   grupo?: number | string
//   activo?: boolean
//   suplente?: number | string
// }

// export interface SuscriptorUpdate extends Partial<SuscriptorCreate> {
//   id: number | string
// }

// // Notificados
// export interface NotificadosUpdate {
//   id: number | string
//   grupo_b?: (number | string)[]
// }

// Autenticación
export interface LoginCredentials {
  username: string
  password: string
}