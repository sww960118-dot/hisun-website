<template>
  <main id="top" class="relative z-[1]">
    <!-- Banner：首屏 + 锚点进入「主营业务」模块 -->
    <section
      class="relative w-full overflow-hidden border-b border-white/10 bg-slate-900"
      style="min-height: min(480px, 78vh)"
    >
      <div
        class="absolute inset-0 z-0 bg-cover bg-center"
        style="
          background-image: url(https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=1920&q=80);
        "
        aria-hidden="true"
      />
      <div class="banner-scrim pointer-events-none absolute inset-0 z-[2]" aria-hidden="true"></div>

      <div
        class="relative z-10 mx-auto flex min-h-[min(480px,78vh)] max-w-[1200px] items-center justify-center px-4 py-14 sm:px-6"
      >
        <div class="w-full max-w-3xl text-center">
          <h1
            class="reveal text-3xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-5xl"
            data-i18n="biz_page_banner_title"
          >
            解决方案
          </h1>
          <p class="hs-text-banner-desc reveal mt-5 text-slate-200 delay-75" data-i18n="biz_page_banner_desc"></p>
        </div>
      </div>

      <nav
        class="absolute bottom-6 left-4 z-20 text-[12px] leading-normal text-white/80 max-lg:max-w-[calc(100%-2rem)] lg:left-[360px]"
        aria-label="breadcrumb"
      >
        <ol class="flex flex-wrap items-center gap-x-1.5">
          <li>
            <RouterLink to="/" class="text-white/80 transition hover:text-white" data-i18n="crumb_home">首页</RouterLink>
          </li>
          <li class="text-white/45" aria-hidden="true">›</li>
          <li class="text-white/95" aria-current="page" data-i18n="nav_biz">主营业务</li>
        </ol>
      </nav>
    </section>

    <!-- 主营业务：左侧五块 + 右侧内容（id 避免与首页 #main-business 冲突） -->
    <section
      id="biz-solutions"
      class="scroll-mt-28 border-b border-zinc-200/90 bg-white py-14 dark:border-zinc-800 dark:bg-[#0b0d12] sm:py-20"
    >
      <div class="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div class="reveal text-left">
          <h2 class="hs-text-page-h2 text-[#1a1a1a] dark:text-white" data-i18n="sec_business">主营业务</h2>
          <div class="hs-heading-rule mt-4" aria-hidden="true"></div>
          <p class="hs-text-lead mt-3 max-w-2xl text-[#666666] dark:text-zinc-400" data-i18n="sec_business_sub"></p>
        </div>

        <!-- 左：深蓝竖条 Tab；右：浅灰大圆角卡片（上区左文右图 + 下区四宫格），与截图一致 -->
        <div
          class="mt-10 flex flex-col gap-8 lg:mt-12 lg:grid lg:min-h-0 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:gap-x-8 lg:gap-y-0"
        >
          <nav
            class="reveal reveal--from-left flex w-full shrink-0 flex-col gap-3 sm:gap-3.5 lg:w-[280px] lg:max-w-[280px] lg:gap-3.5"
            aria-label="主营业务方案"
          >
            <button
              v-for="(k, i) in tabLabelKeys"
              :key="k"
              type="button"
              class="hs-text-nav flex w-full items-center justify-center rounded-[10px] px-3 py-4 text-center text-[15px] leading-snug transition sm:px-4 lg:justify-start lg:py-5 lg:text-left"
              :class="
                activeTab === i
                  ? 'bg-[#3d59ff] font-semibold text-white'
                  : 'bg-[#0f172a] text-white hover:bg-[#1e293b] dark:bg-[#0f1219] dark:hover:bg-zinc-800'
              "
              :aria-current="activeTab === i ? 'true' : undefined"
              :data-i18n="k"
              @click="selectTab(i)"
            ></button>
          </nav>

          <div class="reveal reveal--from-right flex min-h-0 min-w-0 flex-col lg:min-h-0" :key="activeTab">
            <div
              class="overflow-hidden rounded-xl border border-zinc-200 bg-[#eef0f3] shadow-[0_1px_3px_rgba(0,0,0,0.06)] dark:border-zinc-600 dark:bg-zinc-800/90"
            >
              <div class="grid grid-cols-1 gap-0 lg:min-h-[280px] lg:grid-cols-2">
                <div
                  class="flex flex-col justify-center bg-[#f4f5f7] text-left lg:bg-[#f4f5f7] pt-8 pl-8 pr-6 pb-8 dark:bg-[#12151f] sm:pr-8 sm:pb-10"
                >
                  <h3
                    class="text-xl font-bold leading-snug text-[#0f172a] sm:text-2xl dark:text-white"
                    :data-i18n="titleKey"
                  ></h3>
                  <p class="hs-text-body mt-4 text-[15px] leading-relaxed text-[#4b5563] dark:text-zinc-400" :data-i18n="descKey"></p>
                  <RouterLink
                    :to="{ name: 'business-solutions', query: { tab: String(activeTab) } }"
                    class="biz-learn-more-btn mt-7 inline-flex w-fit cursor-pointer items-center gap-1.5 rounded-lg border border-[#3d59ff]/55 bg-white px-4 py-2.5 text-[14px] font-medium text-[#3d59ff] shadow-sm transition dark:border-[#3d59ff] dark:bg-transparent dark:text-[#3d59ff] dark:shadow-none"
                  >
                    <span class="biz-learn-more-btn__label" data-i18n="biz_learn_more">了解更多</span>
                    <svg class="biz-learn-more-btn__arrow h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </RouterLink>
                </div>
                <div class="relative min-h-[220px] bg-zinc-300/40 dark:bg-zinc-900/60 lg:min-h-0">
                  <img
                    :src="currentImage"
                    alt=""
                    class="h-full min-h-[220px] w-full object-cover lg:min-h-full"
                    loading="lazy"
                    width="800"
                    height="520"
                  />
                </div>
              </div>
              <div
                class="biz-feature-strip border-t border-zinc-300/80 bg-[#e4e6ea] dark:border-zinc-600 dark:bg-zinc-900/80"
              >
                <!-- 固定 4 列×192px，列/行间距 8px；四边内边距 24px（见 scoped） -->
                <div class="biz-feature-row">
                  <RouterLink
                    v-for="fi in featureIndices"
                    :key="activeTab + '-' + fi"
                    :to="{ name: 'solution-detail', query: { id: `p${activeTab + 1}-f${fi}`, tab: String(activeTab) } }"
                    class="biz-feature-tile group flex shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white px-2 text-center shadow-sm transition-colors duration-200 hover:border-[#3d59ff] hover:bg-[#3d59ff] dark:border-zinc-600 dark:bg-zinc-800 dark:hover:border-[#3d59ff] dark:hover:bg-[#3d59ff]"
                  >
                    <span
                      class="line-clamp-2 max-w-full px-1 text-center text-[12px] font-medium leading-tight text-[#1a1a1a] transition-colors duration-200 group-hover:text-white sm:text-[13px] dark:text-zinc-100 dark:group-hover:text-white"
                      :data-i18n="featureKey(fi)"
                    ></span>
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 咨询与服务 -->
    <section
      id="biz-consult"
      class="scroll-mt-28 relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#1e1540] via-[#2a1f55] to-[#151028] py-16 sm:py-20"
    >
      <div class="pointer-events-none absolute inset-0 opacity-30" aria-hidden="true">
        <div class="absolute -left-20 top-0 h-64 w-64 rounded-full bg-[#3d59ff]/30 blur-3xl"></div>
        <div class="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#35227b]/25 blur-3xl"></div>
      </div>
      <div class="relative z-[1] mx-auto max-w-[1200px] px-4 sm:px-6">
        <div class="reveal text-center lg:text-left">
          <h2 class="hs-text-page-h2 text-white" data-i18n="biz_consult_title">咨询与服务</h2>
          <div class="hs-heading-rule hs-heading-rule--inverse mx-auto mt-4 lg:mx-0" aria-hidden="true"></div>
        </div>
        <div class="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <article
            v-for="n in 4"
            :key="n"
            class="biz-consult-card group reveal reveal--scale block text-center no-underline outline-none transition-[transform] duration-300 ease-out focus-visible:ring-2 focus-visible:ring-[#3d59ff]/60"
            :class="['delay-75', 'delay-100', 'delay-150', 'delay-200'][n - 1]"
            role="link"
            tabindex="0"
            @click="openServiceDetail(n)"
            @keydown.enter.prevent="openServiceDetail(n)"
            @keydown.space.prevent="openServiceDetail(n)"
          >
            <div class="biz-consult-card__preview relative min-h-[140px] w-full overflow-hidden">
              <img
                :src="consultImage(n)"
                :alt="consultImageAlt(n)"
                class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
              <div class="biz-consult-card__overlay absolute inset-x-0 bottom-0 flex justify-center px-3 pb-3">
                <div class="biz-consult-card__actions" role="presentation">
                  <button
                    type="button"
                    class="biz-consult-card__action biz-consult-card__action--inquire"
                    data-i18n="biz_consult_btn_inquire"
                    @click.stop="openConsultDialog"
                  >
                    立即咨询
                  </button>
                  <button
                    type="button"
                    class="biz-consult-card__action biz-consult-card__action--detail"
                    data-i18n="biz_consult_btn_detail"
                    @click.stop="openServiceDetail(n)"
                  >
                    服务详情
                  </button>
                </div>
              </div>
            </div>
            <h3 class="hs-text-card-title mt-3 text-white" :data-i18n="'biz_consult_' + n"></h3>
          </article>
        </div>
      </div>
    </section>

    <div v-if="consultDialogOpen" class="biz-consult-dialog fixed inset-0 z-[120] flex items-center justify-center px-4" @click="closeConsultDialog">
      <div class="biz-consult-dialog__mask absolute inset-0"></div>
      <div class="biz-consult-dialog__panel relative w-full max-w-[420px] rounded-2xl bg-white p-6 text-center shadow-2xl" @click.stop>
        <button type="button" class="biz-consult-dialog__close" aria-label="关闭" @click="closeConsultDialog">×</button>
        <p class="text-[15px] leading-relaxed text-zinc-700" data-i18n="biz_consult_dialog_line1">
          你可扫描下方二维码或拨打XXXX-XXXXXXXX
        </p>
        <p class="mt-1 text-[15px] leading-relaxed text-zinc-700" data-i18n="biz_consult_dialog_line2">我们将为您一对一服务。</p>
        <img src="/img/consult/qr-placeholder.svg" alt="QR placeholder" class="mx-auto mt-4 h-[160px] w-[160px] rounded-md border border-zinc-200 object-cover" />
      </div>
    </div>

    <!-- 合作伙伴 -->
    <section
      id="biz-partners"
      class="scroll-mt-28 border-t border-zinc-200 bg-gradient-to-b from-white to-zinc-50 py-16 dark:border-zinc-800 dark:from-[#0f1219] dark:to-[#0b0d12] sm:py-20"
    >
      <div class="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div class="reveal flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div class="max-w-3xl">
            <h2 class="hs-text-page-h2 text-[#0f172a] dark:text-white" data-i18n="sec_partners">合作伙伴</h2>
            <div class="hs-heading-rule mt-4" aria-hidden="true"></div>
            <p class="hs-text-lead mt-3 text-zinc-600 dark:text-zinc-400" data-i18n="sec_partners_sub"></p>
          </div>
          <RouterLink
            :to="{ name: 'partners', hash: '#partners-clients' }"
            class="hs-more-cta hs-text-button inline-flex shrink-0 items-center gap-2 rounded-2xl border border-[#3d59ff]/35 py-2.5 text-[#3d59ff] no-underline transition dark:border-white/25 dark:text-white"
          >
            <span class="hs-more-cta__label" data-i18n="partners_btn_more">更多客户</span>
            <svg class="hs-more-cta__arrow icon-tone h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </RouterLink>
        </div>
        <div
          class="mx-auto mt-10 grid w-full max-w-[1200px] grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6 md:gap-x-[20.4px] md:gap-y-4"
        >
          <article
            v-for="p in partnerLogos"
            :key="p.src"
            class="reveal reveal--from-bottom partner-logo-card group relative h-[110px] w-full max-w-[183px] justify-self-center overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm outline-none transition hover:-translate-y-1 hover:border-[#3d59ff]/45 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-[#3d59ff]/50 dark:border-zinc-700 dark:bg-zinc-900/80 dark:hover:border-[#3d59ff]/55 md:w-[183px]"
            tabindex="0"
            :aria-label="p.name"
          >
            <div class="flex h-full min-h-0 flex-col">
              <div class="box-border flex min-h-0 flex-1 items-center justify-center bg-white p-1 dark:bg-zinc-900/90">
                <img :src="p.src" :alt="p.name" class="max-h-full max-w-full object-contain" loading="lazy" decoding="async" />
              </div>
              <div
                class="partner-logo-card__bar pointer-events-none absolute bottom-0 left-0 right-0 z-10 flex h-[30%] min-h-[24px] translate-y-full items-center justify-center bg-[#3d59ff] px-1 text-white transition-transform duration-300 ease-out group-hover:translate-y-0 group-focus-within:translate-y-0"
              >
                <span class="line-clamp-2 text-center text-xs sm:text-sm">{{ p.name }}</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section
      id="biz-cta"
      class="biz-cta-section scroll-mt-28 relative overflow-hidden border-t border-white/10"
    >
      <div
        class="absolute inset-0 z-0 bg-cover bg-center"
        style="
          background-image: url('/img/cta/biz-cta-tech-grid-v2.png');
        "
        aria-hidden="true"
      />
      <div class="biz-cta-scrim absolute inset-0 z-[1]"></div>
      <div class="reveal reveal--scale biz-cta-content relative z-[2] mx-auto flex max-w-[1200px] flex-col items-center px-4 text-center sm:px-6">
        <div class="biz-cta-stack w-full max-w-3xl">
          <div class="biz-cta-main">
            <h2 class="reveal reveal--from-bottom biz-cta-title text-white">
              <span class="biz-cta-title__line biz-cta-title__line--regular" data-i18n="biz_cta_title_line1">高阳金信</span>
              <span class="biz-cta-title__line">
                <span class="biz-cta-title__line--regular" data-i18n="biz_cta_title_line2_prefix">专注于</span>
                <span class="biz-cta-title__line--bold" data-i18n="biz_cta_title_line2_bold">服务银行业</span>
              </span>
            </h2>
            <p class="reveal reveal--from-bottom delay-75 biz-cta-subtitle text-white/85" data-i18n="biz_cta_subtitle"></p>
            <button type="button" class="reveal reveal--from-bottom delay-100 biz-cta-mail-btn" aria-label="邮件咨询">
              <span class="biz-cta-mail-btn__bg" aria-hidden="true"></span>
              <span class="biz-cta-mail-btn__icon" aria-hidden="true"></span>
              <span class="biz-cta-mail-btn__label" data-i18n="biz_cta_btn">邮件咨询</span>
            </button>
          </div>
          <p class="reveal reveal--from-bottom delay-150 biz-cta-phone text-white/90" data-i18n="biz_cta_phone_line">尊崇服务热线：010-68452288</p>
        </div>
      </div>
    </section>

    <!-- 热点文章（标题区与合作伙伴同构；右上角查看更多） -->
    <section id="biz-hot" class="scroll-mt-28 border-t border-zinc-200 bg-white py-16 dark:border-zinc-800 dark:bg-[#0f1219] sm:py-20">
      <div class="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div class="reveal flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div class="max-w-3xl">
            <h2 class="hs-text-page-h2 text-[#0f172a] dark:text-white" data-i18n="biz_hot_title">热点文章</h2>
            <div class="hs-heading-rule mt-4" aria-hidden="true"></div>
          </div>
          <a
            :href="hotMoreHref"
            class="hs-more-cta hs-text-button inline-flex shrink-0 items-center gap-2 rounded-2xl border border-[#3d59ff]/35 py-2.5 text-[#3d59ff] no-underline transition dark:border-white/25 dark:text-white"
          >
            <span class="hs-more-cta__label" data-i18n="btn_more">查看更多</span>
            <svg class="hs-more-cta__arrow icon-tone h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <div class="relative mt-10">
          <button
            v-show="hotFilteredArticles.length > 4"
            type="button"
            class="biz-hot-side-btn biz-hot-side-btn--prev hidden lg:inline-flex"
            aria-label="上一条"
            @click="prevHotPage"
          >
            <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
              <path d="M14.5 5.5L8.5 12l6 6.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <button
            v-show="hotFilteredArticles.length > 4"
            type="button"
            class="biz-hot-side-btn biz-hot-side-btn--next hidden lg:inline-flex"
            aria-label="下一条"
            @click="nextHotPage"
          >
            <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
              <path d="M9.5 5.5l6 6.5-6 6.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>

          <div class="biz-hot-preview-track">
            <a
              v-for="(item, idx) in hotRowArticles"
              :key="hotRowStart + '-' + idx + '-' + item.id"
              href="#"
              class="biz-hot-news-card biz-hot-preview-card group flex flex-col pb-4 no-underline"
              @click.prevent="openNewsDetail(item)"
            >
              <div class="biz-hot-news-card__media mt-0 overflow-hidden rounded-lg">
                <img :src="item.image" alt="" class="biz-hot-news-card__img h-[170px] w-full object-cover transition duration-500" loading="lazy" />
              </div>
              <div class="mt-4">
                <h4 class="biz-hot-news-card__title text-[20px] font-medium leading-snug text-[#1f2937] dark:text-zinc-100">{{ item.title }}</h4>
                <p class="mt-3 line-clamp-2 text-[12px] leading-relaxed text-zinc-500 dark:text-zinc-400">{{ item.desc }}</p>
                <time class="mt-2 block text-[13px] text-zinc-400">{{ item.date }}</time>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { PARTNER_LOGOS } from "../cms/partners.js";
