import { useRef } from 'react';
import { gsap } from 'gsap';
import { asset } from '../assets';

const services = [
  ['Individual therapy', '+ 50-Min Sessions', '+ Personalized Care'], ['Stress & anxiety support', '+ 8 Weeks Sessions', '+ Beginner Friendly'], ['Couples & family care', '+ Joint Sessions', '+ Relationship Focused'], ['Yoga & Mentoring', '+ Practical Sessions', '+ Personalized Outcomes'], ['Mindfulness practice', '+ Daily Practice Sessions', '+ Guided Exercises'], ['Personal growth coaching', '+ Daily Practice Sessions', '+ Personalized Growth'],
];
const previews = ['c015c.png', '0c189.png', '506ba.png', 'd456c.png', 'ac63c.png', '79171.png'];
const previewStates = [{x:-44,y:-12,rotation:-8},{x:20,y:-4,rotation:7},{x:-18,y:8,rotation:-6},{x:34,y:-10,rotation:9},{x:-32,y:12,rotation:-7},{x:16,y:5,rotation:6}];

export function Services() {
  const section = useRef<HTMLElement>(null); const preview = useRef<HTMLDivElement>(null); const previewImage = useRef<HTMLImageElement>(null); const rows = useRef<(HTMLDivElement | null)[]>([]);
  const show = (index: number) => { if (window.innerWidth < 801 || !preview.current || !previewImage.current || !section.current || !rows.current[index]) return; previewImage.current.src = asset(previews[index]); const row = rows.current[index]!.getBoundingClientRect(); const parent = section.current.getBoundingClientRect(); const state = previewStates[index]; const target = { x: row.left - parent.left + row.width * .53 + state.x, y: row.top - parent.top + row.height / 2 - preview.current.offsetHeight / 2 + state.y, rotation: state.rotation }; gsap.killTweensOf(preview.current); gsap.to(preview.current, { autoAlpha: 1, scale: 1, ...target, duration: .42, ease: 'power3.out', overwrite: 'auto' }); };
  const hide = () => { if (preview.current) gsap.to(preview.current, { autoAlpha: 0, scale: .92, duration: .24, ease: 'power2.in', overwrite: 'auto' }); };
  return <section className="services section" id="services" ref={section}><div className="services-heading"><div><span className="badge">WHAT PARNA HELPS WITH</span><h2>Support for every step of your<br /> wellness journey</h2></div><p>Personalized care and practical guidance to help you navigate challenges, build resilience, and create lasting positive change.</p></div><div className="service-list" onPointerLeave={hide}>{services.map(([name, tagOne, tagTwo], index) => <div className="service-row" key={name} ref={node => { rows.current[index] = node; }} tabIndex={0} onPointerEnter={() => show(index)} onFocus={() => show(index)}><span className="number">{String(index + 1).padStart(2, '0')}</span><h3>{name}</h3><span className="tag">{tagOne}</span><span className="tag">{tagTwo}</span></div>)}</div><div className="service-hover-preview" ref={preview} aria-hidden="true"><img ref={previewImage} src={asset(previews[0])} alt="" /></div><a className="program-link" href="#programs">Program Details <img src={asset('7f41e.svg')} alt="" /></a></section>;
}
