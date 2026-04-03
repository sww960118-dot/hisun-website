<template>
  <UiGlassCard>
    <div class="h-44 overflow-hidden rounded-t-2xl">
      <img :src="image" :alt="title" class="h-full w-full object-cover" loading="lazy" />
    </div>
    <div class="relative flex flex-1 flex-col items-start border-t border-zinc-100/90 pl-4 pr-20 pb-4 pt-3 text-left dark:border-zinc-700/80">
      <h3 class="text-[15px] font-bold leading-snug text-[#0f172a] dark:text-white">{{ title }}</h3>
      <p class="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[#666666] dark:text-zinc-400">{{ desc }}</p>
      <div class="absolute right-6 top-1/2 -translate-y-1/2">
        <UiArrowCircle variant="light" />
      </div>
    </div>
  </UiGlassCard>
</template>

<script setup>
import UiArrowCircle from "../ui/UiArrowCircle.vue";
import UiGlassCard from "../ui/UiGlassCard.vue";

defineProps({
  title: { type: String, default: "新闻标题" },
  desc: { type: String, default: "新闻内容简介，用于展示列表信息密度与层级。" },
  image: { type: String, required: true },
});
</script>
