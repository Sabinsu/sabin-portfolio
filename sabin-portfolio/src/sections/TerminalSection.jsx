import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import InteractiveTerminal from "../components/InteractiveTerminal";

export default function TerminalSection() {
  return (
    <section id="terminal" className="scroll-mt-20 border-t border-ink-300/10 py-20 sm:py-28" aria-label="Interactive terminal">
      <div className="container-page">
        <Reveal>
          <SectionHeading eyebrow="Terminal" title="Explore from the command line" description="Prefer a keyboard? Type a command, or tap one of the shortcuts. There may be a few hidden surprises." />
        </Reveal>
        <Reveal><div className="mx-auto max-w-3xl"><InteractiveTerminal /></div></Reveal>
      </div>
    </section>
  );
}
