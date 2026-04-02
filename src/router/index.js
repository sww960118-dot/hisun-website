import { nextTick } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "../layouts/MainLayout.vue";

function hardScrollToTop() {
  if (typeof document === "undefined") return;
  const { documentElement: root, body } = document;
  root.scrollTop = 0;
  root.scrollLeft = 0;
  if (body) {
    body.scrollTop = 0;
    body.scrollLeft = 0;
  }
}

/**
 * 主营业务页左侧方案 Tab 仅改 ?tab= 且目标无 hash 时，保持当前滚动位置。
 * 顶栏子菜单带 #biz-solutions 时需滚到「主营业务」模块首屏，故 to.hash 非空时不视为「仅改 tab」。
 */
function isBusinessTabQueryOnlyChange(to, from) {
  if (to.name !== "business" || from.name !== "business") return false;
  if (to.path !== from.path) return false;
  if (String(to.hash ?? "").length > 0) return false;
  if (String(to.query.tab ?? "") === String(from.query.tab ?? "")) return false;
  const keys = new Set([...Object.keys(to.query), ...Object.keys(from.query)]);
  for (const k of keys) {
    if (k === "tab") continue;
    if (String(to.query[k] ?? "") !== String(from.query[k] ?? "")) return false;
  }
  return true;
}

/** 新闻列表页仅切换 ?category=（或「全部」去掉 category）时保持滚动位置，避免回到首屏 */
function isNewsCategoryQueryOnlyChange(to, from) {
  if (to.name !== "news" || from.name !== "news") return false;
  if (to.path !== from.path) return false;
  const keys = new Set([...Object.keys(to.query), ...Object.keys(from.query)]);
  for (const k of keys) {
    if (k === "category") continue;
    if (String(to.query[k] ?? "") !== String(from.query[k] ?? "")) return false;
  }
  return true;
}

/** 合作伙伴页仅切换 ?sector= 时保持滚动位置 */
function isPartnersSectorQueryOnlyChange(to, from) {
  if (to.name !== "partners" || from.name !== "partners") return false;
  if (to.path !== from.path) return false;
  if (String(to.hash ?? "").length > 0) return false;
  if (String(to.query.sector ?? "") === String(from.query.sector ?? "")) return false;
  const keys = new Set([...Object.keys(to.query), ...Object.keys(from.query)]);
  for (const k of keys) {
    if (k === "sector") continue;
    if (String(to.query[k] ?? "") !== String(from.query[k] ?? "")) return false;
  }
  return true;
}

/** 解决方案页仅切换 ?tab= 时保持滚动位置 */
function isBusinessSolutionsTabQueryOnlyChange(to, from) {
  if (to.name !== "business-solutions" || from.name !== "business-solutions") return false;
  if (to.path !== from.path) return false;
  if (String(to.query.tab ?? "") === String(from.query.tab ?? "")) return false;
  const keys = new Set([...Object.keys(to.query), ...Object.keys(from.query)]);
  for (const k of keys) {
    if (k === "tab") continue;
    if (String(to.query[k] ?? "") !== String(from.query[k] ?? "")) return false;
  }
  return true;
}

function shouldPreserveScroll(to, from) {
  return (
    isBusinessTabQueryOnlyChange(to, from) ||
    isBusinessSolutionsTabQueryOnlyChange(to, from) ||
    isNewsCategoryQueryOnlyChange(to, from) ||
    isPartnersSectorQueryOnlyChange(to, from)
  );
}

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from) {
    if (shouldPreserveScroll(to, from)) return false;
    if (to.hash) {
      return { el: to.hash, behavior: "auto" };
    }
    return { top: 0, left: 0, behavior: "auto" };
  },
  routes: [
    {
      path: "/",
      component: MainLayout,
      children: [
        { path: "", name: "home", component: () => import("../views/HomeView.vue") },
        { path: "about", name: "about", component: () => import("../views/AboutView.vue") },
        { path: "about/contact", name: "about-contact", component: () => import("../views/AboutContactView.vue") },
        { path: "business", name: "business", component: () => import("../views/BusinessView.vue") },
        {
          path: "business/solutions",
          name: "business-solutions",
          component: () => import("../views/BusinessSolutionsView.vue"),
        },
        {
          path: "business/solution-detail",
          name: "solution-detail",
          component: () => import("../views/SolutionDetailView.vue"),
        },
        { path: "support", name: "support", component: () => import("../views/SupportView.vue") },
        { path: "join", name: "join", component: () => import("../views/JoinView.vue") },
        { path: "partners", name: "partners", component: () => import("../views/PartnersView.vue") },
        {
          path: "partners/case-detail",
          name: "partners-case-detail",
          component: () => import("../views/PartnerCaseDetailView.vue"),
        },
        { path: "news", name: "news", component: () => import("../views/NewsListView.vue") },
        {
          path: "news/detail",
          name: "news-detail",
          component: () => import("../views/NewsDetailView.vue"),
        },
        {
          path: "service-detail",
          name: "service-detail",
          component: () => import("../views/ServiceDetailView.vue"),
        },
        {
          path: "library",
          name: "library",
          component: () => import("../pages/ComponentLibrary.vue"),
        },
      ],
    },
  ],
});

// 与 scrollBehavior 双保险：直接改 scrollTop；部分仅改 query 的导航保持阅读位置
router.afterEach((to, from) => {
  if (shouldPreserveScroll(to, from)) return;
  // 带锚点的导航由 scrollBehavior 定位，避免此处把页面拉回顶部
  if (String(to.hash ?? "").length > 0) return;
  hardScrollToTop();
  nextTick(() => {
    hardScrollToTop();
    requestAnimationFrame(hardScrollToTop);
  });
});

export default router;
