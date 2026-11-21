import { useEffect, useState } from "react";
import { Github, Star, ArrowUpRight, GitFork } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import { profile } from "../data/profile";

const GITHUB_USERNAME = "Sabinsu";

// Static fallback so the section never depends on the GitHub API being
// reachable, rate-limited, or fast.
const FALLBACK_REPOS = [
  {
    name: "ShopZone",
    description: "A modern full-stack e-commerce platform.",
    language: "JavaScript",
    stargazers_count: 0,
    html_url: "https://github.com/Sabinsu/ShopZone",
    updated_at: null,
  },
];

export default function GithubSection() {
  const [repos, setRepos] = useState(FALLBACK_REPOS);
  const [status, setStatus] = useState("loading"); // loading | live | fallback

  useEffect(() => {
    let cancelled = false;

    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`)
      .then((res) => {
        if (!res.ok) throw new Error("GitHub API unavailable");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data) && data.length > 0) {
          setRepos(data.slice(0, 4));
          setStatus("live");
        } else {
          setStatus("fallback");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("fallback");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="github" className="scroll-mt-16 border-t border-ink-300/10 py-20 sm:py-28" aria-label="GitHub activity">
      <div className="container-page">
        <Reveal>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Open Source" title="Developer activity" className="mb-0" />
            <a
              href={profile.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-500 hover:underline"
            >
              <Github size={16} aria-hidden="true" />
              @{GITHUB_USERNAME}
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2">
          {status === "loading" &&
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-xl border border-ink-300/15 bg-ink-100/50 dark:bg-ink-800/50"
                aria-hidden="true"
              />
            ))}

          {status !== "loading" &&
            repos.map((repo, i) => (
              <Reveal
                key={repo.name}
                delay={i * 0.05}
                className="rounded-xl border border-ink-300/15 bg-white p-6 transition-colors hover:border-brand-500/40 dark:bg-ink-850/60 backdrop-blur-sm"
              >
                <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="block">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-base font-semibold text-ink-900 dark:text-white">
                      {repo.name}
                    </h3>
                    <ArrowUpRight size={16} className="text-ink-400" aria-hidden="true" />
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-ink-500 dark:text-ink-300">
                    {repo.description || "No description provided."}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-xs text-ink-400">
                    {repo.language && (
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-brand-500" aria-hidden="true" />
                        {repo.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Star size={12} aria-hidden="true" /> {repo.stargazers_count ?? 0}
                    </span>
                    {"forks_count" in repo && (
                      <span className="flex items-center gap-1">
                        <GitFork size={12} aria-hidden="true" /> {repo.forks_count ?? 0}
                      </span>
                    )}
                    {repo.updated_at && (
                      <span>Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
                    )}
                  </div>
                </a>
              </Reveal>
            ))}
        </div>

        {status === "fallback" && (
          <p className="mt-4 text-xs text-ink-400">
            Showing cached repository data — live GitHub data is temporarily unavailable.
          </p>
        )}
      </div>
    </section>
  );
}
