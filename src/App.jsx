import { useEffect, useRef, useState } from 'react';
import { SilkBackground } from './hero-scene';

const photoSet = ['29263.png', 'ac63c.png', '0c189.png', '2da04.png', 'fe1a2.png', 'cf382.png', 'd1439.png'];
const journeyCards = [
  ['Your journey to feeling better starts here', '60969.png', 'col-span-2'],
  ['Personalized guidance for your unique needs', null, ''],
  ['Build a calmer, more balanced life', null, ''],
  ['Support that meets you where you are', '1360c.png', 'col-span-2'],
];
const services = ['Individual therapy', 'Stress & anxiety support', 'Couples & family care', 'Yoga & mentoring', 'Mindfulness practice', 'Personal growth coaching'];

function Pill({ children, light = false }) {
  return <span className={`inline-flex items-center gap-3 rounded-full px-5 py-3 text-sm font-bold ${light ? 'bg-white text-stone-900' : 'bg-[#e8e0d9] text-stone-900'}`}>{children}<span className="grid h-8 w-8 place-items-center rounded-full bg-[#dfb57d] text-lg leading-none">›</span></span>;
}

function Header() {
  const [open, setOpen] = useState(false);
  return <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-7 text-white md:px-13 md:py-10">
    <a href="#home" className="font-serif text-5xl tracking-[-0.08em] md:text-6xl">Parna</a>
    <button onClick={() => setOpen(!open)} className="grid h-10 w-10 place-items-center text-3xl" aria-label="Open navigation">☰</button>
    {open && <nav className="absolute right-6 top-22 w-56 rounded-2xl border border-white/20 bg-[#472c06]/95 p-4 shadow-2xl md:right-13"><a className="block rounded-lg px-3 py-2 hover:bg-white/10" href="#about">About</a><a className="block rounded-lg px-3 py-2 hover:bg-white/10" href="#how">How it works</a><a className="block rounded-lg px-3 py-2 hover:bg-white/10" href="#services">Services</a></nav>}
  </header>;
}

function Hero() {
  return <section id="home" className="relative isolate min-h-[850px] overflow-hidden bg-[#4c3004] text-white md:min-h-[982px]">
    <div className="absolute inset-0 -z-10"><SilkBackground /></div><Header />
    <div className="relative z-10 mx-auto flex min-h-[850px] max-w-[1512px] items-center px-6 pt-28 pb-14 md:min-h-[982px] md:px-13">
      <div className="max-w-3xl"><h1 className="font-serif text-5xl leading-[1.05] tracking-tight md:text-7xl">TRANSFORM YOUR <em className="font-serif text-[#fff6de]">Life</em><br />INTO A WILDLY <em className="font-serif text-[#fff6de]">Abundant</em><br />JOURNEY</h1>
        <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed md:text-lg">Empowering designers, illustrators, and artists to craft sustainable, purpose-driven businesses that bring freedom.</p>
        <a href="#how" className="mt-8 inline-block rounded-full bg-white/15 px-7 py-4 text-sm font-bold backdrop-blur">START YOUR JOURNEY →</a>
        <div className="mt-12 max-w-xl rounded-3xl bg-white/15 p-6 backdrop-blur-md"><h2 className="text-3xl font-semibold">How are you feeling today?</h2><div className="mt-8 flex flex-wrap gap-4">{Array.from({ length: 5 }, (_, i) => <button key={i} className="rounded-full border border-white px-4 py-2 text-sm text-white/85">＋ Constant Stress</button>)}</div></div>
      </div>
    </div>
  </section>;
}

function AboutArc() {
  const rail = useRef();
  useEffect(() => {
    let frame; const started = performance.now(); const cards = [...rail.current.children];
    const place = now => { const compact = innerWidth < 768; const r = compact ? 320 : 945; const cy = compact ? 430 : 1161; cards.forEach((card, i) => { const phase = (i / cards.length + (now - started) / 34000) % 1; const degree = 180 + phase * 180; const rad = degree * Math.PI / 180; card.style.left = `${rail.current.clientWidth / 2 + r * Math.cos(rad)}px`; card.style.top = `${cy + r * Math.sin(rad)}px`; card.style.transform = `translate(-50%, -50%) rotate(${degree - 270}deg)`; }); frame = requestAnimationFrame(place); };
    frame = requestAnimationFrame(place); return () => cancelAnimationFrame(frame);
  }, []);
  return <><div ref={rail} className="pointer-events-none absolute inset-x-0 top-0 h-[1000px] overflow-visible">{Array.from({ length: 10 }, (_, i) => <img key={i} src={`/assets/${photoSet[i % photoSet.length]}`} className="absolute h-[116px] w-[100px] rounded-2xl object-cover shadow-xl md:h-[230px] md:w-[200px]" alt="" />)}</div>
    <div className="pointer-events-none absolute left-1/2 top-[421px] hidden h-0 w-0 md:block">{Array.from({ length: 91 }, (_, i) => { const angle = (202.5 + i * 1.5) * Math.PI / 180; return <i key={i} className="absolute h-0.5 w-3 bg-stone-950" style={{ left: `${Math.cos(angle) * 790}px`, top: `${Math.sin(angle) * 790 + 740}px`, transform: `rotate(${i * 1.5 + 22.5}deg)` }} />; })}</div>
  </>;
}

