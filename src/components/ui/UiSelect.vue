<template>
  <div ref="rootRef" class="ui-select" :class="{ 'is-open': isOpen, 'is-error': error, 'is-disabled': disabled }">
    <button
      ref="triggerRef"
      type="button"
      class="ui-select__trigger"
      :disabled="disabled"
      @click="toggleOpen"
      @keydown.down.prevent="openMenu"
      @keydown.enter.prevent="toggleOpen"
      @keydown.esc.prevent="closeMenu"
    >
      <span class="ui-select__value">{{ selectedLabel }}</span>
      <span class="ui-select__chevron" aria-hidden="true">
        <svg class="ui-select__chevron-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10.7002 11.5333L16.6668 5.61664C16.8566 5.43235 17.1107 5.32927 17.3752 5.32927C17.6397 5.32927 17.8938 5.43235 18.0835 5.61664C18.1788 5.70838 18.2546 5.81839 18.3063 5.9401C18.3581 6.06181 18.3848 6.19271 18.3848 6.32497C18.3848 6.45723 18.3581 6.58813 18.3063 6.70984C18.2546 6.83155 18.1788 6.94156 18.0835 7.0333L10.7502 14.3666C10.5604 14.5509 10.3063 14.654 10.0418 14.654C9.77732 14.654 9.52323 14.5509 9.33349 14.3666L2.01683 7.0333C1.92107 6.94012 1.84496 6.82869 1.79299 6.7056C1.74102 6.58251 1.71425 6.45025 1.71425 6.31664C1.71425 6.18302 1.74102 6.05076 1.79299 5.92767C1.84496 5.80458 1.92107 5.69315 2.01683 5.59997C2.10973 5.50674 2.22012 5.43277 2.34168 5.3823C2.46323 5.33183 2.59355 5.30585 2.72516 5.30585C2.85678 5.30585 2.98709 5.33183 3.10865 5.3823C3.2302 5.43277 3.34059 5.50674 3.4335 5.59997L9.28349 11.5333C9.37523 11.6286 9.48525 11.7044 9.60696 11.7561C9.72867 11.8079 9.85957 11.8346 9.99183 11.8346C10.1241 11.8346 10.255 11.8079 10.3767 11.7561C10.4984 11.7044 10.6084 11.6286 10.7002 11.5333Z"
            fill="currentColor"
          />
        </svg>
      </span>
    </button>
    <Teleport to="body">
      <div v-if="isOpen" ref="panelRef" class="ui-select__panel" :style="panelStyle" role="listbox">
        <button
          v-for="opt in normalizedOptions"
          :key="`opt-${String(opt.value)}`"
          type="button"
          class="ui-select__option"
          :class="{ 'is-selected': String(opt.value) === String(modelValue) }"
          @click="selectValue(opt.value)"
        >
          {{ opt.label }}
        </button>
        <p v-if="normalizedOptions.length === 0" class="ui-select__empty">{{ emptyText }}</p>
      </div>
    </Teleport>
    <p v-if="errorText && error" class="ui-select__error">{{ errorText }}</p>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = defineProps({
  modelValue: { type: [String, Number], default: "" },
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: "请选择" },
  disabled: { type: Boolean, default: false },
  error: { type: Boolean, default: false },
  errorText: { type: String, default: "" },
  emptyText: { type: String, default: "暂无可选项" },
});

const emit = defineEmits(["update:modelValue", "change", "open", "close"]);

const rootRef = ref(null);
const triggerRef = ref(null);
const panelRef = ref(null);
const isOpen = ref(false);
const panelStyle = ref({});

function updatePanelPosition() {
  const el = triggerRef.value;
  if (!el) return;
  const r = el.getBoundingClientRect();
  panelStyle.value = {
    position: "fixed",
    top: `${Math.round(r.bottom + 4)}px`,
    left: `${Math.round(r.left)}px`,
    width: `${Math.round(r.width)}px`,
    zIndex: "10050",
  };
}

const normalizedOptions = computed(() =>
  (props.options || []).map((it) =>
    typeof it === "object" ? { label: String(it.label ?? it.value ?? ""), value: it.value ?? "" } : { label: String(it), value: it }
  )
);

const selectedLabel = computed(() => {
  const found = normalizedOptions.value.find((x) => String(x.value) === String(props.modelValue));
  return found?.label || props.placeholder;
});

