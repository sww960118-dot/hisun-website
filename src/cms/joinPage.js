const line = (s) => String(s || "").trim();

const DEFAULT_JOIN_JOBS = [
  {
    id: "job-1",
    title: "销售助理",
    headcount: 2,
    location: "深圳",
    degree: "大专及以上",
    publishDate: "2025-08-12",
    type: "业务员",
    responsibilities: [
      "协助销售团队完成客户跟进、资料整理与合同流程配合。",
      "维护客户信息与商机记录，支持销售数据分析与报表输出。",
    ],
    requirements: ["大专及以上学历，专业不限。", "沟通表达清晰，熟练使用办公软件。"],
  },
  {
    id: "job-2",
    title: "大客户销售经理",
    headcount: 1,
    location: "深圳",
    degree: "本科及以上",
    publishDate: "2025-08-12",
    type: "业务员",
    responsibilities: [
      "负责重点行业大客户的拓展、方案沟通与商务推进。",
      "协调售前与交付资源，推动项目立项、招投标与回款。",
    ],
    requirements: ["本科及以上学历，有金融或软件行业销售经验优先。", "具备独立打单与团队协作能力。"],
  },
  {
    id: "job-3",
    title: "Java开发工程师",
    headcount: 3,
    location: "深圳",
    degree: "本科及以上",
    publishDate: "2025-08-12",
    type: "开发工程师",
    responsibilities: [
      "参与核心业务系统的设计、编码、联调与上线支持。",
      "编写单元测试与技术文档，持续优化性能与可维护性。",
    ],
    requirements: ["本科及以上学历，计算机相关专业。", "熟悉 Java、Spring 生态与常用中间件。"],
  },
  {
    id: "job-4",
    title: "Java开发工程师",
    headcount: 1,
    location: "深圳",
    degree: "本科及以上",
    publishDate: "2025-08-12",
    type: "开发工程师",
    responsibilities: ["参与银行核心或外围系统模块开发与维护。", "配合测试与运维完成缺陷修复与版本发布。"],
    requirements: ["本科及以上学历。", "有银行或支付相关项目经验者优先。"],
  },
  {
    id: "job-5",
    title: "Java开发工程师",
    headcount: 3,
    location: "济南",
    degree: "本科及以上",
    publishDate: "2025-08-12",
    type: "开发工程师",
    responsibilities: ["承担需求分析后的功能实现与代码评审。", "参与技术方案讨论与线上问题排查。"],
    requirements: ["本科及以上学历。", "学习能力强，能接受阶段性出差。"],
  },
  {
    id: "job-6",
    title: "前端开发工程师",
    headcount: 3,
    location: "济南",
    degree: "本科及以上",
    publishDate: "2025-08-12",
    type: "开发工程师",
    responsibilities: [
      "负责 Web 前端页面与组件开发，保障多端兼容与交互体验。",
      "与后端、设计协作完成接口联调与性能优化。",
    ],
    requirements: ["本科及以上学历。", "熟悉 Vue/React 之一与现代前端工程化。"],
  },
  {
    id: "job-7",
    title: "测试工程师",
    headcount: 3,
    location: "济南",
    degree: "本科及以上",
    publishDate: "2025-08-12",
    type: "测试工程师",
    responsibilities: ["编写与执行测试用例，跟踪缺陷闭环。", "参与自动化测试与发布前质量把关。"],
    requirements: ["本科及以上学历。", "熟悉接口测试与基本 SQL，有金融项目经验优先。"],
  },
];

function defaultJobDetail(title, degree) {
  return {
    responsibilities: [
      "客户需求沟通与项目协同，推动需求分析、实施交付与反馈闭环。",
      "参与流程优化与文档沉淀，保障项目执行效率与服务质量。",
      "协同相关团队推进重点事项，持续提升客户满意度与业务价值。",
    ],
    requirements: [
      `学历与专业：${degree}。`,
      "具备良好的沟通表达与跨团队协作能力，责任心强，执行力好。",
      `有 ${title} 或金融科技相关经验者优先。`,
    ],
  };
}

function normalizeJob(job, idx) {
  const defaults = defaultJobDetail(job.title || "招聘岗位", job.degree || "本科及以上");
  const resp = Array.isArray(job.responsibilities) ? job.responsibilities.map(line).filter(Boolean) : [];
  const req = Array.isArray(job.requirements) ? job.requirements.map(line).filter(Boolean) : [];
  return {
    id: job.id || `job-${idx + 1}`,
    title: job.title || "招聘岗位",
    headcount: Number(job.headcount) || 1,
    location: job.location || "深圳",
    degree: job.degree || "本科及以上",
    publishDate: job.publishDate || "2025-08-12",
    type: job.type || "其他",
    responsibilities: resp.length ? resp : defaults.responsibilities,
    requirements: req.length ? req : defaults.requirements,
  };
}

function resolveJobs() {
  const jobs = typeof window !== "undefined" ? window.HISUN_CMS?.joinJobs : null;
  const raw = Array.isArray(jobs) && jobs.length ? jobs : DEFAULT_JOIN_JOBS;
  return raw.map(normalizeJob);
}

export function getJoinJobs() {
  return resolveJobs();
}
