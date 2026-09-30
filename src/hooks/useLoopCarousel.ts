import { useEffect, type RefObject } from 'react';

/**
 * Turns a horizontal scroll-snap row into an endless loop. The row must hold
 * three identical copies of its `count` items; we start on the middle copy and
 * jump back by one set whenever the scroll position drifts into an outer copy.
 */
export function useLoopCarousel(ref: RefObject<HTMLElement | null>, enabled: boolean, count: number) {
  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el || count === 0) return;

    let period = 0;
    let frame = 0;
    const measure = () => {
      const items = el.children;
      if (items.length < count * 2) return;
      period = (items[count] as HTMLElement).offsetLeft - (items[0] as HTMLElement).offsetLeft;
    };
    const settle = () => {
      frame = 0;
      if (!period) return;
      if (el.scrollLeft >= period * 2) el.scrollLeft -= period;
      else if (el.scrollLeft <= 0) el.scrollLeft += period;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(settle); };

    measure();
    el.style.scrollBehavior = 'auto';
    el.scrollLeft = period;
    el.addEventListener('scroll', onScroll, { passive: true });
    const ro = new ResizeObserver(() => { const ratio = period ? el.scrollLeft / period : 1; measure(); el.scrollLeft = period * ratio; });
    ro.observe(el);

    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener('scroll', onScroll);
      ro.disconnect();
      el.style.scrollBehavior = '';
    };
  }, [ref, enabled, count]);
}
