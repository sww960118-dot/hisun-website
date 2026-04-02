<template>
  <span
    :class="[
      'inline-flex h-10 w-10 items-center justify-center rounded-full border',
      variantClass,
      liquid ? 'hs-liquid-hover' : '',
    ]"
    aria-hidden="true"
  >
    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  </span>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  variant: { type: String, default: "light" }, // light | dark
  liquid: { type: Boolean, default: true },
});

const variantClass = computed(() => {
  if (props.variant === "dark") {
    return "text-white border-white/45 bg-white/8";
  }
  return "text-[#3d59ff] border-[#3d59ff]/30 bg-white/70";
});
</script>
