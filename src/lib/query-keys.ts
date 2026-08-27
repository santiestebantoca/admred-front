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
  notificaciones: {
    root: ['notificaciones'],
    listas: () => [...queryKeys.notificaciones.root, 'lista'],
  },
  solicitudes: {
    root: ['solicitudes'],
    listas: () => [...queryKeys.solicitudes.root, 'lista'],
    lista: (filtros) => [...queryKeys.solicitudes.listas(), { ...filtros }],
    detalles: () => [...queryKeys.solicitudes.root, 'detalle'],
    detalle: (id) => [...queryKeys.solicitudes.detalles(), id],
  },
  destinos: {
    root: ['destinos'],
    listas: () => [...queryKeys.destinos.root, 'lista'],
  },
  usuarios: {
    root: ['usuarios'],
    listas: () => [...queryKeys.usuarios.root, 'lista'],
    lista: (filtros) => [...queryKeys.usuarios.listas(), { ...filtros }],
    detalles: () => [...queryKeys.usuarios.root, 'detalle'],
    detalle: (id) => [...queryKeys.usuarios.detalles(), id],
  },
  tipos: {
    root: ['tipos'],
    listas: () => [...queryKeys.tipos.root, 'lista'],
    lista: (filtros) => [...queryKeys.tipos.listas(), { ...filtros }],
  },
}