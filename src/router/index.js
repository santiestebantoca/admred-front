import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthQuery, useLogout } from '@/stores/auth'
import { until } from '@vueuse/core'
import { useStorage } from '@vueuse/core'

const folderDefault = () => {
  const folders = [
    'recibidas/pendientes',
    'recibidas/terminadas',
    'enviadas/pendientes',
    'enviadas/terminadas'
  ]
  const folder = useStorage('admred_router_folder', 'enviadas/pendientes')
  return folders.includes(folder.value)
    ? `/solicitudes/${folder.value}`
    : '/solicitudes/enviadas/pendientes'
}

const rutasSolicitud = (rutaBase, rutaPadre, prefijo) => {
  return {
    path: prefijo ? prefijo + '/:solicitudId' : ':solicitudId',
    name: rutaBase,
    component: () => import('@/views/solicitudes/[id]/index.vue'),
    props: route => ({
      solicitudId: parseInt(route.params.solicitudId),
      linkSolicitud: (solicitudId) => ({ params: { solicitudId } }),
      setSolicitudId: (solicitudId) => router.push({ params: { solicitudId } }),
      back: () => router.push({ name: rutaPadre }),
      rutaBase
    }),
    children: [
      {
        path: 'asignar',
        name: rutaBase + '-asignar',
        component: () => import('@/views/solicitudes/[id]/asignar.vue'),
        props: route => ({
          solicitudId: parseInt(route.params.solicitudId),
          back: () => router.push({ name: rutaBase })
        })
      },
      {
        path: 'reenviar',
        name: rutaBase + '-reenviar',
        component: () => import('@/views/solicitudes/[id]/reenviar.vue'),
        props: route => ({
          solicitudId: parseInt(route.params.solicitudId),
          back: () => router.push({ name: rutaBase })
        })
      },
      {
        path: 'responder',
        name: rutaBase + '-responder',
        component: () => import('@/views/solicitudes/[id]/responder.vue'),
        props: route => ({
          solicitudId: parseInt(route.params.solicitudId),
          back: () => router.push({ name: rutaBase })
        })
      },
      {
        path: 'aprobar',
        name: rutaBase + '-aprobar',
        component: () => import('@/views/solicitudes/[id]/aprobar.vue'),
        props: route => ({
          solicitudId: parseInt(route.params.solicitudId),
          back: () => router.push({ name: rutaBase })
        })
      },
      {
        path: 'evaluar',
        name: rutaBase + '-evaluar',
        component: () => import('@/views/solicitudes/[id]/evaluar.vue'),
        props: route => ({
          solicitudId: parseInt(route.params.solicitudId),
          back: () => router.push({ name: rutaBase })
        })
      },
      {
        path: 'registro',
        name: rutaBase + '-registro',
        component: () => import('@/views/solicitudes/[id]/registro.vue'),
        props: route => ({
          solicitudId: parseInt(route.params.solicitudId),
          back: () => router.push({ name: rutaBase })
        })
      },
      {
        path: 'notas',
        name: rutaBase + '-notas',
        component: () => import('@/views/solicitudes/[id]/notas.vue'),
        props: route => ({
          solicitudId: parseInt(route.params.solicitudId),
          back: () => router.push({ name: rutaBase })
        })
      }
    ]
  }
}

