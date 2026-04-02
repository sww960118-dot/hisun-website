<template>
  <main id="top" class="relative z-[1]">
    <!-- Banner：与首页同构轮播 -->
    <section
      id="banner"
      ref="bannerEl"
      class="relative w-full overflow-hidden border-b border-white/10 bg-slate-900"
      style="min-height: min(520px, 82vh)"
      @mouseenter="onBannerGlowEnter"
      @mouseleave="onBannerGlowLeave"
      @mousemove="onBannerGlowMove"
    >
      <div id="aboutBannerSlides" class="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <Transition :name="bannerTransitionName">
          <div
            :key="bannerIndex"
            class="banner-slide-anim absolute inset-0 bg-cover bg-center"
            :style="currentSlideStyle"
          />
        </Transition>
      </div>
      <div class="banner-scrim pointer-events-none absolute inset-0 z-[2]" aria-hidden="true"></div>
      <div class="banner-glow-trail" :class="{ 'is-on': bannerGlowOn }" aria-hidden="true"></div>
      <div class="banner-glow-follow" :class="{ 'is-on': bannerGlowOn }" aria-hidden="true"></div>
      <div class="banner-glow-sheen" :class="{ 'is-on': bannerGlowOn }" aria-hidden="true"></div>
      <!-- SVG 液体扰动滤镜：让光晕边缘变成不规则“流体” -->
      <svg width="0" height="0" style="position:absolute" aria-hidden="true">
        <defs>
          <filter
            id="bannerLiquid"
            x="-45%"
            y="-45%"
            width="190%"
            height="190%"
            color-interpolation-filters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02 0.028"
              numOctaves="3"
              seed="8"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                dur="8s"
                values="0.016 0.022;0.026 0.036;0.016 0.022"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="42"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <div class="pointer-events-none absolute -right-24 top-0 z-[1] h-[400px] w-[400px] rounded-full bg-[#3d59ff]/18 blur-3xl"></div>
      <div class="pointer-events-none absolute -left-20 bottom-0 z-[1] h-[320px] w-[320px] rounded-full bg-[#35227b]/10 blur-3xl"></div>

      <div
        class="relative z-10 mx-auto flex min-h-[min(520px,82vh)] max-w-[1200px] items-center px-4 py-14 pb-[calc(80px+2.5rem)] sm:px-6"
      >
        <div class="w-full max-w-2xl text-left">
          <p
            v-if="currentBanner.kicker"
            class="hs-text-kicker reveal inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-white/95 backdrop-blur-sm"
          >
            {{ currentBanner.kicker }}
          </p>
          <h1
            class="reveal text-3xl font-extrabold leading-[1.15] tracking-tight text-white delay-75 sm:text-4xl lg:text-5xl"
            :class="currentBanner.kicker ? 'mt-5' : 'mt-0'"
          >
            <span class="block" data-i18n="banner_hero_line1">新启航</span>
            <span class="mt-1 block sm:mt-2" data-i18n="banner_hero_line2">智慧升级、共赢未来</span>
          </h1>
          <div class="hs-heading-rule hs-heading-rule--inverse reveal mt-4 delay-75" aria-hidden="true"></div>
          <p class="hs-text-banner-desc reveal mt-5 text-slate-200 delay-100" data-i18n="banner_hero_desc"></p>
          <div class="reveal mt-8 flex flex-wrap gap-4 delay-150">
            <a
              href="#about-group"
              class="hs-text-button banner-cta-liquid banner-cta-liquid--primary inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-white"
            >
              <span class="banner-cta-text">{{ currentBanner.cta1 }}</span>
            </a>
            <a
              href="#about-jinxin"
              class="hs-text-button banner-cta-liquid banner-cta-liquid--outline inline-flex items-center justify-center rounded-2xl px-8 py-4 text-white"
            >
              <span class="banner-cta-text">{{ currentBanner.cta2 }}</span>
            </a>
          </div>
        </div>
      </div>

      <button
        type="button"
        class="absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/20 bg-black/30 text-xl text-white backdrop-blur transition hover:bg-black/50 sm:left-4"
        aria-label="上一张"
        @click="onBannerPrev"
      >
        ‹
      </button>
      <button
        type="button"
        class="absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/20 bg-black/30 text-xl text-white backdrop-blur transition hover:bg-black/50 sm:right-4"
        aria-label="下一张"
        @click="onBannerNext"
      >
        ›
      </button>
      <BannerNoticeBar />

      <div class="absolute bottom-[calc(80px+1.5rem)] left-0 right-0 z-20 flex justify-center gap-2 px-4">
        <button
          v-for="(s, idx) in bannerSlides"
          :key="'ab-dot-' + idx"
          type="button"
          class="banner-dot h-1.5 w-6 rounded-full transition"
          :class="idx === bannerIndex ? 'bg-white' : 'bg-white/30'"
          :aria-label="'Slide ' + (idx + 1)"
          @click="onBannerDot(idx)"
        />
      </div>
    </section>

    <!-- 子导航 -->
    <nav
      class="sticky top-[64px] z-[90] border-b border-zinc-200/80 bg-white/80 backdrop-blur-xl dark:border-zinc-800 dark:bg-[#12151f]/85 lg:top-[72px]"
      aria-label="走进高阳子导航"
    >
      <div class="mx-auto flex max-w-[1200px] flex-wrap justify-center gap-2 px-4 py-3 sm:gap-3 sm:px-6">
        <button
          v-for="t in tabDefs"
          :key="t.id || t.i18n"
          type="button"
          class="hs-text-nav rounded-[8px] px-4 py-2 transition"
          :class="tabButtonClass(t)"
          :data-i18n="t.i18n"
          :disabled="t.noScroll"
          @click="onTabClick(t)"
        ></button>
      </div>
    </nav>

    <!-- 集团简介：与首页「公司简介」模块同构 -->
    <section id="about-group" class="section-about-glass relative overflow-hidden border-y border-zinc-200/90 py-20 dark:border-zinc-800">
      <div class="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-[#3d59ff]/[0.07] blur-3xl dark:bg-[#3d59ff]/10" aria-hidden="true"></div>
      <div class="pointer-events-none absolute bottom-0 right-0 h-96 w-96 translate-x-1/4 rounded-full bg-[#3d59ff]/[0.05] blur-3xl" aria-hidden="true"></div>
      <div class="relative z-[1] mx-auto max-w-[1200px] px-4 sm:px-6">
        <div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-12">
          <div class="reveal reveal--from-left flex min-h-0 flex-col text-left lg:h-full">
            <h2 class="hs-text-page-h2 text-[#3d59ff] dark:text-[#3d59ff]" data-i18n="about_group_title">高阳集团</h2>
            <div class="hs-heading-rule mt-4" aria-hidden="true"></div>
            <p class="hs-text-lead mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400" data-i18n="about_group_sub">
              Hi Sun Group · 金融科技长期主义者
            </p>
            <p class="hs-text-body mt-4 grow text-left text-[#666666] dark:text-zinc-400" data-i18n="about_group_body"></p>
            <a
              href="https://www.hisun.com.hk/tc/global/home.php"
              target="_blank"
              rel="noopener noreferrer"
              class="hs-more-cta hs-text-button mt-5 inline-flex self-start items-center gap-2 rounded-2xl border border-[#1a1a1a] py-2.5 text-[#1a1a1a] no-underline transition dark:border-white dark:text-white lg:mt-auto"
            >
              <span class="hs-more-cta__label" data-i18n="about_group_more">查看更多</span>
              <svg class="hs-more-cta__arrow h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          <div class="reveal reveal--from-right relative flex min-h-0 flex-col lg:h-full">
            <div class="glass-frame relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/30 dark:ring-white/10">
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=85"
                alt=""
                class="h-full min-h-[min(340px,48vh)] w-full flex-1 object-cover lg:min-h-[min(380px,50vh)]"
                loading="lazy"
              />
              <div
                class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(61,89,255,0.12),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_70%_20%,rgba(61,89,255,0.2),transparent_50%)]"
              ></div>
              <div
                class="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(61,89,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(61,89,255,0.15)_1px,transparent_1px)] [background-size:24px_24px] dark:opacity-25"
              ></div>
              <div class="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0f172a]/80 to-transparent"></div>
            </div>
          </div>
        </div>

        <div class="glass-stat-bar reveal mt-10 flex flex-col overflow-hidden rounded-2xl shadow-xl ring-1 ring-white/15 dark:ring-white/10 sm:mt-12 sm:flex-row">
          <div class="glass-stat-liquid flex flex-[3] flex-col justify-center gap-6 px-6 py-8 text-white sm:flex-row sm:items-stretch sm:gap-4 sm:px-8 lg:gap-8 lg:px-12">
            <div class="stat-liquid-cell flex flex-1 flex-col justify-center rounded-xl border-b border-white/10 px-4 py-3 pb-6 text-left sm:border-b-0 sm:border-r sm:pb-3">
              <div class="stat-liquid-cell-text">
                <p class="hs-text-stat-label text-white/85" data-i18n="stat_1_pre">全球金融行业</p>
                <p class="hs-text-stat-value mt-1 text-white" data-i18n="stat_1_hi">最佳产品奖</p>
              </div>
            </div>
            <div class="stat-liquid-cell flex flex-1 flex-col justify-center rounded-xl border-b border-white/10 px-4 py-3 pb-6 text-left sm:border-b-0 sm:border-r sm:pb-3">
              <div class="stat-liquid-cell-text">
                <p class="hs-text-stat-label text-white/85" data-i18n="stat_2_pre">业务遍布</p>
                <p class="hs-text-stat-value mt-1 text-white" data-i18n="stat_2_hi">5 大洲</p>
              </div>
            </div>
            <div class="stat-liquid-cell flex flex-1 flex-col justify-center rounded-xl px-4 py-3 text-left">
              <div class="stat-liquid-cell-text">
                <p class="hs-text-stat-label text-white/85" data-i18n="stat_3_pre">行业影响力</p>
                <p class="hs-text-stat-value mt-1 text-white" data-i18n="stat_3_hi">国内前十强</p>
              </div>
            </div>
          </div>
          <div class="group glass-stat-cta flex flex-1 flex-row items-center justify-between gap-4 px-6 py-8 text-white sm:max-w-[280px] sm:flex-none lg:px-8">
            <div class="min-w-0 flex-1">
              <p class="hs-text-stat-label text-white/95" data-i18n="stat_cta_line">陪伴全球银行业发展</p>
              <p class="hs-text-stat-value mt-1 text-white" data-i18n="stat_cta_years">25 years</p>
            </div>
            <div class="self-center" aria-hidden="true">
              <div class="stat-arrow-frost inline-flex h-10 w-10 items-center justify-center rounded-full border">
                <svg class="icon-tone h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 高阳金信：简介 + 服务范围 / 团队 -->
    <section id="about-jinxin" class="scroll-mt-28 border-b border-zinc-200/80 bg-zinc-50/80 py-16 dark:border-zinc-800 dark:bg-[#0f1219]/50 sm:py-20">
      <div class="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div class="mt-0 space-y-14">
          <div class="reveal text-left">
            <h2 class="hs-text-block-h2 text-[#0f172a] dark:text-white" data-i18n="about_jinxin_title">高阳金信</h2>
            <div class="hs-heading-rule mt-4" aria-hidden="true"></div>
            <p class="hs-text-body mt-5 text-left text-zinc-600 dark:text-zinc-400" data-i18n="about_jinxin_intro_desc"></p>
          </div>
          <div class="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div class="reveal reveal--from-left glass-frame overflow-hidden rounded-2xl shadow-xl ring-1 ring-white/35 dark:ring-white/10">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=85"
                alt=""
                class="aspect-[16/10] w-full object-cover"
                loading="lazy"
              />
            </div>
            <div class="reveal reveal--from-right">
              <h3 class="hs-text-page-h3 text-[#0f172a] dark:text-white" data-i18n="about_jinxin_scope_title">高阳金信服务范围</h3>
              <p class="hs-text-overline mt-2 text-zinc-400 dark:text-zinc-500" data-i18n="about_jinxin_scope_title_en">Service scope & footprint</p>
              <p class="hs-text-body-justify mt-4 text-zinc-600 dark:text-zinc-400" data-i18n="about_jinxin_scope_desc"></p>
            </div>
          </div>
          <div class="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div class="reveal reveal--from-left order-2 lg:order-1">
              <h3 class="hs-text-page-h3 text-[#0f172a] dark:text-white" data-i18n="about_jinxin_team_title">高阳金信团队</h3>
              <p class="hs-text-overline mt-2 text-zinc-400 dark:text-zinc-500" data-i18n="about_jinxin_team_title_en">Team & expertise</p>
              <p class="hs-text-body-justify mt-4 text-zinc-600 dark:text-zinc-400" data-i18n="about_jinxin_team_desc"></p>
            </div>
            <div class="reveal reveal--from-right glass-frame order-1 overflow-hidden rounded-2xl shadow-xl ring-1 ring-white/35 dark:ring-white/10 lg:order-2">
              <img
                src="/img/team-hisun-fintech.png"
                alt=""
                class="aspect-[16/10] w-full object-cover object-center"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 企业文化：3×2 宫格（左上标题 + 利善学直乐） -->
    <section id="about-culture" class="scroll-mt-28 relative overflow-hidden py-16 sm:py-24">
      <div class="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#1e1540] via-[#2a1f55] to-[#151028]" aria-hidden="true"></div>
      <img
        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=70"
        alt=""
        class="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-25 mix-blend-luminosity"
        loading="lazy"
      />
      <div class="pointer-events-none absolute inset-0 bg-[#1e1540]/75 about-culture-bg-anim" aria-hidden="true"></div>
      <div class="relative z-[1] mx-auto max-w-[1200px] px-4 sm:px-6">
        <div
          class="reveal grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-zinc-300/90 bg-zinc-300/90 shadow-xl lg:grid-cols-3"
        >
          <div
            class="flex min-h-[200px] flex-col items-start justify-start bg-[var(--hs-secondary)] pt-12 pl-12 pr-6 pb-6 text-left text-white shadow-inner sm:min-h-[220px] sm:pb-8 lg:min-h-[260px]"
          >
            <h2 class="hs-text-block-h2 text-white" data-i18n="about_culture_title">企业文化</h2>
            <div class="mt-5 h-0.5 w-10 rounded-full bg-white/90" aria-hidden="true"></div>
          </div>
          <article
            v-for="c in cultureCards"
            :key="c.titleKey"
            class="about-culture-card about-culture-card--float group flex min-h-[200px] flex-col bg-white p-5 text-left sm:min-h-[220px] sm:p-6 lg:min-h-[260px]"
            :class="c.delay"
            :style="{ animationDelay: c.floatDelayMs + 'ms', animationDuration: c.floatDurationMs + 'ms' }"
          >
            <div class="mt-5 flex items-start justify-between gap-3">
              <span
                class="about-culture-card__char text-4xl font-bold leading-none text-black sm:text-5xl"
                :data-i18n="c.titleKey"
                >{{ c.char }}</span
              >
              <div
                class="about-culture-card__diamond flex h-12 w-12 shrink-0 items-center justify-center border border-zinc-400 text-zinc-500 transition-[color,border-color] [transform:rotate(45deg)]"
                aria-hidden="true"
              >
                <div class="text-current [transform:rotate(-45deg)]">
                  <CultureValueIcon :name="c.icon" />
                </div>
              </div>
            </div>
            <p
              class="about-culture-card__desc hs-text-body-justify mt-4 flex-1 text-zinc-700"
              :data-i18n="c.descKey"
            ></p>
          </article>
        </div>
      </div>
    </section>

    <!-- 企业荣誉资质：每页 4 项 + 指示条 -->
    <section id="about-honors" class="scroll-mt-28 py-16 dark:border-zinc-800 sm:py-20">
      <div class="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div class="reveal text-left">
          <h2 class="hs-text-page-h2 text-[#0f172a] dark:text-white" data-i18n="about_honors_title">企业荣誉资质</h2>
          <div class="hs-heading-rule mt-4" aria-hidden="true"></div>
          <p class="hs-text-lead mt-3 max-w-xl text-zinc-600 dark:text-zinc-400" data-i18n="about_honors_sub">见证成长路上的每一份认可</p>
        </div>

        <div class="relative mt-12 w-full overflow-hidden">
          <!-- 轨道总宽 n×100%，每页占 100/n%，translate 按页移动，避免露半边 -->
          <div
            class="flex transition-transform duration-500 ease-out"
            :style="honorTrackStyle"
          >
            <div
              v-for="(page, pi) in honorPages"
              :key="'hp-' + pi"
              class="box-border shrink-0 px-0"
              :style="{ width: honorPageSlidePct }"
            >
              <div class="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
                <article
                  v-for="(h, hi) in page"
                  :key="h.key + '-' + hi"
                  class="reveal reveal--from-bottom honors-reveal flex min-w-0 flex-col items-start"
                >
                  <div
                    class="flex aspect-[5/7] w-full items-center justify-center overflow-hidden rounded-xl border border-zinc-200/90 bg-white p-1 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/50"
                  >
                    <img :src="h.img" alt="" class="h-full w-full object-contain object-center" loading="lazy" />
                  </div>
                  <p class="hs-text-emphasis-sm mt-3 w-full text-left text-[#0f172a] dark:text-white">{{ h.title }}</p>
                </article>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 flex justify-center gap-2 sm:gap-2.5">
          <button
            v-for="(_, i) in honorPages"
            :key="'hind-' + i"
            type="button"
            class="h-1 rounded-sm transition sm:w-10"
            :class="i === honorPageIndex ? 'w-10 bg-[#3d59ff] sm:w-12' : 'w-8 bg-zinc-200 dark:bg-zinc-600'"
            :aria-label="'荣誉第 ' + (i + 1) + ' 页'"
            @click="goHonorPage(i)"
          ></button>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import { useRoute } from "vue-router";
