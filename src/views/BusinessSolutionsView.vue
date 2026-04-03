<template>
  <main id="top" class="relative z-[1]">
    <PageHeroBanner
      title-key="biz_page_banner_title"
      desc-key="biz_page_banner_desc"
      title-fallback="解决方案"
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
          <li class="text-white/95" aria-current="page" data-i18n="biz_page_banner_title">解决方案</li>
        </ol>
      </template>
    </PageHeroBanner>

    <!-- 与「走进高阳」子导航同构：粘性条 + 居中胶囊 Tab -->
    <nav
      class="sticky top-[64px] z-[30] border-b border-zinc-200/80 bg-white/80 backdrop-blur-xl dark:border-zinc-800 dark:bg-[#12151f]/85 lg:top-[72px]"
      aria-label="解决方案分类"
    >
      <div class="mx-auto flex max-w-[1200px] flex-wrap justify-center gap-2 px-4 py-3 sm:gap-3 sm:px-6">
        <RouterLink
          v-for="cat in categories"
          :key="cat.id"
          :to="{ name: 'business-solutions', query: { tab: String(cat.tabIndex) } }"
          class="hs-text-nav rounded-[8px] px-3 py-2 text-center text-[12px] leading-snug transition sm:px-4 sm:text-[14px] sm:leading-normal"
          :class="
            activeTab === cat.tabIndex
              ? 'bg-[#3d59ff] text-white shadow-lg shadow-[#3d59ff]/25'
              : 'border border-zinc-200/90 bg-white/90 text-zinc-600 hover:-translate-y-0.5 hover:border-[#3d59ff]/40 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-300'
          "
        >
          <span :data-i18n="tabLabelKeys[cat.tabIndex]"></span>
        </RouterLink>
      </div>
    </nav>

    <section class="scroll-mt-28 border-b border-zinc-200/90 bg-zinc-100/70 py-12 dark:border-zinc-800 dark:bg-[#0f1219] sm:py-16">
      <div class="mx-auto max-w-[1200px] px-4 sm:px-6">
        <template v-if="currentCategory">
          <!-- 导语：大标题 + 蓝装饰线 + 通栏正文（无配图，对齐设计稿图3） -->
          <header class="reveal mb-10 text-left">
            <h2 class="hs-text-page-h2 text-[#111827] dark:text-white" :data-i18n="currentCategory.titleKey"></h2>
            <div class="hs-heading-rule mt-3" aria-hidden="true"></div>
            <p
              v-if="currentCategory.introduction"
              class="hs-text-body mt-5 max-w-none whitespace-pre-wrap text-[15px] leading-[1.85] text-[#374151] dark:text-zinc-400"
            >
              {{ currentCategory.introduction }}
            </p>
            <p
              v-else
              class="hs-text-body mt-5 max-w-none text-[15px] leading-[1.85] text-[#374151] dark:text-zinc-400"
              :data-i18n="currentCategory.introKey"
            ></p>
          </header>

          <div class="support-block">
            <div class="support-grid">
              <article
                v-for="(item, idx) in currentCategory.modules"
                :key="item.id"
                class="support-card reveal reveal--from-bottom rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900/60"
                :class="revealStaggerClass(idx)"
              >
                <h3 class="support-card__title text-[24px] font-semibold leading-[1.22] text-[#1f2937] dark:text-white">
                  <template v-if="item.title">{{ item.title }}</template>
                  <span v-else :data-i18n="item.titleKey"></span>
                </h3>
                <p class="support-card__desc text-[14px] leading-7 text-zinc-600 dark:text-zinc-300">
                  {{ item.desc }}
                </p>
                <RouterLink
                  :to="detailRoute(item)"
                  class="support-detail-btn mt-5 inline-flex h-[42px] w-fit items-center justify-center rounded-[8px] border border-[#3d59ff] px-4 text-[14px] font-semibold text-[#3d59ff] no-underline"
                >
                  <span class="support-detail-btn__label">了解详情</span>
                </RouterLink>
              </article>
            </div>
          </div>
        </template>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import PageHeroBanner from "../components/PageHeroBanner.vue";
import { cmsTick } from "../cms/cmsTick.js";
import { resolveBusinessSolutionCategories } from "../cms/businessSolutionsPage.js";

const route = useRoute();
const categories = computed(() => {
  cmsTick.value;
  return resolveBusinessSolutionCategories();
});
const tabLabelKeys = ["biz_1", "biz_2", "biz_3", "biz_4", "biz_5"];
const REVEAL_STAGGER = ["", "delay-75", "delay-100", "delay-150", "delay-200", "delay-300"];

const activeTab = computed(() => {
  const n = parseInt(String(route.query.tab ?? "0"), 10);
  const list = categories.value;
  if (Number.isNaN(n) || n < 0 || n >= list.length) return 0;
  return n;
});

const currentCategory = computed(
  () => categories.value.find((c) => c.tabIndex === activeTab.value) ?? categories.value[0] ?? null,
);

function revealStaggerClass(index) {
  return REVEAL_STAGGER[index % REVEAL_STAGGER.length] || "";
}

function detailRoute(item) {
  const tab = String(activeTab.value);
  if (item.detailKind === "support" && item.supportId) {
    return {
      name: "service-detail",
      query: { id: item.supportId, from: "business-solutions", tab },
    };
  }
  return { name: "solution-detail", query: { id: item.id, tab } };
}
</script>

<style scoped>
.support-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 640px) {
  .support-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .support-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px 24px;
  }
}

.support-card {
  min-height: 200px;
  padding: 22px 20px;
  display: flex;
  flex-direction: column;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease,
    background-color 0.25s ease;
}

.support-card:hover {
  transform: translateY(-4px);
  border-color: #3d59ff;
  background: #3d59ff;
  box-shadow: 0 16px 30px -16px rgba(61, 89, 255, 0.55);
}

.support-card__title,
.support-card__desc {
  transition: color 0.2s ease;
}

.support-card:hover .support-card__title {
  color: #ffffff !important;
}

.support-card:hover .support-card__desc {
  color: rgba(255, 255, 255, 0.7) !important;
}

.support-card:hover .support-detail-btn {
  border-color: #ffffff !important;
  color: #ffffff !important;
}

.support-card__title {
  margin: 0 0 16px 0;
  overflow-wrap: anywhere;
}

.support-card__desc {
  margin: 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
}

.support-detail-btn {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  transition: color 0.2s ease, border-color 0.2s ease;
}

.support-detail-btn::before {
  content: "";
  position: absolute;
  inset: 0;
  background: #3d59ff;
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 0.28s ease;
  z-index: 0;
}

.support-detail-btn:hover::before,
.support-detail-btn:focus-visible::before,
.support-detail-btn:active::before {
  transform: scaleX(1);
}

.support-detail-btn:hover,
.support-detail-btn:focus-visible,
.support-detail-btn:active {
  color: #ffffff;
}
.support-detail-btn__label {
  position: relative;
  z-index: 1;
}
</style>
