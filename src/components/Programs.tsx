import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { asset } from '../assets';
import { useCompact } from '../hooks/useCompact';
import { CarouselControls } from './CarouselControls';

gsap.registerPlugin(ScrollTrigger);

type ProgramCard = {
  title: string;
  text: string;
  intro: string;
  points: string[];
  format: string;
  premium?: boolean;
};

const cards: ProgramCard[] = [
  {
    title: 'Single Session',
    text: '₹3,000 · 90 minutes · 1:1 online',
    intro: 'You tell me what’s going on, in your own words and at your own pace. I’ll ask questions, help you see what’s underneath, and share what I notice. Before we finish, we’ll agree on a clear next step.',
    points: [
      'One 90-minute private session, online',
      'Questions that help you see what’s underneath',
      'A clear next step agreed before we finish: more sessions, the programme, a practice to try, or a referral if someone else is better suited',
    ],
    format: 'What’s included',
  },
  {
    title: 'Transformation & Heart Activation Programme',
    text: '7 sessions × 90 minutes · 1:1 online',
    premium: true,
    intro: 'Over seven sessions we move through all four stages of the C.A.R.E. method, at a pace that suits you. We look at your patterns and beliefs, work through what’s been held in, and build practices that fit your life.',
    points: [
      'Seven 90-minute private sessions',
      'A clear picture of the patterns and beliefs holding you back',
      'Personalised practices chosen for you (meditation, NLP, EFT, energy work or yoga, as needed)',
      'Simple work to do between sessions, so change continues outside the room',
    ],
    format: 'What’s included',
  },
  {
    title: 'Private Yoga',
    text: '₹12,000/month · 12 sessions · 1:1 online',
    intro: 'We build a practice around your body, your health and your pace. Clients often arrive wanting to change their shape. Most stay because they start to trust and enjoy their body again.',
    points: [
      'Twelve private online sessions a month',
      'A practice built around your body, your health and your pace',
      'Sequences that grow as your strength and trust in your body do',
    ],
    format: 'What’s included',
  },
];

/** Show a matching still while each clip loads as it enters the viewport. */
const clips = [
  { src: 'parna-7658-loop', poster: 'videos/parna-7658.webp', label: 'Parna standing by a leafy balcony' },
  { src: 'parna-7667-loop', poster: 'videos/parna-7667.webp', label: 'Parna reading on a sofa' },
  { src: 'parna-7685-loop', poster: 'videos/parna-7685.webp', label: 'Parna looking out from a balcony' },
];

function Clip({ clip }: { clip: typeof clips[number] }) {
  return (
    <video
      className="program-video"
      muted
      autoPlay
      loop
      playsInline
      preload="none"
      poster={asset(clip.poster)}
      data-src={`/assets/videos/${clip.src}.mp4`}
      aria-label={clip.label}
      onEnded={(event) => {
        const video = event.currentTarget;
        video.currentTime = 0;
        video.play().catch(() => {});
      }}
    />
  );
}

function Card({ card, index }: { card: ProgramCard; index: number }) {
  return (
    <article aria-expanded={false}>
      <div className="program-panel">
        {card.premium && <span className="program-premium">PREMIUM</span>}
        <h3>{card.title}</h3>
        <p>{card.text}</p>
        <button className="program-more" type="button" aria-expanded={false} aria-controls={`program-details-${index + 1}`}>
          <span className="more-label">Know more</span><span className="less-label">Show less</span>
          <span className="program-more-arrow" aria-hidden>→</span>
        </button>
        <div className="program-details" id={`program-details-${index + 1}`}>
          <div className="program-details-inner">
            <p className="program-intro">{card.intro}</p>
            {card.format && <p className="program-format">{card.format}</p>}
            {card.points.length > 0 && <ul>
              {card.points.map((point) => <li key={point}>{point}</li>)}
            </ul>}
            <a className="program-cta" href="#newsletter">Talk to us about this program <span aria-hidden>→</span></a>
          </div>
        </div>
      </div>
    </article>
  );
}

