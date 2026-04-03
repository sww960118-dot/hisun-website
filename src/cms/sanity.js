const DEFAULT_PROJECT_ID = "gj7kf1f4";
const DEFAULT_DATASET = "production";
// 使用固定的稳定 API 版本（不要写未来日期）
const DEFAULT_API_VERSION = "2024-02-29";

function getSanityConfig() {
  return {
    projectId: import.meta.env.VITE_SANITY_PROJECT_ID || DEFAULT_PROJECT_ID,
    dataset: import.meta.env.VITE_SANITY_DATASET || DEFAULT_DATASET,
    apiVersion: import.meta.env.VITE_SANITY_API_VERSION || DEFAULT_API_VERSION,
    readToken: import.meta.env.VITE_SANITY_READ_TOKEN || "",
  };
}

async function sanityQuery(query, params = {}) {
  const { projectId, dataset, apiVersion, readToken } = getSanityConfig();
  if (!projectId || !dataset) return null;

  const url = new URL(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`);
  url.searchParams.set("query", query);
  for (const [k, v] of Object.entries(params || {})) {
    url.searchParams.set(`$${k}`, String(v));
  }

  try {
    const headers = { Accept: "application/json" };
    if (readToken) headers.Authorization = `Bearer ${readToken}`;
    const res = await fetch(url.toString(), { headers });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.result ?? null;
  } catch {
    return null;
  }
}

function splitPortableTextToParagraphs(text) {
  const raw = String(text || "").replace(/\r\n/g, "\n").trim();
  if (!raw) return [];
  return raw
    .split(/\n{2,}|\n/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function fetchSanityNewsItems({ limit = 50 } = {}) {
  // 仅取页面展示需要的字段；正文用 pt::text 生成纯文本
  const q = `*[_type == "news"] | order(pinned desc, publishedAt desc)[0...$limit]{
    "id": _id,
    "category": select(
      category in ["notice", "headline", "staff"] => category,
      true => "notice"
    ),
    "date": coalesce(string(publishedAt)[0..9], ""),
    "views": 0,
    "title": coalesce(title, ""),
    "desc": coalesce(excerpt, ""),
    "image": coalesce(coverImage.asset->url, ""),
    "editor": coalesce(editor, ""),
    "contentText": pt::text(content)
  }`;
  const res = await sanityQuery(q, { limit });
  if (!Array.isArray(res)) return null;
  return res.map((it) => {
    const editor = String(it?.editor ?? "").trim();
    return {
      ...it,
      editor: editor || undefined,
      content: splitPortableTextToParagraphs(it?.contentText),
    };
  });
}

const SUPPORT_SECTION_ORDER = [
  { id: "consult", title: "咨询与服务" },
  { id: "recommended", title: "主营业务推荐" },
  { id: "solutions", title: "解决方案" },
];

/** 与 supportPage.js 中详情页占位图一致（无首图时使用） */
const SUPPORT_DETAIL_FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
];

function hashSupportViews(s) {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return 5200 + (h % 35000);
}

function truncateSupportCardDesc(text, max = 120) {
  const t = String(text || "")
    .replace(/\r\n/g, "\n")
    .replace(/\s+/g, " ")
    .trim();
  if (!t) return "（详见正文）";
  if (t.length <= max) return t;
  return `${t.slice(0, max)}…`;
}

/**
 * 拉取「服务支持」文档，组装为 supportSections + supportDetails（与 SupportView / ServiceDetailView 约定一致）
 */
export async function fetchSanitySupportMaintenance({ limit = 100 } = {}) {
  const q = `*[_type == "supportMaintenance"] | order(coalesce(publishedAt, _createdAt) desc)[0...$limit]{
    "id": _id,
    "title": coalesce(title, ""),
    "category": select(
      category in ["consult", "recommended", "solutions"] => category,
      true => "consult"
    ),
    "publishedAt": coalesce(publishedAt, _createdAt),
    "bodyText": pt::text(content)
  }`;
  const rows = await sanityQuery(q, { limit });
  if (!Array.isArray(rows) || rows.length === 0) return null;

  const buckets = {
    consult: [],
    recommended: [],
    solutions: [],
  };

  for (const row of rows) {
    const cat = row?.category;
    if (!buckets[cat]) continue;
    const id = String(row.id || "");
    const title = String(row.title || "").trim() || "未命名";
    const bodyText = row.bodyText;
    const paragraphs = splitPortableTextToParagraphs(bodyText);
    const cardDesc = truncateSupportCardDesc(bodyText);
    const dateRaw = row.publishedAt ? String(row.publishedAt).slice(0, 10) : "2026-01-01";

    buckets[cat].push({
      listItem: {
        id,
        title,
        desc: cardDesc,
        detailId: id,
      },
      detailItem: {
        id,
        sectionId: cat,
        sectionTitle: SUPPORT_SECTION_ORDER.find((s) => s.id === cat)?.title || "",
        title,
        desc: "",
        source: "高阳金信官网",
        editor: "服务支持编辑部",
        views: hashSupportViews(id),
        publishDate: dateRaw,
        image: SUPPORT_DETAIL_FALLBACK_IMAGES[0],
        content: paragraphs.length ? paragraphs : [cardDesc],
      },
    });
  }

  const sections = SUPPORT_SECTION_ORDER.map((meta) => ({
    id: meta.id,
    title: meta.title,
    items: buckets[meta.id].map((x) => x.listItem),
  }));

  const details = [];
  let imgIdx = 0;
  for (const meta of SUPPORT_SECTION_ORDER) {
    for (const x of buckets[meta.id]) {
      const d = { ...x.detailItem, image: SUPPORT_DETAIL_FALLBACK_IMAGES[imgIdx % SUPPORT_DETAIL_FALLBACK_IMAGES.length] };
      imgIdx += 1;
      details.push(d);
    }
  }

  return { sections, details };
}

function caseDefaultCoverUrl() {
  const base = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");
  return `${base}img/case-default-cover.svg`.replace(/([^:])\/{2,}/g, "$1/");
}

function truncateCaseCardSummary(text, max = 140) {
  const t = String(text || "")
    .replace(/\r\n/g, "\n")
    .replace(/\s+/g, " ")
    .trim();
  if (!t) return "";
  if (t.length <= max) return t;
  return `${t.slice(0, max)}…`;
}

export async function fetchSanityPartnerCases({ limit = 50 } = {}) {
  const q = `*[_type == "case"] | order(pinned desc, publishedAt desc)[0...$limit]{
    "id": _id,
    "title": coalesce(title, ""),
    "coverUrl": coverImage.asset->url,
    "firstBodyImageUrl": content[_type == "image"][0].asset->url,
    "publishDate": coalesce(string(publishedAt)[0..9], ""),
    "bodyText": pt::text(content)
  }`;
  const res = await sanityQuery(q, { limit });
  if (!Array.isArray(res)) return null;
  return res.map((it) => {
    const paragraphs = splitPortableTextToParagraphs(it?.bodyText);
    const teaserSource = paragraphs[0] || String(it?.bodyText || "").trim();
    const summary = truncateCaseCardSummary(teaserSource);
    const image =
      (it?.coverUrl && String(it.coverUrl)) ||
      (it?.firstBodyImageUrl && String(it.firstBodyImageUrl)) ||
      caseDefaultCoverUrl();
    return {
      id: it.id,
      title: it.title,
      summary,
      source: "典型案例",
      editor: "高阳金信编辑部",
      views: 0,
      publishDate: it.publishDate || "2026-01-01",
      image,
      content: paragraphs,
      cmsContentOnly: true,
    };
  });
}

