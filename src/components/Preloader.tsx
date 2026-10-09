import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { asset } from '../assets';

/** Brown curtain with the Parna Presence logo, shown once on page load. */
export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const el = ref.current;
    if (!el || done) return;
    const logo = el.querySelector('.preloader-logo');
    document.body.style.overflow = 'hidden';
    const tl = gsap.timeline({
      defaults: { ease: 'expo.out' },
      onComplete: () => { document.body.style.overflow = ''; setDone(true); },
    });
    tl.fromTo(logo, { autoAlpha: 0, scale: 0.9, y: 16 }, { autoAlpha: 1, scale: 1, y: 0, duration: 1.1 }, 0.1)
      .to(logo, { autoAlpha: 0, y: -24, duration: 0.55, ease: 'expo.in' }, 1.4)
      .to(el, { yPercent: -100, duration: 1, ease: 'expo.inOut' }, 1.6);
    return () => { tl.kill(); document.body.style.overflow = ''; };
  }, [done]);

  if (done) return null;
  return <div className="preloader" ref={ref} aria-hidden="true"><img className="preloader-logo" src={asset('logo-lockup.png')} alt="" /></div>;
}
