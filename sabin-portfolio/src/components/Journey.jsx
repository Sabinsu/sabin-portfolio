import Reveal from "./Reveal";

const STEPS = [
  { when: "2023", title: "Diploma in Computer Engineering", text: "Completed at Basu Secondary School (CTEVT). The foundation for everything after." },
  { when: "2024", title: "Joined AutoLab Technologies", text: "Started as Team Leader & Automation Engineer, building browser automation and scraping systems." },
  { when: "Ongoing", title: "BIT at Padmashree International College", text: "Studying a Bachelor in Information Technology (Hons.) alongside hands-on engineering work." },
  { when: "Project", title: "ShopZone", text: "Built and deployed a full-stack e-commerce platform with React, Node.js and MongoDB." },
  { when: "Today", title: "Leading automation & backend work", text: "Coordinating a technical team and open to new professional opportunities." },
];

export default function Journey() {
  return (
    <div className="mt-16">
      <h3 className="mb-8 font-display text-xl font-semibold text-ink-900 dark:text-white">The journey so far</h3>
      <ol className="relative max-w-3xl border-l border-cyan-400/30 pl-8">
        {STEPS.map((s, i) => (
          <Reveal as="li" key={s.title} delay={i * 0.05} className="relative pb-9 last:pb-0">
            <span className="absolute -left-[2.45rem] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-cyan-400 bg-white dark:bg-ink-950" aria-hidden="true">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            </span>
            <p className="font-mono text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-300">{s.when}</p>
            <h4 className="mt-1 font-display text-base font-semibold text-ink-900 dark:text-white">{s.title}</h4>
            <p className="mt-1 text-sm leading-relaxed text-ink-500 dark:text-ink-300">{s.text}</p>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}
