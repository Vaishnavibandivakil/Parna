import { FormEvent, useState } from 'react';
import { asset } from '../assets';

const social = [
  { label: 'Instagram', href: 'https://instagram.com/' },
  { label: 'LinkedIn', href: 'https://linkedin.com/' },
];

export function Footer() {
  const [message, setMessage] = useState('');
  const subscribe = (event: FormEvent) => { event.preventDefault(); setMessage('Thank you. Parna will be in touch within a working day to arrange a time.'); };
  return <footer id="newsletter">
    <div className="newsletter"><h2>Ready to begin? Book a session with Parna</h2><form onSubmit={subscribe}><label className="sr-only" htmlFor="email">Email address</label><input id="email" type="email" placeholder="Enter your email..." required /><button type="submit">Book a session<span><img src={asset('f78ef.svg')} alt="" /></span></button></form><p className="form-status" role="status">{message}</p></div>
    <div className="footer-grid footer-simple">
      <div className="footer-brand"><a className="brand-logo" href="#home"><img src={asset('logo-lockup.png')} alt="Parna Presence" /></a><p>Sessions online in English, Hindi and Bengali</p></div>
      <div className="footer-social">{social.map((item, index) => [index > 0 && <i key={`sep-${item.label}`} aria-hidden>·</i>, <a key={item.label} href={item.href} target="_blank" rel="noreferrer">{item.label}</a>])}</div>
    </div>
    <div className="copyright"><span>© 2026 Parna Presence. All rights reserved.</span></div>
  </footer>;
}
