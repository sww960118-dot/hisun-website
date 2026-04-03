<template>
<main id="top" class="relative z-[1]">
        <!-- Banner：loadBanners() 优先接口，其次 /data/banners.json，最后内置默认 -->
        <section
          id="banner"
          ref="bannerEl"
          class="relative w-full overflow-hidden border-b border-white/10 bg-slate-900"
          style="min-height: min(560px, 88vh);"
          @mouseenter="onBannerGlowEnter"
          @mouseleave="onBannerGlowLeave"
          @mousemove="onBannerGlowMove"
        >
          <div id="bannerSlides" class="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
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
          <svg
            width="0"
            height="0"
            style="position:absolute"
            aria-hidden="true"
          >
            <defs>
              <filter
                id="bannerLiquid"
                x="-45%"
                y="-45%"
                width="190%"
                height="190%"
                color-interpolation-filters="sRGB"
              >
                <!-- 各向异性噪声 + 多倍频 → 边缘呈不规则流体团块（非大光晕） -->
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
            class="relative z-10 mx-auto flex min-h-[min(560px,88vh)] max-w-[1200px] items-center px-4 py-14 pb-[calc(80px+2.5rem)] sm:px-6"
          >
            <div class="w-full max-w-2xl text-left">
              <p
                v-if="currentBanner.kicker"
                id="bannerKicker"
                class="hs-text-kicker reveal inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-white/95 backdrop-blur-sm"
              >
                {{ currentBanner.kicker }}
              </p>
              <h1
                id="bannerTitle"
                class="reveal text-3xl font-extrabold leading-[1.15] tracking-tight text-white delay-75 sm:text-4xl lg:text-5xl"
                :class="currentBanner.kicker ? 'mt-5' : 'mt-0'"
              >
                <span class="block" data-i18n="banner_hero_line1">新启航</span>
                <span class="mt-1 block sm:mt-2" data-i18n="banner_hero_line2">智慧升级、共赢未来</span>
              </h1>
              <div class="hs-heading-rule hs-heading-rule--inverse reveal mt-4 delay-75" aria-hidden="true"></div>
              <p id="bannerDesc" class="hs-text-banner-desc reveal mt-5 text-slate-200 delay-100" data-i18n="banner_hero_desc"></p>
              <div class="reveal mt-8 flex flex-wrap gap-4 delay-150">
                <RouterLink
                  id="bannerCta1"
                  :to="{ name: 'business-solutions' }"
                  class="hs-text-button banner-cta-liquid banner-cta-liquid--primary inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-white"
                >
                  <span class="banner-cta-text">{{ currentBanner.cta1 }}</span>
                </RouterLink>
                <a id="bannerCta2" href="/about#about-jinxin" class="hs-text-button banner-cta-liquid banner-cta-liquid--outline inline-flex items-center justify-center rounded-2xl px-8 py-4 text-white">
                  <span class="banner-cta-text">{{ currentBanner.cta2 }}</span>
                </a>
              </div>
            </div>
          </div>
    
          <button type="button" id="bannerPrev" class="absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/20 bg-black/30 text-xl text-white backdrop-blur transition hover:bg-black/50 sm:left-4" aria-label="上一张" @click="onBannerPrev">‹</button>
          <button type="button" id="bannerNext" class="absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/20 bg-black/30 text-xl text-white backdrop-blur transition hover:bg-black/50 sm:right-4" aria-label="下一张" @click="onBannerNext">›</button>
          <BannerNoticeBar />

          <div id="bannerDots" class="absolute bottom-[calc(80px+1.5rem)] left-0 right-0 z-20 flex justify-center gap-2 px-4">
            <button
              v-for="(s, idx) in bannerSlides"
              :key="'dot-' + idx"
              type="button"
              class="banner-dot h-1.5 w-6 rounded-full transition"
              :class="idx === bannerIndex ? 'bg-white' : 'bg-white/30'"
              :aria-label="'Slide ' + (idx + 1)"
              @click="onBannerDot(idx)"
            />
          </div>
        </section>
    
        <!-- 婵犵數鍋為崹鍫曞箰鐠囧弬锝夊箳濡も偓缁犳岸鏌嶈閸撴瑩鍩ユ径鎰缁炬儳顑呴ˉ婵囩節?-->
        <section id="main-business" class="relative mx-auto max-w-[1200px] px-4 py-20 sm:px-6">
          <div class="reveal text-left">
            <h2 class="hs-text-page-h2 text-[#0f172a] dark:text-white" data-i18n="sec_business">主营业务</h2>
            <div class="hs-heading-rule mt-4" aria-hidden="true"></div>
            <p class="hs-text-lead mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400" data-i18n="sec_business_sub">深耕金融行业发展超过 25 年</p>
          </div>
          <div class="mt-12 grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-5">
            <article class="reveal reveal--scale card-bolt flex flex-col overflow-hidden rounded-2xl">
              <div class="card-bolt-img-wrap h-32 shrink-0 overflow-hidden rounded-t-2xl sm:h-36">
                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=85" alt="" class="card-bolt-img h-full w-full object-cover" loading="lazy" width="600" height="320" />
              </div>
              <div class="card-bolt-body flex flex-1 flex-col items-start rounded-b-2xl border-t border-zinc-100/90 px-4 pb-4 pt-3 text-left dark:border-zinc-700/80">
                <h3 class="hs-text-card-title text-[#0f172a] dark:text-white" data-i18n="biz_1">业务处理方案</h3>
                <p class="hs-text-body mt-1.5 line-clamp-3 text-[#666666] dark:text-zinc-400" data-i18n="biz_1_desc">覆盖交易与核算全链路，稳定支撑核心账务与清算。</p>
                <RouterLink
                  :to="{ name: 'business-solutions', query: { tab: '0' } }"
                  class="hs-text-btn-ghost biz-card-btn mt-auto inline-flex w-fit justify-center rounded-lg border border-[#3d59ff]/35 px-4 py-2 text-[#1a1a1a] no-underline transition hover:bg-black/[0.04] dark:border-white/30 dark:text-white dark:hover:bg-white/10"
                >
                  <span data-i18n="btn_detail">查看详情</span>
                </RouterLink>
              </div>
            </article>
            <article class="reveal reveal--scale card-bolt flex flex-col overflow-hidden rounded-2xl delay-75">
              <div class="card-bolt-img-wrap h-32 shrink-0 overflow-hidden rounded-t-2xl sm:h-36">
                <img src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=85" alt="" class="card-bolt-img h-full w-full object-cover" loading="lazy" />
              </div>
              <div class="card-bolt-body flex flex-1 flex-col items-start rounded-b-2xl border-t border-zinc-100/90 px-4 pb-4 pt-3 text-left dark:border-zinc-700/80">
                <h3 class="hs-text-card-title text-[#0f172a] dark:text-white" data-i18n="biz_2">渠道服务方案</h3>
                <p class="hs-text-body mt-1.5 line-clamp-3 text-[#666666] dark:text-zinc-400" data-i18n="biz_2_desc">统一渠道接入与运营，提升触达效率与体验一致性。</p>
                <RouterLink
                  :to="{ name: 'business-solutions', query: { tab: '1' } }"
                  class="hs-text-btn-ghost biz-card-btn mt-auto inline-flex w-fit justify-center rounded-lg border border-[#3d59ff]/35 px-4 py-2 text-[#1a1a1a] no-underline transition hover:bg-black/[0.04] dark:border-white/30 dark:text-white dark:hover:bg-white/10"
                >
                  <span data-i18n="btn_detail">查看详情</span>
                </RouterLink>
              </div>
            </article>
            <article class="reveal reveal--scale card-bolt flex flex-col overflow-hidden rounded-2xl delay-100">
              <div class="card-bolt-img-wrap h-32 shrink-0 overflow-hidden rounded-t-2xl sm:h-36">
                <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=85" alt="" class="card-bolt-img h-full w-full object-cover" loading="lazy" />
              </div>
              <div class="card-bolt-body flex flex-1 flex-col items-start rounded-b-2xl border-t border-zinc-100/90 px-4 pb-4 pt-3 text-left dark:border-zinc-700/80">
                <h3 class="hs-text-card-title text-[#0f172a] dark:text-white" data-i18n="biz_3">工具方案</h3>
                <p class="hs-text-body mt-1.5 line-clamp-3 text-[#666666] dark:text-zinc-400" data-i18n="biz_3_desc">工程化工具链与自动化能力，缩短交付周期、降低运维成本。</p>
                <RouterLink
                  :to="{ name: 'business-solutions', query: { tab: '2' } }"
                  class="hs-text-btn-ghost biz-card-btn mt-auto inline-flex w-fit justify-center rounded-lg border border-[#3d59ff]/35 px-4 py-2 text-[#1a1a1a] no-underline transition hover:bg-black/[0.04] dark:border-white/30 dark:text-white dark:hover:bg-white/10"
                >
                  <span data-i18n="btn_detail">查看详情</span>
                </RouterLink>
              </div>
            </article>
            <article class="reveal reveal--scale card-bolt flex flex-col overflow-hidden rounded-2xl delay-150">
              <div class="card-bolt-img-wrap h-32 shrink-0 overflow-hidden rounded-t-2xl sm:h-36">
                <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=85" alt="" class="card-bolt-img h-full w-full object-cover" loading="lazy" />
              </div>
              <div class="card-bolt-body flex flex-1 flex-col items-start rounded-b-2xl border-t border-zinc-100/90 px-4 pb-4 pt-3 text-left dark:border-zinc-700/80">
                <h3 class="hs-text-card-title text-[#0f172a] dark:text-white" data-i18n="biz_4">技术平台方案</h3>
                <p class="hs-text-body mt-1.5 line-clamp-3 text-[#666666] dark:text-zinc-400" data-i18n="biz_4_desc">云原生与分布式架构底座，弹性扩展、满足峰值与连续性要求。</p>
                <RouterLink
                  :to="{ name: 'business-solutions', query: { tab: '3' } }"
                  class="hs-text-btn-ghost biz-card-btn mt-auto inline-flex w-fit justify-center rounded-lg border border-[#3d59ff]/35 px-4 py-2 text-[#1a1a1a] no-underline transition hover:bg-black/[0.04] dark:border-white/30 dark:text-white dark:hover:bg-white/10"
                >
                  <span data-i18n="btn_detail">查看详情</span>
                </RouterLink>
              </div>
            </article>
            <article class="reveal reveal--scale card-bolt flex flex-col overflow-hidden rounded-2xl delay-200">
              <div class="card-bolt-img-wrap h-32 shrink-0 overflow-hidden rounded-t-2xl sm:h-36">
                <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=600&q=85" alt="" class="card-bolt-img h-full w-full object-cover" loading="lazy" />
              </div>
              <div class="card-bolt-body flex flex-1 flex-col items-start rounded-b-2xl border-t border-zinc-100/90 px-4 pb-4 pt-3 text-left dark:border-zinc-700/80">
                <h3 class="hs-text-card-title text-[#0f172a] dark:text-white" data-i18n="biz_5">信息管理及商业智能方案</h3>
                <p class="hs-text-body mt-1.5 line-clamp-3 text-[#666666] dark:text-zinc-400" data-i18n="biz_5_desc">数据治理与指标体系，报表与决策分析一站式支撑经营洞察。</p>
                <RouterLink
                  :to="{ name: 'business-solutions', query: { tab: '4' } }"
                  class="hs-text-btn-ghost biz-card-btn mt-auto inline-flex w-fit justify-center rounded-lg border border-[#3d59ff]/35 px-4 py-2 text-[#1a1a1a] no-underline transition hover:bg-black/[0.04] dark:border-white/30 dark:text-white dark:hover:bg-white/10"
                >
                  <span data-i18n="btn_detail">查看详情</span>
                </RouterLink>
              </div>
            </article>
          </div>
        </section>
    
        <!-- 闂傚倷鑳堕…鍫澝瑰璺虹婵炲棗娴氶崵妤呮煕閹板吀绨藉☉鎾崇Ч閺屽秷顧侀柛鎾存皑缁骞掗弬鍝勪壕闁挎繂鎳庨。宕囩磼閹邦収娈滈柡灞剧洴楠炴瑩宕橀妸褌鐢婚梻浣虹帛閻楊厾寰婃ィ鍐╂櫖?18px medium闂傚倷绶氬褍螞閺冨牊鍊块柨鏇炲亞閺佸棙绻濇繝鍌滃婵?16px闂傚倷鐒︾€笛呯矙閹烘梻鐭欓柟杈剧畱妗呴梺鎼炲劗閺呮瑥鈻介鍫㈠彄闁搞儜鍕闯闂佽崵鍠愰幑鍥蓟閻旇櫣鐭欐繛鍡欏亾閳诲牓姊虹憴鍕憙婵炲懏娲熼獮鍡涘籍閸繂宓嗗┑顔筋焾娴滎剟骞夐崸妤佲拺闁告稑锕﹂幊鍐煕濡崵澧电€殿喗鐓″畷濂稿即閻愰潧鈧偤姊虹紒妯哄Е闁告搫绠撳銊╂焼瀹ュ懐顔愰柣搴㈢⊕钃辩紒鈧埀顒€顪冮妶鍡樺闁哥姵顨婇垾鏍炊椤掆偓缁犳盯鏌涢幘鑼跺厡妞わ腹鏅犲铏规兜閸涱厾鍘┑鐐插级閻楁缂撴禒瀣唨闁靛ě鈧弸鏍倵楠炲灝鍔氶柟鍐查铻炴俊顖濄€€濡插牓鏌熼幆褍鏆辨い鎺嬪灲閹粙顢涘☉娆忕３闂佽鍟崶褔鍞跺銈嗗笒閸婂藝?-->
        <section id="about" class="section-about-glass relative overflow-hidden border-y border-zinc-200/90 py-20 dark:border-zinc-800">
          <div class="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-[#3d59ff]/[0.07] blur-3xl dark:bg-[#3d59ff]/10" aria-hidden="true"></div>
          <div class="pointer-events-none absolute bottom-0 right-0 h-96 w-96 translate-x-1/4 rounded-full bg-[#3d59ff]/[0.05] blur-3xl" aria-hidden="true"></div>
          <div class="relative z-[1] mx-auto max-w-[1200px] px-4 sm:px-6">
            <div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-12">
              <div class="reveal reveal--from-left flex min-h-0 flex-col lg:h-full">
                <div class="shrink-0 text-center lg:text-left">
                  <h2 class="hs-text-page-h2 text-[#3d59ff] dark:text-[#7c8cff] lg:text-left" data-i18n="about_title_brand">高阳金信</h2>
                  <div class="hs-heading-rule mx-auto mt-4 lg:mx-0" aria-hidden="true"></div>
                  <p class="hs-text-lead mx-auto mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400 lg:mx-0 lg:text-left" data-i18n="sec_about_sub">国内金融解决方案领域竞争力和影响力前 10 位企业之一</p>
                </div>
                <p class="hs-text-body-justify mt-4 grow text-[#666666] dark:text-zinc-400" data-i18n="about_body">北京高阳金信信息技术有限公司成立于2000年，是香港上市公司高阳科技(中国）有限公司（是于百慕大注册成立之有限公司，股票代码：0818）旗下专注于金融领域解决方案、产品及服务的全资子公司。公司总部设于北京，同时公司在深圳、上海、广州、香港等地设有分公司和事业部。公司业务主要分布在中国大陆及港澳地区，高阳客户完整覆盖国有银行、股份制银行、城市商业银行，及外资银行，尤其在股份制银行及外资银行领域有着亮眼成绩。公司目前已成为一个具有各类专才和多种行业解决方案的大型IT企业。</p>
                <RouterLink
                  :to="{ name: 'about', hash: '#about-jinxin' }"
                  class="hs-more-cta hs-text-button mt-5 inline-flex items-center gap-2 rounded-2xl border border-[#1a1a1a] py-2.5 text-[#1a1a1a] no-underline transition dark:border-white dark:text-white lg:mt-auto"
                >
                  <span class="hs-more-cta__label" data-i18n="btn_detail">查看详情</span>
                  <svg class="hs-more-cta__arrow h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </RouterLink>
              </div>
              <div class="reveal reveal--from-right relative flex min-h-0 flex-col lg:h-full">
                <div class="glass-frame relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/30 dark:ring-white/10">
                  <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=85" alt="" class="h-full min-h-[min(340px,48vh)] w-full flex-1 object-cover lg:min-h-[min(380px,50vh)]" loading="lazy" />
                  <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(61,89,255,0.12),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_70%_20%,rgba(61,89,255,0.2),transparent_50%)]"></div>
                  <div class="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(61,89,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(61,89,255,0.15)_1px,transparent_1px)] [background-size:24px_24px] dark:opacity-25"></div>
                  <p class="hs-text-emphasis-sm absolute bottom-5 left-5 right-5 text-white drop-shadow-md" data-i18n="about_img_caption">值得信赖的金融科技伙伴</p>
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
    
        <!-- 闂傚倷绀侀幖顐﹀磹閻戣棄纭€闁告劕妯婂〒濠氭煕椤愮姴鍔滈柡鍜佸墴閺屾盯顢曢敐鍥╃暤濡ょ姷鍋戦崹浠嬪蓟閿濆憘鏃堝焵椤掆偓鐓ら柕鍫濐槹閸嬨倗鎲搁弬娆炬綎濠靛倻顭堢€氬鏌ｉ姀銏℃毄闁瑰弶瀵х换娑㈠箣閻愭潙闉嶅┑鈥冲级鐢繝鐛崱娑樼劦妞ゆ巻鍋撻柍钘夘樀楠炴澹曠€ｎ亶妫熷┑鐘愁問閸犳岸宕伴幇顔剧煓濠㈣埖鍔曢悞鍨亜閹烘垵顏柛銈咃躬瀵爼宕煎┑鍡忔寖缂備讲鍋?-->
        <section
          id="news"
          class="relative w-full overflow-hidden py-20"
        >
          <div class="news-bg-anim" aria-hidden="true"></div>
          <div class="mx-auto max-w-[1200px] px-4 sm:px-6">
            <div class="reveal flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div class="flex min-w-0 flex-col items-start">
                <h2 class="hs-text-page-h2 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.32)]" data-i18n="sec_news">新闻动态</h2>
                <div class="hs-heading-rule hs-heading-rule--inverse mt-4" aria-hidden="true"></div>
              </div>
              <a
                :href="newsListMoreHref"
                class="hs-more-cta hs-more-cta--on-dark hs-text-button inline-flex shrink-0 items-center gap-2 rounded-2xl border py-2.5 no-underline transition"
              >
                <span class="hs-more-cta__label" data-i18n="btn_more">查看更多</span>
                <svg class="hs-more-cta__arrow icon-tone h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
            <div class="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              <RouterLink
                v-for="(item, idx) in homeNewsItems"
                :key="item.id"
                :to="{ name: 'news-detail', query: { id: item.id, from: 'home_card' } }"
                class="group reveal reveal--from-bottom card-bolt flex flex-col overflow-hidden rounded-2xl no-underline text-inherit"
                :class="idx === 1 ? 'delay-75' : idx === 2 ? 'delay-100' : ''"
              >
                <div class="card-bolt-img-wrap h-44 shrink-0 overflow-hidden rounded-t-2xl">
                  <img :src="item.image" alt="" class="card-bolt-img h-full w-full object-cover" loading="lazy" />
                </div>
                <div class="card-bolt-body relative flex flex-1 flex-col justify-center items-start rounded-b-2xl border-t border-zinc-100/90 pl-4 pr-20 pb-4 pt-3 text-left dark:border-zinc-700/80">
                  <h3 class="hs-text-card-title text-[#0f172a] dark:text-white">{{ item.title }}</h3>
                  <p class="hs-text-body mt-1.5 line-clamp-4 text-[#666666] dark:text-zinc-400">{{ item.desc }}</p>
                  <time class="mt-2 text-[13px] text-zinc-400">{{ item.date }}</time>
                  <div class="news-arrow-liquid group-hover:!text-white absolute right-6 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border transition-transform duration-200" aria-hidden="true">
                    <svg class="icon-tone h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                </div>
              </RouterLink>
            </div>
          </div>
        </section>
    
        <!-- 闂傚倷绀侀幉锟犳嚌妤ｅ啯鍋嬮柛娑卞灣缁€濠囨煛閸愶絽浜鹃柣搴ｆ暩閸樠囧煝鎼淬垺鍎熼柍銉ョ－閵?-->
        <section
          id="partners"
          class="border-t border-zinc-200 bg-gradient-to-b from-white to-zinc-50 py-16 dark:border-zinc-800 dark:from-[#0f1219] dark:to-[#0b0d12] sm:py-20"
        >
          <div class="mx-auto max-w-[1200px] px-4 sm:px-6">
            <div class="reveal flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div class="max-w-3xl text-left">
                <h2 class="hs-text-page-h2 text-[#0f172a] dark:text-white" data-i18n="sec_partners">合作伙伴</h2>
                <div class="hs-heading-rule mt-4" aria-hidden="true"></div>
                <p class="hs-text-lead mt-3 text-zinc-600 dark:text-zinc-400" data-i18n="sec_partners_sub">
                  25年来，高阳持续为金融IT领域高端客户服务
                </p>
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
              v-if="partnerLogos.length"
              class="reveal mt-10 grid w-full grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6 md:gap-x-[20.4px] md:gap-y-4"
            >
              <PartnerLogoHoverCard
                v-for="(item, idx) in partnerLogos"
                :key="item.src + '-' + idx"
                :src="item.src"
                :name="item.name"
              />
            </div>
          </div>
        </section>
      </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import { DEFAULT_BANNERS, normalizeBanner, loadBanners } from "../cms/banners.js";
