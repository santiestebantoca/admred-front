import { useAuthQuery } from '@/stores/auth'
import { computed } from 'vue'

export default function useAuthUserMenu() {
  const { authUser } = useAuthQuery()

  const actions = computed(() => {
    const res = [
      {
        title: 'Cerrar sesión',
        path: { name: 'auth-logout' },
        icon: 'bi-box-arrow-right'
      },]
    if (authUser.value?.can_impersonate || authUser.value?.is_impersonating)
      res.push({
        title: 'Personificar',
        path: { name: 'auth-impersonate' },
        icon: 'bi-people'
      })
    return res
  })
  const isImpersonating = computed(() => authUser.value?.is_impersonating)

  return {
    authUser,
    actions,
    isImpersonating
  }
}
