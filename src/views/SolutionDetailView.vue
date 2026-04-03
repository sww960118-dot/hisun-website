<template>
  <main id="top" class="relative z-[1]">
    <PageHeroBanner
      title-key="solution_detail_page_title"
      desc-key="biz_page_banner_desc"
      title-fallback="方案详情"
      image-url="https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=1920&q=80"
    >
      <template #breadcrumbs>
        <ol class="flex flex-wrap items-center gap-x-1.5">
          <li>
            <RouterLink to="/" class="text-white/80 transition hover:text-white" data-i18n="crumb_home">首页</RouterLink>
          </li>
          <li class="text-white/45" aria-hidden="true">›</li>
          <li>
            <RouterLink :to="{ name: 'business', hash: '#biz-solutions' }" class="text-white/80 transition hover:text-white" data-i18n="nav_biz">
              主营业务
            </RouterLink>
          </li>
          <li class="text-white/45" aria-hidden="true">›</li>
          <li>
            <RouterLink
              :to="{ name: 'business-solutions', query: { tab: backTab } }"
              class="text-white/80 transition hover:text-white"
              data-i18n="biz_page_banner_title"
            >
              解决方案
            </RouterLink>
          </li>
          <li class="text-white/45" aria-hidden="true">›</li>
          <li class="text-white/95" aria-current="page" data-i18n="solution_detail_page_title">方案详情</li>
        </ol>
      </template>
    </PageHeroBanner>

    <section class="scroll-mt-28 border-b border-zinc-200/90 bg-white py-12 dark:border-zinc-800 dark:bg-[#0f1219] sm:py-16">
      <div class="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div class="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
          <article class="min-w-0 flex-1">
            <div v-if="activeSolution" class="overflow-hidden rounded-2xl border border-zinc-200 bg-white/90 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/50">
              <div class="p-6 sm:p-8">
                <h1 class="text-[28px] font-bold leading-snug text-zinc-900 dark:text-white">{{ activeSolution.title }}</h1>
                <div class="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-zinc-400">
                  <span>文章出处：{{ activeSolution.source }}</span>
                  <span>网责任编辑：{{ activeSolution.editor }}</span>
                  <span>阅读：{{ formatViews(activeSolution.views) }}</span>
                  <time>发布时间：{{ activeSolution.publishDate }}</time>
                </div>
                <p class="mt-4 text-[15px] leading-8 text-zinc-600 dark:text-zinc-300">{{ activeSolution.summary }}</p>
                <p
                  v-for="(p, idx) in detailParagraphs"
                  :key="`p-${idx}`"
                  class="mt-4 text-[15px] leading-8 text-zinc-600 dark:text-zinc-300"
                >
                  {{ p }}
                </p>
                <div class="mt-8 flex flex-wrap items-center gap-3 border-t border-zinc-200 pt-6 dark:border-zinc-700">
                  <RouterLink
                    :to="{ name: 'business-solutions', query: { tab: backTab } }"
                    class="hs-more-cta hs-text-button inline-flex shrink-0 items-center gap-2 rounded-2xl border border-[#3d59ff]/35 py-2.5 text-[#3d59ff] no-underline transition dark:border-white/25 dark:text-white"
                  >
                    <span class="hs-more-cta__label">返回列表</span>
                    <svg class="hs-more-cta__arrow h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <path d="M19 12H5m7 7-7-7 7-7" />
                    </svg>
                  </RouterLink>
                </div>
              </div>
            </div>
            <div v-else class="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-700 dark:bg-zinc-900/40">
              <p class="text-zinc-600 dark:text-zinc-300" data-i18n="solution_detail_not_found">未找到该方案。</p>
              <RouterLink
                :to="{ name: 'business-solutions', query: { tab: '0' } }"
                class="mt-4 inline-block text-[#3d59ff] underline dark:text-[#7c8cff]"
                data-i18n="biz_page_banner_title"
              >
                解决方案
              </RouterLink>
            </div>

            <div v-if="activeSolution" class="mt-6 rounded-2xl border border-zinc-200 bg-white/90 p-5 dark:border-zinc-700 dark:bg-zinc-900/40 sm:p-6">
              <div class="grid grid-cols-1 gap-3 text-[15px] text-zinc-700 dark:text-zinc-300">
                <RouterLink v-if="prevSolution" :to="solutionLink(prevSolution.id)" class="transition hover:text-[#3d59ff]">
                  上一篇：{{ prevSolution.title }}
                </RouterLink>
                <span v-else class="text-zinc-400">上一篇：暂无</span>
                <RouterLink v-if="nextSolution" :to="solutionLink(nextSolution.id)" class="transition hover:text-[#3d59ff]">
                  下一篇：{{ nextSolution.title }}
                </RouterLink>
                <span v-else class="text-zinc-400">下一篇：暂无</span>
              </div>
            </div>

            <div v-if="activeSolution" class="mt-8 rounded-2xl border border-zinc-200 bg-white/90 p-5 dark:border-zinc-700 dark:bg-zinc-900/40 sm:p-6">
              <div class="flex items-center justify-between gap-4 border-b border-zinc-200 pb-4 dark:border-zinc-700">
                <h2 class="text-xl font-semibold text-zinc-900 dark:text-white">相关新闻</h2>
                <RouterLink
                  :to="{ name: 'news', query: { from: 'nav' } }"
                  class="hs-more-cta hs-text-button inline-flex shrink-0 items-center gap-2 rounded-2xl border border-[#3d59ff]/35 py-2.5 text-[#3d59ff] no-underline transition dark:border-white/25 dark:text-white"
                >
                  <span class="hs-more-cta__label">了解更多</span>
                  <svg class="hs-more-cta__arrow h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </RouterLink>
              </div>
              <ul class="mt-4 divide-y divide-zinc-100 dark:divide-zinc-800">
                <li v-for="n in relatedNews" :key="`rel-${n.id}`" class="py-3">
                  <RouterLink
                    :to="{ name: 'news-detail', query: { id: n.id, from: 'news', entry: 'nav' } }"
                    class="block text-[15px] leading-6 text-zinc-700 transition hover:text-[#3d59ff] dark:text-zinc-300 dark:hover:text-[#7c8cff]"
                  >
                    {{ newsTitleForLang(n, lang) }}
                  </RouterLink>
                  <p class="mt-1 text-[12px] text-zinc-400">阅读 {{ formatViews(n.views) }}</p>
                </li>
              </ul>
            </div>
          </article>

          <aside v-if="activeSolution" class="w-full shrink-0 space-y-6 lg:w-[300px]">
            <section class="rounded-2xl border border-zinc-200 bg-white/90 p-4 dark:border-zinc-700 dark:bg-zinc-900/40">
              <div class="mb-3 flex items-center justify-between">
                <h3 class="text-base font-semibold text-zinc-900 dark:text-white">热门文章</h3>
                <RouterLink :to="{ name: 'news', query: { from: 'nav' } }" class="text-zinc-400 transition hover:text-[#3d59ff]" aria-label="查看热门文章更多">
                  <span class="text-[22px] leading-none">+</span>
                </RouterLink>
              </div>
              <ul class="space-y-2">
                <li v-for="n in hotArticles" :key="`hot-${n.id}`">
                  <RouterLink
                    :to="{ name: 'news-detail', query: { id: n.id, from: 'news', entry: 'nav' } }"
                    class="line-clamp-1 block text-[14px] leading-6 text-zinc-700 transition hover:text-[#3d59ff] dark:text-zinc-300 dark:hover:text-[#7c8cff]"
                  >
                    {{ newsTitleForLang(n, lang) }}
                  </RouterLink>
                  <p class="text-[12px] text-zinc-400">阅读 {{ formatViews(n.views) }}</p>
                </li>
              </ul>
            </section>

            <section class="rounded-2xl border border-zinc-200 bg-white/90 p-4 dark:border-zinc-700 dark:bg-zinc-900/40">
              <div class="mb-3 flex items-center justify-between">
                <h3 class="text-base font-semibold text-zinc-900 dark:text-white">最新资讯</h3>
                <RouterLink :to="{ name: 'news', query: { from: 'nav' } }" class="text-zinc-400 transition hover:text-[#3d59ff]" aria-label="查看最新资讯更多">
                  <span class="text-[22px] leading-none">+</span>
                </RouterLink>
              </div>
              <ul class="space-y-2">
                <li v-for="n in latestArticles" :key="`latest-${n.id}`">
                  <RouterLink
                    :to="{ name: 'news-detail', query: { id: n.id, from: 'news', entry: 'nav' } }"
                    class="line-clamp-1 block text-[14px] leading-6 text-zinc-700 transition hover:text-[#3d59ff] dark:text-zinc-300 dark:hover:text-[#7c8cff]"
                  >
                    {{ newsTitleForLang(n, lang) }}
                  </RouterLink>
                  <p class="text-[12px] text-zinc-400">阅读 {{ formatViews(n.views) }}</p>
                </li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, inject, ref } from "vue";
