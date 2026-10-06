import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { asset } from '../assets';
import { useCompact } from '../hooks/useCompact';
import { useLoopCarousel } from '../hooks/useLoopCarousel';

gsap.registerPlugin(ScrollTrigger);

const stories = [
  { image: '57a23.png', label: 'BOUNDARIES', title: '“I couldn’t say no without feeling guilty for days.”', description: 'She was the one everyone relied on. Every boundary felt like a betrayal, and the guilt was paralysing. We worked on where that guilt came from and whose voice it really was. Today she sets boundaries and makes big life decisions without being eaten up by it.', quote: '“The support, peaceful environment, and personalized guidance gave me the confidence to prioritize my well-being again.”', name: 'Saqib Mahmud' },
  { image: 'c015c.png', label: 'BODY & YOGA', title: '“I only started yoga to be thinner.”', description: 'She came to change her body so she’d feel more accepted. Over time, the reason changed. She started listening to her body instead of fighting it. Now she practises to feel well and to explore what she’s capable of.', quote: '“I learned how to slow down, listen to myself, and make calm part of every day.”', name: 'Maya L.' },
  { image: 'd456c.png', label: 'LETTING GO', title: '“I always had to be the one holding everything together.”', description: 'He saw himself as the rescuer, for his family and everyone else. It had made him exhausted and quietly bitter. He learned to let go of what wasn’t his to carry, and to trust that he didn’t have to control everything. The complaining gave way to understanding.', quote: '“The small changes added up. I feel more grounded and confident in my choices.”', name: 'Nina R.' },
];
function StoryCard({ story, index, cardRef }: { story: typeof stories[number]; index: number; cardRef: (node: HTMLDivElement | null) => void }) {
  const compact = useCompact();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  // On phones and tablets the benefit points fold away behind "View Details".
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    if (!compact) { gsap.set(el, { clearProps: 'height' }); return; }
    gsap.to(el, { height: open ? 'auto' : 0, duration: 0.5, ease: 'power3.inOut' });
  }, [open, compact]);

  return <article className="story-card" ref={cardRef}><div className="story-photo"><img src={asset(story.image)} loading="lazy" decoding="async" alt="" /><div className="quote"><div className="stars">{Array.from({ length: 5 }, (_, star) => <img src={asset('44c8f.svg')} alt="" key={star} />)}</div><blockquote>{story.quote}</blockquote><p><strong>{story.name}</strong> · New York, USA</p></div></div><div className="story-copy"><span className="badge">{story.label}</span><h3>{story.title}</h3>{!compact && <p>{story.description}</p>}{compact && <button type="button" className="pill story-toggle" aria-expanded={open} aria-controls={`story-benefits-${index + 1}`} onClick={() => setOpen(value => !value)}>{open ? 'Hide Details' : 'View Details'}<span className="arrow"><img src={asset('745f4.svg')} alt="" /></span></button>}<div className="benefits-wrap" ref={wrap}>{compact && <p className="story-more">{story.description}</p>}<div className="benefits" id={`story-benefits-${index + 1}`}><p><span><img src={asset('8cb78.svg')} alt="" /></span>Experience Deeper, More Restorative Sleep Every Night.</p><p><span><img src={asset('ed0b4.svg')} alt="" /></span>Follow a Personalized 8-Week Wellness & Recovery Program.</p><p><span><img src={asset('fa96c.svg')} alt="" /></span>Build Healthier Habits for a Calmer, More Balanced Everyday Life.</p></div></div></div></article>;
}
export function Stories() {
  const deck = useRef<HTMLDivElement>(null); const pin = useRef<HTMLDivElement>(null); const cards = useRef<(HTMLDivElement | null)[]>([]);
  const compact = useCompact();
  useLoopCarousel(pin, compact, stories.length);
  const copies = compact ? [0, 1, 2] : [0];
  useEffect(() => {
    const target = deck.current;
    const sticky = pin.current;
    if (!target || !sticky) return;

    const mm = gsap.matchMedia();
    mm.add('(min-width: 1025px) and (prefers-reduced-motion: no-preference)', () => {
      const stack = cards.current.filter((card): card is HTMLDivElement => Boolean(card));
      const section = target.closest<HTMLElement>('.stories');
      const heading = section?.querySelector<HTMLElement>('.stories-stack-heading');
      let stickyTop = 16;

      // Size the deck to its tallest card and pin it right under the sticky
      // heading (or drop the heading's stickiness when the viewport is short).
      const layout = () => {
        target.style.setProperty('--stack-card', '0px');
        const cardH = Math.max(612, ...stack.map((card) => card.offsetHeight));
        target.style.setProperty('--stack-card', `${cardH}px`);
        const pinH = sticky.offsetHeight;
        const headingH = heading?.offsetHeight ?? 0;
        const fits = window.innerHeight >= headingH + pinH + 24;
        section?.classList.toggle('is-compact', !fits);
        stickyTop = fits ? headingH + 8 : Math.max(16, window.innerHeight - pinH);
        target.style.setProperty('--stack-top', `${stickyTop}px`);
      };
      layout();
      const relayout = () => {
        layout();
        ScrollTrigger.refresh();
      };
      const ro = new ResizeObserver(relayout);
      stack.forEach((card) => ro.observe(card));
      if (heading) ro.observe(heading);
      window.addEventListener('resize', relayout);

      // One scrubbed timeline: each unit of time is one card landing on the deck.
      const tl = gsap.timeline({
        defaults: { ease: 'power1.inOut', duration: 1 },
        scrollTrigger: {
          trigger: target,
          start: () => `top ${stickyTop}px`,
          end: () => `bottom ${stickyTop + sticky.offsetHeight}px`,
          scrub: 1.8,
          invalidateOnRefresh: true,
        },
      });

      stack.forEach((card, index) => {
        if (index === 0) return;
        const at = index - 1;
        // The incoming card slides up from below the deck…
        tl.fromTo(card, { yPercent: 110, y: 0 }, { yPercent: 0 }, at);
        // …while every card already on the deck settles back one step,
        // so its top edge peeks out above the card covering it.
        for (let below = 0; below < index; below++) {
          const depth = index - below;
          tl.to(stack[below], { scale: 1 - depth * 0.035, y: -depth * 18 }, at);
        }
      });

      return () => {
        ro.disconnect();
        window.removeEventListener('resize', relayout);
        section?.classList.remove('is-compact');
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });

    return () => mm.revert();
  }, []);
  return <section className="stories section" id="stories"><div className="stories-stack-heading"><span className="badge">CLIENT STORIES</span><h2>Real stories of growth, healing<br /> and lasting change</h2></div><div className="story-deck" ref={deck}><div className="story-stack-pin" ref={pin}>{copies.flatMap((copy) => stories.map((story, index) => <StoryCard key={`${copy}-${story.label}`} story={story} index={copy * stories.length + index} cardRef={node => { if (copy === 0) cards.current[index] = node; }} />))}</div></div></section>;
}