import { BUSINESS_TAB_IMAGES, BUSINESS_FEATURE_COUNTS } from "../cms/businessPage.js";
import { NEWS_ITEMS } from "../cms/news.js";

const TAB_COUNT = 5;
const tabLabelKeys = ["biz_1", "biz_2", "biz_3", "biz_4", "biz_5"];

const route = useRoute();
const router = useRouter();
const activeTab = ref(0);
const consultDialogOpen = ref(false);

const partnerLogos = PARTNER_LOGOS;

/** 桌面端一行 4 条时的起始下标（环形，点击左右箭头每次平移 1 条） */
const hotRowStart = ref(0);
const HOT_ROW_SIZE = 4;

const hotNewsCards = NEWS_ITEMS;

const hotFilteredArticles = computed(() =>
  [...hotNewsCards].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
);

const hotRowArticles = computed(() => {
  const list = hotFilteredArticles.value;
  if (!list.length) return [];
  const n = list.length;
  const count = Math.min(HOT_ROW_SIZE, n);
  const start = ((hotRowStart.value % n) + n) % n;
  const arr = [];
  for (let i = 0; i < count; i += 1) {
    arr.push(list[(start + i) % n]);
  }
  return arr;
});

/** 整页打开新闻列表；不带 category，进入后始终默认「全部」 */
const hotMoreHref = computed(() => {
  const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  return `${base}/news?from=business`;
});

