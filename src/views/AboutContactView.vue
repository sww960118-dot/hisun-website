<template>
  <main id="top" class="relative z-[1]" :class="leaving ? 'contact-page--leaving' : 'contact-page--enter'">
    <!-- Banner：与走进高阳页面同款（只切换 tab / 下方详情模块不同） -->
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
          <div :key="bannerIndex" class="banner-slide-anim absolute inset-0 bg-cover bg-center" :style="currentSlideStyle" />
        </Transition>
      </div>

      <div class="banner-scrim pointer-events-none absolute inset-0 z-[2]" aria-hidden="true"></div>
      <div class="banner-glow-trail" :class="{ 'is-on': bannerGlowOn }" aria-hidden="true"></div>
      <div class="banner-glow-follow" :class="{ 'is-on': bannerGlowOn }" aria-hidden="true"></div>
      <div class="banner-glow-sheen" :class="{ 'is-on': bannerGlowOn }" aria-hidden="true"></div>

      <!-- SVG 液体扰动滤镜：让光晕边缘变成不规则“流体” -->
      <svg width="0" height="0" style="position: absolute" aria-hidden="true">
        <defs>
          <filter id="bannerLiquid" x="-45%" y="-45%" width="190%" height="190%" color-interpolation-filters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.02 0.028" numOctaves="3" seed="8" result="noise">
              <animate attributeName="baseFrequency" dur="8s" values="0.016 0.022;0.026 0.036;0.016 0.022" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="42" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <div class="pointer-events-none absolute -right-24 top-0 z-[1] h-[400px] w-[400px] rounded-full bg-[#3d59ff]/18 blur-3xl"></div>
      <div class="pointer-events-none absolute -left-20 bottom-0 z-[1] h-[320px] w-[320px] rounded-full bg-[#35227b]/10 blur-3xl"></div>

      <div class="relative z-10 mx-auto flex min-h-[min(520px, 82vh)] max-w-[1200px] items-center px-4 py-14 pb-[calc(80px+2.5rem)] sm:px-6">
        <div class="w-full max-w-2xl text-left">
          <p v-if="currentBanner.kicker" class="hs-text-kicker reveal inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-white/95 backdrop-blur-sm">
            {{ currentBanner.kicker }}
          </p>

          <h1 class="reveal text-3xl font-extrabold leading-[1.15] tracking-tight text-white delay-75 sm:text-4xl lg:text-5xl" :class="currentBanner.kicker ? 'mt-5' : 'mt-0'">
            <span class="block" data-i18n="banner_hero_line1">新启航</span>
            <span class="mt-1 block sm:mt-2" data-i18n="banner_hero_line2">智慧升级、共赢未来</span>
          </h1>

          <div class="hs-heading-rule hs-heading-rule--inverse reveal mt-4 delay-75" aria-hidden="true"></div>
          <p class="hs-text-banner-desc reveal mt-5 text-slate-200 delay-100" data-i18n="banner_hero_desc"></p>

          <div class="reveal mt-8 flex flex-wrap gap-4 delay-150">
            <RouterLink
              :to="{ name: 'about', hash: '#about-group' }"
              class="hs-text-button banner-cta-liquid banner-cta-liquid--primary inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-white"
            >
              <span class="banner-cta-text">{{ currentBanner.cta1 }}</span>
            </RouterLink>
            <RouterLink
              :to="{ name: 'about', hash: '#about-jinxin' }"
              class="hs-text-button banner-cta-liquid banner-cta-liquid--outline inline-flex items-center justify-center rounded-2xl px-8 py-4 text-white"
            >
              <span class="banner-cta-text">{{ currentBanner.cta2 }}</span>
            </RouterLink>
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

    <!-- 子导航（走进高阳同款，仅高亮联系我们 Tab） -->
    <nav
      class="sticky top-[64px] z-[30] border-b border-zinc-200/80 bg-white/80 backdrop-blur-xl dark:border-zinc-800 dark:bg-[#12151f]/85 lg:top-[72px]"
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
          @click="onTabClick(t)"
        ></button>
      </div>
    </nav>

    <!-- 详情模块（按你的框架：地址电话地图 / 分公司 / 在线留言） -->
    <section class="scroll-mt-28 border-b border-zinc-200/90 bg-zinc-100/70 py-12 dark:border-zinc-800 dark:bg-[#0f1219] sm:py-16">
      <div class="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div class="reveal mb-10 text-left">
          <h2 class="hs-text-page-h2 text-[#111827] dark:text-white" data-i18n="sub_ab_5">联系我们</h2>
          <div class="hs-heading-rule mt-3" aria-hidden="true"></div>
        </div>

        <!-- 1) 服务热线 + 中国地图（五地标注） -->
        <div class="reveal overflow-hidden rounded-lg border border-zinc-200 bg-white/90 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/40">
          <div class="grid grid-cols-1 lg:grid-cols-12 items-stretch gap-0">
            <div class="lg:col-span-8">
              <div class="p-6">
                <h3 class="text-[18px] font-semibold text-zinc-900 dark:text-white">北京高阳金信信息技术有限公司</h3>

                <div class="mt-5 space-y-2">
                <div class="flex items-center gap-4">
                  <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400 dark:bg-zinc-800/70 dark:text-zinc-500">
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <p class="text-[14px] leading-7 text-zinc-700 dark:text-zinc-300">
                      地址：{{ contactInfo.address }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-4">
                  <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400 dark:bg-zinc-800/70 dark:text-zinc-500">
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.07 4.18 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.72c.12.9.38 1.77.77 2.59a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.49-1.33a2 2 0 0 1 2.11-.45c.82.39 1.69.65 2.59.77A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <p class="text-[14px] leading-7 text-zinc-700 dark:text-zinc-300">
                      电话：
                      <a :href="`tel:${contactInfo.phone}`" class="hover:underline">{{ contactInfo.phone }}</a>
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-4">
                  <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400 dark:bg-zinc-800/70 dark:text-zinc-500">
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M4 4h16v16H4z" />
                      <path d="M22 6l-10 7L2 6" />
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <p class="text-[14px] leading-7 text-zinc-700 dark:text-zinc-300">
                      邮箱：
                      <a :href="`mailto:${contactInfo.email}`" class="hover:underline break-all">{{ contactInfo.email }}</a>
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-4">
                  <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400 dark:bg-zinc-800/70 dark:text-zinc-500">
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M6 9V4h12v5" />
                      <path d="M6 13h12v7H6z" />
                      <path d="M6 9h12" />
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <p class="text-[14px] leading-7 text-zinc-700 dark:text-zinc-300">传真：{{ contactInfo.fax }}</p>
                  </div>
                </div>

                <div class="flex items-center gap-4">
                  <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400 dark:bg-zinc-800/70 dark:text-zinc-500">
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <p class="text-[14px] leading-7 text-zinc-700 dark:text-zinc-300">客户热线：{{ contactInfo.customerHotline }}</p>
                  </div>
                </div>

                <div class="flex items-center gap-4">
                  <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400 dark:bg-zinc-800/70 dark:text-zinc-500">
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <p class="text-[14px] leading-7 text-zinc-700 dark:text-zinc-300">国内销售热线：{{ contactInfo.salesHotline }}</p>
                  </div>
                </div>
              </div>
            </div>
            </div>

            <div class="lg:col-span-4 px-6 pb-6 lg:pl-6 lg:pr-6 lg:py-6">
              <div class="relative h-[320px] w-full">
                <!-- 中国地图底图（白色填充 + 浅灰描边） -->
                <svg
                  class="contact-map__china absolute inset-0 h-full w-full"
                  viewBox="0 0 1000 850"
                  preserveAspectRatio="xMidYMid meet"
                  aria-label="中国地图"
                  role="img"
                >
                  <path
                    class="contact-map__china-path"
                    d="m 795.71875,16.875 -7.15625,3.1875 -11.125,2.71875 -11.4375,6.375 -5.78125,1.75 -5.3125,9.625 -2.65625,2.125 -0.375,5.03125 2.9375,-0.40625 5.8125,0.5 0.875,3.78125 1.84375,2.96875 -0.375,7.75 -5.625,6.71875 -4.09375,14.8125 -1.8125,7.8125 -2.78125,8.28125 3.125,4.90625 -2.65625,5.4375 -5.90625,1.40625 -6.4375,7.5625 -5.03125,3.65625 -8.375,-0.4375 -8.71875,-3.4375 -6.875,21.75 0.96875,3.4375 -2.0625,2.875 -0.90625,9.125 -3.8125,3.34375 3,6.375 4.46875,3.25 3.28125,-3.65625 12.15625,-2.53125 6.53125,3.03125 4.0625,-7.53125 10.3125,-1.875 6.09375,3.71875 4.40625,0.5625 2.8125,4.21875 9.125,5.4375 4.96875,9.625 -3.25,3.8125 -5.6875,1.34375 -7.3125,-1.8125 -2.96875,1.5625 -4.5625,-0.8125 -8.78125,6.96875 -4.1875,-0.84375 -1.5,4.34375 -7.15625,0.9375 -5.25,5.28125 -2.75,6.625 0.0312,4.28125 -8.09375,8.53125 L 696.5,222.5 693.65625,227.875 682.3125,238.9375 666.625,238.25 663.03125,235.28125 653.8125,235 l -6,16.375 10.5,12.625 -3.46875,2.78125 -2.96875,3.28125 -7.5,4.15625 -10.84375,14.5625 -14.5625,7.65625 -19.625,1.6875 -6.3125,1.625 -8.03125,-1.09375 -3.09375,2.65625 -8.84375,2.34375 -13.8125,7.125 -14.21875,9.0625 -4.59375,-1.4375 L 537.25,314 530.8125,315.71875 513.125,311 499.6875,307.65625 494.09375,300.9375 466.125,296.40625 450.96875,299 434.375,296 420.21875,294.84375 406.1875,291.375 398.40625,281 l -5.375,-18 -3.21875,-2.09375 0.0625,-4.25 -7.46875,-1.9375 -13.1875,-9.40625 -7.84375,-7.40625 -27.40625,-3.96875 -7.21875,-3.875 -5.46875,-1.09375 -2.625,-2.96875 0.71875,-7.125 6.15625,-8.46875 -1.34375,-6.5625 2.625,-3.28125 0.46875,-5.25 -5.6875,-10.875 -1.53125,-9.0625 -5.125,-7.59375 -2.8125,0.625 -5.375,-5.65625 -2.875,0.90625 -4.15625,-0.0312 -2.0625,-2.8125 -3.3125,-7.28125 -7.09375,-4.78125 0.0937,-2.75 -3.28125,-5.625 1.65625,-2.53125 -0.25,-4.125 -4.625,1.125 -4.78125,-2.0625 -5.71875,0.96875 -0.71875,4.59375 -2.28125,5.375 -7.4375,3.25 -7.09375,-1.1875 -5.6875,13.09375 0.78125,10.3125 -1.53125,5.375 -6.5,1.21875 -6.15625,3 -2.4375,-2.84375 -4.34375,-2.3125 -5.8125,-0.34375 -13.375,-7.5625 -2,5 L 195,189.0625 189.71875,200.03125 194,204.25 l -2.90625,5.78125 -3.5625,-2.4375 -5.75,0.0937 -4,-5.125 -10.90625,1.9375 -14.59375,0 -3.59375,3 8,4.78125 -2.03125,3.25 -2.5625,10.15625 2.71875,13.28125 -1.125,4.09375 0.59375,4.5 -5.65625,1.59375 -0.28125,4.0625 -5.71875,2.25 -0.375,4.875 -2.1875,10.03125 -4.34375,-1.40625 L 132,271.25 l -8.90625,1.5 -14.15625,4.15625 -7.875,6.8125 -10.59375,-1.125 -9.28125,-3.53125 -7.4375,8.21875 -5.3125,4.03125 -4.40625,-1.625 -5.21875,0.46875 -2.21875,-7.5625 -5.65625,2.125 -6.71875,-2.46875 -0.34375,2.4375 -9,2.9375 -5.59375,-0.9375 -3.96875,3.4375 -1.15625,7.8125 -4.84375,0.90625 -1.875,4.1875 1.875,6.25 -2.9375,1.5 1.34375,9.125 5.125,-2.59375 10.15625,6.5 -2.46875,6.375 0.78125,4.53125 L 30.5,345.25 l 0.09375,5.15625 -11.375,0.125 -0.1875,3.25 5.9375,3.9375 7.0625,1.71875 1.75,5.40625 5.125,2.0625 1.40625,8.6875 -1.875,5.5625 2.9375,6.5625 4.53125,0.90625 6.34375,7.21875 14.25,6.6875 0.90625,-0.0312 0.03125,0.0625 0.78125,-0.0937 1.65625,-0.0312 0.71875,1.375 -1.1875,2.03125 -0.5625,1.78125 1.125,4.21875 0.125,1.59375 -0.1875,2.1875 0.6875,1.59375 0.25,2.59375 -0.25,1.4375 1.03125,2.28125 2,0.875 3.34375,1.46875 1.46875,1.8125 0.6875,1.40625 1.90625,1.125 0.75,1.34375 -0.4375,2.375 -1.21875,1.09375 -3.96875,0.625 -0.4375,2.09375 0.125,2.0625 0.25,2.21875 -0.3125,1.6875 -1,3.6875 0.6875,2.78125 -0.0625,0.375 0.25,0.28125 0.0625,0.28125 0.5,0.5 0,-0.0625 4.90625,5.875 -0.03125,0.25 -1.6875,-0.75 -0.53125,1.46875 -0.78125,0.96875 -0.28125,0.90625 0.5,0.84375 0.8125,0.34375 0.5625,1.9375 -0.53125,1.28125 -0.65625,0.40625 0.46875,0.96875 0.03125,0.90625 -0.65625,1.5 0.25,0.875 -0.875,1.09375 -0.21875,1.40625 1.1875,-0.1875 1.03125,-0.53125 -0.0625,0.53125 -9.1875,1.8125 -1.625,-5.21875 -5.125,-0.96875 -0.9375,6.09375 2.96875,7.8125 -0.25,0.75 -0.375,-0.9375 -2.03125,-2.53125 -1,-2.65625 -1.28125,0.375 0.09375,1.71875 0.8125,-0.21875 1.21875,2.0625 1.375,2.28125 0.375,1.9375 0.15625,-0.1875 -0.40625,1.125 0.28125,4 -1.1875,3.84375 -0.0625,2.53125 1.875,1.84375 -0.40625,0.125 0.90625,1.875 0.0625,1.78125 0.53125,1.125 2.96875,1.21875 1.3125,0 0.84375,0.0625 3.78125,3.71875 6.4375,1.6875 3.25,5.03125 -0.84375,-0.96875 -0.1875,1.4375 -0.09375,0.96875 1.03125,0.40625 0.90625,1.15625 0.8125,-0.53125 0.4375,0.6875 7.03125,6.59375 5.09375,5.65625 2.15625,4.4375 10.40625,-7 1.1875,3.6875 4.59375,3.25 9.25,6.46875 4.09375,5.84375 7.5,5.9375 1.84375,8.09375 4.84375,4.5625 4.125,-5.34375 3.65625,2.09375 -1.09375,9.125 12.46875,8 5.46875,-0.53125 -0.53125,3.25 1.03125,4.65625 5.625,1.21875 6.5625,4.34375 1.71875,5.09375 2.90625,-3 3.125,3.46875 2.6875,1.21875 4.71875,-2.90625 10.15625,8.40625 5.71875,-0.90625 3.09375,2.21875 18.75,-4.21875 4.4375,2.46875 0.125,3.59375 -2.84375,6.25 1.09375,3.59375 1.78125,-0.21875 5.9375,-6.3125 7.125,-5.96875 10.09375,-4.625 5.8125,1.96875 6.15625,6.15625 11.53125,1.5 7.375,5.1875 -1.75,3.78125 0.96875,2.8125 1.9375,2 4.53125,0.21875 1.53125,1.625 -0.21875,1.9375 -1.84375,2.34375 0.0625,2.125 1.15625,0.90625 0.625,2.28125 -0.1875,0.84375 3.84375,0.125 3.875,-0.71875 3,-0.96875 2.71875,2.0625 3.40625,0.125 3.46875,0.75 3.40625,-0.4375 1.6875,0.3125 0.96875,-0.28125 4.21875,-0.78125 2.34375,-0.59375 0.78125,-3.34375 3.0625,-2.875 2.71875,-1.625 2.875,-3.09375 4,-0.75 6.84375,-1.40625 3,-1.875 2.5,-0.625 2.09375,-1.25 2.09375,-0.78125 1.25,-3.5 11.4375,-3.53125 0.625,1.40625 1.625,1.0625 2.78125,-0.0312 1.75,-0.71875 1.28125,2.125 1.4375,0.21875 0.4375,-0.46875 3.53125,2.84375 3.9375,3.25 2.8125,1.09375 1.375,1.5625 0.125,1.34375 6.84375,-4.4375 0.5625,-1.875 -0.625,-2.5 0.625,-1.96875 -0.625,-0.0312 3.46875,-3.96875 3.65625,-1.28125 2.65625,3.21875 3.9375,1.71875 2.09375,7.21875 4.28125,9.4375 2,-2.5 4.53125,2.84375 -0.8125,7.71875 0.84375,3.375 -0.46875,15.34375 -3,6.28125 1.03125,4.90625 -3.21875,1.40625 -3.375,4.6875 -3.09375,0.125 -1.625,4.59375 L 411.5,680.5 l -1.71875,5.78125 0.625,2.40625 -3.28125,1.09375 -1.53125,2.53125 0.65625,5 1.65625,1.84375 0.78125,4.28125 -2.6875,4.40625 0.59375,2.5 5.28125,-1.8125 2.9375,-3 9.25,-0.625 2.40625,1.5 5.125,-0.53125 -3.59375,5.0625 2.65625,3.96875 1.6875,10.90625 3.5625,3.125 7.9375,0.0937 0.84375,2.84375 -3.71875,5.5625 0.78125,4.3125 -3.125,4.125 -1,4.15625 3.59375,1.5625 2,-0.40625 10.40625,2.46875 -0.625,5.09375 2.9375,3.09375 2.90625,5.875 2.5625,-2.59375 4.6875,1.96875 4.96875,-4.09375 5.34375,-1.875 4.65625,11.96875 4.78125,-0.875 4.53125,1.09375 0.9375,-10.34375 -4.6875,-12.65625 3.0625,-5.8125 2.625,1.1875 7,-0.34375 3.84375,-2.90625 2.96875,-4.375 6.5625,3.25 2.34375,2.96875 2.03125,0.15625 6.90625,-7.375 3.3125,4.6875 2.59375,-4.5625 6.34375,6.28125 1.75,-4.1875 3.1875,-3.15625 2.6875,2.5 3.34375,-1.625 7.0625,-2.71875 0.21875,-4.21875 9.59375,-6.46875 5.15625,4.96875 7.5,4.03125 4.78125,-1.5625 3.21875,3.09375 3.96875,-1.65625 5.75,2.125 0.125,3.09375 -3.65625,2.90625 -0.34375,3.375 1.625,1.59375 1.8125,7.03125 6.03125,1.53125 3.21875,3.75 7.4375,3.03125 6.75,-1.875 3.625,2.375 3.34375,-1.3125 0.53125,0.46875 2.03125,0 1,-2.25 2.78125,-0.78125 0,-4.78125 2.78125,-0.75 0.75,3.03125 2.53125,3.28125 1.5,-1.53125 2.78125,1.53125 2.78125,0.75 1.03125,4.03125 1.75,-1.25 6.0625,-1.28125 -1,-4.28125 1.25,-0.25 3.03125,3.78125 5.8125,0.5 -1.25,2.28125 -2.78125,4.28125 -1.03125,8.09375 2.78125,0.75 0.5,5.8125 4.3125,2.28125 -1.28125,1 0.78125,2.53125 7.5625,-0.25 3.53125,-3.53125 0.25,-1.53125 -3.53125,-3.53125 -0.75,-3.53125 -2.78125,-1 -1,-3.28125 2.25,-2.28125 3.5625,-2.53125 2.5,-0.25 3.5625,-4.8125 4.03125,-0.25 1.75,-2.25 5.5625,-0.28125 1.78125,-1.5 3.28125,0 3.28125,-2.28125 0,-2.25 3.03125,-1.03125 2.28125,-1.25 3.28125,0 4.03125,0 0.75,-2.28125 3.78125,1 4.3125,-3.03125 4.03125,0 -0.40625,-5.90625 0.96875,-2.125 3.375,4.375 3.53125,-4.5625 L 730.375,734 l 2.8125,2.6875 1.5,-0.28125 0.96875,-1.84375 -0.25,-1.8125 -1.40625,-3.6875 -0.375,-3.5 -0.84375,-1.34375 0.75,-2.03125 2.03125,2.03125 2.21875,-0.21875 0.96875,2.40625 2.375,2.1875 2.78125,-0.15625 -1.03125,3.59375 2.53125,-0.25 1.6875,0.4375 2.8125,0.53125 -0.5625,-1.8125 2.03125,-1.28125 -3.1875,-2.6875 3.375,-1.34375 2.90625,1.34375 0.28125,-3.78125 3.53125,-1.75 0.5,3.78125 3.28125,-0.25 1.53125,-2.53125 3.53125,-3.28125 3.03125,-0.25 1.25,0.75 0.25,2.28125 2.78125,0 0.78125,-4.28125 1,-1.28125 4.03125,2.28125 3.78125,-2.78125 2.28125,-0.5 3.03125,-2.28125 4.8125,-0.75 0.5,-5.3125 4.03125,-1.75 -1.5,-2.53125 -2.03125,-0.78125 5.8125,-0.5 3.78125,-1.75 -2.03125,-1.78125 1.78125,-2.53125 3.53125,0.25 0.75,-3.53125 2.78125,0.5 -1,-4.53125 3.78125,1 0,-4.28125 2.78125,0 2.03125,-3.28125 2,-2.03125 -1.25,-2.53125 -2.28125,-2 4.03125,-0.75 1.78125,-2.53125 3.03125,-1.53125 4.28125,0 1.28125,-1.75 1,-2.28125 -2.03125,-1.25 -0.75,-2.03125 5.3125,-0.25 1,-1.78125 -1.5,-2.78125 2,-1.75 2.03125,-1.78125 2.28125,-0.75 -2.28125,-2.78125 0.5,-2.78125 1.78125,-2 2.78125,1.75 2.25,0.5 0.53125,-1.75 -2.28125,-3.28125 2.28125,-3.5625 -1.28125,-2.25 0.5,-2.28125 -1.5,-2.53125 1.25,-4.03125 1.78125,-2.28125 -1.03125,-1.75 -3.78125,-3.28125 0.78125,-2.78125 3.28125,0.5 1,1.25 0.75,-4.03125 3.28125,-2.28125 1.53125,-1.25 0.25,-3.53125 2,-2.03125 -1.75,-1.25 2.53125,0 2.78125,-3.8125 -0.28125,-3.78125 0.28125,-2.28125 1.75,-5.03125 1.53125,-3.53125 1.75,-1.28125 0.5,-6.0625 3.03125,-1.25 0.78125,5.0625 2.75,-3.8125 3.3125,-2.25 -2.03125,-4.3125 -1.78125,-3.03125 2.78125,-2.53125 0,-3.53125 2.78125,-3.78125 -1,-3.03125 1.75,-1.5 -1,-3.8125 -0.5,-6.0625 -1.78125,4.3125 -2.78125,0.25 3.5625,-4.8125 L 879,542.875 l 3.53125,-1.75 -0.5,-2.53125 -5.5625,-2.28125 -2.28125,0.75 -1.5,3.5625 -2.53125,1 -3.28125,-2.28125 -4.53125,-3.53125 -3.8125,0.5 -4.78125,4.3125 -2.53125,1 -4.5625,-0.75 -4.03125,-1.03125 -0.75,-1.25 3.28125,-1.78125 5.3125,-0.5 3.03125,-1 0.25,-3.03125 6.3125,-5.0625 4.53125,-3.28125 3.28125,-4.03125 0.78125,-4.03125 -3.5625,-3.03125 -5.28125,-2.03125 -4.0625,-2.28125 -2,-2.25 -4.0625,-0.78125 -4.78125,-0.75 -0.5,-2.78125 -3.78125,-0.75 -4.0625,2.03125 -1.5,0.5 1.75,-2.78125 3.28125,-1.53125 4.8125,0.5 1.75,2.53125 2.78125,1.03125 4.8125,0 3.53125,0.5 3.53125,2 4.5625,0.78125 2.25,-0.5 0.78125,-1.53125 -2.78125,-3.78125 -5.3125,-4.8125 -4.78125,-1.25 -1.78125,-5.0625 -4.5625,-1.75 -5.03125,-1.28125 -1.78125,-1.25 0.78125,-3.28125 L 842.375,479 l -6.0625,-8.84375 -3.78125,-6.3125 -4.8125,-9.09375 -2.5,-2.53125 -6.59375,-2.03125 -5.78125,-1.75 -2.28125,-2.53125 -5.5625,-1 -0.5,-4.5625 2.53125,-2.5 0.5,-4.3125 1.5,-2.28125 2.03125,-5.03125 3.28125,-1.03125 0.75,-2.5 1.53125,-4.0625 2.53125,-2.25 -2.78125,-3.03125 1.5,-1.53125 2.53125,1.28125 3.28125,0.5 2.78125,-2.78125 -0.25,-6.0625 1.5,-2.78125 2.28125,-0.5 4.5625,-3.78125 3.28125,-2.28125 4.28125,-3.28125 2.53125,-3.28125 2.78125,0.5 1.25,-1.25 2.78125,2.5 3.28125,-2.5 -1.25,-3.3125 1,-2.5 -0.25,-4.5625 -3.28125,-1.25 -2.78125,1.5 -3.28125,-1.5 -5.0625,2 -4.03125,2.03125 -2.28125,-1 -1.75,-2.03125 -2.28125,0.5 -4.28125,-2.78125 -3.28125,-1.5 -4.0625,1.5 -4.28125,3.28125 -0.75,4.0625 -4.5625,4.03125 -0.75,4.28125 -3.28125,3.5625 -7.0625,-0.78125 -5.3125,-2 -0.75,-9.59375 -3.28125,-3.5625 -4.8125,-1.25 L 780,374.9375 l -2.78125,1.03125 -3.28125,2 -3.03125,-2.53125 -4.03125,-3.28125 -2.78125,-5.28125 -0.5,-6.5625 1.75,-4.3125 4.0625,-2.78125 2.25,-0.5 3.5625,1.78125 2.5,-1.28125 1.53125,-1.75 3.53125,0 1.5,-1.03125 1.28125,0.53125 0.75,-5.0625 1.25,-4.5625 2.78125,-4.53125 2.53125,-1.5 0,-2.28125 5.3125,-3.28125 6.0625,-4.5625 3.03125,-2 0.25,-5.0625 3.78125,-5.3125 1.53125,-1.5 0.5,-3.28125 L 816.625,306 l 5.03125,-0.25 3.5625,-2.03125 3.03125,0.78125 5.03125,5.03125 2.78125,2.03125 -1.75,4.03125 -1.78125,4.03125 -1.25,3.8125 -4.0625,3.03125 -1.75,2 -0.25,5.0625 -2.28125,1.25 3.53125,2.03125 2.03125,1.78125 3.53125,-1.03125 -1.53125,4.3125 -0.5,2.5 -2.78125,1.53125 -1,2.03125 -2.28125,0.25 -1,3.78125 1.5,1.75 4.0625,-3.28125 3.53125,-4.03125 4.03125,-2.78125 2.28125,-2.53125 1.75,-4.03125 7.59375,-6.8125 5.28125,-4.34375 2.53125,-0.25 1.125,-2.46875 4.625,-0.84375 2.0625,-2.0625 5.4375,-0.5 3.46875,-2.09375 1.34375,-6.5 9.28125,-11.65625 10.84375,-9.1875 7.125,-12.03125 0.53125,-7.84375 5.625,-3.9375 6.78125,4.75 14.5625,-1.9375 0.40625,-3.875 -5.3125,-5.90625 0.90625,-3.28125 7.625,-1.9375 7.1875,-4.75 1.09375,-6.53125 5.40625,-1.4375 0.5,-13.1875 4.6875,-0.75 3.3125,5.09375 4.71875,0.84375 -2,-2.28125 1.8125,-3.0625 4.84375,-3.5 2.375,-12.03125 -2.5625,-2.75 -1.625,-11.34375 -9.5,-16.4375 5.15625,-2.46875 5.125,-10.5625 3.9375,1.5 15.375,-1.25 L 981,159.96875 983.84375,156.53125 984.625,144 l 1.84375,-4.25 -1.8125,-5.875 0.5,-4 -0.59375,-10.28125 -0.875,-3.59375 1.40625,-3.40625 2.65625,-2.1875 1.34375,-5.875 -4.625,-5.125 -0.0625,-6.5625 -4.78125,-2.0625 -7.71875,5.6875 -4,5.5 -3.90625,0.71875 -4.21875,3.21875 -3.25,7.875 -9.9375,4.5 -6.9375,0.5625 -4.65625,2.4375 -8.40625,-6.78125 1.25,-5.125 -5.65625,-5.78125 -1.3125,-6.21875 -5.25,1.8125 -14.3125,-8.5625 -4.53125,2.1875 -8.375,-3.8125 -5.34375,3.4375 -6.8125,0.375 -6.125,-6.0625 -1,-6.625 -3.625,-1.5 -1.28125,-7.1875 -9.09375,-9.375 -0.375,-4.34375 -9.21875,-11.46875 -1.71875,-6.125 -4.125,-5.78125 -4.75,-3.71875 -2.25,-3.96875 -13.21875,-6.59375 -5.59375,2.5 -18.15625,-5.6875 z m 88.96875,627.46875 -1.25,1.9375 0.53125,2.15625 -4.28125,1.59375 -3.03125,2.5 -1.4375,3.21875 -0.53125,3.9375 -2.3125,2.5 -1.625,5.90625 -1.78125,5.15625 -2.65625,6.25 -1.4375,5.1875 -0.53125,5.53125 0.34375,5.1875 1.4375,2.3125 2.125,3.21875 1.96875,5.71875 2.5,3.375 3.03125,1.25 2.875,0.71875 2.3125,3.03125 1.4375,3.75 0,2.15625 0.875,0.53125 2.34375,-0.71875 0.53125,-4.8125 -1.0625,-4.46875 1.25,-5.875 3.5625,-5.71875 1.96875,-6.78125 1.0625,-6.4375 0.71875,-18.40625 0.71875,-5.53125 0.875,-1.4375 0,-3.75 -1.25,-1.40625 -1.0625,-2.875 1.78125,-2.84375 0.71875,-1.625 -1.25,-1.40625 -3.5625,-0.90625 -1.625,0 -1.78125,-2.125 -2.5,0 z M 683.25,788.625 l -4.8125,2.125 -4.28125,1.25 -6.59375,0.90625 -0.90625,1.59375 -3.21875,0.71875 -5.1875,-0.875 -1.25,0.15625 -1.78125,0.90625 0,1.78125 -1.40625,0.71875 -3.9375,-0.1875 -2.15625,1.4375 0,2.125 2.5,0.1875 -1.40625,2.3125 -2.6875,0.71875 -7.6875,5.375 -1.25,2.65625 0.71875,2.5 L 637,817.375 l 0.90625,4.8125 1.25,3.03125 0.71875,4.28125 5.34375,2.34375 4.28125,1.9375 6.09375,-0.34375 2.125,1.96875 4.46875,-0.71875 0,-3.5625 3.5625,-0.90625 3.21875,-0.1875 0.1875,-1.9375 3.5625,-4.46875 2.15625,0 2.3125,-1.09375 0.71875,-4.625 0.90625,-6.25 2.65625,-5.71875 2.6875,-3.75 2.5,-2.15625 -0.53125,-3.375 -1.4375,-3.9375 0,-3.5625 -1.4375,-0.53125 z"
                  />
                </svg>

                <!-- 五地标注（与 SVG 轮廓对齐的百分比坐标） -->
                <div class="absolute inset-0" aria-hidden="true">
                  <button
                    v-for="m in mapMarkers"
                    :key="m.key"
                    type="button"
                    class="contact-map__marker text-[#3d59ff] dark:text-[#8aa0ff]"
                    :title="m.label"
                    :aria-label="m.label"
                    :style="{
                      left: m.xPct + '%',
                      top: m.yPct + '%',
                    }"
                  >
                    <span class="contact-map__marker-ring" />
                    <svg class="contact-map__marker-pin" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 22s7-4.5 7-12a7 7 0 1 0-14 0c0 7.5 7 12 7 12z"
                        fill="currentColor"
                      />
                      <circle cx="12" cy="10" r="2.4" fill="#ffffff" opacity="0.95" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 2) 分公司相关信息 -->
        <section class="mt-12">
          <div class="reveal mb-6 text-left">
            <h2 class="hs-text-block-h2 text-[#0f172a] dark:text-white">分公司信息</h2>
            <div class="hs-heading-rule mt-4" aria-hidden="true"></div>
          </div>

          <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <article
              v-for="b in branches"
              :key="b.key"
              class="group reveal reveal--from-bottom overflow-hidden rounded-2xl border border-zinc-200 bg-white/90 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#3d59ff]/15 hover:ring-2 hover:ring-inset hover:ring-[#3d59ff]/55 dark:border-zinc-700 dark:bg-zinc-900/40"
            >
              <div class="relative">
                <img
                  :src="b.imageUrl"
                  alt=""
                  class="h-[168px] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                  loading="lazy"
                />
                <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 to-transparent"></div>

                <div class="absolute inset-x-0 bottom-4 flex justify-center px-4">
                  <div class="inline-flex min-w-[140px] items-center justify-center rounded-xl bg-[#3d59ff] px-6 py-2 text-[14px] font-semibold text-white shadow-lg shadow-[#3d59ff]/25">
                    {{ b.cityLabel }}
                  </div>
                </div>
              </div>

              <div class="space-y-2 bg-white/70 p-5 backdrop-blur-sm dark:bg-zinc-900/30">
                <div class="flex items-center gap-3 text-[13px] text-zinc-700 dark:text-zinc-300">
                  <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400 dark:bg-zinc-800/70 dark:text-zinc-500">
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                  </div>
                  <p class="leading-6">地址：{{ b.address }}</p>
                </div>

                <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-zinc-700 dark:text-zinc-300">
                  <div class="flex items-center gap-3">
                    <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400 dark:bg-zinc-800/70 dark:text-zinc-500">
                      <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.07 4.18 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.72c.12.9.38 1.77.77 2.59a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.49-1.33a2 2 0 0 1 2.11-.45c.82.39 1.69.65 2.59.77A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                    <p class="leading-6">
                      电话：
                      <a :href="`tel:${b.phone}`" class="font-medium text-[#3d59ff] hover:underline dark:text-[#8aa0ff]">{{ b.phone }}</a>
                    </p>
                  </div>

                  <div class="flex items-center gap-3">
                    <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400 dark:bg-zinc-800/70 dark:text-zinc-500">
                      <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path d="M4 4h16v16H4z" />
                        <path d="M22 6l-10 7L2 6" />
                      </svg>
                    </div>
                    <p class="leading-6">
                      邮箱：
                      <a :href="`mailto:${b.email}`" class="font-medium text-[#3d59ff] hover:underline dark:text-[#8aa0ff] break-all">{{ b.email }}</a>
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

        <!-- 3) 在线留言（#contact-message：侧栏「联系」等锚点跳转） -->
        <section id="contact-message" class="mt-12 scroll-mt-28">
          <div class="reveal mb-6 text-left">
            <h2 class="hs-text-block-h2 text-[#0f172a] dark:text-white">在线留言</h2>
            <div class="hs-heading-rule mt-4" aria-hidden="true"></div>
          </div>

          <div class="reveal rounded-2xl border border-zinc-200 bg-white/90 p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/40">
            <form class="grid grid-cols-1 gap-4 lg:grid-cols-2" @submit.prevent="onSubmitMessage">
              <div class="lg:col-span-1">
                <label class="text-[13px] font-medium text-zinc-600 dark:text-zinc-300">姓名</label>
                <input v-model="form.name" required class="mt-2 h-[46px] w-full rounded-xl border border-zinc-200 bg-white px-4 text-[14px] text-zinc-900 outline-none transition focus:border-[#3d59ff]/60 dark:border-zinc-700 dark:bg-zinc-950/20 dark:text-white" />
              </div>

              <div class="lg:col-span-1">
                <label class="text-[13px] font-medium text-zinc-600 dark:text-zinc-300">公司/机构</label>
                <input v-model="form.company" class="mt-2 h-[46px] w-full rounded-xl border border-zinc-200 bg-white px-4 text-[14px] text-zinc-900 outline-none transition focus:border-[#3d59ff]/60 dark:border-zinc-700 dark:bg-zinc-950/20 dark:text-white" />
              </div>

              <div class="lg:col-span-1">
                <label class="text-[13px] font-medium text-zinc-600 dark:text-zinc-300">邮箱</label>
                <input v-model="form.email" type="email" required class="mt-2 h-[46px] w-full rounded-xl border border-zinc-200 bg-white px-4 text-[14px] text-zinc-900 outline-none transition focus:border-[#3d59ff]/60 dark:border-zinc-700 dark:bg-zinc-950/20 dark:text-white" />
              </div>

              <div class="lg:col-span-1">
                <label class="text-[13px] font-medium text-zinc-600 dark:text-zinc-300">电话</label>
                <input v-model="form.phone" class="mt-2 h-[46px] w-full rounded-xl border border-zinc-200 bg-white px-4 text-[14px] text-zinc-900 outline-none transition focus:border-[#3d59ff]/60 dark:border-zinc-700 dark:bg-zinc-950/20 dark:text-white" />
              </div>

              <div class="lg:col-span-2">
                <label class="text-[13px] font-medium text-zinc-600 dark:text-zinc-300">留言内容</label>
                <textarea
                  v-model="form.message"
                  required
                  rows="5"
                  class="mt-2 w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3 text-[14px] text-zinc-900 outline-none transition focus:border-[#3d59ff]/60 dark:border-zinc-700 dark:bg-zinc-950/20 dark:text-white"
                ></textarea>
              </div>

              <div class="flex flex-col gap-2 lg:col-span-2 sm:flex-row sm:items-center sm:gap-3">
                <button
                  type="submit"
                  :disabled="submitting"
                  class="hs-text-button btn-primary inline-flex h-[46px] items-center justify-center rounded-xl px-7 text-[14px] font-semibold text-white shadow-sm transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {{ submitting ? "提交中…" : "提交" }}
                </button>
                <p v-if="formFeedback" class="text-[13px]" :class="formFeedback.type === 'ok' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'">
                  {{ formFeedback.text }}
                </p>
                <p v-else class="text-[13px] text-zinc-500 dark:text-zinc-400">
                  提交后由后台保存，工作人员会尽快与您联系（部署需在服务器配置留言接口）。
                </p>
              </div>
            </form>
          </div>
        </section>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import { DEFAULT_BANNERS, normalizeBanner, loadBanners } from "../cms/banners.js";
