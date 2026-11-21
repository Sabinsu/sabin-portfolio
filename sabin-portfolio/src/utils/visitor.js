// Only a boolean "registered" flag with an expiry is kept in the browser.
// The visitor's name and number are never stored client-side.
const KEY = "visitor-registered-until";
const DAYS = 30;

export function hasRegistered() {
  try {
    const until = Number(localStorage.getItem(KEY));
    return Number.isFinite(until) && until > Date.now();
  } catch {
    return false;
  }
}

export function markRegistered() {
  try {
    localStorage.setItem(KEY, String(Date.now() + DAYS * 86400000));
  } catch {
    /* ignore */
  }
}

export const COUNTRY_CODES = [
  { code: "+977", label: "Nepal (+977)" },
  { code: "+91", label: "India (+91)" },
  { code: "+1", label: "USA / Canada (+1)" },
  { code: "+44", label: "United Kingdom (+44)" },
  { code: "+61", label: "Australia (+61)" },
  { code: "+971", label: "UAE (+971)" },
  { code: "+974", label: "Qatar (+974)" },
  { code: "+966", label: "Saudi Arabia (+966)" },
  { code: "+60", label: "Malaysia (+60)" },
  { code: "+65", label: "Singapore (+65)" },
  { code: "+880", label: "Bangladesh (+880)" },
  { code: "+92", label: "Pakistan (+92)" },
  { code: "+94", label: "Sri Lanka (+94)" },
  { code: "+49", label: "Germany (+49)" },
  { code: "+33", label: "France (+33)" },
  { code: "+81", label: "Japan (+81)" },
  { code: "+82", label: "South Korea (+82)" },
  { code: "+86", label: "China (+86)" },
];
