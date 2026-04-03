<template>
  <main id="top" class="relative z-[1]">
    <PageHeroBanner
      title-key="news_page_banner_title"
      desc-key="news_page_banner_desc"
      title-fallback="新闻资讯"
    >
      <template #breadcrumbs>
        <ol class="flex flex-wrap items-center gap-x-1.5">
          <template v-for="(c, i) in listCrumbs" :key="'lc-' + i">
            <li v-if="i > 0" class="text-white/45" aria-hidden="true">›</li>
            <li>
              <RouterLink v-if="c.to" :to="c.to" class="text-white/80 transition hover:text-white">
                <span :data-i18n="c.i18nKey"></span>
              </RouterLink>
              <span
                v-else
                class="text-white/95"
                aria-current="page"
                :data-i18n="c.i18nKey"
              ></span>
            </li>
          </template>
        </ol>
      </template>
    </PageHeroBanner>

    <section class="scroll-mt-28 border-b border-zinc-200/90 bg-white dark:border-zinc-800 dark:bg-[#0b0d12] sm:pb-20">
      <div class="mx-auto max-w-[1200px] px-4 pb-6 pt-14 sm:px-6 sm:pt-20">
        <h2 class="hs-text-page-h2 text-[#0f172a] dark:text-white" data-i18n="sec_news">新闻动态</h2>
        <div class="hs-heading-rule mt-4" aria-hidden="true"></div>
      </div>

      <!-- 与走进高阳子导航同构：8px 圆角 Tab + 粘性顶栏 -->
      <nav
        class="sticky top-[64px] z-[90] border-b border-zinc-200/80 bg-white/80 backdrop-blur-xl dark:border-zinc-800 dark:bg-[#12151f]/85 lg:top-[72px]"
        aria-label="新闻分类"
      >
        <div class="mx-auto flex max-w-[1200px] flex-wrap justify-center gap-2 px-4 py-3 sm:gap-3 sm:px-6">
          <button
            v-for="tab in categoryTabs"
            :key="tab.value"
            type="button"
            class="hs-text-nav rounded-[8px] px-4 py-2 text-[14px] font-medium transition"
            :class="newsCategoryTabClass(tab.value)"
            :data-i18n="tab.labelKey"
            :aria-current="activeCategory === tab.value ? 'true' : undefined"
            @click="setCategory(tab.value)"
          ></button>
        </div>
      </nav>

      <div class="mx-auto max-w-[1200px] px-4 pb-14 pt-10 sm:px-6 sm:pb-20">
        <div
          ref="newsGridRef"
          class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7"
        >
          <a
            v-for="(item, index) in filteredArticles"
            :key="`${listAnimPulse}-${item.id}`"
            href="#"
            class="biz-news-list-card group flex flex-col pb-4 no-underline"
            :class="{ 'news-list-card-enter': listAnimPulse > 0 }"
            :style="listAnimPulse > 0 ? newsCardEnterStyle(index) : undefined"
            @click.prevent="openDetail(item)"
          >
            <div class="biz-news-list-card__media mt-0 overflow-hidden rounded-lg">
              <img :src="item.image" alt="" class="biz-news-list-card__img h-[170px] w-full object-cover transition duration-500" loading="lazy" />
            </div>
            <div class="mt-4">
              <h3 class="biz-news-list-card__title text-[20px] font-medium leading-snug text-[#1f2937] dark:text-zinc-100">{{ item.title }}</h3>
              <p class="mt-3 line-clamp-2 text-[12px] leading-relaxed text-zinc-500 dark:text-zinc-400">{{ item.desc }}</p>
              <div class="mt-2 flex items-center justify-between gap-2 text-[13px] text-zinc-400">
                <time>{{ item.date }}</time>
                <span>阅读 {{ formatViews(item.views) }}</span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageHeroBanner from "../components/PageHeroBanner.vue";
import { cmsTick } from "../cms/cmsTick.js";
import { getNewsItems, compareNewsByPinnedThenDate } from "../cms/news.js";

const route = useRoute();
const router = useRouter();

const categoryTabs = [
  { value: "all", labelKey: "biz_hot_tab_all" },
  { value: "headline", labelKey: "biz_hot_tab_headline" },
  { value: "staff", labelKey: "biz_hot_tab_staff" },
  { value: "notice", labelKey: "biz_hot_tab_notice" },
];

const allowed = new Set(["all", "headline", "staff", "notice"]);

