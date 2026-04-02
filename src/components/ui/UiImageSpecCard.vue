<template>
  <div
    :class="[
      'hs-glass-surface hs-interactive overflow-hidden',
      selected ? 'hs-is-selected' : '',
      disabled ? 'hs-is-disabled' : '',
      rounded ? 'rounded-2xl' : 'rounded-lg',
    ]"
  >
    <div :class="['hs-image-frame', ratioClass]">
      <img :src="src" :alt="title" />
    </div>
    <div class="px-4 pb-4 pt-3">
      <h4 class="hs-type-meta text-[#0f172a] dark:text-white">{{ title }}</h4>
      <p class="mt-1 hs-type-caption text-[#666666] dark:text-zinc-400">{{ desc }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  src: { type: String, required: true },
  title: { type: String, default: "图片规范" },
  desc: { type: String, default: "16:9，圆角，封面裁切，支持 hover 放大" },
  ratio: { type: String, default: "16/9" }, // 16/9 | 4/3 | 1/1
  rounded: { type: Boolean, default: true },
  selected: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
});

const ratioClass = computed(() => {
  if (props.ratio === "1/1") return "aspect-square";
  if (props.ratio === "4/3") return "aspect-[4/3]";
  return "aspect-video";
});
</script>
