import { asset } from '../assets';
import { whatsappUrl } from '../contact';

const social = [
  { label: 'Instagram', href: 'https://instagram.com/' },
  { label: 'LinkedIn', href: 'https://linkedin.com/' },
];

export function Footer() {
  return <footer id="newsletter">
    <div className="newsletter">
      <h2>Ready to begin? Book a session with Parna</h2>
      <div className="newsletter-contact">
        <span className="newsletter-email">parnabiswas@parnapresence.com</span>
        <a className="newsletter-book" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          Book a session<span><img src={asset('f78ef.svg')} alt="" /></span>
        </a>
      </div>
    </div>
    <div className="footer-grid footer-simple">
      <div className="footer-brand"><a className="brand-logo" href="#home"><img src={asset('logo-lockup.png')} alt="Parna Presence" /></a><p>Sessions online in English, Hindi and Bengali</p></div>
      <div className="footer-social">{social.map((item, index) => [index > 0 && <i key={`sep-${item.label}`} aria-hidden>·</i>, <a key={item.label} href={item.href} target="_blank" rel="noreferrer">{item.label}</a>])}</div>
    </div>
    <div className="copyright"><span>© 2026 Parna Presence. All rights reserved.</span></div>
  </footer>;
}
