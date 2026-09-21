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

const setupServiceHoverPreviews = () => {
  const servicesSection = document.querySelector('.services');
  const serviceList = servicesSection?.querySelector('.service-list');
  if (!servicesSection || !serviceList || !window.gsap) return;

  const serviceRows = [...serviceList.querySelectorAll('.service-row')];
  const previewSources = ['c015c.png', '0c189.png', '506ba.png', 'd456c.png', 'ac63c.png', '79171.png'];
  const previewStates = [
    { x: -44, y: -12, rotation: -8 },
    { x: 20, y: -4, rotation: 7 },
    { x: -18, y: 8, rotation: -6 },
    { x: 34, y: -10, rotation: 9 },
    { x: -32, y: 12, rotation: -7 },
    { x: 16, y: 5, rotation: 6 },
  ];
  const preview = document.createElement('div');
  const previewImage = document.createElement('img');
  const desktop = window.matchMedia('(min-width: 801px)');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let isVisible = false;

  preview.className = 'service-hover-preview';
  preview.setAttribute('aria-hidden', 'true');
  previewImage.alt = '';
  preview.append(previewImage);
  servicesSection.append(preview);

  const showPreview = index => {
    if (!desktop.matches) return;
    const rowRect = serviceRows[index].getBoundingClientRect();
    const sectionRect = servicesSection.getBoundingClientRect();
    const style = previewStates[index];
    const state = {
      x: rowRect.left - sectionRect.left + rowRect.width * 0.53 + style.x,
      y: rowRect.top - sectionRect.top + rowRect.height / 2 - preview.offsetHeight / 2 + style.y,
      rotation: style.rotation,
    };
    previewImage.src = `assets/${previewSources[index]}`;
    window.gsap.killTweensOf(preview);
    const duration = reduceMotion.matches ? 0 : 0.42;

    if (isVisible) {
      window.gsap.to(preview, { autoAlpha: 1, x: state.x, y: state.y, rotation: state.rotation, scale: 1, duration, ease: 'power3.out', overwrite: 'auto' });
    } else {
      window.gsap.fromTo(preview, { autoAlpha: 0, x: state.x, y: state.y + 20, rotation: state.rotation - 3, scale: 0.88 }, { autoAlpha: 1, x: state.x, y: state.y, rotation: state.rotation, scale: 1, duration, ease: 'power3.out', overwrite: 'auto' });
    }
    isVisible = true;
  };

  const hidePreview = () => {
    if (!isVisible) return;
    isVisible = false;
    window.gsap.killTweensOf(preview);
    window.gsap.to(preview, { autoAlpha: 0, scale: 0.92, y: '+=14', duration: reduceMotion.matches ? 0 : 0.24, ease: 'power2.in', overwrite: 'auto' });
  };

  serviceRows.forEach((row, index) => {
    row.tabIndex = 0;
    row.addEventListener('pointerenter', () => showPreview(index));
    row.addEventListener('focus', () => showPreview(index));
  });
  serviceList.addEventListener('pointerleave', hidePreview);
  serviceList.addEventListener('focusout', () => requestAnimationFrame(() => {
    if (!serviceList.contains(document.activeElement)) hidePreview();
  }));
  desktop.addEventListener('change', () => {
    if (!desktop.matches) hidePreview();
  });
};

const gsapScript = document.createElement('script');
gsapScript.src = 'https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/gsap.min.js';
gsapScript.async = true;
gsapScript.addEventListener('load', setupServiceHoverPreviews, { once: true });
document.head.append(gsapScript);