import { useRoute } from "vue-router";
import PageHeroBanner from "../components/PageHeroBanner.vue";
import { cmsTick } from "../cms/cmsTick.js";
import { getNewsItems, compareNewsByPinnedThenDate, newsTitleForLang } from "../cms/news.js";
import { SOLUTION_DETAILS } from "../cms/businessSolutionsPage.js";

const route = useRoute();
const lang = inject("hisunLang", ref("zh"));

const newsCatalog = computed(() => {
  cmsTick.value;
  return getNewsItems();
});

const activeSolution = computed(() => {
  const id = String(route.query.id ?? "");
  if (!id) return null;
  return SOLUTION_DETAILS.find((x) => x.id === id) ?? null;
});

const backTab = computed(() => {
  const q = route.query.tab;
  if (q !== undefined && q !== null && String(q) !== "") return String(q);
  const cid = activeSolution.value?.categoryId || "p1";
  const n = parseInt(String(cid).replace(/^p/, ""), 10);
  if (Number.isNaN(n) || n < 1) return "0";
  return String(n - 1);
});

function solutionLink(id) {
  return { name: "solution-detail", query: { id, tab: backTab.value } };
}

const siblingsInCategory = computed(() => {
  const s = activeSolution.value;
  if (!s) return [];
  return SOLUTION_DETAILS.filter((x) => x.categoryId === s.categoryId);
});

