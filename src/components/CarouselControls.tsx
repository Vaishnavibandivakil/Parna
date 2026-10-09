import { useEffect, useState, type RefObject } from 'react';

type CarouselControlsProps = {
  target: RefObject<HTMLDivElement | null>;
  label: string;
};

export function CarouselControls({ target, label }: CarouselControlsProps) {
  const [bounds, setBounds] = useState({ start: true, end: false });

  useEffect(() => {
    const element = target.current;
    if (!element) return;
    const update = () => setBounds({
      start: element.scrollLeft <= 2,
      end: element.scrollLeft + element.clientWidth >= element.scrollWidth - 2,
    });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    element.addEventListener('scroll', update, { passive: true });
    update();
    return () => {
      observer.disconnect();
      element.removeEventListener('scroll', update);
    };
  }, [target]);

  const move = (direction: number) => {
    const element = target.current;
    if (!element) return;
    element.scrollBy({
      left: direction * element.clientWidth,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  };

  return <div className="carousel-controls" role="group" aria-label={`${label} carousel controls`}>
    <button type="button" aria-label={`Previous ${label}`} disabled={bounds.start} onClick={() => move(-1)}>←</button>
    <button type="button" aria-label={`Next ${label}`} disabled={bounds.end} onClick={() => move(1)}>→</button>
  </div>;
}