function About() {
  return <section id="about" className="relative overflow-hidden bg-white pb-20 pt-0 md:h-[1039px] md:pb-0"><AboutArc />
    <div className="relative z-10 mx-auto max-w-4xl px-6 pt-[325px] text-center md:pt-[474px]"><span className="rounded-full border border-stone-200 px-3 py-2 text-xs font-bold">ABOUT PARNA</span><h2 className="mt-6 font-serif text-5xl leading-none text-stone-900 md:text-6xl">Helping people find calm, clarity,<br className="hidden md:block" /> and confidence</h2><p className="mx-auto mt-5 max-w-2xl leading-relaxed text-stone-500">We believe meaningful care starts with listening. Our goal is to help our clients succeed despite stress, anxiety, and life changes.</p><a href="#how" className="mt-6 inline-block"><Pill>Learn More</Pill></a></div>
    <div className="relative z-10 mx-auto mt-10 grid max-w-5xl grid-cols-2 divide-x divide-y divide-stone-200 px-5 md:grid-cols-4 md:divide-y-0"><Metric value="12+" label="Years of Experience" /><Metric value="25+" label="Wellness Programs" /><Metric value="98%" label="Client Satisfaction" /><Metric value="1:1" label="Personalized Support" /></div>
  </section>;
}

function Metric({ value, label }) { return <div className="p-5 text-center"><strong className="text-4xl">{value}</strong><span className="mt-2 block text-sm text-stone-500">{label}</span></div>; }

function HowItWorks() { return <section id="how" className="mx-auto max-w-7xl px-6 py-20 md:py-28"><div className="mx-auto mb-10 max-w-xl text-center"><span className="rounded-full border border-amber-300 px-3 py-2 text-xs font-bold">HOW PARNA WORKS</span><h2 className="mt-5 font-serif text-5xl leading-none">Your journey to feeling better starts here</h2></div><div className="grid gap-4 md:grid-cols-4">{journeyCards.map(([title, image, span], i) => <article key={title} className={`relative min-h-72 overflow-hidden rounded-3xl border border-amber-300 bg-[#fff0d5] p-8 ${span}`}><h3 className="absolute bottom-8 z-10 max-w-sm text-3xl font-medium leading-tight">{title}</h3>{image && <img className="absolute inset-0 h-full w-full object-cover" src={`/assets/${image}`} alt="" />}{image && <div className="absolute inset-0 bg-black/10" />}</article>)}</div></section>; }

