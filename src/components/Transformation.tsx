import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Draggable from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

const currentState = [
  'Constant Stress',
  'Trouble Sleeping',
  'Self Doubt',
  'Emotional Burnout',
  'Managing Crisis',
  'Feeling Overwhelmed',
  'Sadness',
];

const futureState = [
  'Inner Calm',
  'Restful Sleep',
  'Self Confidence',
  'Emotional Balance',
  'Healthy Coping',
  'Greater Clarity',
  'Renewed Hope',
];

export function Transformation() {
  const rootRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLButtonElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  const keyboardMoveRef = useRef<
    ((key: string) => void) | null
  >(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const rail = railRef.current;
    const handle = handleRef.current;
    const divider = dividerRef.current;

    if (!root || !rail || !handle || !divider) return;

    let dispose = () => {};

    const context = gsap.context(() => {
      const clamp = gsap.utils.clamp;
      const proxy = document.createElement('div');
      const position = { x: 0 };

      let maxDrag = 1;
      let requestedX = 0;

      const bubbles = Array.from(
        root.querySelectorAll<HTMLElement>('[data-bubble]')
      ).map(element => ({
        element,
        label: element.querySelector<HTMLElement>('[data-label]')!,
        index: Number(element.dataset.index),
        center: 0,
        width: 1,
      }));

      const setHandleX = gsap.quickSetter(handle, 'x', 'px');
      const setDividerX = gsap.quickSetter(divider, 'x', 'px');

      const measure = () => {
        const rootRect = root.getBoundingClientRect();

        maxDrag = Math.max(
          0,
          (rail.clientWidth - handle.offsetWidth) / 2
        );

        bubbles.forEach(bubble => {
          const rect = bubble.element.getBoundingClientRect();

          bubble.center =
            rect.left - rootRect.left + rect.width / 2;

          bubble.width = rect.width;
        });
      };

      const render = () => {
        const x = clamp(-maxDrag, maxDrag, position.x);
        const dividerX = root.clientWidth / 2 + x;

        setHandleX(x);
        setDividerX(x);

        // The glow follows the same animated position as the handle.
        root.style.setProperty('--glow-x', `${dividerX}px`);

        bubbles.forEach(bubble => {
          const transitionWidth = Math.max(
            100,
            Math.min(220, bubble.width)
          );

          let progress = clamp(
            0,
            1,
            0.5 + (bubble.center - dividerX) / transitionWidth
          );

          // Ensure the endpoints fully reveal their respective states.
          if (maxDrag > 0 && x <= -maxDrag + 0.5) progress = 1;
          if (maxDrag > 0 && x >= maxDrag - 0.5) progress = 0;

          // Smoothstep makes the change less abrupt.
          const blend = progress * progress * (3 - 2 * progress);

          bubble.element.style.setProperty(
            '--fill',
            String(blend)
          );

          bubble.element.style.setProperty(
            '--border',
            String(0.42 + blend * 0.58)
          );

          const isFuture = blend >= 0.5;
          const label = isFuture
            ? futureState[bubble.index]
            : currentState[bubble.index];

          if (bubble.label.textContent !== label) {
            bubble.label.textContent = label;
          }

          // One text node fades out, changes, and fades back in.
          // No overlapping text and no background behind the text.
          bubble.label.style.opacity = String(
            Math.abs(blend * 2 - 1)
          );

          bubble.element.style.color = isFuture
            ? '#29443a'
            : '#fff4df';
        });

        const value = maxDrag > 0
          ? Math.round(((maxDrag - x) / (maxDrag * 2)) * 100)
          : 50;

        handle.setAttribute('aria-valuenow', String(value));
        handle.setAttribute(
          'aria-valuetext',
          `${value}% future wellbeing`
        );
      };

      measure();
      render();

      const moveTo = gsap.quickTo(position, 'x', {
        duration: 0.18,
        ease: 'power2.out',
        onUpdate: render,
      });

      const [draggable] = Draggable.create(proxy, {
        type: 'x',
        trigger: handle,
        bounds: {
          minX: -maxDrag,
          maxX: maxDrag,
        },
        edgeResistance: 1,

        onPress() {
          moveTo.tween.pause();
          requestedX = position.x;
          gsap.set(proxy, { x: requestedX });
          this.update();
        },

        onDrag() {
          requestedX = clamp(-maxDrag, maxDrag, this.x);
          moveTo(requestedX);
        },

        onRelease() {
          requestedX = clamp(-maxDrag, maxDrag, this.x);
          moveTo(requestedX);
        },
      });

      keyboardMoveRef.current = key => {
        const step = Math.max(1, maxDrag / 8);
        let next = requestedX;

        switch (key) {
          case 'ArrowLeft':
          case 'ArrowUp':
            next -= step;
            break;
          case 'ArrowRight':
          case 'ArrowDown':
            next += step;
            break;
          case 'Home':
            next = maxDrag;
            break;
          case 'End':
            next = -maxDrag;
            break;
          default:
            return;
        }

        requestedX = clamp(-maxDrag, maxDrag, next);
        gsap.set(proxy, { x: requestedX });
        draggable.update();
        moveTo(requestedX);
      };

      const resize = () => {
        const ratio = maxDrag > 0 ? position.x / maxDrag : 0;

        moveTo.tween.pause();
        measure();

        position.x = ratio * maxDrag;
        requestedX = position.x;

        draggable.applyBounds({
          minX: -maxDrag,
          maxX: maxDrag,
        });

        gsap.set(proxy, { x: position.x });
        draggable.update();
        render();
      };

      const observer = new ResizeObserver(resize);

      observer.observe(root);
      observer.observe(rail);
      bubbles.forEach(bubble => observer.observe(bubble.element));

      dispose = () => {
        observer.disconnect();
        draggable.kill();
        moveTo.tween.kill();
        keyboardMoveRef.current = null;

        root.style.removeProperty('--glow-x');

        bubbles.forEach(({ element, label }) => {
          element.style.removeProperty('--fill');
          element.style.removeProperty('--border');
          element.style.removeProperty('color');
          label.style.removeProperty('opacity');
        });
      };
    }, root);

    return () => {
      dispose();
      context.revert();
    };
  }, []);

  const renderBubbles = (side: 'current' | 'future') =>
    currentState.map((label, index) => (
      <div
        key={`${side}-${index}`}
        data-bubble
        data-index={index}
        aria-label={`${label} becomes ${futureState[index]}`}
        className={[
          'flex min-h-12 min-w-0 items-center justify-center',
          'gap-2 rounded-full border px-3 py-3',
          'text-center text-xs font-medium leading-snug',
          'sm:px-4 sm:text-sm',
          'bg-[rgba(255,255,255,var(--fill))]',
          'border-[rgba(255,255,255,var(--border))]',
          side === 'current'
            ? '[--fill:0] [--border:0.42] text-[#fff4df]'
            : '[--fill:1] [--border:1] text-[#29443a]',
          index === 6
            ? 'xl:col-span-2 xl:w-[calc(50%-0.75rem)] xl:justify-self-center'
            : '',
        ].join(' ')}
      >
        <span aria-hidden="true" className="shrink-0 text-base">
          +
        </span>

        <span data-label aria-hidden="true" className="bg-transparent">
          {side === 'current' ? label : futureState[index]}
        </span>
      </div>
    ));

  return (
    <section
      id="transformation"
      className="overflow-hidden bg-[#542700] px-4 py-16 text-[#fff4df] sm:px-8 sm:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <span className="inline-flex rounded-full border border-white/30 px-4 py-2 text-[10px] font-semibold tracking-[0.2em] sm:text-xs">
            TRANSFORMATION
          </span>

          <h2 className="mx-auto mt-6 max-w-3xl font-serif text-4xl leading-tight sm:text-5xl">
            A healthier tomorrow starts today
          </h2>
        </div>

        <div
          ref={rootRef}
          className="relative isolate mt-10 overflow-hidden rounded-3xl bg-[#623000] [--glow-x:50%] sm:mt-14"
        >
          {/* This gradient moves continuously with the handle. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_var(--glow-x)_65%,rgba(242,177,62,0.55)_0%,rgba(190,113,18,0.24)_35%,rgba(84,39,0,0)_72%)]"
          />

          <div
            ref={dividerRef}
            aria-hidden="true"
            className="pointer-events-none absolute bottom-12 left-1/2 top-8 -z-10 w-px bg-gradient-to-b from-transparent via-[#ffd58a]/50 to-transparent"
          />

          <div className="px-4 pt-8 sm:px-8 sm:pt-10 lg:px-12">
            <div className="grid grid-cols-2 gap-6 text-center sm:gap-12">
              <h3 className="font-serif text-xl italic sm:text-3xl">
                Where You Are
              </h3>

              <h3 className="font-serif text-xl italic sm:text-3xl">
                Where You Could Be
              </h3>
            </div>

            {/* Grid spacing replaces the old absolute tag positions. */}
            <div className="mt-8 grid grid-cols-2 gap-6 sm:mt-10 sm:gap-12 lg:gap-20">
              <div className="grid auto-rows-fr grid-cols-1 items-stretch gap-4 xl:grid-cols-2 xl:gap-6">
                {renderBubbles('current')}
              </div>

              <div className="grid auto-rows-fr grid-cols-1 items-stretch gap-4 xl:grid-cols-2 xl:gap-6">
                {renderBubbles('future')}
              </div>
            </div>
          </div>

          {/* A separate track keeps the handle clear of the bubbles. */}
          <div
            ref={railRef}
            className="relative mx-4 mt-8 h-20 sm:mx-8 sm:mt-10 lg:mx-12"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-[#ffd58a]/60 to-transparent"
            />

            <button
              ref={handleRef}
              type="button"
              role="slider"
              aria-label="Future wellbeing. Move left to reveal more."
              aria-orientation="horizontal"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={50}
              onKeyDown={event => {
                if (
                  [
                    'ArrowLeft',
                    'ArrowRight',
                    'ArrowUp',
                    'ArrowDown',
                    'Home',
                    'End',
                  ].includes(event.key)
                ) {
                  event.preventDefault();
                  keyboardMoveRef.current?.(event.key);
                }
              }}
              className="absolute left-1/2 top-1/2 -ml-7 -mt-7 flex h-14 w-14 touch-pan-y select-none items-center justify-center rounded-full border border-[#ffdc96] bg-[#eeb347] text-white shadow-[0_0_0_6px_rgba(255,214,141,0.25),0_0_45px_rgba(238,179,71,0.5)] outline-none cursor-grab active:cursor-grabbing focus-visible:ring-4 focus-visible:ring-white/70"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m8 7-5 5 5 5M3 12h18m-5-5 5 5-5 5" />
              </svg>
            </button>
          </div>

          <p className="px-4 pb-7 text-center text-xs text-[#ffe6bb]/75 sm:text-sm">
            Drag left for more possibility · Drag right to return
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href="#newsletter"
            className="inline-flex items-center gap-5 rounded-full bg-[#fff4df] py-2 pl-6 pr-2 text-sm font-medium text-[#29443a] transition-colors hover:bg-white"
          >
            Join Parna Today

            <span
              aria-hidden="true"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#29443a] text-xl text-white"
            >
              ↗
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}