import { DEFAULT_BANNERS, normalizeBanner, loadBanners } from "../cms/banners.js";
import BannerNoticeBar from "../components/BannerNoticeBar.vue";
import CultureValueIcon from "../components/blocks/CultureValueIcon.vue";

const route = useRoute();
const activeId = ref("about-group");

const BANNER_AUTO_MS = 3000;

const bannerSlides = ref(DEFAULT_BANNERS.map(normalizeBanner));
const bannerIndex = ref(0);
/** 与首页 Banner 一致：PPT 式推入方向 */
const bannerPptDir = ref(1);
const bannerTransitionName = computed(() => (bannerPptDir.value >= 0 ? "banner-ppt-next" : "banner-ppt-prev"));
const currentSlideStyle = computed(() => {
  const s = bannerSlides.value[bannerIndex.value];
  const url = s?.imageUrl || "";
  return url ? { backgroundImage: `url(${url})` } : {};
});
let bannerTimer = null;

const bannerEl = ref(null);
const bannerGlowOn = ref(false);
let bannerGlowTargetX = 50;
let bannerGlowTargetY = 50;
let bannerGlowLoopRaf = null;

let bannerGlowCurrX = 50;
let bannerGlowCurrY = 40;
let bannerGlowTrailX = 50;
let bannerGlowTrailY = 40;
let bannerGlowPrevX = bannerGlowCurrX;
let bannerGlowPrevY = bannerGlowCurrY;
let bannerGlowPrevT = performance.now();