export function Programs() {
  const grid = useRef<HTMLDivElement>(null);
  const compact = useCompact();

  useEffect(() => {
    const el = grid.current;
    if (!el) return;

    // Attaching a source only when visible prevents offscreen clips from downloading.
    const videos = Array.from(el.querySelectorAll<HTMLVideoElement>('video'));
    const io = new IntersectionObserver(
      (entries) => entries.forEach(({ target, isIntersecting }) => {
        const video = target as HTMLVideoElement;
        if (isIntersecting) {
          if (!video.src && video.dataset.src) video.src = video.dataset.src;
          video.play().catch(() => {});
        }
        else {
          video.pause();
          if (video.readyState > 0) video.currentTime = 0;
        }
      }),
      { threshold: 0 },
    );
    videos.forEach((video) => io.observe(video));

    const boxes = Array.from(el.querySelectorAll<HTMLElement>('article'));
    // In the 3-column checkerboard the third text box is the only one on the
    // bottom row, so it extends upward; the other two extend downward.
    const rows: boolean[] = [];
    const syncRows = () => {
      const layout = getComputedStyle(el);
      const columns = layout.display === 'grid' ? layout.gridTemplateColumns.split(' ').length : 1;
      boxes.forEach((box, i) => {
        const fromBottom = columns >= 3 && i === 2;
        rows[i] = fromBottom;
        const panel = box.querySelector('.program-panel');
        panel?.classList.remove('anchor-top', 'anchor-bottom');
        panel?.classList.add(fromBottom ? 'anchor-bottom' : 'anchor-top');
        box.dataset.anchor = fromBottom ? 'bottom' : 'top';
      });
    };
    syncRows();
    window.addEventListener('resize', syncRows);

    const mm = gsap.matchMedia();
    const cleanups: Array<() => void> = [];

    mm.add('(min-width: 1025px) and (prefers-reduced-motion: no-preference)', () => {
      // 1) Scroll reveal: the text panels unfold in place as the grid enters.
      const tl = gsap.timeline({
        defaults: { ease: 'power2.out', duration: 1 },
        scrollTrigger: { trigger: el, start: 'top 82%', end: 'top 28%', scrub: 1.3 },
      });
      boxes.forEach((box, i) => {
        const panel = box.querySelector<HTMLElement>('.program-panel')!;
        const fromBottom = rows[i];
        const at = i * 0.35;
        tl.fromTo(panel, { clipPath: fromBottom ? 'inset(100% 0 0 0)' : 'inset(0 0 100% 0)' }, { clipPath: 'inset(0% 0 0% 0)' }, at)
          .fromTo(panel.querySelectorAll(':scope > .program-premium, :scope > h3, :scope > p, :scope > .program-more'), { y: fromBottom ? -28 : 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.08 }, at + 0.25);
      });
      tl.fromTo(videos, { scale: 1.08, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, stagger: 0.25 }, 0.15);

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });

    // 2) The button expands the details in place on phones and over the
    //    neighbouring tile on desktop.
    const tiles = Array.from(el.children) as HTMLElement[];
    boxes.forEach((box, i) => {
      const panel = box.querySelector<HTMLElement>('.program-panel')!;
      const more = panel.querySelector<HTMLButtonElement>('.program-more')!;
      const details = panel.querySelector<HTMLElement>('.program-details')!;
      const items = Array.from(details.querySelector('.program-details-inner')!.children);
      const isDesktop = () => {
        const layout = getComputedStyle(el);
        return layout.display === 'grid' && layout.gridTemplateColumns.split(' ').length >= 3;
      };

      /** Full height of this card's column: its own cell plus the tile above/below it. */
      const columnHeight = () => {
        const mine = box.getBoundingClientRect();
        let top = mine.top;
        let bottom = mine.bottom;
        tiles.forEach((tile) => {
          if (tile === box) return;
          const r = tile.getBoundingClientRect();
          const overlapsColumn = r.left < mine.right - 1 && r.right > mine.left + 1;
          if (overlapsColumn) {
            top = Math.min(top, r.top);
            bottom = Math.max(bottom, r.bottom);
          }
        });
        return bottom - top;
      };

      /** Freeze the title/summary where they currently sit, then grow from there. */
      const pinHead = () => {
        const head = Array.from(panel.children).filter((c) => c !== details) as HTMLElement[];
        const first = head[0];
        const last = head[head.length - 1];
        if (rows[i]) {
          const bottomGap = panel.clientHeight - (last.offsetTop + last.offsetHeight);
          panel.style.justifyContent = 'flex-end';
          panel.style.paddingBottom = `${bottomGap}px`;
          details.style.order = '-1';
        } else {
          const topGap = first.offsetTop;
          panel.style.justifyContent = 'flex-start';
          panel.style.paddingTop = `${topGap}px`;
          details.style.order = '';
        }
      };
      const releaseHead = () => {
        panel.style.justifyContent = '';
        panel.style.paddingTop = '';
        panel.style.paddingBottom = '';
        details.style.order = '';
      };

      /* Desktop: the panel is laid out at full size once, then revealed with a
         clip mask (no per-frame layout), which keeps the text crisp and smooth. */
      const reveal = gsap.timeline({
        paused: true,
        onStart: () => { box.style.zIndex = '5'; box.setAttribute('aria-expanded', 'true'); more.setAttribute('aria-expanded', 'true'); panel.classList.add('is-open'); },
        onReverseComplete: () => {
          box.style.zIndex = '';
          box.setAttribute('aria-expanded', 'false');
          more.setAttribute('aria-expanded', 'false');
          panel.classList.remove('is-open');
          panel.style.height = '';
          panel.style.clipPath = '';
          details.style.height = '';
          releaseHead();
        },
      });
      reveal
        .to(panel, { clipPath: 'inset(0px 0px 0px 0px)', duration: 0.6, ease: 'power3.out' }, 0)
        .fromTo(items, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, stagger: 0.05, ease: 'none' }, 0.15);

      /* Phones: the panel sits inline, so it simply grows to fit its details. */
      const expand = gsap.timeline({
        paused: true,
        onStart: () => { box.setAttribute('aria-expanded', 'true'); more.setAttribute('aria-expanded', 'true'); panel.classList.add('is-open'); },
        onReverseComplete: () => { box.setAttribute('aria-expanded', 'false'); more.setAttribute('aria-expanded', 'false'); panel.classList.remove('is-open'); },
      });
      expand
        .to(details, { height: 'auto', duration: 0.5, ease: 'power2.inOut' }, 0)
        .fromTo(items, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, stagger: 0.04, ease: 'none' }, 0.15);

      let active: gsap.core.Timeline | null = null;
      const show = () => {
        if (active && active.progress() > 0) { active.play(); return; }
        if (isDesktop()) {
          const cell = box.getBoundingClientRect().height;
          const full = columnHeight();
          pinHead();
          details.style.height = 'auto';
          // The copy can be taller than the two grid tiles at narrower desktop
          // widths. Measure its natural height before applying the reveal mask.
          panel.style.height = 'max-content';
          const expanded = Math.max(full, panel.getBoundingClientRect().height);
          const hidden = Math.max(0, expanded - cell);
          panel.style.height = `${expanded}px`;
          box.style.setProperty('--panel-h', `${expanded}px`);
          panel.style.clipPath = rows[i] ? `inset(${hidden}px 0px 0px 0px)` : `inset(0px 0px ${hidden}px 0px)`;
          reveal.invalidate();
          active = reveal;
        } else {
          active = expand;
        }
        active.play();
      };
      const hide = () => active?.reverse();
      const toggle = () => (!active || active.reversed() || active.progress() === 0 ? show() : hide());

      const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') hide(); };
      more.addEventListener('click', toggle);
      more.addEventListener('keydown', onKeyDown);

      cleanups.push(() => {
        more.removeEventListener('click', toggle);
        more.removeEventListener('keydown', onKeyDown);
        reveal.kill();
        expand.kill();
        panel.classList.remove('is-open');
        releaseHead();
        box.style.zIndex = '';
      });
    });

    return () => {
      io.disconnect();
      window.removeEventListener('resize', syncRows);
      cleanups.forEach((fn) => fn());
      mm.revert();
    };
  }, [compact]);

  return (
    <section className="programs section" id="programs">
      <div className="programs-heading">
        <span className="badge section-badge">WAYS TO WORK TOGETHER</span>
        <h2>Sessions and programmes</h2>
      </div>
      <CarouselControls target={grid} label="sessions and programmes" />
      <div className="program-grid" ref={grid}>
        <Card card={cards[0]} index={0} />
        <Clip clip={clips[0]} />
        <Card card={cards[1]} index={1} />
        <Clip clip={clips[1]} />
        <Card card={cards[2]} index={2} />
        <Clip clip={clips[2]} />
      </div>
    </section>
  );
}
