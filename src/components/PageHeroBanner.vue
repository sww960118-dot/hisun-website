<template>
  <section
    id="banner"
    class="relative w-full overflow-hidden border-b border-white/10 bg-slate-900"
    style="min-height: min(480px, 78vh)"
  >
    <div
      class="absolute inset-0 z-0 bg-cover bg-center"
      :style="{ backgroundImage: `url(${imageUrl})` }"
      aria-hidden="true"
    />
    <div class="banner-scrim pointer-events-none absolute inset-0 z-[2]" aria-hidden="true"></div>

    <div
      class="relative z-10 mx-auto flex min-h-[min(480px,78vh)] max-w-[1200px] items-center justify-center px-4 py-14 sm:px-6"
    >
      <div class="w-full max-w-3xl text-center">
        <h1
          class="reveal text-3xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-5xl"
          :data-i18n="titleKey"
        >
          {{ titleFallback }}
        </h1>
        <p class="hs-text-banner-desc reveal mt-5 text-slate-200 delay-75" :data-i18n="descKey"></p>
      </div>
    </div>

    <nav
      class="absolute bottom-6 left-4 z-20 max-lg:max-w-[calc(100%-2rem)] text-[12px] leading-normal text-white/80 lg:left-[360px]"
      aria-label="breadcrumb"
    >
      <slot name="breadcrumbs" />
    </nav>
  </section>
</template>

<script setup>
defineProps({
  titleKey: { type: String, required: true },
  descKey: { type: String, required: true },
  titleFallback: { type: String, default: "" },
  imageUrl: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=1920&q=80",
  },
});
</script>
