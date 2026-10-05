import { useAuthQuery } from '@/stores/auth'
import { useNotificacionesQuery } from '@/stores/notificaciones'
import { computed } from 'vue'

export function useNavigationSolicitudes() {
  const { notificaciones } = useNotificacionesQuery()
  const options = computed(() => [
    {
      id: 'nav-solicitudes-recibidas',
      label: 'Recibidas',
      open: true,
      groupTitle: true,
      children: [
        {
          id: 'nav-solicitudes-recibidas-pendientes',
          label: 'Pendientes',
          icon: 'bi-folder',
          count: notificaciones.value?.pendientes.recibidas.total,
          to: { params: { tray: 'recibidas', state: 'pendientes' } }
        },
        {
          id: 'nav-solicitudes-recibidas-terminadas',
          label: 'Terminadas',
          icon: 'bi-folder',
          to: { params: { tray: 'recibidas', state: 'terminadas' } }
        }
      ]
    },
    {
      id: 'nav-solicitudes-enviadas',
      label: 'Enviadas',
      open: true,
      groupTitle: true,
      children: [
        {
          id: 'nav-solicitudes-enviadas-pendientes',
          label: 'Pendientes',
          icon: 'bi-folder',
          count: notificaciones.value?.pendientes.enviadas.total,
          to: { params: { tray: 'enviadas', state: 'pendientes' } }
        },
        {
          id: 'nav-solicitudes-enviadas-terminadas',
          label: 'Terminadas',
          icon: 'bi-folder',
          to: { params: { tray: 'enviadas', state: 'terminadas' } }
        }
      ]
    }
  ])

  return { options }
}

export function useNavigationApps() {
  const { authUser } = useAuthQuery()
  const options = computed(() => [
    { label: 'Solicitudes', to: '/solicitudes', icon: 'bi-folder-check' },
    { label: 'Reportes', to: '/reportes', icon: 'bi-graph-up' },
    ...authUser.value?.admin
      ? [{ label: 'Administración', to: '/admin', icon: 'bi-gear' }]
      : [],
  ])

  return { options }
}

export function useNavigationReportes() {
  const { authUser } = useAuthQuery()
  const options = computed(() => {
    return [
      {
        label: 'Mis pendientes',
        to: { name: 'reportes-pendientes' },
        icon: 'bi-exclamation-diamond'
      },
      {
        label: 'Desempeño personal',
        to: { name: 'reportes-personas' },
        icon: 'bi-people'
      },
      ...authUser.value?.AR ? [
        {
          label: 'Solicitudes a la VPOR',
          to: { name: 'reportes-externas' },
          icon: 'bi-box-arrow-in-right'
        },
        {
          label: 'Solicitudes de la VPOR',
          to: { name: 'reportes-internas' },
          icon: 'bi-arrow-right-square'
        },
        {
          label: 'Áreas consultadas',
          to: { name: 'reportes-consultadas' },
          icon: 'bi-shuffle'
        },
        {
          label: 'Buscar código',
          to: { name: 'reportes-buscar' },
          icon: 'bi-search'
        },
        {
          label: 'Solicitudes en bruto',
          to: { name: 'reportes-solicitudes' },
          icon: 'bi-play-circle'
        }
      ] : []
    ]
  })

  return { options }
}

export function useNavigationAdmin() {
  const { authUser } = useAuthQuery()
  const AR = authUser.value?.AR
  const options = computed(() => [
    {
      to: { name: 'admin-usuarios' },
      icon: 'bi-people',
      label: 'Usuarios',
    },
    ...AR ? [
      {
        label: 'Áreas',
        to: { name: 'admin-areas' },
        icon: 'bi-diagram-2'
      },
      {
        label: 'Tipos de solicitud',
        to: { name: 'admin-tipos' },
        icon: 'bi-tag'
      }] : []
  ])

  return { options }
}

/*
export default function useNavOptions() {
  const { authUser } = useAuthQuery()
  const AR = authUser.value?.AR
  const options = computed(() => {
    return [
      ...AR ? [
        {
          label: 'Áreas',
          to: { name: 'admin-areas' },
          icon: 'puzzle'
        },
        {
          label: 'Tipos de solicitud',
          to: { name: 'admin-tipos' },
          icon: 'tag'
        }] : []
    ]
  })
  return { options }
}
*/