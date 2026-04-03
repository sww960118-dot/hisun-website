import { DEFAULT_NEWS_ITEMS } from "./news.defaults.js";

const NEWS_CATEGORIES = new Set(["notice", "headline", "staff"]);

function normalizeNewsItem(item, index) {
  const cat = NEWS_CATEGORIES.has(item?.category) ? item.category : "notice";
  const dateRaw = String(item?.date ?? "").slice(0, 10);
  return {
    id: String(item?.id || `news-${index + 1}`),
    category: cat,
    date: dateRaw || "2026-01-01",
    views: Number(item?.views) || 0,
    title: String(item?.title || ""),
    desc: String(item?.desc ?? item?.summary ?? ""),
    image: String(item?.image || ""),
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

export const NEWS_ITEMS = resolveNewsRaw().map(normalizeNewsItem);
