/**
 * 将 Sanity Portable Text（经 GROQ 展开图片 URL）转为详情页可用的片段列表。
 */

function escapeHtml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(s) {
  return escapeHtml(s).replace(/`/g, "&#96;");
}

function wrapMarks(text, marks, markDefs) {
  let out = text;
  const defs = Array.isArray(markDefs) ? markDefs : [];
  const byKey = new Map(defs.map((d) => [d?._key, d]));

  const ordered = Array.isArray(marks) ? [...marks] : [];
  ordered.sort((a, b) => {
    const pa = a === "strong" || a === "em" || a === "underline" || a === "code" ? 0 : 1;
    const pb = b === "strong" || b === "em" || b === "underline" || b === "code" ? 0 : 1;
    return pa - pb;
  });

  for (const m of ordered) {
    if (m === "strong") out = `<strong>${out}</strong>`;
    else if (m === "em") out = `<em>${out}</em>`;
    else if (m === "underline") out = `<u>${out}</u>`;
    else if (m === "code") out = `<code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">${out}</code>`;
    else {
      const def = byKey.get(m);
      if (def?._type === "link" && def.href) {
        const href = escapeAttr(String(def.href));
        out = `<a href="${href}" class="text-[#3d59ff] underline dark:text-[#7c8cff]" rel="noopener noreferrer" target="_blank">${out}</a>`;
      }
    }
  }
  return out;
}

function blockChildrenToHtml(block) {
  const children = Array.isArray(block.children) ? block.children : [];
  const markDefs = block.markDefs;
  return children
    .map((child) => {
      if (!child || child._type !== "span") return "";
      const raw = typeof child.text === "string" ? child.text : "";
      const inner = wrapMarks(escapeHtml(raw), child.marks, markDefs);
      return inner;
    })
    .join("");
}

const LIST_PREFIX = { bullet: "• ", number: "" };

/**
 * @param {unknown} blocks
 * @returns {Array<{ kind: 'html'; tag: string; html: string } | { kind: 'image'; src: string; alt: string }>}
 */
export function portableTextToArticleSegments(blocks) {
  if (!Array.isArray(blocks) || blocks.length === 0) return [];

  const out = [];
  for (const block of blocks) {
    if (!block || typeof block !== "object") continue;

    if (block._type === "block") {
      const html = blockChildrenToHtml(block);
      const style = typeof block.style === "string" ? block.style : "normal";
      const listItem = block.listItem;
      const prefix = listItem && LIST_PREFIX[listItem] != null ? LIST_PREFIX[listItem] : "";
      const inner = prefix + html;
      if (!inner.trim()) continue;

      let tag = "p";
      if (style === "h1") tag = "h2";
      else if (style === "h2") tag = "h2";
      else if (style === "h3") tag = "h3";
      else if (style === "h4") tag = "h4";
      else if (style === "blockquote") tag = "blockquote";

      out.push({ kind: "html", tag, html: inner });
    } else if (block._type === "image") {
      const src = block.url || block.asset?.url;
      if (src) out.push({ kind: "image", src: String(src), alt: String(block.alt || "") });
    } else if (block._type === "embedImage") {
      const src = block.url;
      if (src) out.push({ kind: "image", src: String(src), alt: String(block.alt || "") });
    } else if (typeof block.url === "string" && /^https?:\/\//i.test(block.url)) {
      // 兜底：若 schema 与前端类型名不一致，仍尝试按外链图渲染
      const u = block.url.trim();
      if (/\.(png|jpe?g|gif|webp|svg)(\?|$)/i.test(u)) {
        out.push({ kind: "image", src: u, alt: String(block.alt || "") });
      }
    }
  }
  return out;
}

/**
 * @param {unknown} blocks
 * @returns {boolean}
 */
export function hasPortableBody(blocks) {
  return portableTextToArticleSegments(blocks).length > 0;
}
