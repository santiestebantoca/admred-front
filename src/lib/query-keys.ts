export const queryKeys = {
  auth: {
    root: ['auth'],
    user: () => [...queryKeys.auth.root, 'user']
  },
  authGroups: {
    root: ['authGroups'],
    listas: () => [...queryKeys.authGroups.root, 'lista'],
  },
  authMembership: {
    root: ['authMembership'],
    listas: () => [...queryKeys.authMembership.root, 'lista'],
    lista: (filtros) => [...queryKeys.authMembership.listas(), { ...filtros }],
  },
  grupos: {
    root: ['grupos'],
    listas: () => [...queryKeys.grupos.root, 'lista'],
    lista: (filtros) => [...queryKeys.grupos.listas(), { ...filtros }],
    detalles: () => [...queryKeys.grupos.root, 'detalle'],
    detalle: (id) => [...queryKeys.grupos.detalles(), id],
  },
  notificados: {
    root: ['notificados'],
    listas: () => [...queryKeys.notificados.root, 'lista'],
    lista: (filtros) => [...queryKeys.notificados.listas(), { ...filtros }],
    detalles: () => [...queryKeys.notificados.root, 'detalle'],
    detalle: (id) => [...queryKeys.notificados.detalles(), id],
  },
  suscriptores: {
    root: ['suscriptores'],
    listas: () => [...queryKeys.suscriptores.root, 'lista'],
    lista: (filtros) => [...queryKeys.suscriptores.listas(), { ...filtros }],
    detalles: () => [...queryKeys.suscriptores.root, 'detalle'],
    detalle: (id) => [...queryKeys.suscriptores.detalles(), id],
  },
  plantillas: {
    root: ['plantillas'],
    listas: () => [...queryKeys.plantillas.root, 'lista'],
    lista: (filtros) => [...queryKeys.plantillas.listas(), { ...filtros }],
    detalles: () => [...queryKeys.plantillas.root, 'detalle'],
    detalle: (id) => [...queryKeys.plantillas.detalles(), id],
  },
  mensajes: {
    root: ['mensajes'],
    listas: () => [...queryKeys.mensajes.root, 'lista'],
    lista: (filtros) => [...queryKeys.mensajes.listas(), { ...filtros }],
    detalles: () => [...queryKeys.mensajes.root, 'detalle'],
    detalle: (id) => [...queryKeys.mensajes.detalles(), id],
  },
  envios: {
    root: ['envios'],
    listas: () => [...queryKeys.envios.root, 'lista'],
    lista: (filtros) => [...queryKeys.envios.listas(), { ...filtros }],
  },
  usuarios: {
    root: ['usuarios'],
    listas: () => [...queryKeys.usuarios.root, 'lista'],
    lista: (filtros) => [...queryKeys.usuarios.listas(), { ...filtros }],
    detalles: () => [...queryKeys.usuarios.root, 'detalle'],
    detalle: (id) => [...queryKeys.usuarios.detalles(), id],
  },
  notificaciones: {
    root: ['notificaciones'],
    listas: () => [...queryKeys.notificaciones.root, 'lista'],
  }
}