function openMenu() {
  if (props.disabled) return;
  isOpen.value = true;
  emit("open");
}

function closeMenu() {
  if (!isOpen.value) return;
  isOpen.value = false;
  emit("close");
}

function toggleOpen() {
  if (isOpen.value) closeMenu();
  else openMenu();
}

function selectValue(value) {
  emit("update:modelValue", value);
  emit("change", value);
  closeMenu();
}

function onDocClick(e) {
  if (!isOpen.value) return;
  if (rootRef.value?.contains(e.target)) return;
  if (panelRef.value?.contains(e.target)) return;
  closeMenu();
}

watch(isOpen, async (open) => {
  if (open) {
    await nextTick();
    updatePanelPosition();
    window.addEventListener("scroll", updatePanelPosition, true);
    window.addEventListener("resize", updatePanelPosition);
  } else {
    window.removeEventListener("scroll", updatePanelPosition, true);
    window.removeEventListener("resize", updatePanelPosition);
    panelStyle.value = {};
  }
});

onMounted(() => {
  document.addEventListener("mousedown", onDocClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", onDocClick);
  window.removeEventListener("scroll", updatePanelPosition, true);
  window.removeEventListener("resize", updatePanelPosition);
});
</script>

<style scoped>
.ui-select {
  position: relative;
  min-width: 170px;
  z-index: 20;
}
.ui-select__trigger {
  width: 100%;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  color: #374151;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  font-size: 14px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.ui-select__value {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-select__chevron {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-left: 8px;
  color: #9ca3af;
}
.ui-select__chevron-icon {
  width: 14px;
  height: 14px;
  display: block;
  transition: transform 0.2s ease;
}
.ui-select.is-open .ui-select__chevron-icon {
  transform: rotate(180deg);
}
.ui-select.is-open .ui-select__chevron {
  color: #3d59ff;
}
.ui-select.is-open .ui-select__trigger,
.ui-select__trigger:focus-visible {
  outline: none;
  border-color: #3d59ff;
  box-shadow: 0 0 0 1px rgba(61, 89, 255, 0.2);
}
.ui-select__panel {
  /* position/top/left/width/z-index 由内联样式（Teleport + fixed）控制，避免撑开父级布局 */
  max-height: min(320px, 70vh);
  overflow-y: auto;
  border: 1px solid #dbe0ea;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.16);
}
.ui-select__option {
  width: 100%;
  text-align: left;
  border: 0;
  background: #fff;
  color: #374151;
  font-size: 14px;
  padding: 8px 12px;
}
.ui-select__option:hover {
  background: #fff;
  color: #3d59ff;
}
.ui-select__option.is-selected {
  background: #3d59ff;
  color: #fff;
}
.ui-select__empty {
  padding: 8px 12px;
  font-size: 13px;
  color: #9ca3af;
}
.ui-select.is-error .ui-select__trigger {
  border-color: #ef4444;
  box-shadow: 0 0 0 1px rgba(239, 68, 68, 0.18);
}
.ui-select__error {
  margin-top: 4px;
  color: #ef4444;
  font-size: 12px;
}
.ui-select.is-disabled .ui-select__trigger {
  opacity: 0.55;
  cursor: not-allowed;
}
</style>

<style>
/* html.dark：scoped 内 :global(.dark) .child 会被打成孤立的 .dark{}，故用无 scoped 块 */
html.dark .ui-select__trigger {
  border-color: #334155;
  background: #0b1220;
  color: #e5e7eb;
}
html.dark .ui-select__panel {
  border-color: #334155;
  background: #0b1220;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.45);
}
html.dark .ui-select__option {
  background: #0b1220;
  color: #cbd5e1;
}
html.dark .ui-select__option:hover {
  background: #1e293b;
  color: #7c8cff;
}
html.dark .ui-select__option.is-selected {
  background: #3d59ff;
  color: #fff;
}
html.dark .ui-select__empty {
  color: #94a3b8;
}
html.dark .ui-select__chevron {
  color: #94a3b8;
}
html.dark .ui-select.is-open .ui-select__chevron {
  color: #7c8cff;
}
html.dark .ui-select.is-open .ui-select__trigger,
html.dark .ui-select__trigger:focus-visible {
  border-color: #5f7cff;
  box-shadow: 0 0 0 1px rgba(95, 124, 255, 0.35);
}
</style>