const routesAuth = [
  {
    path: '/auth',
    name: 'auth',
    component: () => import('../views/auth/index.vue'),
    children: [
      {
        path: 'login',
        name: 'auth-login',
        component: () => import('@/views/auth/login.vue'),
        meta: { logout: true },
        props: route => ({
          next: () => router.push(route.query.next || '/home')
        })
      },
      {
        path: 'impersonate',
        name: 'auth-impersonate',
        component: () => import('@/views/auth/impersonate.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'logout',
        name: 'auth-logout',
        component: () => import('@/views/auth/logout.vue'),
        meta: { logout: true }
      },
      {
        path: 'expired',
        name: 'auth-expired',
        component: () => import('@/views/auth/expired.vue'),
        meta: { logout: true },
        beforeEnter: (to, from) => replaceQuery(to, 'next', from ? from.fullPath : '/'),
        props: route => ({
          next: () => router.push(route.query.next)
        }),
      }
    ]
  }
]

const routesSolicitudes = [
  {
    path: '/solicitudes',
    redirect: folderDefault,
    children: [
      {
        path: ':tray/:state',
        name: 'solicitudes',
        component: () => import('@/views/solicitudes/index.vue'),
        meta: { requiresAuth: true, saveFolder: true },
        props: route => ({
          tray: route.params.tray,
          state: route.params.state,
          linkCrear: { name: 'solicitudes-crear' },
          solicitudId: route.params.solicitudId ? parseInt(route.params.solicitudId) : undefined,
          linkSolicitud: (solicitudId) => ({
            name: 'solicitudes-solicitud',
            params: { solicitudId }
          }),
          setSolicitudId: (solicitudId) => solicitudId && router.push({
            name: 'solicitudes-solicitud',
            params: { solicitudId }
          }),
        }),
        children: [
          {
            path: 'crear',
            name: 'solicitudes-crear',
            component: () => import('@/views/solicitudes/crear.vue'),
            props: () => ({
              back: () => router.push({ name: 'solicitudes' })
            })
          },
          rutasSolicitud('solicitudes-solicitud', 'solicitudes')
        ]
      }
    ]
  }
]

const routesReportes = [
  {
    path: '/reportes',
    name: 'reportes',
    component: () => import('../views/reportes/index.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'reportes-home',
        component: () => import('@/views/reportes/home.vue'),
      },
      {
        path: 'pendientes',
        name: 'reportes-pendientes',
        component: () => import('@/views/reportes/pendientes/index.vue'),
        props: (route) => ({
          // solicitudId: route.params.solicitudId ? parseInt(route.params.solicitudId) : undefined,
          linkSolicitud: (solicitudId) => ({
            name: 'reportes-pendientes-solicitud',
            params: { solicitudId }
          }),
        }),
        children: [
          rutasSolicitud('reportes-pendientes-solicitud', 'reportes-pendientes')
        ]
      },
      {
        path: 'personas',
        name: 'reportes-personas',
        component: () => import('@/views/reportes/personas/index.vue'),
        props: (route) => ({
          personaId: route.params.personaId && parseInt(route.params.personaId),
          setPersonaId: (personaId) => router.push({ name: 'reportes-persona', params: { personaId } }),
        }),
        children: [
          {
            path: ':personaId',
            name: 'reportes-persona',
            component: () => import('@/views/reportes/personas/[id]/index.vue'),
            props: (route) => ({
              personaId: route.params.personaId && parseInt(route.params.personaId),
              back: () => router.push({ name: 'reportes-personas' }),
              // solicitudId: route.params.solicitudId ? parseInt(route.params.solicitudId) : undefined,
              linkSolicitud: (solicitudId) => ({
                name: 'reportes-persona-solicitud',
                params: { solicitudId }
              }),
            }),
            children: [
              rutasSolicitud('reportes-persona-solicitud', 'reportes-persona', 'solicitudes')
            ]
          }
        ]
      },
      {
        path: 'externas',
        name: 'reportes-externas',
        component: () => import('@/views/reportes/externas/index.vue'),
        props: (route) => ({
          // solicitudId: route.params.solicitudId ? parseInt(route.params.solicitudId) : undefined,
          linkSolicitud: (solicitudId) => ({
            name: 'reportes-externas-solicitud',
            params: { solicitudId }
          }),
        }),
        children: [
          rutasSolicitud('reportes-externas-solicitud', 'reportes-externas')
        ]
      },
      {
        path: 'internas',
        name: 'reportes-internas',
        component: () => import('@/views/reportes/internas/index.vue'),
        props: (route) => ({
          // solicitudId: route.params.solicitudId ? parseInt(route.params.solicitudId) : undefined,
          linkSolicitud: (solicitudId) => ({
            name: 'reportes-internas-solicitud',
            params: { solicitudId }
          }),
        }),
        children: [
          rutasSolicitud('reportes-internas-solicitud', 'reportes-internas')
        ]
      },
      {
        path: 'consultadas',
        name: 'reportes-consultadas',
        component: () => import('@/views/reportes/consultadas/index.vue'),
      },
      {
        path: 'buscar',
        name: 'reportes-buscar',
        component: () => import('@/views/reportes/buscar/index.vue'),
        props: (route) => ({
          // solicitudId: route.params.solicitudId ? parseInt(route.params.solicitudId) : undefined,
          linkSolicitud: (solicitudId) => ({
            name: 'reportes-buscar-solicitud',
            params: { solicitudId }
          }),
        }),
        children: [
          rutasSolicitud('reportes-buscar-solicitud', 'reportes-buscar')
        ]
      },
      {
        path: 'solicitudes',
        name: 'reportes-solicitudes',
        component: () => import('@/views/reportes/solicitudes/index.vue'),
      }
    ]
  }
]

