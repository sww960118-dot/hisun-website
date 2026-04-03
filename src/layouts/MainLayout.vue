<template>
  <div class="font-brand page-bg text-[#1a1a1a] dark:bg-[#0b0d12] dark:text-zinc-100 antialiased transition-colors duration-300">
      <!-- SVG sprite: inline icons -->
      <svg xmlns="http://www.w3.org/2000/svg" class="hidden" aria-hidden="true">
        <symbol id="i-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></symbol>
        <symbol id="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></symbol>
        <symbol id="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></symbol>
        <symbol id="i-mail" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></symbol>
        <symbol id="i-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></symbol>
        <symbol id="i-spark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l1.9 5.8h6.1l-5 3.6 1.9 5.8-5-3.6-5 3.6 1.9-5.8-5-3.6h6.1z"/></symbol>
        <symbol id="i-doc" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></symbol>
        <symbol id="i-phone" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></symbol>
        <symbol id="i-message" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-9-9c0 1.5.4 2.9 1 4.1L4 20l4.9-9A9 9 0 0121 12z"/></symbol>
      </svg>
    
      <div class="bg-blobs" aria-hidden="true">
        <svg class="blob -left-32 top-[8%] h-[320px] w-[320px] text-[#3d59ff]" viewBox="0 0 200 200" aria-hidden="true"><path fill="currentColor" d="M44.7,-76.4C58.9,-69.1,71.7,-58.9,79.6,-45.5C87.5,-32.1,90.5,-15.5,88.5-0.1C86.5,15.3,79.5,29.5,69.1,41.1C58.7,52.7,44.9,61.7,30.1,67.1C15.3,72.5,-0.5,74.3,-15.8,71.5C-31.1,68.7,-46.9,61.3,-58.6,49.5C-70.3,37.7,-77.9,21.5,-79.5,4.9C-81.1,-11.7,-76.7,-28.7,-67.1,-42.5C-57.5,-56.3,-42.7,-66.9,-27.1,-72.8C-11.5,-78.7,4.9,-79.9,44.7,-76.4Z" transform="translate(100 100)"/></svg>
        <svg class="blob right-[-120px] top-[35%] h-[280px] w-[280px] text-[#3d59ff]" viewBox="0 0 200 200" aria-hidden="true"><path fill="currentColor" d="M38.2,-65.1C52.1,-58.1,65.6,-49.5,73.1,-36.5C80.6,-23.5,82.1,-6.1,79.5,9.5C76.9,25.1,70.2,38.9,60.4,50.1C50.6,61.3,37.7,69.9,23.1,74.5C8.5,79.1,-7.2,79.7,-22.5,75.5C-37.8,71.3,-52.7,62.3,-64.5,49.5C-76.3,36.7,-85,20.1,-86.5,2.9C-88,-14.3,-82.3,-32.1,-71.5,-45.5C-60.7,-58.9,-44.7,-67.9,-28.5,-72.5C-12.3,-77.1,4.1,-77.3,38.2,-65.1Z" transform="translate(100 100)"/></svg>
        <svg class="blob left-[40%] bottom-[-80px] h-[260px] w-[260px] text-[#35227b]" viewBox="0 0 200 200" aria-hidden="true"><path fill="currentColor" d="M41.3,-71.2C55.1,-64.3,68.1,-54.1,75.6,-40.5C83.1,-26.9,85.1,-9.9,82.5,6.5C79.9,22.9,72.7,37.7,62.3,49.5C51.9,61.3,38.3,70.1,23.1,75.6C7.9,81.1,-8.9,83.3,-24.5,78.5C-40.1,73.7,-54.5,61.9,-65.5,47.5C-76.5,33.1,-84.1,16.1,-83.5,-0.5C-82.9,-17.1,-74.1,-33.1,-62.5,-45.5C-50.9,-57.9,-36.5,-66.7,-21.5,-71.5C-6.5,-76.3,9.1,-77.1,41.3,-71.2Z" transform="translate(100 100)"/></svg>
        <svg class="blob right-[15%] bottom-[12%] h-[180px] w-[180px] text-[#3d59ff]" viewBox="0 0 200 200" aria-hidden="true"><path fill="currentColor" d="M39.5,-67.8C53.1,-60.8,66.1,-50.5,74.3,-37.1C82.5,-23.7,86.1,-7.1,84.5,8.5C82.9,24.1,76.1,38.7,65.5,50.5C54.9,62.3,40.5,71.3,24.5,75.5C8.5,79.7,-9.1,79.1,-25.1,73.5C-41.1,67.9,-55.5,57.3,-66.5,43.5C-77.5,29.7,-85.1,12.7,-84.5,-4.5C-83.9,-21.7,-75.1,-38.1,-63.5,-50.5C-51.9,-62.9,-37.5,-71.3,-22.5,-75.5C-7.5,-79.7,8.1,-79.7,39.5,-67.8Z" transform="translate(100 100)"/></svg>
      </div>
    
      <header class="glass-header sticky top-0 z-[200]">
        <div class="mx-auto flex min-h-[64px] max-w-[1200px] items-center gap-2 px-4 py-2 sm:gap-3 sm:px-6 lg:min-h-[72px]">
          <RouterLink to="/" class="flex shrink-0 items-center" aria-label="Hi Sun">
        <img :src="'/img/logo_black.png'" alt="Hi Sun" width="160" height="40" class="h-9 w-auto max-h-10 max-w-[180px] object-contain dark:hidden" />
        <img :src="'/img/logo_white.png'" alt="Hi Sun" width="160" height="40" class="hidden h-9 w-auto max-h-10 max-w-[180px] object-contain dark:block" />
          </RouterLink>
    
          <!-- Desktop mega nav闂傚倷鐒︾€笛呯矙閹烘鍎楁い鏂垮⒔閸楁岸鏌ｉ幋锝嗩棄缂佲偓閸℃ü绻嗛柕鍫濇噹閺嗙喖鏌熼悡搴涘仮闁诡喗顨堝☉鐢稿川椤撳鎹囬弻锝呂旈埀顒勫箺濠婂牆鐒?-->
          <nav class="nav-desktop ml-2 hidden min-w-0 flex-1 xl:grid xl:grid-cols-7 xl:gap-0" aria-label="main navigation">
            <div class="nav-cell">
              <RouterLink
                to="/"
                class="hs-text-nav nav-link-main flex items-center justify-center gap-1 rounded-xl px-2 py-2 text-center text-zinc-600 dark:text-zinc-300"
                :class="route.name === 'home' ? '!text-[var(--theme-primary)] font-semibold' : ''"
                data-i18n="nav_hs_home"
              >高阳首页</RouterLink>
            </div>
    
            <div class="nav-cell nav-item relative">
              <RouterLink
                to="/about"
                class="hs-text-nav nav-link-main flex w-full cursor-pointer items-center justify-center gap-1 rounded-xl px-2 py-2 text-center text-zinc-600 dark:text-zinc-300"
                :class="['about', 'about-contact'].includes(route.name) ? '!text-[var(--theme-primary)]' : ''"
              >
                <span data-i18n="nav_about">走进高阳</span>
                <svg class="h-4 w-4 shrink-0 opacity-60 pointer-events-none"><use href="#i-chevron"/></svg>
              </RouterLink>
              <div class="nav-dd nav-dd--under absolute top-full z-[110] pt-0">
                <div class="glass-nav w-[220px] rounded-2xl p-2 shadow-2xl shadow-zinc-900/10 ring-1 ring-white/25 dark:shadow-black/40">
                  <RouterLink class="sub-link" :to="{ name: 'about', hash: '#about-group' }" data-i18n="sub_ab_1">集团简介</RouterLink>
                  <RouterLink class="sub-link" :to="{ name: 'about', hash: '#about-jinxin' }" data-i18n="sub_ab_2">公司简介</RouterLink>
                  <RouterLink class="sub-link" :to="{ name: 'about', hash: '#about-culture' }" data-i18n="sub_ab_3">企业文化</RouterLink>
                  <RouterLink class="sub-link" :to="{ name: 'about', hash: '#about-honors' }" data-i18n="sub_ab_4">企业荣誉</RouterLink>
                  <RouterLink class="sub-link" :to="{ name: 'about-contact' }" data-i18n="sub_ab_5">联系我们</RouterLink>
                </div>
              </div>
            </div>
    
            <div class="nav-cell nav-item relative">
              <RouterLink
                :to="{ name: 'business' }"
                class="hs-text-nav nav-link-main flex w-full cursor-pointer items-center justify-center gap-1 rounded-xl px-2 py-2 text-center text-zinc-600 dark:text-zinc-300"
                :class="['business', 'business-solutions', 'solution-detail'].includes(route.name) ? '!text-[var(--theme-primary)] font-semibold' : ''"
              >
                <span data-i18n="nav_biz">主营业务</span>
                <svg class="h-4 w-4 shrink-0 opacity-60 pointer-events-none"><use href="#i-chevron"/></svg>
              </RouterLink>
              <div class="nav-dd nav-dd--under absolute top-full z-[110] pt-0">
                <div class="glass-nav w-[260px] rounded-2xl p-2 shadow-2xl dark:shadow-black/40">
                  <RouterLink class="sub-link" :to="{ name: 'business-solutions', query: { tab: '0' } }" data-i18n="biz_1">业务处理方案</RouterLink>
                  <RouterLink class="sub-link" :to="{ name: 'business-solutions', query: { tab: '1' } }" data-i18n="biz_2">渠道服务方案</RouterLink>
                  <RouterLink class="sub-link" :to="{ name: 'business-solutions', query: { tab: '2' } }" data-i18n="biz_3">工具方案</RouterLink>
                  <RouterLink class="sub-link" :to="{ name: 'business-solutions', query: { tab: '3' } }" data-i18n="biz_4">技术平台方案</RouterLink>
                  <RouterLink class="sub-link" :to="{ name: 'business-solutions', query: { tab: '4' } }" data-i18n="biz_5">信息管理及商业智能方案</RouterLink>
                </div>
              </div>
            </div>
    
            <div class="nav-cell nav-item relative">
              <RouterLink
                :to="{ name: 'partners' }"
                class="hs-text-nav nav-link-main flex w-full cursor-pointer items-center justify-center gap-1 rounded-xl px-2 py-2 text-center text-zinc-600 dark:text-zinc-300"
                :class="route.name === 'partners' ? '!text-[var(--theme-primary)] font-semibold' : ''"
              >
                <span data-i18n="nav_partners">合作伙伴</span>
                <svg class="h-4 w-4 shrink-0 opacity-60 pointer-events-none"><use href="#i-chevron"/></svg>
              </RouterLink>
              <div class="nav-dd nav-dd--under absolute top-full z-[110] pt-0">
                <div class="glass-nav w-[200px] rounded-2xl p-2 shadow-2xl dark:shadow-black/40">
                  <RouterLink class="sub-link" :to="{ name: 'partners', hash: '#partners-clients' }" data-i18n="sub_p_1">我们的客户</RouterLink>
                  <RouterLink class="sub-link" :to="{ name: 'partners', hash: '#partners-cases' }" data-i18n="sub_p_2">典型案例</RouterLink>
                </div>
              </div>
            </div>
    
            <div class="nav-cell nav-item relative">
              <RouterLink
                :to="{ name: 'support' }"
                class="hs-text-nav nav-link-main flex w-full cursor-pointer items-center justify-center gap-1 rounded-xl px-2 py-2 text-center text-zinc-600 dark:text-zinc-300"
                :class="
                  route.name === 'support' || (route.name === 'service-detail' && route.query.from === 'support')
                    ? '!text-[var(--theme-primary)] font-semibold'
                    : ''
                "
              >
                <span data-i18n="nav_support">服务支持</span>
                <svg class="h-4 w-4 shrink-0 opacity-60 pointer-events-none"><use href="#i-chevron"/></svg>
              </RouterLink>
              <div class="nav-dd nav-dd--under absolute top-full z-[110] pt-0">
                <div class="glass-nav w-[200px] rounded-2xl p-2 shadow-2xl dark:shadow-black/40">
                  <RouterLink class="sub-link" :to="{ name: 'support', hash: '#support-consult' }" data-i18n="sub_s_1">咨询与服务</RouterLink>
                  <RouterLink class="sub-link" :to="{ name: 'support', hash: '#support-solutions' }" data-i18n="sub_s_2">解决方案</RouterLink>
                </div>
              </div>
            </div>
    
            <div class="nav-cell nav-item relative">
              <RouterLink
                :to="{ name: 'news' }"
                class="hs-text-nav nav-link-main flex w-full cursor-pointer items-center justify-center gap-1 rounded-xl px-2 py-2 text-center text-zinc-600 dark:text-zinc-300"
                :class="
                  route.name === 'news' || route.name === 'news-detail'
                    ? '!text-[var(--theme-primary)] font-semibold'
                    : ''
                "
              >
                <span data-i18n="nav_news">新闻动态</span>
                <svg class="h-4 w-4 shrink-0 opacity-60 pointer-events-none"><use href="#i-chevron"/></svg>
              </RouterLink>
              <div class="nav-dd nav-dd--under absolute top-full z-[110] pt-0">
                <div class="glass-nav w-[200px] rounded-2xl p-2 shadow-2xl dark:shadow-black/40">
                  <RouterLink
                    class="sub-link"
                    :to="{ name: 'news', query: { category: 'headline', from: 'nav' } }"
                    data-i18n="sub_n_1"
                  >高阳头条</RouterLink>
                  <RouterLink
                    class="sub-link"
                    :to="{ name: 'news', query: { category: 'staff', from: 'nav' } }"
                    data-i18n="sub_n_2"
                  >员工专区</RouterLink>
                  <RouterLink
                    class="sub-link"
                    :to="{ name: 'news', query: { category: 'notice', from: 'nav' } }"
                    data-i18n="sub_n_3"
                  >通知公告</RouterLink>
                </div>
              </div>
            </div>
    
            <div class="nav-cell nav-item relative">
              <RouterLink
                :to="{ name: 'join' }"
                class="hs-text-nav nav-link-main flex w-full cursor-pointer items-center justify-center gap-1 rounded-xl px-2 py-2 text-center text-zinc-600 dark:text-zinc-300"
                :class="route.name === 'join' ? '!text-[var(--theme-primary)] font-semibold' : ''"
              >
                <span data-i18n="nav_join">加入高阳</span>
                <svg class="h-4 w-4 shrink-0 opacity-60 pointer-events-none"><use href="#i-chevron"/></svg>
              </RouterLink>
              <div class="nav-dd nav-dd--under absolute top-full z-[110] pt-0">
                <div class="glass-nav w-[200px] rounded-2xl p-2 shadow-2xl dark:shadow-black/40">
                  <RouterLink class="sub-link" :to="{ name: 'join', hash: '#join-jobs' }" data-i18n="sub_j_1">人才招聘</RouterLink>
                </div>
              </div>
            </div>
          </nav>
    
          <div class="ml-auto flex items-center gap-2 sm:gap-3">
            <div class="lang-switch-glass flex items-center gap-0.5 p-1">
              <button type="button" class="lang-btn px-2.5 py-1.5" :class="lang === 'zh' ? 'lang-on' : 'lang-off'" data-lang="zh" @click="setLang('zh')">中</button>
              <span class="lang-sep px-0.5" aria-hidden="true">|</span>
              <button type="button" class="lang-btn px-2.5 py-1.5" :class="lang === 'zh-hant' ? 'lang-on' : 'lang-off'" data-lang="zh-hant" @click="setLang('zh-hant')">繁</button>
              <span class="lang-sep px-0.5" aria-hidden="true">|</span>
              <button type="button" class="lang-btn px-2.5 py-1.5" :class="lang === 'en' ? 'lang-on' : 'lang-off'" data-lang="en" @click="setLang('en')">EN</button>
            </div>
            <button id="themeToggle" type="button" class="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 transition hover:border-[#3d59ff]/45 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200" aria-label="theme" @click="toggleTheme">
              <svg class="h-5 w-5 dark:hidden"><use href="#i-moon"/></svg>
              <svg class="hidden h-5 w-5 dark:block"><use href="#i-sun"/></svg>
            </button>
            <button id="menuOpen" type="button" class="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 xl:hidden dark:border-zinc-700" aria-label="menu" @click="mobileNavOpen = !mobileNavOpen">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
          </div>
        </div>
    
        <!-- Mobile accordion nav -->
        <div id="mobileNav" :class="['border-t border-zinc-200 bg-white/95 px-4 py-4 dark:border-zinc-800 dark:bg-[#12151f]/98 xl:hidden', mobileNavOpen ? '' : 'hidden']">
          <div class="space-y-1">
            <RouterLink
              to="/"
              class="hs-text-nav block rounded-xl px-3 py-3 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
              :class="route.name === 'home' ? '!text-[var(--theme-primary)] font-semibold' : ''"
              data-i18n="nav_hs_home"
              @click="closeMobileNav"
            >高阳首页</RouterLink>
            <div class="mobile-acc rounded-xl border border-zinc-100 dark:border-zinc-800">
              <div class="flex items-stretch border-b border-zinc-100 dark:border-zinc-800">
                <RouterLink
                  to="/about"
                  class="hs-text-nav flex min-w-0 flex-1 items-center px-3 py-3 text-left text-zinc-700 dark:text-zinc-200"
                  @click="closeMobileNav"
                >
                  <span data-i18n="nav_about">走进高阳</span>
                </RouterLink>
                <button
                  type="button"
                  class="mob-acc-btn flex w-11 shrink-0 items-center justify-center border-l border-zinc-100 dark:border-zinc-800"
                  aria-label="子菜单"
                  @click="toggleMobAcc($event)"
                >
                  <svg class="h-4 w-4 transition-transform mob-chev"><use href="#i-chevron"/></svg>
                </button>
              </div>
              <div class="hidden border-t border-zinc-100 px-2 py-2 dark:border-zinc-800 mob-panel">
                <RouterLink class="sub-link !py-2" :to="{ name: 'about', hash: '#about-group' }" data-i18n="sub_ab_1" @click="closeMobileNav">集团简介</RouterLink>
                <RouterLink class="sub-link !py-2" :to="{ name: 'about', hash: '#about-jinxin' }" data-i18n="sub_ab_2" @click="closeMobileNav">公司简介</RouterLink>
                <RouterLink class="sub-link !py-2" :to="{ name: 'about', hash: '#about-culture' }" data-i18n="sub_ab_3" @click="closeMobileNav">企业文化</RouterLink>
                <RouterLink class="sub-link !py-2" :to="{ name: 'about', hash: '#about-honors' }" data-i18n="sub_ab_4" @click="closeMobileNav">企业荣誉</RouterLink>
                <RouterLink
                  class="sub-link !py-2"
                  :to="{ name: 'about-contact' }"
                  data-i18n="sub_ab_5"
                  @click="closeMobileNav"
                >
                  联系我们
                </RouterLink>
              </div>
            </div>
            <div class="mobile-acc rounded-xl border border-zinc-100 dark:border-zinc-800">
              <div class="flex items-stretch border-b border-zinc-100 dark:border-zinc-800">
                <RouterLink
                  :to="{ name: 'business' }"
                  class="hs-text-nav flex min-w-0 flex-1 items-center px-3 py-3 text-left text-zinc-700 dark:text-zinc-200"
                  :class="['business', 'business-solutions', 'solution-detail'].includes(route.name) ? '!text-[var(--theme-primary)] font-semibold' : ''"
                  data-i18n="nav_biz"
                  @click="closeMobileNav"
                />
                <button
                  type="button"
                  class="mob-acc-btn flex w-11 shrink-0 items-center justify-center border-l border-zinc-100 dark:border-zinc-800"
                  aria-label="子菜单"
                  @click="toggleMobAcc($event)"
                >
                  <svg class="h-4 w-4 transition-transform mob-chev"><use href="#i-chevron"/></svg>
                </button>
              </div>
              <div class="hidden border-t border-zinc-100 px-2 py-2 dark:border-zinc-800 mob-panel">
                <RouterLink class="sub-link !py-2" :to="{ name: 'business-solutions', query: { tab: '0' } }" data-i18n="biz_1" @click="closeMobileNav">业务处理方案</RouterLink>
                <RouterLink class="sub-link !py-2" :to="{ name: 'business-solutions', query: { tab: '1' } }" data-i18n="biz_2" @click="closeMobileNav">渠道服务方案</RouterLink>
                <RouterLink class="sub-link !py-2" :to="{ name: 'business-solutions', query: { tab: '2' } }" data-i18n="biz_3" @click="closeMobileNav">工具方案</RouterLink>
                <RouterLink class="sub-link !py-2" :to="{ name: 'business-solutions', query: { tab: '3' } }" data-i18n="biz_4" @click="closeMobileNav">技术平台方案</RouterLink>
                <RouterLink class="sub-link !py-2" :to="{ name: 'business-solutions', query: { tab: '4' } }" data-i18n="biz_5" @click="closeMobileNav">信息管理及商业智能方案</RouterLink>
              </div>
            </div>
            <div class="mobile-acc rounded-xl border border-zinc-100 dark:border-zinc-800">
              <div class="flex items-stretch border-b border-zinc-100 dark:border-zinc-800">
                <RouterLink
                  :to="{ name: 'partners' }"
                  class="hs-text-nav flex min-w-0 flex-1 items-center px-3 py-3 text-left text-zinc-700 dark:text-zinc-200"
                  :class="route.name === 'partners' ? '!text-[var(--theme-primary)] font-semibold' : ''"
                  data-i18n="nav_partners"
                  @click="closeMobileNav"
                >合作伙伴</RouterLink>
                <button
                  type="button"
                  class="mob-acc-btn flex w-11 shrink-0 items-center justify-center border-l border-zinc-100 dark:border-zinc-800"
                  aria-label="子菜单"
                  @click="toggleMobAcc($event)"
                >
                  <svg class="h-4 w-4 transition-transform mob-chev"><use href="#i-chevron"/></svg>
                </button>
              </div>
              <div class="hidden border-t border-zinc-100 px-2 py-2 dark:border-zinc-800 mob-panel">
                <RouterLink class="sub-link !py-2" :to="{ name: 'partners', hash: '#partners-clients' }" data-i18n="sub_p_1" @click="closeMobileNav">我们的客户</RouterLink>
                <RouterLink class="sub-link !py-2" :to="{ name: 'partners', hash: '#partners-cases' }" data-i18n="sub_p_2" @click="closeMobileNav">典型案例</RouterLink>
              </div>
            </div>
            <div class="mobile-acc rounded-xl border border-zinc-100 dark:border-zinc-800">
              <button type="button" class="hs-text-nav mob-acc-btn flex w-full items-center justify-between px-3 py-3 text-left" @click="toggleMobAcc($event)"><span data-i18n="nav_support">服务支持</span><svg class="h-4 w-4 mob-chev"><use href="#i-chevron"/></svg></button>
              <div class="hidden border-t border-zinc-100 px-2 py-2 dark:border-zinc-800 mob-panel">
                <RouterLink class="sub-link !py-2" :to="{ name: 'support', hash: '#support-consult' }" data-i18n="sub_s_1" @click="closeMobileNav">咨询与服务</RouterLink>
                <RouterLink class="sub-link !py-2" :to="{ name: 'support', hash: '#support-solutions' }" data-i18n="sub_s_2" @click="closeMobileNav">解决方案</RouterLink>
              </div>
            </div>
            <div class="mobile-acc rounded-xl border border-zinc-100 dark:border-zinc-800">
              <div class="flex items-stretch border-b border-zinc-100 dark:border-zinc-800">
                <RouterLink
                  :to="{ name: 'news' }"
                  class="hs-text-nav flex min-w-0 flex-1 items-center px-3 py-3 text-left text-zinc-700 dark:text-zinc-200"
                  :class="
                    route.name === 'news' || route.name === 'news-detail'
                      ? '!text-[var(--theme-primary)] font-semibold'
                      : ''
                  "
                  data-i18n="nav_news"
                  @click="closeMobileNav"
                >新闻动态</RouterLink>
                <button
                  type="button"
                  class="mob-acc-btn flex w-11 shrink-0 items-center justify-center border-l border-zinc-100 dark:border-zinc-800"
                  aria-label="子菜单"
                  @click="toggleMobAcc($event)"
                >
                  <svg class="h-4 w-4 transition-transform mob-chev"><use href="#i-chevron"/></svg>
                </button>
              </div>
              <div class="hidden border-t border-zinc-100 px-2 py-2 dark:border-zinc-800 mob-panel">
                <RouterLink
                  class="sub-link !py-2"
                  :to="{ name: 'news', query: { category: 'headline', from: 'nav' } }"
                  data-i18n="sub_n_1"
                  @click="closeMobileNav"
                >高阳头条</RouterLink>
                <RouterLink
                  class="sub-link !py-2"
                  :to="{ name: 'news', query: { category: 'staff', from: 'nav' } }"
                  data-i18n="sub_n_2"
                  @click="closeMobileNav"
                >员工专区</RouterLink>
                <RouterLink
                  class="sub-link !py-2"
                  :to="{ name: 'news', query: { category: 'notice', from: 'nav' } }"
                  data-i18n="sub_n_3"
                  @click="closeMobileNav"
                >通知公告</RouterLink>
              </div>
            </div>
            <div class="mobile-acc rounded-xl border border-zinc-100 dark:border-zinc-800">
              <div class="flex items-stretch border-b border-zinc-100 dark:border-zinc-800">
                <RouterLink
                  :to="{ name: 'join' }"
                  class="hs-text-nav flex min-w-0 flex-1 items-center px-3 py-3 text-left text-zinc-700 dark:text-zinc-200"
                  :class="route.name === 'join' ? '!text-[var(--theme-primary)] font-semibold' : ''"
                  data-i18n="nav_join"
                  @click="closeMobileNav"
                >加入高阳</RouterLink>
                <button
                  type="button"
                  class="mob-acc-btn flex w-11 shrink-0 items-center justify-center border-l border-zinc-100 dark:border-zinc-800"
                  aria-label="子菜单"
                  @click="toggleMobAcc($event)"
                >
                  <svg class="h-4 w-4 transition-transform mob-chev"><use href="#i-chevron"/></svg>
                </button>
              </div>
              <div class="hidden border-t border-zinc-100 px-2 py-2 dark:border-zinc-800 mob-panel">
                <RouterLink class="sub-link !py-2" :to="{ name: 'join', hash: '#join-jobs' }" data-i18n="sub_j_1" @click="closeMobileNav">人才招聘</RouterLink>
              </div>
            </div>
          </div>
        </div>
      </header>
    
      <router-view />

      <footer id="footer" class="border-t border-zinc-800/80 bg-black/40 text-zinc-400">
        <div class="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
          <div class="reveal hs-text-footer flex flex-wrap items-baseline gap-x-3 gap-y-2 border-b border-white/10 pb-8">
            <span class="hs-text-footer-heading shrink-0 text-white" data-i18n="foot_links_title">友情链接</span>
            <span class="text-zinc-500">|</span>
            <span class="footer-friend-link cursor-pointer" data-i18n="fl_1">高阳科技</span>
            <span class="text-zinc-600">|</span>
            <span class="footer-friend-link cursor-pointer" data-i18n="fl_2">高阳通联</span>
            <span class="text-zinc-600">|</span>
            <span class="footer-friend-link cursor-pointer" data-i18n="fl_3">随行付</span>
            <span class="text-zinc-600">|</span>
            <span class="footer-friend-link cursor-pointer" data-i18n="fl_4">百富电力</span>
            <span class="text-zinc-600">|</span>
            <span class="footer-friend-link cursor-pointer" data-i18n="fl_5">兆讯微电子</span>
          </div>
    
          <div class="reveal mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
            <div>
              <div class="hs-text-footer-heading text-white" data-i18n="fc_about">走进高阳</div>
              <ul class="mt-4 space-y-2.5">
                <li><RouterLink class="hs-text-footer block" :to="{ name: 'about', hash: '#about-group' }" data-i18n="sub_ab_1">集团简介</RouterLink></li>
                <li><RouterLink class="hs-text-footer block" :to="{ name: 'about', hash: '#about-jinxin' }" data-i18n="sub_ab_2">公司简介</RouterLink></li>
                <li><RouterLink class="hs-text-footer block" :to="{ name: 'about', hash: '#about-culture' }" data-i18n="sub_ab_3">企业文化</RouterLink></li>
                <li><RouterLink class="hs-text-footer block" :to="{ name: 'about', hash: '#about-honors' }" data-i18n="sub_ab_4">企业荣誉</RouterLink></li>
                <li><RouterLink class="hs-text-footer block hover:text-white" :to="{ name: 'about-contact' }" data-i18n="sub_ab_5">联系我们</RouterLink></li>
              </ul>
            </div>
            <div>
              <div class="hs-text-footer-heading text-white" data-i18n="fc_biz">主营业务</div>
              <ul class="mt-4 space-y-2.5">
                <li><RouterLink class="hs-text-footer block hover:text-white" :to="{ name: 'business-solutions', query: { tab: '0' } }" data-i18n="biz_1">业务处理方案</RouterLink></li>
                <li><RouterLink class="hs-text-footer block hover:text-white" :to="{ name: 'business-solutions', query: { tab: '1' } }" data-i18n="biz_2">渠道服务方案</RouterLink></li>
                <li><RouterLink class="hs-text-footer block hover:text-white" :to="{ name: 'business-solutions', query: { tab: '2' } }" data-i18n="biz_3">工具方案</RouterLink></li>
                <li><RouterLink class="hs-text-footer block hover:text-white" :to="{ name: 'business-solutions', query: { tab: '3' } }" data-i18n="biz_4">技术平台方案</RouterLink></li>
                <li><RouterLink class="hs-text-footer block hover:text-white" :to="{ name: 'business-solutions', query: { tab: '4' } }" data-i18n="biz_5">信息管理及商业智能方案</RouterLink></li>
              </ul>
            </div>
            <div>
              <div class="hs-text-footer-heading text-white" data-i18n="fc_partners">合作伙伴</div>
              <ul class="mt-4 space-y-2.5">
                <li>
                  <RouterLink class="hs-text-footer block hover:text-white" :to="{ name: 'partners', hash: '#partners-clients' }" data-i18n="sub_p_1">我们的客户</RouterLink>
                </li>
                <li>
                  <RouterLink class="hs-text-footer block hover:text-white" :to="{ name: 'partners', hash: '#partners-cases' }" data-i18n="sub_p_2">典型案例</RouterLink>
                </li>
              </ul>
            </div>
            <div>
              <div class="hs-text-footer-heading text-white" data-i18n="fc_support">服务支持</div>
              <ul class="mt-4 space-y-2.5">
                <li><RouterLink class="hs-text-footer" :to="{ name: 'support', hash: '#support-consult' }" data-i18n="sub_s_1">咨询与服务</RouterLink></li>
                <li><RouterLink class="hs-text-footer" :to="{ name: 'support', hash: '#support-solutions' }" data-i18n="sub_s_2">解决方案</RouterLink></li>
              </ul>
            </div>
            <div>
              <div class="hs-text-footer-heading text-white" data-i18n="fc_join">加入高阳</div>
              <ul class="mt-4 space-y-2.5">
                <li><RouterLink class="hs-text-footer" :to="{ name: 'join', hash: '#join-jobs' }" data-i18n="sub_j_1">人才招聘</RouterLink></li>
              </ul>
            </div>
            <div>
              <div class="hs-text-footer-heading text-white" data-i18n="fc_news">新闻动态</div>
              <ul class="mt-4 space-y-2.5">
                <li><span class="hs-text-footer cursor-default" data-i18n="sub_n_1">高阳头条</span></li>
                <li><span class="hs-text-footer cursor-default" data-i18n="sub_n_2">员工专区</span></li>
                <li><span class="hs-text-footer cursor-default" data-i18n="sub_n_3">通知公告</span></li>
              </ul>
            </div>
          </div>
    
          <div class="reveal mt-12 flex flex-col gap-10 border-t border-white/10 pt-10 lg:flex-row lg:items-center lg:justify-between">
            <div class="max-w-md">
              <div class="flex items-center gap-3">
                <img :src="'/img/logo_white.png'" alt="Hi Sun" width="200" height="48" class="h-10 w-auto max-w-[220px] object-contain sm:h-11" />
              </div>
              <p class="hs-text-footer mt-4 text-zinc-500" data-i18n="foot_company">北京高阳金信信息技术有限公司</p>
              <p class="hs-text-footer mt-2 text-zinc-500">
                <span data-i18n="foot_rights">版权所有</span>
                <span class="mx-1">|</span>
                <span data-i18n="foot_icp">备案号：京ICP备19022484号-1</span>
                <span class="mx-1">|</span>
                <span class="cursor-pointer text-zinc-400 hover:text-white" data-i18n="foot_sitemap">网站地图</span>
              </p>
            </div>
            <div class="flex flex-wrap items-center gap-0">
              <a href="mailto:bjhr@hisuntech.com" class="hs-text-button btn-primary inline-flex items-center justify-center rounded-l-2xl rounded-r-none px-6 py-3.5 text-white" data-i18n="foot_email_btn">邮件咨询</a>
              <a href="mailto:bjhr@hisuntech.com" class="btn-secondary inline-flex h-[46px] w-[46px] items-center justify-center rounded-l-none rounded-r-2xl text-white sm:h-[46px] sm:w-[46px]" aria-label="email">
                <svg class="h-5 w-5"><use href="#i-mail"/></svg>
              </a>
            </div>
            <div class="flex flex-wrap items-center gap-8">
              <div>
                <div class="hs-text-footer text-zinc-500" data-i18n="foot_hotline_label">客户服务热线</div>
                <div class="mt-1 text-2xl font-bold text-white">010-68452288</div>
              </div>
              <div class="qr-placeholder h-28 w-28 shrink-0 rounded-lg border border-white/10 bg-white" title="QR"></div>
            </div>
          </div>
        </div>
      </footer>
    
      <!-- 闂傚倷绀侀幉锟犳偡閵夆晛鍌ㄩ柡宥庡幖閻ら箖鏌涢锝嗙缂佺姵鐗楅妵鍕箳瀹ュ棛銈伴梺璋庡倻绐旈柡灞诲妼閳藉鈻庢惔婵嗩劉濠电偛顕慨鎾偋韫囨稑绀岄柡宥冨妼椤曡鲸绻涢崱妯虹仼妞わ腹鏅滅换娑氣偓娑欘焽閻﹪鏌ｉ鍌氬付閼挎劖銇勯弴妤€浜鹃梺璇″灠缁夌數绮悢鍝ョ瘈闁告洦鍙庡Σ鎾煟?闂傚倷绀侀崥瀣磿閹惰棄搴婇柤鑹扮堪娴滃綊鏌涢妷顔煎婵☆偅锕㈤幃宄扳枎韫囨搩浼岄梺琛″亾闁规儼濮ら悡銉︾箾閹寸儐鐒藉褎鐩幃妤€顫濋埀顒勫炊瑜忛悡鎴︽⒑閸涘﹤鐏熼柛濠冾殘缁牓宕卞▎鎰／?闂傚倷鐒﹂幃鍫曞磿閹惰棄纾婚柕鍫濐槸杩?-->
      <div id="fabDock" class="fab-dock fixed right-2 top-1/2 z-[90] flex w-[58px] -translate-y-1/2 flex-col gap-2 sm:right-4" role="navigation" aria-label="快捷操作区" @click.stop>
        <div class="relative">
          <div id="fabQrPanel" class="absolute right-[calc(100%+10px)] top-1/2 z-[91] w-[200px] max-w-[calc(100vw-5rem)] rounded-2xl p-4 shadow-2xl ring-1 ring-white/25 dark:ring-white/10" :class="{ 'fab-qr-open': fabQrOpen }">
            <img id="fabQrImg" :src="fabQrSrc" alt="" width="160" height="160" class="mx-auto h-36 w-36 rounded-lg object-cover sm:h-40 sm:w-40" loading="lazy" decoding="async" data-qr-placeholder="1" />
            <p class="hs-text-footer mt-3 text-center text-zinc-500 dark:text-zinc-400" data-i18n="fab_qr_hint">微信扫码 · 联系我们</p>
          </div>
          <button type="button" id="fabSolution" class="fab-btn-square group flex flex-col items-center justify-center gap-0.5 rounded-2xl bg-[#3d59ff] px-1 text-center text-white shadow-lg transition hover:brightness-105 hover:shadow-xl" :aria-expanded="fabQrOpen ? 'true' : 'false'" aria-controls="fabQrPanel" title="获取方案" @mouseenter="setFabQr(true)" @mouseleave="setFabQr(false)" @click.stop="toggleFabQr">
            <svg class="icon-tone h-5 w-5 shrink-0" aria-hidden="true"><use href="#i-doc"/></svg>
            <span class="hs-text-fab max-w-[52px]" data-i18n="fab_solution">获取方案</span>
          </button>
        </div>
        <RouterLink
          id="fabContact"
          :to="{ name: 'about-contact', hash: '#contact-message' }"
          class="fab-btn-square group flex flex-col items-center justify-center gap-0.5 rounded-2xl bg-[#35227b] text-white shadow-lg transition hover:brightness-105 hover:shadow-xl"
          title="联系我们 · 在线留言"
        >
          <svg class="icon-tone h-5 w-5 shrink-0 transition group-hover:scale-105"><use href="#i-message"/></svg>
          <span class="hs-text-fab max-w-[52px] text-center" data-i18n="fab_contact">联系</span>
        </RouterLink>
      </div>
      <button type="button" id="fabToTop" class="hs-text-fab fab-btn-square fixed right-2 bottom-[50px] z-[90] flex flex-col items-center justify-center gap-0.5 rounded-2xl border border-zinc-600/80 bg-black/40 uppercase tracking-wide text-white shadow-lg transition hover:bg-zinc-800 sm:right-4" aria-label="回到顶部" @click="scrollToTop">
        <svg class="icon-tone h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 15l-6-6-6 6"/></svg>
        <span>TOP</span>
      </button>
  </div>
</template>

<script setup>
import { provide } from "vue";
import { useSiteShell } from "../composables/useSiteShell.js";
import "../assets/hisun.css";

const {
  route,
  lang,
  mobileNavOpen,
  fabQrOpen,
  fabQrSrc,
  toggleTheme,
  setLang,
  toggleFabQr,
  setFabQr,
  scrollToTop,
  toggleMobAcc,
  closeMobileNav,
} = useSiteShell();

provide("hisunLang", lang);
</script>










