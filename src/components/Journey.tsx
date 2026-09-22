import { asset } from '../assets';
const title = <>Your journey to feeling<br />better starts here</>;
export function Journey() {
  return <section className="how section" id="how"><div className="section-heading"><span className="badge">HOW PARNA WORKS</span><h2>{title}</h2></div><div className="journey-grid"><article className="journey-photo"><img src={asset('c015c.png')} alt="Woman enjoying a calm moment outdoors" /><h3>{title}</h3></article><article className="journey-tan"><h3>{title}</h3></article><article className="journey-tan"><h3>{title}</h3></article><article className="journey-stretch"><img src={asset('d456c.png')} alt="" /><h3>{title}</h3></article></div></section>;
}
