import { useCallback, useEffect, useState } from "react";
import SkipLink from "./components/SkipLink";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import SceneBackground from "./components/SceneBackground";
import LoadingScreen from "./components/LoadingScreen";
import VisitorGate from "./components/VisitorGate";
import AssistantDock from "./components/AssistantDock";
import ConsentBanner from "./components/ConsentBanner";
import PrivacyModal from "./components/PrivacyModal";
import CustomCursor from "./components/CustomCursor";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Experience from "./sections/Experience";
import Projects from "./sections/Projects";
import Automation from "./sections/Automation";
import AILab from "./sections/AILab";
import Aerospace from "./sections/Aerospace";
import Services from "./sections/Services";
import Leadership from "./sections/Leadership";
import Education from "./sections/Education";
import TerminalSection from "./sections/TerminalSection";
import GithubSection from "./sections/Github";
import Resume from "./sections/Resume";
import Contact from "./sections/Contact";
import { hasRegistered } from "./utils/visitor";
import { blip } from "./utils/sound";
import { getConsent, track } from "./utils/analytics";
import { useSectionAnalytics } from "./hooks/useSectionAnalytics";

const SECTION_IDS = ["home", "about", "automation", "ai-lab", "aerospace", "projects", "skills", "experience", "leadership", "services", "education", "terminal", "github", "resume", "contact"];

function wasLoaded() {
  try { return sessionStorage.getItem("intro-done") === "1"; } catch { return false; }
}

export default function App() {
  const [loaded, setLoaded] = useState(wasLoaded);
  const [registered, setRegistered] = useState(hasRegistered);
  const [consent, setConsentState] = useState(getConsent);
  const entered = loaded && registered;

  const finishLoading = useCallback(() => {
    try { sessionStorage.setItem("intro-done", "1"); } catch { /* ignore */ }
    setLoaded(true);
  }, []);

  useEffect(() => {
    const onChange = () => setConsentState(getConsent());
    window.addEventListener("consent:changed", onChange);
    return () => window.removeEventListener("consent:changed", onChange);
  }, []);

  useEffect(() => { if (entered && getConsent() === "granted") track("pageview"); }, [entered]);
  useSectionAnalytics(SECTION_IDS, entered && consent === "granted");

  // Optional interface sounds (only when the visitor enabled them).
  useEffect(() => {
    const onClick = (e) => { if (e.target instanceof Element && e.target.closest("a,button")) blip(540); };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const gateOpen = loaded && !registered;

  return (
    <>
      <SkipLink />
      <SceneBackground />
      {/* Content is always rendered (good for SEO) but inert while the gate is up. */}
      <div inert={gateOpen}>
        <Navbar />
        <main id="main-content">
          <Hero />
          <About />
          <Automation />
          <AILab />
          <Aerospace />
          <Projects />
          <Skills />
          <Experience />
          <Leadership />
          <Services />
          <Education />
          <TerminalSection />
          <GithubSection />
          <Resume />
          <Contact />
        </main>
        <Footer />
        <BackToTop />
      </div>

      {!loaded && <LoadingScreen onDone={finishLoading} />}
      {gateOpen && <VisitorGate onEnter={() => setRegistered(true)} />}
      <AssistantDock greet={entered} />
      <ConsentBanner active={entered} />
      <PrivacyModal />
      <CustomCursor />
    </>
  );
}
