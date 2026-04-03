<template>
  <div
    class="absolute bottom-0 left-0 right-0 z-30 flex h-20 items-center bg-[rgba(0,0,0,0.4)] text-white"
    role="region"
    aria-label="通知公告"
  >
    <div class="mx-auto flex w-full min-w-0 justify-center px-4 py-2 sm:px-6">
      <!-- PC 最大 850px 居中；移动端全宽自适应；公告文案单行省略 -->
      <div
        class="flex w-full min-w-0 max-w-[min(100%,850px)] flex-wrap items-center gap-x-2 gap-y-1.5 text-[14px] leading-normal sm:flex-nowrap sm:gap-x-3"
      >
        <RouterLink
          v-if="currentNotice"
          :to="noticeDetailTo"
          class="flex min-w-0 flex-1 cursor-pointer items-center rounded-sm text-left text-inherit no-underline transition hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 sm:min-w-[0]"
        >
          <span class="inline-flex h-5 w-5 shrink-0 text-white/90" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5">
              <path d="M11 5L6 9H2v6h4l5 4V5z" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" stroke-linecap="round" />
            </svg>
          </span>
          <span class="ml-2 min-w-0 flex-1 truncate sm:ml-4">{{ currentNoticeLine }}</span>
        </RouterLink>
        <div v-else class="flex min-w-0 flex-1 items-center sm:min-w-[0]">
          <span class="inline-flex h-5 w-5 shrink-0 text-white/90" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5">
              <path d="M11 5L6 9H2v6h4l5 4V5z" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" stroke-linecap="round" />
            </svg>
          </span>
          <span class="ml-2 min-w-0 flex-1 truncate sm:ml-4">{{ currentNoticeLine }}</span>
        </div>
        <span
          class="shrink-0 whitespace-nowrap text-[13px] sm:ml-auto sm:text-[14px]"
          data-i18n="notice_banner_stock"
        ></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { cmsTick } from "../cms/cmsTick.js";
import { getNewsItems, compareNewsByPinnedThenDate } from "../cms/news.js";

const route = useRoute();

const NOTICE_INTERVAL_MS = 5000;
const noticeIndex = ref(0);
let noticeTimer = null;

const noticeNews = computed(() => {
  cmsTick.value;
  return getNewsItems()
    .filter((item) => item.category === "notice")
    .sort(compareNewsByPinnedThenDate);
});

const currentNotice = computed(() => {
  const list = noticeNews.value;
  if (!list.length) return null;
  return list[noticeIndex.value % list.length];
});

const currentNoticeLine = computed(() => {
  const notice = currentNotice.value;
  if (!notice) return "";
  return `${notice.title}：${notice.desc}`;
});

/** 首页 banner 与走进高阳页均展示；详情来源与面包屑随当前路由区分 */
const noticeDetailTo = computed(() => {
  const n = currentNotice.value;
  if (!n) return { name: "home" };
  const base = { id: n.id, nc: "notice" };
  if (route.name === "about") {
    return { name: "news-detail", query: { ...base, from: "news", entry: "nav" } };
  }
  return { name: "news-detail", query: { ...base, from: "home_card" } };
});

onMounted(() => {
  if (noticeNews.value.length <= 1) return;
  noticeTimer = window.setInterval(() => {
    noticeIndex.value = (noticeIndex.value + 1) % noticeNews.value.length;
  }, NOTICE_INTERVAL_MS);
});

onBeforeUnmount(() => {
  if (noticeTimer) {
    window.clearInterval(noticeTimer);
    noticeTimer = null;
  }
});
</script>