import BannerNoticeBar from "../components/BannerNoticeBar.vue";

const route = useRoute();
const router = useRouter();

const leaving = ref(false);

onBeforeRouteLeave((_to, _from, next) => {
  // 路由切走时做离场：避免用户感觉“瞬间切页面”
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (reduceMotion) return next();
  leaving.value = true;
  window.setTimeout(() => next(), 220);
});

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

function tabButtonClass(t) {
  if (t.noScroll) {
    return route.name === "about-contact"
      ? "bg-[#3d59ff] text-white shadow-lg shadow-[#3d59ff]/25 cursor-pointer"
      : "cursor-pointer border border-dashed border-zinc-200/90 bg-zinc-50/90 text-zinc-600 hover:border-[#3d59ff]/40 dark:border-zinc-600 dark:bg-zinc-900/60 dark:text-zinc-300";
  }
  // 联系页不做滚动 spy：保留“未选中态”视觉
  return "border border-zinc-200/90 bg-white/90 text-zinc-600 hover:-translate-y-0.5 hover:border-[#3d59ff]/40 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-300";
}

function onTabClick(t) {
  if (t.noScroll) {
    if (route.name !== "about-contact") router.push({ name: "about-contact" });
    return;
  }
  router.push({ name: "about", hash: `#${t.id}` });
}

