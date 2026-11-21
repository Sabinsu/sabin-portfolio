import { motion } from "framer-motion";
import { ArrowRight, Bot, Download, MessageSquare } from "lucide-react";
import Button from "../components/Button";
import Magnetic from "../components/Magnetic";
import SocialLinks from "../components/SocialLinks";
import TerminalCard from "../components/TerminalCard";
import { profile } from "../data/profile";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { track } from "../utils/analytics";

export default function Hero() {
  const reducedMotion = usePrefersReducedMotion();
  const initial = reducedMotion ? {} : { opacity: 0, y: 16 };
  const animate = reducedMotion ? {} : { opacity: 1, y: 0 };

  return (
    <section id="home" className="relative overflow-hidden pt-10 sm:pt-16" aria-label="Command center introduction">
      <div className="container-page grid items-center gap-14 pb-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:pb-28">
        <motion.div initial={initial} animate={animate} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-300">Room 01 · Command Center</p>
          <p className="mb-5 mt-3 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/5 px-4 py-1.5 font-mono text-xs text-brand-600 dark:text-brand-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
            Team Leader &amp; Automation Engineer @ AutoLab Technologies
          </p>

          <h1 className="text-balance font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink-900 dark:text-white sm:text-5xl lg:text-[3.25rem]">
            <span className="text-gradient">{profile.name}</span>
            <span className="mt-3 block text-2xl font-medium sm:text-3xl">{profile.role}</span>
          </h1>

          <p className="mt-6 max-w-xl text-balance text-base leading-relaxed text-ink-500 dark:text-ink-300 sm:text-lg">{profile.tagline}</p>

          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Areas of focus">
            {profile.positioning.map((item) => (
              <li key={item} className="rounded-md border border-ink-300/20 px-3 py-1.5 font-mono text-xs text-ink-600 dark:border-ink-600/40 dark:text-ink-300">{item}</li>
            ))}
          </ul>

          <div className="mt-9 grid grid-cols-1 gap-3 min-[430px]:grid-cols-2 sm:flex sm:flex-wrap sm:items-center">
            <Magnetic className="block sm:inline-block">
              <Button as="a" href="#projects" variant="primary" className="w-full sm:w-auto">Explore Portfolio <ArrowRight size={16} aria-hidden="true" /></Button>
            </Magnetic>
            <Magnetic className="block sm:inline-block">
              <Button as="a" href={profile.resumeUrl} download variant="outline" className="w-full sm:w-auto" onClick={() => track("resume_download", "hero")}>Download Resume <Download size={16} aria-hidden="true" /></Button>
            </Magnetic>
            <Magnetic className="block sm:inline-block">
              <Button as="a" href="#contact" variant="ghost" className="w-full border border-ink-300/25 sm:w-auto sm:border-0">Contact Me <MessageSquare size={16} aria-hidden="true" /></Button>
            </Magnetic>
            <Magnetic className="block sm:inline-block">
              <Button type="button" variant="outline" onClick={() => window.dispatchEvent(new CustomEvent("assistant:open"))} className="w-full border-cyan-400/50 text-cyan-700 dark:text-cyan-300 sm:w-auto">
                Ask my AI <Bot size={16} aria-hidden="true" />
              </Button>
            </Magnetic>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <span className="text-xs font-medium uppercase tracking-widest text-ink-400">Find me on</span>
            <SocialLinks />
          </div>
        </motion.div>

        <motion.div initial={initial} animate={animate} transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }} className="flex justify-center lg:justify-end">
          <div className="relative w-64 sm:w-72">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-brand-500/40 via-cyan-400/20 to-violet-500/40 blur-2xl" aria-hidden="true" />
            <div className="neon-border scanlines relative overflow-hidden rounded-3xl bg-ink-900 glow-blue">
              <img
                src={profile.photo}
                alt={`Portrait of ${profile.name}`}
                width={800}
                height={1067}
                fetchPriority="high"
                decoding="async"
                className="aspect-[3/4] w-full object-cover object-top"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-ink-950/90 to-transparent p-4">
                <div>
                  <p className="font-display text-sm font-semibold text-white">{profile.name.split(" ")[0]} · {profile.name.split(" ").slice(-1)[0]}</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-300">Automation Engineer</p>
                </div>
                <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase text-emerald-300">
                  <span className="relative flex h-2 w-2"><span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" /><span className="relative h-2 w-2 rounded-full bg-emerald-400" /></span>
                  Online
                </span>
              </div>
            </div>
            <div className="absolute -bottom-12 -left-14 hidden w-72 lg:block">
              <TerminalCard />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
