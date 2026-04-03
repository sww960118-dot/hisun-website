<template>
  <main id="top" class="relative z-[1]">
    <PageHeroBanner
      title-key="partners_page_banner_title"
      desc-key="partners_page_banner_desc"
      title-fallback="合作伙伴"
      image-url="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80"
    >
      <template #breadcrumbs>
        <ol class="flex flex-wrap items-center gap-x-1.5">
          <li>
            <RouterLink to="/" class="text-white/80 transition hover:text-white" data-i18n="crumb_home">首页</RouterLink>
          </li>
          <li class="text-white/45" aria-hidden="true">›</li>
          <li class="text-white/95" aria-current="page" data-i18n="nav_partners">合作伙伴</li>
        </ol>
      </template>
    </PageHeroBanner>

    <!-- 我们的客户：上区浅底 + 分割线（同走进高阳子导航）+ Logo 主题蓝底 -->
    <section
      id="partners-clients"
      class="scroll-mt-28 border-b border-zinc-200/90 bg-zinc-50/90 dark:border-zinc-800 dark:bg-[#0b0d12]"
    >
      <div class="mx-auto max-w-[1200px] px-4 pt-14 sm:px-6 sm:pt-20">
        <div class="reveal text-left">
          <h2 class="hs-text-page-h2 text-[#0f172a] dark:text-white" data-i18n="partners_sec_clients">我们的客户</h2>
          <div class="hs-heading-rule mt-4" aria-hidden="true"></div>
        </div>
      </div>

      <!-- 包裹 Tab + Logo：sticky 仅在此区域内生效，滚过 Logo 区进入「典型案例」后不再吸顶 -->
      <div class="relative mt-8">
        <nav
          class="sticky top-[64px] z-[30] border-y border-zinc-200/80 bg-zinc-50/95 backdrop-blur-xl dark:border-zinc-700 dark:bg-[#0b0d12]/95 lg:top-[72px]"
          aria-label="客户行业筛选"
        >
          <div class="mx-auto flex max-w-[1200px] flex-wrap justify-center gap-2 px-4 py-3 sm:gap-3 sm:px-6">
            <button
              v-for="tab in sectorTabs"
              :key="tab.value"
              type="button"
              class="hs-text-nav rounded-[8px] px-4 py-2 text-[14px] font-medium transition"
              :class="sectorTabClass(tab.value)"
              :data-i18n="tab.labelKey"
              :aria-current="activeSector === tab.value ? 'true' : undefined"
              @click="setSector(tab.value)"
            ></button>
          </div>
        </nav>

        <div class="bg-[#E3E7FB] py-12 dark:bg-[#141827] sm:py-16">
          <div class="mx-auto max-w-[1200px] px-4 sm:px-6">
            <div
              v-if="filteredLogos.length"
              class="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-6 md:gap-x-5 md:gap-y-4"
            >
              <PartnerLogoHoverCard
                v-for="(item, idx) in filteredLogos"
                :key="item.src + '-' + idx"
                :src="item.src"
                :name="item.name"
                class="reveal reveal--from-bottom"
                :class="revealStaggerClass(idx)"
              />
            </div>
            <p
              v-else
              class="reveal mx-auto max-w-lg py-6 text-center text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400"
              data-i18n="partners_empty_sector"
            >
              该分类下暂无客户 Logo 展示。
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 典型案例 -->
    <section
      id="partners-cases"
      class="scroll-mt-28 border-b border-zinc-200/90 bg-white py-14 dark:border-zinc-800 dark:bg-[#0f1219] sm:py-20"
    >
      <div class="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div class="reveal text-left">
          <h2 class="hs-text-page-h2 text-[#0f172a] dark:text-white" data-i18n="partners_sec_cases">典型案例</h2>
          <div class="hs-heading-rule mt-4" aria-hidden="true"></div>
        </div>

        <!-- 头条宽卡 -->
        <article
          class="partner-featured reveal reveal--from-bottom mt-12 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100/80 shadow-sm delay-75 dark:border-zinc-700 dark:bg-zinc-900/50"
          role="button"
          tabindex="0"
          @click="openCaseDetail(featured.id)"
          @keydown.enter.prevent="openCaseDetail(featured.id)"
          @keydown.space.prevent="openCaseDetail(featured.id)"
        >
          <div class="grid grid-cols-1 lg:grid-cols-2 lg:gap-0">
            <div class="relative min-h-[220px] bg-zinc-200/60 dark:bg-zinc-800/60 lg:min-h-[320px]">
              <img
                :src="featured.image"
                alt=""
                class="h-full w-full object-cover lg:absolute lg:inset-0"
                loading="lazy"
              />
            </div>
            <div class="flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-10 lg:pl-12 lg:pr-10">
              <h3
                class="text-xl font-bold leading-snug text-[#0f172a] sm:text-2xl dark:text-white"
              >{{ caseTitleForLang(featured, lang) }}</h3>
              <p
                class="hs-text-body mt-4 text-zinc-600 dark:text-zinc-400"
              >{{ caseSummaryForLang(featured, lang) }}</p>
              <div class="mt-8 flex flex-wrap items-center gap-4">
                <RouterLink
                  :to="{ name: 'partners-case-detail', query: { id: featured.id, from: 'partners' } }"
                  class="hs-more-cta hs-text-button inline-flex items-center gap-2 rounded-2xl border border-[#3d59ff] py-2.5 text-[#3d59ff] no-underline dark:border-[#3d59ff] dark:text-[#3d59ff]"
                  @click.stop
                >
                  <span class="hs-more-cta__label" data-i18n="btn_detail">查看详情</span>
                  <svg class="hs-more-cta__arrow h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </RouterLink>
                <button
                  type="button"
                  class="hs-consult-cta hs-text-button inline-flex items-center gap-1.5 rounded-2xl py-2.5 text-[14px] font-bold"
                  @click.stop="goConsult"
                >
                  <span class="hs-consult-cta__label" data-i18n="partners_consult_now">立即咨询</span>
                  <svg class="hs-consult-cta__arrow h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </article>

        <!-- 案例网格 -->
        <div class="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="(c, i) in caseCards"
            :key="c.id"
            class="partner-case-card group reveal reveal--from-bottom flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-[border-color,background-color,box-shadow] duration-300 hover:border-[#3d59ff] hover:bg-[#3d59ff] hover:shadow-lg hover:shadow-[#3d59ff]/35 dark:border-zinc-700 dark:bg-zinc-900/40 dark:hover:border-[#3d59ff] dark:hover:bg-[#3d59ff]"
            :class="revealStaggerClass(i)"
            role="button"
            tabindex="0"
            @click="openCaseDetail(c.id)"
            @keydown.enter.prevent="openCaseDetail(c.id)"
            @keydown.space.prevent="openCaseDetail(c.id)"
          >
            <div class="aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
              <img
                :src="c.image"
                alt=""
                class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02] group-hover:brightness-95"
                loading="lazy"
              />
            </div>
            <div class="flex flex-1 flex-col p-5">
              <h3
                class="text-lg font-bold leading-snug text-zinc-800 transition-colors group-hover:text-white dark:text-zinc-100"
              >{{ caseTitleForLang(c, lang) }}</h3>
              <p
                class="hs-text-body mt-3 flex-1 text-zinc-600 transition-colors group-hover:text-white/90 dark:text-zinc-400"
              >{{ caseSummaryForLang(c, lang) }}</p>
              <div
                class="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-zinc-100 pt-4 transition-colors group-hover:border-white/25 dark:border-zinc-700"
              >
                <RouterLink
                  :to="{ name: 'partners-case-detail', query: { id: c.id, from: 'partners' } }"
                  class="partner-case-cta-detail hs-more-cta hs-text-button inline-flex items-center gap-2 rounded-2xl border border-[#3d59ff] py-2.5 text-[#3d59ff] no-underline dark:border-[#3d59ff] dark:text-[#3d59ff]"
                  @click.stop
                >
                  <span class="hs-more-cta__label" data-i18n="btn_detail">查看详情</span>
                  <svg class="hs-more-cta__arrow h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </RouterLink>
                <button
                  type="button"
                  class="partner-case-cta-consult hs-consult-cta hs-text-button inline-flex items-center gap-1.5 rounded-2xl py-2.5 text-[13px] font-bold"
                  @click.stop="goConsult"
                >
                  <span class="hs-consult-cta__label" data-i18n="partners_consult_now">立即咨询</span>
                  <svg class="hs-consult-cta__arrow h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, inject, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageHeroBanner from "../components/PageHeroBanner.vue";