const contactInfo = {
  address: "北京市海淀区阜成路67号银都大厦18层",
  phone: "010-68452288",
  email: "zhang_chh@hisuntech.com",
  fax: "010-68471956",
  customerHotline: "18665822796",
  salesHotline: "18665822796",
};

/** 五地标注：线性经纬度 → 百分比与当前 SVG 中国轮廓不一致，低纬度会被压到图下方（视觉上像海南/广西）。此处按底图手工标定到珠三角一带。 */
const mapMarkers = [
  { key: "beijing", label: "北京", xPct: 66.5, yPct: 40.5 },
  { key: "shanghai", label: "上海", xPct: 78.2, yPct: 56.5 },
  { key: "guangzhou", label: "广州", xPct: 71.2, yPct: 69.2 },
  { key: "shenzhen", label: "深圳", xPct: 73.6, yPct: 71 },
  { key: "hongkong", label: "香港", xPct: 73.8, yPct: 73.2 },
];

const branches = [
  {
    key: "shanghai",
    cityLabel: "上海",
    address: "上海市长宁区延安西路2299号上海世贸大厦10A83",
    phone: "021-62293336",
    email: "shhr@hisuntech.com",
    imageUrl: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1400&q=80",
  },
  {
    key: "shenzhen",
    cityLabel: "深圳",
    address: "深圳市龙岗区雅宝路1号星河WORLD G2栋大厦8F",
    phone: "0755-83521923",
    email: "szhr@hisuntech.com",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80",
  },
];

