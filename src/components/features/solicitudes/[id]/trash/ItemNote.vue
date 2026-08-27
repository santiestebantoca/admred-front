<script setup>
import useItemStore from '@/stores/item'
import { useAuthQuery } from '@/stores/auth'
import { formatHM, formatDate } from '@/composables/useDates'
import { tidy, groupBy, mutate } from '@tidyjs/tidy'
import { useRoute } from 'vue-router'
import { ref, computed, onUnmounted, watch, nextTick } from 'vue'

const item = useItemStore()
const sending = ref(false)
const route = useRoute()
const dialog = ref(true)
const modalBody = ref(null)
const form = ref({
  texto: null,
  solicitud: null
})
watch(() => item.data, d => {
  form.value = {
    solicitud: d.id,
  }
}, { immediate: true })
const data = computed(() => {
  // types: tramitador 0, supervisor 1, remitente 2
  const classes = [
    'text-bg-primary',
    'alert alert-secondary text-dark border-0 mb-0',
    'alert alert-success text-dark border-0 mb-0'
  ]
  const avatarClasses = ['text-bg-info', 'text-bg-secondary', 'text-bg-success']
  return tidy(
    item.note.data || [],
    mutate({
      type: (d) => (d.tramitador ? 0 : d.supervisor ? 1 : 2),
      remitente: () => item.data.remitente.name,
      classes: (d) => classes[d.type],
      time: (d) => formatHM(d.fecha),
      style: (d) => ({ 'flex-direction': d.type < 2 ? 'row-reverse' : '' }),
      author: (d) =>
        (d.tramitador && d.tramitador.name) ||
        (d.supervisor && d.supervisor.name) ||
        d.remitente,
      avatar: (d) => ({
        text: d.author,
        tooltip: d.type < 2 ? 'left' : 'right',
        color: avatarClasses[d.type]
      })
    }),
    groupBy((d) => formatDate(d.fecha), [], groupBy.entriesObject())
  )
})
const writable = computed(() => {
  const itemData = item.data
  const { authUser } = useAuthQuery()
  if (itemData && authUser.value) {
    const imTramitador = itemData.tramitador && itemData.tramitador.id === authUser.value.id
    const imSupervisor = itemData.supervisor && itemData.supervisor.id === authUser.value.id
    const imSender = itemData.remitente.id === authUser.value.id
    return itemData.estado.id !== 4 && (imTramitador || imSender || imSupervisor)
  } else return false
})
item.note.get(route.query.item)
// onUpdated(() => scroll()) // this is not working, probalby a bug of <script setup>; solution:
watch(data, () => nextTick(() => scroll()))
onUnmounted(() => item.note.reset())
const scroll = () => modalBody.value.scrollTop = modalBody.value.scrollHeight
function submit() {
  sending.value = true
  // item.note.post(form.value).then(res => process.POST(res.data, accepted, errors))
}
function accepted() {
  item.note.get(route.query.item).then(() => sending.value = false)
  form.value.texto = null
}
const errors = () => sending.value = false
</script>

<template>
  <bs-dialog v-model="dialog" @shown="scroll" @hidden="$emit('close')" lg fullSmDown>
    <bs-dialog-header label="Notas" />
    <bs-dialog-body class="p-0 bg-light">
      <div ref="modalBody" class="db px-3">
        <div v-for="{ key, values } in data" :key="key">
          <div class="text-center text-muted py-3 small fw-semibold" v-text="key" />
          <div v-for="item in values" :key="item.id" class="hstack py-1 gap-2" :style="item.style">
            <div :class="item.avatar.color" style="height: 36px; width: 36px; min-width: 36px; font-size: 20px"
              class="rounded-circle text-center d-none d-sm-inline">
              {{ item.avatar.text.slice(0, 1).toUpperCase() }}
              <bs-tooltip :placement="item.avatar.tooltip">{{ item.avatar.text }}</bs-tooltip>
            </div>
            <div :class="item.classes" style="max-width: 500px" class="rounded-3 shadow-sm p-3">
              <div>
                <div>
                  <div class="mb-1 small hstack d-sm-none">
                    <span class=" fw-bold text-truncate" v-text="item.author" />
                    <span class="text-no-wrap ms-3"> {{ item.time }} </span>
                  </div>
                  <div class="mb-4 text-danger" v-if="item.evento">[{{ item.evento }}]</div>
                  <div class="lh-sm" v-text="item.texto" />
                </div>
              </div>
            </div>
            <span class="align-self-end text-muted small d-none d-sm-inline">
              {{ item.time }}
            </span>
            <div class="flex-fill"></div>
          </div>
        </div>
      </div>
    </bs-dialog-body>
    <bs-dialog-footer v-if="writable" class="bg-light">
      <form @submit.prevent class="w-100">
        <div class="hstack">
          <textarea placeholder="Escribe una nota" class="border-0 w-100 py-2 px-3 rounded shadow-sm"
            style="resize: none" rows="1" v-model="form.texto" />
          <button v-if="form.texto" class="btn btn-link shadow-none" @click="submit">
            <bs-icon name="send-fill" fs="24px" />
          </button>
        </div>
      </form>
    </bs-dialog-footer>
    <div v-else class="text-muted small fw-semibold px-3">Solo lectura</div>
  </bs-dialog>
</template>

<style scoped>
.db {
  height: 340px;
  scroll-behavior: smooth;
  overflow: auto;
}
</style>
