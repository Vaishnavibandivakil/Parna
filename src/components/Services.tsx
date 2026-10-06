import { useRef, useState } from 'react';
import { ProgramDialog } from './ProgramDialog';
import { programs } from '../data/programs';
import { gsap } from 'gsap';
import { asset } from '../assets';

const services = programs.map((p) => [p.name, ...p.tags] as [string, string, string]);
const previews = programs.map((p) => p.image);
const previewStates = [{x:-44,y:-12,rotation:-8},{x:20,y:-4,rotation:7},{x:-18,y:8,rotation:-6},{x:34,y:-10,rotation:9},{x:-32,y:12,rotation:-7},{x:16,y:5,rotation:6}];

export function Services() {
  const [dialog, setDialog] = useState<{ open: boolean; index: number }>({ open: false, index: 0 });
  const openDialog = (index: number) => setDialog({ open: true, index });
  const section = useRef<HTMLElement>(null); const preview = useRef<HTMLDivElement>(null); const previewImage = useRef<HTMLImageElement>(null); const rows = useRef<(HTMLDivElement | null)[]>([]);
  const show = (index: number) => { if (window.innerWidth < 801 || !preview.current || !previewImage.current || !section.current || !rows.current[index]) return; previewImage.current.src = asset(previews[index]); const row = rows.current[index]!.getBoundingClientRect(); const parent = section.current.getBoundingClientRect(); const state = previewStates[index]; const target = { x: row.left - parent.left + row.width * .53 + state.x, y: row.top - parent.top + row.height / 2 - preview.current.offsetHeight / 2 + state.y, rotation: state.rotation }; gsap.killTweensOf(preview.current); gsap.to(preview.current, { autoAlpha: 1, scale: 1, ...target, duration: .42, ease: 'power3.out', overwrite: 'auto' }); };
  const hide = () => { if (preview.current) gsap.to(preview.current, { autoAlpha: 0, scale: .92, duration: .24, ease: 'power2.in', overwrite: 'auto' }); };
  return <section className="services section" id="services" ref={section}><div className="services-heading"><div><span className="badge section-badge">WHAT PARNA PRESENCE HELPS WITH</span><h2>Support for every step of your<br /> wellness journey</h2></div><p>Personalized care and practical guidance to help you navigate challenges, build resilience, and create lasting positive change.</p></div><div className="service-list" onPointerLeave={hide}>{services.map(([name, tagOne, tagTwo], index) => <div className="service-row" key={name} ref={node => { rows.current[index] = node; }} tabIndex={0} onPointerEnter={() => show(index)} onFocus={() => show(index)} onClick={() => openDialog(index)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openDialog(index); } }}><span className="number">{String(index + 1).padStart(2, '0')}</span><h3>{name}</h3><span className="tag">{tagOne}</span><span className="tag">{tagTwo}</span></div>)}</div><div className="service-hover-preview" ref={preview} aria-hidden="true"><img ref={previewImage} src={asset(previews[0])} alt="" /></div><a className="program-link" href="#program-details" onClick={event => { event.preventDefault(); openDialog(0); }}>Program Details <img src={asset('7f41e.svg')} alt="" /></a><ProgramDialog open={dialog.open} index={dialog.index} programs={programs} onClose={() => setDialog(current => ({ ...current, open: false }))} /></section>;
}
