import { ref } from "vue";

/** HISUN_CMS 异步更新后 bump，供各页 computed 重新读取 Sanity 数据 */
export const cmsTick = ref(0);

export function bumpCmsTick() {
  cmsTick.value += 1;
}
