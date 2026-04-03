import { defaultHisunCms } from "./config.js";

/**
 * 内置默认轮播（接口与 /data/banners.json 均不可用时使用）
 */
export const DEFAULT_BANNERS = [
  {
    imageUrl: "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1280&q=75",
    kicker: "",
    title: "",
    desc: "",
    cta1: "了解方案",
    cta2: "走进高阳",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1280&q=75",
    kicker: "",
    title: "",
    desc: "",
    cta1: "了解方案",
    cta2: "走进高阳",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1280&q=75",
    kicker: "",
    title: "",
    desc: "",
    cta1: "了解方案",
    cta2: "走进高阳",
  },
];

export function normalizeBanner(b) {
  return {
    imageUrl: b.imageUrl || b.image || "",
    kicker: b.kicker || "",
    title: b.title || "",
    desc: b.desc || b.description || "",
    cta1: b.cta1 || b.primaryText || "了解方案",
    cta2: b.cta2 || b.secondaryText || "走进高阳",
  };
}

/**
 * 加载 Banner：优先 CMS 接口 → 静态 JSON → 内置默认。
 * 后续对接后台只需实现 GET bannersEndpoint 返回与 normalizeBanner 兼容的 JSON 数组。
 */
export async function loadBanners() {
  const cms = (typeof window !== "undefined" && window.HISUN_CMS) || defaultHisunCms;
  const base = cms.apiBase || "";
  const ep = cms.bannersEndpoint || "/api/banners";

  try {
    const res = await fetch(base + ep, { headers: { Accept: "application/json" } });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length) return data.map(normalizeBanner);
    }
  } catch {
    /* 走静态或默认 */
  }

  const staticUrl = cms.staticBannersUrl || "/data/banners.json";
  try {
    const res = await fetch(staticUrl, { headers: { Accept: "application/json" }, cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const arr = Array.isArray(data) ? data : data?.banners || data?.items;
      if (Array.isArray(arr) && arr.length) return arr.map(normalizeBanner);
    }
  } catch {
    /* 使用默认 */
  }

  return DEFAULT_BANNERS.map(normalizeBanner);
}
