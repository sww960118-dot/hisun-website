/**
 * 合作伙伴 Logo：按行业目录与文件名清单（public/partners/{sector}/）
 */

export const PARTNER_FILES_BY_SECTOR = {
  bank: [
    "东莞农村商业银行.jpg",
    "中信银行.jpg",
    "中国光大银行.jpg",
    "中国农业银行.jpg",
    "中国民生银行.jpg",
    "中国银行.jpg",
    "交通银行.jpg",
    "众安虚拟银行.jpg",
    "兴业银行.jpg",
    "南洋商业银行.jpg",
    "国家开发银行.jpg",
    "山东城商行合作联盟.jpg",
    "广发银行.jpg",
    "徽商银行.jpg",
    "新银行亚洲.jpg",
    "永隆银行.jpg",
    "浦发银行.jpg",
    "渤海银行.jpg",
    "百信银行.jpg",
    "苏州银行.jpg",
    "贵州银行.jpg",
  ],
  insurance: [
    "中国人保(PICC).jpg",
    "中国保信.jpg",
    "民生保险.jpg",
    "香港亚洲保险.jpg",
  ],
  nonbank: [
    "9F玖富.jpg",
    "合拍在线.jpg",
    "大信财富.jpg",
    "宜信.jpg",
    "拉卡拉.jpg",
    "汇银通.jpg",
    "珠宝贷.jpg",
    "腾付通.jpg",
    "财富通.jpg",
    "随行付.jpg",
    "集付通.jpg",
    "鹏金所.jpg",
  ],
  other: [
    "中国移动.jpg",
    "中国联通.jpg",
    "对外经济贸易大学.jpg",
    "山东高速股份.jpg",
    "故宫博物馆.jpg",
    "港交所.jpg",
    "爱施德.jpg",
    "澳门基金会.jpg",
    "美的.jpg",
  ],
};

export const PARTNER_HOME_LOGO_MAX = 18;

const SECTOR_ORDER = ["bank", "insurance", "nonbank", "other"];

/** 兼容 Vite base 子路径部署；路径分段编码，避免中文/括号在部分环境下的 404 */
function partnerLogoSrc(sector, file) {
  const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  const seg = encodeURIComponent(file);
  const path = `/partners/${sector}/${seg}`;
  return base ? `${base}${path}` : path;
}

export function buildPartnerLogoItems() {
  const items = [];
  for (const sector of SECTOR_ORDER) {
    const files = PARTNER_FILES_BY_SECTOR[sector] ?? [];
    for (const file of files) {
      items.push({
        src: partnerLogoSrc(sector, file),
        name: file.replace(/\.[^.]+$/u, ""),
        sector,
      });
    }
  }
  return items;
}

export function buildPartnerLogosHomePreview(all) {
  return all.slice(0, PARTNER_HOME_LOGO_MAX);
}
