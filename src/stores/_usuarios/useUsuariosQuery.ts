import { useQuery } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { usuariosApi as api } from '@/api/usuarios'

export function useUsuariosQuery() {
  const { data, isPending } = useQuery({
    key: queryKeys.usuarios.listas(),
    query: () => api.getAll(),
  })

  return {
    usuarios: data,
    isPending,
  }
}

// export function useSuscriptoresDelGrupoQuery(id?: number | string) {
//   const grupoId = ref(id)

//   const { data, isPending } = useQuery({
//     key: () => queryKeys.suscriptores.lista({ grupo: grupoId.value }),
//     query: () => api.getAll({ grupo: grupoId.value }),
//     staleTime: Infinity
//   })

//   return {
//     suscriptores: data,
//     isPending,
//     grupoId
//   }
// }
