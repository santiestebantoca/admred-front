<script setup>
import useStore from '@/stores/admin-users'
import { computed, inject } from 'vue'

const mobile = inject('app:mobile')
const store = useStore().user
const data = computed(() => store.data)
const actions = computed(() => [
  {
    label: 'Editar',
    to: { name: 'admin-user-edit' },
    icon: 'pencil',
    group: mobile.value ? 1 : 0
  },
  {
    label: 'Administrar grupos',
    to: { name: 'admin-user-membership' },
    group: 1
  },
  {
    label: data.value.blocked ? 'Desbloquear' : 'Bloquear',
    to: { name: 'admin-user-block' },
    group: 1
  },
  ...data.value.deletable ? [{
    label: 'Eliminar',
    to: { name: 'admin-user-del' },
    divider: true,
    group: 1
  }] : [],
  {
    label: 'Metadatos',
    to: { name: 'admin-user-meta' },
    divider: true,
    group: 1
  }
])
</script>

<template>
  <div class="hstack gap-2">
    <bs-btn class="ms-auto" v-for="{ to, icon, label } in actions.filter(d => d.group === 0)" :to="to" :icon="icon"
      :label="label" flat />
    <bs-dropdown>
      <bs-dropdown-toggle>
        <bs-btn-icon icon="three-dots-vertical" flat>
          <bs-tooltip placement="bottom" offset="0,10">Más opciones</bs-tooltip>
        </bs-btn-icon>
      </bs-dropdown-toggle>
      <bs-dropdown-menu end>
        <template v-for="{ divider, to, label, click } in actions.filter(d => d.group === 1)">
          <bs-dropdown-item :to="to" :label="label" @click="click" :divider="divider" />
        </template>
      </bs-dropdown-menu>
    </bs-dropdown>
  </div>
</template>