const siblingIndex = computed(() => siblingsInCategory.value.findIndex((x) => x.id === activeSolution.value?.id));

const prevSolution = computed(() => {
  const i = siblingIndex.value;
  if (i <= 0) return null;
  return siblingsInCategory.value[i - 1] ?? null;
});

const nextSolution = computed(() => {
  const i = siblingIndex.value;
  const arr = siblingsInCategory.value;
  if (i < 0 || i >= arr.length - 1) return null;
  return arr[i + 1] ?? null;
});

const detailParagraphs = computed(() => activeSolution.value?.content ?? []);

const hotArticles = computed(() =>
  [...newsCatalog.value].sort((a, b) => (Number(b.views) || 0) - (Number(a.views) || 0)).slice(0, 5)
);

const latestArticles = computed(() =>
  [...newsCatalog.value].sort(compareNewsByPinnedThenDate).slice(0, 20)
);

function normalizeText(s) {
  return String(s || "")
    .replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, "")
    .toLowerCase();
}

function bigramSet(s) {
  const text = normalizeText(s);
  const set = new Set();
  for (let i = 0; i < text.length - 1; i += 1) set.add(text.slice(i, i + 2));
  return set;
}

function overlapRatio(a, b) {
  const sa = bigramSet(a);
  const sb = bigramSet(b);
  if (!sa.size || !sb.size) return 0;
  let common = 0;
  for (const token of sa) {
    if (sb.has(token)) common += 1;
  }
  return common / Math.max(1, Math.min(sa.size, sb.size));
}

const relatedNews = computed(() => {
  const s = activeSolution.value;
  if (!s) return [];
  const source = `${s.title}${s.summary}${detailParagraphs.value.join("")}`;
  const filtered = newsCatalog.value
    .map((n) => ({
      ...n,
      sim: overlapRatio(source, `${n.title}${n.desc}`),
    }))
    .filter((n) => n.sim >= 0.22)
    .sort((a, b) => b.sim - a.sim || compareNewsByPinnedThenDate(a, b))
    .slice(0, 6);
  if (filtered.length > 0) return filtered;
  return [...newsCatalog.value].sort(compareNewsByPinnedThenDate).slice(0, 6);
});

function formatViews(value) {
  const num = Number(value) || 0;
  return num.toLocaleString("zh-CN");
}
</script>