const form = ref({
  name: "",
  company: "",
  email: "",
  phone: "",
  message: "",
});

const submitting = ref(false);
const formFeedback = ref(null);

const contactApiUrl = import.meta.env.VITE_CONTACT_API_URL || "/api/contact";

async function onSubmitMessage() {
  formFeedback.value = null;
  const name = form.value.name?.trim();
  const email = form.value.email?.trim();
  const message = form.value.message?.trim();
  if (!name || !email || !message) return;

  submitting.value = true;
  try {
    const res = await fetch(contactApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        message,
        company: form.value.company?.trim() || "",
        phone: form.value.phone?.trim() || "",
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (data.error === "server_not_configured") {
        formFeedback.value = { type: "err", text: "留言服务未配置，请稍后再试或通过邮件联系我们。" };
      } else {
        formFeedback.value = { type: "err", text: "提交失败，请稍后重试或通过邮件联系我们。" };
      }
      return;
    }
    formFeedback.value = { type: "ok", text: "提交成功，我们会尽快与您联系。" };
    form.value = { name: "", company: "", email: "", phone: "", message: "" };
  } catch {
    formFeedback.value = { type: "err", text: "网络异常，请检查网络后重试。" };
  } finally {
    submitting.value = false;
  }
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
});

onUnmounted(() => {
  clearInterval(bannerTimer);
  if (bannerGlowLoopRaf != null) {
    window.cancelAnimationFrame(bannerGlowLoopRaf);
    bannerGlowLoopRaf = null;
  }
});
</script>

