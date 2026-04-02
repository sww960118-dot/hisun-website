import { ref, computed, watch, nextTick, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { I18N } from "../i18n.js";

export function useSiteShell() {
  const route = useRoute();
  const lang = ref(
    typeof localStorage !== "undefined" ? localStorage.getItem("hisun_lang") || "zh" : "zh"
  );
  const mobileNavOpen = ref(false);
  const fabQrOpen = ref(false);

  let revealObserver = null;
  let parallaxCleanup = null;

  const fabQrSrc = computed(() => {
    const cms = typeof window !== "undefined" && window.HISUN_CMS;
    if (cms && cms.qrImageUrl) return cms.qrImageUrl;
    return "https://dummyimage.com/160x160/ffffff/1f2937&text=QR";
  });

  function t(key) {
    const row = I18N[key];
    if (!row) return "";
    return row[lang.value] || row.zh;
  }

  function applyI18n() {
    document.documentElement.lang =
      lang.value === "en" ? "en" : lang.value === "zh-hant" ? "zh-Hant" : "zh-Hans";
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const k = el.getAttribute("data-i18n");
      if (k) el.textContent = t(k);
    });
    try {
      localStorage.setItem("hisun_lang", lang.value);
    } catch {
      /* ignore */
    }
  }

  watch(lang, () => nextTick(() => applyI18n()));

  function initTheme() {
    try {
      let dark = localStorage.getItem("hisun_theme") === "dark";
      if (!localStorage.getItem("hisun_theme")) {
        dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      }
      document.documentElement.classList.toggle("dark", dark);
    } catch {
      /* ignore */
    }
  }

  function toggleTheme() {
    const d = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", d);
    try {
      localStorage.setItem("hisun_theme", d ? "dark" : "light");
    } catch {
      /* ignore */
    }
  }

  function setLang(l) {
    lang.value = l;
  }

  function toggleFabQr() {
    fabQrOpen.value = !fabQrOpen.value;
  }
  function setFabQr(open) {
    fabQrOpen.value = open;
  }

  function onDocClick() {
    fabQrOpen.value = false;
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleMobAcc(e) {
    const btn = e.currentTarget;
    const acc = btn.closest(".mobile-acc");
    if (!acc) return;
    const panel = acc.querySelector(".mob-panel");
    const chev = btn.querySelector(".mob-chev");
    panel.classList.toggle("hidden");
    const expanded = !panel.classList.contains("hidden");
    if (chev) chev.classList.toggle("rotate-180", expanded);
  }

  function closeMobileNav() {
    mobileNavOpen.value = false;
  }

  function bindNavPlaceholders() {
    document.querySelectorAll(".nav-dd button.sub-link, .mob-panel button.sub-link").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        mobileNavOpen.value = false;
      });
    });
  }

  /** 首屏/路由切换后：已进入视口的元素补一次 is-in（IO 偶发晚于首帧） */
  function flushRevealInViewport() {
    try {
      if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      document.querySelectorAll(".reveal").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        const inView = r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw;
        if (inView) el.classList.add("is-in");
      });
    } catch {
      /* ignore */
    }
  }

  function setupReveal() {
    revealObserver?.disconnect();

    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    revealObserver = new IntersectionObserver(
      (entries) => {
        const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
        entries.forEach((e) => {
          if (reduced) {
            if (e.isIntersecting) e.target.classList.add("is-in");
            return;
          }
          if (e.isIntersecting) e.target.classList.add("is-in");
          else e.target.classList.remove("is-in");
        });
      },
      { rootMargin: "0px 0px 0px 0px", threshold: 0.08 }
    );

    document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

    if (reducedMotion) {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-in"));
    } else {
      requestAnimationFrame(() => {
        requestAnimationFrame(flushRevealInViewport);
      });
    }
  }

  function setupParallaxBlobs() {
    try {
      const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
      if (reduced) return () => {};

      let rafId = null;
      const root = document.documentElement;

      const update = () => {
        rafId = null;
        root.style.setProperty("--hs-parallaxY", `${window.scrollY || 0}px`);
      };

      const onScroll = () => {
        if (rafId != null) return;
        rafId = window.requestAnimationFrame(update);
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      update();

      return () => {
        window.removeEventListener("scroll", onScroll);
        if (rafId != null) window.cancelAnimationFrame(rafId);
      };
    } catch {
      return () => {};
    }
  }

  onMounted(() => {
    initTheme();
    document.addEventListener("click", onDocClick);
    nextTick(() => {
      applyI18n();
      bindNavPlaceholders();
      setupReveal();
      parallaxCleanup = setupParallaxBlobs();
    });
  });

  watch(
    () => route.fullPath,
    () => {
      mobileNavOpen.value = false;
      try {
        document.activeElement?.blur?.();
      } catch {
        /* ignore */
      }
      nextTick(() => {
        applyI18n();
        setupReveal();
      });
    }
  );

  onUnmounted(() => {
    document.removeEventListener("click", onDocClick);
    revealObserver?.disconnect();
    parallaxCleanup?.();
  });

  return {
    route,
    lang,
    mobileNavOpen,
    fabQrOpen,
    fabQrSrc,
    applyI18n,
    toggleTheme,
    setLang,
    toggleFabQr,
    setFabQr,
    scrollToTop,
    toggleMobAcc,
    closeMobileNav,
  };
}
