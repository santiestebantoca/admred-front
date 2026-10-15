export const PENDIENTE_STATUS = [
  { text: 'Todas', value: undefined },
  { text: 'No atendidas', value: 1 },
  { text: 'En proceso', value: 2 },
  { text: 'En evaluación', value: 3 },
]

export const PERIODOS = [
  { text: '2 semanas', value: 1 },
  { text: '1 mes', value: 2 },
  { text: '6 meses', value: 3 },
  { text: '1 año', value: 4 }
]

export const AREAS_AR = [
  { text: 'Dirección de Administración de la Red', value: 2 },
  { text: 'Departamento de Administración', value: 46 },
  { text: 'Departamento de Planificación y Provisión', value: 47 }
]

export const PENDIENTE_TERMINADA = [
  { text: 'Pendientes', value: [1, 2, 3] },
  { text: 'Terminadas', value: 4 },
]

export const CURSO_SOLICITUD = [
  { text: 'Original', value: 1 },
  { text: 'Reenviada', value: 2 }
]

export const DIRECCION_ADMINISTRACION_ID = 2

export const USOS_DEL_TIPO = [
  { value: undefined, text: '' },
  { value: '0', text: 'Sin uso' },
  { value: '2', text: 'Poco uso' },
]

export const ROLES_DEL_USUARIO = [
  { value: undefined, text: '' },
  { value: '1', text: 'Admnistrador' },
  { value: '2', text: 'Supervisor' },
]

export const ESTADOS_DEL_USUARIO = [
  { value: undefined, text: '' },
  { value: 'blocked', text: 'Bloqueado' },
]

export const EMAIL_PATRON = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export const TELEFONO_PATRON = /^[1-9][0-9]{7}$/

export const REGISTRATION_KEY_OPTIONS = [
  { value: '', text: 'Normal' },
  { value: 'blocked', text: 'Bloqueado' },
]