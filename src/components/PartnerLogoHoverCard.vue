<template>
  <article
    class="group partner-logo-card partner-logo-card--banner relative aspect-[5/3] w-full overflow-hidden rounded-[8px] border border-zinc-200/90 bg-white shadow-sm outline-none transition hover:border-[#3d59ff] focus-visible:ring-2 focus-visible:ring-[#3d59ff]/50 dark:border-zinc-600 dark:bg-zinc-900/95 dark:hover:border-[#3d59ff]"
    tabindex="0"
    :aria-label="name"
  >
    <div class="relative flex h-full min-h-0 flex-col">
      <div
        class="box-border flex h-full min-h-0 w-full flex-1 items-center justify-center bg-white p-1 dark:bg-white"
      >
        <img
          :src="src"
          :alt="name"
          class="max-h-full max-w-full object-contain"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div
        class="partner-logo-card__bar pointer-events-none absolute bottom-0 left-0 right-0 z-10 flex h-[30%] min-h-[26px] translate-y-full items-center justify-center bg-[#3d59ff] px-1 text-white transition-transform duration-300 ease-out group-hover:translate-y-0 group-focus-within:translate-y-0"
      >
        <span class="line-clamp-2 text-center text-[11px] font-semibold leading-tight sm:text-xs">{{
          name
        }}</span>
      </div>
    </div>
  </article>
</template>

<script setup>
defineProps({
  src: { type: String, required: true },
  name: { type: String, required: true },
});
</script>
