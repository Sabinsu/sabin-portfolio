import { clientIp, esc, mailConfigured, originAllowed, parseBody, rateLimit, send, sendMail } from "./_lib/util.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "method_not_allowed" });
  if (!originAllowed(req)) return send(res, 403, { error: "forbidden" });

  const body = parseBody(req);
  if (!body) return send(res, 400, { error: "invalid_request" });
  if (body.website) return send(res, 200, { ok: true }); // honeypot

  const name = typeof body.name === "string" ? body.name.trim().slice(0, 80) : "";
  const email = typeof body.email === "string" ? body.email.trim().slice(0, 120) : "";
  const message = typeof body.message === "string" ? body.message.trim().slice(0, 2000) : "";
  if (name.length < 2 || !EMAIL_RE.test(email) || message.length < 10) return send(res, 400, { error: "invalid_request" });

  if (!mailConfigured()) return send(res, 503, { error: "not_configured" });
  if (!(await rateLimit(`contact:${clientIp(req)}`, 5, 3600))) return send(res, 429, { error: "rate_limited" });

  try {
    await sendMail({
      subject: `Portfolio enquiry from ${name.replace(/[\r\n]+/g, " ")}`,
      replyTo: email,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `<div style="font-family:system-ui,sans-serif;max-width:560px"><h2>New portfolio enquiry</h2>
        <p><b>${esc(name)}</b> &lt;${esc(email)}&gt;</p>
        <p style="white-space:pre-wrap">${esc(message)}</p></div>`,
    });
    return send(res, 200, { ok: true });
  } catch {
    return send(res, 502, { error: "send_failed" });
  }
}
