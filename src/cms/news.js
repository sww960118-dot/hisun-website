import { DEFAULT_NEWS_ITEMS } from "./news.defaults.js";

const NEWS_CATEGORIES = new Set(["notice", "headline", "staff"]);

/** 列表/详情无封面且无正文图时的占位（public/img/news-placeholder.png） */
export function newsPlaceholderImageUrl() {
  const base = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");
  return `${base}img/news-placeholder.png`.replace(/([^:])\/{2,}/g, "$1/");
}

function normalizeNewsItem(item, index) {
  const cat = NEWS_CATEGORIES.has(item?.category) ? item.category : "notice";
  const dateRaw = String(item?.date ?? "").slice(0, 10);
  let image = String(item?.image || "").trim();
  if (!image) image = newsPlaceholderImageUrl();
  return {
    id: String(item?.id || `news-${index + 1}`),
    category: cat,
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
  };
}

function resolveNewsRaw() {
  const w = typeof window !== "undefined" && window.HISUN_CMS?.newsItems;
  if (Array.isArray(w) && w.length > 0) return w;
  return DEFAULT_NEWS_ITEMS;
}

/** 运行时从 window.HISUN_CMS 解析，避免模块初始化早于 prefetch 时永远停留在内置演示数据 */
export function getNewsItems() {
  return resolveNewsRaw().map(normalizeNewsItem);
}