function syncTabFromRoute() {
  const q = route.query.tab;
  const n = q === undefined || q === null || q === "" ? 0 : parseInt(String(q), 10);
  if (Number.isNaN(n) || n < 0 || n >= TAB_COUNT) {
    activeTab.value = 0;
  } else {
    activeTab.value = n;
  }
}

watch(() => route.query.tab, syncTabFromRoute, { immediate: true });

/** 刷新（F5）时始终回到第一个方案，不保留 ?tab= */
onMounted(() => {
  try {
    const nav = performance.getEntriesByType?.("navigation")?.[0];
    if (nav && nav.type === "reload") {
      activeTab.value = 0;
      router.replace({ name: "business", query: {}, hash: "" });
    }
  } catch {
    /* ignore */
  }
});

function selectTab(i) {
  router.replace({ name: "business", query: { tab: String(i) }, hash: "" });
}

const titleKey = computed(() => `biz_p${activeTab.value + 1}_title`);
const descKey = computed(() => `biz_p${activeTab.value + 1}_desc`);

const currentImage = computed(() => BUSINESS_TAB_IMAGES[activeTab.value] ?? BUSINESS_TAB_IMAGES[0]);

const featureIndices = computed(() => {
  const n = BUSINESS_FEATURE_COUNTS[activeTab.value] ?? 4;
  return Array.from({ length: Math.max(1, n) }, (_, i) => i + 1);
});

