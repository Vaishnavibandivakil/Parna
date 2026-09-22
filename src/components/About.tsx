import { useEffect, useRef, type CSSProperties } from 'react';
import { asset } from '../assets';

const photos = ['29263.png', 'ac63c.png', '0c189.png', '2da04.png', 'fe1a2.png', 'cf382.png', 'd1439.png'];
const ticks = Array.from({ length: 100 });

function ArcGallery() {
  const container = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLImageElement | null)[]>([]);
  useEffect(() => {
    let frame = 0;
    const started = performance.now();
    const position = (now: number) => {
      const target = container.current;
      if (!target) return;
      const compact = window.matchMedia('(max-width: 800px)').matches;
      const radius = compact ? 320 : 945;
      const centerY = compact ? 430 : 1161;
      const progress = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : (now - started) / 34000;
      cards.current.forEach((card, index) => {
        if (!card) return;
        const phase = (index / 10 + progress) % 1;
        const degrees = 180 + phase * 180;
        const radians = degrees * Math.PI / 180;
        card.style.left = `${target.clientWidth / 2 + radius * Math.cos(radians)}px`;
        card.style.top = `${centerY + radius * Math.sin(radians)}px`;
        card.style.transform = `translate(-50%, -50%) rotate(${degrees - 270}deg)`;
      });
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) frame = requestAnimationFrame(position);
    };
    position(started);
    return () => cancelAnimationFrame(frame);
  }, []);
  return <><div className="photo-arc" ref={container} aria-hidden="true">{Array.from({ length: 10 }, (_, index) => <img key={index} ref={node => { cards.current[index] = node; }} src={asset(photos[index % photos.length])} className="carousel-card" style={{ '--card-width': `${[180,190,200,206,200,190,180][index % 7]}px`, '--card-height': `${[210,220,230,240,230,220,210][index % 7]}px` } as CSSProperties} alt="" />)}</div><div className="tick-arc" aria-hidden="true">{ticks.map((_, index) => { const angle = (202.5 + index * 1.5) * Math.PI / 180; return <img key={index} className="tick" src={asset('f2be9.svg')} style={{ left: `${Math.cos(angle) * 790}px`, top: `${Math.sin(angle) * 790 + 740}px`, transform: `rotate(${index * 1.5 + 22.5}deg)` }} alt="" />; })}</div></>;
}

export function About() {
  return <section className="about" id="about"><ArcGallery /><div className="about-copy"><span className="badge">ABOUT PARNA</span><h2>Helping people find calm, clarity,<br /> and confidence</h2><p>We believe meaningful care starts with listening. Our goal is to help our clients succeed despite stress, anxiety, and life changes.</p><a className="pill" href="#how">Learn More<span className="arrow"><img src={asset('745f4.svg')} alt="" /></span></a></div><div className="metrics">{[['12+', 'Years of Experience'], ['25+', 'Wellness Programs'], ['98%', 'Client Satisfaction'], ['1:1', 'Personalized Support']].map(([number, label]) => <div key={number}><strong>{number}</strong><span>{label}</span></div>)}</div></section>;
}
