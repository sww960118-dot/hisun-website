/**
 * 站点 CMS 默认配置。可在 index.html 或部署前注入 window.HISUN_CMS 覆盖。
 * 对接后台后通常设置 apiBase、bannersEndpoint。
 */
export const defaultHisunCms = {
  /** API 根路径，如 https://api.example.com */
  apiBase: "",
  bannersEndpoint: "/api/banners",
  /** 无接口时从此静态 JSON 拉取 Banner（构建产物在 public/data，可替换后重新部署） */
  staticBannersUrl: "/data/banners.json",
  articlesEndpoint: "/api/articles",
  casesEndpoint: "/api/cases",
  /** 悬浮二维码图片 URL，留空则使用占位图 */
  qrImageUrl: "",
};