const routesAdmin = [
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/views/admin/index.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'admin-home',
        component: () => import('@/views/admin/home.vue')
      },
      {
        path: 'usuarios',
        name: 'admin-usuarios',
        component: () => import('@/views/admin/usuarios/index.vue'),
        props: (route) => ({
          showLista: route.name === 'admin-usuarios',
          linkCrear: { name: 'admin-usuarios-crear' },
          setUsuarioId: (usuarioId) => usuarioId && router.push({
            name: 'admin-usuario',
            params: { usuarioId }
          }),
        }),
        children: [
          {
            path: 'crear',
            name: 'admin-usuarios-crear',
            component: () => import('@/views/admin/usuarios/crear.vue'),
            props: () => ({
              back: () => router.push({ name: 'admin-usuarios' })
            })
          },
          {
            path: ':usuarioId',
            name: 'admin-usuario',
            component: () => import('@/views/admin/usuarios/[id]/index.vue'),
            props: route => ({
              showDetalle: route.name === 'admin-usuario',
              usuarioId: parseInt(route.params.usuarioId),
              back: { name: 'admin-usuarios' },
              editar: { name: 'admin-usuario-editar' },
              eliminar: { name: 'admin-usuario-eliminar' },
            }),
            children: [
              {
                path: 'editar',
                name: 'admin-usuario-editar',
                component: () => import('@/views/admin/usuarios/[id]/editar.vue'),
                props: (route) => ({
                  usuarioId: parseInt(route.params.usuarioId),
                  back: () => router.push({ name: 'admin-usuario' }),
                })
              },
              {
                path: 'membresia',
                name: 'admin-usuario-membresia',
                component: () => import('@/views/admin/usuarios/[id]/membresia.vue'),
                props: (route) => ({
                  usuarioId: parseInt(route.params.usuarioId),
                  back: () => router.push({ name: 'admin-usuario' }),
                })
              },
              {
                path: 'eliminar',
                name: 'admin-usuario-eliminar',
                component: () => import('@/views/admin/usuarios/[id]/eliminar.vue'),
                props: (route) => ({
                  usuarioId: parseInt(route.params.usuarioId),
                  back: () => router.push({ name: 'admin-usuario' }),
                  backLista: () => router.push({ name: 'admin-usuarios' }),
                })
              },
            ]
          },
        ]
      },
      {
        path: 'areas',
        name: 'admin-areas',
        component: () => import('@/views/admin/areas/index.vue'),
        props: (route) => ({
          showLista: route.name === 'admin-areas',
          linkCrear: { name: 'admin-areas-crear' },
          setAreaId: (areaId) => areaId && router.push({
            name: 'admin-area',
            params: { areaId }
          }),
        }),
        children: [
          {
            path: 'crear',
            name: 'admin-areas-crear',
            component: () => import('@/views/admin/areas/crear.vue'),
            props: () => ({
              back: () => router.push({ name: 'admin-areas' })
            })
          },
          {
            path: ':areaId',
            name: 'admin-area',
            component: () => import('@/views/admin/areas/[id]/index.vue'),
            props: route => ({
              showDetalle: route.name === 'admin-area',
              areaId: parseInt(route.params.areaId),
              back: { name: 'admin-areas' },
              editar: { name: 'admin-area-editar' },
              eliminar: { name: 'admin-area-eliminar' },
            }),
            children: [
              {
                path: 'editar',
                name: 'admin-area-editar',
                component: () => import('@/views/admin/areas/[id]/editar.vue'),
                props: (route) => ({
                  areaId: parseInt(route.params.areaId),
                  back: () => router.push({ name: 'admin-area' }),
                })
              },
              {
                path: 'eliminar',
                name: 'admin-area-eliminar',
                component: () => import('@/views/admin/areas/[id]/eliminar.vue'),
                props: (route) => ({
                  areaId: parseInt(route.params.areaId),
                  back: () => router.push({ name: 'admin-area' }),
                  backLista: () => router.push({ name: 'admin-areas' }),
                })
              },
            ]
          },
        ]
      },
      {
        path: 'tipos',
        name: 'admin-tipos',
        component: () => import('@/views/admin/tipos/index.vue'),
        props: (route) => ({
          showLista: route.name === 'admin-tipos',
          linkCrear: { name: 'admin-tipos-crear' },
          setTipoId: (tipoId) => tipoId && router.push({
            name: 'admin-tipo',
            params: { tipoId }
          }),
        }),
        children: [
          {
            path: 'crear',
            name: 'admin-tipos-crear',
            component: () => import('@/views/admin/tipos/crear.vue'),
            props: () => ({
              back: () => router.push({ name: 'admin-tipos' })
            })
          },
          {
            path: ':tipoId',
            name: 'admin-tipo',
            component: () => import('@/views/admin/tipos/[id]/index.vue'),
            props: route => ({
              showDetalle: route.name === 'admin-tipo',
              tipoId: parseInt(route.params.tipoId),
              back: { name: 'admin-tipos' },
              editar: { name: 'admin-tipo-editar' },
              eliminar: { name: 'admin-tipo-eliminar' },
            }),
            children: [
              {
                path: 'editar',
                name: 'admin-tipo-editar',
                component: () => import('@/views/admin/tipos/[id]/editar.vue'),
                props: (route) => ({
                  tipoId: parseInt(route.params.tipoId),
                  back: () => router.push({ name: 'admin-tipo' }),
                })
              },
              {
                path: 'eliminar',
                name: 'admin-tipo-eliminar',
                component: () => import('@/views/admin/tipos/[id]/eliminar.vue'),
                props: (route) => ({
                  tipoId: parseInt(route.params.tipoId),
                  back: () => router.push({ name: 'admin-tipo' }),
                  backLista: () => router.push({ name: 'admin-tipos' }),
                })
              },
            ]
          },
        ]
      },
    ]
  }
]

