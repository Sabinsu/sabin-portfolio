import { createHash, randomUUID } from "node:crypto";
import { clientIp, esc, firstSeen, forget, mailConfigured, originAllowed, parseBody, rateLimit, redis, send, sendMail } from "./_lib/util.js";

const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M} .'-]{1,79}$/u;
const PHONE_RE = /^\+[1-9]\d{6,14}$/;
const RETENTION_SECONDS = 60 * 60 * 24 * 90; // 90 days

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "method_not_allowed" });
  if (!originAllowed(req)) return send(res, 403, { error: "forbidden" });

  const body = parseBody(req);
  if (!body) return send(res, 400, { error: "invalid_request" });

  // Spam traps: a hidden honeypot field and an impossibly fast submission.
  if (body.website || (typeof body.elapsed === "number" && body.elapsed < 1200)) {
    return send(res, 200, { ok: true });
  }

  const name = typeof body.name === "string" ? body.name.trim().replace(/\s+/g, " ") : "";
  const phone = typeof body.phone === "string" ? body.phone.replace(/[\s-]/g, "") : "";
  if (!NAME_RE.test(name)) return send(res, 400, { error: "invalid_name" });
  if (!PHONE_RE.test(phone)) return send(res, 400, { error: "invalid_phone" });
  if (body.consent !== true) return send(res, 400, { error: "consent_required" });

  if (!mailConfigured()) return send(res, 503, { error: "not_configured" });

  const ip = clientIp(req);
  if (!(await rateLimit(`visitor:${ip}`, 5, 3600))) return send(res, 429, { error: "rate_limited" });

  // Duplicate protection (hash only, never the raw number).
  const dedupeKey = `visitor-dup:${createHash("sha256").update(phone).digest("hex").slice(0, 32)}`;
  if (!(await firstSeen(dedupeKey, 86400))) return send(res, 200, { ok: true, duplicate: true });

  const page = String(body.page || "").slice(0, 200);
  const referrer = String(body.referrer || "direct").slice(0, 200);
  const now = new Date();
  const record = { name, phone, consent: true, at: now.toISOString(), page, referrer };

  try {
    // Optional secure storage with automatic expiry (90 days).
    await redis(["SET", `visitor:${now.getTime()}:${randomUUID().slice(0, 8)}`, JSON.stringify(record), "EX", RETENTION_SECONDS]).catch(() => {});

    const local = now.toLocaleString("en-GB", { timeZone: "Asia/Kathmandu", dateStyle: "medium", timeStyle: "short" });
    await sendMail({
      subject: "New Portfolio Visitor Registration",
      text: `Name: ${name}\nPhone: ${phone}\nSubmitted: ${record.at} (${local} NPT)\nConsent: Yes\nPage: ${page}\nReferrer: ${referrer}`,
      html: `<div style="font-family:system-ui,sans-serif;max-width:520px">
        <h2 style="margin:0 0 12px">New Portfolio Visitor Registration</h2>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:6px 0;color:#667"><b>Name</b></td><td>${esc(name)}</td></tr>
          <tr><td style="padding:6px 0;color:#667"><b>Phone</b></td><td><a href="tel:${esc(phone)}">${esc(phone)}</a></td></tr>
          <tr><td style="padding:6px 0;color:#667"><b>Submitted</b></td><td>${esc(record.at)}<br><small>${esc(local)} (Nepal time)</small></td></tr>
          <tr><td style="padding:6px 0;color:#667"><b>Consent</b></td><td>Yes. The visitor agreed to be contacted regarding enquiries.</td></tr>
          <tr><td style="padding:6px 0;color:#667"><b>Page</b></td><td>${esc(page)}</td></tr>
          <tr><td style="padding:6px 0;color:#667"><b>Referrer</b></td><td>${esc(referrer)}</td></tr>
        </table></div>`,
    });
    return send(res, 200, { ok: true });
  } catch {
    await forget(dedupeKey);
    return send(res, 502, { error: "send_failed" });
  }
}
