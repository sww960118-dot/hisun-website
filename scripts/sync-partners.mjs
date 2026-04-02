/**
 * 将 D:\桌面\hisun_website\合作伙伴\ 下中文分类文件夹同步到 public/partners/{bank|insurance|nonbank|other}/
 * 用法: node scripts/sync-partners.mjs [源目录]
 * 示例: node scripts/sync-partners.mjs "D:\桌面\hisun_website\合作伙伴"
 */
import { copyFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");
const destRoot = join(projectRoot, "public", "partners");

const DEFAULT_SRC = "D:\\桌面\\hisun_website\\合作伙伴";
const srcRoot = process.argv[2] || DEFAULT_SRC;

const MAP = [
  ["银行", "bank"],
  ["保险", "insurance"],
  ["非银金融", "nonbank"],
  ["其他", "other"],
];

let copied = 0;
for (const [cn, en] of MAP) {
  const from = join(srcRoot, cn);
  const to = join(destRoot, en);
  mkdirSync(to, { recursive: true });
  let st;
  try {
    st = statSync(from);
  } catch {
    console.warn("[sync-partners] 跳过（目录不存在）:", from);
    continue;
  }
  if (!st.isDirectory()) continue;
  for (const name of readdirSync(from)) {
    const fp = join(from, name);
    if (statSync(fp).isFile()) {
      copyFileSync(fp, join(to, name));
      copied += 1;
    }
  }
}

console.log(`[sync-partners] 已复制 ${copied} 个文件 → ${destRoot}`);
if (copied === 0) {
  console.warn("[sync-partners] 未复制任何文件，请检查源路径是否存在中文子文件夹：银行、保险、非银金融、其他");
  process.exitCode = 1;
}
