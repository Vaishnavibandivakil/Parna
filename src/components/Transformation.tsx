import { useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(ScrollTrigger, Draggable);

/* -------------------------------------------------------------------------- */
/*  Layout constants — all in "stage pixels" (the 1320 × 500 Figma canvas).    */
/*  The stage is scaled to fit narrower viewports, so these never change.      */
/* -------------------------------------------------------------------------- */
const STAGE_W = 1320;
const STAGE_H = 500;
/** Width the stage needs on screen, including the two end labels that hang outside it. */
const FIT_W = STAGE_W + 200;

/** Divider (handle centre) x for each Figma frame. */
const X_RIGHT = 1179; // frame 2 — "Where You Are" fills the stage
const X_MID = 660; //   frame 1 — balanced
const X_LEFT = 115; //  frame 3 — "Where You Could Be" fills the stage

/** How long (in timeline seconds) a pill takes to appear / disappear. */
const REVEAL = 0.4;

type PillDef = { label: string; from: [number, number]; to: [number, number] };

/** "Where You Are" pills — [x, y] with the divider at X_RIGHT → at X_MID. */
const STRUGGLES: PillDef[] = [
  { label: 'Constant Stress', from: [240, 60], to: [240, 60] },
  { label: 'Trouble Sleeping', from: [674, 66], to: [430, 60] },
  { label: 'Self Doubt', from: [423, 146], to: [350, 150] },
  { label: 'Emotional Burnout', from: [778, 238], to: [438, 234] },
  { label: 'Managing Crisis', from: [523, 321], to: [330, 320] },
  { label: 'Feeling Overwhelmed', from: [240, 410], to: [240, 410] },
  { label: 'Sadness', from: [743, 410], to: [490, 410] },
];

/** "Where You Could Be" pills — [x, y] with the divider at X_MID → at X_LEFT. */
const GAINS: PillDef[] = [
  { label: 'Inner Calm', from: [740, 60], to: [574, 60] },
  { label: 'Restful Sleep', from: [940, 60], to: [940, 60] },
  { label: 'Self Confidence', from: [870, 150], to: [780, 150] },
  { label: 'Emotional Balance', from: [750, 235], to: [382, 238] },
  { label: 'Healthy Coping', from: [850, 320], to: [722, 314] },
  { label: 'Greater Clarity', from: [740, 410], to: [527, 402] },
  { label: 'Renewed Hope', from: [930, 410], to: [930, 410] },
];

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/**
 * The master timeline is 2s long: t=0 → frame 2, t=1 → frame 1, t=2 → frame 3.
 * Its *progress* (0‥1) is what everything else talks in: 0 = "Where You Are",
 * 0.5 = balanced, 1 = "Where You Could Be". These two helpers convert between
 * progress and the divider's x so dragging and the timeline stay in lock-step.
 */
const progressFromX = (x: number) =>
  x >= X_MID
    ? (0.5 * (X_RIGHT - x)) / (X_RIGHT - X_MID)
    : 0.5 + (0.5 * (X_MID - x)) / (X_MID - X_LEFT);

const xFromProgress = (p: number) =>
  p <= 0.5 ? X_RIGHT - (p / 0.5) * (X_RIGHT - X_MID) : X_MID - ((p - 0.5) / 0.5) * (X_MID - X_LEFT);

const SNAP_POINTS = [0, 0.5, 1];
const nearestSnap = (p: number) =>
  SNAP_POINTS.reduce((best, s) => (Math.abs(s - p) < Math.abs(best - p) ? s : best), 0);

type Api = {
  goTo: (progress: number, duration?: number) => void;
  step: (dir: 1 | -1) => void;
};

export type TransformationProps = {
  /**
   * "drag"  – the handle sweeps once when the section scrolls into view, then
   *           the visitor can drag it / click the end labels (default).
   * "scroll" – the section pins and the sweep is scrubbed by scroll position.
   */
  mode?: 'drag' | 'scroll';
  onCtaClick?: () => void;
  className?: string;
};

const SANS = "font-['Instrument_Sans']";
const SERIF = "font-['Instrument_Serif']";

export function Transformation({ mode = 'drag', onCtaClick, className = '' }: TransformationProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const fitRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLButtonElement>(null);
  const proxyRef = useRef<HTMLDivElement>(null);
  const struggleRefs = useRef<HTMLDivElement[]>([]);
  const gainRefs = useRef<HTMLDivElement[]>([]);
  const api = useRef<Api | null>(null);
  const mobileRoot = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)');
    const onChange = () => setCompact(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  /* Small screens: the handle travels down a vertical track as you scroll,
     lighting up "where you are" first and then "where you could be". */
  useLayoutEffect(() => {
    const root = mobileRoot.current;
    if (!compact || !root) return;
    const ctx = gsap.context(() => {
      const handle = root.querySelector<HTMLElement>('.tf-handle')!;
      const glow = root.querySelector<HTMLElement>('.tf-glow')!;
      const track = root.querySelector<HTMLElement>('.tf-track')!;
      const struggles = Array.from(root.querySelectorAll<HTMLElement>('.tf-struggles .tf-pill'));
      const gains = Array.from(root.querySelectorAll<HTMLElement>('.tf-gains .tf-pill'));
      const travel = () => track.offsetHeight - handle.offsetHeight;
      gsap.set(struggles, { autoAlpha: 0.35, x: -6 });
      gsap.set(gains, { autoAlpha: 0.25, x: -6, scale: 0.97 });
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root, start: 'top 72%', end: 'bottom 40%', scrub: 1.2, invalidateOnRefresh: true },
      });
      tl.to([handle, glow], { y: travel, duration: 2 }, 0)
        .to(struggles, { autoAlpha: 1, x: 0, duration: 0.5, stagger: 0.09 }, 0.05)
        .to(struggles, { autoAlpha: 0.45, duration: 0.6 }, 1.05)
        .to(gains, { autoAlpha: 1, x: 0, scale: 1, duration: 0.5, stagger: 0.09 }, 1.05);
    }, root);
    return () => ctx.revert();
  }, [compact]);

  /* Scale the fixed 1320px stage down to fit narrower viewports. */
  useLayoutEffect(() => {
    const fit = fitRef.current;
    const stage = stageRef.current;
    if (compact || !fit || !stage) return;
    const apply = () => {
      const s = Math.min(1, fit.clientWidth / FIT_W);
      stage.style.transform = `scale(${s})`;
      fit.style.height = `${STAGE_H * s}px`;
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(fit);
    return () => ro.disconnect();
  }, [compact]);

  /* Build the animation once fonts are ready (pill widths drive the timings). */
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const glow = glowRef.current;
    const divider = dividerRef.current;
    const handle = handleRef.current;
    const proxy = proxyRef.current;
    if (compact || !section || !glow || !divider || !handle || !proxy) return;

    const struggles = struggleRefs.current.filter(Boolean);
    const gains = gainRefs.current.filter(Boolean);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let cancelled = false;
    let draggable: Draggable | undefined;
    const ctx = gsap.context(() => {}, section);

    const build = () => {
      if (cancelled) return;
      ctx.add(() => {
        /* ---------- master timeline ---------- */
        const tl = gsap.timeline({ paused: true, defaults: { ease: 'none', duration: 1 } });

        // Divider + glow: frame 2 → frame 1 → frame 3
        tl.fromTo([divider, glow], { x: X_RIGHT }, { x: X_MID }, 0).to([divider, glow], { x: X_LEFT }, 1);

        // "Where You Are" pills: glide to their balanced spots, then fade out
        // one by one as the divider sweeps past them in phase 2.
        struggles.forEach((el, i) => {
          const { from, to } = STRUGGLES[i];
          const rightEdge = to[0] + el.offsetWidth;
          const hideAt = 1 + clamp((X_MID - rightEdge) / (X_MID - X_LEFT), 0, 1 - REVEAL);
          tl.fromTo(el, { x: from[0], y: from[1], autoAlpha: 1, scale: 1 }, { x: to[0], y: to[1] }, 0).to(
            el,
            { autoAlpha: 0, scale: 0.9, x: to[0] - 24, duration: REVEAL, ease: 'power2.in' },
            hideAt,
          );
        });

        // "Where You Could Be" pills: bloom in as the divider uncovers them in
        // phase 1, then spread out across the stage in phase 2.
        gains.forEach((el, i) => {
          const { from, to } = GAINS[i];
          const rightEdge = from[0] + el.offsetWidth;
          const showAt = clamp((X_RIGHT - rightEdge) / (X_RIGHT - X_MID), 0, 1 - REVEAL);
          tl.fromTo(
            el,
            { x: from[0] + 24, y: from[1], autoAlpha: 0, scale: 0.9 },
            { x: from[0], autoAlpha: 1, scale: 1, duration: REVEAL, ease: 'power2.out' },
            showAt,
          ).to(el, { x: to[0], y: to[1] }, 1);
        });

        /* ---------- shared helpers ---------- */
        let driver: gsap.core.Animation | null = null;
        let target = 0; // the resting state last asked for (0, 0.5 or 1)
        const goTo: Api['goTo'] = (p, duration = 0.7) => {
          target = p;
          driver?.kill();
          driver = gsap.to(tl, { progress: p, duration: reduceMotion ? 0 : duration, ease: 'power3.out' });
        };
        const step: Api['step'] = (dir) => goTo(clamp(nearestSnap(target) + 0.5 * dir, 0, 1), 0.8);
        api.current = { goTo, step };

        /* ---------- entrance (badge, heading, stage, CTA) ---------- */
        const entrance = gsap
          .timeline({ paused: true, defaults: { ease: 'power3.out' } })
          .from(section.querySelectorAll('[data-reveal]'), {
            y: 24,
            autoAlpha: 0,
            duration: reduceMotion ? 0 : 0.8,
            stagger: 0.1,
          });

        if (mode === 'scroll') {
          ScrollTrigger.create({ trigger: section, start: 'top 75%', once: true, onEnter: () => entrance.play() });
          ScrollTrigger.create({
            trigger: section,
            start: () => `top ${Math.max(0, (window.innerHeight - section.offsetHeight) / 2)}px`,
            end: () => `+=${window.innerHeight * 2}`,
            pin: true,
            scrub: 0.8,
            animation: tl,
          });
          return;
        }

        /* ---------- drag mode: intro sweep, then interactive ---------- */
        const hint = gsap.to(handle, {
          boxShadow: '0px 0px 44px 8px rgba(255,160,26,0.85)',
          duration: 1.1,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          paused: true,
        });
        const stopHint = () => {
          if (!hint.isActive()) return;
          hint.pause();
          gsap.to(handle, { boxShadow: '0px 0px 24px 0px rgba(255,160,26,1)', duration: 0.3 });
        };
        api.current = {
          goTo: (p, d) => {
            stopHint();
            goTo(p, d);
          },
          step: (dir) => {
            stopHint();
            step(dir);
          },
        };

        ScrollTrigger.create({
          trigger: section,
          start: 'top 70%',
          onEnter: (self) => {
            self.kill(); // the intro plays exactly once
            entrance.play();
            if (reduceMotion) {
              tl.progress(0.5);
              target = 0.5;
              hint.play();
              return;
            }
            driver = gsap
              .timeline({
                delay: 0.6,
                onComplete: () => {
                  target = 0.5;
                  hint.play();
                },
              })
              .to(tl, { progress: 1, duration: 2.6, ease: 'power2.inOut' })
              .to(tl, { progress: 0.5, duration: 1.3, ease: 'power2.inOut' }, '+=0.5');
          },
        });

        draggable = Draggable.create(proxy, {
          type: 'x',
          trigger: handle,
          bounds: { minX: X_LEFT, maxX: X_RIGHT },
          cursor: 'grab',
          activeCursor: 'grabbing',
          onPressInit() {
            driver?.kill();
            stopHint();
            gsap.set(proxy, { x: xFromProgress(tl.progress()) });
          },
          onDrag(this: Draggable) {
            tl.progress(progressFromX(this.x));
          },
          onRelease() {
            goTo(nearestSnap(tl.progress()));
          },
          onClick() {
            goTo(0.5);
          },
        })[0];
      });
    };

    if (document.fonts?.ready) document.fonts.ready.then(build);
    else build();

    return () => {
      cancelled = true;
      api.current = null;
      draggable?.kill();
      ctx.revert();
    };
  }, [mode, compact]);

  const onHandleKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      api.current?.step(1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      api.current?.step(-1);
    }
  };

  return (
    <section
      id="transformation"
      ref={sectionRef}
      className={`relative w-full overflow-hidden bg-yellow-950 pt-20 pb-14 flex flex-col items-center gap-12 text-white ${className}`}
    >
      {/* Badge */}
      <div
        data-reveal
        className="px-4 py-2 bg-white rounded-[100px] outline outline-1 outline-offset-[-1px] outline-[rgba(255,247,237,0.1)] inline-flex items-center gap-2"
      >
        <span className={`text-black text-xs font-semibold uppercase ${SANS}`}>Join Parna Presence today</span>
      </div>

      {/* Heading */}
      <h2
        data-reveal
        className={`max-w-[1050px] px-6 text-center text-white text-5xl md:text-6xl font-normal leading-[1.03] ${SERIF}`}
      >
        A healthier tomorrow starts today
      </h2>

      {/* Small screens: vertical, scroll-driven version */}
      {compact ? (
        <div ref={mobileRoot} data-reveal className="tf-mobile">
          <div className="tf-track"><div className="tf-glow" /><div className="tf-handle"><span><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#f8fafc" strokeWidth="2" strokeLinecap="round" aria-hidden><path d="M7 2v10M2 7h10" /></svg></span></div></div>
          <div className="tf-group tf-struggles">
            <h3 className={`text-white/70 text-2xl font-normal ${SERIF}`}>Where You Are</h3>
            <div className="tf-pills">{STRUGGLES.map((p) => <span key={p.label} className="tf-pill px-4 py-2 bg-white/5 rounded-[100px] outline outline-1 outline-offset-[-1px] outline-[rgba(255,255,255,0.3)] inline-flex items-center gap-1.5 whitespace-nowrap"><span className={`text-white/70 text-sm font-medium ${SANS}`}>+</span><span className={`text-white/70 text-sm font-medium ${SANS}`}>{p.label}</span></span>)}</div>
          </div>
          <div className="tf-group tf-gains">
            <h3 className={`text-white text-2xl font-normal ${SERIF}`}>Where You Could Be</h3>
            <div className="tf-pills">{GAINS.map((p) => <span key={p.label} className="tf-pill px-4 py-2 bg-orange-100 rounded-[100px] shadow-[0px_4px_12px_0px_rgba(11,116,245,0.13)] inline-flex items-center gap-1.5 whitespace-nowrap"><span className={`text-yellow-950 text-sm font-semibold ${SANS}`}>+</span><span className={`text-yellow-950 text-sm font-semibold ${SANS}`}>{p.label}</span></span>)}</div>
          </div>
        </div>
      ) : (
      <div ref={fitRef} data-reveal className="relative w-full" style={{ height: STAGE_H }}>
        <div
          ref={stageRef}
          className="absolute top-0 left-1/2 origin-top"
          style={{ width: STAGE_W, height: STAGE_H, marginLeft: -STAGE_W / 2 }}
        >
          {/* Track */}
          <div className="absolute left-[80px] top-[250px] w-[1137px] h-px bg-white/10" />

          {/* Glow — behind the pills, moves with the divider */}
          <div
            ref={glowRef}
            className="absolute left-0 top-0 h-full w-0 pointer-events-none will-change-transform"
            style={{ transform: `translateX(${X_RIGHT}px)` }}
          >
            <div
              className="absolute left-[207px] top-[453.4px] size-96 origin-top-left rotate-[-179.37deg] opacity-60 rounded-full blur-[30px]"
              style={{ background: 'radial-gradient(at 11% 50%, #fbbf24, rgba(133,77,14,0))' }}
            />
          </div>

          {/* End labels — clickable shortcuts to either extreme */}
          <button
            type="button"
            onClick={() => api.current?.goTo(0, 1)}
            className={`absolute left-[-49px] top-[235px] p-0 border-0 bg-transparent text-white/70 hover:text-white transition-colors text-2xl font-normal whitespace-nowrap cursor-pointer ${SERIF}`}
          >
            Where You Are
          </button>
          <button
            type="button"
            onClick={() => api.current?.goTo(1, 1)}
            className={`absolute left-[1221px] top-[235px] p-0 border-0 bg-transparent text-white hover:text-orange-100 transition-colors text-2xl font-normal whitespace-nowrap cursor-pointer ${SERIF}`}
          >
            Where You Could Be
          </button>

          {/* "Where You Are" pills */}
          {STRUGGLES.map((p, i) => (
            <div
              key={p.label}
              ref={(el) => {
                if (el) struggleRefs.current[i] = el;
              }}
              className="absolute left-0 top-0 px-4 py-2 bg-white/5 rounded-[100px] outline outline-1 outline-offset-[-1px] outline-[rgba(255,255,255,0.3)] inline-flex items-center gap-1.5 whitespace-nowrap will-change-transform"
              style={{ transform: `translate(${p.from[0]}px, ${p.from[1]}px)` }}
            >
              <span className={`text-white/70 text-sm font-medium ${SANS}`}>+</span>
              <span className={`text-white/70 text-sm font-medium ${SANS}`}>{p.label}</span>
            </div>
          ))}

          {/* "Where You Could Be" pills */}
          {GAINS.map((p, i) => (
            <div
              key={p.label}
              ref={(el) => {
                if (el) gainRefs.current[i] = el;
              }}
              className="absolute left-0 top-0 px-4 py-2 bg-orange-100 rounded-[100px] shadow-[0px_4px_12px_0px_rgba(11,116,245,0.13)] inline-flex items-center gap-1.5 whitespace-nowrap will-change-transform"
              style={{
                transform: `translate(${p.from[0] + 24}px, ${p.from[1]}px) scale(0.9)`,
                opacity: 0,
                visibility: 'hidden',
              }}
            >
              <span className={`text-yellow-950 text-sm font-semibold ${SANS}`}>+</span>
              <span className={`text-yellow-950 text-sm font-semibold ${SANS}`}>{p.label}</span>
            </div>
          ))}

          {/* Divider — vertical line + draggable handle */}
          <div
            ref={dividerRef}
            className="absolute left-0 top-0 h-full w-0 will-change-transform"
            style={{ transform: `translateX(${X_RIGHT}px)` }}
          >
            <div className="absolute left-0 top-[34px] w-px h-[432px] bg-white/10" />
            <button
              ref={handleRef}
              type="button"
              aria-label="Drag to compare where you are with where you could be"
              onKeyDown={onHandleKey}
              className="absolute left-[-24px] top-[226px] size-12 p-0 border-0 bg-orange-400 rounded-3xl shadow-[0px_0px_24px_0px_rgba(255,160,26,1.00)] outline outline-2 outline-offset-[-2px] outline-red-100 flex items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none"
            >
              <span className="size-8 rounded-2xl outline outline-1 outline-offset-[-1px] outline-[rgba(255,247,237,0.2)] flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#f8fafc" strokeWidth="2" strokeLinecap="round" aria-hidden>
                  <path d="M7 2v10M2 7h10" />
                </svg>
              </span>
            </button>
          </div>

          {/* Invisible drag proxy: Draggable moves this, we map its x → timeline progress */}
          <div ref={proxyRef} className="absolute left-0 top-0 size-0 pointer-events-none" aria-hidden />
        </div>
      </div>
      )}

      {/* CTA */}
      <button
        data-reveal
        type="button"
        onClick={onCtaClick}
        className="group pl-8 pr-3 py-3 border-0 bg-orange-50 rounded-[100px] inline-flex items-center gap-6 cursor-pointer"
      >
        <span className={`text-orange-950 text-base font-semibold ${SANS}`}>Join Parna Today</span>
        <span className="size-9 bg-[#60330B] rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#fff7ed" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </span>
      </button>
    </section>
  );
}

export default Transformation;
