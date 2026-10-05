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
          icon: 'lucide-folder',
          count: notificaciones.value?.pendientes.recibidas.total,
          to: { params: { tray: 'recibidas', state: 'pendientes' } }
        },
        {
          id: 'nav-solicitudes-recibidas-terminadas',
          label: 'Terminadas',
          icon: 'lucide-folder',
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
          icon: 'lucide-folder',
          count: notificaciones.value?.pendientes.enviadas.total,
          to: { params: { tray: 'enviadas', state: 'pendientes' } }
        },
        {
          id: 'nav-solicitudes-enviadas-terminadas',
          label: 'Terminadas',
          icon: 'lucide-folder',
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
    {
      label: 'Solicitudes',
      to: '/solicitudes',
      icon: 'lucide-folder'
    },
    {
      label: 'Reportes',
      to: '/reportes',
      icon: 'lucide-chart-line'
    },
    ...authUser.value?.admin
      ? [{
        label: 'Administración',
        to: '/admin',
        icon: 'lucide-settings'
      }]
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
        icon: 'lucide-octagon-alert'
      },
      {
        label: 'Desempeño personal',
        to: { name: 'reportes-personas' },
        icon: 'lucide-users'
      },
      ...authUser.value?.AR ? [
        {
          label: 'Solicitudes a la VPOR',
          to: { name: 'reportes-externas' },
          icon: 'lucide-square-arrow-right-enter'
        },
        {
          label: 'Solicitudes de la VPOR',
          to: { name: 'reportes-internas' },
          icon: 'lucide-square-arrow-right'
        },
        {
          label: 'Áreas consultadas',
          to: { name: 'reportes-consultadas' },
          icon: 'lucide-shuffle'
        },
        {
          label: 'Buscar código',
          to: { name: 'reportes-buscar' },
          icon: 'lucide-search'
        },
        {
          label: 'Solicitudes en bruto',
          to: { name: 'reportes-solicitudes' },
          icon: 'lucide-database'
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
      label: 'Usuarios',
      to: { name: 'admin-usuarios' },
      icon: 'lucide-users',
    },
    ...AR ? [
      {
        label: 'Áreas',
        to: { name: 'admin-areas' },
        icon: 'lucide-land-plot'
      },
      {
        label: 'Tipos de solicitud',
        to: { name: 'admin-tipos' },
        icon: 'lucide-tag'
      }] : []
  ])

  return { options }
}