/**
 * Cloudflare Pages Function — POST /api/contact
 * 在 Cloudflare 控制台 → Pages → 站点 → Settings → Environment variables 中配置：
 * - SANITY_WRITE_TOKEN（必填，Sanity 带写入权限的 Token）
 * - SANITY_PROJECT_ID、SANITY_DATASET（可选，默认 gj7kf1f4 / production）
 *
 * 说明：此前 public/_redirects 把 /api/contact 指到 Netlify Functions，在 Cloudflare 上会失效；
 * 本文件由 Pages 自动挂载到 /api/contact，勿再指向 Netlify。
 */
const SANITY_API_VERSION = "2024-01-01";

const jsonHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: jsonHeaders });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ ok: false, error: "method_not_allowed" }), {
      status: 405,
      headers: jsonHeaders,
    });
  }

  const token = env.SANITY_WRITE_TOKEN;
  const projectId = env.SANITY_PROJECT_ID || "gj7kf1f4";
  const dataset = env.SANITY_DATASET || "production";

  if (!token) {
    return new Response(JSON.stringify({ ok: false, error: "server_not_configured" }), {
      status: 503,
      headers: jsonHeaders,
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "invalid_json" }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const message = String(body.message || "").trim();
  const company = String(body.company || "").trim();
  const phone = String(body.phone || "").trim();

  if (!name || !email || !message) {
    return new Response(JSON.stringify({ ok: false, error: "validation_failed" }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ ok: false, error: "invalid_email" }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  const id = `contactMessage-${crypto.randomUUID()}`;
  const submittedAt = new Date().toISOString();

  const doc = {
    _type: "contactMessage",
    _id: id,
    name,
    email,
    message,
    submittedAt,
  };
  if (company) doc.company = company;
  if (phone) doc.phone = phone;

  const url = `https://${projectId}.api.sanity.io/v${SANITY_API_VERSION}/data/mutate/${dataset}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ mutations: [{ create: doc }] }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Sanity mutate failed", res.status, text);
    return new Response(JSON.stringify({ ok: false, error: "storage_failed" }), {
      status: 502,
      headers: jsonHeaders,
    });
  }

  return new Response(JSON.stringify({ ok: true, id }), {
    status: 200,
    headers: jsonHeaders,
  });
}
