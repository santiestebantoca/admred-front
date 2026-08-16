import { useAuthQuery } from '@/stores/auth'
import { computed } from 'vue'

export default function useNavOptions() {
  const { authUser } = useAuthQuery()
  const AR = authUser.value?.AR
  const options = computed(() => {
    return [
      {
        label: 'Usuarios',
        to: { name: 'admin-users' },
        icon: 'people'
      },
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
