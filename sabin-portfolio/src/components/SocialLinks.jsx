import { Github, Linkedin, Mail } from "lucide-react";
import { profile } from "../data/profile";

const links = [
  { key: "github", href: profile.social.github, label: "GitHub", Icon: Github },
  { key: "linkedin", href: profile.social.linkedin, label: "LinkedIn", Icon: Linkedin },
  { key: "email", href: profile.social.email, label: "Email", Icon: Mail },
];

export default function SocialLinks({ className = "" }) {
  return (
    <ul className={`flex items-center gap-2 ${className}`}>
      {links.map(({ key, href, label, Icon }) => (
        <li key={key}>
          <a
            href={href}
            target={key === "email" ? undefined : "_blank"}
            rel={key === "email" ? undefined : "noopener noreferrer"}
            aria-label={label}
            className="flex h-11 w-11 sm:h-10 sm:w-10 items-center justify-center rounded-lg border border-ink-300/25 text-ink-500 transition-colors hover:border-brand-500/50 hover:text-brand-500 dark:text-ink-300 dark:hover:text-brand-400"
          >
            <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}
