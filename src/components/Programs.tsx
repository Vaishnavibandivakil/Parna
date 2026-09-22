import { asset } from '../assets';
const cards = [
  { title: 'Depression & Anxiety', text: 'Rebuilding safe baseline states to gently pull you out of chronic shutdown (depression) or high-activation tension (anxiety).' },
  { title: 'PTSD & Trauma Recovery', text: 'Completing defensive shock loops and restoring a secure boundary system so you can exist safely in the present moment.' },
  { title: 'Grief & Relationship Issues', text: 'Expanding our window of tolerance to hold profound loss, allowing the emotional waves to process dynamically without numbness.' },
];
export function Programs() { return <section className="programs section" id="programs"><h2>Lorem ipsum</h2><div className="program-grid"><article><h3>{cards[0].title}</h3><p>{cards[0].text}</p></article><img src={asset('1360c.png')} alt="A peaceful moment beside the sea" /><article><h3>{cards[1].title}</h3><p>{cards[1].text}</p></article><img src={asset('79171.png')} alt="Sunlight entering a quiet room" /><article><h3>{cards[2].title}</h3><p>{cards[2].text}</p></article><img src={asset('60969.png')} alt="A supportive conversation" /></div></section>; }
