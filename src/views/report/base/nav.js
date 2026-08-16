import { useAuthQuery } from '@/stores/auth'
import { computed } from 'vue'

export default function useNavOptions() {
  const { authUser } = useAuthQuery()
  const AR = authUser.value?.AR
  const options = computed(() => {
    return [
      {
        label: 'Mis pendientes',
        to: { name: 'report-pending' },
        icon: 'exclamation-diamond'
      },
      {
        label: 'Desempeño personal',
        to: { name: 'report-person' },
        icon: 'people'
      },
      ...AR ? [
        {
          label: 'Solicitudes externas',
          to: { name: 'report-outer' },
          icon: 'box-arrow-in-right'
        },
        {
          label: 'Solicitudes internas',
          to: { name: 'report-inner' },
          icon: 'arrow-right-square'
        },
        {
          label: 'Áreas consultadas',
          to: { name: 'report-consultadas' },
          icon: 'shuffle'
        },
        {
          label: 'Buscar código',
          to: { name: 'report-find' },
          icon: 'search'
        },
        {
          label: 'Solicitudes de provisión',
          to: { name: 'report-provision' },
          icon: 'play-circle'
        }
      ] : []
    ]
  })
  return { options }
}
