<script setup>
/**
 * BModalPlus — un `BModal` que además se puede minimizar, dejando una
 * cápsula flotante (como una ventana minimizada).
 *
 * La API es la de `BModal`: cualquier prop, evento o atributo que no se declare
 * aquí se reenvía tal cual (mismo `v-model`, mismas props `no-*`, mismos eventos
 * `shown`/`hidden`/... y mismos slots `default`/`title`/`footer`/`backdrop`).
 *
 * Lo que añade, al estilo de BVN (`headerCloseLabel`, `okTitle`):
 * - `capsule-title`: activa la característica. Con ella, el encabezado muestra
 *   un botón de minimizar y el modal dibuja una cápsula flotante con ese texto.
 *   Minimizar no es cerrar: no se emite `hidden` ni cambia el `v-model`, así que
 *   el contenido sigue montado y conserva su estado.
 * - El slot `header` lo controla el componente **sólo cuando hay cápsula**. Sin
 *   `capsule-title` no se toca el encabezado: lo pinta BVN con sus propias
 *   props (`headerCloseLabel`, `headerCloseClass`, `titleClass`, `titleTag`,
 *   `titleVisuallyHidden`) y se reenvían los slots `header`, `title` y
 *   `header-close` del consumidor. Con cápsula, en cambio, el encabezado es
 *   propio (título + minimizar + cerrar) y `header-close` no se usa.
 * - Para el interior de la cápsula, el slot `capsule` (recibe
 *   `{ minimized, restore, hide, label }`).
 */
import { computed, ref, useTemplateRef, watch } from 'vue'

defineOptions({ name: 'BModalPlus', inheritAttrs: false })

const model = defineModel({ type: Boolean, default: false })

const props = defineProps({
  /** Título del encabezado (se renderiza como `h5.modal-title`). */
  title: { type: String, default: undefined },
  /** Texto de la cápsula. Al indicarlo, el modal se puede minimizar. */
  capsuleTitle: { type: String, default: undefined },
  /** Clases del contenedor `.modal`. Se añade `d-none` al minimizar. */
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
const hide = () => modal.value?.hide()

// Al cerrarse o reabrirse, el modal vuelve a mostrarse completo.
watch(model, () => {
  minimized.value = false
})

/**
 * Minimizar no oculta el modal por su API (eso emitiría `hidden` y cambiaría
 * el `v-model` del padre): sólo lo saca de la vista con `d-none` y sin backdrop,
 * de modo que el modal sigue "mostrado" y su contenido no se desmonta.
 */
const layout = computed(() => ({
  modalClass: [props.modalClass, { 'd-none': minimized.value }],
  noBackdrop: props.noBackdrop || minimized.value,
  noTrap: props.noTrap || minimized.value
}))
</script>

<template>
  <BModal ref="modal" v-bind="$attrs" v-model="model" :title="title" :modal-class="layout.modalClass"
    :no-backdrop="layout.noBackdrop" :no-trap="layout.noTrap">
    <!-- Con cápsula, el encabezado es nuestro; sin ella, el de BVN. -->
    <template v-if="hasCapsule" #header="{ close, id }">
      <h5 :id="`${id}-label`" class="modal-title">
        <slot name="title">{{ title }}</slot>
      </h5>
      <BCloseButton class="modal-minimize" aria-label="Minimizar" @click="minimize()" />
      <BCloseButton class="modal-close" :aria-label="$attrs.headerCloseLabel || 'Cerrar'" @click="close()" />
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

  <Teleport to="body">
    <Transition name="modal-capsule">
      <div v-if="minimized" class="modal-capsule" @click="restore()">
        <slot name="capsule" :minimized="minimized" :restore="restore" :hide="hide" :label="capsuleTitle">
          <div class="modal-capsule__inner shadow">
            <div class="modal-capsule__title" v-text="capsuleTitle" />
            <IBiArrowUpRightSquare class="text-light" />
            <!-- <BCloseButton aria-label="Cerrar" @click.stop="hide()" /> -->
          </div>
        </slot>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
/* --- Minimizar ---------------------------------------------------------- */
/* Botón minimizar: el mismo `btn-close` de Bootstrap, con un guion en lugar de la X. */
.modal-header .modal-minimize {
  --bs-btn-close-bg: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8'/%3e%3c/svg%3e");
  margin-left: auto;
}

/* Bootstrap empuja el botón de cerrar con `margin-left: auto`; con dos botones
   hay que fijar la separación entre ellos. */
.modal-header .modal-close {
  margin-left: 0.7rem;
}

/* --- Cápsula ------------------------------------------------------------ */
.modal-capsule {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 18px;
  z-index: 2000;
  cursor: pointer;
}

.modal-capsule__inner {
  background: var(--bs-body-bg);
  border-radius: 28px;
  padding: 8px 10px 8px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  background-color: rgb(139, 212, 214);
  transition: all 200ms;

  &:hover {
    background-color: rgb(130, 198, 201);
  }
}

.modal-capsule__title {
  font-weight: 600;
  width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.modal-capsule-enter-active,
.modal-capsule-leave-active {
  transition: opacity 0.15s ease;
}

.modal-capsule-enter-from,
.modal-capsule-leave-to {
  opacity: 0;
}
</style>
