<template>
  <main id="top" class="relative z-[1]">
    <PageHeroBanner
      title-key="nav_join"
      desc-key="partners_page_banner_desc"
      title-fallback="加入高阳"
      image-url="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1920&q=80"
    >
      <template #breadcrumbs>
        <ol class="flex flex-wrap items-center gap-x-1.5">
          <li><RouterLink to="/" class="text-white/80 transition hover:text-white" data-i18n="crumb_home">首页</RouterLink></li>
          <li class="text-white/45" aria-hidden="true">›</li>
          <li class="text-white/95" aria-current="page" data-i18n="sub_j_1">人才招聘</li>
        </ol>
      </template>
    </PageHeroBanner>

    <section id="join-jobs" class="scroll-mt-28 border-b border-zinc-200/90 bg-zinc-100/70 py-14 dark:border-zinc-800 dark:bg-[#0f1219] sm:py-20">
      <div class="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div class="reveal">
          <h2 class="hs-text-page-h2 text-[#1f2937] dark:text-white">人才招聘</h2>
          <div class="hs-heading-rule mt-4" aria-hidden="true"></div>
        </div>

        <div class="join-filters reveal mt-10 rounded-xl border border-zinc-200 bg-white/90 p-4 shadow-sm dark:border-zinc-700 dark:bg-[#0f172a]/90 sm:p-5">
          <div class="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end">
            <div class="join-filter-field w-full min-w-0 sm:w-auto sm:min-w-[168px]">
              <span class="join-filter-label mb-1 block text-left text-[13px] font-medium text-zinc-600 dark:text-zinc-400">工作类型</span>
              <UiSelect v-model="selectedType" placeholder="全部" :options="jobTypeFilterOptions" />
            </div>
            <div class="join-filter-field w-full min-w-0 sm:w-auto sm:min-w-[168px]">
              <span class="join-filter-label mb-1 block text-left text-[13px] font-medium text-zinc-600 dark:text-zinc-400">学历</span>
              <UiSelect v-model="selectedDegree" placeholder="全部" :options="degreeFilterOptions" />
            </div>
            <div class="join-filter-field w-full min-w-0 sm:w-auto sm:min-w-[168px]">
              <span class="join-filter-label mb-1 block text-left text-[13px] font-medium text-zinc-600 dark:text-zinc-400">工作地点</span>
              <UiSelect v-model="selectedLocation" placeholder="全部" :options="locationFilterOptions" />
            </div>
            <div class="w-full min-w-0 flex-1 lg:min-w-[240px] lg:max-w-[360px] lg:pt-[17px]">
              <UiSearchField
                v-model="keyword"
                placeholder="搜索岗位名称"
                :force-glow="isSearchGlow"
                :show-empty-state="showEmptyResult"
                empty-text="暂无匹配岗位，请更换关键词或筛选条件"
                @search="pulseSearchGlow"
              />
            </div>
            <p class="text-[14px] leading-snug text-zinc-600 dark:text-zinc-300 lg:max-w-[280px] lg:shrink-0 lg:pt-[17px]">
              人力资源部电子邮箱地址：bihr@hisuntech.com
            </p>
          </div>
        </div>

        <!-- 岗位列表随筛选动态增删节点：勿用全局 .reveal，否则 IO 不会重新 observe，新节点会一直保持 opacity:0 -->
        <div class="join-job-list mt-4 space-y-3">
          <section v-for="job in filteredJobs" :key="job.id" class="job-card">
            <header
              class="job-card__head"
              :class="{ 'is-expanded': expandedJobId === job.id }"
              role="button"
              tabindex="0"
              :aria-expanded="expandedJobId === job.id ? 'true' : 'false'"
              @click="toggleJobDetail(job.id)"
              @keydown.enter.prevent="toggleJobDetail(job.id)"
              @keydown.space.prevent="toggleJobDetail(job.id)"
            >
              <h3 class="job-card__title">{{ job.title }}</h3>
              <p class="job-card__meta">招聘人数：{{ job.headcount }}</p>
              <p class="job-card__meta">工作地点：{{ job.location }}</p>
              <p class="job-card__meta">学历要求：{{ job.degree }}</p>
              <p class="job-card__meta">发布时间：{{ job.publishDate }}</p>
              <button
                type="button"
                class="job-card__toggle"
                :aria-label="expandedJobId === job.id ? '收起岗位详情' : '展开岗位详情'"
                @click.stop="toggleJobDetail(job.id)"
              >
                <span class="job-card__toggle-icon" :class="{ 'is-open': expandedJobId === job.id }">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </button>
            </header>

            <div v-if="expandedJobId === job.id" class="job-card__detail">
              <h4 class="job-card__detail-title">{{ job.title }}</h4>
              <div class="job-card__detail-block">
                <h5 class="job-card__detail-subtitle">岗位职责</h5>
                <ol class="job-card__detail-list">
                  <li v-for="(item, i) in job.responsibilities" :key="`${job.id}-r-${i}`">{{ item }}</li>
                </ol>
              </div>
              <div class="job-card__detail-block">
                <h5 class="job-card__detail-subtitle">任职要求</h5>
                <ol class="job-card__detail-list">
                  <li v-for="(item, i) in job.requirements" :key="`${job.id}-q-${i}`">{{ item }}</li>
                </ol>
              </div>
              <button type="button" class="job-card__apply" @click="applyJob(job)">立即申请</button>
            </div>
          </section>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import PageHeroBanner from "../components/PageHeroBanner.vue";
