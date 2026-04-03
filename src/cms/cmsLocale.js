/**
 * CMS（Sanity）多语言：后台可填 titleEn / titleZhHant 等；未填时回退到简体字段。
 * 与 MainLayout provide 的 hisunLang（zh | en | zh-hant）对齐。
 */

export function cmsPickStr(zh, en, zhHant, lang) {
  const z = String(zh ?? "").trim();
  const e = String(en ?? "").trim();
  const h = String(zhHant ?? "").trim();
  if (lang === "en" && e) return e;
  if (lang === "zh-hant" && h) return h;
  return z;
}

export function cmsPickParagraphs(zhArr, enArr, zhHantArr, lang) {
  const pick = (arr) => (Array.isArray(arr) ? arr.map((x) => String(x).trim()).filter(Boolean) : []);
  const z = pick(zhArr);
  const e = pick(enArr);
  const h = pick(zhHantArr);
  if (lang === "en" && e.length) return e;
  if (lang === "zh-hant" && h.length) return h;
  return z;
}

export function cmsPickPortable(zhP, enP, zhHantP, lang) {
  if (lang === "en" && Array.isArray(enP) && enP.length) return enP;
  if (lang === "zh-hant" && Array.isArray(zhHantP) && zhHantP.length) return zhHantP;
  return Array.isArray(zhP) && zhP.length ? zhP : null;
}