function setBannerGlow(xPercent, yPercent, angleDeg, energy, trailX, trailY, hueDeg) {
  const el = bannerEl.value;
  if (!el) return;
  el.style.setProperty("--glow-x", `${xPercent}%`);
  el.style.setProperty("--glow-y", `${yPercent}%`);
  el.style.setProperty("--glow-tx", `${trailX}%`);
  el.style.setProperty("--glow-ty", `${trailY}%`);
  el.style.setProperty("--glow-angle", `${angleDeg}deg`);
  el.style.setProperty("--glow-energy", `${energy}`);
  el.style.setProperty("--glow-hue", `${hueDeg}deg`);
}

function onBannerGlowEnter() {
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;
  bannerGlowOn.value = true;
  bannerGlowCurrX = 50;
  bannerGlowCurrY = 40;
  bannerGlowTrailX = 50;
  bannerGlowTrailY = 40;
  bannerGlowTargetX = 50;
  bannerGlowTargetY = 40;
  bannerGlowPrevX = bannerGlowCurrX;
  bannerGlowPrevY = bannerGlowCurrY;
  bannerGlowPrevT = performance.now();
  if (bannerGlowLoopRaf == null) bannerGlowLoopRaf = window.requestAnimationFrame(bannerGlowLoop);
}

function bannerGlowLoop() {
  bannerGlowLoopRaf = null;
  if (!bannerGlowOn.value) return;
  if (!bannerEl.value) return;

  const now = performance.now();
  const dt = Math.max(16, now - bannerGlowPrevT);

  const dxT = bannerGlowTargetX - bannerGlowCurrX;
  const dyT = bannerGlowTargetY - bannerGlowCurrY;

  const lerpMain = 0.11;
  bannerGlowCurrX += dxT * lerpMain;
  bannerGlowCurrY += dyT * lerpMain;

  const lerpTrail = 0.055;
  bannerGlowTrailX += (bannerGlowCurrX - bannerGlowTrailX) * lerpTrail;
  bannerGlowTrailY += (bannerGlowCurrY - bannerGlowTrailY) * lerpTrail;

  const dx = bannerGlowCurrX - bannerGlowPrevX;
  const dy = bannerGlowCurrY - bannerGlowPrevY;
  const speed = Math.sqrt(dx * dx + dy * dy) / dt; // percent/ms
  const energy = Math.max(0, Math.min(100, speed * 11000));
  const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;

  let hueDeg = angleDeg * 0.55 + energy * 0.85;
  hueDeg = ((hueDeg % 360) + 360) % 360;

  bannerGlowPrevX = bannerGlowCurrX;
  bannerGlowPrevY = bannerGlowCurrY;
  bannerGlowPrevT = now;

  setBannerGlow(bannerGlowCurrX, bannerGlowCurrY, angleDeg, energy, bannerGlowTrailX, bannerGlowTrailY, hueDeg);
  bannerGlowLoopRaf = window.requestAnimationFrame(bannerGlowLoop);
}

