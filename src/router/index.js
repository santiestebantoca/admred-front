import { createRouter, createWebHashHistory } from 'vue-router'
import useAuthStore from '@/stores/auth'
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
    component: () => import('../views/auth/AuthIndex.vue'),
    children: [
      {
        path: 'login',
        name: 'auth-login',
        component: () => import('@/views/auth/login/AuthLogin.vue'),
        meta: { logout: true },
        props: route => ({
          next: () => router.push(route.query.next || '/home')
        })
      },
      {
        path: 'impersonate',
        name: 'auth-impersonate',
        component: () => import('@/views/auth/impersonate/AuthImpersonate.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'logout',
        name: 'auth-logout',
        component: () => import('@/views/auth/logout/AuthLogout.vue'),
        meta: { logout: true }
      },
      {
        path: 'expired',
        name: 'auth-expired',
        component: () => import('@/views/auth/expired/AuthExpired.vue'),
        meta: { logout: true },
        beforeEnter: (to, from) => replaceQuery(to, 'next', from ? from.fullPath : '/'),
        props: route => ({ next: route.query.next }),
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
          baseQuery: { tray: route.params.tray, state: route.params.state },
          compose: {
            new: route.query.compose === 'new',
            back: () => router.replace({
              query: {
                compose: undefined,
              }
            })
          }
        })
      }
    ]
  }
]

const routesReport = [
  {
    path: '/report',
    name: 'report',
    component: () => import('../views/report/index.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'report-home',
        component: () => import('@/views/report/home/ReportHome.vue'),
      },
      {
        path: 'pending',
        name: 'report-pending',
        component: () => import('@/views/report/pending/ReportPending.vue'),
      },
      {
        path: 'outer',
        name: 'report-outer',
        component: () => import('@/views/report/outer/ReportOuter.vue'),
      },
      {
        path: 'inner',
        name: 'report-inner',
        component: () => import('@/views/report/inner/ReportInner.vue'),
      },
      {
        path: 'consultadas',
        name: 'report-consultadas',
        component: () => import('@/views/report/consultadas/ReportConsultadas.vue'),
      },
      {
        path: 'find',
        name: 'report-find',
        component: () => import('@/views/report/find/ReportFind.vue'),
      },
      {
        path: 'person',
        name: 'report-person',
        component: () => import('@/views/report/person/ReportPerson.vue'),
      },
      {
        path: 'provision',
        name: 'report-provision',
        component: () => import('@/views/report/provision/index.vue'),
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

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    ...routesAuth,
    ...routesSolicitudes,
    ...routesReport,
    ...routesAdmin,
    {
      path: '/home',
      name: 'home',
      alias: ['/'],
      redirect: '/solicitudes' // landing page
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/NotFound.vue')
    }
  ]
})

router.afterEach((to) => {
  const auth = useAuthStore()
  if (to.matched.some((record) => record.meta.logout)) auth.auth && auth.logout()
  if (to.matched.some((record) => record.meta.saveFolder)) {
    const folder = useStorage('admred_router_folder')
    folder.value = `${to.params.tray}/${to.params.state}`
  }
})

router.beforeEach(async (to, from) => {
  const auth = useAuthStore()
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (auth.auth === null) // browser navigation (initial state)
      await auth.getAuthUser()
    if (!auth.auth)
      return { name: 'auth-login', query: { next: to.fullPath } }
  }
})

const replaceQuery = (to, query, value) => {
  if (!to.query[query]) return { path: to.path, query: { ...to.query, [query]: value } }
}
