<script setup>
import useFolderStore from '@/stores/folder'
import { ref, computed } from 'vue'

const folder = useFolderStore()
const pending = computed(() => folder.pending.data)
const model = ref(false)
</script>

<template>
  <div v-if="pending.tasks">
    <bs-btn-icon @click="model = true" flat size="38px">
      <img src="@/assets/images/exclamation-triangle.svg" height="18" class="opacity-75" />
      <bs-tooltip offset="0,10" placement="bottom">Notificaciones</bs-tooltip>
    </bs-btn-icon>
    <bs-dialog v-model="model" fullSmDown>
      <bs-dialog-header label="Notificaciones" />
      <bs-dialog-body>
        <!-- approve -->
        <div v-if="pending.approve?.length" class="mb-3">
          <p>
            <i class="bi-exclamation-triangle pe-1" style="color:orangered" />
            Por aprobar
            <span v-text="pending.approve.length" class="fw-semibold text-danger ps-2" />
          </p>
          <div class="hstack gap-2 flex-wrap">
            <router-link v-for="item in pending.approve" class="text-decoration-none" @click="model = false"
              :to="{ query: { item: item[0] } }" v-text="item[1]" type="button" />
          </div>
        </div>
        <!-- assign -->
        <div v-if="pending.assign?.length" class="mb-3">
          <p>
            <i class="bi-exclamation-triangle pe-1" style="color:orangered" />
            Por asignar
            <span v-text="pending.assign.length" class="fw-semibold text-danger ps-2" />
          </p>
          <div class="hstack gap-2 flex-wrap">
            <router-link v-for="item in pending.assign" class="text-decoration-none" @click="model = false"
              :to="{ query: { item: item[0] } }" v-text="item[1]" type="button" />
          </div>
        </div>
        <!-- reply -->
        <div v-if="pending.reply?.length" class="mb-3">
          <p>
            <i class="bi-exclamation-triangle pe-1" style="color:orangered" />
            Por responder
            <span v-text="pending.reply.length" class="fw-semibold text-danger ps-2" />
          </p>
          <div class="hstack gap-2 flex-wrap">
            <router-link v-for="item in pending.reply" class="text-decoration-none" @click="model = false"
              :to="{ query: { item: item[0] } }" v-text="item[1]" type="button" />
          </div>
        </div>
      </bs-dialog-body>
    </bs-dialog>
    <span v-text="pending.tasks" class="badge" />
  </div>
</template>

<style scoped>
.badge {
  color: white;
  background-color: var(--bs-danger);
  border-radius: 50rem;
  position: relative;
  top: -8px;
  left: -8px;
  opacity: .9;
  line-height: 10px;
}
</style>