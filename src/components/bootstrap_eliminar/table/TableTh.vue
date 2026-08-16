<script setup>
const props = defineProps({
  label: String,
  order: [String, Boolean],
  orderable: {
    type: Boolean,
    default: true
  }
})
</script>

<template>
  <th class="fw-semibold small" role="button">
    <div class="hstack gap-2">
      <slot />
      <span v-if="label" class="text-truncate" v-text="label" />
      <span v-if="orderable" class="arrow" :class="props.order" />
    </div>
  </th>
</template>

<style scoped>
.arrow {
  width: 20px;
  height: 20px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5"/></svg>');
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0;
  transition: .2s
}

.arrow.asc,
.arrow.desc {
  display: inline-block;
  opacity: .7 !important;
}

.arrow.desc {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4"/></svg>');
}

th:hover .arrow {
  display: inline-block;
  opacity: .4;
}
</style>
