// Consent-based, privacy-conscious analytics. Nothing is sent unless the visitor
// explicitly accepted. No identifiers, cookies or fingerprinting are used:
// only event type, section/project id, referrer hostname and a device category.

const KEY = "analytics-consent";

export function getConsent() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function setConsent(value) {
  try {
    localStorage.setItem(KEY, value);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event("consent:changed"));
  if (value === "granted") track("pageview");
}

function deviceCategory() {
  const w = window.innerWidth;
  return w < 640 ? "mobile" : w < 1024 ? "tablet" : "desktop";
}

function referrerHost() {
  try {
    return document.referrer ? new URL(document.referrer).hostname : "direct";
  } catch {
    return "direct";
  }
}

export function track(type, detail = "") {
  if (getConsent() !== "granted") return;
  const payload = JSON.stringify({
    type,
    detail: String(detail).slice(0, 60),
    referrer: referrerHost(),
    device: deviceCategory(),
  });
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics", new Blob([payload], { type: "application/json" }));
    } else {
      fetch("/api/analytics", { method: "POST", body: payload, keepalive: true, headers: { "Content-Type": "application/json" } });
    }
  } catch {
    /* analytics must never break the site */
  }
}
