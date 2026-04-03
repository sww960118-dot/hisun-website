import "./styles/tailwind.css";
import "./styles/tokens.css";
import { initCmsWindowSync, prefetchCmsData } from "./cms/bootstrapCms.js";

if (typeof history !== "undefined" && "scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

async function start() {
  initCmsWindowSync();
  /* 不阻塞首屏：后台拉 CMS，失败仍用默认数据；完成后 bumpCmsTick 各页会更新 */
  prefetchCmsData().catch(() => {});
  await import("./i18n.js");
  const { createApp } = await import("vue");
  const App = (await import("./App.vue")).default;
  const router = (await import("./router/index.js")).default;
  const app = createApp(App);
  app.use(router);
  app.mount("#app");
  router.isReady().then(() => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  });
}

start();