import BannerNoticeBar from "../components/BannerNoticeBar.vue";
import PartnerLogoHoverCard from "../components/PartnerLogoHoverCard.vue";
import { cmsTick } from "../cms/cmsTick.js";
import { getNewsItems } from "../cms/news.js";
import { PARTNER_LOGOS_HOME_PREVIEW } from "../cms/partnersPage.js";

/** 首页展示合作伙伴 Logo 预览（前 18 条）；全量在合作伙伴页 */
const partnerLogos = PARTNER_LOGOS_HOME_PREVIEW;

/** 整页打开新闻列表（完整文档加载），避免长首页上 SPA 跳转产生「从下往上滚」的观感 */
const newsListMoreHref = `${(import.meta.env.BASE_URL || "/").replace(/\/$/, "")}/news?from=home`;

const homeNewsItems = computed(() => {
  cmsTick.value;
  return getNewsItems()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
});

const BANNER_AUTO_MS = 3000;

const bannerSlides = ref(DEFAULT_BANNERS.map(normalizeBanner));
const bannerIndex = ref(0);
/** 1 = 下一张（从右入），-1 = 上一张（从左入），用于 PPT 式推入动效 */
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

  // 主光斑：较慢跟随指针 → 重力/拖尾感
  const lerpMain = 0.11;
  bannerGlowCurrX += dxT * lerpMain;
  bannerGlowCurrY += dyT * lerpMain;

  // 拖尾层：更慢地跟随主光斑 → 液态拖尾
  const lerpTrail = 0.055;
  bannerGlowTrailX += (bannerGlowCurrX - bannerGlowTrailX) * lerpTrail;
  bannerGlowTrailY += (bannerGlowCurrY - bannerGlowTrailY) * lerpTrail;

  const dx = bannerGlowCurrX - bannerGlowPrevX;
  const dy = bannerGlowCurrY - bannerGlowPrevY;
  const speed = Math.sqrt(dx * dx + dy * dy) / dt; // percent/ms
  const energy = Math.max(0, Math.min(100, speed * 11000));
  const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;

  // 随运动方向 + 速度微调色相，形成流动变色
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
});
</script>

