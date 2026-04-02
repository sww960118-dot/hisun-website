<template>
  <div class="font-brand min-h-screen bg-zinc-50 text-[#1a1a1a] dark:bg-[#0b0d12] dark:text-zinc-100">
    <div class="mx-auto max-w-[1200px] space-y-14 px-4 py-12 sm:px-6 lg:py-16">
      <!-- 页头 -->
      <header class="space-y-3 border-b border-zinc-200 pb-10 dark:border-zinc-800">
        <p class="text-xs font-semibold uppercase tracking-wider text-[#3d59ff] dark:text-[#7c8cff]">
          Design system
        </p>
        <h1 class="hs-text-page-h2 text-[#0f172a] dark:text-white">组件库与设计规范</h1>
        <p class="hs-text-lead max-w-3xl text-zinc-600 dark:text-zinc-400">
          以下规范与<strong>首页</strong>、<strong>走进高阳</strong>、<strong>主营业务</strong>、<strong>新闻列表</strong>等当前实现一致。排版与设计
          token 见
          <code class="rounded bg-zinc-200/80 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">tokens.css</code>（如
          <code class="rounded bg-zinc-200/80 px-1 dark:bg-zinc-800">--hs-cta-pad-x</code>），全局业务样式见
          <code class="rounded bg-zinc-200/80 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">hisun.css</code>。路由层滚动策略见
          <code class="rounded bg-zinc-200/80 px-1 dark:bg-zinc-800">router/index.js</code>。新页面请复用类名与变量，避免硬编码色值。
        </p>
        <nav class="flex flex-wrap gap-2 text-sm" aria-label="本页目录">
          <a class="rounded-lg bg-zinc-200/60 px-3 py-1.5 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200" href="#colors">颜色</a>
          <a class="rounded-lg bg-zinc-200/60 px-3 py-1.5 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200" href="#titles">标题</a>
          <a class="rounded-lg bg-zinc-200/60 px-3 py-1.5 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200" href="#type">字体</a>
          <a class="rounded-lg bg-zinc-200/60 px-3 py-1.5 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200" href="#buttons">按钮</a>
          <a class="rounded-lg bg-zinc-200/60 px-3 py-1.5 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200" href="#forms">表单</a>
          <a class="rounded-lg bg-zinc-200/60 px-3 py-1.5 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200" href="#routing">路由与滚动</a>
          <a class="rounded-lg bg-zinc-200/60 px-3 py-1.5 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200" href="#icons">图标</a>
          <a class="rounded-lg bg-zinc-200/60 px-3 py-1.5 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200" href="#news">新闻模块</a>
          <a class="rounded-lg bg-zinc-200/60 px-3 py-1.5 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200" href="#spacing">间距与版心</a>
          <a class="rounded-lg bg-zinc-200/60 px-3 py-1.5 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200" href="#blocks">区块组件</a>
        </nav>
      </header>

      <!-- 颜色 -->
      <section id="colors" class="scroll-mt-24 space-y-6">
        <h2 class="text-lg font-bold text-[#0f172a] dark:text-white">颜色规范</h2>
        <p class="hs-text-body max-w-3xl text-zinc-600 dark:text-zinc-400">
          全站以品牌蓝为主色、深紫为辅助色；深色模式导航高亮等使用浅蓝 <code class="text-[#7c8cff]">#7c8cff</code>。
        </p>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div class="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
            <div class="h-20 bg-[#3d59ff]" />
            <div class="space-y-1 p-4 text-sm">
              <div class="font-mono text-xs text-zinc-500">--hs-primary / --theme-primary</div>
              <div class="font-semibold">#3d59ff</div>
              <div class="hs-type-caption text-zinc-500">主色 · 链接、按钮、装饰线</div>
            </div>
          </div>
          <div class="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
            <div class="h-20 bg-[#35227b]" />
            <div class="space-y-1 p-4 text-sm">
              <div class="font-mono text-xs text-zinc-500">--hs-secondary / --theme-secondary</div>
              <div class="font-semibold">#35227b</div>
              <div class="hs-type-caption text-zinc-500">辅助色 · FAB、渐变点缀</div>
            </div>
          </div>
          <div class="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
            <div class="h-20 bg-[#0f172a]" />
            <div class="space-y-1 p-4 text-sm">
              <div class="font-mono text-xs text-zinc-500">--ue-ink</div>
              <div class="font-semibold">#0f172a</div>
              <div class="hs-type-caption text-zinc-500">浅色区主标题字色</div>
            </div>
          </div>
          <div class="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
            <div class="h-20 bg-[#666666]" />
            <div class="space-y-1 p-4 text-sm">
              <div class="font-mono text-xs text-zinc-500">--hs-muted</div>
              <div class="font-semibold">#666666</div>
              <div class="hs-type-caption text-zinc-500">正文灰（浅色模式）</div>
            </div>
          </div>
          <div class="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
            <div class="flex h-20 items-center justify-center bg-[#1a1a1a] text-sm text-white">ink</div>
            <div class="space-y-1 p-4 text-sm">
              <div class="font-mono text-xs text-zinc-500">--hs-ink</div>
              <div class="font-semibold">#1a1a1a</div>
              <div class="hs-type-caption text-zinc-500">全局默认字色（Layout）</div>
            </div>
          </div>
          <div class="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
            <div class="flex h-20 items-center justify-center bg-[#7c8cff] text-sm text-[#0f172a]">Active</div>
            <div class="space-y-1 p-4 text-sm">
              <div class="font-mono text-xs text-zinc-500">深色导航高亮</div>
              <div class="font-semibold">#7c8cff</div>
              <div class="hs-type-caption text-zinc-500">dark 下与主色搭配</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 标题 -->
      <section id="titles" class="scroll-mt-24 space-y-6">
        <h2 class="text-lg font-bold text-[#0f172a] dark:text-white">标题层级</h2>
        <div class="overflow-x-auto rounded-2xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
          <table class="w-full min-w-[640px] text-left text-sm">
            <thead class="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/80">
              <tr>
                <th class="px-4 py-3 font-semibold">类名</th>
                <th class="px-4 py-3 font-semibold">用途</th>
                <th class="px-4 py-3 font-semibold">规格摘要</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800">
              <tr>
                <td class="px-4 py-3 font-mono text-xs text-[#3d59ff]">.hs-type-h1</td>
                <td class="px-4 py-3">Banner 主标题</td>
                <td class="px-4 py-3 text-zinc-600 dark:text-zinc-400">clamp 响应 · 字重 800</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-mono text-xs text-[#3d59ff]">.hs-text-page-h2</td>
                <td class="px-4 py-3">区块主标题（主营业务、新闻动态等）</td>
                <td class="px-4 py-3 text-zinc-600 dark:text-zinc-400">30px · 字重 800</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-mono text-xs text-[#3d59ff]">.hs-text-block-h2</td>
                <td class="px-4 py-3">内页二级标题（走进高阳等）</td>
                <td class="px-4 py-3 text-zinc-600 dark:text-zinc-400">sm+ 与 page-h2 对齐</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-mono text-xs text-[#3d59ff]">.hs-text-page-h3</td>
                <td class="px-4 py-3">分栏小标题</td>
                <td class="px-4 py-3 text-zinc-600 dark:text-zinc-400">1.25rem · 字重 700</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-mono text-xs text-[#3d59ff]">.hs-text-card-title</td>
                <td class="px-4 py-3">卡片标题</td>
                <td class="px-4 py-3 text-zinc-600 dark:text-zinc-400">15px · 字重 700</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-mono text-xs text-[#3d59ff]">.hs-text-kicker</td>
                <td class="px-4 py-3">角标 / 标签条</td>
                <td class="px-4 py-3 text-zinc-600 dark:text-zinc-400">12px · 宽字距</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="space-y-8 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <div>
            <p class="hs-text-kicker mb-2 inline-block rounded-full border border-zinc-200 px-3 py-1 dark:border-zinc-600">示例 Kicker</p>
            <h3 class="hs-type-h1 text-[#0f172a] dark:text-white">Banner 级标题 H1</h3>
          </div>
          <div>
            <h3 class="hs-text-page-h2 text-[#0f172a] dark:text-white">区块主标题 · hs-text-page-h2</h3>
            <div class="hs-heading-rule mt-4" />
            <p class="hs-text-lead mt-3 text-zinc-600 dark:text-zinc-400">导语使用 hs-text-lead，与正文同字号、字重 500。</p>
          </div>
          <div>
            <h4 class="hs-text-page-h3 text-[#3d59ff] dark:text-[#7c8cff]">分栏标题 · hs-text-page-h3</h4>
            <p class="hs-text-body mt-2 text-[#666666] dark:text-zinc-400">正文 hs-text-body：14px，行高约 1.71。</p>
          </div>
        </div>
      </section>

      <!-- 字体 -->
      <section id="type" class="scroll-mt-24 space-y-6">
        <h2 class="text-lg font-bold text-[#0f172a] dark:text-white">字体与语义类</h2>
        <p class="hs-text-body max-w-3xl text-zinc-600 dark:text-zinc-400">
          字体栈：<code class="rounded bg-zinc-200/80 px-1 dark:bg-zinc-800">Inter, PingFang SC, Microsoft YaHei, system-ui</code
          >（见 <code class="rounded bg-zinc-200/80 px-1 dark:bg-zinc-800">.font-brand</code>）。
        </p>
        <div class="grid gap-4 md:grid-cols-2">
          <div class="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
            <div class="text-xs font-semibold text-zinc-500">.hs-text-body</div>
            <p class="hs-text-body mt-2 text-zinc-700 dark:text-zinc-300">正文：业务说明、列表描述，全站默认 14px。</p>
          </div>
          <div class="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
            <div class="text-xs font-semibold text-zinc-500">.hs-text-lead</div>
            <p class="hs-text-lead mt-2 text-zinc-700 dark:text-zinc-300">副标题 / 导语，字重 500。</p>
          </div>
          <div class="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
            <div class="text-xs font-semibold text-zinc-500">.hs-text-nav</div>
            <p class="hs-text-nav mt-2 text-zinc-800 dark:text-zinc-200">顶栏导航、侧栏入口 · 字重 600</p>
          </div>
          <div class="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
            <div class="text-xs font-semibold text-zinc-500">.hs-text-button</div>
            <p class="hs-text-button mt-2 text-[#3d59ff]">主操作文案（配合按钮容器）</p>
          </div>
          <div class="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
            <div class="text-xs font-semibold text-zinc-500">.hs-text-btn-ghost</div>
            <p class="hs-text-btn-ghost mt-2 text-zinc-800 dark:text-zinc-200">业务卡线框按钮文案：11px 加粗；卡片内需配合 <code class="text-[11px]">inline-flex w-fit px-4</code>（左右 16px）随文字变宽</p>
          </div>
          <div class="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
            <div class="text-xs font-semibold text-zinc-500">.hs-text-banner-desc</div>
            <p class="hs-text-banner-desc mt-2 text-slate-200">Banner 描述（深色底）</p>
          </div>
        </div>
      </section>

      <!-- 按钮 -->
      <section id="buttons" class="scroll-mt-24 space-y-8">
        <h2 class="text-lg font-bold text-[#0f172a] dark:text-white">按钮规范</h2>

        <div class="space-y-3">
          <h3 class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">页脚 / 强操作（hisun.css）</h3>
          <div class="flex flex-wrap items-center gap-4">
            <a class="hs-text-button btn-primary inline-flex items-center justify-center rounded-2xl px-6 py-3.5 text-white" href="#">btn-primary</a>
            <a class="hs-text-button btn-secondary inline-flex items-center justify-center rounded-2xl px-6 py-3.5 text-white" href="#">btn-secondary</a>
          </div>
        </div>

        <div class="space-y-3">
          <h3 class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">首页 Banner CTA（依赖父级 <code class="text-[#3d59ff]">#banner</code>）</h3>
          <div id="banner" class="rounded-2xl border border-white/10 bg-slate-900 p-8">
            <p class="mb-4 text-xs text-white/50">样式选择器为 <code class="text-white/80">#banner .banner-cta-liquid</code>，正式环境放在首页 Banner 内。</p>
            <div class="flex flex-wrap gap-4">
              <a
                href="#"
                class="hs-text-button banner-cta-liquid banner-cta-liquid--primary inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-white"
                @click.prevent
              >
                <span>主按钮 · primary</span>
              </a>
              <a
                href="#"
                class="hs-text-button banner-cta-liquid banner-cta-liquid--outline inline-flex items-center justify-center rounded-2xl px-8 py-4 text-white"
                @click.prevent
              >
                <span>线框 · outline</span>
              </a>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <h3 class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">胶囊文案 CTA（<code class="text-[#3d59ff]">hisun.css · .hs-more-cta</code>）</h3>
          <p class="hs-text-body max-w-3xl text-zinc-600 dark:text-zinc-400">
            用于全站「查看更多 / 更多客户 / 查看详情」等与热点文章右上角一致的交互：圆角用 Tailwind
            <code class="rounded bg-zinc-200/80 px-1 dark:bg-zinc-800">rounded-2xl</code>，宽度
            <code class="rounded bg-zinc-200/80 px-1 dark:bg-zinc-800">fit-content</code>，左右内边距由 token
            <code class="rounded bg-zinc-200/80 px-1 dark:bg-zinc-800">--hs-cta-pad-x</code>（默认 16px）。结构须包含
            <code class="font-mono text-xs">.hs-more-cta__label</code> 与内联 SVG
            <code class="font-mono text-xs">.hs-more-cta__arrow</code>。深色通栏（如首页新闻条）叠加
            <code class="font-mono text-xs">.hs-more-cta--on-dark</code>。
          </p>
          <div class="flex flex-wrap items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
            <a
              href="#"
              class="hs-more-cta hs-text-button inline-flex shrink-0 items-center gap-2 rounded-2xl border border-[#3d59ff]/35 py-2.5 text-[#3d59ff] no-underline transition dark:border-white/25 dark:text-white"
              @click.prevent
            >
              <span class="hs-more-cta__label">查看更多</span>
              <svg class="hs-more-cta__arrow h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="#"
              class="hs-more-cta hs-text-button inline-flex shrink-0 items-center gap-2 rounded-2xl border border-[#1a1a1a] py-2.5 text-[#1a1a1a] no-underline transition dark:border-white dark:text-white"
              @click.prevent
            >
              <span class="hs-more-cta__label">查看详情</span>
              <svg class="hs-more-cta__arrow h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          <div class="rounded-2xl border border-white/10 bg-slate-900 p-6">
            <p class="mb-4 text-xs text-white/55">浅色底上的变体见上；此为 <code class="text-white/80">.hs-more-cta--on-dark</code>（白描边白字，hover 仍为主题蓝左→右铺色）。</p>
            <a
              href="#"
              class="hs-more-cta hs-more-cta--on-dark hs-text-button inline-flex shrink-0 items-center gap-2 rounded-2xl border py-2.5 text-inherit no-underline transition"
              @click.prevent
            >
              <span class="hs-more-cta__label">查看更多</span>
              <svg class="hs-more-cta__arrow h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          <div class="overflow-x-auto rounded-2xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
            <table class="w-full min-w-[560px] text-left text-sm">
              <thead class="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/80">
                <tr>
                  <th class="px-4 py-3 font-semibold">交互</th>
                  <th class="px-4 py-3 font-semibold">说明</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800">
                <tr>
                  <td class="px-4 py-3">铺色</td>
                  <td class="px-4 py-3 font-mono text-xs text-zinc-600 dark:text-zinc-400">::before · scaleX(0→1) · transform-origin: left · 时长 var(--hs-cta-fill-duration)</td>
                </tr>
                <tr>
                  <td class="px-4 py-3">箭头</td>
                  <td class="px-4 py-3 font-mono text-xs text-zinc-600 dark:text-zinc-400">@keyframes hsMoreCtaArrowBounce（hover/focus/active）</td>
                </tr>
                <tr>
                  <td class="px-4 py-3">无障碍</td>
                  <td class="px-4 py-3 text-zinc-600 dark:text-zinc-400">全站动效与列表入场动画应在页面级对 <code class="font-mono text-xs">prefers-reduced-motion: reduce</code> 降级（新闻列表 <code class="font-mono text-xs">.news-list-card-enter</code> 已示例）</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="space-y-3">
          <h3 class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">主营业务「了解更多」（<code class="text-[#3d59ff]">BusinessView · .biz-learn-more-btn</code>）</h3>
          <p class="hs-text-body text-zinc-600 dark:text-zinc-400">
            与胶囊 CTA 相同的左→右铺色与箭头弹跳（复用 <code class="font-mono text-xs">hsMoreCtaArrowBounce</code>）；圆角为
            <code class="rounded bg-zinc-200/80 px-1 dark:bg-zinc-800">rounded-lg</code>，水平内边距同 <code class="font-mono text-xs">--hs-cta-pad-x</code>，宽度 <code class="font-mono text-xs">w-fit</code>。
          </p>
        </div>

        <div class="space-y-3">
          <h3 class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">业务卡线框按钮（<code class="text-[#3d59ff]">article.card-bolt .biz-card-btn</code>）</h3>
          <p class="hs-text-body text-sm text-zinc-600 dark:text-zinc-400">首页主营业务五卡与规范一致：<strong>不占满宽</strong>，<code class="font-mono text-xs">inline-flex w-fit justify-center px-4 py-2</code>。</p>
          <article class="card-bolt max-w-sm overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-700">
            <div class="bg-zinc-100 p-4 text-xs text-zinc-500 dark:bg-zinc-800">卡片占位</div>
            <div class="card-bolt-body border-t border-zinc-100 p-4 dark:border-zinc-700">
              <button
                type="button"
                class="hs-text-btn-ghost biz-card-btn mt-auto inline-flex w-fit justify-center rounded-lg border border-[#3d59ff]/35 px-4 py-2 text-[#1a1a1a] transition hover:bg-black/[0.04] dark:border-white/30 dark:text-white dark:hover:bg-white/10"
                @click.prevent
              >
                查看详情
              </button>
            </div>
          </article>
        </div>

        <div class="space-y-3">
          <h3 class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">玻璃按钮组件（UiGlassButton）</h3>
          <div class="flex flex-wrap items-center gap-4">
            <UiGlassButton size="sm">SM</UiGlassButton>
            <UiGlassButton size="md">MD</UiGlassButton>
            <UiGlassButton tone="solid" size="md">Solid</UiGlassButton>
            <UiGlassButton :disabled="true">禁用</UiGlassButton>
          </div>
        </div>
      </section>

      <section id="forms" class="scroll-mt-24 space-y-6">
        <h2 class="text-lg font-bold text-[#0f172a] dark:text-white">表单控件规范（招聘筛选）</h2>
        <div class="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <p class="hs-text-body text-zinc-600 dark:text-zinc-400">
            组件：<code class="font-mono text-xs">UiSelect</code>、<code class="font-mono text-xs">UiSearchField</code>。用于招聘页筛选与搜索，支持深色模式和可维护状态。
          </p>
          <div class="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div class="space-y-3">
              <div class="text-xs font-semibold text-zinc-500">下拉状态：默认 / 展开 / 错误 / 禁用</div>
              <UiSelect placeholder="工作类型" :options="['社招', '校招']" />
              <UiSelect placeholder="学历" :options="['本科及以上学历', '大专及以上学历']" :error="true" error-text="请选择学历" />
              <UiSelect placeholder="工作地点" :options="[]" empty-text="暂无可选地点" />
            </div>
            <div class="space-y-3">
              <div class="text-xs font-semibold text-zinc-500">搜索状态：默认 / 高亮 / 错误 / 空结果</div>
              <UiSearchField placeholder="搜索岗位名称" />
              <UiSearchField placeholder="搜索岗位名称" :force-glow="true" />
              <UiSearchField placeholder="搜索岗位名称" :error="true" error-text="关键词仅支持中英文和数字" />
              <UiSearchField placeholder="搜索岗位名称" :show-empty-state="true" empty-text="暂无匹配岗位，请更换关键词或筛选条件" />
            </div>
          </div>
          <div class="mt-4 overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-700">
            <table class="w-full min-w-[720px] text-left text-sm">
              <thead class="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/80">
                <tr><th class="px-4 py-3 font-semibold">场景</th><th class="px-4 py-3 font-semibold">规则</th></tr>
              </thead>
              <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800">
                <tr><td class="px-4 py-3">悬停态</td><td class="px-4 py-3 text-zinc-600 dark:text-zinc-400">下拉项 hover：白底 + 主题蓝文字；搜索按钮 hover 图标变主题蓝。</td></tr>
                <tr><td class="px-4 py-3">输入态</td><td class="px-4 py-3 text-zinc-600 dark:text-zinc-400">触发聚焦时控件描边主题蓝 1px；搜索外壳蓝→辅助色渐变高亮。</td></tr>
                <tr><td class="px-4 py-3">输入错误态</td><td class="px-4 py-3 text-zinc-600 dark:text-zinc-400">边框及提示使用红色（<code class="font-mono text-xs">#ef4444</code>），保留可读性。</td></tr>
                <tr><td class="px-4 py-3">搜索结果为空</td><td class="px-4 py-3 text-zinc-600 dark:text-zinc-400">搜索框下展示“暂无匹配结果”提示，列表区域保留容器骨架。</td></tr>
                <tr><td class="px-4 py-3">极端态</td><td class="px-4 py-3 text-zinc-600 dark:text-zinc-400">空选项、超长文案、省略显示、禁用态、深色模式、移动端单列均已覆盖。</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="routing" class="scroll-mt-24 space-y-6">
        <h2 class="text-lg font-bold text-[#0f172a] dark:text-white">路由与滚动行为</h2>
        <p class="hs-text-body max-w-3xl text-zinc-600 dark:text-zinc-400">
          逻辑集中在 <code class="rounded bg-zinc-200/80 px-1 dark:bg-zinc-800">src/router/index.js</code>：<code class="font-mono text-xs">scrollBehavior</code> 与
          <code class="font-mono text-xs">afterEach</code> 配合，避免「只改 query」类导航把阅读位置打回页顶；带
          <code class="font-mono text-xs">hash</code> 的导航由 <code class="font-mono text-xs">scrollBehavior</code> 定位锚点，<code class="font-mono text-xs">afterEach</code> 不再强制
          <code class="font-mono text-xs">scrollTop = 0</code>。
        </p>
        <div class="overflow-x-auto rounded-2xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
          <table class="w-full min-w-[720px] text-left text-sm">
            <thead class="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/80">
              <tr>
                <th class="px-4 py-3 font-semibold">场景</th>
                <th class="px-4 py-3 font-semibold">约定</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800">
              <tr>
                <td class="px-4 py-3">主营业务 · 左侧五个方案 Tab</td>
                <td class="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  <code class="font-mono text-xs">router.replace({ name: 'business', query: { tab }, hash: '' })</code>；仅改
                  <code class="font-mono text-xs">tab</code> 且目标无 hash → <strong>保持当前滚动位置</strong>。
                </td>
              </tr>
              <tr>
                <td class="px-4 py-3">主营业务 · 顶栏/移动抽屉子菜单</td>
                <td class="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  <code class="font-mono text-xs">:to</code> 含 <code class="font-mono text-xs">hash: '#biz-solutions'</code>，与内容区
                  <code class="font-mono text-xs">id="biz-solutions"</code> 对齐 → 进入页后<strong>将模块滚入视口</strong>（区块带
                  <code class="font-mono text-xs">scroll-mt-28</code> 避让固定顶栏）。
                </td>
              </tr>
              <tr>
                <td class="px-4 py-3">新闻列表 · 分类 Tab</td>
                <td class="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  同一路由下仅改 <code class="font-mono text-xs">?category=</code> → <strong>不滚回首屏</strong>；切换分类后卡片带按行错开的入场动画（见
                  <code class="font-mono text-xs">NewsListView.vue</code>）。
                </td>
              </tr>
              <tr>
                <td class="px-4 py-3">走进高阳等 · <code class="font-mono text-xs">#about-*</code></td>
                <td class="px-4 py-3 text-zinc-600 dark:text-zinc-400">顶栏子链使用 <code class="font-mono text-xs">hash</code> 时走锚点滚动；无 hash 的跨页导航仍回顶。</td>
              </tr>
              <tr>
                <td class="px-4 py-3">合作伙伴 · <code class="font-mono text-xs">/partners</code></td>
                <td class="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  顶栏子链 <code class="font-mono text-xs">#partners-clients</code> / <code class="font-mono text-xs">#partners-cases</code>；同页仅改
                  <code class="font-mono text-xs">?sector=</code>（行业筛选）时<strong>保持滚动</strong>。页面见
                  <code class="font-mono text-xs">PartnersView.vue</code>，数据见 <code class="font-mono text-xs">cms/partnersPage.js</code>。
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="icons" class="scroll-mt-24 space-y-6">
        <h2 class="text-lg font-bold text-[#0f172a] dark:text-white">图标与通栏</h2>
        <div class="overflow-x-auto rounded-2xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
          <table class="w-full min-w-[700px] text-left text-sm">
            <thead class="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/80">
              <tr>
                <th class="px-4 py-3 font-semibold">场景</th>
                <th class="px-4 py-3 font-semibold">资源 / 类名</th>
                <th class="px-4 py-3 font-semibold">规格</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800">
              <tr>
                <td class="px-4 py-3">CTA 邮件咨询图标</td>
                <td class="px-4 py-3 font-mono text-xs">`/img/cta/material-symbols_mark-email-unread-outline-sharp.svg`</td>
                <td class="px-4 py-3 text-zinc-600 dark:text-zinc-400">16×16，mask 方式着色（hover 切主题色）</td>
              </tr>
              <tr>
                <td class="px-4 py-3">热点文章侧向箭头</td>
                <td class="px-4 py-3 font-mono text-xs">`.biz-hot-side-btn`</td>
                <td class="px-4 py-3 text-zinc-600 dark:text-zinc-400">24×46，半透明黑底白箭头；仅 lg+ 且条目 &gt; 4 时显示</td>
              </tr>
              <tr>
                <td class="px-4 py-3">咨询弹窗二维码占位</td>
                <td class="px-4 py-3 font-mono text-xs">`/img/consult/qr-placeholder.svg`</td>
                <td class="px-4 py-3 text-zinc-600 dark:text-zinc-400">160×160，后续可替换真实二维码</td>
              </tr>
              <tr>
                <td class="px-4 py-3">首页 / 走进高阳 Banner 底栏通知</td>
                <td class="px-4 py-3 font-mono text-xs">`BannerNoticeBar.vue`</td>
                <td class="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  轮播 <code class="font-mono text-xs">category === 'notice'</code> 新闻；图标+文案为
                  <code class="font-mono text-xs">RouterLink</code> → <code class="font-mono text-xs">news-detail</code>（首页
                  <code class="font-mono text-xs">from=home_card</code>，关于页 <code class="font-mono text-xs">from=news&amp;entry=nav</code>，并带
                  <code class="font-mono text-xs">nc=notice</code>）。
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="news" class="scroll-mt-24 space-y-6">
        <h2 class="text-lg font-bold text-[#0f172a] dark:text-white">新闻模块规范（新增）</h2>
        <div class="grid gap-4 md:grid-cols-2">
          <div class="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
            <h3 class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">列表与交互</h3>
            <ul class="mt-3 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
              <li>主营业务「热点文章」预览：仅一行最多 4 条；无轮播点、无自动轮播。</li>
              <li>桌面端（lg+）当该分类下新闻多于 4 条时，显示左右箭头，每次点击窗口平移 1 条（环形）。</li>
              <li>独立新闻列表页 `/news`：当前分类下全部新闻，四列网格多行展示。</li>
              <li>分类 tab：全部新闻/高阳头条/员工专区/通知公告；切换分类时<strong>不改变页面滚动位置</strong>（路由层保留滚动）。</li>
              <li>切换分类后：卡片按<strong>行</strong>错开自下方浮入（<code class="font-mono text-xs">.news-list-card-enter</code> + 行级 <code class="font-mono text-xs">animation-delay</code>）；首次进入列表不播入场，避免闪动。</li>
              <li>右上角「查看更多」与全站胶囊 CTA 一致：<code class="font-mono text-xs">.hs-more-cta</code> + <code class="font-mono text-xs">rounded-2xl</code>。</li>
              <li>底部「查看更多」跳转 `/news`（可带 `?category=`）。</li>
            </ul>
          </div>
          <div class="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
            <h3 class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">卡片视觉</h3>
            <ul class="mt-3 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
              <li>标题 hover 变主题色：`#3d59ff`。</li>
              <li>图片 hover 放大：`scale(1.15)`。</li>
              <li>图片底部阴影：`0 16px 22px -14px rgba(15,23,42,.55)`。</li>
              <li>摘要限制两行，超出省略。</li>
            </ul>
          </div>
        </div>
        <div class="overflow-x-auto rounded-2xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
          <table class="w-full min-w-[620px] text-left text-sm">
            <thead class="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/80">
              <tr>
                <th class="px-4 py-3 font-semibold">规范项</th>
                <th class="px-4 py-3 font-semibold">标准值</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800">
              <tr>
                <td class="px-4 py-3">新闻大图圆角</td>
                <td class="px-4 py-3 font-mono text-xs">16px（`rounded-2xl`）</td>
              </tr>
              <tr>
                <td class="px-4 py-3">新闻小图圆角</td>
                <td class="px-4 py-3 font-mono text-xs">8px（`rounded-lg`）</td>
              </tr>
              <tr>
                <td class="px-4 py-3">热点文章轮播点</td>
                <td class="px-4 py-3 font-mono text-xs">不使用（首页 Banner 仍用 `banner-dot h-1.5 w-6`）</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- 间距 -->
      <section id="spacing" class="scroll-mt-24 space-y-6">
        <h2 class="text-lg font-bold text-[#0f172a] dark:text-white">间距与版心</h2>
        <div class="overflow-x-auto rounded-2xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
          <table class="w-full min-w-[560px] text-left text-sm">
            <thead class="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/80">
              <tr>
                <th class="px-4 py-3 font-semibold">场景</th>
                <th class="px-4 py-3 font-semibold">类名 / 约定</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800">
              <tr>
                <td class="px-4 py-3">主内容区宽度</td>
                <td class="px-4 py-3 font-mono text-xs"><code>max-w-[1200px] mx-auto</code></td>
              </tr>
              <tr>
                <td class="px-4 py-3">水平内边距</td>
                <td class="px-4 py-3 font-mono text-xs"><code>px-4 sm:px-6</code></td>
              </tr>
              <tr>
                <td class="px-4 py-3">大区块上下留白</td>
                <td class="px-4 py-3 font-mono text-xs"><code>py-20</code>（首页 / 关于常用）</td>
              </tr>
              <tr>
                <td class="px-4 py-3">栅格间距</td>
                <td class="px-4 py-3 font-mono text-xs"><code>gap-8</code> / <code>gap-5 sm:gap-6</code>（业务卡）</td>
              </tr>
              <tr>
                <td class="px-4 py-3">卡片圆角</td>
                <td class="px-4 py-3 font-mono text-xs"><code>rounded-2xl</code>（1.5rem · --hs-card-radius-lg）</td>
              </tr>
              <tr>
                <td class="px-4 py-3">胶囊文案 CTA 水平内边距</td>
                <td class="px-4 py-3 font-mono text-xs"><code>--hs-cta-pad-x</code>（默认 16px，见 <code>tokens.css</code>；<code>hisun.css</code> / 主营业务「了解更多」引用）</td>
              </tr>
              <tr>
                <td class="px-4 py-3">区块标题与装饰线</td>
                <td class="px-4 py-3 font-mono text-xs"><code>hs-heading-rule mt-4</code>；Banner 下白线用 <code>hs-heading-rule--inverse</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- 既有展示区块 -->
      <section id="blocks" class="scroll-mt-24 space-y-6">
        <h2 class="text-lg font-bold text-[#0f172a] dark:text-white">区块组件示例</h2>
        <UiSectionTitle title="小节标题组件 UiSectionTitle" :show-more="false" />
        <p class="hs-text-body text-sm text-zinc-600 dark:text-zinc-400">
          带「查看更多」时启用默认展示，并可传 <code class="font-mono text-xs">more-href</code> 渲染为链接（与全站
          <code class="font-mono text-xs">.hs-more-cta</code> 样式一致）。
        </p>
        <UiSectionTitle title="标题 + 胶囊查看更多" more-text="查看更多" more-href="#blocks" />

        <div class="space-y-4">
          <h3 class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">箭头 / 图片比例卡</h3>
          <div class="flex flex-wrap items-center gap-4">
            <UiArrowCircle variant="light" />
            <div class="rounded-2xl bg-[#3d59ff] p-3">
              <UiArrowCircle variant="dark" />
            </div>
          </div>
          <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
            <UiImageSpecCard
              title="16:9"
              desc="新闻封面"
              ratio="16/9"
              src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=85"
            />
            <UiImageSpecCard
              title="4:3"
              desc="图文详情"
              ratio="4/3"
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=85"
            />
            <UiImageSpecCard title="1:1" desc="选中态" ratio="1/1" :selected="true" src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=85" />
          </div>
        </div>

        <div class="space-y-4">
          <h3 class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">新闻卡 / 数据 CTA</h3>
          <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
            <NewsCard image="https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=85" />
            <NewsCard image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=85" />
            <NewsCard image="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=85" />
          </div>
          <div class="glass-stat-bar overflow-hidden rounded-2xl">
            <StatsCtaCard />
          </div>
        </div>
      </section>

      <footer class="border-t border-zinc-200 pt-8 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        <p>
          维护说明：修改全局变量请编辑 <code class="rounded bg-zinc-200/80 px-1 dark:bg-zinc-800">src/styles/tokens.css</code>；首页/关于特有样式在
          <code class="rounded bg-zinc-200/80 px-1 dark:bg-zinc-800">src/assets/hisun.css</code>。
        </p>
        <p class="mt-2">路由：<code class="rounded bg-zinc-200/80 px-1 dark:bg-zinc-800">/library</code></p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import {
  NewsCard,
  StatsCtaCard,
  UiArrowCircle,
  UiGlassButton,
  UiImageSpecCard,
  UiSearchField,
  UiSectionTitle,
  UiSelect,
} from "../components";
</script>
