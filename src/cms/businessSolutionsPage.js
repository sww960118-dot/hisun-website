import { BUSINESS_TAB_IMAGES, BUSINESS_FEATURE_COUNTS } from "./businessPage.js";

/** 方案列表卡片简介（与服务支持卡片风格一致，后台可整体替换文案） */
export const SOLUTION_MODULE_CARD_DESC =
  "围绕金融机构业务场景，提供可落地的能力建设路径与持续演进支撑，便于与存量系统协同。";

const CATEGORY_TITLES_ZH = [
  "业务处理方案",
  "渠道服务方案",
  "工具方案",
  "技术平台方案",
  "信息管理及商业智能方案",
];

const MODULE_TITLES = [
  ["分布式核心系统", "海外财富管理系统", "高阳智付产品", "高阳CIPS直联产品", "跨境理财通产品", "贸易融资业务系统"],
  ["综合柜台前置", "手机银行", "渠道管理平台"],
  ["数据迁移工具", "分布式任务调度中心", "比对中心工具", "参数管理平台"],
  ["ICS技术平台"],
  ["额度及押品管理系统", "报表系统", "反洗钱系统", "企业级客户信息管理系统", "香港监管报表系统"],
];

function hashViews(id) {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return 8000 + (h % 42000);
}

function buildDefaultSolutionDetails() {
  const list = [];
  for (let t = 0; t < 5; t += 1) {
    const pid = `p${t + 1}`;
    const catTitle = CATEGORY_TITLES_ZH[t];
    const titles = MODULE_TITLES[t];
    for (let i = 0; i < titles.length; i += 1) {
      const id = `${pid}-f${i + 1}`;
      const title = titles[i];
      list.push({
        id,
        categoryId: pid,
        categoryTitle: catTitle,
        title,
        summary: `${title}面向银行业务连续性、合规与安全审计要求，提供端到端的实施方法论与工程化交付能力。`,
        source: "高阳金信官网",
        editor: "产品方案编辑部",
        views: hashViews(id),
        publishDate: "2025-08-12",
        image: BUSINESS_TAB_IMAGES[t] ?? BUSINESS_TAB_IMAGES[0],
        content: [
          `在「${catTitle}」整体规划下，${title}聚焦关键业务场景，支持分阶段上线与平滑迁移。`,
          "方案强调与渠道、核心及周边系统的一体化协同，便于后续版本迭代与运营指标沉淀。",
          "更多材料与演示预约，请通过官网咨询通道或服务热线联系我们。",
        ],
      });
    }
  }
  return list;
}

function normalizeSolutionDetail(x) {
  return {
    id: String(x.id || ""),
    categoryId: String(x.categoryId || ""),
    categoryTitle: String(x.categoryTitle || ""),
    title: String(x.title || ""),
    summary: String(x.summary || ""),
    source: String(x.source || "高阳金信官网"),
    editor: String(x.editor || "产品方案编辑部"),
    views: Number(x.views) || 0,
    publishDate: String(x.publishDate || "2025-08-12"),
    image: String(x.image || BUSINESS_TAB_IMAGES[0]),
    content: Array.isArray(x.content) ? x.content.map((p) => String(p)) : [],
  };
}

export function resolveSolutionDetails() {
  const cms = typeof window !== "undefined" ? window.HISUN_CMS?.solutionDetails : null;
  const raw = Array.isArray(cms) && cms.length ? cms : buildDefaultSolutionDetails();
  return raw.map(normalizeSolutionDetail);
}

export const SOLUTION_DETAILS = resolveSolutionDetails();

function normalizeCategoryModule(m, pid, index) {
  const n = String(pid || "p1").replace(/^p/, "") || "1";
  return {
    id: String(m.id || `${pid}-f${index + 1}`),
    titleKey: m.titleKey || `biz_p${n}_f${index + 1}`,
    desc: String(m.desc || SOLUTION_MODULE_CARD_DESC),
  };
}

function normalizeCategory(c, idx) {
  const pid = c.id || `p${idx + 1}`;
  const tabIndex = Number(c.tabIndex) >= 0 ? Number(c.tabIndex) : idx;
  const modules = Array.isArray(c.modules) ? c.modules.map((m, i) => normalizeCategoryModule(m, pid, i)) : [];
  return {
    id: pid,
    tabIndex,
    titleKey: c.titleKey || `biz_p${tabIndex + 1}_title`,
    introKey: c.introKey || `biz_p${tabIndex + 1}_desc`,
    image: c.image || BUSINESS_TAB_IMAGES[tabIndex] || BUSINESS_TAB_IMAGES[0],
    modules,
  };
}

export function buildBusinessSolutionCategories() {
  const list = [];
  for (let tab = 0; tab < 5; tab += 1) {
    const n = tab + 1;
    const pid = `p${n}`;
    const count = BUSINESS_FEATURE_COUNTS[tab] ?? 1;
    const modules = [];
    for (let i = 1; i <= count; i += 1) {
      modules.push({
        id: `${pid}-f${i}`,
        titleKey: `biz_p${n}_f${i}`,
        desc: SOLUTION_MODULE_CARD_DESC,
      });
    }
    list.push({
      id: pid,
      tabIndex: tab,
      titleKey: `biz_p${n}_title`,
      introKey: `biz_p${n}_desc`,
      image: BUSINESS_TAB_IMAGES[tab],
      modules,
    });
  }
  return list;
}

export function resolveBusinessSolutionCategories() {
  const cms = typeof window !== "undefined" ? window.HISUN_CMS?.businessSolutionCategories : null;
  if (Array.isArray(cms) && cms.length) return cms.map((c, i) => normalizeCategory(c, i));
  return buildBusinessSolutionCategories();
}

export const BUSINESS_SOLUTION_CATEGORIES = resolveBusinessSolutionCategories();

/** 同一方案分类下的详情顺序（用于上一篇 / 下一篇） */
export function solutionIdsInCategory(categoryId) {
  const cid = String(categoryId || "");
  return SOLUTION_DETAILS.filter((x) => x.categoryId === cid).map((x) => x.id);
}
