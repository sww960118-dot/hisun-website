const DEFAULT_JOIN_JOBS = [
  { id: "job-1", title: "销售助理", headcount: 2, location: "深圳", degree: "本科及以上学历", publishDate: "2025-08-12", type: "社招" },
  { id: "job-2", title: "大客户销售经理", headcount: 1, location: "深圳", degree: "大专及以上学历", publishDate: "2025-08-12", type: "社招" },
  { id: "job-3", title: "Java开发工程师", headcount: 3, location: "深圳", degree: "本科及以上学历", publishDate: "2025-08-12", type: "社招" },
  { id: "job-4", title: "Java开发工程师", headcount: 1, location: "深圳", degree: "本科及以上学历", publishDate: "2025-08-12", type: "校招" },
  { id: "job-5", title: "Java开发工程师", headcount: 3, location: "济南", degree: "本科及以上学历", publishDate: "2025-08-12", type: "社招" },
  { id: "job-6", title: "前端开发工程师", headcount: 3, location: "济南", degree: "本科及以上学历", publishDate: "2025-08-12", type: "社招" },
  { id: "job-7", title: "测试工程师", headcount: 3, location: "济南", degree: "本科及以上学历", publishDate: "2025-08-12", type: "社招" },
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
  const details = defaultJobDetail(job.title || "招聘岗位", job.degree || "本科及以上学历");
  return {
    id: job.id || `job-${idx + 1}`,
    title: job.title || "招聘岗位",
    headcount: Number(job.headcount) || 1,
    location: job.location || "深圳",
    degree: job.degree || "本科及以上学历",
    publishDate: job.publishDate || "2025-08-12",
    type: job.type || "社招",
    responsibilities: Array.isArray(job.responsibilities) && job.responsibilities.length ? job.responsibilities : details.responsibilities,
    requirements: Array.isArray(job.requirements) && job.requirements.length ? job.requirements : details.requirements,
  };
}

function resolveJobs() {
  const jobs = typeof window !== "undefined" ? window.HISUN_CMS?.joinJobs : null;
  const raw = Array.isArray(jobs) && jobs.length ? jobs : DEFAULT_JOIN_JOBS;
  return raw.map(normalizeJob);
}

export const JOIN_JOBS = resolveJobs();
