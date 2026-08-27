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
          params: route.params,
          query: route.query,
          flows: {
            crear: {
              active: route.query.crear === 'true',
              go: () => router.replace({ query: { ...route.query, crear: 'true' } }),
              back: () => router.replace({ query: { crear: undefined } })
            },
            solicitud: {
              active: parseInt(route.query.solicitudId),
              go: (solicitudId) => router.replace({ query: { ...route.query, solicitudId } }),
              back: () => router.replace({ query: { solicitudId: undefined } })
            },
          }
        })
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
        component: () => import('@/views/reportes/home/ReportHome.vue'),
      },
      {
        path: 'pending',
        name: 'reportes-pending',
        component: () => import('@/views/reportes/pending/ReportPending.vue'),
      },
      {
        path: 'outer',
        name: 'reportes-outer',
        component: () => import('@/views/reportes/outer/ReportOuter.vue'),
      },
      {
        path: 'inner',
        name: 'reportes-inner',
        component: () => import('@/views/reportes/inner/ReportInner.vue'),
      },
      {
        path: 'consultadas',
        name: 'reportes-consultadas',
        component: () => import('@/views/reportes/consultadas/ReportConsultadas.vue'),
      },
      {
        path: 'find',
        name: 'reportes-find',
        component: () => import('@/views/reportes/find/ReportFind.vue'),
      },
      {
        path: 'person',
        name: 'reportes-person',
        component: () => import('@/views/reportes/person/ReportPerson.vue'),
      },
      {
        path: 'provision',
        name: 'reportes-provision',
        component: () => import('@/views/reportes/provision/index.vue'),
      }
    ]
  }
]

