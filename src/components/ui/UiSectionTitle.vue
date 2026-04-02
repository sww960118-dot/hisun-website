<template>
  <div :class="['flex items-center justify-between gap-4', align === 'center' ? 'flex-col sm:flex-row' : '']">
    <h2 class="text-3xl font-extrabold text-[#0f172a] dark:text-white">
      <slot name="title">{{ title }}</slot>
    </h2>
    <component
      :is="moreHref ? 'a' : 'button'"
      v-if="showMore"
      :href="moreHref || undefined"
      :type="moreHref ? undefined : 'button'"
      class="hs-more-cta hs-text-button inline-flex shrink-0 items-center gap-2 rounded-2xl border border-[#3d59ff]/35 py-2.5 text-sm font-bold text-[#3d59ff] no-underline transition dark:border-white/25 dark:text-white"
    >
      <span class="hs-more-cta__label">{{ moreText }}</span>
      <svg class="hs-more-cta__arrow h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </component>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: "" },
  showMore: { type: Boolean, default: true },
  moreText: { type: String, default: "查看更多" },
  /** 若传入则渲染为链接，否则为 button */
  moreHref: { type: String, default: "" },
  align: { type: String, default: "between" },
});
</script>
