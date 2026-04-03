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
    const res = await fetch(url.toString(), { headers, cache: "default" });
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

const CN_TZ = "Asia/Shanghai";

/**
 * Sanity datetime → 中国时区日历日 YYYY-MM-DD。
 * 优先用 format()（兼容部分环境 formatToParts 不完整的问题）；供 news 归一化与查询结果共用。
 */
export function sanityDateToYmdChina(value) {
  if (value == null || value === "") return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const opts = {
    timeZone: CN_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  try {
    const s = new Intl.DateTimeFormat("en-CA", opts).format(d).replace(/\//g, "-");
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  } catch {
    /* fall through */
  }
  try {
    const parts = new Intl.DateTimeFormat("en-CA", opts).formatToParts(d);
    const y = parts.find((p) => p.type === "year")?.value;
    const m = parts.find((p) => p.type === "month")?.value;
    const day = parts.find((p) => p.type === "day")?.value;
    if (y && m && day) return `${y}-${m}-${day}`;
  } catch {
    /* ignore */
  }
  return "";
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
function groqPortableField(fieldName) {
  return `${fieldName}[]{
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
}

const GROQ_CONTENT_PORTABLE = groqPortableField("content");

function mapSanityNewsRow(it, lite) {
  const paragraphs = splitPortableTextToParagraphs(it?.contentText);
  const paragraphsEn = splitPortableTextToParagraphs(it?.contentTextEn);
  const paragraphsZhHant = splitPortableTextToParagraphs(it?.contentTextZhHant);

  const teaser = paragraphs[0] || String(it?.contentText || "").trim();
  const teaserEn = paragraphsEn[0] || String(it?.contentTextEn || "").trim();
  const teaserZhHant = paragraphsZhHant[0] || String(it?.contentTextZhHant || "").trim();

  let desc = String(it?.desc ?? "").trim();
  if (!desc && teaser) desc = truncateCaseCardSummary(teaser);

  let descEn = String(it?.excerptEn ?? "").trim();
  if (!descEn && teaserEn) descEn = truncateCaseCardSummary(teaserEn);

  let descZhHant = String(it?.excerptZhHant ?? "").trim();
  if (!descZhHant && teaserZhHant) descZhHant = truncateCaseCardSummary(teaserZhHant);

  const editor = String(it?.editor ?? "").trim() || "高阳金信";
  const coverUrl = it?.image != null && it.image !== "" ? String(it.image).trim() : "";
  const bodyFirstUrl = lite
    ? String(it?.firstBodyImageUrl ?? "").trim()
    : firstImageUrlFromPortable(it?.contentPortable);
  const image = coverUrl || bodyFirstUrl || "";
  const date =
    sanityDateToYmdChina(it?.publishedAt) ||
    sanityDateToYmdChina(it?._createdAt) ||
    "";
  const title = String(it?.title ?? "").trim();
  const titleEn = String(it?.titleEn ?? "").trim();
  const titleZhHant = String(it?.titleZhHant ?? "").trim();

  return {
    ...it,
    pinned: it?.pinned === true,
    date,
    image,
    title,
    titleEn: titleEn || undefined,
    titleZhHant: titleZhHant || undefined,
    desc,
    descEn: descEn || undefined,
    descZhHant: descZhHant || undefined,
    editor,
    content: paragraphs,
    contentEn: paragraphsEn.length ? paragraphsEn : null,
    contentZhHant: paragraphsZhHant.length ? paragraphsZhHant : null,
    contentPortable: lite ? null : Array.isArray(it?.contentPortable) ? it.contentPortable : null,
    contentPortableEn: lite ? null : Array.isArray(it?.contentPortableEn) ? it.contentPortableEn : null,
    contentPortableZhHant: lite ? null : Array.isArray(it?.contentPortableZhHant) ? it.contentPortableZhHant : null,
  };
}

/**
 * 列表/首屏预取：不拉 contentPortable，显著减小 JSON；封面用 firstBodyImageUrl 兜底。
 */
export async function fetchSanityNewsItems({ limit = 50, lite = false } = {}) {
  const portableBlock = lite
    ? `"firstBodyImageUrl": coalesce(
      content[_type == "image"][0].asset->url,
      content[_type == "embedImage"][0].url
    )`
    : `"contentPortable": ${GROQ_CONTENT_PORTABLE},
    "contentPortableEn": ${groqPortableField("contentEn")},
    "contentPortableZhHant": ${groqPortableField("contentZhHant")}`;
  const q = `*[_type == "news"] | order(coalesce(pinned, false) desc, publishedAt desc)[0...$limit]{
    "id": _id,
    "pinned": coalesce(pinned, false),
    "category": select(
      category in ["notice", "headline", "staff"] => category,
      true => "notice"
    ),
    "publishedAt": publishedAt,
    "_createdAt": _createdAt,
    "views": 0,
    "title": coalesce(title, ""),
    "titleEn": coalesce(titleEn, ""),
    "titleZhHant": coalesce(titleZhHant, ""),
    "desc": coalesce(excerpt, ""),
    "excerptEn": coalesce(excerptEn, ""),
    "excerptZhHant": coalesce(excerptZhHant, ""),
    "image": coverImage.asset->url,
    "editor": coalesce(editor, ""),
    "contentText": pt::text(content),
    "contentTextEn": pt::text(contentEn),
    "contentTextZhHant": pt::text(contentZhHant),
    ${portableBlock}
  }`;
  const res = await sanityQuery(q, { limit });
  if (!Array.isArray(res)) return null;
  return res.map((it) => mapSanityNewsRow(it, lite));
}

/** 单篇详情补全（富文本 Portable），供新闻详情页按需请求 */
export async function fetchSanityNewsById(id) {
  const rawId = String(id || "").trim();
  if (!rawId) return null;
  const q = `*[_type == "news" && _id == $id][0]{
    "id": _id,
    "pinned": coalesce(pinned, false),
    "category": select(
      category in ["notice", "headline", "staff"] => category,
      true => "notice"
    ),
    "publishedAt": publishedAt,
    "_createdAt": _createdAt,
    "views": 0,
    "title": coalesce(title, ""),
    "titleEn": coalesce(titleEn, ""),
    "titleZhHant": coalesce(titleZhHant, ""),
    "desc": coalesce(excerpt, ""),
    "excerptEn": coalesce(excerptEn, ""),
    "excerptZhHant": coalesce(excerptZhHant, ""),
    "image": coverImage.asset->url,
    "editor": coalesce(editor, ""),
    "contentText": pt::text(content),
    "contentTextEn": pt::text(contentEn),
    "contentTextZhHant": pt::text(contentZhHant),
    "contentPortable": ${GROQ_CONTENT_PORTABLE},
    "contentPortableEn": ${groqPortableField("contentEn")},
    "contentPortableZhHant": ${groqPortableField("contentZhHant")}
  }`;
  const res = await sanityQuery(q, { id: rawId });
  if (!res || typeof res !== "object") return null;
  return mapSanityNewsRow(res, false);
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
export async function fetchSanitySupportMaintenance({ limit = 100, lite = false } = {}) {
  const portableExtra = lite
    ? ""
    : `,
    "contentPortable": ${GROQ_CONTENT_PORTABLE},
    "contentPortableEn": ${groqPortableField("contentEn")},
    "contentPortableZhHant": ${groqPortableField("contentZhHant")}`;
  const q = `*[_type == "supportMaintenance"] | order(coalesce(publishedAt, _createdAt) desc)[0...$limit]{
    "id": _id,
    "title": coalesce(title, ""),
    "titleEn": coalesce(titleEn, ""),
    "titleZhHant": coalesce(titleZhHant, ""),
    "category": select(
      category in ["consult", "recommended", "solutions"] => category,
      true => "consult"
    ),
    "publishedAt": coalesce(publishedAt, _createdAt),
    "bodyText": pt::text(content),
    "bodyTextEn": pt::text(contentEn),
    "bodyTextZhHant": pt::text(contentZhHant),
    "excerpt": coalesce(excerpt, ""),
    "excerptEn": coalesce(excerptEn, ""),
    "excerptZhHant": coalesce(excerptZhHant, ""),
    "editor": coalesce(editor, "")${portableExtra}
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
    const titleEn = String(row.titleEn || "").trim();
    const titleZhHant = String(row.titleZhHant || "").trim();
    const bodyText = row.bodyText;
    const paragraphs = splitPortableTextToParagraphs(bodyText);
    const paragraphsEn = splitPortableTextToParagraphs(row.bodyTextEn);
    const paragraphsZhHant = splitPortableTextToParagraphs(row.bodyTextZhHant);
    const excerptTrim = String(row.excerpt || "").trim();
    const excerptEnTrim = String(row.excerptEn || "").trim();
    const excerptZhHantTrim = String(row.excerptZhHant || "").trim();
    const cardDesc = excerptTrim || truncateSupportCardDesc(bodyText);
    const cardDescEn = excerptEnTrim || truncateSupportCardDesc(row.bodyTextEn);
    const cardDescZhHant = excerptZhHantTrim || truncateSupportCardDesc(row.bodyTextZhHant);
    const dateRaw = sanityDateToYmdChina(row.publishedAt) || "2026-01-01";
    const editorName = String(row.editor || "").trim() || "高阳金信";

    buckets[cat].push({
      listItem: {
        id,
        title,
        titleEn: titleEn || undefined,
        titleZhHant: titleZhHant || undefined,
        desc: cardDesc,
        descEn: cardDescEn || undefined,
        descZhHant: cardDescZhHant || undefined,
        detailId: id,
      },
      detailItem: {
        id,
        sectionId: cat,
        sectionTitle: SUPPORT_SECTION_ORDER.find((s) => s.id === cat)?.title || "",
        title,
        titleEn: titleEn || undefined,
        titleZhHant: titleZhHant || undefined,
        desc: excerptTrim || cardDesc,
        descEn: excerptEnTrim || cardDescEn,
        descZhHant: excerptZhHantTrim || cardDescZhHant,
        source: "高阳金信官网",
        editor: editorName,
        views: hashSupportViews(id),
        publishDate: dateRaw,
        image: SUPPORT_DETAIL_FALLBACK_IMAGES[0],
        content: paragraphs.length ? paragraphs : [cardDesc],
        contentEn: paragraphsEn.length ? paragraphsEn : null,
        contentZhHant: paragraphsZhHant.length ? paragraphsZhHant : null,
        contentPortable: lite ? null : Array.isArray(row.contentPortable) ? row.contentPortable : null,
        contentPortableEn: lite ? null : Array.isArray(row.contentPortableEn) ? row.contentPortableEn : null,
        contentPortableZhHant: lite ? null : Array.isArray(row.contentPortableZhHant) ? row.contentPortableZhHant : null,
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
    "titleEn": coalesce(titleEn, ""),
    "titleZhHant": coalesce(titleZhHant, ""),
    "type": jobType,
    "headcount": headcount,
    "location": workLocation,
    "degree": education,
    "publishedAt": publishedAt,
    "responsibilities": coalesce(responsibilities, []),
    "requirements": coalesce(requirements, []),
    "responsibilitiesEn": coalesce(responsibilitiesEn, []),
    "responsibilitiesZhHant": coalesce(responsibilitiesZhHant, []),
    "requirementsEn": coalesce(requirementsEn, []),
    "requirementsZhHant": coalesce(requirementsZhHant, []),
    "typeDisplayEn": coalesce(jobTypeDisplayEn, ""),
    "typeDisplayZhHant": coalesce(jobTypeDisplayZhHant, ""),
    "locationDisplayEn": coalesce(workLocationDisplayEn, ""),
    "locationDisplayZhHant": coalesce(workLocationDisplayZhHant, ""),
    "degreeDisplayEn": coalesce(educationDisplayEn, ""),
    "degreeDisplayZhHant": coalesce(educationDisplayZhHant, "")
  }`;
  const res = await sanityQuery(q, { limit });
  if (!Array.isArray(res) || res.length === 0) return null;
  return res.map((row) => ({
    id: String(row.id || ""),
    title: String(row.title || ""),
    titleEn: String(row.titleEn || "").trim() || undefined,
    titleZhHant: String(row.titleZhHant || "").trim() || undefined,
    type: String(row.type || ""),
    headcount: Number(row.headcount) || 1,
    location: String(row.location || ""),
    degree: String(row.degree || ""),
    publishDate: sanityDateToYmdChina(row.publishedAt) || "2026-01-01",
    responsibilities: Array.isArray(row.responsibilities)
      ? row.responsibilities.map((x) => String(x).trim()).filter(Boolean)
      : [],
    requirements: Array.isArray(row.requirements)
      ? row.requirements.map((x) => String(x).trim()).filter(Boolean)
      : [],
    responsibilitiesEn: Array.isArray(row.responsibilitiesEn)
      ? row.responsibilitiesEn.map((x) => String(x).trim()).filter(Boolean)
      : [],
    responsibilitiesZhHant: Array.isArray(row.responsibilitiesZhHant)
      ? row.responsibilitiesZhHant.map((x) => String(x).trim()).filter(Boolean)
      : [],
    requirementsEn: Array.isArray(row.requirementsEn)
      ? row.requirementsEn.map((x) => String(x).trim()).filter(Boolean)
      : [],
    requirementsZhHant: Array.isArray(row.requirementsZhHant)
      ? row.requirementsZhHant.map((x) => String(x).trim()).filter(Boolean)
      : [],
    typeDisplayEn: String(row.typeDisplayEn || "").trim() || undefined,
    typeDisplayZhHant: String(row.typeDisplayZhHant || "").trim() || undefined,
    locationDisplayEn: String(row.locationDisplayEn || "").trim() || undefined,
    locationDisplayZhHant: String(row.locationDisplayZhHant || "").trim() || undefined,
    degreeDisplayEn: String(row.degreeDisplayEn || "").trim() || undefined,
    degreeDisplayZhHant: String(row.degreeDisplayZhHant || "").trim() || undefined,
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
        introductionEn,
        introductionZhHant,
        "refs": supportItems[]->{
          _id,
          "title": coalesce(title, ""),
          "titleEn": coalesce(titleEn, ""),
          "titleZhHant": coalesce(titleZhHant, ""),
          "excerpt": coalesce(excerpt, ""),
          "excerptEn": coalesce(excerptEn, ""),
          "excerptZhHant": coalesce(excerptZhHant, ""),
          "bodyText": pt::text(content),
          "bodyTextEn": pt::text(contentEn),
          "bodyTextZhHant": pt::text(contentZhHant)
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

export async function fetchSanityPartnerCases({ limit = 50, lite = false } = {}) {
  const portableExtra = lite
    ? ""
    : `,
    "contentPortable": ${GROQ_CONTENT_PORTABLE},
    "contentPortableEn": ${groqPortableField("contentEn")},
    "contentPortableZhHant": ${groqPortableField("contentZhHant")}`;
  const q = `*[_type == "case"] | order(pinned desc, publishedAt desc)[0...$limit]{
    "id": _id,
    "title": coalesce(title, ""),
    "titleEn": coalesce(titleEn, ""),
    "titleZhHant": coalesce(titleZhHant, ""),
    "coverUrl": coverImage.asset->url,
    "firstBodyImageUrl": coalesce(
      content[_type == "image"][0].asset->url,
      content[_type == "embedImage"][0].url
    ),
    "publishedAt": publishedAt,
    "bodyText": pt::text(content),
    "bodyTextEn": pt::text(contentEn),
    "bodyTextZhHant": pt::text(contentZhHant),
    "excerpt": coalesce(excerpt, ""),
    "excerptEn": coalesce(excerptEn, ""),
    "excerptZhHant": coalesce(excerptZhHant, ""),
    "editor": coalesce(editor, "")${portableExtra}
  }`;
  const res = await sanityQuery(q, { limit });
  if (!Array.isArray(res)) return null;
  return res.map((it) => {
    const paragraphs = splitPortableTextToParagraphs(it?.bodyText);
    const paragraphsEn = splitPortableTextToParagraphs(it?.bodyTextEn);
    const paragraphsZhHant = splitPortableTextToParagraphs(it?.bodyTextZhHant);
    const teaserSource = paragraphs[0] || String(it?.bodyText || "").trim();
    const teaserEn = paragraphsEn[0] || String(it?.bodyTextEn || "").trim();
    const teaserZhHant = paragraphsZhHant[0] || String(it?.bodyTextZhHant || "").trim();
    const excerptTrim = String(it.excerpt || "").trim();
    const excerptEnTrim = String(it.excerptEn || "").trim();
    const excerptZhHantTrim = String(it.excerptZhHant || "").trim();
    const summary = truncateCaseCardSummary(excerptTrim || teaserSource);
    const summaryEn = truncateCaseCardSummary(excerptEnTrim || teaserEn);
    const summaryZhHant = truncateCaseCardSummary(excerptZhHantTrim || teaserZhHant);
    const image =
      (it?.coverUrl && String(it.coverUrl)) ||
      (it?.firstBodyImageUrl && String(it.firstBodyImageUrl)) ||
      caseDefaultCoverUrl();
    const editorName = String(it.editor || "").trim() || "高阳金信";
    const title = String(it.title || "").trim();
    const titleEn = String(it.titleEn || "").trim();
    const titleZhHant = String(it.titleZhHant || "").trim();
    return {
      id: it.id,
      title,
      titleEn: titleEn || undefined,
      titleZhHant: titleZhHant || undefined,
      summary,
      summaryEn: summaryEn || undefined,
      summaryZhHant: summaryZhHant || undefined,
      source: "典型案例",
      editor: editorName,
      views: 0,
      publishDate: sanityDateToYmdChina(it.publishedAt) || "2026-01-01",
      image,
      content: paragraphs,
      contentEn: paragraphsEn.length ? paragraphsEn : null,
      contentZhHant: paragraphsZhHant.length ? paragraphsZhHant : null,
      contentPortable: lite ? null : Array.isArray(it?.contentPortable) ? it.contentPortable : null,
      contentPortableEn: lite ? null : Array.isArray(it?.contentPortableEn) ? it.contentPortableEn : null,
      contentPortableZhHant: lite ? null : Array.isArray(it?.contentPortableZhHant) ? it.contentPortableZhHant : null,
      cmsContentOnly: true,
    };
  });
}

