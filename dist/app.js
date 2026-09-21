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

const setupStoryCardStack = () => {
  const storiesSection = document.querySelector('.stories');
  const firstCard = storiesSection?.querySelector('.story-card');
  if (!storiesSection || !firstCard || !window.gsap) return;

  const storyBadge = storiesSection.querySelector(':scope > .badge');
  const storyHeading = storiesSection.querySelector(':scope > h2');
  if (storyBadge && storyHeading) {
    const storyIntro = document.createElement('div');
    storyIntro.className = 'stories-stack-heading';
    storyBadge.before(storyIntro);
    storyIntro.append(storyBadge, storyHeading);
  }

  const stories = [
    {
      image: '57a23.png',
      label: 'STRESS RECOVERY',
      title: 'A Journey from stress to serenity',
      description: 'After months of feeling overwhelmed by work and daily responsibilities, Saqib Mahmud embraced a personalized recovery plan that helped him develop healthier routines, enjoy better sleep, and reconnect with his emotional well-being.',
      quote: '“The support, peaceful environment, and personalized guidance gave me the confidence to prioritize my well-being again.”',
      name: 'Saqib Mahmud',
    },
    {
      image: 'c015c.png',
      label: 'MINDFULNESS',
      title: 'A return to a calmer rhythm',
      description: 'With gentle practices and regular support, Maya rebuilt a daily rhythm that made space for quiet focus, steadier energy, and meaningful moments of rest.',
      quote: '“I learned how to slow down, listen to myself, and make calm part of every day.”',
      name: 'Maya L.',
    },
    {
      image: 'd456c.png',
      label: 'PERSONAL GROWTH',
      title: 'Finding confidence in every step',
      description: 'A focused plan helped Nina turn uncertainty into forward movement, with practical tools that supported confidence at home, work, and beyond.',
      quote: '“The small changes added up. I feel more grounded and confident in my choices.”',
      name: 'Nina R.',
    },
  ];
  const deck = document.createElement('div');
  const stackPin = document.createElement('div');
  const cards = [firstCard];

  deck.className = 'story-deck';
  stackPin.className = 'story-stack-pin';
  firstCard.before(deck);
  deck.append(stackPin);
  stackPin.append(firstCard);
  stories.slice(1).forEach(() => {
    const clone = firstCard.cloneNode(true);
    stackPin.append(clone);
    cards.push(clone);
  });

  cards.forEach((card, index) => {
    const story = stories[index];
    const image = card.querySelector('.story-photo > img');
    const badge = card.querySelector('.story-copy > .badge');
    const title = card.querySelector('.story-copy h3');
    const description = card.querySelector('.story-copy > p');
    const quote = card.querySelector('.quote blockquote');
    const name = card.querySelector('.quote strong');
    const details = card.querySelector('.benefits');
    const detailsLink = card.querySelector('.story-copy .pill');

    image.src = `assets/${story.image}`;
    badge.textContent = story.label;
    title.textContent = story.title;
    description.textContent = story.description;
    quote.textContent = story.quote;
    name.textContent = story.name;
    details.id = `story-benefits-${index + 1}`;
    detailsLink.href = `#${details.id}`;
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 801px)');
  if (!desktop.matches) {
    return;
  }

  const setY = cards.map(card => window.gsap.quickSetter(card, 'y', 'px'));
  let frameId = 0;

  cards.forEach((card, index) => window.gsap.set(card, { zIndex: index + 1 }));
  if (reduceMotion.matches) {
    window.gsap.set(cards[0], { y: 0, opacity: 1 });
    window.gsap.set(cards[1], { y: 0, opacity: 1 });
    window.gsap.set(cards[2], { y: 0, opacity: 1 });
    return;
  }

  const updateStack = () => {
    frameId = 0;
    const scrollTop = window.scrollY;
    const viewportHeight = window.innerHeight;
    const deckTop = deck.getBoundingClientRect().top + scrollTop;
    const stickyTop = Math.max(24, viewportHeight - stackPin.offsetHeight);
    const stageStart = deckTop - stickyTop;
    const stageDistance = Math.max(1, deck.offsetHeight - stackPin.offsetHeight);
    const progress = Math.max(0, Math.min(1, (scrollTop - stageStart) / stageDistance));
    const cardHeight = stackPin.offsetHeight;
    const clamp = value => Math.max(0, Math.min(1, value));
    const secondProgress = clamp((progress - 0.01) / 0.42);
    const thirdProgress = clamp((progress - 0.51) / 0.42);
    const rise = (start, end, amount) => start + (end - start) * amount;

    setY[0](0);
    setY[1](rise(cardHeight, 0, secondProgress));
    setY[2](rise(cardHeight, 0, thirdProgress));
  };

  const requestUpdate = () => {
    if (!frameId) frameId = window.requestAnimationFrame(updateStack);
  };

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  requestUpdate();
};

const gsapScript = document.createElement('script');
gsapScript.src = 'https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/gsap.min.js';
gsapScript.async = true;
gsapScript.addEventListener('load', () => {
  setupServiceHoverPreviews();
  setupStoryCardStack();
}, { once: true });
document.head.append(gsapScript);
