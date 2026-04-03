<template>
  <main id="top" class="relative z-[1]">
    <PageHeroBanner
      title-key="news_detail_page_banner_title"
      desc-key="news_detail_page_banner_desc"
      title-fallback="新闻详情"
    >
      <template #breadcrumbs>
        <ol class="flex flex-wrap items-center gap-x-1.5">
          <template v-for="(c, i) in detailCrumbs" :key="'dc-' + i">
            <li v-if="i > 0" class="text-white/45" aria-hidden="true">›</li>
            <li>
              <RouterLink v-if="c.to" :to="c.to" class="text-white/80 transition hover:text-white">
                <span :data-i18n="c.i18nKey"></span>
              </RouterLink>
              <span v-else class="text-white/95" aria-current="page" :data-i18n="c.i18nKey"></span>
            </li>
          </template>
        </ol>
      </template>
    </PageHeroBanner>

    <section class="scroll-mt-28 border-b border-zinc-200/90 bg-white py-12 dark:border-zinc-800 dark:bg-[#0f1219] sm:py-16">
      <div class="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div class="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
          <article class="min-w-0 flex-1">
            <div v-if="article" class="overflow-hidden rounded-2xl border border-zinc-200 bg-white/90 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/50">
              <img :src="article.image" alt="" class="h-[260px] w-full object-cover sm:h-[360px]" loading="lazy" />
              <div class="p-6 sm:p-8">
                <h1 class="text-[28px] font-bold leading-snug text-zinc-900 dark:text-white">{{ articleDisplayTitle }}</h1>
                <div class="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-zinc-400">
                  <span>文章出处：{{ articleSource }}</span>
                  <span>网责任编辑：{{ articleEditor }}</span>
                  <span>阅读：{{ formatViews(article.views) }}</span>
                  <time>发布时间：{{ article.date }}</time>
                </div>
                <p v-if="articleLead" class="mt-4 text-[15px] leading-8 text-zinc-600 dark:text-zinc-300">{{ articleLead }}</p>
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
                    :to="backToNewsList"
                    class="hs-more-cta hs-text-button inline-flex shrink-0 items-center gap-2 rounded-2xl border border-[#3d59ff]/35 py-2.5 text-[#3d59ff] no-underline transition dark:border-white/25 dark:text-white"
                  >
                    <span class="hs-more-cta__label" data-i18n="news_back_list">返回列表</span>
                    <svg class="hs-more-cta__arrow h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <path d="M19 12H5m7 7-7-7 7-7" />
                    </svg>
                  </RouterLink>
                </div>
              </div>
            </div>
            <div v-else class="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-700 dark:bg-zinc-900/40">
              <p class="text-zinc-600 dark:text-zinc-300" data-i18n="news_detail_not_found">未找到该新闻。</p>
              <RouterLink
                :to="backToNewsList"
                class="mt-4 inline-block text-[#3d59ff] underline dark:text-[#7c8cff]"
                data-i18n="news_back_list"
              >
                返回新闻列表
              </RouterLink>
            </div>

            <div v-if="article" class="mt-6 rounded-2xl border border-zinc-200 bg-white/90 p-5 dark:border-zinc-700 dark:bg-zinc-900/40 sm:p-6">
              <div class="grid grid-cols-1 gap-3 text-[15px] text-zinc-700 dark:text-zinc-300">
                <RouterLink v-if="prevArticle" :to="{ name: 'news-detail', query: detailQueryFor(prevArticle.id) }" class="transition hover:text-[#3d59ff]">
                  上一篇：{{ newsTitleForLang(prevArticle, lang) }}
                </RouterLink>
                <span v-else class="text-zinc-400">上一篇：暂无</span>
                <RouterLink v-if="nextArticle" :to="{ name: 'news-detail', query: detailQueryFor(nextArticle.id) }" class="transition hover:text-[#3d59ff]">
                  下一篇：{{ newsTitleForLang(nextArticle, lang) }}
                </RouterLink>
                <span v-else class="text-zinc-400">下一篇：暂无</span>
              </div>
            </div>

            <div v-if="article" class="mt-8 rounded-2xl border border-zinc-200 bg-white/90 p-5 dark:border-zinc-700 dark:bg-zinc-900/40 sm:p-6">
              <div class="flex items-center justify-between gap-4 border-b border-zinc-200 pb-4 dark:border-zinc-700">
                <h2 class="text-xl font-semibold text-zinc-900 dark:text-white">相关新闻</h2>
                <RouterLink
                  :to="newsListLinkResolved"
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
                    :to="{ name: 'news-detail', query: detailQueryFor(n.id) }"
                    class="block text-[15px] leading-6 text-zinc-700 transition hover:text-[#3d59ff] dark:text-zinc-300 dark:hover:text-[#7c8cff]"
                  >
                    {{ newsTitleForLang(n, lang) }}
                  </RouterLink>
                  <p class="mt-1 text-[12px] text-zinc-400">阅读 {{ formatViews(n.views) }}</p>
                </li>
              </ul>
            </div>
          </article>

          <aside v-if="article" class="w-full shrink-0 space-y-6 lg:w-[300px]">
            <section class="rounded-2xl border border-zinc-200 bg-white/90 p-4 dark:border-zinc-700 dark:bg-zinc-900/40">
              <div class="mb-3 flex items-center justify-between">
                <h3 class="text-base font-semibold text-zinc-900 dark:text-white">热门文章</h3>
                <RouterLink :to="newsListLinkResolved" class="text-zinc-400 transition hover:text-[#3d59ff]" aria-label="查看热门文章更多">
                  <span class="text-[22px] leading-none">+</span>
                </RouterLink>
              </div>
              <ul class="space-y-2">
                <li v-for="n in hotArticles" :key="`hot-${n.id}`">
                  <RouterLink
                    :to="{ name: 'news-detail', query: detailQueryFor(n.id) }"
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
                <RouterLink :to="newsListLinkResolved" class="text-zinc-400 transition hover:text-[#3d59ff]" aria-label="查看最新资讯更多">
                  <span class="text-[22px] leading-none">+</span>
                </RouterLink>
              </div>
              <ul class="space-y-2">
                <li v-for="n in latestArticles" :key="`latest-${n.id}`">
                  <RouterLink
                    :to="{ name: 'news-detail', query: detailQueryFor(n.id) }"
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
import { computed, inject, ref, watch } from "vue";
import { useRoute } from "vue-router";
import ArticleBodySegments from "../components/ArticleBodySegments.vue";
import PageHeroBanner from "../components/PageHeroBanner.vue";
import { portableTextToArticleSegments } from "../cms/portableTextRender.js";
import { cmsTick } from "../cms/cmsTick.js";
import {
  getNewsItems,
  compareNewsByPinnedThenDate,
  newsTitleForLang,
  newsDescForLang,
  newsContentForLang,
  newsPortableForLang,
} from "../cms/news.js";
import { fetchSanityNewsById } from "../cms/sanity.js";
import { mergeNewsFullItemIntoCms } from "../cms/bootstrapCms.js";

