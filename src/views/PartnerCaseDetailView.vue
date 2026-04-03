<template>
  <main id="top" class="relative z-[1]">
    <PageHeroBanner
      title-key="partners_sec_cases"
      desc-key="partners_page_banner_desc"
      title-fallback="典型案例详情"
    >
      <template #breadcrumbs>
        <ol class="flex flex-wrap items-center gap-x-1.5">
          <li>
            <RouterLink to="/" class="text-white/80 transition hover:text-white">首页</RouterLink>
          </li>
          <li class="text-white/45" aria-hidden="true">›</li>
          <li>
            <RouterLink :to="{ name: 'partners', hash: '#partners-cases' }" class="text-white/80 transition hover:text-white">典型案例</RouterLink>
          </li>
          <li class="text-white/45" aria-hidden="true">›</li>
          <li class="text-white/95" aria-current="page">案例详情</li>
        </ol>
      </template>
    </PageHeroBanner>

    <section class="scroll-mt-28 border-b border-zinc-200/90 bg-white py-12 dark:border-zinc-800 dark:bg-[#0f1219] sm:py-16">
      <div class="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div class="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
          <article class="min-w-0 flex-1">
            <div v-if="activeCase" class="overflow-hidden rounded-2xl border border-zinc-200 bg-white/90 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/50">
              <div class="p-6 sm:p-8">
                <h1 class="text-[28px] font-bold leading-snug text-zinc-900 dark:text-white">{{ caseTitleForLang(activeCase, lang) }}</h1>
                <div class="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-zinc-400">
                  <span>文章出处：{{ activeCase.source }}</span>
                  <span>网责任编辑：{{ activeCase.editor }}</span>
                  <span>阅读：{{ formatViews(activeCase.views) }}</span>
                  <time>发布时间：{{ activeCase.publishDate }}</time>
                </div>
                <p
                  v-if="!activeCase.cmsContentOnly && caseSummaryForLang(activeCase, lang)"
                  class="mt-4 text-[15px] leading-8 text-zinc-600 dark:text-zinc-300"
                >
                  {{ caseSummaryForLang(activeCase, lang) }}
                </p>
                <ArticleBodySegments v-if="bodySegments.length" :segments="bodySegments" />
                <p
                  v-else
                  v-for="(p, idx) in detailParagraphs"
                  :key="`p-${idx}`"
                  class="mt-4 text-[15px] leading-8 text-zinc-600 dark:text-zinc-300"
                >
                  {{ p }}
                </p>
                <div class="mt-8 flex flex-wrap items-center gap-3 border-t border-zinc-200 pt-6 dark:border-zinc-700">
                  <RouterLink
                    :to="{ name: 'partners', hash: '#partners-cases' }"
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
              <p class="text-zinc-600 dark:text-zinc-300">未找到该案例。</p>
            </div>

            <div class="mt-6 rounded-2xl border border-zinc-200 bg-white/90 p-5 dark:border-zinc-700 dark:bg-zinc-900/40 sm:p-6">
              <div class="grid grid-cols-1 gap-3 text-[15px] text-zinc-700 dark:text-zinc-300">
                <RouterLink
                  v-if="prevCase"
                  :to="{ name: 'partners-case-detail', query: { id: prevCase.id, from: 'partners' } }"
                  class="transition hover:text-[#3d59ff]"
                >
                  上一篇：{{ caseTitleForLang(prevCase, lang) }}
                </RouterLink>
                <span v-else class="text-zinc-400">上一篇：暂无</span>
                <RouterLink
                  v-if="nextCase"
                  :to="{ name: 'partners-case-detail', query: { id: nextCase.id, from: 'partners' } }"
                  class="transition hover:text-[#3d59ff]"
                >
                  下一篇：{{ caseTitleForLang(nextCase, lang) }}
                </RouterLink>
                <span v-else class="text-zinc-400">下一篇：暂无</span>
              </div>
            </div>

            <div class="mt-8 rounded-2xl border border-zinc-200 bg-white/90 p-5 dark:border-zinc-700 dark:bg-zinc-900/40 sm:p-6">
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

          <aside class="w-full shrink-0 space-y-6 lg:w-[300px]">
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
import ArticleBodySegments from "../components/ArticleBodySegments.vue";
import PageHeroBanner from "../components/PageHeroBanner.vue";
import { portableTextToArticleSegments } from "../cms/portableTextRender.js";
import { cmsTick } from "../cms/cmsTick.js";
import { getNewsItems, compareNewsByPinnedThenDate, newsTitleForLang } from "../cms/news.js";
import {
  getPartnerCaseArticles,
  caseTitleForLang,
  caseSummaryForLang,
  caseContentForLang,
  casePortableForLang,
} from "../cms/partnersPage.js";

const route = useRoute();
const lang = inject("hisunLang", ref("zh"));

const allCases = computed(() => {
  cmsTick.value;
  return getPartnerCaseArticles();
});

const newsCatalog = computed(() => {
  cmsTick.value;
  return getNewsItems();
});

const activeCase = computed(() => {
  const id = String(route.query.id ?? "");
  const list = allCases.value;
  return list.find((x) => x.id === id) ?? list[0];
});

const activeIndex = computed(() =>
  allCases.value.findIndex((x) => x.id === activeCase.value?.id)
);

const prevCase = computed(() => {
  const list = allCases.value;
  const idx = activeIndex.value;
  if (idx <= 0) return null;
  return list[idx - 1];
});

const nextCase = computed(() => {
  const list = allCases.value;
  const idx = activeIndex.value;
  if (idx < 0 || idx >= list.length - 1) return null;
  return list[idx + 1];
});

const detailParagraphs = computed(() => {
  const c = activeCase.value;
  if (!c) return [];
  if (c.cmsContentOnly) {
    const lines = caseContentForLang(c, lang.value);
    if (lines.length) return lines.map((x) => String(x).trim()).filter(Boolean);
  }
  return [
    `项目聚焦于${caseTitleForLang(c, lang.value)}，以可持续交付和分阶段上线为原则，兼顾业务连续性与技术演进。`,
    `围绕“${caseSummaryForLang(c, lang.value)}”这一目标，团队从架构设计、数据治理、运维保障三方面同步推进，并形成标准化实施方法。`,
    "上线后系统在稳定性、处理效率与合规可审计性方面持续提升，为后续能力扩展打下了统一底座。",
    ...(Array.isArray(c.content) ? c.content : []),
  ];
});

const bodySegments = computed(() => {
  const c = activeCase.value;
  if (!c?.cmsContentOnly) return [];
  const raw = casePortableForLang(c, lang.value);
  if (!raw || !Array.isArray(raw)) return [];
  return portableTextToArticleSegments(raw);
});

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
  const c = activeCase.value;
  if (!c) return [];
  const source = `${c.title}${c.summary}${detailParagraphs.value.join("")}`;
  const filtered = newsCatalog.value
    .map((n) => ({
      ...n,
      sim: overlapRatio(source, `${n.title}${n.desc}`),
    }))
    .filter((n) => n.sim >= 0.3)
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
