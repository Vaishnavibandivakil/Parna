import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { asset } from '../assets';

const photos = ['about-6.webp', 'about-2-480.webp', 'about-7.webp', 'about-8.webp', 'about-4-480.webp', 'about-9.webp'];
const ticks = Array.from({ length: 100 });

type ArcMode = 'compact' | 'tablet' | 'normal' | 'wide';

/** Arc geometry per screen size. "normal" is the original design; "wide" opens the
 *  semicircle up for very wide screens, with the dotted guide on the same circle. */
const ARC = {
  compact: { radius: 335, centerY: 430, cards: 7, cardScale: 0.7, tickRadius: 254, tickCenterY: 430, tickStart: 190, tickSpan: 160, tickCount: 64 },
  tablet: { radius: 560, centerY: 700, cards: 9, cardScale: 0.88, tickRadius: 458, tickCenterY: 700, tickStart: 190, tickSpan: 160, tickCount: 88 },
  normal: { radius: 945, centerY: 1161, cards: 10, cardScale: 1, tickRadius: 790, tickCenterY: 1161, tickStart: 202.5, tickSpan: 148.5, tickCount: 100 },
  wide: { radius: 800, centerY: 1000, cards: 10, cardScale: 1, tickRadius: 660, tickCenterY: 1000, tickStart: 190, tickSpan: 160, tickCount: 100 },
};
const TICK_ARC_TOP = 421; // matches .tick-arc{top} in styles.css

const modeFor = () => (window.matchMedia('(max-width: 800px)').matches ? 'compact' : window.matchMedia('(max-width: 1024px)').matches ? 'tablet' : window.matchMedia('(min-width: 1700px)').matches ? 'wide' : 'normal') as ArcMode;

function ArcGallery() {
  const container = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLImageElement | null)[]>([]);
  const [mode, setMode] = useState<ArcMode>('normal');
  const modeRef = useRef(mode);
  modeRef.current = mode;

  useEffect(() => {
    const onResize = () => setMode(modeFor());
    window.addEventListener('resize', onResize);
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    let frame = 0;
    let visible = false;
    const started = performance.now();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const position = (now: number) => {
      frame = 0;
      const target = container.current;
      if (!target) return;
      const { radius, centerY, cardScale, cards: count } = ARC[modeRef.current];
      // Read layout once, before changing any card styles in this frame.
      const centerX = target.clientWidth / 2;
      const progress = reduce ? 0 : (now - started) / 34000;
      cards.current.forEach((card, index) => {
        if (!card) return;
        // Fewer photos on small screens: hide the extras and space the rest evenly.
        const hidden = index >= count;
        card.style.display = hidden ? 'none' : '';
        if (hidden) return;
        const phase = (index / count + progress) % 1;
        const degrees = 180 + phase * 180;
        const radians = degrees * Math.PI / 180;
        card.style.left = `${centerX + radius * Math.cos(radians)}px`;
        card.style.top = `${centerY + radius * Math.sin(radians)}px`;
        card.style.transform = `translate(-50%, -50%) rotate(${degrees - 270}deg) scale(${cardScale})`;
        // On wide screens the ends are on screen, so photos fade in and out there.
        card.style.opacity = modeRef.current === 'wide' ? String(Math.min(1, Math.sin(phase * Math.PI) * 2.2)) : '';
      });
      if (!reduce && visible) frame = requestAnimationFrame(position);
    };
    position(started);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !reduce && !frame) frame = requestAnimationFrame(position);
      if (!visible && frame) { cancelAnimationFrame(frame); frame = 0; }
    }, { rootMargin: '200px 0px' });
    if (container.current) observer.observe(container.current);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, []);

  const { tickRadius, tickCenterY, tickStart, tickSpan, tickCount } = ARC[mode];
  const tickList = ticks.slice(0, tickCount);
  return <><div className="photo-arc" ref={container} aria-hidden="true">{Array.from({ length: 10 }, (_, index) => <img key={index} ref={node => { cards.current[index] = node; }} src={asset(photos[index % photos.length])} loading="lazy" decoding="async" className="carousel-card" style={{ '--card-width': `${[180,190,200,206,200,190,180][index % 7]}px`, '--card-height': `${[210,220,230,240,230,220,210][index % 7]}px` } as CSSProperties} alt="" />)}</div><div className="tick-arc" aria-hidden="true">{tickList.map((_, index) => { const degrees = tickStart + index * (tickSpan / (tickList.length - 1)); const angle = degrees * Math.PI / 180; return <img key={index} className="tick" src={asset('f2be9.svg')} style={{ left: `${Math.cos(angle) * tickRadius}px`, top: `${Math.sin(angle) * tickRadius + (tickCenterY - TICK_ARC_TOP)}px`, transform: `rotate(${degrees - 180}deg)` }} alt="" />; })}</div></>;
}

export function About() {
  return <section className="about" id="about"><ArcGallery /><div className="about-copy"><span className="badge">ABOUT PARNA PRESENCE</span><h2>Holistic life coaching and healing<br /> for deeply sensitive &amp; curious souls</h2><p>I believe meaningful care starts with listening. My goal is to help clients find ways to succeed despite life’s challenges.</p><a className="pill" href="#how">Learn More<span className="arrow"><img src={asset('745f4.svg')} alt="" /></span></a></div><div className="metrics">{[['5+', 'Years of practice'], ['50+', 'Clients supported'], ['1:1', 'Sessions in English, Hindi and Bengali']].map(([number, label]) => <div key={number}><strong>{number}</strong><span>{label}</span></div>)}</div></section>;
}
