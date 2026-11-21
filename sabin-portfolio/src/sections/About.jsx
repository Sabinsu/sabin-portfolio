import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import { profile } from "../data/profile";

export default function About() {
  return (
    <section id="about" className="scroll-mt-16 py-20 sm:py-28" aria-label="About">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="About"
            title="Who I am, and what I actually do"
            description="A quick overview of my background, before the details in the sections below."
          />
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
          <Reveal className="space-y-5">
            {profile.photo && (
              <img
                src={profile.photo}
                alt={`Portrait of ${profile.name}`}
                width={112}
                height={112}
                className="mb-2 h-28 w-28 rounded-2xl border border-ink-300/20 object-cover"
              />
            )}
            {profile.about.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="text-base leading-relaxed text-ink-600 dark:text-ink-300">
                {p}
              </p>
            ))}

            <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-ink-300/15 pt-8 sm:grid-cols-4">
              {profile.stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-xs font-medium uppercase tracking-wider text-ink-400">
                    {stat.label}
                  </dt>
                  <dd className="mt-1 font-display text-xl font-semibold text-ink-900 dark:text-white">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {profile.about.highlights.map((item, i) => (
              <Reveal
                key={item.title}
                delay={i * 0.06}
                className="rounded-xl border border-ink-300/15 bg-white p-5 dark:bg-ink-850/60 backdrop-blur-sm"
              >
                <h3 className="font-display text-sm font-semibold text-ink-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500 dark:text-ink-300">
                  {item.description}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
