<script setup>
const error = defineModel('error')
const value = defineModel('value')
const props = defineProps({ down: Boolean })

import useFolderStore from '@/stores/folder'
import { ref, computed, watch } from 'vue'

const folder = useFolderStore()
folder.tipos.get()
const items = computed(() => folder.tipos.data)
const sel = computed(() => items.value?.find(d => d.id === value.value))

watch(value, () => error.value = null)
const carousel = ref(0)
</script>

<template>
  <bs-dropdown :up="!down">
    <bs-dropdown-toggle auto="outside" @hidden="carousel = 0">
      <bs-btn-icon flat icon="tag" style="font-size:20px">
        <bs-tooltip placement="top" offset="0,10">Tipo de solicitud</bs-tooltip>
        <bs-badge v-if="value" floating inset color="primary" />
      </bs-btn-icon>
    </bs-dropdown-toggle>
    <bs-dropdown-menu style="max-height: 280px; overflow-y: auto">
      <bs-carousel v-model="carousel">
        <bs-carousel-item>
          <li v-if="sel">
            <label class="form-label px-3">Marcada como</label>
            <div class="px-3 py-1" v-text="sel.nombre" />
            <hr class="dropdown-divider opacity-50" style="min-width: 240px" />
          </li>
          <li>
            <a class="dropdown-item" type="button" @click="carousel = 1"> Marcar solicitud como </a>
          </li>
        </bs-carousel-item>
        <bs-carousel-item>
          <li v-for="{ id, nombre } in items" :key="id" @click="carousel = 0">
            <a class="dropdown-item" type="button" :title="nombre" v-text="nombre" @click="value = id" />
          </li>
        </bs-carousel-item>
      </bs-carousel>
    </bs-dropdown-menu>
  </bs-dropdown>
</template>
