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

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function sanityQuery(query, params = {}, attempt = 0) {
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
    const res = await fetch(url.toString(), { headers, cache: "no-store" });
    if (!res.ok) {
      if (attempt < 2 && (res.status >= 500 || res.status === 429)) {
        await sleep(400 * (attempt + 1));
        return sanityQuery(query, params, attempt + 1);
      }
      if (import.meta.env.DEV) {
        console.warn("[Sanity] query failed", res.status, url.pathname);
      }
      return null;
    }
    const data = await res.json();
    return data?.result ?? null;
  } catch (e) {
    if (attempt < 2) {
      await sleep(400 * (attempt + 1));
      return sanityQuery(query, params, attempt + 1);
    }
    if (import.meta.env.DEV) {
      console.warn("[Sanity] query error", e);
    }
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

/** 按正文块顺序取第一张图（Sanity image 或 embedImage 外链） */
function firstImageUrlFromPortable(blocks) {
  if (!Array.isArray(blocks)) return "";
  for (const b of blocks) {
    if (!b || typeof b !== "object") continue;
    if (b._type === "image") {
      const u = b.url || b.asset?.url;
      if (u) return String(u).trim();
    }
    if (b._type === "embedImage" && b.url) return String(b.url).trim();
  }
  return "";
}

/**
 * 正文 Portable Text：显式展开 image / embedImage / block，避免仅用 `@` 时 embedImage 在 CDN 上丢失。
 */
const GROQ_CONTENT_PORTABLE = `content[]{
  _type == "image" => {
    "_type": "image",
    "_key": _key,
    "alt": alt,
    "url": asset->url
  },
  _type == "embedImage" => {
    "_type": "embedImage",
    "_key": _key,
    "url": url,
    "alt": alt
  },
  _type == "block" => {
    "_type": "block",
    "_key": _key,
    "style": style,
    "listItem": listItem,
    "level": level,
    "children": children,
    "markDefs": markDefs
  },
  true => @
}`;

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
    "image": coverImage.asset->url,
    "editor": coalesce(editor, ""),
    "contentText": pt::text(content),
    "contentPortable": ${GROQ_CONTENT_PORTABLE}
  }`;
  const res = await sanityQuery(q, { limit });
  if (!Array.isArray(res)) return null;
  return res.map((it) => {
    const paragraphs = splitPortableTextToParagraphs(it?.contentText);
    const teaser = paragraphs[0] || String(it?.contentText || "").trim();
    let desc = String(it?.desc ?? "").trim();
    if (!desc && teaser) desc = truncateCaseCardSummary(teaser);
    const editor = String(it?.editor ?? "").trim() || "高阳金信";
    const coverUrl = it?.image != null && it.image !== "" ? String(it.image).trim() : "";
    const bodyFirstUrl = firstImageUrlFromPortable(it?.contentPortable);
    const image = coverUrl || bodyFirstUrl || "";
    return {
      ...it,
      image,
      desc,
      editor,
      content: paragraphs,
      contentPortable: Array.isArray(it?.contentPortable) ? it.contentPortable : null,
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
    "bodyText": pt::text(content),
    "excerpt": coalesce(excerpt, ""),
    "editor": coalesce(editor, ""),
    "contentPortable": ${GROQ_CONTENT_PORTABLE}
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
    const excerptTrim = String(row.excerpt || "").trim();
    const cardDesc = excerptTrim || truncateSupportCardDesc(bodyText);
    const dateRaw = row.publishedAt ? String(row.publishedAt).slice(0, 10) : "2026-01-01";
    const editorName = String(row.editor || "").trim() || "高阳金信";

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
        editor: editorName,
        views: hashSupportViews(id),
        publishDate: dateRaw,
        image: SUPPORT_DETAIL_FALLBACK_IMAGES[0],
        content: paragraphs.length ? paragraphs : [cardDesc],
        contentPortable: Array.isArray(row.contentPortable) ? row.contentPortable : null,
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

export async function fetchSanityJobPostings({ limit = 100 } = {}) {
  const q = `*[_type == "jobPosting"] | order(publishedAt desc)[0...$limit]{
    "id": _id,
    "title": coalesce(title, ""),
    "type": jobType,
    "headcount": headcount,
    "location": workLocation,
    "degree": education,
    "publishDate": coalesce(string(publishedAt)[0..9], ""),
    "responsibilities": coalesce(responsibilities, []),
    "requirements": coalesce(requirements, [])
  }`;
  const res = await sanityQuery(q, { limit });
  if (!Array.isArray(res) || res.length === 0) return null;
  return res.map((row) => ({
    id: String(row.id || ""),
    title: String(row.title || ""),
    type: String(row.type || ""),
    headcount: Number(row.headcount) || 1,
    location: String(row.location || ""),
    degree: String(row.degree || ""),
    publishDate: String(row.publishDate || "2026-01-01"),
    responsibilities: Array.isArray(row.responsibilities)
      ? row.responsibilities.map((x) => String(x).trim()).filter(Boolean)
      : [],
    requirements: Array.isArray(row.requirements)
      ? row.requirements.map((x) => String(x).trim()).filter(Boolean)
      : [],
  }));
}

const BUSINESS_SOLUTION_TAB_FIELDS = [
  "businessProcessing",
  "channelService",
  "tooling",
  "techPlatform",
  "informationBi",
];

function groqBusinessSolutionsProjection() {
  return BUSINESS_SOLUTION_TAB_FIELDS.map(
    (key) =>
      `${key} {
        introduction,
        "refs": supportItems[]->{
          _id,
          "title": coalesce(title, ""),
          "excerpt": coalesce(excerpt, ""),
          "bodyText": pt::text(content)
        }
      }`,
  ).join(",\n");
}

/**
 * 单例「解决方案页配置」：五个 Tab 的简介 + 服务支持引用顺序。
 */
export async function fetchSanityBusinessSolutionsConfig() {
  const q = `*[_id == "businessSolutionsConfig"][0]{
    ${groqBusinessSolutionsProjection()}
  }`;
  const res = await sanityQuery(q);
  if (!res || typeof res !== "object") return null;
  return res;
}

export async function fetchSanityPartnerCases({ limit = 50 } = {}) {
  const q = `*[_type == "case"] | order(pinned desc, publishedAt desc)[0...$limit]{
    "id": _id,
    "title": coalesce(title, ""),
    "coverUrl": coverImage.asset->url,
    "firstBodyImageUrl": coalesce(
      content[_type == "image"][0].asset->url,
      content[_type == "embedImage"][0].url
    ),
    "publishDate": coalesce(string(publishedAt)[0..9], ""),
    "bodyText": pt::text(content),
    "excerpt": coalesce(excerpt, ""),
    "editor": coalesce(editor, ""),
    "contentPortable": ${GROQ_CONTENT_PORTABLE}
  }`;
  const res = await sanityQuery(q, { limit });
  if (!Array.isArray(res)) return null;
  return res.map((it) => {
    const paragraphs = splitPortableTextToParagraphs(it?.bodyText);
    const teaserSource = paragraphs[0] || String(it?.bodyText || "").trim();
    const excerptTrim = String(it.excerpt || "").trim();
    const summary = truncateCaseCardSummary(excerptTrim || teaserSource);
    const image =
      (it?.coverUrl && String(it.coverUrl)) ||
      (it?.firstBodyImageUrl && String(it.firstBodyImageUrl)) ||
      caseDefaultCoverUrl();
    const editorName = String(it.editor || "").trim() || "高阳金信";
    return {
      id: it.id,
      title: it.title,
      summary,
      source: "典型案例",
      editor: editorName,
      views: 0,
      publishDate: it.publishDate || "2026-01-01",
      image,
      content: paragraphs,
      contentPortable: Array.isArray(it?.contentPortable) ? it.contentPortable : null,
      cmsContentOnly: true,
    };
  });
}

