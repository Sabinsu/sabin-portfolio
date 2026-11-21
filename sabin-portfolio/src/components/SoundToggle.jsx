import { Volume2, VolumeX } from "lucide-react";
import { toggleSound, useSoundEnabled } from "../utils/sound";

export default function SoundToggle() {
  const on = useSoundEnabled();
  return (
    <button
      type="button"
      onClick={toggleSound}
      aria-pressed={on}
      aria-label={on ? "Turn interface sounds off" : "Turn interface sounds on"}
      className="flex h-11 w-11 xl:h-10 xl:w-10 items-center justify-center rounded-lg border border-ink-300/25 text-ink-500 transition-colors hover:border-brand-500/50 hover:text-brand-500 dark:text-ink-300 dark:hover:text-cyan-300"
    >
      {on ? <Volume2 size={18} strokeWidth={1.75} aria-hidden="true" /> : <VolumeX size={18} strokeWidth={1.75} aria-hidden="true" />}
    </button>
  );
}
