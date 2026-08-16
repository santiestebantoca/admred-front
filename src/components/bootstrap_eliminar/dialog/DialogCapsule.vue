<script setup>
const props = defineProps({
  label: String,
})

import { inject } from 'vue'

const minimize = inject('dialog:minimize')
const minimized = inject('dialog:minimized')
const onRestore = inject('dialog:onRestore')
const onClose = inject('dialog:onClose')
minimize.value = true
const capsuleId = `dialog-capsule-${Math.random().toString(36).slice(2, 8)}`
</script>

<template>
  <teleport to="body">
    <transition>
      <div v-if="minimized" :id="capsuleId" class="dialog-capsule" @click="onRestore">
        <div class="dialog-capsule__inner shadow">
          <div class="dialog-capsule__title" v-text="label" />
          <bs-btn-close aria-label="Close" @click.stop="onClose" />
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.dialog-capsule {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 18px;
  z-index: 2000;
  cursor: pointer;
}

.dialog-capsule__inner {
  background: var(--bs-body-bg);
  border-radius: 28px;
  padding: 8px 10px 8px 14px;
  /* box-shadow: 0 10px 30px rgba(23, 31, 44, 0.12); */
  display: flex;
  align-items: center;
  gap: 12px;
  /* */
  border: 1px solid rgba(0, 0, 0, 0.06);
  background-color: rgb(139, 212, 214);
}

.dialog-capsule__title {
  font-weight: 600;
  width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.15s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>