const route = useRoute();
const lang = inject("hisunLang", ref("zh"));

const newsCatalog = computed(() => {
  cmsTick.value;
  return getNewsItems();
});

const article = computed(() => {
  const id = String(route.query.id ?? "");
  if (!id) return null;
  return newsCatalog.value.find((n) => n.id === id) ?? null;
});

/** 首屏新闻为 lite 预取（无 Portable）；进入详情后再补一条全文以渲染富文本与内嵌图 */
watch(
  () => [String(route.query.id ?? ""), route.name, cmsTick.value],
  async ([id, name]) => {
    if (name !== "news-detail" || !id) return;
    const cur = getNewsItems().find((n) => n.id === id);
    if (!cur) return;
    const hasPortable = Array.isArray(cur.contentPortable) && cur.contentPortable.length > 0;
    if (hasPortable) return;
    try {
      const full = await fetchSanityNewsById(id);
      if (full) mergeNewsFullItemIntoCms(full);
    } catch {
      /* 仍可用纯文本段落 */
    }
  },
  { immediate: true },
);

const articleSource = computed(() => article.value?.source ?? "高阳金信官网");
const articleEditor = computed(() => article.value?.editor ?? "高阳金信");

const articleDisplayTitle = computed(() => newsTitleForLang(article.value, lang.value));

/** 列表字段 desc 作导语；后台可另传 content[] 追加正文段落（与案例详情一致） */
const articleLead = computed(() => String(newsDescForLang(article.value, lang.value) || "").trim());

const detailParagraphs = computed(() => newsContentForLang(article.value, lang.value));

const bodySegments = computed(() => {
  const raw = newsPortableForLang(article.value, lang.value);
  if (!raw || !Array.isArray(raw)) return [];
  return portableTextToArticleSegments(raw);
});

