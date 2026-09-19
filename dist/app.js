const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');
menu.addEventListener('click', () => {const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');nav.hidden = !open;});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {nav.hidden=true;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){nav.hidden=true;menu.setAttribute('aria-expanded','false');}});
document.querySelectorAll('.feeling-list button').forEach(b=>b.addEventListener('click',()=>b.setAttribute('aria-pressed',String(b.getAttribute('aria-pressed')!=='true'))));
const positionTicks = () => {
  const compact = window.matchMedia('(max-width: 800px)').matches;
  const radius = compact ? 230 : 790;
  const centerY = compact ? 430 : 740;
  document.querySelectorAll('.tick').forEach((el, i) => {
    const a = (202.5 + i * 1.5) * Math.PI / 180;
    el.style.left = `${Math.cos(a) * radius}px`;
    el.style.top = `${Math.sin(a) * radius + centerY}px`;
    el.style.transform = `rotate(${i * 1.5 + 22.5}deg)`;
  });
};
positionTicks();
window.addEventListener('resize', positionTicks);
document.querySelector('form').addEventListener('submit',e=>{e.preventDefault();document.querySelector('.form-status').textContent='Newsletter sign-up is not available yet. Please check back soon.';});
const dialog=document.querySelector('dialog');
document.querySelectorAll('[data-legal]').forEach(b=>b.addEventListener('click',()=>{dialog.querySelector('h2').textContent=b.dataset.legal;dialog.querySelector('p').textContent='This information has not been provided yet. Please check back before using Parna’s services.';dialog.showModal();}));
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});

const photoArc = document.querySelector('.photo-arc');
if (photoArc) {
  const originalCards = [...photoArc.querySelectorAll('.arc-image')];
  const cardProfiles = [
    ['180px', '210px'],
    ['190px', '220px'],
    ['200px', '230px'],
    ['206px', '240px'],
    ['200px', '230px'],
    ['190px', '220px'],
    ['180px', '210px'],
  ];
  const cards = Array.from({ length: 10 }, (_, index) => originalCards[index % originalCards.length].cloneNode(true));
  cards.forEach((card, index) => {
    const [width, height] = cardProfiles[index % cardProfiles.length];
    card.className = 'carousel-card';
    card.style.setProperty('--card-width', width);
    card.style.setProperty('--card-height', height);
    photoArc.append(card);
  });
  originalCards.forEach(card => card.remove());

  const duration = 34000;
  const start = performance.now();
  const positionCards = now => {
    const compact = window.matchMedia('(max-width: 800px)').matches;
    const radius = compact ? 320 : 945;
    const centerY = compact ? 430 : 1161;
    const progress = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : (now - start) / duration;
    cards.forEach((card, index) => {
      const phase = (index / cards.length + progress) % 1;
      const degrees = 180 + phase * 180;
      const radians = degrees * Math.PI / 180;
      const x = photoArc.clientWidth / 2 + radius * Math.cos(radians);
      const y = centerY + radius * Math.sin(radians);
      const tilt = degrees - 270;
      card.style.left = `${x}px`;
      card.style.top = `${y}px`;
      card.style.transform = `translate(-50%, -50%) rotate(${tilt}deg)`;
    });
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) requestAnimationFrame(positionCards);
  };
  positionCards(start);
}

const heroSceneScript = document.createElement('script');
heroSceneScript.src = 'hero-scene.js';
heroSceneScript.async = true;
heroSceneScript.dataset.parnaHero = 'true';
document.head.append(heroSceneScript);