<style scoped>
.contact-page--enter {
  animation: contactIn 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.contact-page--leaving {
  animation: contactOut 220ms ease both;
}

@keyframes contactIn {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.99);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes contactOut {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(10px) scale(0.99);
  }
}

@media (prefers-reduced-motion: reduce) {
  .contact-page--enter,
  .contact-page--leaving {
    animation: none !important;
  }
  .contact-map__marker-ring {
    animation: none !important;
  }
}

.contact-map__marker {
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 5;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #3d59ff;
  transition: transform 160ms ease, filter 160ms ease;
}

.contact-map__marker:hover {
  transform: translate(-50%, -50%) scale(1.05);
  filter: brightness(1.06);
}

.contact-map__marker-ring {
  position: absolute;
  inset: -6px;
  border-radius: 9999px;
  border: 2px solid rgba(61, 89, 255, 0.35);
  opacity: 0;
  animation: markerPing 1.9s ease-in-out infinite;
}

@keyframes markerPing {
  0% {
    transform: scale(0.75);
    opacity: 0.6;
  }
  55% {
    opacity: 0.25;
  }
  100% {
    transform: scale(1.35);
    opacity: 0;
  }
}

.contact-map__marker-pin {
  width: 18px;
  height: 18px;
  filter: drop-shadow(0 6px 12px rgba(61, 89, 255, 0.22));
  will-change: transform;
}

.contact-map__china {
  opacity: 1;
}

.contact-map__china-path {
  fill: #ffffff;
  stroke: #e5e7eb; /* 浅灰描边 */
  stroke-width: 2;
  vector-effect: non-scaling-stroke;
}

.dark .contact-map__china-path {
  fill: rgba(255, 255, 255, 0.06);
  stroke: rgba(255, 255, 255, 0.18);
}
</style>

