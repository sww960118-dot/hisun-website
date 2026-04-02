<template>
  <article :class="['hs-glass-surface overflow-hidden', rounded ? 'rounded-2xl' : 'rounded-lg']">
    <slot />
  </article>
</template>

<script setup>
defineProps({
  rounded: { type: Boolean, default: true },
});
</script>
