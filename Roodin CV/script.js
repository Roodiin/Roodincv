/* ============================================================
   PORTFOLIO SCRIPT
   ------------------------------------------------------------
   Table of contents:
     1. Mobile nav toggle (hamburger)
     2. Smooth scroll + close mobile menu on link click
     3. Active-section tracking (margin index highlight)
     4. Work/projects filter
     5. Contact form validation
     6. Back-to-top button
     7. Footer year auto-update
   Everything is wrapped in a single DOMContentLoaded listener
   and small, independent functions — comment out any block
   below to disable that feature without breaking the rest.
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ----------------------------------------------------------
     1. MOBILE NAV TOGGLE
     Toggles the .is-open class on the nav panel and keeps the
     aria-expanded attribute in sync for screen readers.
  ---------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');

  function closeNav() {
    primaryNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  function toggleNav() {
    const isOpen = primaryNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  }

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', toggleNav);
  }

  /* ----------------------------------------------------------
     2. SMOOTH SCROLL + CLOSE MENU ON LINK CLICK
     CSS `scroll-behavior: smooth` already handles the scroll
     itself; this just closes the mobile menu after a tap so it
     doesn't stay open over the destination section.
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function () {
      if (primaryNav && primaryNav.classList.contains('is-open')) {
        closeNav();
      }
    });
  });

  /* ----------------------------------------------------------
     3. ACTIVE-SECTION TRACKING
     Uses IntersectionObserver (supported in all modern browsers)
     to highlight the current section in the desktop margin index.
     Falls back gracefully — if unsupported, the index simply
     won't highlight, but navigation still works fine.
  ---------------------------------------------------------- */
  const sections = document.querySelectorAll('main .section, #hero');
  const marginLinks = document.querySelectorAll('.margin-index a');

  function setActiveLink(id) {
    marginLinks.forEach(function (link) {
      const match = link.getAttribute('href') === '#' + id;
      link.classList.toggle('is-active', match);
    });
  }

  if ('IntersectionObserver' in window && sections.length && marginLinks.length) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    }, {
      // Trigger when a section occupies the vertical middle of the viewport
      rootMargin: '-40% 0px -50% 0px',
      threshold: 0
    });

    sections.forEach(function (section) {
      if (section.id) observer.observe(section);
    });
  }

  /* ----------------------------------------------------------
     4. WORK / PROJECTS FILTER
     Filters .project-card elements by their data-tag attribute
     to match the clicked .filter-btn's data-filter value.
     "all" shows everything. Shows an empty-state message if a
     filter ever matches zero cards (useful as you add/remove work).
  ---------------------------------------------------------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const workEmpty = document.getElementById('workEmpty');

  function applyFilter(filter) {
    let visibleCount = 0;

    projectCards.forEach(function (card) {
      const matches = filter === 'all' || card.getAttribute('data-tag') === filter;
      card.style.display = matches ? '' : 'none';
      if (matches) visibleCount++;
    });

    if (workEmpty) {
      workEmpty.hidden = visibleCount !== 0;
    }
  }

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterButtons.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      applyFilter(btn.getAttribute('data-filter'));
    });
  });

  /* ----------------------------------------------------------
     5. CONTACT FORM VALIDATION
     Lightweight client-side validation — no external libraries.
     Checks: required fields, minimum lengths, basic email pattern.
     On success, shows a status message (replace the TODO below
     with a real submission — fetch() to your backend, a form
     service like Formspree, or a mailto fallback).
  ---------------------------------------------------------- */
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  // Simple, practical email pattern — not exhaustive RFC 5322, but
  // catches the typo cases ("name@", "name@site", no "@") that matter.
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setFieldError(field, message) {
    const row = field.closest('.form-row');
    const errorEl = document.getElementById('error-' + field.name);
    if (row) row.classList.toggle('has-error', Boolean(message));
    if (errorEl) errorEl.textContent = message || '';
  }

  function validateField(field) {
    const value = field.value.trim();

    if (field.hasAttribute('required') && value === '') {
      setFieldError(field, 'This field is required.');
      return false;
    }

    if (field.name === 'email' && value !== '' && !EMAIL_PATTERN.test(value)) {
      setFieldError(field, 'Enter a valid email address.');
      return false;
    }

    const minLength = field.getAttribute('minlength');
    if (minLength && value.length < Number(minLength)) {
      setFieldError(field, 'Please enter at least ' + minLength + ' characters.');
      return false;
    }

    setFieldError(field, '');
    return true;
  }

  if (form) {
    // Validate on blur for immediate feedback
    ['name', 'email', 'message'].forEach(function (fieldName) {
      const field = form.elements[fieldName];
      if (field) {
        field.addEventListener('blur', function () { validateField(field); });
      }
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      const requiredFields = [form.elements.name, form.elements.email, form.elements.message];
      const allValid = requiredFields.every(function (field) { return validateField(field); });

      if (!allValid) {
        formStatus.textContent = 'Please fix the errors above before sending.';
        formStatus.className = 'form-status is-error';
        return;
      }

      // ----------------------------------------------------------
      // TODO: Replace this block with your real submission logic.
      // Examples:
      //   1) Third-party form service (no backend needed):
      //      fetch('https://formspree.io/f/YOUR_ID', {
      //        method: 'POST',
      //        headers: { 'Accept': 'application/json' },
      //        body: new FormData(form)
      //      }).then(...).catch(...);
      //
      //   2) Your own backend endpoint:
      //      fetch('/api/contact', {
      //        method: 'POST',
      //        headers: { 'Content-Type': 'application/json' },
      //        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      //      }).then(...).catch(...);
      //
      //   3) Simple mailto fallback (no backend, opens email client):
      //      const data = new FormData(form);
      //      window.location.href = `mailto:hello@mayaokonkwo.example?subject=Project inquiry from ${data.get('name')}&body=${encodeURIComponent(data.get('message'))}`;
      // ----------------------------------------------------------

      formStatus.textContent = 'Message sent — thanks! I\u2019ll reply within two business days.';
      formStatus.className = 'form-status is-success';
      form.reset();
    });
  }

  /* ----------------------------------------------------------
     6. BACK-TO-TOP BUTTON
     Appears after the user scrolls past one viewport height.
  ---------------------------------------------------------- */
  const backToTop = document.getElementById('backToTop');

  if (backToTop) {
    let lastKnownScrollY = 0;
    let ticking = false;

    function updateBackToTopVisibility() {
      backToTop.hidden = lastKnownScrollY < window.innerHeight * 0.6;
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      lastKnownScrollY = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(updateBackToTopVisibility);
        ticking = true;
      }
    }, { passive: true });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ----------------------------------------------------------
     7. FOOTER YEAR AUTO-UPDATE
     Keeps the copyright year current without manual edits.
  ---------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

});