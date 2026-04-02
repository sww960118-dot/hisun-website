<template>
  <component
    :is="as"
    :type="as === 'button' ? type : undefined"
    :disabled="as === 'button' ? disabled : undefined"
    :class="[
      'hs-font-brand hs-interactive inline-flex items-center justify-center rounded-lg border font-bold',
      full ? 'w-full' : '',
      sizeClass,
      toneClass,
      liquid ? 'hs-liquid-hover' : '',
      selected ? 'hs-is-selected' : '',
      disabled ? 'hs-is-disabled' : '',
    ]"
  >
    <slot />
  </component>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  as: { type: String, default: "button" },
  type: { type: String, default: "button" },
  tone: { type: String, default: "outline" }, // outline | solid
  size: { type: String, default: "sm" }, // sm | md | lg
  full: { type: Boolean, default: false },
  liquid: { type: Boolean, default: true },
  selected: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
});

const toneClass = computed(() => {
  if (props.tone === "solid") {
    return "border-transparent bg-[#3d59ff] text-white dark:bg-[#5a74ff]";
  }
  return "border-[#1a1a1a] text-[#1a1a1a] dark:border-white dark:text-white";
});

const sizeClass = computed(() => {
  if (props.size === "lg") return "h-[var(--hs-btn-h-lg)] px-8 text-[14px]";
  if (props.size === "md") return "h-[var(--hs-btn-h-md)] px-7 text-[12px]";
  return "h-[var(--hs-btn-h-sm)] px-6 text-[11px]";
});
</script>