// const routesApp = [
//   {
//     path: '/index',
//     name: 'index',
//     component: () => import('@/views/app/index.vue'),
//     meta: { requiresAuth: true },
//     children: [
//       {
//         path: '',
//         name: 'app-home',
//         component: () => import('@/views/app/home.vue')
//       }
//     ]
//   },
// ]

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    ...routesAuth,
    ...routesSolicitudes,
    ...routesReportes,
    ...routesAdmin,
    // ...routesApp,
    {
      path: '/home',
      name: 'home',
      alias: ['/'],
      redirect: '/solicitudes' // landing page
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/not_found.vue')
    }
  ]
})

router.afterEach((to) => {
  const { authUser } = useAuthQuery()
  const { mutate: logout } = useLogout()
  if (to.matched.some((record) => record.meta.logout) && authUser.value)
    logout()
  if (to.matched.some((record) => record.meta.saveFolder)) {
    const folder = useStorage('admred_router_folder')
    folder.value = `${to.params.tray}/${to.params.state}`
  }
})

router.beforeEach(async (to, from) => {
  const { authUser, isPending } = useAuthQuery()
  if (to.matched.some(record => record.meta.requiresAuth)) {
    await until(isPending).toBe(false) // browser initial navigation
    if (!authUser.value) return { name: 'auth-login', query: { next: to.fullPath } }
  }
})

const replaceQuery = (to, query, value) => {
  if (!to.query[query]) return { path: to.path, query: { ...to.query, [query]: value } }
}
