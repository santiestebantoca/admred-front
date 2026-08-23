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
    { label: 'Solicitudes', to: '/solicitudes', icon: 'bi-inboxes' },
    { label: 'Reportes', to: '/reportes', icon: 'bi-graph-up' },
    ...authUser.value?.admin
      ? [{ label: 'Administración', to: '/admin', icon: 'bi-gear' }]
      : [],
  ])

  return { options }
}

export function useNavigationMensaje() {
  // const { notificaciones } = useNotificacionesQuery()
  // const options = computed(() => [
  //   {
  //     to: { name: 'sms-componer' },
  //     icon: 'bi-envelope-plus',
  //     label: 'Componer',
  //     name: 'componer',
  //     id: 'nav-options-componer-sms-componer'
  //   },
  //   {
  //     to: { name: 'sms-coleccion' },
  //     icon: 'bi-collection',
  //     label: 'Colección',
  //     name: 'coleccion',
  //     id: 'nav-options-componer-sms-coleccion',
  //     count: notificaciones.value?.pendientes
  //   },
  // ])

  // return { options }
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