function featureKey(i) {
  return `biz_p${activeTab.value + 1}_f${i}`;
}

const CONSULT_IMAGES = [
  "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
];

function consultImage(n) {
  return CONSULT_IMAGES[n - 1] ?? CONSULT_IMAGES[0];
}

function consultImageAlt(n) {
  return `consult-${n}`;
}

function openServiceDetail(n) {
  router.push({ name: "service-detail", query: { id: String(n) } });
}

function openConsultDialog() {
  consultDialogOpen.value = true;
}

function closeConsultDialog() {
  consultDialogOpen.value = false;
}

function shiftHotRow(step) {
  const list = hotFilteredArticles.value;
  const n = list.length;
  if (n <= 1) return;
  hotRowStart.value = (((hotRowStart.value + step) % n) + n) % n;
}

function prevHotPage() {
  shiftHotRow(-1);
}

function nextHotPage() {
  shiftHotRow(1);
}

function openNewsDetail(item) {
  router.push({ name: "news-detail", query: { id: item.id, from: "biz_hot" } });
}
</script>

<style scoped>
/* 固定尺寸与网格：Tailwind CDN 不会扫描 .vue，任意值类名可能不生效 */
.biz-feature-strip {
  padding: 24px;
  box-sizing: border-box;
}
.biz-feature-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px; /* 列间距与行间距均为 8px */
}
.biz-feature-tile {
  box-sizing: border-box;
  width: 192px;
  min-width: 0;
  height: 60px;
  flex-shrink: 0;
}
@media (min-width: 1024px) {
  .biz-feature-row {
    display: grid;
    grid-template-columns: repeat(4, 192px);
    width: fit-content; /* 总宽 4×192 + 3×8 = 792px */
  }
}