import PartnerLogoHoverCard from "../components/PartnerLogoHoverCard.vue";
import {
  PARTNER_LOGO_ITEMS,
  PARTNER_SECTOR_TABS,
  PARTNERS_CONTACT_EMAIL,
  getPartnerCaseArticles,
  caseTitleForLang,
  caseSummaryForLang,
} from "../cms/partnersPage.js";
import { cmsTick } from "../cms/cmsTick.js";

const route = useRoute();
const router = useRouter();
const lang = inject("hisunLang", ref("zh"));

const sectorTabs = PARTNER_SECTOR_TABS;

const caseArticles = computed(() => {
  cmsTick.value;
  return getPartnerCaseArticles();
});
const featured = computed(() => caseArticles.value[0]);
const caseCards = computed(() => caseArticles.value.slice(1));

const allowedSectors = new Set(sectorTabs.map((t) => t.value));

const activeSector = computed(() => {
  const s = String(route.query.sector ?? "all");
  return allowedSectors.has(s) ? s : "all";
});

const filteredLogos = computed(() => {
  const s = activeSector.value;
  if (s === "all") return PARTNER_LOGO_ITEMS;
  return PARTNER_LOGO_ITEMS.filter((p) => p.sector === s);
});

function sectorTabClass(value) {
  const on = activeSector.value === value;
  return on
    ? "bg-[#3d59ff] text-white shadow-lg shadow-[#3d59ff]/25"
    : "border border-zinc-200/90 bg-white/90 text-zinc-600 hover:-translate-y-0.5 hover:border-[#3d59ff]/40 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-300";
}

