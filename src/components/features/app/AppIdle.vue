<!-- AppIdle.vue (actualizado) -->
<script lang="ts" setup>
class IdleTimer {
  TIMEOUT: number
  LISTENERS: number
  WARNING: number
  heartBeat: () => boolean
  onTimeout: () => void
  events: string[]
  listenersTimer: ReturnType<typeof setTimeout> | null
  warningTimer: ReturnType<typeof setTimeout> | null
  timeoutTimer: ReturnType<typeof setTimeout> | null
  bindedThrottler: () => void
  isStarted: boolean
  isListening: boolean
  status: 'repose' | 'warning' | 'timeout' | 'listening' | null

  constructor(timeout: number, warning: number) {
    this.TIMEOUT = timeout * 60 * 1000
    this.LISTENERS = (timeout / 3) * 60 * 1000
    this.WARNING = timeout * warning * 60 * 1000

    this.heartBeat = () => true
    this.onTimeout = () => true

    this.events = ['mousemove', 'mousedown', 'keydown', 'touchstart']
    this.listenersTimer = null
    this.warningTimer = null
    this.timeoutTimer = null

    this.bindedThrottler = this.throttler.bind(this)

    this.isStarted = false
    this.isListening = false
    this.status = null
  }

  setTimers() {
    this.listenersTimer = setTimeout(() => this.addListeners(), this.LISTENERS)
    this.warningTimer = setTimeout(() => this.warning(), this.WARNING)
    this.timeoutTimer = setTimeout(() => this.timeout(), this.TIMEOUT)
    this.isStarted = true
    this.status = 'repose'
  }

  clearTimers() {
    clearTimeout(this.listenersTimer)
    clearTimeout(this.warningTimer)
    clearTimeout(this.timeoutTimer)
    this.isStarted = false
  }

  warning() {
    this.status = 'warning'
  }

  timeout() {
    this.stop()
    this.status = 'timeout'
    this.onTimeout()
  }

  throttler() {
    this.removeListeners()
    if (this.heartBeat()) this.reset()
    else this.addListeners()
  }

  addListeners() {
    this.events.forEach((event) => {
      window.addEventListener(event, this.bindedThrottler)
    })
    this.isListening = true
    this.status = 'listening'
  }

  removeListeners() {
    this.events.forEach((event) => {
      window.removeEventListener(event, this.bindedThrottler)
    })
    this.isListening = false
  }

  start() {
    !this.isStarted && this.setTimers()
  }

  stop() {
    this.isListening && this.removeListeners()
    this.isStarted && this.clearTimers()
    this.status = null
  }

  reset() {
    if (this.isStarted) {
      this.stop()
      this.start()
    } else this.stop()
  }
}

const props = defineProps({
  timeout: Number,
  warning: Number
})

import { lastServerAccess } from '@/api/client'
import { useAuthQuery } from '@/stores/auth'
import { ref, computed, watch, onBeforeUnmount, watchEffect } from 'vue'

const { authUser, refetch: refetchUser } = useAuthQuery()
const idleTimer = ref(new IdleTimer(props.timeout, props.warning))
const warning = computed(() => idleTimer.value.status === 'warning')
const emit = defineEmits(['expired'])

watchEffect(() => {
  if (authUser.value) idleTimer.value.start()
  else idleTimer.value.stop()
})
watch(lastServerAccess, () => idleTimer.value.reset())
onBeforeUnmount(() => idleTimer.value.stop())

idleTimer.value.heartBeat = () => {
  void refetchUser()
  return true
}
idleTimer.value.onTimeout = () => emit('expired')
</script>

<template>
  <BOverlay :show="warning" no-wrap no-spinner variant="secondary" z-index="1040" />
</template>