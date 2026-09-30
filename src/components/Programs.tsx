import { Fragment, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { asset } from '../assets';
import { useCompact } from '../hooks/useCompact';
import { useLoopCarousel } from '../hooks/useLoopCarousel';

gsap.registerPlugin(ScrollTrigger);

const cards = [
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
    text: '₹35,000–₹50,000 · 7 sessions × 90 minutes · 1:1 online',
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

/** Clips live in /public/assets/videos; the poster image shows until a clip exists. */
const clips = [
  { src: 'program-1', poster: '1360c.png', label: 'A peaceful moment beside the sea' },
  { src: 'program-2', poster: '79171.png', label: 'Sunlight entering a quiet room' },
  { src: 'program-3', poster: '60969.png', label: 'A supportive conversation' },
];

function Clip({ clip }: { clip: typeof clips[number] }) {
  return (
    <video
      className="program-video"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={asset(clip.poster)}
      aria-label={clip.label}
    >
      <source src={`/assets/videos/${clip.src}.webm`} type="video/webm" />
      <source src={`/assets/videos/${clip.src}.mp4`} type="video/mp4" />
    </video>
  );
}

function Card({ card, index }: { card: typeof cards[number]; index: number }) {
  return (
    <article tabIndex={0} aria-expanded={false}>
      <div className="program-panel">
        <h3>{card.title}</h3>
        <p>{card.text}</p>
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
  useLoopCarousel(grid, compact, 6);
  const copies = compact ? [0, 1, 2] : [0];

  useEffect(() => {
    const el = grid.current;
    if (!el) return;

    // Only let clips play while they are on screen.
    const videos = Array.from(el.querySelectorAll<HTMLVideoElement>('video'));
    const io = new IntersectionObserver(
      (entries) => entries.forEach(({ target, isIntersecting }) => {
        const video = target as HTMLVideoElement;
        if (isIntersecting) video.play().catch(() => {});
        else video.pause();
      }),
      { threshold: 0.15 },
    );
    videos.forEach((video) => io.observe(video));

    const boxes = Array.from(el.querySelectorAll<HTMLElement>('article'));
    // In the 3-column checkerboard the third text box is the only one on the
    // bottom row, so it extends upward; the other two extend downward.
    const rows: boolean[] = [];
    const syncRows = () => {
      const columns = getComputedStyle(el).gridTemplateColumns.split(' ').length;
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

    mm.add('(prefers-reduced-motion: no-preference)', () => {
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
          .fromTo(panel.querySelectorAll(':scope > h3, :scope > p'), { y: fromBottom ? -28 : 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.08 }, at + 0.25);
      });
      tl.fromTo(videos, { scale: 1.08, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, stagger: 0.25 }, 0.15);

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });

    // 2) Hover / focus / tap: the panel extends over the neighbouring tile,
    //    downward for the top row and upward for the bottom row. The title and
    //    summary stay exactly where they are; the details settle in beside them.
    const canHover = () => window.matchMedia('(hover: hover)').matches;
    const tiles = Array.from(el.children) as HTMLElement[];
    boxes.forEach((box, i) => {
      const panel = box.querySelector<HTMLElement>('.program-panel')!;
      const details = panel.querySelector<HTMLElement>('.program-details')!;
      const items = Array.from(details.querySelector('.program-details-inner')!.children);
      const isDesktop = () => getComputedStyle(el).gridTemplateColumns.split(' ').length >= 3;

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
        onStart: () => { box.style.zIndex = '5'; box.setAttribute('aria-expanded', 'true'); panel.classList.add('is-open'); },
        onReverseComplete: () => {
          box.style.zIndex = '';
          box.setAttribute('aria-expanded', 'false');
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
        onStart: () => { box.setAttribute('aria-expanded', 'true'); panel.classList.add('is-open'); },
        onReverseComplete: () => { box.setAttribute('aria-expanded', 'false'); panel.classList.remove('is-open'); },
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
          const hidden = Math.max(0, full - cell);
          pinHead();
          panel.style.height = `${full}px`;
          box.style.setProperty('--panel-h', `${full}px`);
          details.style.height = 'auto';
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

      // Decide per event, so hybrid devices and viewport changes behave.
      const onEnter = () => { if (canHover()) show(); };
      const onLeave = () => { if (canHover()) hide(); };
      const onTap = () => { if (!canHover()) toggle(); };
      box.addEventListener('mouseenter', onEnter);
      box.addEventListener('mouseleave', onLeave);
      box.addEventListener('click', onTap);
      box.addEventListener('focus', show);
      box.addEventListener('blur', hide);
      box.addEventListener('keydown', (e) => { if (e.key === 'Escape') hide(); });

      cleanups.push(() => {
        box.removeEventListener('mouseenter', onEnter);
        box.removeEventListener('mouseleave', onLeave);
        box.removeEventListener('click', onTap);
        box.removeEventListener('focus', show);
        box.removeEventListener('blur', hide);
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
      <h2>Sessions and programmes</h2>
      <div className="program-grid" ref={grid}>
        {copies.map((copy) => (
          <Fragment key={copy}>
            <Card card={cards[0]} index={copy * 3} />
            <Clip clip={clips[0]} />
            <Card card={cards[1]} index={copy * 3 + 1} />
            <Clip clip={clips[1]} />
            <Card card={cards[2]} index={copy * 3 + 2} />
            <Clip clip={clips[2]} />
          </Fragment>
        ))}
      </div>
    </section>
  );
}
