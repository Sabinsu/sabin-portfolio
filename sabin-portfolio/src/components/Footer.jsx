import SocialLinks from "./SocialLinks";
import { profile } from "../data/profile";
import { openPrivacy } from "../utils/privacy";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink-300/10">
      <div className="container-page flex flex-col gap-8 py-12 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <a href="#home" className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900 dark:text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-sm font-bold text-white">
              S
            </span>
            {profile.name}
          </a>
          <p className="mt-2 max-w-xs text-sm text-ink-500 dark:text-ink-300">{profile.role}</p>
        </div>

        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-ink-400">Quick Links</p>
          <SocialLinks />
        </div>
      </div>
      <div className="container-page flex flex-col gap-2 border-t border-ink-300/10 py-6 text-xs text-ink-400 sm:flex-row sm:items-center sm:justify-between">
        <p>© {year} {profile.name}. All rights reserved.</p>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono"><button type="button" onClick={openPrivacy} className="underline-offset-4 hover:text-brand-500 hover:underline">Privacy notice</button><span>Built with React, Three.js &amp; Tailwind CSS.</span></p>
      </div>
    </footer>
  );
}
