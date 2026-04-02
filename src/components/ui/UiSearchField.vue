<template>
  <div class="ui-search" :class="{ 'is-glow': glowOn, 'is-error': error, 'is-disabled': disabled }">
    <div class="ui-search__inner">
      <input
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        class="ui-search__input"
        @input="$emit('update:modelValue', $event.target.value)"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <button
        type="button"
        class="ui-search__btn"
        :disabled="disabled"
        aria-label="搜索"
        @mouseenter="setHover(true)"
        @mouseleave="setHover(false)"
        @click="$emit('search')"
      >
        <img :src="iconSrc" alt="" class="h-4 w-4 opacity-70" />
      </button>
    </div>
    <p v-if="error && errorText" class="ui-search__msg is-error">{{ errorText }}</p>
    <p v-else-if="showEmptyState" class="ui-search__msg is-empty">{{ emptyText }}</p>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  modelValue: { type: String, default: "" },
  placeholder: { type: String, default: "搜索" },
  disabled: { type: Boolean, default: false },
  error: { type: Boolean, default: false },
  errorText: { type: String, default: "输入格式错误，请检查后重试" },
  showEmptyState: { type: Boolean, default: false },
  emptyText: { type: String, default: "暂无匹配结果，请调整筛选条件" },
  forceGlow: { type: Boolean, default: false },
  iconSrc: { type: String, default: "/icons/search.svg" },
});

defineEmits(["update:modelValue", "search", "focus", "blur"]);

const focusOn = ref(false);
const hoverOn = ref(false);
const hasText = computed(() => String(props.modelValue || "").trim().length > 0);
const glowOn = computed(() => !props.disabled && (props.forceGlow || focusOn.value || hoverOn.value || hasText.value));

function handleFocus(e) {
  focusOn.value = true;
  e.target.select?.();
}

function handleBlur() {
  focusOn.value = false;
}

function setHover(flag) {
  hoverOn.value = flag;
}
</script>

<style scoped>
.ui-search {
  border-radius: 10px;
  padding: 1px;
  background: #e5e7eb;
  transition: background 0.25s ease, box-shadow 0.25s ease;
}
.ui-search.is-glow {
  background: linear-gradient(90deg, #3d59ff 0%, #5f7cff 52%, #8cb6ff 100%);
  box-shadow: 0 0 0 2px rgba(61, 89, 255, 0.14), 0 0 18px rgba(95, 124, 255, 0.26);
}
.ui-search__inner {
  display: inline-flex;
  align-items: center;
  gap: 0;
  background: #fff;
  border-radius: 9px;
  padding-right: 0;
}
.ui-search__input {
  height: 40px;
  min-width: 170px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  padding: 0 12px;
  color: #374151;
  font-size: 14px;
  outline: none;
}
.ui-search__btn {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 0;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.ui-search__btn:hover img {
  opacity: 1;
  filter: brightness(0) saturate(100%) invert(36%) sepia(86%) saturate(2746%) hue-rotate(224deg) brightness(99%) contrast(102%);
}
.ui-search__msg {
  margin-top: 4px;
  font-size: 12px;
}
.ui-search__msg.is-error {
  color: #ef4444;
}
.ui-search__msg.is-empty {
  color: #64748b;
}
.ui-search.is-error .ui-search__input,
.ui-search.is-error .ui-search__btn {
  border-color: transparent;
}
.ui-search.is-disabled .ui-search__inner {
  opacity: 0.55;
}
</style>

<style>
html.dark .ui-search {
  background: #334155;
}
html.dark .ui-search__inner {
  background: #0b1220;
}
html.dark .ui-search__input,
html.dark .ui-search__btn {
  border-color: transparent;
  background: transparent !important;
  color: #e5e7eb !important;
}
html.dark .ui-search__input::placeholder {
  color: #64748b;
}
html.dark .ui-search__msg.is-empty {
  color: #94a3b8;
}

/* 深色模式：搜索按钮图标用白色，提升可见性 */
html.dark .ui-search__btn img {
  opacity: 1;
  filter: brightness(0) invert(1);
}

html.dark .ui-search__btn:hover img {
  opacity: 1;
  filter: brightness(0) invert(1);
}
</style>