function onBannerGlowMove(e) {
  if (!bannerEl.value) return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;

  const rect = bannerEl.value.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return;

  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;

  bannerGlowTargetX = Math.max(0, Math.min(100, x));
  bannerGlowTargetY = Math.max(0, Math.min(100, y));
}

function onBannerGlowLeave() {
  bannerGlowOn.value = false;
  setBannerGlow(50, 50, 0, 0, 50, 50, 0);
  if (bannerGlowLoopRaf != null) {
    window.cancelAnimationFrame(bannerGlowLoopRaf);
    bannerGlowLoopRaf = null;
  }
}

const currentBanner = computed(() => {
  const s = bannerSlides.value[bannerIndex.value];
  return s || { kicker: "", title: "", desc: "", cta1: "", cta2: "" };
});

function onBannerPrev() {
  const n = bannerSlides.value.length;
  if (!n) return;
  bannerPptDir.value = -1;
  bannerIndex.value = (bannerIndex.value - 1 + n) % n;
  resetBannerTimer();
}

function onBannerNext() {
  const n = bannerSlides.value.length;
  if (!n) return;
  bannerPptDir.value = 1;
  bannerIndex.value = (bannerIndex.value + 1) % n;
  resetBannerTimer();
}

function onBannerDot(idx) {
  const cur = bannerIndex.value;
  if (idx === cur) return;
  bannerPptDir.value = idx > cur ? 1 : -1;
  bannerIndex.value = idx;
  resetBannerTimer();
}

