import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { asset } from '../assets';
import { ProgramDialog } from './ProgramDialog';
import { feelingToProgram, programs } from '../data/programs';
import { smoothScroll } from '../animations/smoothScroll';

gsap.registerPlugin(ScrollTrigger);

const HeroScene = lazy(() => import('./HeroScene').then(({ HeroScene }) => ({ default: HeroScene })));

export function Hero() {
  const [showScene, setShowScene] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [choicesOpen, setChoicesOpen] = useState(false);
  const [dialog, setDialog] = useState<{ open: boolean; index: number }>({ open: false, index: 0 });
  const choices = useRef<HTMLDivElement>(null);
  const feelings = ['Constant Stress', 'Trouble Sleeping', 'Self Doubt', 'Emotional Burnout', 'Feeling Overwhelmed'];

  useEffect(() => {
    // The CSS gradient is the complete mobile and reduced-motion experience.
    // Only add the costly WebGL texture on larger screens after the page settles.
    const media = window.matchMedia('(min-width: 1025px) and (prefers-reduced-motion: no-preference)');
    let timer = 0;
    const update = () => {
      window.clearTimeout(timer);
      if (media.matches) timer = window.setTimeout(() => setShowScene(true), 6000);
      else setShowScene(false);
    };
    media.addEventListener('change', update);
    update();
    return () => { window.clearTimeout(timer); media.removeEventListener('change', update); };
  }, []);

  // The choices stay folded under the question until the visitor scrolls a little
  // (or taps the question). Picking one opens the matching program's details.
  useEffect(() => {
    let scrollTimer = 0;
    const idleTimer = window.setTimeout(() => setChoicesOpen(true), 2500);
    const trigger = ScrollTrigger.create({
      start: 40,
      once: true,
      onEnter: () => { scrollTimer = window.setTimeout(() => setChoicesOpen(true), 600); },
    });
    return () => { window.clearTimeout(idleTimer); window.clearTimeout(scrollTimer); trigger.kill(); };
  }, []);
  useEffect(() => {
    const el = choices.current;
    if (!el) return;
    gsap.to(el, { height: choicesOpen ? 'auto' : 0, duration: 0.7, ease: 'power3.inOut' });
    gsap.to(el.querySelectorAll('button'), { autoAlpha: choicesOpen ? 1 : 0, y: choicesOpen ? 0 : 8, duration: 0.45, stagger: choicesOpen ? 0.05 : 0, delay: choicesOpen ? 0.2 : 0, ease: 'power2.out' });
  }, [choicesOpen]);
  const startJourney = (event: React.MouseEvent) => {
    event.preventDefault();
    setChoicesOpen(true);
    smoothScroll.to('#assessment', -160);
  };
  const pickFeeling = (index: number) => {
    setSelected(index);
    setDialog({ open: true, index: feelingToProgram[feelings[index]] ?? 0 });
  };
  return <section className="hero" id="home">
    <img className="hero-bg" src={asset('hero-bg-optimized.webp')} fetchPriority="high" alt="" />
    <div className="hero-panel">
      {showScene && <Suspense fallback={null}><HeroScene /></Suspense>}
      <a className="brand" href="#home">Parna</a>
      <div className="hero-copy">
        <p className="hero-eyebrow">Hi, I'm Parna.</p>
        <h1>A certified <em>life coach</em><br />and <em>healer</em>.</h1>
        <p>I help people stop resisting life and move through it with more ease.</p>
        <a className="hero-cta" href="#assessment" onClick={startJourney}>START YOUR JOURNEY<span aria-hidden>→</span></a>
        <div className="feelings" id="assessment">
          <button type="button" className="feelings-question" aria-expanded={choicesOpen} aria-controls="feeling-choices" onClick={() => setChoicesOpen(value => !value)}>
            <h2>How are you feeling today?</h2>
            <span className="feelings-toggle" aria-hidden>+</span>
          </button>
          <div className="feeling-choices" id="feeling-choices" ref={choices}>
            <div className="feeling-list">{feelings.map((feeling, index) => <button key={feeling} type="button" aria-pressed={selected === index} onClick={() => pickFeeling(index)}>+ &nbsp; {feeling}</button>)}</div>
          </div>
        </div>
      </div>
    </div>
    <ProgramDialog open={dialog.open} index={dialog.index} programs={programs} onClose={() => setDialog(current => ({ ...current, open: false }))} />
  </section>;
}
