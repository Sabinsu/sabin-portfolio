import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import {
  Maximize2, Mic, MicOff, Minimize2, Minus, Send, Trash2, Volume2, VolumeX, X, Square, Sparkles,
} from "lucide-react";
import RobotAvatarFallback from "./RobotAvatarFallback";
import { GREETING, answerLocally, suggestedQuestions } from "../data/knowledge";
import { usePointerRef } from "../hooks/usePointer";
import { useSpeech, sttSupported, ttsSupported } from "../hooks/useSpeech";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { hasWebGL } from "../utils/webgl";
import { track } from "../utils/analytics";
import { cn } from "../utils/cn";

const Robot = lazy(() => import("./three/Robot"));

const URL_RE = /(https?:\/\/[^\s)]+)/g;
let uid = 0;
const nextId = () => ++uid;

function Linkified({ text }) {
  return text.split(URL_RE).map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="break-all text-brand-500 underline dark:text-cyan-300">
        {part}
      </a>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

async function askServer(history) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    if (!data.reply) throw new Error("empty");
    return data.reply;
  } finally {
    clearTimeout(timer);
  }
}

export default function AssistantDock({ greet }) {
  const pointer = usePointerRef();
  const reduced = usePrefersReducedMotion();
  const [robotReady, setRobotReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [large, setLarge] = useState(false);
  const [bubble, setBubble] = useState(false);
  const [messages, setMessages] = useState([{ id: nextId(), role: "assistant", text: GREETING }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("unknown"); // unknown | ai | faq
  const [expression, setExpression] = useState("neutral");
  const [voiceMode, setVoiceMode] = useState(false);
  const [muted, setMuted] = useState(false);
  const [pseudoSpeaking, setPseudoSpeaking] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const sendRef = useRef(null);

  const speech = useSpeech({
    onResult: (t) => sendRef.current?.(t),
    onError: (msg) => setMessages((m) => [...m, { id: nextId(), role: "assistant", text: msg }]),
  });
  const speaking = speech.speaking || pseudoSpeaking;

  // Mount the 3D robot only once the page is idle and WebGL is available.
  useEffect(() => {
    if (reduced || !hasWebGL()) return;
    const t = setTimeout(() => setRobotReady(true), 1800);
    return () => clearTimeout(t);
  }, [reduced]);

  // Greeting speech bubble after the visitor enters.
  useEffect(() => {
    if (!greet) return;
    let shown = false;
    try { shown = sessionStorage.getItem("assistant-greeted") === "1"; } catch { /* ignore */ }
    if (shown) return;
    try { sessionStorage.setItem("assistant-greeted", "1"); } catch { /* ignore */ }
    const t1 = setTimeout(() => { setBubble(true); setExpression("happy"); }, 900);
    const t2 = setTimeout(() => { setBubble(false); setExpression("neutral"); }, 14000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [greet]);

  const openChat = useCallback(() => {
    setOpen(true);
    setMinimized(false);
    setBubble(false);
    track("assistant_open");
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  // Let any part of the site open the assistant (nav button, hero button, terminal...).
  useEffect(() => {
    const handler = (e) => {
      openChat();
      if (e.detail?.question) setTimeout(() => sendRef.current?.(e.detail.question), 150);
    };
    window.addEventListener("assistant:open", handler);
    return () => window.removeEventListener("assistant:open", handler);
  }, [openChat]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [messages, loading, open, minimized, reduced]);

  const send = useCallback(
    async (raw) => {
      const text = (raw ?? "").trim().slice(0, 500);
      if (!text || loading) return;
      speech.stopSpeaking();
      const history = [...messages, { role: "user", text }]
        .slice(-10)
        .map((m) => ({ role: m.role, content: m.text }));
      setMessages((m) => [...m, { id: nextId(), role: "user", text }]);
      setInput("");
      setLoading(true);
      setExpression("thinking");
      track("assistant_question");

      let reply;
      try {
        const text = await askServer(history);
        reply = { text, links: [], expression: "happy" };
        setMode("ai");
      } catch {
        reply = answerLocally(text);
        setMode("faq");
      }
      setLoading(false);
      setMessages((m) => [...m, { id: nextId(), role: "assistant", ...reply }]);
      setExpression(reply.expression || "happy");
      setTimeout(() => setExpression("neutral"), 5000);

      if (voiceMode && !muted && ttsSupported) {
        speech.speak(reply.text);
      } else {
        // lively mouth animation even without audio
        setPseudoSpeaking(true);
        setTimeout(() => setPseudoSpeaking(false), Math.min(3500, 600 + reply.text.length * 25));
      }
    },
    [messages, loading, speech, voiceMode, muted]
  );
  useEffect(() => { sendRef.current = send; });

  const clearChat = () => {
    speech.stopSpeaking();
    setMessages([{ id: nextId(), role: "assistant", text: GREETING }]);
    setMode("unknown");
    setExpression("neutral");
  };

  const robotView = robotReady ? (
    <Suspense fallback={<RobotAvatarFallback speaking={speaking} />}>
      <Robot pointer={pointer} speaking={speaking} expression={expression} />
    </Suspense>
  ) : (
    <RobotAvatarFallback speaking={speaking} />
  );

  return (
    <div className="safe-bottom pointer-events-none fixed bottom-4 right-3 z-40 flex flex-col items-end gap-3 sm:right-5">
      {/* greeting bubble */}
      {bubble && !open && (
        <div role="status" className="glass-strong pointer-events-auto relative max-w-[17rem] rounded-2xl p-4 text-sm leading-relaxed text-ink-700 shadow-xl dark:text-slate-200 sm:max-w-xs">
          <button type="button" onClick={() => setBubble(false)} aria-label="Dismiss greeting" className="absolute right-2 top-2 text-ink-400 hover:text-brand-500">
            <X size={14} aria-hidden="true" />
          </button>
          <p className="pr-4">{GREETING}</p>
          <button type="button" onClick={openChat} className="mt-3 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600">
            Chat with me
          </button>
        </div>
      )}

      {/* chat window */}
      {open && (
        <section
          aria-label="AI assistant chat"
          className={cn(
            "glass-strong neon-border pointer-events-auto flex flex-col overflow-hidden rounded-2xl shadow-2xl",
            "w-[calc(100vw-1.5rem)] sm:w-[380px]",
            minimized ? "h-auto" : large ? "h-[min(78dvh,640px)] sm:w-[520px]" : "h-[min(72dvh,540px)]"
          )}
        >
          <header className="flex items-center gap-2 border-b border-ink-300/15 px-4 py-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="truncate font-display text-sm font-semibold text-ink-900 dark:text-white">Sabin&apos;s AI Assistant</h2>
              <p className="font-mono text-[10px] uppercase tracking-wider text-ink-400">
                {mode === "ai" ? "AI online" : mode === "faq" ? "FAQ mode" : "Ready"}
              </p>
            </div>
            <IconBtn label={large ? "Shrink chat" : "Enlarge chat"} onClick={() => setLarge((v) => !v)} className="hidden sm:flex">
              {large ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </IconBtn>
            <IconBtn label={minimized ? "Restore chat" : "Minimize chat"} onClick={() => setMinimized((v) => !v)}>
              <Minus size={14} />
            </IconBtn>
            <IconBtn label="Clear conversation" onClick={clearChat}><Trash2 size={14} /></IconBtn>
            <IconBtn label="Close chat" onClick={() => { setOpen(false); speech.stopSpeaking(); }}><X size={14} /></IconBtn>
          </header>

          {!minimized && (
            <>
              <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
                {messages.map((m) => (
                  <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                    <div
                      className={cn(
                        "max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                        m.role === "user"
                          ? "rounded-br-md bg-brand-500 text-white"
                          : "rounded-bl-md border border-ink-300/15 bg-ink-100/70 text-ink-800 dark:bg-ink-800/80 dark:text-slate-100"
                      )}
                    >
                      <p className="whitespace-pre-line"><Linkified text={m.text} /></p>
                      {m.links?.filter((l) => l.href).length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {m.links.filter((l) => l.href).map((l) => (
                            <a
                              key={l.label}
                              href={l.href}
                              {...(l.href.startsWith("#") ? { onClick: () => window.innerWidth < 640 && setOpen(false) } : { target: l.href.startsWith("mailto:") || l.href.startsWith("tel:") ? undefined : "_blank", rel: "noopener noreferrer" })}
                              className="inline-flex min-h-9 items-center rounded-md border border-brand-500/30 bg-brand-500/10 px-3 text-xs font-medium text-brand-600 hover:bg-brand-500/20 dark:text-cyan-300"
                            >
                              {l.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start" role="status" aria-label="Assistant is typing">
                    <div className="flex gap-1 rounded-2xl rounded-bl-md border border-ink-300/15 bg-ink-100/70 px-4 py-3 dark:bg-ink-800/80">
                      {[0, 150, 300].map((d) => (
                        <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-500" style={{ animationDelay: `${d}ms` }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {messages.length <= 1 && (
                <div className="flex gap-2 overflow-x-auto px-4 pb-2" aria-label="Suggested questions">
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => send(q)}
                      className="min-h-10 shrink-0 rounded-full border border-brand-500/30 px-4 py-2 text-sm text-ink-600 hover:border-brand-500 hover:text-brand-500 dark:text-slate-300"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-1 px-3 pt-1 text-ink-400">
                {ttsSupported && (
                  <IconBtn
                    label={voiceMode ? "Switch to text-only mode" : "Enable voice replies"}
                    pressed={voiceMode}
                    onClick={() => { setVoiceMode((v) => !v); speech.stopSpeaking(); }}
                  >
                    <Sparkles size={14} />
                  </IconBtn>
                )}
                {voiceMode && ttsSupported && (
                  <>
                    <IconBtn label={muted ? "Unmute voice" : "Mute voice"} onClick={() => { setMuted((v) => !v); speech.stopSpeaking(); }}>
                      {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    </IconBtn>
                    {speech.speaking && <IconBtn label="Stop speaking" onClick={speech.stopSpeaking}><Square size={14} /></IconBtn>}
                  </>
                )}
                <span className="ml-1 font-mono text-[10px] uppercase tracking-wider">
                  {voiceMode ? (muted ? "Voice muted" : "Voice on") : "Text only"}
                </span>
              </div>

              <form
                onSubmit={(e) => { e.preventDefault(); send(input); }}
                className="flex items-center gap-2 border-t border-ink-300/15 p-3"
              >
                <label htmlFor="assistant-input" className="sr-only">Ask about Sabin</label>
                <input
                  id="assistant-input"
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  maxLength={500}
                  placeholder="Ask about Sabin…"
                  autoComplete="off"
                  className="h-12 min-w-0 flex-1 rounded-xl border border-ink-300/25 bg-white/80 px-4 text-base text-ink-900 outline-none focus:border-brand-500 dark:bg-ink-900/70 dark:text-white"
                />
                {voiceMode && sttSupported && (
                  <IconBtn
                    label={speech.listening ? "Stop listening" : "Speak your question"}
                    pressed={speech.listening}
                    onClick={speech.listening ? speech.stopListening : speech.startListening}
                    className="h-12 w-12 border border-ink-300/25"
                  >
                    {speech.listening ? <MicOff size={16} /> : <Mic size={16} />}
                  </IconBtn>
                )}
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  aria-label="Send message"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white hover:bg-brand-600 active:scale-95 disabled:opacity-50"
                >
                  <Send size={16} aria-hidden="true" />
                </button>
              </form>
            </>
          )}
        </section>
      )}

      {/* robot launcher */}
      <button
        type="button"
        onClick={open ? () => setMinimized(false) || inputRef.current?.focus() : openChat}
        aria-label={open ? "AI assistant is open" : "Open AI assistant"}
        aria-expanded={open}
        className={cn("neon-border glass-strong pointer-events-auto relative h-24 w-24 overflow-hidden rounded-full shadow-xl transition-transform hover:scale-105 active:scale-95 sm:h-28 sm:w-28", open && "max-sm:hidden")}
      >
        {robotView}
        <span className="absolute inset-x-0 bottom-0 bg-ink-900/70 py-0.5 text-center font-mono text-[9px] uppercase tracking-widest text-cyan-300">Ask AI</span>
      </button>
    </div>
  );
}

function IconBtn({ label, onClick, children, pressed, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-ink-500 sm:h-8 sm:w-8 transition-colors hover:bg-brand-500/10 hover:text-brand-500 dark:text-slate-300",
        pressed && "bg-brand-500/15 text-brand-500",
        className
      )}
    >
      {children}
    </button>
  );
}
