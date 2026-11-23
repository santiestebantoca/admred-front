import { useAreasQuery } from './useAreasQuery'
import { nivelHijo } from './niveles'
import { useAuthQuery } from '@/stores/auth'
import { useNivelesQuery } from '@/stores/niveles'
import { computed } from 'vue'

/**
 * Área propia del administrador y si admite áreas hijas.
 *
 * Reutiliza la consulta general de áreas (la misma clave que el navegador),
 * de modo que no genera una petición adicional cuando esa lista ya está
 * cargada. El `GET` acota el resultado al subárbol del administrador no AR.
 */
export function useAreaPropiaQuery() {
  const { authUser } = useAuthQuery()
  const { areas, isPending, isLoading } = useAreasQuery({})
  const { niveles } = useNivelesQuery()

  const areaPropia = computed(() =>
    (areas.value ?? []).find(area => area.id === authUser.value?.area)
  )

  const nivelHijoPropio = computed(() =>
    nivelHijo(areaPropia.value?.nivel_id, niveles.value ?? [])
  )

  const puedeCrear = computed(() => !!nivelHijoPropio.value)

  return {
    areaPropia,
    nivelHijoPropio,
    puedeCrear,
    isPending,
    isLoading,
  }
}
