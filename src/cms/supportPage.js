const DEFAULT_SUPPORT_SECTIONS = [
  {
    id: "consult",
    title: "咨询与服务",
    items: [
      { id: "consult-1", title: "企业服务转型", desc: "围绕组织能力、流程治理与平台化交付，提供面向金融机构的服务转型咨询与实施支持。", detailId: "consult-1" },
      { id: "consult-2", title: "业务流程服务", desc: "聚焦关键业务流程梳理与优化，沉淀标准作业模型，提升跨团队协作效率与交付质量。", detailId: "consult-2" },
      { id: "consult-3", title: "人力外包服务", desc: "提供具备金融行业经验的研发与实施团队，支持项目快速启动、平稳扩容与持续运营。", detailId: "consult-3" },
      { id: "consult-4", title: "IT架构设计服务", desc: "基于现状评估与目标架构规划，形成兼顾稳定性、扩展性与成本效率的技术路线。", detailId: "consult-4" },
      { id: "consult-5", title: "运营和维护服务", desc: "建设一体化运维体系，覆盖监控告警、变更发布、故障处理与服务质量持续改进。", detailId: "consult-5" },
      { id: "consult-6", title: "需求分析服务", desc: "通过需求访谈、业务建模与优先级治理，确保方案设计与业务目标保持一致。", detailId: "consult-6" },
      { id: "consult-7", title: "项目管理服务", desc: "采用里程碑与风险双线管理机制，强化跨组织协同，保障项目节点可控可追踪。", detailId: "consult-7" },
      { id: "consult-8", title: "IT规划咨询服务", desc: "结合业务战略制定中长期 IT 发展规划，明确建设路径、投资重点与治理机制。", detailId: "consult-8" },
    ],
  },
  {
    id: "recommended",
    title: "主营业务推荐",
    items: [
      { id: "biz-1", title: "分布式核心系统", desc: "支持高并发交易与多中心部署，满足核心账务处理与连续性要求。", detailId: "biz-1" },
      { id: "biz-2", title: "海外财富管理系统", desc: "覆盖产品管理、客户分层与合规销售流程，支持跨区域业务拓展。", detailId: "biz-2" },
      { id: "biz-3", title: "高阳智付产品", desc: "面向支付与清算场景提供统一能力底座，提升接入效率与稳定性。", detailId: "biz-3" },
      { id: "biz-4", title: "额度及押品管理系统", desc: "实现授信额度、押品估值与风险监测一体化管理，支撑精细化风控。", detailId: "biz-4" },
    ],
  },
  {
    id: "solutions",
    title: "解决方案",
    items: [
      { id: "sol-1", title: "外资入华方案", desc: "针对外资机构本地化经营需求，提供系统适配、监管合规与运营支撑整体方案。", detailId: "sol-1" },
      { id: "sol-2", title: "全栈的加密货币钱包解决方案", desc: "覆盖资产托管、钱包服务、风控与运营管理，支持高可用与安全审计要求。", detailId: "sol-2" },
      { id: "sol-3", title: "核心下移工艺", desc: "通过分阶段迁移与灰度切换策略，实现核心能力下沉与业务平滑过渡。", detailId: "sol-3" },
    ],
  },
];

function normalizeItem(item, sectionId, index) {
  return {
    id: item.id || `${sectionId}-${index + 1}`,
    title: item.title || `服务项 ${index + 1}`,
    desc: item.desc || "",
    detailId: item.detailId || item.id || `${sectionId}-${index + 1}`,
  };
}

function normalizeSection(section, idx) {
  const sid = section.id || `section-${idx + 1}`;
  const items = Array.isArray(section.items) ? section.items : [];
  return {
    id: sid,
    title: section.title || `分组 ${idx + 1}`,
    items: items.map((it, i) => normalizeItem(it, sid, i)),
  };
}

function resolveSupportSections() {
  const cms =
    typeof window !== "undefined" ? window.HISUN_CMS?.supportSections : null;
  const raw = Array.isArray(cms) && cms.length ? cms : DEFAULT_SUPPORT_SECTIONS;
  return raw.map(normalizeSection);
}

export const SUPPORT_SECTIONS = resolveSupportSections();

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

function buildSupportDetailItems(sections) {
  const out = [];
  let gi = 0;
  for (const sec of sections) {
    for (const item of sec.items) {
      const id = item.detailId;
      out.push({
        id,
        sectionId: sec.id,
        sectionTitle: sec.title,
        title: item.title,
        desc: item.desc,
        source: "高阳金信官网",
        editor: "服务支持编辑部",
        views: hashSupportViews(id),
        publishDate: "2025-08-12",
        image: SUPPORT_DETAIL_FALLBACK_IMAGES[gi % SUPPORT_DETAIL_FALLBACK_IMAGES.length],
        content: [
          `本服务项属于「${sec.title}」范畴，可与高阳金信其它咨询与实施能力组合落地，兼顾短期见效与中长期架构演进。`,
          "如需服务目录、交付清单或行业案例，请通过官网咨询入口预约顾问沟通，我们将根据机构现状给出路径建议。",
        ],
      });
      gi += 1;
    }
  }
  return out;
}

function normalizeSupportDetailRecord(x) {
  return {
    id: String(x.id || ""),
    sectionId: String(x.sectionId || "consult"),
    sectionTitle: String(x.sectionTitle || ""),
    title: String(x.title || ""),
    desc: String(x.desc || ""),
    source: String(x.source || "高阳金信官网"),
    editor: String(x.editor || "服务支持编辑部"),
    views: Number(x.views) || 0,
    publishDate: String(x.publishDate || "2025-08-12"),
    image: String(x.image || SUPPORT_DETAIL_FALLBACK_IMAGES[0]),
    content: Array.isArray(x.content) ? x.content.map((p) => String(p)) : [],
    contentPortable: Array.isArray(x.contentPortable) ? x.contentPortable : null,
  };
}

function resolveSupportDetailItems() {
  const cms = typeof window !== "undefined" ? window.HISUN_CMS?.supportDetails : null;
  if (Array.isArray(cms) && cms.length) return cms.map(normalizeSupportDetailRecord);
  return buildSupportDetailItems(SUPPORT_SECTIONS);
}

/** 服务支持「了解详情」页数据源，可由 window.HISUN_CMS.supportDetails 覆盖 */
export const SUPPORT_DETAIL_ITEMS = resolveSupportDetailItems();
