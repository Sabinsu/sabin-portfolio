import { SYSTEM_PROMPT } from "./_lib/facts.js";
import { clientIp, originAllowed, parseBody, rateLimit, send } from "./_lib/util.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "method_not_allowed" });
  if (!originAllowed(req)) return send(res, 403, { error: "forbidden" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return send(res, 503, { error: "not_configured" });

  const body = parseBody(req);
  const raw = body?.messages;
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 12) return send(res, 400, { error: "invalid_request" });

  const messages = [];
  for (const m of raw) {
    if (!m || (m.role !== "user" && m.role !== "assistant") || typeof m.content !== "string") {
      return send(res, 400, { error: "invalid_request" });
    }
    const content = m.content.trim().slice(0, 600);
    if (content) messages.push({ role: m.role, content });
  }
  // The API requires the conversation to start with a user turn and end with one.
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== "user") return send(res, 400, { error: "invalid_request" });

  if (!(await rateLimit(`chat:${clientIp(req)}`, 20, 600))) return send(res, 429, { error: "rate_limited" });

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({
        model: process.env.AI_MODEL || "claude-haiku-5-5",
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });
    if (!r.ok) return send(res, 502, { error: "upstream_error" });
    const data = await r.json();
    const reply = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
    if (!reply) return send(res, 502, { error: "empty_reply" });
    return send(res, 200, { reply });
  } catch {
    return send(res, 502, { error: "upstream_error" });
  }
}