/* 咨询与服务：悬停阴影 + 底部双按钮（渐变胶囊），整卡为链接跳转服务详情占位页 */
.biz-consult-card {
  color: inherit;
  text-decoration: none;
  box-shadow: 0 0 0 rgba(0, 0, 0, 0);
}
.biz-consult-card:hover,
.biz-consult-card:focus-visible {
  transform: translateY(-4px);
}
.biz-consult-card:hover .biz-consult-card__preview,
.biz-consult-card:focus-visible .biz-consult-card__preview {
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.28);
}
.biz-consult-card__overlay {
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.3s ease, transform 0.3s ease;
  pointer-events: none;
}
.biz-consult-card:hover .biz-consult-card__overlay,
.biz-consult-card:focus-visible .biz-consult-card__overlay {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}
.biz-consult-card__actions {
  display: flex;
  width: 238px;
  height: 38px;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 14px rgba(7, 10, 27, 0.35);
}
.biz-consult-card__action {
  display: inline-flex;
  width: 119px;
  height: 38px;
  border: 0;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.2;
  color: #fff;
  white-space: nowrap;
  cursor: pointer;
}
.biz-consult-card__action--inquire {
  background: var(--theme-primary, #3d59ff);
}
.biz-consult-card__action--detail {
  background: var(--theme-secondary, #35227b);
}
.biz-consult-dialog__mask {
  background: rgba(6, 10, 20, 0.56);
}
.biz-consult-dialog__close {
  position: absolute;
  right: 10px;
  top: 8px;
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 9999px;
  background: #f3f4f6;
  color: #374151;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
}
.biz-consult-card__preview {
  aspect-ratio: 4 / 3;
  min-height: 140px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 16px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.06) 100%);
  transition: box-shadow 0.3s ease;
}

