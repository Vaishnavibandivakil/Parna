import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { asset } from '../assets';

const left = ['Constant Stress', 'Trouble Sleeping', 'Self Doubt', 'Emotional Burnout', 'Managing Crisis', 'Feeling Overwhelmed', 'Sadness'];
const right = ['Inner Calm', 'Restful Sleep', 'Self Confidence', 'Emotional Balance', 'Healthy Coping', 'Greater Clarity', 'Renewed Hope'];

export function Transformation() {
  const map = useRef<HTMLDivElement>(null); const handle = useRef<HTMLButtonElement>(null); const leftSide = useRef<HTMLDivElement>(null); const rightSide = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = map.current, knob = handle.current, before = leftSide.current, after = rightSide.current;
    if (!container || !knob || !before || !after) return;
    let dragging = false; let pointerId: number | null = null;
    const update = (x: number) => { const max = Math.max(1, container.clientWidth / 2 - 76); const value = gsap.utils.clamp(-max, max, x); const progress = gsap.utils.clamp(0, 1, (value + max) / (max * 2)); gsap.set(knob, { x: value }); gsap.set(before, { clipPath: `inset(0 ${Math.max(0, (progress - .5) * 150)}% 0 0)`, opacity: 1 - Math.max(0, progress - .5) * 1.2, scale: 1.08 - progress * .16 }); gsap.set(after, { clipPath: `inset(0 0 0 ${Math.max(0, (.5 - progress) * 150)}%)`, opacity: .4 + Math.min(.6, progress * 1.2), scale: .92 + progress * .16 }); knob.setAttribute('aria-valuenow', String(Math.round((progress - .5) * 200))); };
    const move = (event: PointerEvent) => { if (!dragging || event.pointerId !== pointerId) return; const box = container.getBoundingClientRect(); update(event.clientX - (box.left + box.width / 2)); };
    const end = (event: PointerEvent) => { if (event.pointerId !== pointerId) return; dragging = false; pointerId = null; knob.classList.remove('is-dragging'); };
    const start = (event: PointerEvent) => { event.preventDefault(); dragging = true; pointerId = event.pointerId; knob.setPointerCapture(pointerId); knob.classList.add('is-dragging'); const box = container.getBoundingClientRect(); update(event.clientX - (box.left + box.width / 2)); };
    const keyboard = (event: KeyboardEvent) => { if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return; event.preventDefault(); const current = Number(gsap.getProperty(knob, 'x')); update(current + (event.key === 'ArrowLeft' ? -32 : 32)); };
    knob.addEventListener('pointerdown', start); window.addEventListener('pointermove', move); window.addEventListener('pointerup', end); window.addEventListener('pointercancel', end); knob.addEventListener('keydown', keyboard); update(0);
    return () => { knob.removeEventListener('pointerdown', start); window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', end); window.removeEventListener('pointercancel', end); knob.removeEventListener('keydown', keyboard); };
  }, []);
  return <section className="transformation" id="transformation"><span className="badge">TRANSFORMATION</span><h2>A healthier tomorrow starts today</h2><div className="journey-map" ref={map}><span className="where from">Where You Are</span><span className="where to">Where You Could Be</span><div className="map-line" /><button className="map-center" ref={handle} type="button" aria-label="Compare your current and future wellbeing" aria-valuemin={-100} aria-valuemax={100} role="slider"><img src={asset('6ceb9.svg')} alt="" /></button><div className="map-side map-left" ref={leftSide}>{left.map((label, index) => <span className={`map-tag tag-${index}`} key={label}>+ &nbsp; {label}</span>)}</div><div className="map-side map-right" ref={rightSide}>{right.map((label, index) => <span className={`map-tag tag-${index}`} key={label}>+ &nbsp; {label}</span>)}</div></div><a className="pill" href="#newsletter">Join Parna Today<span className="arrow"><img src={asset('745f4.svg')} alt="" /></span></a></section>;
}
