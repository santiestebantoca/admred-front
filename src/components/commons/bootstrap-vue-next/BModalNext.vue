<script setup>
/**
 * BModalNext — `BModal` que al minimizarse **no desaparece ni deja un elemento
 * aparte**: el propio modal se queda en pantalla, sin backdrop y con el cuerpo y
 * el pie ocultos, recolocado como una cápsula en la parte inferior.
 *
 * La API es la de `BModal` (todo lo no declarado se reenvía tal cual, sin
 * `v-bind="$attrs"` porque el componente tiene un único nodo raíz) más:
 * - `capsule-title`: activa la característica y es el texto que muestra el
 *   encabezado mientras está minimizado. El botón de minimizar pasa entonces a
 *   restaurar, y pulsar la barra también restaura.
 * - El encabezado es propio **sólo cuando hay cápsula**; sin `capsule-title` se
 *   reenvía el slot `header` del consumidor y el encabezado lo pinta BVN con sus
 *   props (`headerCloseLabel`, `titleClass`, `titleTag`...), igual que en
 *   `BModal`. Con cápsula, `header-close` no se usa.
 *
 * Diferencias con BModalPlus: allí el modal se oculta del todo
 * (`d-none`) y aparece una cápsula flotante aparte, teleportada a `body`.
 */
import { computed, ref, useTemplateRef, watch } from 'vue'

defineOptions({ name: 'BModalNext' })

const model = defineModel({ type: Boolean, default: false })

const props = defineProps({
  /** Título del encabezado. */
  title: { type: String, default: undefined },
  /** Texto de la cápsula. Al indicarlo, el modal se puede minimizar. */
  capsuleTitle: { type: String, default: undefined },
  /** Clases del contenedor `.modal`. Se añade `b-capsule-modal--minimized` al minimizar. */
  modalClass: { type: [String, Array, Object], default: undefined },
  /** Prop de BModal: no renderiza el backdrop. */
  noBackdrop: { type: Boolean, default: false },
  /** Prop de BModal: sin trampa de foco. Se libera mientras está minimizado. */
  noTrap: { type: Boolean, default: false }
})

const modal = useTemplateRef('modal')

// --- Minimizar -------------------------------------------------------------
const minimized = ref(false)
const hasCapsule = computed(() => props.capsuleTitle !== undefined && props.capsuleTitle !== null)

const minimize = () => {
  minimized.value = true
}
const restore = () => {
  minimized.value = false
}
const toggle = () => {
  minimized.value = !minimized.value
}
const onHeaderClick = () => {
  if (minimized.value) restore()
}

// Al cerrarse o reabrirse, el modal vuelve a mostrarse completo.
watch(model, () => {
  minimized.value = false
})

/**
 * Minimizar no oculta el modal por su API (eso emitiría `hidden` y cambiaría el
 * `v-model` del padre): el modal sigue "mostrado" y sólo cambia de aspecto con
 * clases CSS, así que el contenido no se desmonta y conserva su estado.
 */
const layout = computed(() => ({
  modalClass: [props.modalClass, { 'b-capsule-modal--minimized': minimized.value }],
  noBackdrop: props.noBackdrop || minimized.value,
  noTrap: props.noTrap || minimized.value
}))
</script>

<template>
  <BModal ref="modal" v-model="model" :title="title" :modal-class="layout.modalClass"
    :no-backdrop="layout.noBackdrop" :no-trap="layout.noTrap">
    <!-- Con cápsula, el encabezado es nuestro; sin ella, el de BVN. -->
    <template v-if="hasCapsule" #header="{ close, id }">
      <div class="b-capsule-modal__header" @click="onHeaderClick">
        <h5 :id="`${id}-label`" class="modal-title">
          <slot name="title">{{ minimized ? capsuleTitle : title }}</slot>
        </h5>
        <BCloseButton class="b-capsule-modal__toggle"
          :class="{ 'b-capsule-modal__toggle--restore': minimized }"
          :aria-label="minimized ? 'Restaurar' : 'Minimizar'" @click.stop="toggle()" />
        <BCloseButton class="b-capsule-modal__close" :aria-label="$attrs.headerCloseLabel || 'Cerrar'"
          @click.stop="close()" />
      </div>
    </template>
    <template v-else #header="scope">
      <slot name="header" v-bind="scope" />
    </template>

    <slot />

    <template v-if="$slots.title" #title>
      <slot name="title" />
    </template>
    <template v-if="$slots['header-close']" #header-close="scope">
      <slot name="header-close" v-bind="scope" />
    </template>
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
    <template v-if="$slots.backdrop" #backdrop="scope">
      <slot name="backdrop" v-bind="scope" />
    </template>
    <template v-if="$slots.ok" #ok="scope">
      <slot name="ok" v-bind="scope" />
    </template>
    <template v-if="$slots.cancel" #cancel="scope">
      <slot name="cancel" v-bind="scope" />
    </template>
  </BModal>
</template>

<!-- Estilos globales a propósito: hay que alcanzar nodos que renderiza BModal
     (`.modal-dialog`, `.modal-body`, `.modal-footer`), fuera del alcance de
     `scoped`. Todo va anclado a las clases propias `b-capsule-modal*`, así que
     no afecta a ningún otro modal. -->
<style>
/* --- Encabezado (título + minimizar + cerrar) --------------------------- */
.b-capsule-modal__header {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  width: 100%;
}

.b-capsule-modal__header .modal-title {
  margin: 0 auto 0 0;
}

/* Botón minimizar/restaurar: el `btn-close` de Bootstrap con otro icono. */
.b-capsule-modal__toggle {
  --bs-btn-close-bg: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8'/%3e%3c/svg%3e");
}

.b-capsule-modal__toggle--restore {
  --bs-btn-close-bg: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath fill-rule='evenodd' d='M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z'/%3e%3c/svg%3e");
}

/* --- Cápsula ------------------------------------------------------------ */

/* El `.modal` ocupa toda la ventana: sin esto, la capa transparente se comería
   los clics de la página que queda debajo. */
.modal.b-capsule-modal--minimized {
  pointer-events: none;
}

/* Recoloca el diálogo abajo al centro. La especificidad (0,3,0) gana a las
   clases de tamaño de Bootstrap (`.modal-lg`, `.modal-fullscreen-sm-down`...),
   que también son (0,2,0) dentro de su media query. */
.modal.b-capsule-modal--minimized .modal-dialog {
  pointer-events: auto;
  position: fixed;
  left: 50%;
  top: auto;
  bottom: 18px;
  margin: 0;
  width: auto;
  max-width: min(90vw, 320px);
  min-height: 0;
  transform: translateX(-50%);
}

.modal.b-capsule-modal--minimized .modal-content {
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 28px;
  background-color: rgb(139, 212, 214);
  overflow: hidden;
  cursor: pointer;
}

.modal.b-capsule-modal--minimized .modal-header {
  padding: 8px 10px 8px 14px;
  border-bottom: 0;
}

.modal.b-capsule-modal--minimized .modal-title {
  font-weight: 600;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Cuerpo y pie fuera de la vista y del orden de tabulación. `display: none` (y no
   `visibility`) es lo que los saca del foco; el estado se conserva porque el
   contenido sigue montado. */
.modal.b-capsule-modal--minimized .modal-body,
.modal.b-capsule-modal--minimized .modal-footer {
  display: none;
}
</style>
