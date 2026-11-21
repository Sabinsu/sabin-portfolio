export function openPrivacy() {
  window.dispatchEvent(new Event("privacy:open"));
}
