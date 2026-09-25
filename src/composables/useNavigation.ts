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
        // {
        //   label: 'Solicitudes externas',
        //   to: { name: 'reportes-externas' },
        //   icon: 'bi-box-arrow-in-right'
        // },
        // {
        //   label: 'Solicitudes internas',
        //   to: { name: 'reportes-internas' },
        //   icon: 'bi-arrow-right-square'
        // },
        // {
        //   label: 'Áreas consultadas',
        //   to: { name: 'reportes-consultadas' },
        //   icon: 'bi-shuffle'
        // },
        {
          label: 'Buscar código',
          to: { name: 'reportes-buscar' },
          icon: 'bi-search'
        },
        {
          label: 'Solicitudes',
          to: { name: 'reportes-solicitudes' },
          icon: 'bi-play-circle'
        }
      ] : []
    ]
  })

  return { options }
}

export function useNavigationConfigurar() {
  // const { authUser } = useAuthQuery()
  // const options = computed(() => [
  //   {
  //     to: { name: 'configurar-grupos' },
  //     icon: 'bi-subtract',
  //     label: 'Grupos',
  //     name: 'grupos',
  //     id: 'nav-options-configurar-grupos'
  //   },
  //   {
  //     to: { name: 'configurar-suscriptores' },
  //     icon: 'bi-people-fill',
  //     label: 'Suscriptores',
  //     name: 'suscriptores',
  //     id: 'nav-options-configurar-suscriptores'
  //   },
  //   {
  //     to: { name: 'configurar-plantillas' },
  //     icon: 'bi-card-text',
  //     label: 'Plantillas',
  //     name: 'plantillas',
  //     id: 'nav-options-configurar-plantillas'
  //   },
  //   ...authUser.value?.admin ? [{
  //     to: { name: 'configurar-usuarios' },
  //     icon: 'bi-person-workspace',
  //     label: 'Usuarios',
  //     name: 'users',
  //     id: 'nav-options-configurar-usuarios'
  //   }] : [],
  // ])

  // return { options }
}