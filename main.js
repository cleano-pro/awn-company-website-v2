/* =====================================================
   عَون | AWN
   Main JavaScript
   Compatible with index.html and styles.css
===================================================== */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* =====================================================
     1. DOM ELEMENTS
  ===================================================== */

  const body = document.body;
  const html = document.documentElement;

  const header = document.querySelector('.site-header');

  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuClose = document.querySelector('.menu-close');

  const mobileMenuLinks = document.querySelectorAll(
    '.mobile-menu nav a, .mobile-menu-cta'
  );

  const progressBar = document.querySelector(
    '#scroll-progress-bar'
  );

  const backToTop = document.querySelector(
    '#back-to-top'
  );

  const feedbackForm = document.querySelector(
    '#feedback-form'
  );

  const formStatus = document.querySelector(
    '#form-status'
  );

  const yearElement = document.querySelector(
    '#year'
  );


  /* =====================================================
     2. CURRENT YEAR
  ===================================================== */

  function updateYear() {
    if (!yearElement) return;

    yearElement.textContent = new Date().getFullYear();
  }

  updateYear();


  /* =====================================================
     3. MOBILE NAVIGATION
  ===================================================== */

  let menuIsOpen = false;
  let previousFocusedElement = null;

  function openMenu() {
    if (!mobileMenu || !menuToggle || menuIsOpen) return;

    menuIsOpen = true;
    previousFocusedElement = document.activeElement;

    mobileMenu.classList.add('open');

    mobileMenu.setAttribute('aria-hidden', 'false');

    menuToggle.setAttribute(
      'aria-expanded',
      'true'
    );

    menuToggle.setAttribute(
      'aria-label',
      'إغلاق القائمة'
    );

    body.classList.add('menu-open');

    if (menuClose) {
      menuClose.focus();
    }
  }

  function closeMenu(returnFocus = true) {
    if (!mobileMenu || !menuToggle || !menuIsOpen) return;

    menuIsOpen = false;

    mobileMenu.classList.remove('open');

    mobileMenu.setAttribute('aria-hidden', 'true');

    menuToggle.setAttribute(
      'aria-expanded',
      'false'
    );

    menuToggle.setAttribute(
      'aria-label',
      'فتح القائمة'
    );

    body.classList.remove('menu-open');

    if (returnFocus && previousFocusedElement) {
      previousFocusedElement.focus();
    }
  }

  menuToggle?.addEventListener('click', () => {
    if (menuIsOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  menuClose?.addEventListener('click', () => {
    closeMenu();
  });

  mobileMenuLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu(false);
    });
  });

  /* إغلاق القائمة بزر Escape */

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuIsOpen) {
      closeMenu();
    }
  });

  /* إغلاق القائمة عند الضغط خارجها */

  document.addEventListener('click', (event) => {
    if (!menuIsOpen) return;

    const clickedInsideMenu =
      mobileMenu?.contains(event.target);

    const clickedToggle =
      menuToggle?.contains(event.target);

    if (!clickedInsideMenu && !clickedToggle) {
      closeMenu();
    }
  });

  /* إغلاق القائمة إذا انتقل المستخدم إلى شاشة كبيرة */

  const desktopBreakpoint = window.matchMedia(
    '(min-width: 761px)'
  );

  desktopBreakpoint.addEventListener('change', (event) => {
    if (event.matches && menuIsOpen) {
      closeMenu(false);
    }
  });


  /* =====================================================
     4. HEADER SCROLL EFFECT
  ===================================================== */

  function updateHeader() {
    if (!header) return;

    header.classList.toggle(
      'scrolled',
      window.scrollY > 30
    );
  }


  /* =====================================================
     5. SCROLL PROGRESS
  ===================================================== */

  function updateScrollProgress() {
    const scrollTop = window.scrollY;

    const scrollHeight =
      document.documentElement.scrollHeight -
      window.innerHeight;

    let progress = 0;

    if (scrollHeight > 0) {
      progress = (scrollTop / scrollHeight) * 100;
    }

    progress = Math.min(100, Math.max(0, progress));

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (backToTop) {
      backToTop.classList.toggle(
        'show',
        scrollTop > 350
      );

      backToTop.setAttribute(
        'aria-hidden',
        String(scrollTop <= 350)
      );
    }
  }


  /* =====================================================
     6. SCROLL EVENT OPTIMIZATION
  ===================================================== */

  let scrollScheduled = false;

  function handleScroll() {
    if (scrollScheduled) return;

    scrollScheduled = true;

    window.requestAnimationFrame(() => {
      updateHeader();
      updateScrollProgress();

      scrollScheduled = false;
    });
  }

  window.addEventListener(
    'scroll',
    handleScroll,
    { passive: true }
  );

  updateHeader();
  updateScrollProgress();


  /* =====================================================
     7. BACK TO TOP BUTTON
  ===================================================== */

  backToTop?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });


  /* =====================================================
     8. REVEAL ANIMATIONS
  ===================================================== */

  const revealElements = document.querySelectorAll(
    '.reveal'
  );

  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (
    'IntersectionObserver' in window &&
    !reduceMotion
  ) {

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) return;

          entry.target.classList.add('visible');

          observer.unobserve(entry.target);

        });

      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -35px 0px'
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });

  } else {

    revealElements.forEach((element) => {
      element.classList.add('visible');
    });

  }


  /* =====================================================
     9. ACTIVE NAVIGATION LINK
  ===================================================== */

  const sections = document.querySelectorAll(
    'main section[id]'
  );

  const desktopNavLinks = document.querySelectorAll(
    '.desktop-nav a'
  );

  if ('IntersectionObserver' in window) {

    const sectionObserver = new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) return;

          const currentId = entry.target.id;

          desktopNavLinks.forEach((link) => {

            const linkTarget = link.getAttribute('href');

            const isActive =
              linkTarget === `#${currentId}`;

            if (isActive) {
              link.setAttribute(
                'aria-current',
                'location'
              );
            } else {
              link.removeAttribute('aria-current');
            }

          });

        });

      },
      {
        rootMargin: '-30% 0px -60% 0px'
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });

  }


  /* =====================================================
     10. SMOOTH INTERNAL LINKS
  ===================================================== */

  const internalLinks = document.querySelectorAll(
    'a[href^="#"]'
  );

  internalLinks.forEach((link) => {

    link.addEventListener('click', (event) => {

      const targetId = link.getAttribute('href');

      if (
        !targetId ||
        targetId === '#' ||
        targetId.length < 2
      ) {
        return;
      }

      const targetElement = document.querySelector(
        targetId
      );

      if (!targetElement) return;

      event.preventDefault();

      if (menuIsOpen) {
        closeMenu(false);
      }

      targetElement.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start'
      });

      try {
        history.replaceState(
          null,
          '',
          targetId
        );
      } catch (error) {
        // لا نوقف الصفحة إذا فشل تحديث الرابط
      }

    });

  });


  /* =====================================================
     11. FEEDBACK FORM VALIDATION
  ===================================================== */

  function showFormMessage(message, isError = false) {
    if (!formStatus) return;

    formStatus.textContent = message;

    formStatus.classList.toggle(
      'error',
      isError
    );

    formStatus.setAttribute(
      'role',
      isError ? 'alert' : 'status'
    );
  }

  function validateContact(value) {

    const contact = value.trim();

    if (contact.length < 5) {
      return false;
    }

    /*
      نقبل البريد الإلكتروني أو رقم الهاتف.
      هذا تحقق بسيط وليس تحققًا من وجود الرقم فعليًا.
    */

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const phonePattern =
      /^[+0-9٠-٩۰-۹\s()-]{7,}$/;

    return (
      emailPattern.test(contact) ||
      phonePattern.test(contact)
    );
  }

  feedbackForm?.addEventListener(
    'submit',
    (event) => {

      event.preventDefault();

      if (!feedbackForm || !formStatus) return;

      const formData = new FormData(feedbackForm);

      const name = String(
        formData.get('name') || ''
      ).trim();

      const contact = String(
        formData.get('contact') || ''
      ).trim();

      const type = String(
        formData.get('type') || ''
      ).trim();

      const message = String(
        formData.get('message') || ''
      ).trim();


      /* الاسم */

      if (name.length < 2) {

        showFormMessage(
          'يرجى كتابة الاسم بصورة صحيحة.',
          true
        );

        feedbackForm.elements.name?.focus();

        return;
      }


      /* معلومات التواصل */

      if (!validateContact(contact)) {

        showFormMessage(
          'يرجى إدخال بريد إلكتروني أو رقم هاتف صحيح.',
          true
        );

        feedbackForm.elements.contact?.focus();

        return;
      }


      /* نوع الرسالة */

      if (!type) {

        showFormMessage(
          'يرجى اختيار نوع الرسالة.',
          true
        );

        feedbackForm.elements.type?.focus();

        return;
      }


      /* نص الرسالة */

      if (message.length < 5) {

        showFormMessage(
          'يرجى كتابة رسالة تحتوي على خمسة أحرف على الأقل.',
          true
        );

        feedbackForm.elements.message?.focus();

        return;
      }


      /* الحد الأقصى للرسالة */

      if (message.length > 3000) {

        showFormMessage(
          'الرسالة طويلة جدًا. يرجى اختصارها.',
          true
        );

        return;
      }


      /*
        النموذج الحالي تجريبي.
        لا يوجد Backend أو API للإرسال الحقيقي.
      */

      showFormMessage(
        'تم التحقق من البيانات بنجاح. النموذج تجريبي ولم تُرسل الرسالة إلى الشركة.'
      );

      feedbackForm.reset();

    }
  );


  /* =====================================================
     12. FORM INPUT FEEDBACK
  ===================================================== */

  feedbackForm?.querySelectorAll(
    'input, textarea, select'
  ).forEach((field) => {

    field.addEventListener('input', () => {

      if (!formStatus) return;

      formStatus.textContent = '';

      formStatus.classList.remove('error');

    });

  });


  /* =====================================================
     13. IMAGE LOADING ERROR HANDLING
  ===================================================== */

  document.querySelectorAll('img').forEach((image) => {

    image.addEventListener('error', () => {

      image.classList.add('image-error');

      console.warn(
        'تعذر تحميل الصورة:',
        image.getAttribute('src')
      );

    });

  });


  /* =====================================================
     14. IMAGE LAZY LOADING
  ===================================================== */

  document.querySelectorAll(
    'img:not([loading])'
  ).forEach((image) => {

    image.setAttribute(
      'loading',
      'lazy'
    );

  });


  /* =====================================================
     15. ACCESSIBILITY
  ===================================================== */

  /*
    تحسين الوصول إلى القائمة باستخدام لوحة المفاتيح.
  */

  mobileMenu?.addEventListener(
    'keydown',
    (event) => {

      if (event.key !== 'Tab' || !menuIsOpen) {
        return;
      }

      const focusableElements =
        mobileMenu.querySelectorAll(
          'a[href], button:not([disabled])'
        );

      if (!focusableElements.length) return;

      const firstElement = focusableElements[0];

      const lastElement =
        focusableElements[focusableElements.length - 1];

      if (
        event.shiftKey &&
        document.activeElement === firstElement
      ) {

        event.preventDefault();

        lastElement.focus();

      } else if (
        !event.shiftKey &&
        document.activeElement === lastElement
      ) {

        event.preventDefault();

        firstElement.focus();

      }

    }
  );


  /* =====================================================
     16. REDUCED MOTION SUPPORT
  ===================================================== */

  if (reduceMotion) {

    html.classList.add(
      'reduced-motion'
    );

  }


  /* =====================================================
     17. PAGE READY
  ===================================================== */

  body.classList.add('page-ready');

  console.log(
    'عَون | AWN website initialized successfully.'
  );

});
