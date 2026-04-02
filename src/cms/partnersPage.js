/**
 * 合作伙伴页：Logo 行业筛选 + 典型案例（文案与配图为演示数据，可对接 CMS）
 */
import {
  buildPartnerLogoItems,
  buildPartnerLogosHomePreview,
} from "./partnersCatalog.js";

export const PARTNER_LOGO_ITEMS = buildPartnerLogoItems();
export const PARTNER_LOGOS_HOME_PREVIEW =
  buildPartnerLogosHomePreview(PARTNER_LOGO_ITEMS);
export const PARTNERS_CONTACT_EMAIL = "878754881@qq.com";

export const PARTNER_SECTOR_TABS = [
  { value: "all", labelKey: "partners_sector_all" },
  { value: "bank", labelKey: "partners_sector_bank" },
  { value: "insurance", labelKey: "partners_sector_insurance" },
  { value: "nonbank", labelKey: "partners_sector_nonbank" },
  { value: "other", labelKey: "partners_sector_other" },
];

const CASE_IMG =
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80";

const DEFAULT_PARTNER_CASE_ARTICLES = [
  {
    id: "fc-1",
    title: "高阳金信：核心业务能力",
    summary:
      "以分布式核心、渠道整合与数据智能为主线，为银行提供从咨询、实施到长期运维的一体化能力，支撑机构在数字化转型中保持韧性与增长。",
    source: "典型案例",
    editor: "高阳金信编辑部",
    views: 1054,
    publishDate: "2019-06-18",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80",
    content: [
      "作为头部国有银行核心系统升级项目，高阳金信全程参与新一代核心系统建设，覆盖方案设计、实施迁移与持续运营保障。",
      "项目围绕账户体系、交易处理、渠道协同与风控治理进行分阶段落地，确保复杂业务场景在迁移过程中平稳承接。",
      "上线后系统在高并发处理、跨境业务支撑与可观测运维方面表现稳定，为后续创新业务扩展提供统一底座。",
    ],
  },
  {
    id: "c1",
    title: "股份制银行核心系统建设",
    summary: "弹性架构与双活容灾，支撑日均亿级交易量。",
    source: "典型案例",
    editor: "高阳金信编辑部",
    views: 968,
    publishDate: "2019-11-05",
    image: CASE_IMG,
    content: [
      "项目采用分布式核心与同城双活架构，覆盖账务、清算与外围渠道系统，保障关键交易链路高可用。",
      "通过灰度切换和分批迁移策略，系统在不停机窗口内完成核心域替换，实现业务连续性。",
    ],
  },
  {
    id: "c2",
    title: "跨境支付与清算通道",
    summary: "多币种、多时区清算与合规报送一体化。",
    source: "典型案例",
    editor: "高阳金信编辑部",
    views: 884,
    publishDate: "2020-07-22",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80",
    content: [
      "针对跨境支付场景，建设统一清算编排平台，支持多币种、多时区和多渠道入账对账。",
      "平台内置合规规则与报送模板，显著缩短跨境业务上线周期并降低人工校对成本。",
    ],
  },
  {
    id: "c3",
    title: "数据治理与监管报送",
    summary: "统一指标口径与血缘追溯，缩短报送周期。",
    source: "典型案例",
    editor: "高阳金信编辑部",
    views: 812,
    publishDate: "2021-03-16",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80",
    content: [
      "项目构建指标口径中心、数据血缘追踪与质量稽核链路，实现监管口径统一管理。",
      "通过自动化校验规则，报送准备周期由周级缩短到日级，审计追溯效率显著提升。",
    ],
  },
  {
    id: "c4",
    title: "渠道中台与网点数字化",
    summary: "柜面、手机银行与开放接口一致体验。",
    source: "典型案例",
    editor: "高阳金信编辑部",
    views: 739,
    publishDate: "2022-01-09",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80",
    content: [
      "建设统一渠道中台后，网点、APP 与开放 API 服务能力实现共享复用。",
      "通过统一身份与交易编排，客户在多渠道切换时可保持一致业务状态与体验。",
    ],
  },
  {
    id: "c5",
    title: "财富管理与投顾平台",
    summary: "客户分层、产品货架与合规销售闭环。",
    source: "典型案例",
    editor: "高阳金信编辑部",
    views: 701,
    publishDate: "2023-05-27",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=80",
    content: [
      "围绕客户分层经营构建财富管理中台，实现策略触达、产品推荐与销售流程闭环。",
      "平台对接合规审查能力，销售过程可追溯、可回溯，满足监管审计要求。",
    ],
  },
  {
    id: "c6",
    title: "运维监控与可观测性",
    summary: "全链路追踪与智能告警，降低 MTTR。",
    source: "典型案例",
    editor: "高阳金信编辑部",
    views: 655,
    publishDate: "2024-02-14",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80",
    content: [
      "建设统一可观测平台，接入日志、指标、链路追踪与告警中心，实现问题快速定位。",
      "通过智能告警分级和自动化预案，关键系统故障平均恢复时长显著降低。",
    ],
  },
];

function normalizePartnerCase(item, index) {
  const fallbackDate = `2024-01-${String(index + 10).padStart(2, "0")}`;
  return {
    id: item.id || `case-${index + 1}`,
    title: item.title || `典型案例 ${index + 1}`,
    summary: item.summary || "",
    source: item.source || "典型案例",
    editor: item.editor || "高阳金信编辑部",
    views: Number(item.views) || 0,
    publishDate: item.publishDate || fallbackDate,
    image: item.image || CASE_IMG,
    content: Array.isArray(item.content) ? item.content : [],
  };
}

function resolvePartnerCases() {
  const cmsCases =
    typeof window !== "undefined" ? window.HISUN_CMS?.partnerCases : null;
  const raw = Array.isArray(cmsCases) && cmsCases.length ? cmsCases : DEFAULT_PARTNER_CASE_ARTICLES;
  return raw.map(normalizePartnerCase);
}

/** 典型案例主数据源（后续可由后端注入 window.HISUN_CMS.partnerCases 维护） */
export const PARTNER_CASE_ARTICLES = resolvePartnerCases();
/** 首条作为头条宽卡 */
export const PARTNER_FEATURED_CASE = PARTNER_CASE_ARTICLES[0];
/** 其余作为列表卡片 */
export const PARTNER_CASE_CARDS = PARTNER_CASE_ARTICLES.slice(1);