function Services() { return <section id="services" className="mx-auto max-w-7xl px-6 py-20"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><span className="rounded-full bg-[#e8e0d9] px-3 py-2 text-xs font-bold">WHAT PARNA HELPS WITH</span><h2 className="mt-5 max-w-xl font-serif text-5xl leading-none">Support for every step of your wellness journey</h2></div><p className="max-w-xs leading-relaxed text-stone-500">Personalized care and practical guidance to help you navigate challenges and create lasting positive change.</p></div><div className="mt-10 border-y border-stone-200">{services.map((service, i) => <div key={service} className="flex items-center gap-5 border-b border-stone-200 py-5 last:border-0"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#e8e0d9] text-sm font-bold">{String(i + 1).padStart(2, '0')}</span><h3 className="text-xl font-semibold">{service}</h3><span className="ml-auto hidden rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-500 md:block">Personalized care</span></div>)}</div></section>; }

function Transformation() { const left = ['Constant Stress', 'Trouble Sleeping', 'Self Doubt', 'Emotional Burnout', 'Managing Crisis', 'Feeling Overwhelmed']; const right = ['Inner Calm', 'Restful Sleep', 'Self Confidence', 'Emotional Balance', 'Healthy Coping', 'Greater Clarity']; return <section className="overflow-hidden bg-[#572b00] px-6 py-20 text-white"><div className="mx-auto max-w-6xl text-center"><span className="rounded-full bg-white px-3 py-2 text-xs font-bold text-stone-900">TRANSFORMATION</span><h2 className="mt-5 font-serif text-5xl leading-none">A healthier tomorrow starts today</h2><div className="mt-14 grid gap-8 md:grid-cols-[1fr_auto_1fr]"><div className="grid gap-3">{left.map(item => <span key={item} className="rounded-full border border-white/60 px-4 py-2">＋ {item}</span>)}</div><div className="hidden h-80 w-px bg-gradient-to-b from-transparent via-[#ffe0a6] to-transparent md:block" /><div className="grid gap-3">{right.map(item => <span key={item} className="rounded-full bg-[#faeedf] px-4 py-2 font-semibold text-[#3c210b]">＋ {item}</span>)}</div></div><a href="#newsletter" className="mt-12 inline-block"><Pill light>Join Parna Today</Pill></a></div></section>; }

function Stories() { return <section className="mx-auto max-w-6xl px-6 py-24"><span className="rounded-full bg-[#d7dfe5] px-3 py-2 text-xs font-bold">CLIENT JOURNEY</span><h2 className="mt-5 border-b border-stone-200 pb-8 font-serif text-5xl leading-none">Real stories of growth, healing, and lasting change.</h2><article className="mt-10 grid overflow-hidden rounded-3xl bg-[#fff9f0] shadow-[0_22px_0_#e2c3a3,0_46px_0_#947d44] md:grid-cols-2"><img className="h-96 w-full object-cover md:h-full" src="/assets/79171.png" alt="A calm moment outdoors" /><div className="p-8 md:p-12"><span className="rounded-md bg-white px-3 py-2 text-xs font-bold">STRESS RECOVERY</span><h3 className="mt-6 text-4xl font-medium">A journey from stress to serenity</h3><p className="mt-5 leading-relaxed text-stone-600">A personalized recovery plan helped create healthier routines, better sleep, and a renewed sense of emotional well-being.</p><a className="mt-8 inline-block underline" href="#programs">View Details</a></div></article></section>; }

function Programs() { const programs = [['Depression & Anxiety', 'Rebuilding safe baseline states to gently pull you out of chronic shutdown or high-activation tension.', '0c189.png'], ['PTSD & Trauma Recovery', 'Restoring a secure boundary system so you can exist safely in the present moment.', '1360c.png'], ['Grief & Relationship Issues', 'Expanding your window of tolerance to hold profound loss with care.', '2da04.png']]; return <section id="programs" className="mx-auto max-w-7xl px-6 py-20"><h2 className="text-center font-serif text-5xl">Programs for your next chapter</h2><div className="mt-12 grid border border-stone-300 md:grid-cols-3">{programs.map(([title, copy, image]) => <article key={title} className="border-b border-stone-300 bg-[#fff9f0] p-8 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"><img className="mb-7 h-52 w-full rounded-xl object-cover" src={`/assets/${image}`} alt="" /><h3 className="font-serif text-3xl">{title}</h3><p className="mt-4 leading-relaxed text-stone-600">{copy}</p></article>)}</div></section>; }

function Footer() { return <footer id="newsletter" className="bg-[#572e00] px-6 py-16 text-[#eadfd7]"><div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-7 border-b border-white/20 pb-12 md:flex-row md:items-center"><h2 className="max-w-xl text-4xl font-medium">Join our newsletter to get insights and updates</h2><form className="flex max-w-md flex-1 rounded-full border border-white/20 bg-white/10 p-2"><input className="min-w-0 flex-1 bg-transparent px-4 outline-none placeholder:text-white/50" placeholder="Email address" /><button className="rounded-full bg-white px-5 py-3 text-sm font-bold text-stone-900">Subscribe</button></form></div><div className="grid gap-8 py-10 md:grid-cols-4"><div className="md:col-span-2"><a href="#home" className="font-serif text-4xl">Parna</a><p className="mt-5 max-w-md text-sm leading-relaxed text-white/70">Providing licensed online therapy and mental health support tailored directly to your life.</p></div><div><h3 className="mb-3 font-bold">Platform</h3><a className="block py-1 text-white/70" href="#how">Our Method</a><a className="block py-1 text-white/70" href="#services">Support Team</a></div><div><h3 className="mb-3 font-bold">Resources</h3><a className="block py-1 text-white/70" href="#about">About</a><a className="block py-1 text-white/70" href="#programs">Programs</a></div></div><div className="border-t border-white/20 pt-6 text-sm text-white/50">© 2026 Parna. All rights reserved.</div></div></footer>; }

export default function App() { return <main className="overflow-hidden bg-white text-stone-900"><Hero /><About /><HowItWorks /><Services /><Transformation /><Stories /><Programs /><Footer /></main>; }
