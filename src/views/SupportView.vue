<template>
  <main id="top" class="relative z-[1]">
    <PageHeroBanner
      title-key="nav_support"
      desc-key="partners_page_banner_desc"
      title-fallback="服务支持"
      image-url="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80"
    >
      <template #breadcrumbs>
        <ol class="flex flex-wrap items-center gap-x-1.5">
          <li><RouterLink to="/" class="text-white/80 transition hover:text-white" data-i18n="crumb_home">首页</RouterLink></li>
          <li class="text-white/45" aria-hidden="true">›</li>
          <li class="text-white/95" aria-current="page" data-i18n="nav_support">服务支持</li>
        </ol>
      </template>
    </PageHeroBanner>

    <section class="scroll-mt-28 border-b border-zinc-200/90 bg-zinc-100/70 py-12 dark:border-zinc-800 dark:bg-[#0f1219] sm:py-16">
      <div class="mx-auto max-w-[1200px] px-4 sm:px-6">
        <section
          v-for="(group, gidx) in sections"
          :id="supportAnchor(group.id)"
          :key="group.id"
          class="support-block"
          :class="gidx > 0 ? 'mt-12' : ''"
        >
          <h2 class="reveal hs-text-page-h2 text-[30px] text-[#111827] dark:text-white">{{ group.title }}</h2>
          <div class="hs-heading-rule mt-3 mb-8" aria-hidden="true"></div>

          <div class="support-grid">
            <article
              v-for="(item, idx) in group.items"
              :key="item.id"
              class="support-card reveal reveal--from-bottom rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900/60"
              :class="revealStaggerClass(idx)"
            >
              <h3 class="support-card__title text-[24px] font-semibold leading-[1.22] text-[#1f2937] dark:text-white">
                {{ supportListTitleForLang(item, lang) }}
              </h3>
              <p class="support-card__desc text-[14px] leading-7 text-zinc-600 dark:text-zinc-300">
                {{ supportListDescForLang(item, lang) }}
              </p>
              <RouterLink
                :to="{ name: 'service-detail', query: { id: item.detailId, from: 'support' } }"
                class="support-detail-btn mt-5 inline-flex h-[42px] w-fit items-center justify-center rounded-[8px] border border-[#3d59ff] px-4 text-[14px] font-semibold text-[#3d59ff] no-underline"
              >
                <span class="support-detail-btn__label">了解详情</span>
              </RouterLink>
            </article>
          </div>
        </section>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, inject, ref } from "vue";
import PageHeroBanner from "../components/PageHeroBanner.vue";
import { cmsTick } from "../cms/cmsTick.js";
import { getSupportSections, supportListTitleForLang, supportListDescForLang } from "../cms/supportPage.js";

const lang = inject("hisunLang", ref("zh"));

const sections = computed(() => {
  cmsTick.value;
  return getSupportSections();
});
const REVEAL_STAGGER = ["", "delay-75", "delay-100", "delay-150", "delay-200", "delay-300"];

function supportAnchor(sectionId) {
  if (sectionId === "consult") return "support-consult";
  if (sectionId === "solutions") return "support-solutions";
  if (sectionId === "recommended") return "support-recommended";
  return `support-${sectionId}`;
}

function revealStaggerClass(index) {
  return REVEAL_STAGGER[index % REVEAL_STAGGER.length] || "";
}
</script>

<style scoped>
.support-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 18px 18px;
}

.support-card {
  min-height: 242px;
  padding: 24px;
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

@media (min-width: 1180px) {
  .support-grid {
    grid-template-columns: repeat(4, 282px);
    justify-content: space-between;
  }

  .support-card {
    width: 282px;
  }
}
</style>
