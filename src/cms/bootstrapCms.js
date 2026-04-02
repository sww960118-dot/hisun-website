/**
 * 在创建 Vue 应用之前拉取 public/data 下的 JSON，写入 window.HISUN_CMS。
 * - news.json、partner-cases.json 格式均为 { "items": [ ... ] }
 * - 仅当 items 为非空数组时才覆盖内置默认数据
 */
import { defaultHisunCms } from "./config.js";

function dataUrl(name) {
  const base = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");
  return `${base}data/${name}.json`.replace(/([^:])\/{2,}/g, "$1/");
}

async function fetchJson(name) {
  try {
    const res = await fetch(dataUrl(name), { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function prefetchCmsData() {
  if (typeof window === "undefined") return;

  window.HISUN_CMS = { ...defaultHisunCms, ...window.HISUN_CMS };

  const [newsWrap, casesWrap] = await Promise.all([fetchJson("news"), fetchJson("partner-cases")]);

  if (newsWrap && Array.isArray(newsWrap.items) && newsWrap.items.length > 0) {
    window.HISUN_CMS.newsItems = newsWrap.items;
  }

  if (casesWrap && Array.isArray(casesWrap.items) && casesWrap.items.length > 0) {
    window.HISUN_CMS.partnerCases = casesWrap.items;
  }
}
