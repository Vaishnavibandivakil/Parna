import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let instance: Lenis | null = null;

/** Start Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync. */
export function startSmoothScroll() {
  if (instance || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  const lenis = new Lenis({
    lerp: 0.12,
    wheelMultiplier: 1,
    touchMultiplier: 1,
    anchors: { offset: -16 },
    stopInertiaOnNavigate: true,
  });
  instance = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tick);
    lenis.destroy();
    instance = null;
  };
}

export const smoothScroll = {
  get: () => instance,
  stop: () => instance?.stop(),
  start: () => instance?.start(),
  to: (target: string | HTMLElement, offset = 0) => {
    if (instance) instance.scrollTo(target, { offset, lerp: 0.12 });
    else (typeof target === 'string' ? document.querySelector(target) : target)?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  },
};