function setSector(value) {
  const q = {};
  if (value !== "all") q.sector = value;
  router.replace({ name: "partners", query: q, hash: "" });
}

function goConsult() {
  window.location.href = `mailto:${PARTNERS_CONTACT_EMAIL}`;
}

function openCaseDetail(id) {
  router.push({ name: "partners-case-detail", query: { id, from: "partners" } });
}

/** 与首页 / 主营业务列表一致的错开延迟（Tailwind transition-delay） */
const REVEAL_STAGGER = ["", "delay-75", "delay-100", "delay-150", "delay-200", "delay-300"];

function revealStaggerClass(index) {
  return REVEAL_STAGGER[index % REVEAL_STAGGER.length] || "";
}
</script>

<style scoped>
/* 案例卡悬停为整卡主题蓝时：CTA 对比度与动效反转 */
.partner-case-card:hover .partner-case-cta-detail.hs-more-cta {
  border-color: rgba(255, 255, 255, 0.88) !important;
  color: #ffffff !important;
}
.partner-case-card:hover .partner-case-cta-detail.hs-more-cta::before {
  background: #ffffff !important;
}
.partner-case-card:hover .partner-case-cta-detail .hs-more-cta__label,
.partner-case-card:hover .partner-case-cta-detail .hs-more-cta__arrow {
  color: #ffffff !important;
}
.partner-case-card:hover .partner-case-cta-detail.hs-more-cta:hover .hs-more-cta__label,
.partner-case-card:hover .partner-case-cta-detail.hs-more-cta:hover .hs-more-cta__arrow,
.partner-case-card:hover .partner-case-cta-detail.hs-more-cta:focus-visible .hs-more-cta__label,
.partner-case-card:hover .partner-case-cta-detail.hs-more-cta:focus-visible .hs-more-cta__arrow {
  color: var(--theme-primary) !important;
}

/* 整卡悬停时按钮反白：默认仍无投影；仅当指针/焦点在按钮上时再投影 + 上浮 */
.partner-case-card:hover .partner-case-cta-consult.hs-consult-cta {
  background: #ffffff !important;
  border-color: #ffffff !important;
  box-shadow: none !important;
  transform: translateY(0) !important;
}
.partner-case-card:hover .partner-case-cta-consult .hs-consult-cta__label,
.partner-case-card:hover .partner-case-cta-consult .hs-consult-cta__arrow {
  color: var(--theme-primary) !important;
}
.partner-case-card:hover .partner-case-cta-consult.hs-consult-cta:hover,
.partner-case-card:hover .partner-case-cta-consult.hs-consult-cta:focus-visible,
.partner-case-card:hover .partner-case-cta-consult.hs-consult-cta:active {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.14) !important;
  transform: translateY(-2px) !important;
}
</style>
