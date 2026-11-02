/**
 * ECO TOURISM PLATFORM — CORE CLIENT-SIDE JAVASCRIPT
 * Strictly client-side functionality with labeled demonstration data.
 * Adheres to the 3-color palette: Primary (#1B4D3E), Secondary (#FFFFFF), Accent (#E5A93C).
 */

(function () {
  'use strict';

  // STRICT PROHIBITION: Ensure no popup alerts or toasts are used anywhere
  window.alert = function (msg) {
    console.warn('Alert suppressed:', msg);
  };
  window.confirm = function (msg) {
    console.warn('Confirm suppressed:', msg);
    return true;
  };
  window.prompt = function (msg) {
    console.warn('Prompt suppressed:', msg);
    return null;
  };

  // --- INITIALIZATION DISPATCHER ---
  document.addEventListener('DOMContentLoaded', () => {
    initCommonNavbar();
    initScrollEffects();
    initAnimatedCounters();
    initModals();
    initAccordions();
    initTestimonialCarousel();
    initHeroParallax();
    initToastNotifications();
    initNewsletterForms();

    // Page-specific modules
    if (document.querySelector('.home-page') || document.querySelector('.hero-home')) initHomePage();
    if (document.querySelector('.about-page') || document.querySelector('.about-hero')) initAboutPage();
    if (document.querySelector('.service-page') || document.querySelector('.service-hero')) initServicePage();
    if (document.querySelector('.blog-page') || document.querySelector('.blog-hero')) initBlogPage();
    if (document.querySelector('.contact-page') || document.querySelector('.contact-hero')) initContactPage();
    if (document.querySelector('.login-page') || document.getElementById('loginForm')) initLoginPage();
    if (document.querySelector('.signup-page') || document.getElementById('signupForm')) initSignupPage();
    if (document.querySelector('.user-dashboard-page') || document.querySelector('[data-view="travel-planner"]')) initUserDashboard();
    if (document.querySelector('.client-dashboard-page') || document.querySelector('.agency-badge-pill')) initClientDashboard();
    if (document.querySelector('.admin-dashboard-page') || document.querySelector('[data-view="audits"]')) initAdminDashboard();

  // Universal action buttons redirection to 404.html
    initActionButtonsRedirect();

    // Universal button click animation & feedback (Flame Orange active color)
    initButtonClickEffects();
  });

  // ==========================================
  // 1. COMMON NAVBAR & MOBILE MENU
  // ==========================================
  function initCommonNavbar() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const mobileOverlay = document.querySelector('.mobile-overlay');

    if (navbar) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
          navbar.classList.add('navbar-scrolled');
        } else {
          navbar.classList.remove('navbar-scrolled');
        }
      });
    }

    if (navToggle && navMenu) {
      let savedScrollPosition = 0;

      // Prevent background scrolling when mobile navbar menu is active
      const preventBackgroundWheel = (e) => {
        if (!navMenu.classList.contains('active')) return;
        const targetMenu = e.target.closest('.nav-menu');
        if (!targetMenu) {
          if (e.cancelable) e.preventDefault();
          return;
        }
        // Inside nav-menu: allow scrolling only if menu content overflows
        const hasOverflow = targetMenu.scrollHeight > targetMenu.clientHeight;
        if (!hasOverflow) {
          if (e.cancelable) e.preventDefault();
          return;
        }
        // At scroll limits: prevent overscroll bleed to page
        const delta = e.deltaY;
        const atTop = targetMenu.scrollTop <= 0 && delta < 0;
        const atBottom = Math.ceil(targetMenu.scrollTop + targetMenu.clientHeight) >= targetMenu.scrollHeight && delta > 0;
        if (atTop || atBottom) {
          if (e.cancelable) e.preventDefault();
        }
      };

      let touchStartY = 0;
      const onTouchStart = (e) => {
        if (!navMenu.classList.contains('active')) return;
        if (e.touches && e.touches.length > 0) {
          touchStartY = e.touches[0].clientY;
        }
      };

      const preventBackgroundTouch = (e) => {
        if (!navMenu.classList.contains('active')) return;
        const targetMenu = e.target.closest('.nav-menu');
        if (!targetMenu) {
          if (e.cancelable) e.preventDefault();
          return;
        }
        const hasOverflow = targetMenu.scrollHeight > targetMenu.clientHeight;
        if (!hasOverflow) {
          if (e.cancelable) e.preventDefault();
          return;
        }
        if (e.touches && e.touches.length > 0) {
          const currentY = e.touches[0].clientY;
          const deltaY = touchStartY - currentY;
          const atTop = targetMenu.scrollTop <= 0 && deltaY < 0;
          const atBottom = Math.ceil(targetMenu.scrollTop + targetMenu.clientHeight) >= targetMenu.scrollHeight && deltaY > 0;
          if (atTop || atBottom) {
            if (e.cancelable) e.preventDefault();
          }
        }
      };

      window.addEventListener('wheel', preventBackgroundWheel, { passive: false });
      window.addEventListener('touchstart', onTouchStart, { passive: true });
      window.addEventListener('touchmove', preventBackgroundTouch, { passive: false });

      const toggleMenu = (open) => {
        const isOpen = open !== undefined ? open : !navMenu.classList.contains('active');
        navToggle.classList.toggle('active', isOpen);
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        navMenu.classList.toggle('active', isOpen);
        if (mobileOverlay) mobileOverlay.classList.toggle('active', isOpen);

        if (isOpen) {
          savedScrollPosition = window.pageYOffset || document.documentElement.scrollTop || 0;
          document.documentElement.classList.add('nav-open', 'menu-open');
          document.body.classList.add('nav-open', 'menu-open');
          document.documentElement.style.overflow = 'hidden';
          document.body.style.overflow = 'hidden';
        } else {
          document.documentElement.classList.remove('nav-open', 'menu-open');
          document.body.classList.remove('nav-open', 'menu-open');
          document.documentElement.style.overflow = '';
          document.body.style.overflow = '';
          if (typeof savedScrollPosition === 'number' && savedScrollPosition >= 0) {
            window.scrollTo({ top: savedScrollPosition, behavior: 'instant' });
          }
        }
      };

      navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
      });

      if (mobileOverlay) {
        mobileOverlay.addEventListener('click', () => toggleMenu(false));
      }

      // Close menu when clicking a link
      navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
      });

      // Close on escape & prevent page scroll keys when menu is open
      document.addEventListener('keydown', (e) => {
        if (!navMenu.classList.contains('active')) return;
        if (e.key === 'Escape') {
          toggleMenu(false);
          return;
        }
        const scrollKeys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '];
        if (scrollKeys.includes(e.key)) {
          const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName);
          if (!isInput) {
            e.preventDefault();
          }
        }
      });

      // Auto close if resized to desktop width
      window.addEventListener('resize', () => {
        if (window.innerWidth > 992 && navMenu.classList.contains('active')) {
          toggleMenu(false);
        }
      });
    }

    // Mark active link
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Back to top button
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      });

      backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  // ==========================================
  // 2. SCROLL REVEAL & INTERSECTION OBSERVER
  // ==========================================
  function initScrollEffects() {
    if ('IntersectionObserver' in window) {
      const reveals = document.querySelectorAll('.reveal, .reveal-stagger');
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.05, rootMargin: '0px 0px 50px 0px' });

      reveals.forEach(el => observer.observe(el));

      // Safety fallback: reveal any visible or near-viewport elements quickly
      setTimeout(() => {
        reveals.forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight + 100) {
            el.classList.add('revealed');
          }
        });
      }, 350);

      // Ultimate fallback: ensure all content is visible after page finishes loading
      setTimeout(() => {
        document.querySelectorAll('.reveal:not(.revealed), .reveal-stagger:not(.revealed)').forEach(el => {
          el.classList.add('revealed');
        });
      }, 1200);
    } else {
      // Fallback
      document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => el.classList.add('revealed'));
    }
  }

  // ==========================================
  // 3. ANIMATED NUMBER COUNTERS
  // ==========================================
  function initAnimatedCounters() {
    const counters = document.querySelectorAll('.stat-counter, .stat-number, .stat-num[data-target]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
          const prefix = counter.getAttribute('data-prefix') || '';
          const suffix = counter.getAttribute('data-suffix') || '';
          const duration = 1800;
          const startTime = performance.now();

          const updateCount = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(easeOut * target);
            counter.textContent = `${prefix}${currentVal.toLocaleString()}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(updateCount);
            } else {
              counter.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
            }
          };

          requestAnimationFrame(updateCount);
          obs.unobserve(counter);
        }
      });
    }, { threshold: 0.15 });

    counters.forEach(c => observer.observe(c));
  }

  // ==========================================
  // 4. ACCESSIBLE MODAL SYSTEM
  // ==========================================
  function initModals() {
    // Open modal triggers
    document.querySelectorAll('[data-modal-target]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = trigger.getAttribute('data-modal-target');
        openModal(modalId);
      });
    });

    // Close buttons
    document.querySelectorAll('.modal-close, [data-modal-close]').forEach(closeBtn => {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = closeBtn.closest('.eco-modal');
        if (modal) closeModal(modal.id);
      });
    });

    // Click outside backdrop
    document.querySelectorAll('.eco-modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal.id);
        }
      });
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('.eco-modal.active');
        if (activeModal) closeModal(activeModal.id);
      }
    });
  }

  window.openModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus first interactive element
    const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable) focusable.focus();
  };

  window.closeModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // ==========================================
  // 5. ACCORDION COMPONENT
  // ==========================================
  function initAccordions() {
    const accordions = document.querySelectorAll('.accordion');
    accordions.forEach(acc => {
      const items = acc.querySelectorAll('.accordion-item');
      items.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const body = item.querySelector('.accordion-body') || item.querySelector('.accordion-content');
        if (!header) return;

        // Initialize active item's maxHeight on load
        if (item.classList.contains('active') && body) {
          const content = body.querySelector('.accordion-content') || body;
          body.style.maxHeight = (content.scrollHeight + 60) + 'px';
        }

        header.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const isOpen = item.classList.contains('active');

          // Close siblings if inside single-expand accordion
          if (!acc.hasAttribute('data-multi-expand')) {
            items.forEach(other => {
              if (other !== item) {
                other.classList.remove('active');
                const btn = other.querySelector('.accordion-header');
                if (btn) btn.setAttribute('aria-expanded', 'false');
                const otherBody = other.querySelector('.accordion-body') || other.querySelector('.accordion-content');
                if (otherBody) otherBody.style.maxHeight = null;
              }
            });
          }

          if (isOpen) {
            item.classList.remove('active');
            header.setAttribute('aria-expanded', 'false');
            if (body) body.style.maxHeight = null;
          } else {
            item.classList.add('active');
            header.setAttribute('aria-expanded', 'true');
            if (body) {
              const content = body.querySelector('.accordion-content') || body;
              body.style.maxHeight = (content.scrollHeight + 60) + 'px';
            }
          }
        });
      });
    });
  }

  // ==========================================
  // 6. TESTIMONIAL CAROUSEL
  // ==========================================
  function initTestimonialCarousel() {
    const carousel = document.querySelector('.testimonial-carousel');
    if (!carousel) return;

    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const dotsContainer = carousel.querySelector('.carousel-dots');

    if (!slides.length) return;
    let currentIndex = 0;
    let autoplayTimer = null;

    // Create dots if container exists
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      });
    }

    const updateSlides = () => {
      slides.forEach((slide, idx) => {
        slide.classList.toggle('active', idx === currentIndex);
      });
      if (track) {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
      }
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, idx) => dot.classList.toggle('active', idx === currentIndex));
      }
    };

    const goToSlide = (index) => {
      currentIndex = (index + slides.length) % slides.length;
      updateSlides();
      resetAutoplay();
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
    }

    const startAutoplay = () => {
      autoplayTimer = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, 5500);
    };

    const resetAutoplay = () => {
      clearInterval(autoplayTimer);
      startAutoplay();
    };

    carousel.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
    carousel.addEventListener('mouseleave', () => startAutoplay());

    // Swipe support for mobile touch
    let touchStartX = 0;
    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) goToSlide(currentIndex + 1);
      if (touchEndX - touchStartX > 50) goToSlide(currentIndex - 1);
    }, { passive: true });

    updateSlides();
    startAutoplay();
  }

  // ==========================================
  // 7. HERO PARALLAX & SUBTLE MOTION
  // ==========================================
  function initHeroParallax() {
    const hero = document.querySelector('.hero-section');
    if (!hero) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const floatingCards = hero.querySelectorAll('.floating-card');
    hero.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const xPercent = (clientX / window.innerWidth - 0.5) * 16;
      const yPercent = (clientY / window.innerHeight - 0.5) * 16;

      floatingCards.forEach((card, idx) => {
        const factor = (idx + 1) * 0.7;
        card.style.transform = `translate3d(${xPercent * factor}px, ${yPercent * factor}px, 0)`;
      });
    });

    hero.addEventListener('mouseleave', () => {
      floatingCards.forEach(card => {
        card.style.transform = 'translate3d(0, 0, 0)';
      });
    });
  }

  // ==========================================
  // 8. GLOBAL TOAST NOTIFICATIONS (DISABLED)
  // Strictly no popup alerts or toasts across the website
  // ==========================================
  function initToastNotifications() {
    document.querySelectorAll('.toast-container, .demo-toast').forEach(el => el.remove());
  }

  window.showDemoToast = function () {
    // Popup alerts and toasts strictly disabled per user requirement
    return;
  };

  // ==========================================
  // 9. HOME PAGE (index.html)
  // ==========================================
  function initHomePage() {
    // Dynamic modal population for Destination cards
    const destinationData = {
      'forest': {
        title: 'Forest Retreats — Monteverde Cloud Sanctuary',
        location: 'Costa Rica / Central Highlands',
        duration: '4 Days / 3 Nights',
        highlights: ['Canopy canopy suspension bridges', 'Nighttime biodiversity walk', 'Organic shade coffee tour'],
        desc: 'Experience one of the richest tropical cloud forest canopies on Earth. Breathe pure mountain air, learn about mist microclimates, and observe rare quetzals in their natural sanctuary.',
        guidelines: 'Stay on marked wooden platforms. Single-use plastics are prohibited in this reserve.',
        img: 'assets/images/dest-forest.webp'
      },
      'mountain': {
        title: 'Mountain Escapes — High Alpine Valley Sanctuary',
        location: 'Swiss Valais Region',
        duration: '5 Days / 4 Nights',
        highlights: ['Alpine flora interpretation', 'Glacier recession monitoring demo', 'Solar-powered refuges'],
        desc: 'Trek along majestic glacier valleys surrounded by granite massifs. Stay in eco-certified high mountain huts powered entirely by passive solar and mountain hydro runoff.',
        guidelines: 'Pack all personal waste back to the valley. Avoid loud noise near chamois habitats.',
        img: 'assets/images/dest-mountain.webp'
      },
      'wildlife': {
        title: 'Wildlife Sanctuaries — Serengeti Savanna Conservation',
        location: 'Tanzania Bio-Corridor',
        duration: '6 Days / 5 Nights',
        highlights: ['Ethical animal distance safaris', 'Ranger-led anti-poaching briefing', 'Starlight nocturnal soundscape'],
        desc: 'Discover authentic wildlife observing that prioritizes species tranquility. Travel in silent electric safari rigs that respect territorial boundaries and nesting sites.',
        guidelines: 'Strict 25-meter observation perimeter. Never feed or bait animals.',
        img: 'assets/images/dest-wildlife.webp'
      },
      'waterfall': {
        title: 'Waterfall Adventures — Iguazu Mist Bio-Trail',
        location: 'Parana Basin Reserve',
        duration: '3 Days / 2 Nights',
        highlights: ['Subtropical spray zone botany', 'Lepidoptera butterfly study', 'Low-impact river catamarans'],
        desc: 'Stand before roaring torrents surrounded by subtropical rainforest. Trace crystal tributaries and discover the delicate riverine organisms sustained by pristine waterfalls.',
        guidelines: 'Bio-degradable sunscreen only. Wear non-slip footwear on wet boardwalks.',
        img: 'assets/images/dest-waterfall.webp'
      },
      'coastal': {
        title: 'Coastal Eco Getaways — Great Barrier Coral Reserve',
        location: 'Coral Sea Coastline',
        duration: '5 Days / 4 Nights',
        highlights: ['Guided reef stewardship snorkeling', 'Mangrove sea kayak exploration', 'Marine turtle nesting sanctuary'],
        desc: 'Explore protected marine biomes alongside marine biologists. Learn reef conservation methods and observe resilient coral nurseries without touching or disturbing the reef seabed.',
        guidelines: 'Reef-safe sunscreen required. Zero physical contact with corals.',
        img: 'assets/images/dest-coastal.webp'
      },
      'cultural': {
        title: 'Village & Cultural Experiences — Sacred Valley Highlands',
        location: 'Andean Mountain Hamlet',
        duration: '4 Days / 3 Nights',
        highlights: ['Traditional botanical weaving', 'Heritage seed bank preservation', 'Community-cooked native meals'],
        desc: 'Connect with indigenous mountain communities sustaining age-old agroecological traditions. Experience warm hospitality, ancient Quechua culinary arts, and living cultural heritage.',
        guidelines: 'Ask respectful permission before photographing artisans. Support direct community cooperatives.',
        img: 'assets/images/dest-cultural.webp'
      }
    };

    document.querySelectorAll('.dest-modal-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const key = btn.getAttribute('data-dest-key');
        const data = destinationData[key];
        if (!data) return;

        const modal = document.getElementById('destinationModal');
        if (!modal) return;

        modal.querySelector('.dest-modal-title').textContent = data.title;
        modal.querySelector('.dest-modal-loc').textContent = data.location;
        modal.querySelector('.dest-modal-duration').textContent = data.duration;
        modal.querySelector('.dest-modal-desc').textContent = data.desc;
        modal.querySelector('.dest-modal-guidelines').textContent = data.guidelines;
        modal.querySelector('.dest-modal-img').src = data.img;

        const hlList = modal.querySelector('.dest-modal-highlights');
        if (hlList) {
          hlList.innerHTML = data.highlights.map(h => `<li><i class="fa-solid fa-leaf text-accent"></i> ${h}</li>`).join('');
        }

        openModal('destinationModal');
      });
    });

    // Tour details modal population
    const tourData = {
      'rainforest': {
        name: 'Amazon Rainforest Bio-Walk',
        dest: 'Upper Amazon Basin',
        duration: '5 Days / 4 Nights',
        type: 'Guided Ecology Trek',
        difficulty: 'Moderate',
        price: '$840 (Demo Sample)',
        dates: 'Nov 12 - Nov 16, 2026 (Demo)',
        itinerary: [
          'Day 1: River transfer & arrival at solar-powered eco-station; night chorus walk.',
          'Day 2: Canopy walkway exploration & endemic medicinal plant interpretation.',
          'Day 3: Oxbow lake silent paddle looking for giant otters & hoatzin birds.',
          'Day 4: Community reforestation nursery project & native tree planting.',
          'Day 5: Dawn birdwatching tower & return river journey.'
        ]
      },
      'peaks': {
        name: 'Alpine High Ridge Path',
        dest: 'Swiss Alps UNESCO Biosphere',
        duration: '4 Days / 3 Nights',
        type: 'Alpine Trekking',
        difficulty: 'Challenging',
        price: '$920 (Demo Sample)',
        dates: 'Dec 05 - Dec 09, 2026 (Demo)',
        itinerary: [
          'Day 1: Valley trail to lower pine refuge; safety & pack check.',
          'Day 2: Ridge ascent passing limestone crags and ibex grazing meadows.',
          'Day 3: Glacial basin circumnavigation & climate geology workshop.',
          'Day 4: Descent through larch forests into eco-hamlet; local cheese tasting.'
        ]
      },
      'coastal': {
        name: 'Mangrove & Coral Sanctuary',
        dest: 'Belize Barrier Reef Reserve',
        duration: '6 Days / 5 Nights',
        type: 'Marine Stewardship',
        difficulty: 'Easy to Moderate',
        price: '$1,150 (Demo Sample)',
        dates: 'Jan 15 - Jan 21, 2027 (Demo)',
        itinerary: [
          'Day 1: Coastal eco-lodge check-in; marine sanctuary rules orientation.',
          'Day 2: Morning kayak through mangrove estuaries; manatee observation.',
          'Day 3: Coral restoration nursery snorkeling with resident marine biologists.',
          'Day 4: Coastal seabird sanctuary island excursion via sail craft.',
          'Day 5: Community fisherfolk conservation storytelling dinner.',
          'Day 6: Farewell shore walk and departure transfer.'
        ]
      },
      'savanna': {
        name: 'Ethical Savanna Bio-Safari',
        dest: 'Serengeti Wildlife Corridor',
        duration: '7 Days / 6 Nights',
        type: 'Conservation Safari',
        difficulty: 'Easy',
        price: '$1,480 (Demo Sample)',
        dates: 'Feb 02 - Feb 09, 2027 (Demo)',
        itinerary: [
          'Day 1: Arrival at low-impact tented camp; wildlife corridor briefing.',
          'Day 2: Sunrise electric-vehicle game drive focusing on big cat conservation.',
          'Day 3: Walking safari led by indigenous Maasai trackers; flora & tracks study.',
          'Day 4: Anti-poaching canine unit visit & conservation partnership chat.',
          'Day 5: Great Migration monitoring transect in open grassland.',
          'Day 6: Kopje rock ecology & starlight astronomy gathering.',
          'Day 7: Morning acacia walk and eco-charter flight departure.'
        ]
      }
    };

    document.querySelectorAll('.tour-modal-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const key = btn.getAttribute('data-tour-key');
        const data = tourData[key];
        if (!data) return;

        const modal = document.getElementById('tourModal');
        if (!modal) return;

        modal.querySelector('.tour-modal-name').textContent = data.name;
        modal.querySelector('.tour-modal-dest').textContent = data.dest;
        modal.querySelector('.tour-modal-duration').textContent = data.duration;
        modal.querySelector('.tour-modal-diff').textContent = data.difficulty;
        modal.querySelector('.tour-modal-price').textContent = data.price;
        modal.querySelector('.tour-modal-dates').textContent = data.dates;

        const itList = modal.querySelector('.tour-modal-itinerary');
        if (itList) {
          itList.innerHTML = data.itinerary.map(item => `<li><i class="fa-solid fa-clock-rotate-left text-accent"></i> ${item}</li>`).join('');
        }

        openModal('tourModal');
      });
    });

    // Newsletter validation on index page
    initNewsletterForms();
  }

  // ==========================================
  // 10. ABOUT PAGE (about.html)
  // ==========================================
  function initAboutPage() {
    initNewsletterForms();
  }

  // ==========================================
  // 11. SERVICE PAGE (service.html)
  // ==========================================
  function initServicePage() {
    initNewsletterForms();

    // Service Destination Inquiry Form
    const inquiryForm = document.getElementById('serviceInquiryForm');
    if (inquiryForm) {
      inquiryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        const nameInput = inquiryForm.querySelector('#srvName');
        const emailInput = inquiryForm.querySelector('#srvEmail');
        const serviceSelect = inquiryForm.querySelector('#srvType');
        const travelersInput = inquiryForm.querySelector('#srvTravelers');
        const dateInput = inquiryForm.querySelector('#srvDate');

        // Reset errors
        inquiryForm.querySelectorAll('.form-error').forEach(el => el.textContent = '');
        inquiryForm.querySelectorAll('.form-control').forEach(el => el.classList.remove('is-invalid'));

        if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
          showFieldError(nameInput, 'Please provide your full name (minimum 2 characters).');
          isValid = false;
        }

        if (!isValidEmail(emailInput.value.trim())) {
          showFieldError(emailInput, 'Please enter a valid email address.');
          isValid = false;
        }

        if (!serviceSelect.value) {
          showFieldError(serviceSelect, 'Please select an experience category.');
          isValid = false;
        }

        if (!travelersInput.value || parseInt(travelersInput.value, 10) < 1) {
          showFieldError(travelersInput, 'Please specify at least 1 traveler.');
          isValid = false;
        }

        if (!dateInput.value) {
          showFieldError(dateInput, 'Please pick a preferred travel date.');
          isValid = false;
        }

        if (isValid) {
          const successBanner = document.getElementById('serviceInquirySuccess');
          if (successBanner) {
            successBanner.classList.remove('d-none');
            successBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          showDemoToast('Inquiry received! Note: This is demonstration data only, no real booking was made.', 'success');
          inquiryForm.reset();
        }
      });
    }
  }

  // ==========================================
  // 12. BLOG PAGE (blog.html)
  // ==========================================
  function initBlogPage() {
    initNewsletterForms();

    const searchInput = document.getElementById('blogSearchInput');
    const filterPills = document.querySelectorAll('.blog-filter-pill');
    const sortSelect = document.getElementById('blogSortSelect');
    const blogCards = document.querySelectorAll('.blog-card');
    const noResultsMsg = document.getElementById('blogNoResults');

    let currentCategory = 'all';
    let searchQuery = '';

    const filterArticles = () => {
      let visibleCount = 0;

      blogCards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        const title = (card.querySelector('.blog-title')?.textContent || '').toLowerCase();
        const snippet = (card.querySelector('.blog-snippet')?.textContent || '').toLowerCase();

        const matchesCat = currentCategory === 'all' || category.toLowerCase() === currentCategory.toLowerCase();
        const matchesSearch = !searchQuery || title.includes(searchQuery) || snippet.includes(searchQuery);

        if (matchesCat && matchesSearch) {
          card.style.display = '';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (noResultsMsg) {
        noResultsMsg.classList.toggle('d-none', visibleCount > 0);
      }
    };

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        filterArticles();
      });
    }

    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentCategory = pill.getAttribute('data-category') || 'all';
        filterArticles();
      });
    });

    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        const grid = document.querySelector('.blog-grid');
        if (!grid) return;
        const cardsArray = Array.from(blogCards);
        const sortVal = sortSelect.value;

        cardsArray.sort((a, b) => {
          if (sortVal === 'title') {
            const tA = a.querySelector('.blog-title')?.textContent || '';
            const tB = b.querySelector('.blog-title')?.textContent || '';
            return tA.localeCompare(tB);
          } else if (sortVal === 'reading') {
            const rA = parseInt(a.getAttribute('data-read-time') || '5', 10);
            const rB = parseInt(b.getAttribute('data-read-time') || '5', 10);
            return rA - rB;
          }
          return 0; // default order
        });

        cardsArray.forEach(card => grid.appendChild(card));
      });
    }

    // Article Preview Modal
    const articleData = {
      'featured': {
        title: 'The Future of Low-Impact Exploration: A Blueprint for 2027',
        category: 'Sustainable Travel Tips',
        readTime: '7 min read',
        date: 'Oct 24, 2026',
        img: 'assets/images/blog-featured.webp',
        content: `
          <p>As the global appetite for authentic nature travel continues to expand, maintaining the delicate equilibrium between wilderness access and habitat preservation has emerged as the defining ecological challenge of our era.</p>
          <h4>1. Embracing Regenerative Stays</h4>
          <p>Traditional travel simply aimed to "leave no trace." Today's leading eco-lodges take the practice one crucial step further: regenerative design. These operations run entirely on micro-hydro or off-grid solar, produce zero single-use plastics, and channel a direct percentage of nightly stays directly into native tree reforestation corridors.</p>
          <h4>2. Decarbonizing Your Journey</h4>
          <p>Transportation remains the single largest carbon source in worldwide tourism. Whenever possible, choose electric overland trains, hybrid river ferries, or group eco-transits over regional hopper flights.</p>
          <h4>3. Supporting Community-Owned Enterprises</h4>
          <p>The most resilient conservation models are led by local and indigenous communities whose ancestral land management safeguards these biomes. By hiring local guides and patronizing locally owned dining establishments, travelers ensure their spending stays where it matters most.</p>
        `
      },
      'sustainable': {
        title: 'How to Travel More Sustainably: 8 Practical Habits',
        category: 'Sustainable Travel Tips',
        readTime: '5 min read',
        date: 'Oct 18, 2026',
        img: 'assets/images/blog-sustainable.webp',
        content: `
          <p>Transforming into a responsible traveler doesn't require extreme sacrifices—it simply demands mindfulness, preparation, and respect for destination biomes.</p>
          <h4>1. Carry a Quality Refillable Filtration Bottle</h4>
          <p>Eliminate dozens of single-use disposable water bottles by carrying a lightweight bottle with built-in UV or hollow-fiber filtration.</p>
          <h4>2. Walk the Middle of Marked Trails</h4>
          <p>Cutting switchbacks or stepping around puddles widens trail scars, accelerating soil erosion and destroying fragile alpine flora that took decades to establish.</p>
          <h4>3. Reusable Dining Kits</h4>
          <p>Bring along a compact bamboo utensil set and collapsible stainless steel food container for trail lunches and market treats.</p>
        `
      },
      'wildlife': {
        title: "A Beginner's Guide to Responsible Wildlife Tourism",
        category: 'Wildlife and Nature',
        readTime: '6 min read',
        date: 'Oct 12, 2026',
        img: 'assets/images/blog-wildlife.webp',
        content: `
          <p>Encountering animals in their native habitats is among the most profound joys of exploration. Yet improper tourist conduct can alter natural foraging behaviors, induce stress, and trigger dangerous habituation.</p>
          <h4>Rule 1: Maintain the 25-Meter Perimeter</h4>
          <p>If an animal alters its behavior, looks up attentively, or pauses feeding because of your presence, you are too close. Back away slowly and quietly.</p>
          <h4>Rule 2: Never Touch, Feed, or Call Wildlife</h4>
          <p>Feeding wild animals disrupts natural nutrition, makes them aggressive toward humans, and often leads to animals being euthanized by wildlife authorities.</p>
          <h4>Rule 3: Skip Flash Photography</h4>
          <p>Flash bursts disorient nocturnal species and frighten roosting birds. Rely on high-ISO sensors and telephoto optics from safe distances.</p>
        `
      },
      'ecolodge': {
        title: 'Choosing an Eco-Friendly Place to Stay: What Really Matters',
        category: 'Eco-Friendly Accommodation',
        readTime: '6 min read',
        date: 'Sep 29, 2026',
        img: 'assets/images/blog-ecolodge.webp',
        content: `
          <p>In an age where terms like "eco", "green", and "sustainable" are frequently used for marketing, how can conscientious travelers discern genuine eco-lodges from mere greenwashing?</p>
          <h4>1. Ask About Energy Generation</h4>
          <p>Does the facility generate renewable energy on site, or are they relying on diesel generators behind the compound wall?</p>
          <h4>2. Greywater and Sewage Management</h4>
          <p>Pristine destinations are ruined when untreated waste enters local aquifers. Look for reed-bed filtration, bio-digesters, or closed-loop greywater irrigation systems.</p>
          <h4>3. Fair Local Employment</h4>
          <p>True sustainability encompasses human welfare. Ensure the lodge pays living wages, provides safe conditions, and employs local residents in managerial positions.</p>
        `
      },
      'packing': {
        title: 'The Low-Impact Packing Checklist for Nature Adventures',
        category: 'Sustainable Travel Tips',
        readTime: '4 min read',
        date: 'Sep 15, 2026',
        img: 'assets/images/blog-packing.webp',
        content: `
          <p>Every ounce you pack adds to the fuel consumption of your journey. Packing thoughtfully also ensures you don't inadvertently introduce microplastics or harmful chemicals into fragile ecosystems.</p>
          <h4>Essentials:</h4>
          <ul>
            <li>Mineral-based reef-safe sunscreen (non-nano zinc oxide)</li>
            <li>Concentrated biodegradable, unscented camp soap</li>
            <li>Sturdy dry-bag for trail trash carry-out</li>
            <li>Solar-rechargeable LED headlamp</li>
          </ul>
        `
      },
      'community': {
        title: 'Community-Powered Tourism: Why Local Voices Matter',
        category: 'Destination Guides',
        readTime: '5 min read',
        date: 'Aug 28, 2026',
        img: 'assets/images/blog-community.webp',
        content: `
          <p>When travel is organized in true partnership with rural communities, it protects endangered ecosystems while preserving invaluable linguistic, culinary, and agricultural traditions.</p>
          <h4>Decentralized Travel</h4>
          <p>Steering travelers away from overcrowded mega-resorts and into rural homestays provides meaningful economic diversification for agricultural villages.</p>
        `
      }
    };

    document.querySelectorAll('.blog-read-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const articleKey = btn.getAttribute('data-article-key');
        const data = articleData[articleKey];
        if (!data) return;

        const modal = document.getElementById('blogModal');
        if (!modal) return;

        modal.querySelector('.blog-modal-title').textContent = data.title;
        modal.querySelector('.blog-modal-cat').textContent = data.category;
        modal.querySelector('.blog-modal-time').textContent = data.readTime;
        modal.querySelector('.blog-modal-date').textContent = data.date;
        modal.querySelector('.blog-modal-img').src = data.img;
        modal.querySelector('.blog-modal-content').innerHTML = data.content;

        openModal('blogModal');
      });
    });
  }

  // ==========================================
  // 13. CONTACT PAGE (contact.html)
  // ==========================================
  function initContactPage() {
    initNewsletterForms();

    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const name = form.querySelector('#cName');
      const email = form.querySelector('#cEmail');
      const dest = form.querySelector('#cDest');
      const date = form.querySelector('#cDate');
      const travelers = form.querySelector('#cTravelers');
      const expType = form.querySelector('#cExpType');
      const message = form.querySelector('#cMessage');

      // Clear errors
      form.querySelectorAll('.form-error').forEach(el => el.textContent = '');
      form.querySelectorAll('.form-control').forEach(el => el.classList.remove('is-invalid'));

      if (!name.value.trim() || name.value.trim().length < 2) {
        showFieldError(name, 'Please enter your full name (minimum 2 characters).');
        isValid = false;
      }

      if (!isValidEmail(email.value.trim())) {
        showFieldError(email, 'Please enter a valid email address.');
        isValid = false;
      }

      if (!dest.value) {
        showFieldError(dest, 'Please choose a destination of interest.');
        isValid = false;
      }

      if (!date.value) {
        showFieldError(date, 'Please select your preferred travel window.');
        isValid = false;
      }

      if (!travelers.value || parseInt(travelers.value, 10) < 1) {
        showFieldError(travelers, 'Travelers count must be at least 1.');
        isValid = false;
      }

      if (!expType.value) {
        showFieldError(expType, 'Please select your desired experience type.');
        isValid = false;
      }

      if (!message.value.trim() || message.value.trim().length < 10) {
        showFieldError(message, 'Please provide travel details or questions (at least 10 characters).');
        isValid = false;
      }

      if (isValid) {
        const successModal = document.getElementById('contactSuccessModal');
        if (successModal) {
          openModal('contactSuccessModal');
        } else {
          showDemoToast('Inquiry validated successfully! Note: No data is transmitted to an external server.', 'success');
        }
        form.reset();
      }
    });
  }

  // ==========================================
  // 14. LOGIN PAGE (login.html)
  // ==========================================
  function initLoginPage() {
    const form = document.getElementById('loginForm');
    const passToggles = document.querySelectorAll('.password-toggle-btn, #togglePassword');

    // Password visibility toggle
    passToggles.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-target-input') || 'loginPassword';
        const input = document.getElementById(targetId) || btn.previousElementSibling;
        if (!input) return;
        const isPass = input.getAttribute('type') === 'password';
        input.setAttribute('type', isPass ? 'text' : 'password');
        const icon = btn.querySelector('i');
        if (icon) {
          icon.classList.toggle('fa-eye', !isPass);
          icon.classList.toggle('fa-eye-slash', isPass);
        }
      });
    });

    // Login Form Validation & Role-based Redirection
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        const roleInput = form.querySelector('#loginRole');
        const email = form.querySelector('#loginEmail');
        const pass = form.querySelector('#loginPassword');

        form.querySelectorAll('.form-error').forEach(el => el.remove());
        form.querySelectorAll('.form-control').forEach(el => el.classList.remove('is-invalid'));

        // Role Validation (Must choose User or Admin)
        if (!roleInput || !roleInput.value.trim()) {
          showFieldError(roleInput, 'Please select your role before logging in.');
          isValid = false;
        }

        // Email Validation
        if (!email || !email.value.trim()) {
          showFieldError(email, 'Email address is required.');
          isValid = false;
        } else if (!isValidEmail(email.value.trim())) {
          showFieldError(email, 'Please enter a valid email address.');
          isValid = false;
        }

        // Password Validation
        if (!pass || !pass.value.trim()) {
          showFieldError(pass, 'Password is required.');
          isValid = false;
        } else if (pass.value.length < 6) {
          showFieldError(pass, 'Password must be at least 6 characters.');
          isValid = false;
        }

        if (isValid) {
          const selectedRole = roleInput.value.trim().toLowerCase();
          const emailVal = email.value.trim();

          // Derive formatted user name from email
          let derivedName = emailVal.split('@')[0];
          derivedName = derivedName.replace(/[._-]/g, ' ')
                                   .replace(/\b\w/g, c => c.toUpperCase());
          if (!derivedName || derivedName.length < 2) {
            derivedName = selectedRole === 'admin' ? 'System Admin' : 'Traveler';
          }

          // Persist user details for dynamic dashboard display
          localStorage.setItem('stackly_user_email', emailVal);
          localStorage.setItem('stackly_user_name', derivedName);
          localStorage.setItem('stackly_user_role', roleInput.value.trim());

          // Role-based target URL (only User and Admin dashboards)
          const targetUrl = selectedRole === 'admin' ? 'admin-dashboard.html' : 'user-dashboard.html';

          // Immediate seamless navigation without any popup toast
          window.location.href = targetUrl;
        }
      });
    }
  }

  // ==========================================
  // 15. SIGNUP PAGE (signup.html)
  // ==========================================
  function initSignupPage() {
    const form = document.getElementById('signupForm');
    const pass1 = document.getElementById('signupPassword') || document.getElementById('signupPass');
    const pass2 = document.getElementById('signupConfirmPassword') || document.getElementById('signupPassConfirm');

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        const name = form.querySelector('#signupName');
        const email = form.querySelector('#signupEmail');
        const phone = form.querySelector('#signupPhone');
        const terms = form.querySelector('#signupTerms');
        const selectedRadio = document.querySelector('input[name="accountType"]:checked');
        const selectedRole = selectedRadio ? selectedRadio.value.toLowerCase() : 'user';

        form.querySelectorAll('.form-error').forEach(el => el.remove());
        form.querySelectorAll('.form-control').forEach(el => el.classList.remove('is-invalid'));

        // Name
        if (!name || !name.value.trim() || name.value.trim().length < 2) {
          showFieldError(name, 'Please enter your full name (at least 2 characters).');
          isValid = false;
        }

        // Email
        if (!email || !email.value.trim()) {
          showFieldError(email, 'Email address is required.');
          isValid = false;
        } else if (!isValidEmail(email.value.trim())) {
          showFieldError(email, 'Please enter a valid email address.');
          isValid = false;
        }

        // Phone (optional, but validate format if present)
        if (phone && phone.value.trim() && !/^[0-9+() -]{7,20}$/.test(phone.value.trim())) {
          showFieldError(phone, 'Please enter a valid phone number format.');
          isValid = false;
        }

        // Password
        if (!pass1 || !pass1.value.trim()) {
          showFieldError(pass1, 'Password is required.');
          isValid = false;
        } else if (pass1.value.length < 6) {
          showFieldError(pass1, 'Password must be at least 6 characters long.');
          isValid = false;
        }

        // Confirm Password
        if (!pass2 || !pass2.value.trim()) {
          showFieldError(pass2, 'Please confirm your password.');
          isValid = false;
        } else if (pass2.value !== (pass1 ? pass1.value : '')) {
          showFieldError(pass2, 'Passwords do not match.');
          isValid = false;
        }

        // Terms
        if (!terms || !terms.checked) {
          showFieldError(terms, 'You must agree to the Demonstration Guidelines to continue.');
          isValid = false;
        }

        if (isValid) {
          const nameVal = name.value.trim();
          const emailVal = email.value.trim();

          localStorage.setItem('stackly_user_email', emailVal);
          localStorage.setItem('stackly_user_name', nameVal);
          localStorage.setItem('stackly_user_role', selectedRole === 'admin' ? 'Admin' : 'User');

          // Strictly User and Admin dashboards
          const targetUrl = selectedRole === 'admin' ? 'admin-dashboard.html' : 'user-dashboard.html';

          // Immediate seamless navigation without any popup toast
          window.location.href = targetUrl;
        }
      });
    }
  }

  // ==========================================
  // 16. USER DASHBOARD (user-dashboard.html)
  // ==========================================
  function initUserDashboard() {
    setupDashboardSidebar('user');
    setupUserTripFilters();
    setupUserSavedDestinations();
    setupBudgetCalculator();
    setupPackingChecklist();
    setupProfileForms('user');
  }

  // ==========================================
  // 17. CLIENT DASHBOARD (client-dashboard.html)
  // ==========================================
  function initClientDashboard() {
    window.location.replace('user-dashboard.html');
  }

  // Admin Dashboard Module
  function initAdminDashboard() {
    setupDashboardSidebar('admin');
    initDashboardUserData();
  }

  // Dynamic user data populator across dashboards
  function initDashboardUserData() {
    const storedEmail = localStorage.getItem('stackly_user_email');
    const storedName = localStorage.getItem('stackly_user_name');

    if (storedEmail || storedName) {
      const displayName = storedName || (storedEmail ? storedEmail.split('@')[0] : 'Traveler');
      const displayEmail = storedEmail || 'user@stackly.com';

      // Welcome Section
      document.querySelectorAll('.dynamic-user-name').forEach(el => {
        el.textContent = displayName;
      });

      const hour = new Date().getHours();
      const timeGreeting = hour < 12 ? 'GOOD MORNING,' : (hour < 17 ? 'GOOD AFTERNOON,' : 'GOOD EVENING,');
      document.querySelectorAll('.welcome-greeting-prefix').forEach(el => {
        el.textContent = timeGreeting;
      });

      // Profile Email Section
      document.querySelectorAll('.dynamic-user-email').forEach(el => {
        el.textContent = displayEmail;
      });

      // Header Profile Name
      const headerName = document.getElementById('headerUserName');
      if (headerName) headerName.textContent = displayName;

      // Header Profile Email
      const headerEmail = document.getElementById('headerUserEmail');
      if (headerEmail) headerEmail.textContent = displayEmail;

      // Initials Avatar
      const initials = displayName
        .split(' ')
        .filter(Boolean)
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase() || 'ST';
      
      const avatarInitialsEl = document.getElementById('headerAvatarInitials');
      if (avatarInitialsEl) {
        avatarInitialsEl.textContent = initials;
      }

      // Settings form fields
      const profileNameInput = document.querySelector('#userProfileForm input[type="text"], #adminSettingsName');
      if (profileNameInput) profileNameInput.value = displayName;

      const profileEmailInput = document.querySelector('#userProfileForm input[type="email"], #adminSettingsEmail');
      if (profileEmailInput) profileEmailInput.value = displayEmail;
    }
  }

  // Helper: Sidebar and View Switching for Dashboards
  function setupDashboardSidebar(type) {
    const sidebar = document.querySelector('.dashboard-sidebar');
    if (!sidebar) return;

    // Idempotent guard: Prevent duplicate event listener attachments
    if (sidebar.dataset.sidebarInitialized === 'true') {
      return;
    }
    sidebar.dataset.sidebarInitialized = 'true';

    const toggleBtn = document.querySelector('.sidebar-toggle-btn');
    const closeBtn = document.querySelector('.sidebar-close-btn');
    const navItems = document.querySelectorAll('.dash-nav-link, .dashboard-nav-item');
    const views = document.querySelectorAll('.dashboard-view');

    // Ensure mobile backdrop overlay exists
    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'sidebar-overlay';
      document.body.appendChild(overlay);
    }

    const openSidebar = () => {
      sidebar.classList.add('active', 'mobile-open');
      overlay.classList.add('active');
      document.documentElement.classList.add('sidebar-open');
      document.body.classList.add('sidebar-open');
    };

    const closeSidebar = () => {
      sidebar.classList.remove('active', 'mobile-open');
      overlay.classList.remove('active');
      document.documentElement.classList.remove('sidebar-open');
      document.body.classList.remove('sidebar-open');
    };

    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (sidebar.classList.contains('active')) {
          closeSidebar();
        } else {
          openSidebar();
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeSidebar();
      });
    }

    overlay.addEventListener('click', (e) => {
      e.preventDefault();
      closeSidebar();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar.classList.contains('active')) {
        closeSidebar();
      }
    });

    // Close on resize to desktop viewport
    window.addEventListener('resize', () => {
      if (window.innerWidth > 992 && sidebar.classList.contains('active')) {
        closeSidebar();
      }
    });

    // View switching
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const viewId = item.getAttribute('data-view');
        if (!viewId) return;

        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');

        views.forEach(v => {
          const match = v.id === viewId || v.id === `view-${viewId}` || v.id.replace('view-', '') === viewId;
          v.classList.toggle('active', match);
        });

        // Close mobile drawer after selection
        closeSidebar();

        // Scroll to top of content
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    // Quick action buttons switching views
    document.querySelectorAll('[data-switch-view]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = btn.getAttribute('data-switch-view');
        const targetNav = document.querySelector(`.dash-nav-link[data-view="${targetView}"], .dashboard-nav-item[data-view="${targetView}"]`);
        if (targetNav) targetNav.click();
      });
    });

    // Logout button
    document.querySelectorAll('.btn-logout, .logout-link').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'login.html';
      });
    });

    // Populate user profile data
    initDashboardUserData();

    // Demo notification dropdown / pill
    const notifBtn = document.querySelector('.btn-notifications');
    if (notifBtn) {
      notifBtn.addEventListener('click', () => {
        showDemoToast('Notifications Demo: You have 2 travel advisories and 1 checklist reminder.', 'info');
      });
    }
  }

  // --- USER DASHBOARD SPECIFICS ---
  function setupUserTripFilters() {
    const searchInput = document.getElementById('userTripSearch');
    const filterPills = document.querySelectorAll('.trip-filter-pill');
    const tripCards = document.querySelectorAll('.user-trip-card');

    let currentStatus = 'all';
    let searchQuery = '';

    const filterTrips = () => {
      tripCards.forEach(card => {
        const status = (card.getAttribute('data-status') || '').toLowerCase();
        const name = (card.querySelector('.trip-card-name')?.textContent || '').toLowerCase();
        const dest = (card.querySelector('.trip-card-dest')?.textContent || '').toLowerCase();

        const matchStatus = currentStatus === 'all' || status === currentStatus.toLowerCase();
        const matchSearch = !searchQuery || name.includes(searchQuery) || dest.includes(searchQuery);

        card.style.display = (matchStatus && matchSearch) ? '' : 'none';
      });
    };

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        filterTrips();
      });
    }

    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentStatus = pill.getAttribute('data-status') || 'all';
        filterTrips();
      });
    });
  }

  function setupUserSavedDestinations() {
    const favButtons = document.querySelectorAll('.btn-fav-toggle');
    favButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const isSaved = btn.classList.contains('saved');
        btn.classList.toggle('saved', !isSaved);
        const icon = btn.querySelector('i');
        if (icon) {
          icon.classList.toggle('fa-solid', !isSaved);
          icon.classList.toggle('fa-regular', isSaved);
        }
        showDemoToast(!isSaved ? 'Destination added to demo favorites.' : 'Destination removed from demo favorites.', 'info');
      });
    });
  }

  function setupBudgetCalculator() {
    const calcForm = document.getElementById('budgetCalculatorForm');
    if (!calcForm) return;

    const destSelect = document.getElementById('calcDest');
    const daysInput = document.getElementById('calcDays');
    const travelersInput = document.getElementById('calcTravelers');
    const tierSelect = document.getElementById('calcTier');
    const offsetCheckbox = document.getElementById('calcOffset');

    const totalDisplay = document.getElementById('calcTotalEstimate');
    const perPersonDisplay = document.getElementById('calcPerPersonEstimate');
    const carbonOffsetDisplay = document.getElementById('calcOffsetDisplay');

    const recalculate = () => {
      const days = Math.max(1, parseInt(daysInput?.value, 10) || 1);
      const travelers = Math.max(1, parseInt(travelersInput?.value, 10) || 1);
      const tierRate = parseInt(tierSelect?.value, 10) || 120; // daily base lodge cost
      const destBase = parseInt(destSelect?.selectedOptions[0]?.getAttribute('data-base-price'), 10) || 300;

      // Base calculation
      const lodgingCost = days * tierRate * travelers;
      const activityCost = destBase * travelers;
      let carbonCost = 0;
      if (offsetCheckbox && offsetCheckbox.checked) {
        carbonCost = days * 15 * travelers; // $15 / day / traveler certified carbon contribution
      }

      const total = lodgingCost + activityCost + carbonCost;
      const perPerson = Math.round(total / travelers);

      if (totalDisplay) totalDisplay.textContent = `$${total.toLocaleString()}`;
      if (perPersonDisplay) perPersonDisplay.textContent = `$${perPerson.toLocaleString()} / person`;
      if (carbonOffsetDisplay) {
        carbonOffsetDisplay.textContent = offsetCheckbox && offsetCheckbox.checked 
          ? `Includes $${carbonCost} certified habitat regeneration offset` 
          : 'Carbon offset unchecked';
      }
    };

    [destSelect, daysInput, travelersInput, tierSelect, offsetCheckbox].forEach(el => {
      if (el) {
        el.addEventListener('change', recalculate);
        el.addEventListener('input', recalculate);
      }
    });

    calcForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showDemoToast('Trip calculation saved to your demo planner draft!', 'success');
    });

    recalculate();
  }

  function setupPackingChecklist() {
    const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    const progressFill = document.querySelector('.checklist-progress-fill');
    const progressLabel = document.querySelector('.checklist-progress-text');

    const updateChecklistProgress = () => {
      if (!checkboxes.length) return;
      let checkedCount = 0;
      checkboxes.forEach(cb => {
        if (cb.checked) checkedCount++;
        const item = cb.closest('.checklist-item');
        if (item) item.classList.toggle('completed', cb.checked);
      });

      const percent = Math.round((checkedCount / checkboxes.length) * 100);
      if (progressFill) progressFill.style.width = `${percent}%`;
      if (progressLabel) progressLabel.textContent = `${checkedCount} of ${checkboxes.length} items packed (${percent}%)`;
    };

    checkboxes.forEach(cb => cb.addEventListener('change', updateChecklistProgress));
    updateChecklistProgress();

    // Reset checklist button
    const resetBtn = document.getElementById('resetChecklistBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        checkboxes.forEach(cb => cb.checked = false);
        updateChecklistProgress();
        showDemoToast('Checklist reset to default.', 'info');
      });
    }

    // Download/Print demo itinerary handler
    const printBtn = document.getElementById('printDemoItineraryBtn');
    if (printBtn) {
      printBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showDemoToast('Generating demo itinerary print view...', 'info');
        setTimeout(() => window.print(), 500);
      });
    }
  }

  // --- CLIENT DASHBOARD SPECIFICS ---
  function setupClientTravelPlans() {
    // Dynamic In-Session CRUD for Demo Travel Plans
    const plansContainer = document.getElementById('clientPlansGrid');
    const createPlanForm = document.getElementById('createPlanForm');

    if (createPlanForm) {
      createPlanForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = createPlanForm.querySelector('#newPlanName').value.trim();
        const dest = createPlanForm.querySelector('#newPlanDest').value.trim();
        const dates = createPlanForm.querySelector('#newPlanDates').value.trim();
        const travelers = createPlanForm.querySelector('#newPlanTravelers').value.trim();
        const style = createPlanForm.querySelector('#newPlanStyle').value.trim();

        if (!name || !dest) {
          if (typeof showDemoToast === 'function') showDemoToast('Please provide plan name and destination.', 'error');
          return;
        }

        const card = document.createElement('div');
        card.className = 'client-plan-card';
        card.innerHTML = `
          <div class="plan-card-header">
            <div>
              <span class="plan-badge badge-planning">In Planning (Demo)</span>
              <h4 class="plan-name">${escapeHtml(name)}</h4>
              <p class="plan-dest"><i class="fa-solid fa-location-dot text-accent"></i> ${escapeHtml(dest)}</p>
            </div>
            <button class="plan-btn-delete" title="Remove Plan"><i class="fa-solid fa-trash-can"></i></button>
          </div>
          <div class="plan-card-meta">
            <div><strong>Dates:</strong> ${escapeHtml(dates || 'Flexible')}</div>
            <div><strong>Party Size:</strong> ${escapeHtml(travelers || '2 Travelers')}</div>
            <div><strong>Focus:</strong> ${escapeHtml(style || 'Nature & Conservation')}</div>
          </div>
          <div class="plan-card-actions">
            <button class="btn btn-outline-sm btn-plan-edit">Edit Notes</button>
            <button class="btn btn-primary-sm btn-plan-review">Review Schedule</button>
          </div>
        `;

        card.querySelector('.plan-btn-delete').addEventListener('click', () => {
          card.remove();
          showDemoToast(`Demo travel plan "${name}" removed from session.`, 'info');
        });

        card.querySelector('.btn-plan-edit').addEventListener('click', () => {
          showDemoToast(`Editing notes for "${name}" (Demonstration view).`, 'info');
        });

        card.querySelector('.btn-plan-review').addEventListener('click', () => {
          const itNav = document.querySelector('.dashboard-nav-item[data-view="itineraryActivitiesView"]');
          if (itNav) itNav.click();
        });

        if (plansContainer) {
          plansContainer.prepend(card);
        }

        closeModal('createPlanModal');
        createPlanForm.reset();
        showDemoToast(`New plan "${name}" added to current session!`, 'success');
      });
    }

    // Existing delete buttons
    document.querySelectorAll('.plan-btn-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.client-plan-card');
        if (card) {
          card.remove();
          showDemoToast('Demo plan removed.', 'info');
        }
      });
    });
  }

  function setupClientDestinationCollection() {
    const search = document.getElementById('clientDestSearch');
    const filter = document.getElementById('clientDestFilter');
    const cards = document.querySelectorAll('.client-dest-card');

    const filterCards = () => {
      const q = (search?.value || '').toLowerCase().trim();
      const cat = (filter?.value || 'all').toLowerCase();

      cards.forEach(card => {
        const title = (card.querySelector('.dest-name')?.textContent || '').toLowerCase();
        const loc = (card.querySelector('.dest-loc')?.textContent || '').toLowerCase();
        const category = (card.getAttribute('data-style') || '').toLowerCase();

        const matchesQuery = !q || title.includes(q) || loc.includes(q);
        const matchesCat = cat === 'all' || category === cat;

        card.style.display = (matchesQuery && matchesCat) ? '' : 'none';
      });
    };

    if (search) search.addEventListener('input', filterCards);
    if (filter) filter.addEventListener('change', filterCards);
  }

  function setupClientItineraryManager() {
    const addActivityForm = document.getElementById('addActivityForm');
    if (addActivityForm) {
      addActivityForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const daySelect = document.getElementById('activityDaySelect')?.value || '1';
        const title = document.getElementById('activityTitle')?.value.trim();
        const time = document.getElementById('activityTime')?.value.trim() || 'Morning';
        const notes = document.getElementById('activityNotes')?.value.trim();

        if (!title) {
          if (typeof showDemoToast === 'function') showDemoToast('Please enter an activity title.', 'error');
          return;
        }

        const targetDayList = document.querySelector(`.itinerary-day[data-day="${daySelect}"] .activity-list`);
        if (targetDayList) {
          const item = document.createElement('li');
          item.className = 'activity-item';
          item.innerHTML = `
            <div class="activity-time"><i class="fa-regular fa-clock text-accent"></i> ${escapeHtml(time)}</div>
            <div class="activity-info">
              <h5 class="activity-heading">${escapeHtml(title)} <span class="badge-tag">Demo Added</span></h5>
              <p class="activity-desc">${escapeHtml(notes || 'Custom client activity item added in this session.')}</p>
            </div>
            <button class="activity-remove-btn" title="Remove Activity">&times;</button>
          `;

          item.querySelector('.activity-remove-btn').addEventListener('click', () => {
            item.remove();
            showDemoToast('Activity removed from demo itinerary.', 'info');
          });

          targetDayList.appendChild(item);
          closeModal('addActivityModal');
          addActivityForm.reset();
          showDemoToast(`Activity added to Day ${daySelect}!`, 'success');
        }
      });
    }

    // Existing activity remove buttons
    document.querySelectorAll('.activity-remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.activity-item');
        if (item) {
          item.remove();
          showDemoToast('Activity removed from demo itinerary.', 'info');
        }
      });
    });
  }

  function setupProfileForms(type) {
    const profileForm = document.getElementById(`${type}ProfileForm`);
    if (profileForm) {
      profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showDemoToast('Profile preferences updated in current session!', 'success');
      });
    }

    const supportForm = document.getElementById('clientSupportForm');
    if (supportForm) {
      supportForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = supportForm.querySelector('#supportMsg');
        if (!msg.value.trim() || msg.value.trim().length < 5) {
          showFieldError(msg, 'Please enter a brief message for support.');
          return;
        }
        showDemoToast('Demo support inquiry dispatched! (Client-side simulation)', 'success');
        supportForm.reset();
      });
    }
  }

  // ==========================================
  // 18. NEWSLETTER VALIDATION (Shared across pages)
  // ==========================================
  function initNewsletterForms() {
    document.querySelectorAll('.newsletter-form, .newsletter-form-box').forEach(form => {
      const emailInput = form.querySelector('input[type="email"]');
      let feedback = form.querySelector('.newsletter-feedback');

      if (emailInput) {
        emailInput.addEventListener('input', () => {
          emailInput.classList.remove('is-invalid');
          if (feedback) {
            feedback.style.display = 'none';
            feedback.textContent = '';
          }
        });
      }

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!feedback) {
          feedback = document.createElement('div');
          feedback.className = 'newsletter-feedback';
          form.appendChild(feedback);
        }

        const emailVal = emailInput ? emailInput.value.trim() : '';

        // Empty field check (Email is required - in red color)
        if (!emailVal) {
          if (emailInput) emailInput.classList.add('is-invalid');
          feedback.textContent = 'Email is required';
          feedback.className = 'newsletter-feedback error';
          feedback.style.color = '#ff4d4f';
          feedback.style.display = 'block';
          feedback.style.marginTop = '8px';
          feedback.style.fontWeight = '600';
          feedback.style.fontSize = '0.82rem';
          return;
        }

        // Invalid email format check
        if (!isValidEmail(emailVal)) {
          if (emailInput) emailInput.classList.add('is-invalid');
          feedback.textContent = 'Please enter a valid email address.';
          feedback.className = 'newsletter-feedback error';
          feedback.style.color = '#ff4d4f';
          feedback.style.display = 'block';
          feedback.style.marginTop = '8px';
          feedback.style.fontWeight = '600';
          feedback.style.fontSize = '0.82rem';
          return;
        }

        if (emailInput) emailInput.classList.remove('is-invalid');
        feedback.textContent = 'Thank you! You are subscribed to our demonstration newsletter dispatch.';
        feedback.className = 'newsletter-feedback success';
        feedback.style.color = '#52c41a';
        feedback.style.display = 'block';
        feedback.style.marginTop = '8px';
        feedback.style.fontWeight = '600';
        feedback.style.fontSize = '0.82rem';
        showDemoToast('Subscribed to newsletter!', 'success');
        if (emailInput) emailInput.value = '';
      });
    });
  }

  // ==========================================
  // UTILITY HELPERS
  // ==========================================
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  function showFieldError(input, message) {
    if (!input) return;
    input.classList.add('is-invalid');
    const container = input.closest('.form-group') || input.closest('.checkbox-group') || input.parentElement;
    if (container) {
      let errorEl = container.querySelector('.form-error');
      if (!errorEl) {
        errorEl = document.createElement('div');
        errorEl.className = 'form-error';
        container.appendChild(errorEl);
      }
      errorEl.textContent = message;
      errorEl.style.color = '#FD5301';
      errorEl.style.fontSize = '0.82rem';
      errorEl.style.fontWeight = '600';
      errorEl.style.marginTop = '6px';
      errorEl.style.display = 'block';
    }
  }

  // Universal action buttons and links redirect to 404.html (except on login.html & signup.html)
  function initActionButtonsRedirect() {
    const currentPath = window.location.pathname.toLowerCase();
    const isAuthPage = currentPath.endsWith('login.html') || currentPath.endsWith('signup.html');
    const is404Page = currentPath.endsWith('404.html');

    // On Auth pages or 404 page, do not touch links or buttons
    if (isAuthPage || is404Page) return;

    function isInsideNavbar(el) {
      if (!el) return false;
      return !!el.closest('.navbar, header.navbar, .navbar-nav, .nav-menu, .nav-links, .nav-item, .brand-link, .nav-toggle, .navbar-actions, .mobile-nav-menu, .mobile-nav-link');
    }

    function isInsideSidebar(el) {
      if (!el) return false;
      return !!el.closest('.dashboard-sidebar, aside.dashboard-sidebar, .sidebar-header, .sidebar-nav, .sidebar-footer, .sidebar-toggle-btn, .sidebar-close-btn, .sidebar-overlay, .mobile-overlay');
    }

    // 1. Static attribute update for all non-navbar, non-sidebar anchors
    document.querySelectorAll('a').forEach(a => {
      if (isInsideNavbar(a) || isInsideSidebar(a)) return;
      const href = a.getAttribute('href') || '';
      if (href.includes('login.html') || href.includes('signup.html')) return;
      a.setAttribute('href', '404.html');
    });

    // 2. Add pointer cursor style for all icons outside navbar and sidebar
    document.querySelectorAll('i, svg, [class*="fa-"]').forEach(icon => {
      if (!isInsideNavbar(icon) && !isInsideSidebar(icon)) {
        icon.style.cursor = 'pointer';
      }
    });

    // 3. Document-level Capture Phase Click Listener
    // Catches clicks on ANY button, link, or icon throughout the page
    document.addEventListener('click', (e) => {
      // Find closest interactive or icon target
      const target = e.target.closest(
        'button, a, i, svg, [class*="fa-"], [class*="icon"], [role="button"], .btn, [class*="btn-"], .action-btn, .exp-card-link, .demo-date-pill, .info-tag'
      );

      if (!target) return;

      // DO NOT TOUCH NAVBAR
      if (isInsideNavbar(target) || 
          target.classList.contains('nav-link') || 
          target.classList.contains('nav-toggle') || 
          target.classList.contains('brand-link')) {
        return;
      }

      // DO NOT TOUCH SIDEBAR
      if (isInsideSidebar(target) || 
          target.classList.contains('sidebar-toggle-btn') || 
          target.classList.contains('sidebar-close-btn') || 
          target.classList.contains('dash-nav-link') || 
          target.classList.contains('dashboard-nav-item') || 
          target.classList.contains('btn-logout') || 
          target.classList.contains('logout-link')) {
        return;
      }

      // DO NOT TOUCH ACCORDIONS (FAQ expand/collapse arrows and headers)
      if (target.closest('.accordion, .accordion-item, .accordion-header, .accordion-body')) {
        return;
      }

      // DO NOT TOUCH CAROUSEL CONTROLS
      if (target.closest('.carousel-btn, .carousel-dot, .carousel-prev, .carousel-next, .testimonial-carousel')) {
        return;
      }

      // DO NOT TOUCH MODALS, TABS, PASSWORD EYE TOGGLE, OR BACK-TO-TOP
      if (target.closest('.modal, .modal-close, [data-modal-close], .back-to-top, #backToTop, .password-toggle, .toggle-password, .tab-btn, [data-tab]')) {
        return;
      }

      // If it is a form submit button, allow the form submission validator to handle validation first
      if (target.tagName === 'BUTTON' && target.type === 'submit') {
        return;
      }

      // All other buttons, links, and icons: REDIRECT TO 404.html!
      e.preventDefault();
      e.stopPropagation();

      target.classList.add('btn-clicked');
      setTimeout(() => {
        window.location.href = '404.html';
      }, 150);
    }, true);

    // 4. Universal Form Validation Handler across all forms
    // "if there is any form then add the validation then after also go to 404 page."
    document.querySelectorAll('form').forEach(form => {
      // Skip login and signup forms as they have their own strict handler
      if (form.id === 'loginForm' || form.id === 'signupForm') return;

      form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Clear previous errors
        form.querySelectorAll('.form-error').forEach(err => err.remove());
        form.querySelectorAll('.is-invalid').forEach(inp => inp.classList.remove('is-invalid'));

        let isValid = true;
        const requiredInputs = form.querySelectorAll('input[required], select[required], textarea[required]');

        requiredInputs.forEach(input => {
          const val = input.value.trim();
          if (!val) {
            showFieldError(input, 'This field is required.');
            isValid = false;
          } else if (input.type === 'email' && !isValidEmail(val)) {
            showFieldError(input, 'Please enter a valid email address.');
            isValid = false;
          }
        });

        // Also check any email inputs even if not explicitly required
        form.querySelectorAll('input[type="email"]:not([required])').forEach(input => {
          const val = input.value.trim();
          if (val && !isValidEmail(val)) {
            showFieldError(input, 'Please enter a valid email address.');
            isValid = false;
          }
        });

        if (isValid) {
          const submitBtn = form.querySelector('[type="submit"]');
          if (submitBtn) submitBtn.classList.add('btn-clicked');

          setTimeout(() => {
            window.location.href = '404.html';
          }, 150);
        }
      });
    });
  }

  // Universal button click animation & feedback (Flame Orange active color)
  function initButtonClickEffects() {
    document.addEventListener('pointerdown', (e) => {
      const btn = e.target.closest('.btn, button, .action-btn, .btn-auth-submit, .exp-card-link');
      if (!btn) return;

      // Add instant click active class with suitable Flame Orange color
      btn.classList.add('btn-clicked');

      // Create expanding ripple effect
      const rect = btn.getBoundingClientRect();
      const circle = document.createElement('span');
      circle.className = 'btn-ripple';
      const size = Math.max(rect.width, rect.height);
      circle.style.width = circle.style.height = `${size}px`;
      circle.style.left = `${e.clientX - rect.left - size / 2}px`;
      circle.style.top = `${e.clientY - rect.top - size / 2}px`;
      circle.style.position = 'absolute';
      circle.style.borderRadius = '50%';
      circle.style.pointerEvents = 'none';

      if (getComputedStyle(btn).position === 'static') {
        btn.style.position = 'relative';
      }
      btn.style.overflow = 'hidden';

      btn.appendChild(circle);
      setTimeout(() => {
        circle.remove();
        btn.classList.remove('btn-clicked');
      }, 500);
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

})();

