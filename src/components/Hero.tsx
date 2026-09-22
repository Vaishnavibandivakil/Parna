import { useState } from 'react';
import { asset } from '../assets';
import { HeroScene } from './HeroScene';

export function Hero() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const feelings = ['Constant Stress', 'Trouble Sleeping', 'Self Doubt', 'Emotional Burnout', 'Feeling Overwhelmed'];
  const toggleFeeling = (index: number) => setSelected(current => current.includes(index) ? current.filter(value => value !== index) : [...current, index]);
  return <section className="hero" id="home">
    <HeroScene />
    <header>
      <a className="brand" href="#home">Parna</a>
      <button className="menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="navigation" onClick={() => setMenuOpen(value => !value)}><img src={asset('d25b6.svg')} alt="" /></button>
      <nav id="navigation" hidden={!menuOpen}>
        {['About Parna', 'Our Method', 'Support', 'Client Journey', 'Newsletter'].map((label, index) => <a key={label} href={['#about', '#how', '#services', '#stories', '#newsletter'][index]} onClick={() => setMenuOpen(false)}>{label}</a>)}
      </nav>
    </header>
    <div className="hero-copy">
      <h1>TRANSFORM YOUR <em>Life</em><br />INTO A WILDLY <em>Abundant</em> JOURNEY</h1>
      <p>Empowering designers, illustrators, and artists to craft sustainable, purpose-driven businesses that bring freedom</p>
      <a className="hero-cta" href="#how">START YOUR JOURNEY →</a>
      <div className="feelings" id="assessment"><h2>How are you feeling today?</h2><div className="feeling-list">{feelings.map((feeling, index) => <button key={feeling} aria-pressed={selected.includes(index)} onClick={() => toggleFeeling(index)}>+ &nbsp; {feeling}</button>)}</div></div>
    </div>
  </section>;
}
