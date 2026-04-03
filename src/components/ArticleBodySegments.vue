<script setup>
/**
 * 渲染 portableTextToArticleSegments 的输出（内联 HTML 由本组件生成，已转义文本 + 安全链接）。
 */
defineProps({
  segments: {
    type: Array,
    default: () => [],
  },
  /** 正文段落/标题的公共 class */
  textClass: {
    type: String,
    default:
      "mt-4 text-[15px] leading-8 text-zinc-600 dark:text-zinc-300 [&_a]:text-[#3d59ff] dark:[&_a]:text-[#7c8cff]",
  },
});
</script>

<template>
  <template v-for="(seg, idx) in segments" :key="`ab-${idx}`">
    <component
      v-if="seg.kind === 'html'"
      :is="seg.tag"
      :class="textClass"
      v-html="seg.html"
    />
    <img
      v-else-if="seg.kind === 'image'"
      :src="seg.src"
      :alt="seg.alt"
      class="mt-4 w-full max-h-[480px] rounded-xl border border-zinc-200 object-contain dark:border-zinc-700"
      loading="lazy"
    />
  </template>
</template>
