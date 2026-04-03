/**
 * 在创建 Vue 应用之前拉取 public/data 下的 JSON，写入 window.HISUN_CMS。
 * - news.json、partner-cases.json 格式均为 { "items": [ ... ] }
 * - 仅当 items 为非空数组时才覆盖内置默认数据
 */
import { defaultHisunCms } from "./config.js";
import { bumpCmsTick } from "./cmsTick.js";
import {
  fetchSanityBusinessSolutionsConfig,
  fetchSanityJobPostings,
  fetchSanityNewsItems,
  fetchSanityPartnerCases,
  fetchSanitySupportMaintenance,
} from "./sanity.js";

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

async function applySanityToWindow() {
  const settled = await Promise.allSettled([
    fetchSanityNewsItems(),
    fetchSanityPartnerCases(),
    fetchSanitySupportMaintenance(),
    fetchSanityJobPostings(),
    fetchSanityBusinessSolutionsConfig(),
  ]);
  const val = (i) => (settled[i]?.status === "fulfilled" ? settled[i].value : null);
  const sanityNews = val(0);
  const sanityCases = val(1);
  const sanitySupport = val(2);
  const sanityJobs = val(3);
  const sanityBizSolutions = val(4);

  if (Array.isArray(sanityNews) && sanityNews.length > 0) {
    window.HISUN_CMS.newsItems = sanityNews;
  }
  if (Array.isArray(sanityCases) && sanityCases.length > 0) {
    window.HISUN_CMS.partnerCases = sanityCases;
  }
  if (sanitySupport?.sections && sanitySupport?.details?.length) {
    window.HISUN_CMS.supportSections = sanitySupport.sections;
    window.HISUN_CMS.supportDetails = sanitySupport.details;
  }
  if (Array.isArray(sanityJobs) && sanityJobs.length > 0) {
    window.HISUN_CMS.joinJobs = sanityJobs;
  }
  if (sanityBizSolutions && typeof sanityBizSolutions === "object") {
    window.HISUN_CMS.businessSolutionsSanity = sanityBizSolutions;
  }
}

/** 同步初始化 CMS 占位，便于首屏立即挂载 Vue；完整数据由 prefetchCmsData 后台拉取 */
export function initCmsWindowSync() {
  if (typeof window === "undefined") return;
  window.HISUN_CMS = { ...defaultHisunCms, ...window.HISUN_CMS };
  bumpCmsTick();
}

export async function prefetchCmsData() {
  if (typeof window === "undefined") return;

  initCmsWindowSync();

  await applySanityToWindow();
  bumpCmsTick();

  // 如果 Sanity 没有数据，再回退到静态 JSON
  const [newsWrap, casesWrap] = await Promise.all([fetchJson("news"), fetchJson("partner-cases")]);

  if (!window.HISUN_CMS.newsItems && newsWrap && Array.isArray(newsWrap.items) && newsWrap.items.length > 0) {
    window.HISUN_CMS.newsItems = newsWrap.items;
    bumpCmsTick();
  }

  if (!window.HISUN_CMS.partnerCases && casesWrap && Array.isArray(casesWrap.items) && casesWrap.items.length > 0) {
    window.HISUN_CMS.partnerCases = casesWrap.items;
    bumpCmsTick();
  }
}