function resetBannerTimer() {
  clearInterval(bannerTimer);
  bannerTimer = setInterval(() => {
    const n = bannerSlides.value.length;
    if (!n) return;
    bannerPptDir.value = 1;
    bannerIndex.value = (bannerIndex.value + 1) % n;
  }, BANNER_AUTO_MS);
}

const tabDefs = [
  { id: "about-group", i18n: "about_nav_group" },
  { id: "about-jinxin", i18n: "sub_ab_2" },
  { id: "about-culture", i18n: "about_nav_culture" },
  { id: "about-honors", i18n: "about_nav_honors" },
  { id: null, i18n: "sub_ab_5", noScroll: true },
];

const SECTION_IDS = tabDefs.filter((x) => x.id).map((x) => x.id);
const SPY_OFFSET = 140;

function tabButtonClass(t) {
  if (t.noScroll) {
    return "cursor-not-allowed border border-dashed border-zinc-200/90 bg-zinc-50/90 text-zinc-400 dark:border-zinc-600 dark:bg-zinc-900/60 dark:text-zinc-500";
  }
  return activeId.value === t.id
    ? "bg-[#3d59ff] text-white shadow-lg shadow-[#3d59ff]/25"
    : "border border-zinc-200/90 bg-white/90 text-zinc-600 hover:-translate-y-0.5 hover:border-[#3d59ff]/40 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-300";
}

