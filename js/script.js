/* Sreekar Kakumani — portfolio interactions.
   Every library is optional: if a CDN fails or prefers-reduced-motion is set,
   the page stays fully readable and functional. */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  console.log('[portfolio] boot — reduced motion:', reducedMotion);

  /* 1. AOS — scroll-triggered section reveals.
     html.aos-ready unlocks the CSS that hides [data-aos] elements; without it
     (AOS missing, or reduced motion) everything stays visible. */
  if (typeof AOS !== 'undefined') {
    if (!reducedMotion) {
      document.documentElement.classList.add('aos-ready');
    }
    AOS.init({
      duration: 250,
      once: true,
      easing: 'ease-out',
      disable: reducedMotion,
    });
    console.log('[portfolio] AOS initialized');
  } else {
    console.log('[portfolio] AOS not available — reveals skipped');
  }

  /* 2. Typed.js — hero typewriter */
  var typedStrings = [
    'Enterprise Finance Intern @ Highmark Health',
    'Hackathon Builder — 3 projects, 2 wins',
    'Finance × AI Automation',
    'Accounting & Finance @ Penn State Smeal',
  ];
  var typedTarget = document.getElementById('typed-output');
  if (typedTarget) {
    if (typeof Typed !== 'undefined' && !reducedMotion) {
      new Typed('#typed-output', {
        strings: typedStrings,
        typeSpeed: 55,
        backSpeed: 30,
        backDelay: 2000,
        loop: true,
      });
      console.log('[portfolio] Typed.js initialized');
    } else {
      typedTarget.textContent = typedStrings[0]; // static fallback
    }
  }

  /* 3. tsParticles — floating pixel squares behind the hero */
  if (typeof tsParticles !== 'undefined' && !reducedMotion) {
    tsParticles
      .load('tsparticles', {
        fullScreen: { enable: false }, // stay inside the hero container
        fpsLimit: 60,
        detectRetina: true,
        particles: {
          number: { value: 60, density: { enable: true, area: 800 } },
          shape: { type: 'square' },
          size: { value: { min: 2, max: 5 } },
          color: { value: ['#4B5694', '#7288AE'] },
          opacity: { value: 0.4 },
          links: { enable: false },
          move: {
            enable: true,
            speed: 0.5,
            direction: 'none',
            random: true,
            straight: false,
            outModes: { default: 'out' },
          },
        },
        interactivity: {
          events: {
            onHover: { enable: false },
            onClick: { enable: false },
            resize: true,
          },
        },
      })
      .then(function () {
        console.log('[portfolio] tsParticles initialized');
      })
      .catch(function (err) {
        console.log('[portfolio] tsParticles failed:', err);
      });
  }

  /* 3b. Hero parallax — the particle backdrop moves at ~0.4x the scroll
     speed of the foreground: translating it down by 0.6 × scrollY leaves a
     net apparent speed of 0.4x. Transform-only (never touches layout),
     rAF-throttled, clamped to the hero's height, and skipped entirely
     under reduced motion. The wrapper keeps z-index 0 below .hero-content
     (z-index 1), so stacking is unchanged. */
  var parallaxLayer = document.getElementById('tsparticles');
  var heroSection = document.getElementById('hero');
  if (parallaxLayer && heroSection && !reducedMotion) {
    var heroHeight = heroSection.offsetHeight;
    var parallaxQueued = false;
    var lastShift = -1;

    var applyParallax = function () {
      parallaxQueued = false;
      var shift = Math.round(Math.min(window.scrollY, heroHeight) * 0.6);
      if (shift === lastShift) return;
      lastShift = shift;
      parallaxLayer.style.transform = 'translate3d(0, ' + shift + 'px, 0)';
    };
    var queueParallax = function () {
      if (!parallaxQueued) {
        parallaxQueued = true;
        window.requestAnimationFrame(applyParallax);
      }
    };

    parallaxLayer.style.willChange = 'transform';
    window.addEventListener('scroll', queueParallax, { passive: true });
    window.addEventListener('resize', function () {
      heroHeight = heroSection.offsetHeight;
      queueParallax();
    }, { passive: true });
    queueParallax(); // set the initial offset (covers reloads mid-page)
    console.log('[portfolio] hero parallax active');
  }

  /* 4. Skill bars — HTML ships with real values (no-JS fallback);
     JS zeroes them, then animates to target when #skills scrolls into view. */
  var bars = Array.prototype.slice.call(document.querySelectorAll('.skill-bar'));
  var skillsSection = document.getElementById('skills');
  if (bars.length && skillsSection && !reducedMotion && 'IntersectionObserver' in window) {
    bars.forEach(function (bar) { bar.value = 0; });

    var barsAnimated = false;
    var barObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || barsAnimated) return;
          barsAnimated = true;
          bars.forEach(function (bar, i) {
            var target = parseInt(bar.getAttribute('data-value'), 10) || 0;
            if (typeof anime !== 'undefined') {
              anime({
                targets: bar,
                value: [0, target],
                round: 1,
                duration: 500, /* --dur-celebrate */
                delay: i * 80,
                easing: 'easeOutQuad',
              });
            } else {
              bar.value = target;
            }
          });
          barObserver.disconnect();
          console.log('[portfolio] skill bars animated');
        });
      },
      { threshold: 0.25 }
    );
    barObserver.observe(skillsSection);
  }

  /* 5. Active nav link highlighting */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  var linkFor = {};
  navLinks.forEach(function (link) {
    linkFor[link.getAttribute('href').slice(1)] = link;
  });
  if ('IntersectionObserver' in window && navLinks.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = linkFor[entry.target.id];
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach(function (l) { l.classList.remove('active'); });
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    Object.keys(linkFor).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) spy.observe(section);
    });
    console.log('[portfolio] nav scroll-spy active');
  }

  /* 6. Mobile nav toggle */
  var navToggle = document.querySelector('.nav-toggle');
  var navMenu = document.getElementById('nav-menu');
  if (navToggle && navMenu) {
    var closeMenu = function () {
      navMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    };
    navToggle.addEventListener('click', function () {
      var open = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navMenu.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        closeMenu();
        navToggle.focus();
      }
    });
  }

  /* 7. PRESS START — the one celebratory moment: a single cream flash on
     click (200–300ms). The mailto: default action proceeds untouched. */
  var pressStart = document.getElementById('press-start');
  if (pressStart) {
    pressStart.addEventListener('click', function () {
      var flash = pressStart.querySelector('.btn-flash');
      if (!flash || typeof anime === 'undefined' || reducedMotion) return;
      anime({
        targets: flash,
        opacity: [0.85, 0],
        duration: 250,
        easing: 'easeOutQuad',
      });
    });
  }

  console.log('[portfolio] all interactions wired');
})();
