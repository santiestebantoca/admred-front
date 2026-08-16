<script setup>
const model = defineModel()
const props = defineProps({
  ride: { type: Boolean, default: false },
  transitionDuration: { type: String, default: '0.15s' }
})

import { Carousel } from 'bootstrap'
import { watch } from 'vue'

const emit = defineEmits(['slid'])
let carousel
const vCarousel = {
  mounted: el => {
    const carouselItems = el.children[0].children
    if (carouselItems.length) carouselItems[0].classList.add('active')
    carousel = new Carousel(el, { ride: props.ride })
    el.addEventListener('slid.bs.carousel', ev => {
      emit('slid')
      model.value = ev.to
    })
  },
  unmounted: () => carousel.dispose()
}
watch(model, val => carousel.to(val))
</script>

<template>
  <div v-carousel>
    <div class="carousel-inner">
      <slot />
    </div>
  </div>
</template>

<style scoped>
:deep(.carousel-inner>*) {
  transition-duration: v-bind(transitionDuration);
}
</style>