function onTabClick(t) {
  if (t.noScroll) return;
  if (t.id) scrollTo(t.id);
}

const cultureCards = [
  {
    char: "利",
    titleKey: "culture_li",
    descKey: "culture_li_d",
    icon: "scale",
    delay: "",
    floatDelayMs: 0,
    floatDurationMs: 5400,
  },
  {
    char: "善",
    titleKey: "culture_shan",
    descKey: "culture_shan_d",
    icon: "gem",
    delay: "delay-75",
    floatDelayMs: 260,
    floatDurationMs: 5600,
  },
  {
    char: "学",
    titleKey: "culture_xue",
    descKey: "culture_xue_d",
    icon: "bulb",
    delay: "delay-100",
    floatDelayMs: 520,
    floatDurationMs: 5800,
  },
  {
    char: "直",
    titleKey: "culture_zhi",
    descKey: "culture_zhi_d",
    icon: "handshake",
    delay: "delay-150",
    floatDelayMs: 780,
    floatDurationMs: 6000,
  },
  {
    char: "乐",
    titleKey: "culture_le",
    descKey: "culture_le_d",
    icon: "star",
    delay: "delay-200",
    floatDelayMs: 1040,
    floatDurationMs: 6200,
  },
];

const honorLocalFolder = "/img/honors";
const HONOR_ITEMS = [
  {
    key: "about_honor_1",
    img: `${honorLocalFolder}/2018中国方案商百强.jpg`,
    title: "2018中国方案商百强",
  },
  {
    key: "about_honor_2",
    img: `${honorLocalFolder}/TOP10集成服务商.jpg`,
    title: "TOP10集成服务商",
  },
  {
    key: "about_honor_3",
    img: `${honorLocalFolder}/TOP5集成服务专家.jpg`,
    title: "TOP5集成服务专家",
  },
  {
    key: "about_honor_4",
    img: `${honorLocalFolder}/方案商150墙.jpg`,
    title: "方案商150墙",
  },
  {
    key: "about_honor_5",
    img: `${honorLocalFolder}/金融行业最佳产品奖.jpg`,
    title: "金融行业最佳产品奖",
  },
  {
    key: "about_honor_6",
    img: `${honorLocalFolder}/十大杰出服务商.jpg`,
    title: "十大杰出服务商",
  },
  {
    key: "about_honor_7",
    img: `${honorLocalFolder}/十佳方案商.jpg`,
    title: "十佳方案商",
  },
  {
    key: "about_honor_8",
    img: `${honorLocalFolder}/最佳电子金融解决方案.jpg`,
    title: "最佳电子金融解决方案",
  },
];

