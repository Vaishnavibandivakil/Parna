import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { asset } from '../assets';
import { smoothScroll } from '../animations/smoothScroll';

type Detail = { line: string; summary: string; facts: string[]; includes: string[] };

/** Keyed by the service name shown in the Services list. */
const details: Record<string, Detail> = {
  'Individual therapy': { line: 'Room to say the thing out loud.', summary: 'One-to-one work at your pace, on whatever is heaviest right now.', facts: ['9 sessions', '70 min each', 'Weekly', 'Online or studio'], includes: ['A written plan after session two','Grounding practices for hard days','A closing session to look ahead'] },
  'Stress & anxiety support': { line: 'Steady the body first. The rest follows.', summary: 'A structured path that calms the nervous system, then rebuilds the routines that hold.', facts: ['8 sessions', '60 min each', 'Weekly', 'Online'], includes: ['A sleep and light routine','Breathing tools for anywhere','A plan for the panicky moments'] },
  'Couples & family care': { line: 'Being heard, not just being right.', summary: 'Longer joint sessions with practical tools for repair, spaced out so there is time to practise.', facts: ['6 sessions', '90 min each', 'Every two weeks', 'Joint, in the studio'], includes: ['A map of the repeating patterns','Repair scripts for hard talks','Optional individual check-ins'] },
  'Yoga & Mentoring': { line: 'Let the body learn calm too.', summary: 'Movement twice a week with a mentoring thread running through it.', facts: ['12 sessions', '75 min each', 'Twice weekly', 'Studio'], includes: ['A sequence matched to your level','Breath work with each posture','Monthly mentoring conversations'] },
  'Mindfulness practice': { line: 'Ten quiet minutes, most days.', summary: 'A six-week practice habit, built small enough to survive real life.', facts: ['21 practices', '15 min each', 'Daily', 'App plus a weekly call'], includes: ['Five to fifteen minute audio','A weekly live group sit','Gentle reminders, never pressure'] },
  'Personal growth coaching': { line: 'For the season after the hard part.', summary: 'Coaching for when you are ready to build what comes next, one doable week at a time.', facts: ['10 sessions', '50 min each', 'Every two weeks', 'Online'], includes: ['Goals broken into weekly steps','Prompts between calls','A written summary after each call'] },
};

const fallback: Detail = { line: 'Support shaped around you.', summary: 'Personalized support shaped around you.', facts: ['8 sessions', '60 min each', 'Weekly', 'Online or studio'], includes: ['A written plan within a week', 'Practices between sessions', 'Support on the hard days'] };

export type ProgramItem = { name: string; image: string };
type Props = { open: boolean; index: number; programs: ProgramItem[]; onClose: () => void };

export function ProgramDialog({ open, index, programs, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const photo = useRef<HTMLImageElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(index);

  useEffect(() => { if (open) setActive(index); }, [open, index]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.body.style.overflow = 'hidden';
      smoothScroll.stop();
      gsap.fromTo(dialog, { autoAlpha: 0, y: 28, scale: 0.985 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' });
    } else if (!open && dialog.open) {
      gsap.to(dialog, { autoAlpha: 0, y: 12, duration: 0.22, ease: 'power2.in', onComplete: () => { dialog.close(); document.body.style.overflow = ''; smoothScroll.start(); } });
    }
    return () => { document.body.style.overflow = ''; smoothScroll.start(); };
  }, [open]);

  useEffect(() => {
    if (photo.current) gsap.fromTo(photo.current, { autoAlpha: 0, scale: 1.05 }, { autoAlpha: 1, scale: 1, duration: 0.7, ease: 'power2.out' });
    if (copy.current) gsap.fromTo(copy.current.children, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' });
  }, [active]);

  const count = programs.length;
  const program = programs[active] ?? programs[0];
  const detail = details[program.name] ?? fallback;
  const go = (next: number) => setActive((next + count) % count);
  const num = (i: number) => String(i + 1).padStart(2, '0');

  return (
    <dialog ref={ref} className="program-dialog" aria-labelledby="pd-title" onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target === ref.current) onClose(); }}>
      <button type="button" className="pd-close" aria-label="Close" onClick={onClose}>×</button>

      <figure className="pd-photo">
        <img ref={photo} src={asset(program.image)} loading="lazy" decoding="async" alt="" />
        <figcaption>
          <span className="pd-index">{num(active)} <em>/ {num(count - 1)}</em></span>
          <p>{detail.line}</p>
        </figcaption>
      </figure>

      <div className="pd-content">
        <div className="pd-copy" ref={copy}>
          <h2 id="pd-title">{program.name}</h2>
          <p className="pd-facts">{detail.facts.map((fact, i) => <span key={fact}>{i > 0 && <i aria-hidden>·</i>}{fact}</span>)}</p>
          <p className="pd-summary">{detail.summary}</p>
          <ul className="pd-includes">
            {detail.includes.map((item) => <li key={item}><span><img src={asset('8cb78.svg')} alt="" /></span>{item}</li>)}
          </ul>
        </div>

        <div className="pd-foot">
          <p>Not sure which fits? Start with a free 20-minute conversation.</p>
          <div className="pd-actions">
            <a className="pd-link" href="#newsletter" onClick={onClose}>Get in touch <span aria-hidden>→</span></a>
            <div className="pd-nav">
              <button type="button" onClick={() => go(active - 1)} aria-label="Previous program">←</button>
              <button type="button" onClick={() => go(active + 1)} aria-label="Next program">→</button>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}
