<template>
  <div class="group glass-stat-cta flex flex-1 flex-row items-center justify-between gap-4 px-6 py-8 text-white sm:max-w-[280px] sm:flex-none lg:px-8">
    <div class="min-w-0 flex-1">
      <p class="text-[15px] font-semibold leading-snug text-white/95">{{ line }}</p>
      <p class="mt-1 text-[30px] font-bold leading-tight tracking-tight">{{ value }}</p>
    </div>
    <UiArrowCircle variant="dark" />
  </div>
</template>

<script setup>
import UiArrowCircle from "../ui/UiArrowCircle.vue";

defineProps({
  line: { type: String, default: "陪伴全球银行业发展" },
  value: { type: String, default: "25 years" },
});
</script>