function newsListLink(fromVal) {
  const q = { from: fromVal };
  const nc = route.query.nc;
  if (nc) q.category = String(nc);
  return { name: "news", query: q };
}

const newsListLinkResolved = computed(() => {
  const from = String(route.query.from ?? "");
  const entry = String(route.query.entry ?? "home");
  if (from === "news" && entry === "business") return newsListLink("business");
  if (from === "news" && entry === "nav") return newsListLink("nav");
  if (from === "biz_hot") return newsListLink("business");
  return newsListLink("home");
});

const detailCrumbs = computed(() => {
  const from = String(route.query.from ?? "");
  const entry = String(route.query.entry ?? "home");

  if (from === "home_card") {
    return [{ to: "/", i18nKey: "crumb_home" }, { i18nKey: "news_detail_crumb" }];
  }
  if (from === "biz_hot") {
    return [
      { to: "/", i18nKey: "crumb_home" },
      { to: { name: "business" }, i18nKey: "nav_biz" },
      { to: { name: "business", hash: "#biz-hot" }, i18nKey: "news_crumb_hot" },
      { i18nKey: "news_detail_crumb" },
    ];
  }
  if (from === "news") {
    if (entry === "business") {
      return [
        { to: "/", i18nKey: "crumb_home" },
        { to: { name: "business" }, i18nKey: "nav_biz" },
        { to: { name: "business", hash: "#biz-hot" }, i18nKey: "news_crumb_hot" },
        { to: newsListLink("business"), i18nKey: "sec_news" },
        { i18nKey: "news_detail_crumb" },
      ];
    }
    if (entry === "nav") {
      return [
        { to: "/", i18nKey: "crumb_home" },
        { to: newsListLink("nav"), i18nKey: "sec_news" },
        { i18nKey: "news_detail_crumb" },
      ];
    }
    return [
      { to: "/", i18nKey: "crumb_home" },
      { to: newsListLink("home"), i18nKey: "sec_news" },
      { i18nKey: "news_detail_crumb" },
    ];
  }
  return [
    { to: "/", i18nKey: "crumb_home" },
    { to: newsListLink("home"), i18nKey: "sec_news" },
    { i18nKey: "news_detail_crumb" },
  ];
});

const backToNewsList = computed(() => {
  const from = String(route.query.from ?? "");
  const entry = String(route.query.entry ?? "home");
  const nc = route.query.nc ? { category: String(route.query.nc) } : {};
  if (from === "news" && entry === "business")
    return { name: "news", query: { from: "business", ...nc } };
  if (from === "news" && entry === "nav")
    return { name: "news", query: { from: "nav", ...nc } };
  if (from === "biz_hot") return { name: "business", hash: "#biz-hot" };
  return { name: "news", query: { from: "home", ...nc } };
});

function detailQueryFor(id) {
  const q = {
    id,
    from: String(route.query.from ?? "news"),
    entry: String(route.query.entry ?? "nav"),
  };
  if (route.query.nc) q.nc = route.query.nc;
  return q;
}

const articleIndex = computed(() => newsCatalog.value.findIndex((n) => n.id === article.value?.id));

const prevArticle = computed(() => {
  const list = newsCatalog.value;
  const i = articleIndex.value;
  if (i <= 0) return null;
  return list[i - 1];
});

const nextArticle = computed(() => {
  const list = newsCatalog.value;
  const i = articleIndex.value;
  if (i < 0 || i >= list.length - 1) return null;
  return list[i + 1];
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
  const a = article.value;
  if (!a) return [];
  const source = `${a.title}${a.desc}`;
  const catalog = newsCatalog.value;
  const filtered = catalog
    .filter((n) => n.id !== a.id)
    .map((n) => ({
      ...n,
      sim: overlapRatio(source, `${n.title}${n.desc}`),
    }))
    .filter((n) => n.sim >= 0.22)
    .sort((a, b) => b.sim - a.sim || compareNewsByPinnedThenDate(a, b))
    .slice(0, 6);
  if (filtered.length > 0) return filtered;
  return catalog
    .filter((n) => n.id !== a.id)
    .sort(compareNewsByPinnedThenDate)
    .slice(0, 6);
});

function formatViews(value) {
  const num = Number(value) || 0;
  return num.toLocaleString("zh-CN");
}
</script>
