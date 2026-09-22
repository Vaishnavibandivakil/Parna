import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Draggable from 'gsap/Draggable';
import { asset } from '../assets';

gsap.registerPlugin(Draggable);

const currentState = ['Constant Stress', 'Trouble Sleeping', 'Self Doubt', 'Emotional Burnout', 'Managing Crisis', 'Feeling Overwhelmed', 'Sadness'];
const futureState = ['Inner Calm', 'Restful Sleep', 'Self Confidence', 'Emotional Balance', 'Healthy Coping', 'Greater Clarity', 'Renewed Hope'];

export function Transformation() {
  const rootRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLButtonElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const leftLayerRef = useRef<HTMLDivElement>(null);
  const rightLayerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const handle = handleRef.current;
    const divider = dividerRef.current;
    const leftLayer = leftLayerRef.current;
    const rightLayer = rightLayerRef.current;
    if (!root || !handle || !divider || !leftLayer || !rightLayer) return;

    const context = gsap.context(() => {
      let maxDrag = Math.max(1, root.clientWidth / 2 - 76);
      const setDividerX = gsap.quickSetter(divider, 'x', 'px');
      const setLeftClip = gsap.quickSetter(leftLayer, 'clipPath');
      const setRightClip = gsap.quickSetter(rightLayer, 'clipPath');
      const setLeftOpacity = gsap.quickSetter(leftLayer, 'opacity');
      const setRightOpacity = gsap.quickSetter(rightLayer, 'opacity');

      const updateLayers = (x: number) => {
        maxDrag = Math.max(1, root.clientWidth / 2 - 76);
        const value = gsap.utils.clamp(-maxDrag, maxDrag, x);
        const progress = gsap.utils.clamp(0, 1, (value + maxDrag) / (maxDrag * 2));
        const leftClip = Math.max(0, (progress - 0.5) * 150);
        const rightClip = Math.max(0, (0.5 - progress) * 150);

        setDividerX(value);
        setLeftClip(`inset(0 ${leftClip}% 0 0)`);
        setRightClip(`inset(0 0 0 ${rightClip}%)`);
        setLeftOpacity(1 - Math.max(0, progress - 0.5) * 1.2);
        setRightOpacity(0.4 + Math.min(0.6, progress * 1.2));
        handle.setAttribute('aria-valuenow', String(Math.round((progress - 0.5) * 200)));
      };

      updateLayers(0);
      const draggable = Draggable.create(handle, {
        type: 'x',
        bounds: { minX: -maxDrag, maxX: maxDrag },
        edgeResistance: 0.8,
        onDrag() { updateLayers(this.x); },
        onThrowUpdate() { updateLayers(this.x); },
      });
      const resize = () => { maxDrag = Math.max(1, root.clientWidth / 2 - 76); draggable.forEach(instance => instance.applyBounds({ minX: -maxDrag, maxX: maxDrag })); updateLayers(Number(gsap.getProperty(handle, 'x'))); };
      window.addEventListener('resize', resize);
      return () => { window.removeEventListener('resize', resize); draggable.forEach(instance => instance.kill()); };
    }, root);

    return () => context.revert();
  }, []);

  return <section className="transformation" id="transformation">
    <span className="badge">TRANSFORMATION</span>
    <h2>A healthier tomorrow starts today</h2>
    <div ref={rootRef} className="journey-map">
      <span className="where from">Where You Are</span>
      <span className="where to">Where You Could Be</span>
      <div className="map-line" />
      <div ref={dividerRef} className="map-divider" aria-hidden="true" />
      <button ref={handleRef} className="map-center" type="button" role="slider" aria-label="Drag to compare your current and future wellbeing" aria-valuemin={-100} aria-valuemax={100}>
        <img src={asset('6ceb9.svg')} alt="" />
      </button>
      <div ref={leftLayerRef} className="map-side map-left">{currentState.map((label, index) => <span className={`map-tag tag-${index}`} key={label}>+ &nbsp; {label}</span>)}</div>
      <div ref={rightLayerRef} className="map-side map-right">{futureState.map((label, index) => <span className={`map-tag tag-${index}`} key={label}>+ &nbsp; {label}</span>)}</div>
    </div>
    <a className="pill" href="#newsletter">Join Parna Today<span className="arrow"><img src={asset('745f4.svg')} alt="" /></span></a>
  </section>;
}
