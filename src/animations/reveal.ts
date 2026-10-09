import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

const EASE = 'expo.out';

/** Split a heading into masked lines and return the line elements (or the element itself if splitting fails). */
function lines(el: Element | null, splits: SplitText[]): Element[] {
  if (!el) return [];
  // Hard line breaks are tuned for desktop widths; let the text flow naturally on small screens.
  if (window.innerWidth <= 800) el.querySelectorAll('br').forEach((br) => br.replaceWith(' '));
  try {
    const split = new SplitText(el, { type: 'lines', mask: 'lines', linesClass: 'reveal-line' });
    splits.push(split);
    return split.lines;
  } catch {
    return [el];
  }
}

/** Standard entrance for a block of elements: rise, unblur, fade. */
const rise = { y: 28, autoAlpha: 0, filter: 'blur(6px)' };
const settled = { y: 0, autoAlpha: 1, filter: 'blur(0px)' };

function onEnter(trigger: Element, build: (tl: gsap.core.Timeline) => void, start = 'top 78%') {
  const tl = gsap.timeline({ defaults: { ease: EASE, duration: 1 }, scrollTrigger: { trigger, start, once: true } });
  build(tl);
  return tl;
}

function countUp(strong: HTMLElement, tl: gsap.core.Timeline, at: number | string) {
  const match = strong.textContent?.trim().match(/^(\d+)(.*)$/);
  if (!match) return;
  const target = Number(match[1]);
  const suffix = match[2];
  const counter = { value: 0 };
  strong.textContent = `0${suffix}`;
  tl.to(counter, { value: target, duration: 1.4, ease: 'power3.out', onUpdate: () => { strong.textContent = `${Math.round(counter.value)}${suffix}`; } }, at);
}

/**
 * Site-wide entry choreography. Call once after mount; returns a cleanup.
 * Sections that already own their motion (transformation, journey cards,
 * programs grid, story deck) are left to their own timelines.
 */
export function initReveals(root: HTMLElement) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const splits: SplitText[] = [];
  const q = (sel: string) => root.querySelector<HTMLElement>(sel);
  const qa = (sel: string) => Array.from(root.querySelectorAll<HTMLElement>(sel));

  // Keep text readable while touch devices scroll or foldable screens resize.
  if (reduce || window.matchMedia('(max-width: 1024px)').matches) {
    return () => {};
  }

  const ctx = gsap.context(() => {
    /* ---------- About ---------- */
    const about = q('.about');
    if (about) {
      const h2 = lines(q('.about-copy h2'), splits);
      const metrics = qa('.metrics > div');
      gsap.set(['.about-copy .badge', '.about-copy > p', '.about-copy .pill', ...metrics].map(x => (typeof x === 'string' ? q(x) : x)).filter(Boolean), { autoAlpha: 0 });
      gsap.set(h2, { yPercent: 140 });
      onEnter(q('.about-copy')!, (tl) => {
        tl.fromTo('.about-copy .badge', { scale: 0.85, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.8 }, 0)
          .to(h2, { yPercent: 0, duration: 1.2, stagger: 0.1 }, 0.1)
          .fromTo('.about-copy > p', rise, { ...settled }, 0.45)
          .fromTo('.about-copy .pill', rise, { ...settled }, 0.6)
          .fromTo(metrics, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.1 }, 0.7);
        qa('.metrics strong').forEach((s) => countUp(s, tl, 0.75));
      }, 'top 70%');
    }

    /* ---------- Section headings (journey, services, stories, programs) ---------- */
    const headingBlocks: Array<{ trigger: string; badge?: string; h2: string; extra?: string[] }> = [
      { trigger: '.how .section-heading', badge: '.how .section-heading .badge', h2: '.how .section-heading h2' },
      { trigger: '.services-heading', badge: '.services-heading .badge', h2: '.services-heading h2', extra: ['.services-heading > p'] },
      { trigger: '.stories-stack-heading', badge: '.stories-stack-heading .badge', h2: '.stories-stack-heading h2' },
      { trigger: '.programs-heading', badge: '.programs-heading .badge', h2: '.programs-heading h2' },
    ];
    headingBlocks.forEach(({ trigger, badge, h2, extra = [] }) => {
      const target = q(trigger);
      if (!target) return;
      const h2Lines = lines(q(h2), splits);
      const extras = extra.map(q).filter(Boolean) as HTMLElement[];
      const badgeEl = badge ? q(badge) : null;
      if (badgeEl || extras.length) gsap.set([badgeEl, ...extras].filter(Boolean), { autoAlpha: 0 });
      gsap.set(h2Lines, { yPercent: 140 });
      onEnter(target, (tl) => {
        if (badgeEl) tl.fromTo(badgeEl, { scale: 0.85, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.8 }, 0);
        tl.to(h2Lines, { yPercent: 0, duration: 1.2, stagger: 0.1 }, 0.1);
        if (extras.length) tl.fromTo(extras, rise, { ...settled, stagger: 0.1 }, 0.4);
      });
    });

    /* ---------- Services list: dividers draw in, rows rise ---------- */
    const rows = qa('.service-row');
    if (rows.length) {
      gsap.set(rows, { autoAlpha: 0, y: 22, '--divider-scale': 0 } as gsap.TweenVars);
      onEnter(q('.service-list')!, (tl) => {
        tl.to(rows, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.09 }, 0)
          .to(rows, { '--divider-scale': 1, duration: 1.2, stagger: 0.09, ease: 'power3.out' } as gsap.TweenVars, 0.1);
      }, 'top 80%');
    }

    /* ---------- Footer ---------- */
    const newsletter = q('.newsletter');
    if (newsletter) {
      const h2 = lines(q('.newsletter h2'), splits);
      const cols = qa('.footer-grid > div');
      gsap.set(['.newsletter-contact', ...cols].map(x => (typeof x === 'string' ? q(x) : x)).filter(Boolean), { autoAlpha: 0 });
      gsap.set(h2, { yPercent: 140 });
      onEnter(newsletter, (tl) => {
        tl.to(h2, { yPercent: 0, duration: 1.2, stagger: 0.1 }, 0)
          .fromTo('.newsletter-contact', rise, { ...settled }, 0.3)
          .fromTo(cols, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.08 }, 0.5);
      }, 'top 85%');
    }

    ScrollTrigger.refresh();
  }, root);

  return () => {
    ctx.revert();
    splits.forEach((s) => s.revert());
  };
}
