import { useEffect, useRef, useState } from 'react';
import { About } from './components/About';
import { initReveals } from './animations/reveal';
import { startSmoothScroll } from './animations/smoothScroll';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Journey } from './components/Journey';
import { Programs } from './components/Programs';
import { Services } from './components/Services';
import { Stories } from './components/Stories';
import { Transformation } from './components/Transformation';
import { whatsappUrl } from './contact';

export default function App() {
  const root = useRef<HTMLDivElement>(null);
  const [showWhatsApp, setShowWhatsApp] = useState(false);

  useEffect(() => startSmoothScroll(), []);

  useEffect(() => {
    const about = document.getElementById('about');
    if (!about) return;
    const update = () => setShowWhatsApp(about.getBoundingClientRect().top <= 0);
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    const start = () => { if (!cancelled) cleanup = initReveals(el); };
    // Below-the-fold line splits need font metrics; the hero remains visible while fonts load.
    Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 1500))]).then(start);
    return () => { cancelled = true; cleanup?.(); };
  }, []);

  return (
    <div ref={root}>
      <main>
        <Hero />
        <About />
        <Journey />
        <Services />
        <Transformation />
        <Stories />
        <Programs />
      </main>
      <Footer />
      {showWhatsApp && <a
        className="whatsapp-float"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Parna on WhatsApp"
      >
        <img src="/assets/whatsapp-canva.png" width="32" height="32" alt="" />
      </a>}
    </div>
  );
}