/* CTA 背景较亮，增加局部暗化与文字高对比 */
.biz-cta-scrim {
  background:
    linear-gradient(90deg, rgba(10, 24, 54, 0.62) 0%, rgba(10, 24, 54, 0.34) 50%, rgba(10, 24, 54, 0.62) 100%),
    radial-gradient(ellipse at center, rgba(10, 24, 54, 0.26) 0%, rgba(10, 24, 54, 0.58) 100%);
}
.biz-cta-section {
  width: 100%;
  min-height: 404px;
  height: 404px;
}
.biz-cta-content {
  height: 100%;
  padding-top: 64px;
  padding-bottom: 16px;
}
.biz-cta-stack {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}
.biz-cta-main {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.biz-cta-title {
  font-size: 48px;
  line-height: 1.18;
  font-weight: 400;
  letter-spacing: 0.01em;
  text-shadow: 0 2px 10px rgba(7, 18, 44, 0.58);
}
.biz-cta-title__line {
  display: block;
}
.biz-cta-title__line--regular {
  font-weight: 400;
}
.biz-cta-title__line--bold {
  font-weight: 800;
}
.biz-cta-subtitle {
  margin-top: 16px;
  font-size: 16px;
  line-height: 1.5;
  text-shadow: 0 2px 10px rgba(7, 18, 44, 0.52);
}
.biz-cta-mail-btn {
  position: relative;
  isolation: isolate;
  margin-top: 24px;
  width: 130px;
  height: 46px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.42);
  background: rgba(61, 89, 255, 0.78);
  box-shadow: 0 10px 22px rgba(61, 89, 255, 0.35);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  overflow: hidden;
  cursor: pointer;
}
.biz-cta-mail-btn__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: #ffffff;
  transform: translateY(100%);
  transition: transform 0.28s ease;
}
.biz-cta-mail-btn__icon,
.biz-cta-mail-btn__label {
  position: relative;
  z-index: 1;
  transition: color 0.28s ease, filter 0.28s ease;
}
.biz-cta-mail-btn__icon {
  width: 16px;
  height: 16px;
  background-color: #fff;
  mask-image: url("/img/cta/material-symbols_mark-email-unread-outline-sharp.svg");
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-image: url("/img/cta/material-symbols_mark-email-unread-outline-sharp.svg");
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}
.biz-cta-mail-btn__label {
  font-size: 16px;
  line-height: 1;
  font-weight: 600;
  color: #fff;
}
.biz-cta-mail-btn:hover .biz-cta-mail-btn__bg,
.biz-cta-mail-btn:focus-visible .biz-cta-mail-btn__bg {
  transform: translateY(0);
}
.biz-cta-mail-btn:hover .biz-cta-mail-btn__icon,
.biz-cta-mail-btn:focus-visible .biz-cta-mail-btn__icon {
  background-color: var(--theme-primary, #3d59ff);
}
.biz-cta-mail-btn:hover .biz-cta-mail-btn__label,
.biz-cta-mail-btn:focus-visible .biz-cta-mail-btn__label {
  color: var(--theme-primary, #3d59ff);
}
.biz-cta-phone {
  position: absolute;
  left: 50%;
  bottom: 16px;
  transform: translateX(-50%);
  margin: 0;
  width: max-content;
  font-size: 14px;
  line-height: 1.4;
  text-shadow: 0 2px 10px rgba(7, 18, 44, 0.58);
}

/* 热点文章：分类筛选 + 一行预览；左右箭头单条平移；无轮播点、无自动轮播 */
.biz-hot-side-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  display: inline-flex;
  width: 24px;
  height: 46px;
  padding: 0;
  line-height: 0;
  border-radius: 4px;
  border: 0;
  color: #fff;
  background: rgba(0, 0, 0, 0.2);
  transition: background 0.2s ease;
}
.biz-hot-side-btn--prev {
  left: -36px;
}
.biz-hot-side-btn--next {
  right: -36px;
}
.biz-hot-side-btn:hover {
  background: rgba(0, 0, 0, 0.36);
}
.biz-hot-side-btn svg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: block;
  width: 14px;
  height: 14px;
  margin: 0;
  pointer-events: none;
}
.biz-hot-news-card {
  min-width: 0;
}
.biz-hot-news-card__title {
  min-height: 56px;
  transition: color 0.2s ease;
}
.biz-hot-news-card p {
  min-height: 40px;
}
.biz-hot-news-card__img {
  transform-origin: center;
  transition: transform 0.35s ease;
}
.biz-hot-news-card__media {
  transition: box-shadow 0.25s ease;
}
.biz-hot-news-card:hover .biz-hot-news-card__title {
  color: #3d59ff;
}
.biz-hot-news-card:hover .biz-hot-news-card__img {
  transform: scale(1.15);
}
.biz-hot-news-card:hover .biz-hot-news-card__media {
  box-shadow: 0 16px 22px -14px rgba(15, 23, 42, 0.55);
}

