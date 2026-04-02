import fs from "fs";

const p = new URL("../../index.html", import.meta.url);
const s = fs.readFileSync(p, "utf8");

const i2 = s.indexOf("window.HISUN_CMS = window.HISUN_CMS");
const block = s.slice(s.indexOf("const I18N = {"), i2).trim();
const i18n = block.replace(/^const I18N = /, "export const I18N = ");

const cmsEnd = s.indexOf("var DEFAULT_BANNERS = [");
let cms = s.slice(i2, cmsEnd).trim();
cms = cms.replace(
  "window.HISUN_CMS = window.HISUN_CMS ||",
  "export const defaultHisunCms ="
);

const dbStart = cmsEnd;
const db2 = s.indexOf("function normalizeBanner");
const db = s.slice(dbStart, db2).replace("var DEFAULT_BANNERS", "export const DEFAULT_BANNERS");

const rest = s.slice(db2);
const fnEnd = rest.indexOf("async function loadBanners");
const norm = rest.slice(0, fnEnd).replace("function normalizeBanner", "export function normalizeBanner");

const load = rest.slice(fnEnd);
const loadEnd = load.indexOf("var bannerSlides");
const loadOnly = load.slice(0, loadEnd).trim().replace(
  "export async function loadBanners",
  "export async function loadBanners"
);

let loadFixed = loadOnly.replace(
  /window\.HISUN_CMS/g,
  "(typeof window !== \"undefined\" && window.HISUN_CMS) || defaultHisunCms"
);

const out = `${i18n}

if (typeof window !== "undefined") {
  window.HISUN_CMS = window.HISUN_CMS || defaultHisunCms;
}

${cms}

${db}

${norm}

${loadFixed}
`;

const outPath = new URL("../src/i18n.js", import.meta.url);
fs.writeFileSync(outPath, out, "utf8");
console.log("wrote", outPath.pathname, out.length);
