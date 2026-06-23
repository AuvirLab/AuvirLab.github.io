function toggleMenu() {
    document.getElementById('nav-links').classList.toggle('open');
  }

  const lenis = new Lenis({
    duration: 1.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1
  });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
  feather.replace();

  /* ---------- NAV GLASS ---------- */
  const nav = document.querySelector('nav');
  if (nav) nav.classList.add('glass');

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const id = a.getAttribute('href');
      if (id && id.length > 1) {
        const target = document.querySelector(id);
        if (target) lenis.scrollTo(target);
      }
      document.getElementById('nav-links').classList.remove('open');
    });
  });

  /* ---------- TABS ---------- */
  function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tc => {
      tc.classList.remove('active');
      tc.querySelectorAll('.reveal.visible').forEach(el => el.classList.remove('visible'));
    });
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(`tab-${tabId}`).classList.add('active');
  }

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  /* ---------- MODAL ---------- */
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalTrack = document.getElementById('modalTrack');
  const modalCounter = document.getElementById('modalCounter');
  const modalPrev = document.getElementById('modalPrev');
  const modalNext = document.getElementById('modalNext');
  const modalClose = document.getElementById('modalClose');

  let currentImages = [];
  let currentImageIndex = 0;

  function showGalleryImage(index) {
    currentImageIndex = index;
    modalTrack.style.transform = `translateX(-${index * 100}%)`;
    modalCounter.textContent = currentImages.length > 1 ? `${index + 1} / ${currentImages.length}` : '';
    modalPrev.style.display = index === 0 ? 'none' : '';
    modalNext.style.display = index === currentImages.length - 1 ? 'none' : '';
    modalCounter.style.display = currentImages.length > 1 ? '' : 'none';
  }

  document.querySelectorAll('.rec-card').forEach(card => {
    card.addEventListener('click', () => {
      modalTitle.textContent = card.dataset.title;
      if (card.dataset.desc) {
        modalDesc.textContent = card.dataset.desc;
        modalDesc.style.display = '';
      } else {
        modalDesc.textContent = '';
        modalDesc.style.display = 'none';
      }
      currentImages = (card.dataset.images || 'assets/images/workinprogress.jpg').split(',').map(src => src.includes('/') ? src : 'assets/images/' + src);
      modalTrack.innerHTML = currentImages.map(src =>
        `<div class="modal-img-slide"><img src="${src}" alt=""></div>`
      ).join('');
      modalTrack.style.transition = 'none';
      modalTrack.style.transform = 'translateX(0)';
      void modalTrack.offsetHeight;
      modalTrack.style.transition = '';
      currentImageIndex = 0;
      showGalleryImage(0);
      modal.classList.add('open');
      lenis.stop();
      const scrollY = window.scrollY;
      document.documentElement.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    });
  });

  modalPrev.addEventListener('click', () => {
    if (currentImageIndex > 0) {
      showGalleryImage(currentImageIndex - 1);
    }
  });

  modalNext.addEventListener('click', () => {
    if (currentImageIndex < currentImages.length - 1) {
      showGalleryImage(currentImageIndex + 1);
    }
  });

  function closeModal() {
    document.getElementById('modal').classList.remove('open');
    const scrollY = parseInt(document.body.style.top || '0') * -1;
    document.documentElement.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    window.scrollTo(0, scrollY);
    lenis.start();
  }
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal();
      document.getElementById('eggModal')?.classList.remove('open');
    }
  });

  /* ---------- FEATURED BADGE ---------- */
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.querySelectorAll('.featured-badge-wrap').forEach(wrap => {
      wrap.addEventListener('click', e => {
        e.stopPropagation();
        wrap.classList.toggle('touch-show');
      });
    });
  }

  /* ---------- CAROUSEL ---------- */
  document.querySelectorAll('.carousel').forEach(c => {
    const track = c.querySelector('.carousel-track');
    const slides = c.querySelectorAll('.carousel-slide');
    const counter = c.querySelector('.carousel-counter');
    const prev = c.querySelector('.carousel-prev');
    const next = c.querySelector('.carousel-next');
    const total = slides.length;
    let idx = 0;

    function go(i) {
      idx = i;
      track.style.transform = `translateX(-${idx * 100}%)`;
      counter.textContent = `${idx + 1} / ${total}`;
      prev.style.display = idx === 0 ? 'none' : '';
      next.style.display = idx === total - 1 ? 'none' : '';
    }

    prev.addEventListener('click', () => { if (idx > 0) go(idx - 1); });
    next.addEventListener('click', () => { if (idx < total - 1) go(idx + 1); });

    let interval = setInterval(() => go(idx < total - 1 ? idx + 1 : 0), 4000);
    c.addEventListener('mouseenter', () => clearInterval(interval));
    c.addEventListener('mouseleave', () => interval = setInterval(() => go(idx < total - 1 ? idx + 1 : 0), 4000));

    go(0);
  });

  /* ---------- SCROLL REVEAL ---------- */
  (function () {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

    document.querySelectorAll('.tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        setTimeout(() => {
          const activeTab = document.querySelector('.tab-content.active');
          if (activeTab) {
            activeTab.querySelectorAll('.reveal').forEach((el) => {
              el.classList.remove('visible');
              observer.observe(el);
            });
          }
        }, 50);
      });
    });
  })();


  document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('flipped'));
  });

  /* ---------- OBJETIVOS VERTICAL CAROUSEL ---------- */
  (function() {
    const wrap = document.querySelector('.sobre-bottom-grid .obj-mwrap');
    if (!wrap) return;
    const viewport = wrap.querySelector('.obj-mviewport');
    const track = viewport.querySelector('.obj-mtrack');
    const cards = track.querySelectorAll('.obj-mcard');
    const dotsContainer = wrap.querySelector('.obj-dots');
    let idx = 0;
    const total = cards.length;

    cards.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'obj-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', function(e) {
        e.stopPropagation();
        go(i);
      });
      dotsContainer.appendChild(dot);
    });

    function go(i) {
      const h = cards[0].offsetHeight;
      idx = i;
      track.style.transform = `translateY(-${idx * h}px)`;
      const dotIdx = idx;
      dotsContainer.querySelectorAll('.obj-dot').forEach((d, j) => d.classList.toggle('active', j === dotIdx));
    }

    function next() { go((idx + 1) % total); }
    function prev() { go((idx - 1 + total) % total); }

    wrap.addEventListener('click', function(e) {
      if (e.target.closest('.obj-dot')) return;
      next();
    });

    viewport.addEventListener('wheel', function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (e.deltaY > 0) next();
      else prev();
    }, { passive: false });

    let touchStart = 0;
    let touchEnd = 0;
    viewport.addEventListener('touchstart', function(e) {
      touchStart = e.changedTouches[0].screenY;
    }, { passive: true });
    viewport.addEventListener('touchend', function(e) {
      touchEnd = e.changedTouches[0].screenY;
      const diff = touchStart - touchEnd;
      if (Math.abs(diff) > 30) {
        if (diff > 0) next();
        else prev();
      }
    }, { passive: true });
  })();

  /* ---------- MARQUEE DRAG ---------- */
  document.querySelectorAll('.marquee-wrap').forEach(wrap => {
    const track = wrap.querySelector('.marquee-track');
    const isReverse = track.dataset.dir === 'right';
    let groups = track.querySelectorAll('.marquee-group');

    for (let i = 1; i < groups.length; i++) groups[i].remove();
    const orig = groups[0];

    function fillClones() {
      track.querySelectorAll('[aria-hidden]').forEach(n => n.remove());
      const groupW = orig.offsetWidth;
      if (!groupW) return;
      const copies = Math.ceil((window.innerWidth * 3) / groupW) + 2;
      const frag = document.createDocumentFragment();
      for (let i = 0; i < copies; i++) {
        const clone = orig.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        frag.appendChild(clone);
      }
      track.appendChild(frag);
    }

    fillClones();
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => fillClones(), 300);
    });

    const SPEED = isReverse ? 0.65 : -0.65;
    let pos = isReverse ? -orig.offsetWidth : 0;
    let dragging = false;
    let dragStartX = 0;
    let dragStartPos = 0;
    let rafId = null;

    function tick() {
      if (!dragging) {
        pos += SPEED;
        const groupW = orig.offsetWidth;
        if (groupW) {
          while (pos > 0) pos -= groupW;
          while (pos <= -groupW) pos += groupW;
        }
        track.style.transform = `translateX(${pos}px)`;
      }
      rafId = requestAnimationFrame(tick);
    }

    function getX(e) { return e.touches ? e.touches[0].clientX : e.clientX; }

    wrap.addEventListener('mousedown', e => {
      if (e.button !== 0) return;
      dragging = true;
      dragStartX = e.clientX;
      dragStartPos = pos;
      wrap.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', e => {
      if (!dragging) return;
      pos = dragStartPos + (e.clientX - dragStartX);
      const groupW = orig.offsetWidth;
      if (groupW) {
        while (pos > 0) pos -= groupW;
        while (pos <= -groupW) pos += groupW;
      }
      track.style.transform = `translateX(${pos}px)`;
    });

    window.addEventListener('mouseup', () => {
      if (!dragging) return;
      dragging = false;
      wrap.style.cursor = 'grab';
    });

    wrap.addEventListener('touchstart', e => {
      dragging = true;
      dragStartX = getX(e);
      dragStartPos = pos;
    }, { passive: true });

    window.addEventListener('touchmove', e => {
      if (!dragging) return;
      pos = dragStartPos + (getX(e) - dragStartX);
      const groupW = orig.offsetWidth;
      if (groupW) {
        while (pos > 0) pos -= groupW;
        while (pos <= -groupW) pos += groupW;
      }
      track.style.transform = `translateX(${pos}px)`;
    }, { passive: true });

    window.addEventListener('touchend', () => {
      if (!dragging) return;
      dragging = false;
    });

    tick();

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          if (rafId) cancelAnimationFrame(rafId);
          rafId = null;
        } else if (!rafId) {
          tick();
        }
      });
    }, { threshold: 0 });
    observer.observe(wrap);
  });

  /* ---------- VIDEO DISSOLVE ---------- */
  (function() {
    const sources = [
      'assets/videos/video1.mp4',
      'assets/videos/video2.mp4',
      'assets/videos/video3.mp4',
      'assets/videos/video4.mp4',
      'assets/videos/video5.mp4'
    ];
    const DISSOLVE = 1500;

    const v0 = document.getElementById('heroVid0');
    const v1 = document.getElementById('heroVid1');
    if (!v0 || !v1) return;

    let idx = 0;
    let active = 0;
    let dissolving = false;

    function loadVideo(el, src) {
      if (!el.src.endsWith(src.slice(src.lastIndexOf('/')))) {
        el.src = src;
      }
    }

    function dissolve() {
      if (dissolving) return;
      dissolving = true;

      const _active = active;
      const _idx = idx;
      const nxt = (_idx + 1) % sources.length;

      const nextEl = _active === 0 ? v1 : v0;
      nextEl.currentTime = 0;
      nextEl.play().catch(() => {});

      v0.style.opacity = _active === 0 ? '0' : '1';
      v1.style.opacity = _active === 0 ? '1' : '0';

      active = 1 - _active;
      idx = nxt;

      const prevEl = _active === 0 ? v0 : v1;
      prevEl.removeEventListener('timeupdate', onTimeUpdate);
      nextEl.addEventListener('timeupdate', onTimeUpdate);
      prevEl.removeEventListener('ended', onEnded);
      nextEl.addEventListener('ended', onEnded);

      const nxtIdx = (_idx + 2) % sources.length;
      const toLoad = active === 0 ? v1 : v0;

      setTimeout(() => {
        prevEl.pause();
        loadVideo(toLoad, sources[nxtIdx]);
        dissolving = false;
      }, DISSOLVE + 50);
    }

    function onTimeUpdate() {
      const cur = active === 0 ? v0 : v1;
      if (cur.duration && cur.currentTime >= cur.duration - DISSOLVE / 1000 - 0.1) {
        cur.removeEventListener('timeupdate', onTimeUpdate);
        dissolve();
      }
    }

    function onEnded() {
      dissolve();
    }

    setTimeout(() => {
      v0.style.opacity = '1';
      v0.play().catch(() => {});
    }, 1400);
    v0.addEventListener('timeupdate', onTimeUpdate);
    v0.addEventListener('ended', onEnded);

    /* resume playback when hero re-enters view */
    const hero = document.getElementById('hero');
    if (hero) {
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          const cur = active === 0 ? v0 : v1;
          if (cur.paused) cur.play().catch(() => {});
        }
      }, { threshold: 0.3 });
      obs.observe(hero);
    }
  })();

  document.getElementById('mouseHole')?.addEventListener('click', function() {
    const overlay = document.getElementById('eggModal');
    if (overlay) {
      overlay.classList.toggle('open');
      feather.replace();
    }
  });

  document.getElementById('eggModalClose')?.addEventListener('click', function() {
    document.getElementById('eggModal')?.classList.remove('open');
  });

  document.getElementById('eggModal')?.addEventListener('click', function(e) {
    if (e.target === this) this.classList.remove('open');
  });

  (function() {
    const eyes = document.querySelector('.mouse-eyes');
    if (!eyes) return;
    let timer;
    function blinkIn() {
      eyes.classList.remove('blink-out');
      eyes.classList.add('blink-in');
      timer = setTimeout(() => {
        eyes.classList.remove('blink-in');
        eyes.style.setProperty('opacity', '1');
        const stay = 1000 + Math.random() * 4000;
        timer = setTimeout(blinkOut, stay);
      }, 200);
    }
    function blinkOut() {
      eyes.style.removeProperty('opacity');
      eyes.classList.add('blink-out');
      timer = setTimeout(() => {
        eyes.classList.remove('blink-out');
        const next = 1000 + Math.random() * 19000;
        timer = setTimeout(blinkIn, next);
      }, 200);
    }
    timer = setTimeout(blinkIn, 1000 + Math.random() * 19000);
  })();