.biz-hot-preview-track {
  display: flex;
  flex-wrap: nowrap;
  gap: 28px;
  overflow-x: auto;
  padding-bottom: 6px;
  -webkit-overflow-scrolling: touch;
  scrollbar-gutter: stable;
}
.biz-hot-preview-card {
  flex: 0 0 min(85vw, 280px);
  max-width: min(85vw, 280px);
}
@media (min-width: 1024px) {
  .biz-hot-preview-track {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 28px;
    overflow-x: visible;
    padding-bottom: 0;
  }
  .biz-hot-preview-card {
    flex: none;
    max-width: none;
    min-width: 0;
  }
}

@media (max-width: 1400px) {
  .biz-hot-side-btn--prev {
    left: 6px;
  }
  .biz-hot-side-btn--next {
    right: 6px;
  }
}

.biz-learn-more-btn {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding-left: var(--hs-cta-pad-x, 16px);
  padding-right: var(--hs-cta-pad-x, 16px);
}
.biz-learn-more-btn::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  background: var(--theme-primary, #3d59ff);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 0.32s ease;
}
.biz-learn-more-btn__label,
.biz-learn-more-btn__arrow {
  position: relative;
  z-index: 1;
  transition: color 0.2s ease;
}
.biz-learn-more-btn:hover,
.biz-learn-more-btn:focus-visible {
  border-color: var(--theme-primary, #3d59ff);
}
.biz-learn-more-btn:hover::before,
.biz-learn-more-btn:focus-visible::before {
  transform: scaleX(1);
}
.biz-learn-more-btn:hover .biz-learn-more-btn__label,
.biz-learn-more-btn:hover .biz-learn-more-btn__arrow,
.biz-learn-more-btn:focus-visible .biz-learn-more-btn__label,
.biz-learn-more-btn:focus-visible .biz-learn-more-btn__arrow {
  color: #ffffff;
}
.biz-learn-more-btn:hover .biz-learn-more-btn__arrow,
.biz-learn-more-btn:focus-visible .biz-learn-more-btn__arrow {
  animation: hsMoreCtaArrowBounce 0.55s ease-in-out 1;
}

@media (max-width: 1024px) {
  .biz-cta-title {
    font-size: 40px;
  }
}
@media (max-width: 640px) {
  .biz-cta-section {
    min-height: 320px;
    height: 320px;
  }
  .biz-cta-content {
    padding-top: 48px;
    padding-bottom: 16px;
  }
  .biz-cta-title {
    font-size: 30px;
  }
  .biz-cta-subtitle {
    font-size: 14px;
  }
}
</style>
