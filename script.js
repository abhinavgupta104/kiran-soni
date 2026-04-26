/* ─── JS ──────────────────────────────────────────────────────────────────────
   Kiran Soni Premium Landing Page — Interactions & Animations
   ─────────────────────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  /* ── PRELOADER ─────────────────────────────────────────────────────────── */
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('preloader').classList.add('done');
      // Trigger hero reveals after preloader
      setTimeout(() => {
        document.querySelectorAll('.hero .reveal-up').forEach((el, i) => {
          setTimeout(() => el.classList.add('revealed'), i * 120);
        });
      }, 200);
    }, 1800);
  });

  /* ── CUSTOM CURSOR ─────────────────────────────────────────────────────── */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

  if (window.innerWidth > 768) {
    document.addEventListener('mousemove', e => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Grow cursor on interactive elements
    const hoverEls = document.querySelectorAll('a, button, .stat-card, .media-card, .cert-card, .timeline-card, .testimonial-card');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-grow');
        follower.classList.add('cursor-grow');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-grow');
        follower.classList.remove('cursor-grow');
      });
    });
  }

  /* ── NAVIGATION ─────────────────────────────────────────────────────────── */
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 160) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }, { passive: true });

  /* ── SCROLL REVEAL ───────────────────────────────────────────────────────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay ? parseInt(entry.target.dataset.delay) : 0;
        setTimeout(() => entry.target.classList.add('revealed'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
    // Skip hero elements (handled by preloader callback)
    if (!el.closest('.hero')) revealObserver.observe(el);
  });

  /* ── COUNTER ANIMATION ──────────────────────────────────────────────────── */
  function animateCounter(el, target, duration = 1800) {
    let start = null;
    const startVal = 0;
    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const num = entry.target.querySelector('.stat-number');
        const target = parseInt(num.dataset.target);
        animateCounter(num, target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-card').forEach(card => counterObserver.observe(card));

  /* ── TIMELINE LINE ANIMATION ─────────────────────────────────────────────── */
  const timelineLine = document.getElementById('timeline-line');
  if (timelineLine) {
    const tlObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          timelineLine.classList.add('animated');
          tlObserver.disconnect();
        }
      });
    }, { threshold: 0.1 });
    tlObserver.observe(timelineLine);
  }

  /* ── TESTIMONIALS SLIDER ────────────────────────────────────────────────── */
  const track = document.getElementById('testimonials-track');
  const prevBtn = document.getElementById('t-prev');
  const nextBtn = document.getElementById('t-next');
  const dots = document.querySelectorAll('.t-dot');
  const cards = track ? track.querySelectorAll('.testimonial-card') : [];
  let current = 0;
  let autoSlide;

  function goTo(index) {
    current = (index + cards.length) % cards.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    track.style.transition = 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)';
    dots.forEach((d, i) => d.classList.toggle('t-dot-active', i === current));
  }

  if (track && cards.length > 0) {
    prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); resetAuto(); }));

    function startAuto() {
      autoSlide = setInterval(() => goTo(current + 1), 5000);
    }
    function resetAuto() { clearInterval(autoSlide); startAuto(); }
    startAuto();
  }

  /* ── SMOOTH PARALLAX HERO ────────────────────────────────────────────────── */
  const heroBg = document.querySelector('.hero-bg');
  window.addEventListener('scroll', () => {
    if (heroBg && window.scrollY < window.innerHeight) {
      heroBg.style.transform = `translateY(${window.scrollY * 0.25}px)`;
    }
  }, { passive: true });

  /* ── CONTACT FORM ────────────────────────────────────────────────────────── */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('form-submit');
      btn.textContent = 'Sending...';
      btn.disabled = true;

      // Simulate send delay
      await new Promise(r => setTimeout(r, 1500));

      btn.textContent = '✓ Message Sent!';
      btn.style.background = 'var(--green)';
      form.reset();

      setTimeout(() => {
        btn.innerHTML = 'Send Message <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
        btn.disabled = false;
        btn.style.background = '';
      }, 3000);
    });
  }

  /* ── STAT CARDS TILT ──────────────────────────────────────────────────────── */
  if (window.innerWidth > 768) {
    document.querySelectorAll('.stat-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotX = (-y / rect.height * 10).toFixed(2);
        const rotY = (x / rect.width * 10).toFixed(2);
        card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.4s ease';
        setTimeout(() => { card.style.transition = ''; }, 400);
      });
    });
  }

  /* ── MAGNETIC BUTTONS ─────────────────────────────────────────────────────── */
  if (window.innerWidth > 768) {
    document.querySelectorAll('.btn-primary, .nav-cta').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
        btn.style.transform = `translate(${x}px, ${y}px) scale(1.04)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ── STAGGERED REVEALS ────────────────────────────────────────────────────── */
  // Apply stagger to grid children
  document.querySelectorAll('.stat-card, .cert-card, .media-card').forEach((el, i) => {
    if (!el.dataset.delay) el.dataset.delay = String(i * 80);
  });

  /* ── NOISE TEXTURE CANVAS ─────────────────────────────────────────────────── */
  // Add subtle animated noise to hero
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;opacity:0.025;pointer-events:none;z-index:0;';
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = heroSection.offsetWidth;
      canvas.height = heroSection.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    let frame = 0;
    function drawNoise() {
      frame++;
      if (frame % 3 === 0) { // Update every 3 frames for performance
        const w = canvas.width, h = canvas.height;
        const img = ctx.createImageData(w, h);
        for (let i = 0; i < img.data.length; i += 4) {
          const n = Math.random() * 255;
          img.data[i] = img.data[i + 1] = img.data[i + 2] = n;
          img.data[i + 3] = 25;
        }
        ctx.putImageData(img, 0, 0);
      }
      requestAnimationFrame(drawNoise);
    }
    heroSection.appendChild(canvas);
    drawNoise();
  }

})();