const honorsFlat = HONOR_ITEMS;

const honorPages = computed(() => {
  const pages = [];
  const per = 4;
  for (let i = 0; i < honorsFlat.length; i += per) {
    pages.push(honorsFlat.slice(i, i + per));
  }
  return pages;
});

/** 每页宽度占轨道的比例（轨道总宽 = 页数 × 100% 视口宽） */
const honorPageSlidePct = computed(() => {
  const n = Math.max(1, honorPages.value.length);
  return `${100 / n}%`;
});

const honorTrackStyle = computed(() => {
  const n = Math.max(1, honorPages.value.length);
  const idx = Math.min(honorPageIndex.value, n - 1);
  return {
    width: `${n * 100}%`,
    transform: `translateX(-${(idx * 100) / n}%)`,
  };
});

const honorPageIndex = ref(0);
let honorTimer = null;

function goHonorPage(i) {
  honorPageIndex.value = i % honorPages.value.length;
  resetHonorTimer();
}

function resetHonorTimer() {
  clearInterval(honorTimer);
  honorTimer = setInterval(() => {
    const n = honorPages.value.length;
    if (!n) return;
    honorPageIndex.value = (honorPageIndex.value + 1) % n;
  }, 3000);
}

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function updateActiveFromScroll() {
  let current = SECTION_IDS[0];
  for (const id of SECTION_IDS) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (el.getBoundingClientRect().top <= SPY_OFFSET) {
      current = id;
    }
  }
  activeId.value = current;
}

function onScrollSpy() {
  updateActiveFromScroll();
}

onMounted(async () => {
  try {
    const slides = await loadBanners();
    if (slides.length) bannerSlides.value = slides;
  } catch {
    /* keep default */
  }
  await nextTick();
  resetBannerTimer();

  window.addEventListener("scroll", onScrollSpy, { passive: true });
  window.addEventListener("resize", onScrollSpy, { passive: true });
  resetHonorTimer();
  nextTick(() => {
    updateActiveFromScroll();
  });
});

/** 路由统一置顶，不再根据 URL hash 自动滚到区块；用户可点击页内子导航滚动 */

onUnmounted(() => {
  clearInterval(bannerTimer);
  window.removeEventListener("scroll", onScrollSpy);
  window.removeEventListener("resize", onScrollSpy);
  if (honorTimer != null) clearInterval(honorTimer);
});
</script>
