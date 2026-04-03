/**
 * 接收「在线留言」表单，写入 Sanity（需 Netlify 环境变量 SANITY_WRITE_TOKEN）。
 * 可选：SANITY_PROJECT_ID、SANITY_DATASET（默认与 Studio 一致）。
 */
const SANITY_API_VERSION = "2024-01-01";

export const handler = async (event) => {
  const jsonHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: jsonHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: jsonHeaders,
      body: JSON.stringify({ ok: false, error: "method_not_allowed" }),
    };
  }

  const token = process.env.SANITY_WRITE_TOKEN;
  const projectId = process.env.SANITY_PROJECT_ID || "gj7kf1f4";
  const dataset = process.env.SANITY_DATASET || "production";

  if (!token) {
    return {
      statusCode: 503,
      headers: jsonHeaders,
      body: JSON.stringify({ ok: false, error: "server_not_configured" }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      headers: jsonHeaders,
      body: JSON.stringify({ ok: false, error: "invalid_json" }),
    };
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const message = String(body.message || "").trim();
  const company = String(body.company || "").trim();
  const phone = String(body.phone || "").trim();

  if (!name || !email || !message) {
    return {
      statusCode: 400,
      headers: jsonHeaders,
      body: JSON.stringify({ ok: false, error: "validation_failed" }),
    };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      statusCode: 400,
      headers: jsonHeaders,
      body: JSON.stringify({ ok: false, error: "invalid_email" }),
    };
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

  const text = await res.text();
  if (!res.ok) {
    console.error("Sanity mutate failed", res.status, text);
    return {
      statusCode: 502,
      headers: jsonHeaders,
      body: JSON.stringify({ ok: false, error: "storage_failed" }),
    };
  }

  return {
    statusCode: 200,
    headers: jsonHeaders,
    body: JSON.stringify({ ok: true, id }),
  };
};
