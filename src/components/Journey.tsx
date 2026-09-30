import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { asset } from '../assets';
import { useCompact } from '../hooks/useCompact';
import { useLoopCarousel } from '../hooks/useLoopCarousel';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    step: 'Step 01',
    title: 'Tell us where you are',
    text: 'A short, unhurried check-in about how you have been feeling and what you would like to change.',
    image: { src: 'c015c.png', alt: 'Woman enjoying a calm moment outdoors', position: '50% 40%' },
  },
  {
    step: 'Step 02',
    title: 'Get a plan built around you',
    text: 'A personal path with weekly sessions, small daily practices and clear milestones you can actually keep.',
    image: { src: '29263.png', alt: 'Man meditating on a quiet beach', position: '50% 55%' },
  },
  {
    step: 'Step 03',
    title: 'Practice with support',
    text: 'Guided exercises between sessions, and someone to reach on the days that feel heavier than others.',
    image: { src: 'd1439.png', alt: 'Man balancing in a yoga pose on a pier at sunset', position: '50% 50%' },
  },
  {
    step: 'Step 04',
    title: 'Feel the change take hold',
    text: 'Steadier sleep, calmer days and a confidence that lasts well beyond the program.',
    image: { src: '0c189.png', alt: 'Man with open arms on a beach', position: '50% 40%' },
  },
];

export function Journey() {
  const grid = useRef<HTMLDivElement>(null);
  const compact = useCompact();
  useLoopCarousel(grid, compact, steps.length);
  const copies = compact ? [0, 1, 2] : [0];

  useEffect(() => {
    const el = grid.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // The whole grid rises as one block so the rows stay perfectly level;
      // only the fade is staggered.
      const cards = el.querySelectorAll('article');
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 80%', once: true } });
      tl.from(el, { y: 28, duration: 0.8, ease: 'power3.out' }, 0)
        .from(cards, { autoAlpha: 0, duration: 0.6, ease: 'power2.out', stagger: 0.08 }, 0);
      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="how section" id="how">
      <div className="section-heading">
        <span className="badge">HOW PARNA PRESENCE WORKS</span>
        <h2>Your journey to feeling<br />better starts here</h2>
      </div>
      <div className="journey-grid" ref={grid}>
        {copies.flatMap((copy) => steps.map((item) => (
          <article className="journey-photo" key={`${copy}-${item.step}`} aria-hidden={copy !== 1 && compact ? true : undefined}>
            <img src={asset(item.image.src)} alt={item.image.alt} style={{ objectPosition: item.image.position }} />
            <span className="journey-step">{item.step}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        )))}
      </div>
    </section>
  );
}
