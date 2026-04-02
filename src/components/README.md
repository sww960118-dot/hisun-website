# HiSun 组件库规范

本组件库按“规范优先”方式组织，适合后续新页面直接拼装，风格与首页、走进高阳、主营业务、新闻列表等当前实现一致。

## 1) 目录结构

- `ui/` 基础原子组件
  - `UiGlassButton.vue` 按钮（尺寸/选中/禁用/液态 hover）
  - `UiArrowCircle.vue` 圆形箭头
  - `UiSectionTitle.vue` 标题栏（可选 `moreText` / `moreHref`，「查看更多」使用全局 `.hs-more-cta`）
  - `UiGlassCard.vue` 玻璃容器
  - `UiImageSpecCard.vue` 图片规范卡（比例/选中/禁用）
  - `UiSelect.vue` 自定义下拉（选中/悬停/错误/禁用/空选项）
  - `UiSearchField.vue` 搜索框（聚焦高亮/错误/空结果/禁用）
- `blocks/` 业务区块组件
  - `NewsCard.vue`
  - `StatsCtaCard.vue`
- 页面级：`BannerNoticeBar.vue`（Banner 底栏通知，跳转公告详情）
- `index.js` 统一导出
- `src/styles/tokens.css` 设计 Token 与排版语义类
- `src/assets/hisun.css` 全局业务样式（玻璃导航、`.hs-more-cta`、Banner CTA 等）

## 2) 字体规范（Token，以 `tokens.css` 为准）

- `--hs-fs-h1`：Banner 主标题（clamp 响应）
- `--hs-fs-h2`：30px（`.hs-text-page-h2` 区块主标题）
- `--hs-fs-h3`：1.25rem（分栏小标题）
- `--hs-fs-body`：**14px**（正文）
- `--hs-fs-card-title`：15px（卡片标题）
- `--hs-fs-btn-ghost`：11px（业务卡线框「查看详情」）
- `--hs-fs-caption`：12px（辅助说明）

对应类：`hs-text-page-h2`、`hs-text-body`、`hs-type-h1` 等（详见 `tokens.css` 注释）。

### 胶囊文案 CTA Token

- `--hs-cta-pad-x`：水平内边距（默认 **16px**），用于 `.hs-more-cta` 与主营业务 `.biz-learn-more-btn`
- `--hs-cta-fill-duration`：主题蓝铺色动画时长（默认 0.32s）

## 3) 全站胶囊按钮（hisun.css）

- 类名：**`.hs-more-cta`**，子元素 **`.hs-more-cta__label`** + **`.hs-more-cta__arrow`**（内联 SVG 箭头）
- 深色通栏：**`.hs-more-cta--on-dark`**
- 外观：`rounded-2xl` + `inline-flex` + `py-2.5`（竖向内边距用 Tailwind）；宽度 **fit-content**，左右 padding 由 **`--hs-cta-pad-x`** 控制
- 动效：`::before` 从左向右 `scaleX` 铺主题蓝；hover 时文案与箭头变白；箭头 **`hsMoreCtaArrowBounce`**

主营业务方案卡内「了解更多」：**`.biz-learn-more-btn`**（`rounded-lg`，动效与箭头同上）。

业务卡内轻量「查看详情」：**`.hs-text-btn-ghost` + `.biz-card-btn`**，配合 **`inline-flex w-fit px-4 py-2`**（与首页五卡一致）。

## 4) 按钮规范（UiGlassButton）

### 尺寸

- `size="sm"` -> 32px 高
- `size="md"` -> 40px 高
- `size="lg"` -> 48px 高

### 状态

- 默认态：普通边框与底色
- 悬停态：液态玻璃（`hs-liquid-hover`）
- 选中态：`selected`
- 禁用态：`disabled`

### 主题

- `tone="outline"`（默认）
- `tone="solid"`（主按钮）

## 5) 路由与滚动（约定）

- `src/router/index.js`：仅改 **主营业务** `?tab=` 且 **无 hash** 时保留滚动；顶栏子菜单带 **`#biz-solutions`** 时滚到模块首屏。
- 仅改 **`/news`** 的 **`?category=`** 时保留滚动。
- 带 **`hash`** 的导航由 `scrollBehavior` 处理锚点，`afterEach` 不强制 `scrollTop = 0`。

## 6) 图片规范

- 比例建议：
  - 列表封面：`16:9`
  - 内容图：`4:3`
  - 素材管理：`1:1`
- 交互：
  - 默认：圆角 + 轻边框
  - 悬停：图片轻放大
  - 选中：`hs-is-selected`
  - 禁用：`hs-is-disabled`

## 7) 快速使用

```js
import { UiGlassButton, UiImageSpecCard, NewsCard } from "@/components";
```

```vue
<UiGlassButton size="md" :selected="true">保存</UiGlassButton>
<UiImageSpecCard ratio="16/9" src="https://..." />
<NewsCard image="https://..." />
```

## 8) 组件库预览页

- `src/pages/ComponentLibrary.vue`，路由 **`/library`**
- 内含颜色、标题、字体、**胶囊 CTA**、路由与滚动、新闻模块、间距等最新说明。

## 9) 合作伙伴页

- 路由 **`/partners`**（`PartnersView.vue`）：Banner + **我们的客户**（`#partners-clients`，行业 Tab + Logo 网格）+ **典型案例**（`#partners-cases`，头条宽卡 + 三列案例卡）。
- Logo 与筛选逻辑：`cms/partnersPage.js`（基于 `partners.js` 静态文件列表扩展 `sector` 字段）。
