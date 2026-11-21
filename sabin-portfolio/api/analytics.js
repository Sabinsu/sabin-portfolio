import { clientIp, originAllowed, parseBody, rateLimit } from "./_lib/util.js";

const TYPES = new Set(["pageview", "section", "project_click", "assistant_open", "assistant_question", "resume_download", "contact_click"]);
const DEVICES = new Set(["mobile", "tablet", "desktop"]);

// Consent-based, anonymous event logging. Events are written to the function logs
// (Vercel -> Logs); no identifiers, cookies or IP addresses are stored.
export default async function handler(req, res) {
  if (req.method !== "POST" || !originAllowed(req)) return res.status(204).end();
  const body = parseBody(req);
  if (!body || !TYPES.has(body.type)) return res.status(204).end();
  if (!(await rateLimit(`an:${clientIp(req)}`, 120, 60))) return res.status(204).end();

  const clean = (s, n) => String(s ?? "").replace(/[^\w .:/-]/g, "").slice(0, n);
  console.log(
    JSON.stringify({
      analytics: true,
      type: body.type,
      detail: clean(body.detail, 60),
      referrer: clean(body.referrer, 80),
      device: DEVICES.has(body.device) ? body.device : "unknown",
      ts: new Date().toISOString(),
    })
  );
  return res.status(204).end();
}
