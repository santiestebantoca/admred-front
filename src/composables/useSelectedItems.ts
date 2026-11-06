import { computed, type Ref } from 'vue'

/**
 * Adaptador para `v-model:selected-items` de `BTable`.
 *
 * BVN declara esa prop como un arreglo de filas, pero cuando la tabla define
 * `primary-key` guarda en realidad los valores de esa clave (los ids). Este
 * adaptador permite mantener el estado de selección como ids sin renunciar al
 * tipado del componente.
 *
 * @param ids      Estado de selección (ids de las filas).
 * @param onSelect Callback opcional al cambiar la selección (útil para navegar).
 */
export function useSelectedItems<T>(
  ids: Ref<number[]>,
  onSelect?: (ids: number[]) => void,
) {
  return computed<T[]>({
    get: () => ids.value as unknown as T[],
    set: (items) => {
      ids.value = items as unknown as number[]
      onSelect?.(ids.value)
    },
  })
}
