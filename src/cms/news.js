import { DEFAULT_NEWS_ITEMS } from "./news.defaults.js";
import { sanityDateToYmdChina } from "./sanity.js";
import { cmsPickStr, cmsPickParagraphs, cmsPickPortable } from "./cmsLocale.js";

const NEWS_CATEGORIES = new Set(["notice", "headline", "staff"]);

/** 仅 Sanity 布尔 true 视为置顶，避免异常真值干扰 */
export function isNewsPinned(item) {
  return item?.pinned === true;
}

/** 置顶优先，其次按日期新→旧（与 Sanity `order(pinned desc, publishedAt desc)` 一致） */
export function compareNewsByPinnedThenDate(a, b) {
  const pa = isNewsPinned(a) ? 1 : 0;
  const pb = isNewsPinned(b) ? 1 : 0;
  if (pb !== pa) return pb - pa;
  const ta = new Date(a?.date || 0).getTime();
  const tb = new Date(b?.date || 0).getTime();
  const na = Number.isFinite(ta) ? ta : 0;
  const nb = Number.isFinite(tb) ? tb : 0;
  return nb - na;
}

/** 列表/详情无封面且无正文图时的占位（须存在于 public） */
export function newsPlaceholderImageUrl() {
  const base = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");
  return `${base}img/case-default-cover.svg`.replace(/([^:])\/{2,}/g, "$1/");
}

function normalizeNewsItem(item, index) {
  const cat = NEWS_CATEGORIES.has(item?.category) ? item.category : "notice";
  // 优先用 Sanity 原始 publishedAt（与后台一致）；避免仅用 date 字段被旧数据或错误占位污染
  const fromSanity =
    sanityDateToYmdChina(item?.publishedAt) || sanityDateToYmdChina(item?._createdAt) || "";
  const dateRaw =
    fromSanity || String(item?.date ?? "").trim().slice(0, 10);
  let image = String(item?.image || "").trim();
  if (!image) image = newsPlaceholderImageUrl();
  return {
    id: String(item?.id || `news-${index + 1}`),
    category: cat,
    pinned: isNewsPinned(item),
    date: dateRaw || "2026-01-01",
    views: Number(item?.views) || 0,
    title: String(item?.title || ""),
    desc: String(item?.desc ?? item?.summary ?? ""),
    image,
    source: item?.source,
    editor: (() => {
      const e = item?.editor;
      if (e == null || e === "") return undefined;
      const s = String(e).trim();
      return s || undefined;
    })(),
    content: Array.isArray(item?.content) ? item.content.map((x) => String(x)) : [],
    contentPortable: Array.isArray(item?.contentPortable) ? item.contentPortable : null,
    titleEn: item?.titleEn,
    titleZhHant: item?.titleZhHant,
    descEn: item?.descEn,
    descZhHant: item?.descZhHant,
    contentEn: Array.isArray(item?.contentEn) ? item.contentEn.map((x) => String(x)) : null,
    contentZhHant: Array.isArray(item?.contentZhHant) ? item.contentZhHant.map((x) => String(x)) : null,
    contentPortableEn: Array.isArray(item?.contentPortableEn) ? item.contentPortableEn : null,
    contentPortableZhHant: Array.isArray(item?.contentPortableZhHant) ? item.contentPortableZhHant : null,
  };
}

/** 按当前语言取新闻标题/摘要/段落/Portable（供组件与 lang 联动） */
export function newsTitleForLang(item, lang) {
  if (!item) return "";
  return cmsPickStr(item.title, item.titleEn, item.titleZhHant, lang);
}

export function newsDescForLang(item, lang) {
  if (!item) return "";
  return cmsPickStr(item.desc, item.descEn, item.descZhHant, lang);
}

export function newsContentForLang(item, lang) {
  if (!item) return [];
  return cmsPickParagraphs(item.content, item.contentEn, item.contentZhHant, lang);
}

export function newsPortableForLang(item, lang) {
  if (!item) return null;
  return cmsPickPortable(item.contentPortable, item.contentPortableEn, item.contentPortableZhHant, lang);
}

function resolveNewsRaw() {
  const w = typeof window !== "undefined" && window.HISUN_CMS?.newsItems;
  if (Array.isArray(w) && w.length > 0) return w;
  return DEFAULT_NEWS_ITEMS;
}

/** 运行时从 window.HISUN_CMS 解析，避免模块初始化早于 prefetch 时永远停留在内置演示数据 */
export function getNewsItems() {
  const raw = resolveNewsRaw();
  const source = Array.isArray(raw) && raw.length > 0 ? raw : DEFAULT_NEWS_ITEMS;
  const mapped = source.map(normalizeNewsItem);
  return mapped.length > 0 ? mapped : DEFAULT_NEWS_ITEMS.map(normalizeNewsItem);
}
