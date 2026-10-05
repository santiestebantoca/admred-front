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
        // component: () => import('@/views/admin/usuarios/index.vue'),
        // children: [
        //   {
        //     path: '',
        //     name: 'admin-users',
        //     component: () => import('@/views/admin/user/users/AdminUsers.vue'),
        //     props: route => ({
        //       grid: route.name === 'admin-users',
        //       newItem: () => router.push({ name: 'admin-users-new', params: {} }),
        //       linkItem: id => router.push({ name: 'admin-user-details', params: { id } }),
        //     }),
        //     children: [
        //       {
        //         path: ':id',
        //         name: 'admin-user',
        //         component: () => import('@/views/admin/user/user/AdminUser.vue'),
        //         props: route => ({ id: parseInt(route.params.id) }),
        //         children: [
        //           {
        //             path: '',
        //             name: 'admin-user-details',
        //             component: () => import('@/views/admin/user/user/details/UserDetails.vue'),
        //             props: () => ({
        //               back: () => router.push({ name: 'admin-users' }),
        //             }),
        //             children: [
        //               {
        //                 path: 'del',
        //                 name: 'admin-user-del',
        //                 component: () => import('@/views/admin/user/user/del/UserDel.vue'),
        //                 props: () => ({
        //                   back: () => router.push({ name: 'admin-users' }),
        //                   cancel: () => router.push({ name: 'admin-user-details' }),
        //                   block: () => router.push({ name: 'admin-user-block' }),
        //                 })
        //               },
        //               {
        //                 path: 'block',
        //                 name: 'admin-user-block',
        //                 component: () => import('@/views/admin/user/user/block/UserBlock.vue'),
        //                 props: () => ({
        //                   back: () => router.push({ name: 'admin-user-details' }),
        //                 })
        //               },
        //             ]
        //           },
        //           {
        //             path: 'edit',
        //             name: 'admin-user-edit',
        //             component: () => import('@/views/admin/user/user/edit/UserEditForm.vue'),
        //             props: route => ({
        //               id: parseInt(route.params.id),
        //               back: () => router.push({ name: 'admin-user-details' }),
        //             })
        //           },
        //           {
        //             path: 'membership',
        //             name: 'admin-user-membership',
        //             component: () => import('@/views/admin/user/user/membership/UserMembershipForm.vue'),
        //             props: route => ({
        //               id: parseInt(route.params.id),
        //               back: () => router.push({ name: 'admin-user-details' }),
        //             })
        //           },
        //           {
        //             path: 'meta',
        //             name: 'admin-user-meta',
        //             component: () => import('@/views/admin/user/user/meta/UserMeta.vue'),
        //             props: () => ({ back: () => router.push({ name: 'admin-user-details' }), })
        //           }
        //         ]
        //       }
        //     ]
        //   },
        //   {
        //     path: 'new',
        //     name: 'admin-users-new',
        //     component: () => import('@/views/admin/user/new/UserNewWizard.vue'),
        //     props: () => ({
        //       back: () => router.push({ name: 'admin-users' }),
        //     }),
        //   },
        // ]
      },
      {
        path: 'areas',
        name: 'admin-areas',
        // component: () => import('@/views/admin/areas/index.vue'),
        // children: [
        //   {
        //     path: '',
        //     name: 'admin-areas',
        //     component: () => import('@/views/admin/area/areas/AdminAreas.vue'),
        //     props: route => ({
        //       grid: route.name === 'admin-areas',
        //       newItem: () => router.push({ name: 'admin-areas-new', params: {} }),
        //       linkItem: id => router.push({ name: 'admin-area-details', params: { id } }),
        //     }),
        //     children: [
        //       {
        //         path: ':id',
        //         name: 'admin-area',
        //         component: () => import('@/views/admin/area/area/AdminArea.vue'),
        //         props: route => ({ id: parseInt(route.params.id) }),
        //         children: [
        //           {
        //             path: '',
        //             name: 'admin-area-details',
        //             component: () => import('@/views/admin/area/area/details/AreaDetails.vue'),
        //             props: () => ({
        //               back: () => router.push({ name: 'admin-areas' }),
        //             }),
        //             children: [
        //               {
        //                 path: 'del',
        //                 name: 'admin-area-del',
        //                 component: () => import('@/views/admin/area/area/del/AreaDel.vue'),
        //                 props: () => ({
        //                   back: () => router.push({ name: 'admin-areas' }),
        //                   cancel: () => router.push({ name: 'admin-area-details' }),
        //                 })
        //               },
        //             ]
        //           },
        //           {
        //             path: 'edit',
        //             name: 'admin-area-edit',
        //             component: () => import('@/views/admin/area/area/edit/AreaEditForm.vue'),
        //             props: route => ({
        //               id: parseInt(route.params.id),
        //               back: () => router.push({ name: 'admin-area-details' }),
        //             })
        //           },
        //           {
        //             path: 'meta',
        //             name: 'admin-area-meta',
        //             component: () => import('@/views/admin/area/area/meta/AreaMeta.vue'),
        //             props: () => ({ back: () => router.push({ name: 'admin-area-details' }), })
        //           }
        //         ]
        //       },
        //     ]
        //   },
        //   {
        //     path: 'new',
        //     name: 'admin-areas-new',
        //     component: () => import('@/views/admin/area/new/AreaNewForm.vue'),
        //     props: () => ({
        //       back: () => router.push({ name: 'admin-areas' })
        //     })
        //   }
        // ]
      },
      {
        path: 'tipos',
        name: 'admin-tipos',
        component: () => import('@/views/admin/tipos/index.vue'),
        props: (route) => ({
          showLista: route.name === 'admin-tipos',
          linkCrear: { name: 'admin-tipos-crear' }
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
            //         props: route => ({ id: parseInt(route.params.id) }),
            //         children: [
            //           {
            //             path: '',
            //             name: 'admin-tipo-details',
            //             component: () => import('@/views/admin/tipo/tipo/details/TipoDetails.vue'),
            //             props: () => ({
            //               back: () => router.push({ name: 'admin-tipos' }),
            //             }),
            //             children: [
            //               {
            //                 path: 'del',
            //                 name: 'admin-tipo-del',
            //                 component: () => import('@/views/admin/tipo/tipo/del/TipoDel.vue'),
            //                 props: () => ({
            //                   back: () => router.push({ name: 'admin-tipos' }),
            //                   cancel: () => router.push({ name: 'admin-tipo-details' }),
            //                 })
            //               },
            //             ]
            //           },
            //           {
            //             path: 'edit',
            //             name: 'admin-tipo-edit',
            //             component: () => import('@/views/admin/tipo/tipo/edit/TipoEditForm.vue'),
            //             props: route => ({
            //               id: parseInt(route.params.id),
            //               back: () => router.push({ name: 'admin-tipo-details' }),
            //             })
            //           },
            //           {
            //             path: 'meta',
            //             name: 'admin-tipo-meta',
            //             component: () => import('@/views/admin/tipo/tipo/meta/TipoMeta.vue'),
            //             props: () => ({ back: () => router.push({ name: 'admin-tipo-details' }), })
            //           }
            //         ]
          },
        ]
        //   },
        //   
        // ]
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
