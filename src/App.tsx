import { useLayoutEffect, useRef } from 'react';
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

export default function App() {
  const root = useRef<HTMLDivElement>(null);
  const preloader = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => startSmoothScroll(), []);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    const start = () => { if (!cancelled) cleanup = initReveals(el, preloader.current); };
    // Wait for the web fonts so the line splits measure correctly, but never hang.
    Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 1500))]).then(start);
    return () => { cancelled = true; cleanup?.(); };
  }, []);

  return (
    <div ref={root}>
      <div className="preloader" ref={preloader} aria-hidden="true"><span className="preloader-word brand">Parna</span></div>
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
    </div>
  );
}