const activeCategory = computed(() => {
  const c = String(route.query.category ?? "all");
  return allowed.has(c) ? c : "all";
});

const listCrumbs = computed(() => {
  if (route.query.from === "business") {
    return [
      { to: "/", i18nKey: "crumb_home" },
      { to: { name: "business" }, i18nKey: "nav_biz" },
      { to: { name: "business", hash: "#biz-hot" }, i18nKey: "news_crumb_hot" },
      { i18nKey: "sec_news" },
    ];
  }
  return [{ to: "/", i18nKey: "crumb_home" }, { i18nKey: "sec_news" }];
});

const filteredArticles = computed(() => {
  cmsTick.value;
  const items = getNewsItems();
  const base =
    activeCategory.value === "all" ? items : items.filter((item) => item.category === activeCategory.value);
  return [...base].sort(compareNewsByPinnedThenDate);
});

/** 切换分类时递增，配合 :key 触发整卡重新入场动画 */
const listAnimPulse = ref(0);

const newsGridRef = ref(null);
/** 与 Tailwind sm:2 / lg:4 列一致，用于按「行」错开 animation-delay */
const gridColumnCount = ref(4);

function gridColsFromWidth(w) {
  if (w < 640) return 1;
  if (w < 1024) return 2;
  return 4;
}

let newsGridResizeObserver;
onMounted(() => {
  const el = newsGridRef.value;
  if (!el || typeof ResizeObserver === "undefined") return;
  const apply = () => {
    gridColumnCount.value = gridColsFromWidth(el.getBoundingClientRect().width);
  };
  apply();
  newsGridResizeObserver = new ResizeObserver(apply);
  newsGridResizeObserver.observe(el);
});

onBeforeUnmount(() => {
  newsGridResizeObserver?.disconnect();
});

watch(
  () => route.query.category,
  (next, prev) => {
    if (String(next ?? "") === String(prev ?? "")) return;
    listAnimPulse.value += 1;
  }
);

function newsCardEnterStyle(index) {
  const col = Math.max(1, gridColumnCount.value);
  const row = Math.floor(index / col);
  return { animationDelay: `${row * 95}ms` };
}

function listQuery(extra = {}) {
  const q = { ...extra };
  const from = route.query.from;
  if (from === "home" || from === "business" || from === "nav") q.from = from;
  return q;
}

/** 与 AboutView tabButtonClass 一致的选中/未选样式 */
function newsCategoryTabClass(value) {
  const on = activeCategory.value === value;
  return on
    ? "bg-[#3d59ff] text-white shadow-lg shadow-[#3d59ff]/25"
    : "border border-zinc-200/90 bg-white/90 text-zinc-600 hover:-translate-y-0.5 hover:border-[#3d59ff]/40 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-300";
}

function setCategory(value) {
  const q = listQuery();
  if (value === "all") delete q.category;
  else q.category = value;
  router.replace({ name: "news", query: q });
}

function openDetail(item) {
  let entry = "home";
  if (route.query.from === "business") entry = "business";
  else if (route.query.from === "nav") entry = "nav";
  const q = { id: item.id, from: "news", entry };
  if (route.query.category) q.nc = String(route.query.category);
  router.push({ name: "news-detail", query: q });
}

function formatViews(value) {
  const num = Number(value) || 0;
  return num.toLocaleString("zh-CN");
}
</script>

<style scoped>
.biz-news-list-card {
  min-width: 0;
}
.biz-news-list-card__title {
  min-height: 56px;
  transition: color 0.2s ease;
}
.biz-news-list-card p {
  min-height: 40px;
}
.biz-news-list-card__img {
  transform-origin: center;
  transition: transform 0.35s ease;
}
.biz-news-list-card__media {
  transition: box-shadow 0.25s ease;
}
.biz-news-list-card:hover .biz-news-list-card__title {
  color: #3d59ff;
}
.biz-news-list-card:hover .biz-news-list-card__img {
  transform: scale(1.15);
}
.biz-news-list-card:hover .biz-news-list-card__media {
  box-shadow: 0 16px 22px -14px rgba(15, 23, 42, 0.55);
}

/* 切换分类后：按行自底部浮入（同行共用 delay，与 grid 列数由 JS 对齐） */
.news-list-card-enter {
  opacity: 0;
  animation: news-list-card-rise 0.52s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes news-list-card-rise {
  from {
    opacity: 0;
    transform: translateY(28px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .news-list-card-enter {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
</style>
