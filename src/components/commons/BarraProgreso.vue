<script lang="ts" setup>
/**
 * Barra de progreso global.
 *
 * Se muestra cuando hay peticiones HTTP en curso o cuando el router está
 * resolviendo una navegación (incluida la descarga diferida de la vista).
 *
 * - Espera un instante antes de aparecer para no parpadear en operaciones
 *   rápidas.
 * - Permanece un mínimo de tiempo visible para que el usuario alcance a
 *   percibirla.
 * - No bloquea la interacción: es puramente informativa.
 */
import { useActividadRed } from '@/composables/useActividadRed'
import { computed, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const RETARDO_APARICION = 180
const DURACION_MINIMA = 320
const DURACION_CIERRE = 200

const router = useRouter()
const { hayPeticiones } = useActividadRed()

const navegando = ref(false)
const visible = ref(false)
const progreso = ref(0)

let temporizadorAparicion: ReturnType<typeof setTimeout> | undefined
let temporizadorOcultar: ReturnType<typeof setTimeout> | undefined
let intervaloAvance: ReturnType<typeof setInterval> | undefined
let mostradaEn = 0

const activo = computed(() => hayPeticiones.value || navegando.value)
const porcentaje = computed(() => Math.round(progreso.value))

const detenerAvance = () => {
  if (intervaloAvance) {
    clearInterval(intervaloAvance)
    intervaloAvance = undefined
  }
}

const avanzar = () => {
  detenerAvance()
  // Avance asintótico: se acerca al 90 % mientras la operación sigue en curso.
  intervaloAvance = setInterval(() => {
    progreso.value = Math.min(90, progreso.value + Math.max(0.8, (90 - progreso.value) * 0.12))
  }, 180)
}

const mostrar = () => {
  visible.value = true
  mostradaEn = Date.now()
  progreso.value = 8
  avanzar()
}

const ocultar = () => {
  detenerAvance()
  progreso.value = 100
  temporizadorOcultar = setTimeout(() => {
    visible.value = false
    progreso.value = 0
    temporizadorOcultar = undefined
  }, DURACION_CIERRE)
}

const limpiarTemporizadores = () => {
  if (temporizadorAparicion) {
    clearTimeout(temporizadorAparicion)
    temporizadorAparicion = undefined
  }
  if (temporizadorOcultar) {
    clearTimeout(temporizadorOcultar)
    temporizadorOcultar = undefined
  }
  detenerAvance()
}

watch(activo, (estaActivo) => {
  if (estaActivo) {
    // Si estaba cerrándose, se reanuda sin volver a empezar desde cero.
    if (temporizadorOcultar) {
      clearTimeout(temporizadorOcultar)
      temporizadorOcultar = undefined
    }

    if (visible.value) {
      // Si ya se había completado y vuelve a haber actividad, reinicia el
      // avance desde un valor bajo para no retroceder visualmente.
      if (progreso.value >= 100) progreso.value = 10
      avanzar()
      return
    }

    if (temporizadorAparicion) return

    temporizadorAparicion = setTimeout(() => {
      temporizadorAparicion = undefined
      if (activo.value) mostrar()
    }, RETARDO_APARICION)
    return
  }

  if (temporizadorAparicion) {
    clearTimeout(temporizadorAparicion)
    temporizadorAparicion = undefined
  }

  if (!visible.value) return

  const transcurrido = Date.now() - mostradaEn
  const espera = Math.max(0, DURACION_MINIMA - transcurrido)
  temporizadorOcultar = setTimeout(ocultar, espera)
}, { immediate: true })

// Registrar las navegaciones del router como actividad.
const quitarAntes = router.beforeEach(() => {
  navegando.value = true
  return true
})
const quitarDespues = router.afterEach(() => {
  navegando.value = false
})
const quitarError = router.onError(() => {
  navegando.value = false
})

onUnmounted(() => {
  quitarAntes()
  quitarDespues()
  quitarError()
  limpiarTemporizadores()
})
</script>

<template>
  <Transition name="barra-progreso">
    <div v-if="visible" class="barra-progreso" role="progressbar" aria-label="Cargando"
      aria-valuemin="0" aria-valuemax="100" :aria-valuenow="porcentaje" aria-valuetext="Cargando">
      <div class="barra-progreso__relleno" :style="{ transform: `scaleX(${progreso / 100})` }" />
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.barra-progreso {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 3000;
  pointer-events: none;
  overflow: hidden;
  background-color: transparent;
}

.barra-progreso__relleno {
  width: 100%;
  height: 100%;
  transform-origin: 0 50%;
  background-image: linear-gradient(90deg, var(--bs-primary), var(--bs-info-400));
  box-shadow: 0 0 6px rgba(var(--bs-primary-rgb), 0.45);
  transition: transform 0.18s ease-out;
}

.barra-progreso-enter-active,
.barra-progreso-leave-active {
  transition: opacity 0.15s ease;
}

.barra-progreso-enter-from,
.barra-progreso-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .barra-progreso__relleno {
    transition: none;
  }
}
</style>