const routesAdmin = [
  {
    path: '/admin',
    name: 'admin',
    redirect: { name: 'admin-home' },
    component: () => import('@/views/admin/index.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'admin-home',
        component: () => import('@/views/admin/home/AdminHome.vue')
      },
      {
        path: 'users',
        name: 'admin-users-index',
        component: () => import('@/views/admin/user/AdminUsersIndex.vue'),
        children: [
          {
            path: '',
            name: 'admin-users',
            component: () => import('@/views/admin/user/users/AdminUsers.vue'),
            props: route => ({
              grid: route.name === 'admin-users',
              newItem: () => router.push({ name: 'admin-users-new', params: {} }),
              linkItem: id => router.push({ name: 'admin-user-details', params: { id } }),
            }),
            children: [
              {
                path: ':id',
                name: 'admin-user',
                component: () => import('@/views/admin/user/user/AdminUser.vue'),
                props: route => ({ id: parseInt(route.params.id) }),
                children: [
                  {
                    path: '',
                    name: 'admin-user-details',
                    component: () => import('@/views/admin/user/user/details/UserDetails.vue'),
                    props: () => ({
                      back: () => router.push({ name: 'admin-users' }),
                    }),
                    children: [
                      {
                        path: 'del',
                        name: 'admin-user-del',
                        component: () => import('@/views/admin/user/user/del/UserDel.vue'),
                        props: () => ({
                          back: () => router.push({ name: 'admin-users' }),
                          cancel: () => router.push({ name: 'admin-user-details' }),
                          block: () => router.push({ name: 'admin-user-block' }),
                        })
                      },
                      {
                        path: 'block',
                        name: 'admin-user-block',
                        component: () => import('@/views/admin/user/user/block/UserBlock.vue'),
                        props: () => ({
                          back: () => router.push({ name: 'admin-user-details' }),
                        })
                      },
                    ]
                  },
                  {
                    path: 'edit',
                    name: 'admin-user-edit',
                    component: () => import('@/views/admin/user/user/edit/UserEditForm.vue'),
                    props: route => ({
                      id: parseInt(route.params.id),
                      back: () => router.push({ name: 'admin-user-details' }),
                    })
                  },
                  {
                    path: 'membership',
                    name: 'admin-user-membership',
                    component: () => import('@/views/admin/user/user/membership/UserMembershipForm.vue'),
                    props: route => ({
                      id: parseInt(route.params.id),
                      back: () => router.push({ name: 'admin-user-details' }),
                    })
                  },
                  {
                    path: 'meta',
                    name: 'admin-user-meta',
                    component: () => import('@/views/admin/user/user/meta/UserMeta.vue'),
                    props: () => ({ back: () => router.push({ name: 'admin-user-details' }), })
                  }
                ]
              }
            ]
          },
          {
            path: 'new',
            name: 'admin-users-new',
            component: () => import('@/views/admin/user/new/UserNewWizard.vue'),
            props: () => ({
              back: () => router.push({ name: 'admin-users' }),
            }),
          },
        ]
      },
      {
        path: 'areas',
        name: 'admin-areas-index',
        component: () => import('@/views/admin/area/AdminAreasIndex.vue'),
        children: [
          {
            path: '',
            name: 'admin-areas',
            component: () => import('@/views/admin/area/areas/AdminAreas.vue'),
            props: route => ({
              grid: route.name === 'admin-areas',
              newItem: () => router.push({ name: 'admin-areas-new', params: {} }),
              linkItem: id => router.push({ name: 'admin-area-details', params: { id } }),
            }),
            children: [
              {
                path: ':id',
                name: 'admin-area',
                component: () => import('@/views/admin/area/area/AdminArea.vue'),
                props: route => ({ id: parseInt(route.params.id) }),
                children: [
                  {
                    path: '',
                    name: 'admin-area-details',
                    component: () => import('@/views/admin/area/area/details/AreaDetails.vue'),
                    props: () => ({
                      back: () => router.push({ name: 'admin-areas' }),
                    }),
                    children: [
                      {
                        path: 'del',
                        name: 'admin-area-del',
                        component: () => import('@/views/admin/area/area/del/AreaDel.vue'),
                        props: () => ({
                          back: () => router.push({ name: 'admin-areas' }),
                          cancel: () => router.push({ name: 'admin-area-details' }),
                        })
                      },
                    ]
                  },
                  {
                    path: 'edit',
                    name: 'admin-area-edit',
                    component: () => import('@/views/admin/area/area/edit/AreaEditForm.vue'),
                    props: route => ({
                      id: parseInt(route.params.id),
                      back: () => router.push({ name: 'admin-area-details' }),
                    })
                  },
                  {
                    path: 'meta',
                    name: 'admin-area-meta',
                    component: () => import('@/views/admin/area/area/meta/AreaMeta.vue'),
                    props: () => ({ back: () => router.push({ name: 'admin-area-details' }), })
                  }
                ]
              },
            ]
          },
          {
            path: 'new',
            name: 'admin-areas-new',
            component: () => import('@/views/admin/area/new/AreaNewForm.vue'),
            props: () => ({
              back: () => router.push({ name: 'admin-areas' })
            })
          }
        ]
      },
      {
        path: 'tipos',
        name: 'admin-tipos-index',
        component: () => import('@/views/admin/tipo/AdminTiposIndex.vue'),
        children: [
          {
            path: '',
            name: 'admin-tipos',
            component: () => import('@/views/admin/tipo/tipos/AdminTipos.vue'),
            props: route => ({
              grid: route.name === 'admin-tipos',
              newItem: () => router.push({ name: 'admin-tipos-new', params: {} }),
              linkItem: id => router.push({ name: 'admin-tipo-details', params: { id } }),
            }),
            children: [
              {
                path: ':id',
                name: 'admin-tipo',
                component: () => import('@/views/admin/tipo/tipo/AdminTipo.vue'),
                props: route => ({ id: parseInt(route.params.id) }),
                children: [
                  {
                    path: '',
                    name: 'admin-tipo-details',
                    component: () => import('@/views/admin/tipo/tipo/details/TipoDetails.vue'),
                    props: () => ({
                      back: () => router.push({ name: 'admin-tipos' }),
                    }),
                    children: [
                      {
                        path: 'del',
                        name: 'admin-tipo-del',
                        component: () => import('@/views/admin/tipo/tipo/del/TipoDel.vue'),
                        props: () => ({
                          back: () => router.push({ name: 'admin-tipos' }),
                          cancel: () => router.push({ name: 'admin-tipo-details' }),
                        })
                      },
                    ]
                  },
                  {
                    path: 'edit',
                    name: 'admin-tipo-edit',
                    component: () => import('@/views/admin/tipo/tipo/edit/TipoEditForm.vue'),
                    props: route => ({
                      id: parseInt(route.params.id),
                      back: () => router.push({ name: 'admin-tipo-details' }),
                    })
                  },
                  {
                    path: 'meta',
                    name: 'admin-tipo-meta',
                    component: () => import('@/views/admin/tipo/tipo/meta/TipoMeta.vue'),
                    props: () => ({ back: () => router.push({ name: 'admin-tipo-details' }), })
                  }
                ]
              },
            ]
          },
          {
            path: 'new',
            name: 'admin-tipos-new',
            component: () => import('@/views/admin/tipo/new/TipoNewForm.vue'),
            props: () => ({
              back: () => router.push({ name: 'admin-tipos' })
            })
          }
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
