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
  tramitadores: {
    root: ['tramitadores'],
    listas: () => [...queryKeys.tramitadores.root, 'lista'],
    lista: (filtros) => [...queryKeys.tramitadores.listas(), { ...filtros }],
  },
  bitacoras: {
    root: ['bitacoras'],
    listas: () => [...queryKeys.bitacoras.root, 'lista'],
    lista: (filtros) => [...queryKeys.bitacoras.listas(), { ...filtros }],
  },
  notas: {
    root: ['notas'],
    listas: () => [...queryKeys.notas.root, 'lista'],
    lista: (filtros) => [...queryKeys.notas.listas(), { ...filtros }],
  },
  reportes: {
    pendientes: {
      root: ['reportes', 'pendientes'],
      listas: () => [...queryKeys.reportes.pendientes.root, 'lista'],
    },
    personas: {
      root: ['reportes', 'personas'],
      listas: () => [...queryKeys.reportes.personas.root, 'lista'],
      lista: (filtros) => [...queryKeys.reportes.personas.listas(), { ...filtros }],
    },
    codigos: {
      root: ['reportes', 'codigos'],
      listas: () => [...queryKeys.reportes.codigos.root, 'lista'],
      lista: (filtros) => [...queryKeys.reportes.codigos.listas(), { ...filtros }],
    },
    solicitudes: {
      root: ['reportes', 'solicitudes'],
      listas: () => [...queryKeys.reportes.solicitudes.root, 'lista'],
      lista: (filtros) => [...queryKeys.reportes.solicitudes.listas(), { ...filtros }],
    }
  },
}