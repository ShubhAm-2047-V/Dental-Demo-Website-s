/*
=========================================
DENTALLUX CLINIC - INTERACTIVE JS LOGIC
=========================================
*/

document.addEventListener('DOMContentLoaded', () => {

  // REGISTER GSAP SCROLLTRIGGER
  gsap.registerPlugin(ScrollTrigger);

  // 1. LENIS SMOOTH SCROLL INTEGRATION
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  // Connect Lenis to ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);


  // 2. LOADER ANIMATION
  const loader = document.getElementById('loader');
  const loaderProgress = document.getElementById('loader-progress');
  
  // Simulate load progress
  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(progressInterval);
      
      // Hide loader with premium transition
      const tl = gsap.timeline({
        onComplete: () => {
          loader.style.display = 'none';
          ScrollTrigger.refresh();
          // Trigger Hero entry animations once loader is hidden
          triggerHeroAnimations();
        }
      });

      tl.to(loaderProgress, {
        width: '100%',
        duration: 0.2
      })
      .to(loader, {
        yPercent: -100,
        duration: 0.8,
        ease: 'power4.inOut',
        delay: 0.1
      });
    } else {
      loaderProgress.style.width = `${progress}%`;
    }
  }, 50);


  // 3. CUSTOM CURSOR GLOW EFFECT
  const customCursor = document.getElementById('custom-cursor');
  
  if (customCursor) {
    document.addEventListener('mousemove', (e) => {
      // Small delay for smooth follow effect
      gsap.to(customCursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
      });
    });

    // Expand glow on hover over interactive elements
    const hoverElements = document.querySelectorAll('a, button, select, input, textarea, .faq-header, .slider-bar-handle');
    hoverElements.forEach(elem => {
      elem.addEventListener('mouseenter', () => {
        gsap.to(customCursor, {
          scale: 2.5,
          opacity: 0.5,
          backgroundColor: '#00b4d8',
          duration: 0.2
        });
      });
      elem.addEventListener('mouseleave', () => {
        gsap.to(customCursor, {
          scale: 1,
          opacity: 0.3,
          backgroundColor: '#4ea8de',
          duration: 0.2
        });
      });
    });
  }


  // 4. NAVBAR STICKY & ACTIVE LINK CONTROL
  const navbar = document.getElementById('main-navbar');
  const scrollToTopBtn = document.getElementById('scroll-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('sticky');
    } else {
      navbar.classList.remove('sticky');
    }

    // Toggle Back to Top Button
    if (window.scrollY > 600) {
      scrollToTopBtn.classList.add('show');
    } else {
      scrollToTopBtn.classList.remove('show');
    }
  });

  // Smooth scroll to top when clicked
  scrollToTopBtn.addEventListener('click', () => {
    lenis.scrollTo('#hero', { duration: 1.5 });
  });

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = this.getAttribute('href');
      if (target === '#') return;
      
      // Close mobile menu if active
      navMenu.classList.remove('active');
      menuToggle.innerHTML = '<i class="fa-solid fa-bars-staggered"></i>';

      lenis.scrollTo(target, { 
        duration: 1.2,
        offset: -80
      });
    });
  });


  // 5. MOBILE MENU TOGGLE
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      if (navMenu.classList.contains('active')) {
        menuToggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
      } else {
        menuToggle.innerHTML = '<i class="fa-solid fa-bars-staggered"></i>';
      }
    });
  }


  // 6. HERO ENTRY ANIMATIONS
  function triggerHeroAnimations() {
    const tl = gsap.timeline();

    tl.from('.hero-tag', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power3.out'
    })
    .from('.hero-title', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.4')
    .from('.hero-desc', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.5')
    .from('.hero-actions .btn', {
      opacity: 0,
      y: 15,
      stagger: 0.15,
      duration: 0.5,
      ease: 'power3.out'
    }, '-=0.4')
    .from('.hero-booking-card', {
      opacity: 0,
      x: 350,
      duration: 1.4,
      ease: 'power4.out',
      onComplete: function() {
        this.targets().forEach(el => el.classList.add('reveal-complete'));
      }
    }, '-=0.8');
  }


  // 7. STATS COUNTING ANIMATION ON SCROLL
  const stats = document.querySelectorAll('.stats-number');
  
  stats.forEach(stat => {
    const target = parseFloat(stat.getAttribute('data-target'));
    const decimals = parseInt(stat.getAttribute('data-decimals')) || 0;
    const suffix = stat.innerHTML.includes('+') ? '+' : stat.innerHTML.includes('%') ? '%' : '';

    gsap.fromTo(stat, {
      innerText: 0
    }, {
      innerText: target,
      duration: 2.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: stat,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      snap: {
        innerText: decimals === 0 ? 1 : 0.1
      },
      onUpdate: function () {
        let value = parseFloat(this.targets()[0].innerText).toFixed(decimals);
        // Replace rating dot with comma or keep dot
        this.targets()[0].innerText = value + suffix;
      }
    });
  });


  // 8. BEFORE & AFTER INTERACTIVE SLIDER
  const slider = document.getElementById('before-after-slider');
  const afterImage = document.getElementById('after-image-container');
  const handle = document.getElementById('slider-handle');

  if (slider && afterImage && handle) {
    let isResizing = false;

    // Set slider position based on coordinates
    function setSliderPosition(x) {
      const rect = slider.getBoundingClientRect();
      let position = ((x - rect.left) / rect.width) * 100;
      
      // Keep boundaries inside 0% and 100%
      if (position < 0) position = 0;
      if (position > 100) position = 100;

      afterImage.style.width = `${position}%`;
      handle.style.left = `${position}%`;
    }

    // Desktop Mouse Events
    slider.addEventListener('mousedown', (e) => {
      isResizing = true;
      setSliderPosition(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isResizing = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isResizing) return;
      setSliderPosition(e.clientX);
    });

    // Touch Support for Mobile
    slider.addEventListener('touchstart', (e) => {
      isResizing = true;
      setSliderPosition(e.touches[0].clientX);
    });

    window.addEventListener('touchend', () => {
      isResizing = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (!isResizing) return;
      setSliderPosition(e.touches[0].clientX);
    });

    // Update dimensions on resize
    window.addEventListener('resize', () => {
      const rect = slider.getBoundingClientRect();
      const afterImgElement = afterImage.querySelector('img');
      if (afterImgElement) {
        afterImgElement.style.width = `${rect.width}px`;
      }
    });

    // Initial setup for image sizing
    const rect = slider.getBoundingClientRect();
    const afterImgElement = afterImage.querySelector('img');
    if (afterImgElement) {
      afterImgElement.style.width = `${rect.width}px`;
    }
  }


  // 9. PATIENT TESTIMONIALS AUTO SLIDER
  const testimonialSlider = document.getElementById('testimonial-slider-container');
  const prevBtn = document.getElementById('prev-review');
  const nextBtn = document.getElementById('next-review');
  
  if (testimonialSlider) {
    const reviews = testimonialSlider.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    let autoPlayInterval;

    function showReview(index) {
      if (index < 0) {
        currentIndex = reviews.length - 1;
      } else if (index >= reviews.length) {
        currentIndex = 0;
      } else {
        currentIndex = index;
      }
      
      gsap.to(testimonialSlider, {
        xPercent: -100 * currentIndex,
        duration: 0.6,
        ease: 'power3.out'
      });
    }

    function startAutoPlay() {
      autoPlayInterval = setInterval(() => {
        showReview(currentIndex + 1);
      }, 5000);
    }

    function resetAutoPlay() {
      clearInterval(autoPlayInterval);
      startAutoPlay();
    }

    prevBtn.addEventListener('click', () => {
      showReview(currentIndex - 1);
      resetAutoPlay();
    });

    nextBtn.addEventListener('click', () => {
      showReview(currentIndex + 1);
      resetAutoPlay();
    });

    // Initialize autoplay
    startAutoPlay();
  }


  // 10. FAQ ACCORDION ANIMATION
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const body = item.querySelector('.faq-body');
    const content = item.querySelector('.faq-content');

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other FAQs
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherBody = otherItem.querySelector('.faq-body');
          gsap.to(otherBody, {
            maxHeight: 0,
            duration: 0.4,
            ease: 'power3.inOut'
          });
        }
      });

      // Toggle current FAQ
      item.classList.toggle('active');

      if (!isActive) {
        gsap.to(body, {
          maxHeight: content.scrollHeight + 30, // Includes margins
          duration: 0.5,
          ease: 'power3.out'
        });
      } else {
        gsap.to(body, {
          maxHeight: 0,
          duration: 0.4,
          ease: 'power3.inOut'
        });
      }
    });
  });


  // 11. GENERAL GSAP SCROLL REVEAL ANIMATIONS
  // Fade-in sections
  const scrollFadeIn = document.querySelectorAll('.about-content, .about-images, .section-header, .booking-info');
  scrollFadeIn.forEach(elem => {
    gsap.from(elem, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: elem,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Services Cards stagger fade
  gsap.from('.services-grid .service-card', {
    opacity: 0,
    y: 50,
    stagger: 0.15,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.services-grid',
      start: 'top 90%',
      toggleActions: 'play none none none'
    },
    onComplete: function() {
      this.targets().forEach(el => el.classList.add('reveal-complete'));
    }
  });

  // Doctor Cards stagger fade
  gsap.from('.doctors-grid .doctor-card', {
    opacity: 0,
    y: 50,
    stagger: 0.2,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.doctors-grid',
      start: 'top 90%',
      toggleActions: 'play none none none'
    },
    onComplete: function() {
      this.targets().forEach(el => el.classList.add('reveal-complete'));
    }
  });

  // Why Choose Us Cards stagger fade
  gsap.from('.features-grid .feature-card', {
    opacity: 0,
    y: 40,
    stagger: 0.1,
    duration: 0.7,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.features-grid',
      start: 'top 90%',
      toggleActions: 'play none none none'
    },
    onComplete: function() {
      this.targets().forEach(el => el.classList.add('reveal-complete'));
    }
  });


  // 12. APPOINTMENT BOOKING FORM VALIDATION & SUCCESS HANDLERS
  const mainBookingForm = document.getElementById('main-appointment-form');
  const miniBookingForm = document.getElementById('hero-mini-booking');
  const successOverlay = document.getElementById('form-success-screen');
  const resetBtn = document.getElementById('reset-booking-btn');

  // Hero mini booking form callback
  if (miniBookingForm) {
    miniBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Grab data
      const nameInput = miniBookingForm.querySelector('input[type="text"]').value;
      const phoneInput = miniBookingForm.querySelector('input[type="tel"]').value;
      const treatmentInput = miniBookingForm.querySelector('select').value;
      
      // Sync values with main booking form for premium UX
      document.getElementById('full-name').value = nameInput;
      document.getElementById('phone-number').value = phoneInput;
      document.getElementById('treatment-select').value = treatmentInput;
      
      // Scroll to main booking form smoothly
      lenis.scrollTo('#booking', { 
        duration: 1.2,
        offset: -80,
        onComplete: () => {
          // Subtle glow callout to the form
          gsap.fromTo('.booking-form-wrapper', {
            boxShadow: '0 0 0px rgba(0, 119, 182, 0)'
          }, {
            boxShadow: '0 0 25px rgba(0, 119, 182, 0.45)',
            duration: 0.5,
            yoyo: true,
            repeat: 1
          });
        }
      });
    });
  }

  // Main booking form handler
  if (mainBookingForm && successOverlay) {
    mainBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Trigger animation for success screen reveal
      successOverlay.style.display = 'flex';
      gsap.fromTo(successOverlay, {
        opacity: 0,
        scale: 0.9
      }, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: 'power3.out'
      });
    });

    resetBtn.addEventListener('click', () => {
      // Hide success screen
      gsap.to(successOverlay, {
        opacity: 0,
        scale: 0.9,
        duration: 0.3,
        ease: 'power3.in',
        onComplete: () => {
          successOverlay.style.display = 'none';
          mainBookingForm.reset();
          if (miniBookingForm) miniBookingForm.reset();
        }
      });
    });
  }

  // Refresh ScrollTrigger when window has fully loaded and at intervals to handle delayed layout shifts (images, fonts, etc.)
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
    setTimeout(() => ScrollTrigger.refresh(), 500);
    setTimeout(() => ScrollTrigger.refresh(), 1500);
    setTimeout(() => ScrollTrigger.refresh(), 3000);
  });

});
