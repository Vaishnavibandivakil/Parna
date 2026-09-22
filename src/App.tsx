import { About } from './components/About';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Journey } from './components/Journey';
import { Programs } from './components/Programs';
import { Services } from './components/Services';
import { Stories } from './components/Stories';
import { Transformation } from './components/Transformation';

export default function App() {
  return (
    <>
      <main>
        <Hero />
        <About />
        <Journey />
        <Services />
        <Transformation />
        <Stories />
        <Programs />
      </main>
      <Footer />
    </>
  );
}