import { UiSearchField, UiSelect } from "../components";
import { cmsTick } from "../cms/cmsTick.js";
import { getJoinJobs } from "../cms/joinPage.js";

const jobs = computed(() => {
  cmsTick.value;
  return getJoinJobs();
});
const keyword = ref("");
const selectedType = ref("");
const selectedDegree = ref("");
const selectedLocation = ref("");
const isSearchGlow = ref(false);
const expandedJobId = ref("");

const ALL_OPT = { label: "全部", value: "" };

const jobTypeFilterOptions = [
  ALL_OPT,
  { label: "开发工程师", value: "开发工程师" },
  { label: "架构工程师", value: "架构工程师" },
  { label: "测试工程师", value: "测试工程师" },
  { label: "数据模型专家", value: "数据模型专家" },
  { label: "业务需求分析师", value: "业务需求分析师" },
  { label: "项目经理", value: "项目经理" },
  { label: "业务员", value: "业务员" },
  { label: "行政文员", value: "行政文员" },
  { label: "助理", value: "助理" },
  { label: "其他", value: "其他" },
];

const degreeFilterOptions = [
  ALL_OPT,
  { label: "高中及以上", value: "高中及以上" },
  { label: "大专及以上", value: "大专及以上" },
  { label: "本科及以上", value: "本科及以上" },
  { label: "硕士及以上", value: "硕士及以上" },
  { label: "博士及以上", value: "博士及以上" },
];

const locationFilterOptions = [
  ALL_OPT,
  { label: "北京", value: "北京" },
  { label: "上海", value: "上海" },
  { label: "深圳", value: "深圳" },
  { label: "广州", value: "广州" },
  { label: "成都", value: "成都" },
  { label: "济南", value: "济南" },
  { label: "佛山", value: "佛山" },
  { label: "香港", value: "香港" },
];

const filteredJobs = computed(() =>
  jobs.value.filter((job) => {
    const hitKeyword = !keyword.value || job.title.toLowerCase().includes(keyword.value.toLowerCase());
    const hitType = !selectedType.value || job.type === selectedType.value;
    const hitDegree = !selectedDegree.value || job.degree === selectedDegree.value;
    const hitLocation = !selectedLocation.value || job.location === selectedLocation.value;
    return hitKeyword && hitType && hitDegree && hitLocation;
  })
);

const showEmptyResult = computed(() => {
  if (filteredJobs.value.length > 0) return false;
  const hasKeyword = keyword.value.trim().length > 0;
  const hasFilter = Boolean(selectedType.value || selectedDegree.value || selectedLocation.value);
  return hasKeyword || hasFilter;
});

watch(filteredJobs, (list) => {
  if (!list.some((job) => job.id === expandedJobId.value)) {
    expandedJobId.value = "";
  }
});

function pulseSearchGlow() {
  isSearchGlow.value = true;
  window.setTimeout(() => {
    isSearchGlow.value = false;
  }, 420);
}

function toggleJobDetail(id) {
  expandedJobId.value = expandedJobId.value === id ? "" : id;
}

function applyJob(job) {
  const subject = encodeURIComponent(`应聘申请 - ${job.title}`);
  window.location.href = `mailto:bihr@hisuntech.com?subject=${subject}`;
}
</script>

<style scoped>
.join-filters {
  position: relative;
  z-index: 120;
}

.join-job-list {
  position: relative;
  z-index: 1;
}

