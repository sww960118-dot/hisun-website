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
    "category": "notice",
    "date": coalesce(string(publishedAt)[0..9], ""),
    "views": 0,
    "title": coalesce(title, ""),
    "desc": coalesce(excerpt, ""),
    "image": coalesce(coverImage.asset->url, ""),
    "contentText": pt::text(content)
  }`;
  const res = await sanityQuery(q, { limit });
  if (!Array.isArray(res)) return null;
  return res.map((it) => ({
    ...it,
    content: splitPortableTextToParagraphs(it?.contentText),
  }));
}

export async function fetchSanityPartnerCases({ limit = 50 } = {}) {
  const q = `*[_type == "case"] | order(pinned desc, publishedAt desc)[0...$limit]{
    "id": _id,
    "title": coalesce(title, ""),
    "summary": coalesce(excerpt, ""),
    "source": "典型案例",
    "editor": "高阳金信编辑部",
    "views": 0,
    "publishDate": coalesce(string(publishedAt)[0..9], ""),
    "image": coalesce(coverImage.asset->url, ""),
    "contentText": pt::text(content)
  }`;
  const res = await sanityQuery(q, { limit });
  if (!Array.isArray(res)) return null;
  return res.map((it) => ({
    ...it,
    content: splitPortableTextToParagraphs(it?.contentText),
  }));
}

