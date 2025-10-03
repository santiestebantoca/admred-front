import { ref } from 'vue'

const fields = [
  // { id: 1, name: 'root', label: '', icon: 'star' },
  { id: 1, name: 'codigo', label: '#' },
  { id: 2, name: 'objetivo', label: 'Objetivo' },
  { id: 3, name: 'origen', label: 'Demandante', tray: 'recibidas' },
  { id: 4, name: 'destino', label: 'Área consultada', tray: 'enviadas' },
  { id: 5, name: 'solicitado_en', label: 'Presentada' },
  { id: 6, name: 'terminado_en', label: 'Terminada', state: 'terminadas' },
  { id: 7, name: 'estado', label: 'Estado', state: 'pendientes' },
]

export default function useFolderFields() {
  const ths = ref([])
  const domain = ref([])
  const names = ref([])
  const set = (tray, state) => {
    domain.value = fields.filter(d => {
      if (d.tray && d.tray !== tray) return false
      if (d.state && d.state !== state) return false
      return true
    })
    ths.value = domain.value
    names.value = domain.value.map(d => d.name)
  }
  return { set, ths, names }
}