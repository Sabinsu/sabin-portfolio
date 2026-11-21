// Shared helpers for the serverless API. Files in `_lib` are not exposed as routes.

const memory = new Map(); // best-effort fallback when Upstash Redis is not configured

export function send(res, status, body) {
  res.setHeader("Cache-Control", "no-store");
  res.status(status).json(body);
}

export function clientIp(req) {
  const xf = req.headers["x-forwarded-for"];
  const ip = typeof xf === "string" ? xf.split(",")[0].trim() : req.socket?.remoteAddress;
  return ip || "unknown";
}

/** Only accept browser requests that originate from this site (or ALLOWED_ORIGINS). */
export function originAllowed(req) {
  const origin = req.headers.origin;
  if (!origin) return false;
  try {
    const host = new URL(origin).host;
    const extra = (process.env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
    return host === req.headers.host || extra.some((o) => o === origin || o === host);
  } catch {
    return false;
  }
}

export function parseBody(req) {
  const body = req.body;
  if (!body) return null;
  if (typeof body === "string") {
    if (body.length > 10_000) return null;
    try { return JSON.parse(body); } catch { return null; }
  }
  if (JSON.stringify(body).length > 10_000) return null;
  return body;
}

export function esc(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

/** Minimal Upstash Redis REST client (optional). */
export async function redis(command) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return undefined; // not configured
  const r = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
  });
  if (!r.ok) throw new Error(`redis ${r.status}`);
  return (await r.json()).result;
}

/** Fixed-window rate limit. Returns true when the request is allowed. */
export async function rateLimit(key, limit, windowSec) {
  try {
    const count = await redis(["INCR", key]);
    if (count !== undefined) {
      if (count === 1) await redis(["EXPIRE", key, windowSec]);
      return count <= limit;
    }
  } catch { /* fall through to memory */ }
  const now = Date.now();
  const entry = memory.get(key);
  if (!entry || entry.reset < now) {
    memory.set(key, { count: 1, reset: now + windowSec * 1000 });
    return true;
  }
  entry.count += 1;
  return entry.count <= limit;
}

/** Returns true the first time a key is seen within ttlSec (duplicate protection). */
export async function firstSeen(key, ttlSec) {
  try {
    const r = await redis(["SET", key, "1", "NX", "EX", ttlSec]);
    if (r !== undefined) return r === "OK";
  } catch { /* fall through */ }
  const now = Date.now();
  const entry = memory.get(key);
  if (entry && entry.reset > now) return false;
  memory.set(key, { count: 1, reset: now + ttlSec * 1000 });
  return true;
}

export async function forget(key) {
  try { if ((await redis(["DEL", key])) !== undefined) return; } catch { /* ignore */ }
  memory.delete(key);
}

export function mailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

/** Sends a transactional email through Resend. Throws on failure. */
export async function sendMail({ subject, html, text, replyTo }) {
  const to = process.env.NOTIFY_EMAIL || "subedis784@gmail.com";
  const from = process.env.RESEND_FROM || "Portfolio <onboarding@resend.dev>";
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, html, text, ...(replyTo ? { reply_to: replyTo } : {}) }),
  });
  if (!r.ok) throw new Error(`resend ${r.status}`);
  return r.json();
}
