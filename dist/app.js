const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');
menu.addEventListener('click', () => {const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');nav.hidden = !open;});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {nav.hidden=true;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){nav.hidden=true;menu.setAttribute('aria-expanded','false');}});
document.querySelectorAll('.feeling-list button').forEach(b=>b.addEventListener('click',()=>b.setAttribute('aria-pressed',String(b.getAttribute('aria-pressed')!=='true'))));
document.querySelectorAll('.tick').forEach((el,i)=>{const a=(202.5+i*1.5)*Math.PI/180;el.style.left=(Math.cos(a)*790)+'px';el.style.top=(Math.sin(a)*790+740)+'px';el.style.transform='rotate('+(i*1.5+22.5)+'deg)';});
document.querySelector('form').addEventListener('submit',e=>{e.preventDefault();document.querySelector('.form-status').textContent='Newsletter sign-up is not available yet. Please check back soon.';});
const dialog=document.querySelector('dialog');
document.querySelectorAll('[data-legal]').forEach(b=>b.addEventListener('click',()=>{dialog.querySelector('h2').textContent=b.dataset.legal;dialog.querySelector('p').textContent='This information has not been provided yet. Please check back before using Parna’s services.';dialog.showModal();}));
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});

const photoArc = document.querySelector('.photo-arc');
if (photoArc) {
  const originalCards = [...photoArc.querySelectorAll('.arc-image')];
  const cardProfiles = [
    ['180px', '210px', '-54deg', '170px', '72px'],
    ['190px', '220px', '-36deg', '45px', '22px'],
    ['200px', '230px', '-18deg', '0px', '0px'],
    ['206px', '240px', '0deg', '0px', '0px'],
    ['200px', '230px', '18deg', '18px', '4px'],
    ['190px', '220px', '36deg', '90px', '36px'],
    ['180px', '210px', '54deg', '210px', '84px'],
  ];
  const track = document.createElement('div');
  track.className = 'photo-track';
  const cards = [...originalCards, ...originalCards.map(card => card.cloneNode(true))];
  cards.forEach((card, index) => {
    const [width, height, tilt, rise, mobileRise] = cardProfiles[index % cardProfiles.length];
    card.className = 'carousel-card';
    card.style.setProperty('--card-width', width);
    card.style.setProperty('--card-height', height);
    card.style.setProperty('--card-tilt', tilt);
    card.style.setProperty('--card-rise', rise);
    card.style.setProperty('--mobile-rise', mobileRise);
    track.append(card);
  });
  photoArc.replaceChildren(track);
}