.job-card {
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
}

.job-card__head {
  display: grid;
  grid-template-columns: 1.3fr 1fr 1fr 1.45fr 1fr 42px;
  align-items: center;
  gap: 12px;
  min-height: 56px;
  padding: 0 16px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
}

.job-card__head.is-expanded {
  background: #3d59ff;
  border-bottom-color: rgba(255, 255, 255, 0.24);
}

.job-card__title {
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
}

.job-card__meta {
  font-size: 14px;
  color: #6b7280;
}

.job-card__head.is-expanded .job-card__title {
  color: #fff;
}

.job-card__head.is-expanded .job-card__meta {
  color: rgba(255, 255, 255, 0.7);
}

.job-card__toggle {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  background: transparent;
  color: #9ca3af;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  justify-self: center;
  align-self: center;
  padding: 0;
}

.job-card__toggle-icon {
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.job-card__toggle-icon svg {
  width: 16px;
  height: 16px;
  display: block;
}

.job-card__toggle-icon.is-open {
  transform: rotate(180deg);
}

.job-card__head.is-expanded .job-card__toggle {
  border-color: rgba(255, 255, 255, 0.65);
  color: #fff;
}

.job-card__detail {
  padding: 22px 28px 28px;
  background: #fff;
}

.job-card__detail-title {
  font-size: 44px;
  line-height: 1.15;
  font-weight: 700;
  color: #1f2937;
}

.job-card__detail-block {
  margin-top: 16px;
  border-top: 1px solid #e5e7eb;
  padding-top: 14px;
}

.job-card__detail-subtitle {
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.job-card__detail-list {
  margin: 0;
  padding-left: 20px;
  color: #4b5563;
  line-height: 1.9;
  font-size: 15px;
}

.job-card__apply {
  margin-top: 20px;
  height: 42px;
  border-radius: 8px;
  border: 1px solid #3d59ff;
  background: #3d59ff;
  color: #fff;
  padding: 0 26px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transform: scale(1);
  transform-origin: center;
  box-shadow: 0 2px 10px rgba(61, 89, 255, 0.28);
  transition:
    transform 0.38s cubic-bezier(0.34, 1.45, 0.64, 1),
    box-shadow 0.28s ease,
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.job-card__apply:hover {
  transform: scale(1.06);
  box-shadow: 0 10px 26px rgba(61, 89, 255, 0.42);
}

.job-card__apply:active {
  transform: scale(0.94);
  box-shadow: 0 2px 8px rgba(61, 89, 255, 0.35);
  transition-duration: 0.1s;
}

.job-card__apply:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(61, 89, 255, 0.45), 0 10px 26px rgba(61, 89, 255, 0.35);
}

@media (prefers-reduced-motion: reduce) {
  .job-card__apply {
    transition-duration: 0.01ms;
    box-shadow: none;
  }
  .job-card__apply:hover,
  .job-card__apply:active {
    transform: none;
  }
  .job-card__apply:focus-visible {
    box-shadow: 0 0 0 2px #3d59ff;
  }
}

@media (max-width: 1023px) {
  .job-card__head {
    grid-template-columns: 1fr;
    align-items: start;
    gap: 6px;
    padding: 12px 14px;
    cursor: pointer;
  }
  .job-card__toggle {
    display: none;
  }
  .job-card__detail-title {
    font-size: 32px;
  }
}
</style>

<style>
html.dark .job-card {
  border-color: #334155;
  background: #0f172a;
}
html.dark .job-card__head {
  background: #0f172a;
  border-bottom-color: #334155;
}
html.dark .job-card__title {
  color: #f8fafc;
}
html.dark .job-card__meta {
  color: #cbd5e1;
}
html.dark .job-card__toggle {
  border-color: #475569;
  color: #94a3b8;
}
html.dark .job-card__head.is-expanded {
  background: #3d59ff;
  border-bottom-color: rgba(255, 255, 255, 0.24);
}
html.dark .job-card__head.is-expanded .job-card__title {
  color: #fff;
}
html.dark .job-card__head.is-expanded .job-card__meta {
  color: rgba(255, 255, 255, 0.75);
}
html.dark .job-card__detail {
  background: #0b1220;
}
html.dark .job-card__detail-title,
html.dark .job-card__detail-subtitle {
  color: #f8fafc;
}
html.dark .job-card__detail-block {
  border-top-color: #334155;
}
html.dark .job-card__detail-list {
  color: #cbd5e1;
}
</style>
