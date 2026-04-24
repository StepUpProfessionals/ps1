/* ================================================
   PAQUETE PROFESIONAL — Script
   Step Up Business Solutions
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* 1. Año automático */
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* 2. Header — efecto scroll */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* 3. Navegación — scroll spy */
  const navLinks = document.querySelectorAll('.header__nav-link');
  const sections = [];
  navLinks.forEach(link => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) sections.push({ el: target, link });
  });

  window.addEventListener('scroll', () => {
    const pos = window.scrollY + 120;
    sections.forEach(({ el, link }) => {
      link.classList.toggle('active', pos >= el.offsetTop && pos < el.offsetTop + el.offsetHeight);
    });
  }, { passive: true });

  /* 4. Menú móvil */
  const menuToggle = document.getElementById('menuToggle');
  const headerNav = document.getElementById('headerNav');

  function closeMenu() {
    if (headerNav) headerNav.classList.remove('open');
    if (menuToggle) {
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
    document.body.classList.remove('menu-open');
  }

  if (menuToggle && headerNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = headerNav.classList.toggle('open');
      menuToggle.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.classList.toggle('menu-open', isOpen);
    });

    headerNav.querySelectorAll('.header__nav-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    headerNav.addEventListener('click', (e) => {
      if (e.target === headerNav) closeMenu();
    });
  }

  /* 5. Animaciones de entrada */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  /* 6. Helpers para placeholders sin reemplazar */
  function isMissing(value) {
    if (!value) return true;
    const text = value.trim();
    return text === '' || /\{\{.*?\}\}/.test(text);
  }

  function hideElement(el) {
    if (!el) return;
    el.style.display = 'none';
  }

  /* 7. Bloque de información — ocultar grupos vacíos */
  const infoSection = document.getElementById('info');
  const infoLayout = infoSection ? infoSection.querySelector('.info__layout') : null;
  const infoData = infoSection ? infoSection.querySelector('.info__data') : null;
  const infoMap = infoSection ? infoSection.querySelector('.info__map') : null;
  const mapBtn = infoSection ? infoSection.querySelector('.info__btn-map') : null;

  if (infoSection && infoData) {
    const groups = infoData.querySelectorAll('.info__group');

    groups.forEach(group => {
      const textEl = group.querySelector('.info__group-text');
      if (!textEl) return;

      const rawText = textEl.textContent.replace(/\s+/g, ' ').trim();
      if (
        isMissing(rawText) ||
        rawText === '' ||
        rawText === '<br>' ||
        rawText === '—'
      ) {
        hideElement(group);
      }
    });

    /* Dirección específica */
    const direccionText = infoData.querySelector('.info__group:nth-child(1) .info__group-text');
    if (direccionText) {
      const direccionRaw = direccionText.innerHTML
        .replace(/<br\s*\/?>/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (isMissing(direccionRaw) || direccionRaw === '') {
        hideElement(infoData.querySelector('.info__group:nth-child(1)'));
      }
    }

    /* Horario específico */
    const horarioText = infoData.querySelector('.info__group:nth-child(2) .info__group-text');
    if (horarioText) {
      const horarioRaw = horarioText.textContent.replace(/\s+/g, ' ').trim();
      if (isMissing(horarioRaw) || horarioRaw === '') {
        hideElement(infoData.querySelector('.info__group:nth-child(2)'));
      }
    }

    /* Contacto: ocultar enlaces vacíos */
    const contactoGroup = infoData.querySelector('.info__group:nth-child(3)');
    if (contactoGroup) {
      const contactLinks = contactoGroup.querySelectorAll('.info__contact-link');
      let visibleLinks = 0;

      contactLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        const text = link.textContent.replace(/\s+/g, ' ').trim();

        if (
          isMissing(href) ||
          href.includes('{{') ||
          isMissing(text) ||
          text === 'WhatsApp' ||
          text === 'mailto:' ||
          text === 'tel:'
        ) {
          hideElement(link);
        } else {
          visibleLinks++;
        }
      });

      if (visibleLinks === 0) {
        hideElement(contactoGroup);
      }
    }

    /* Botón mapa */
    if (mapBtn) {
      const mapHref = mapBtn.getAttribute('href') || '';
      if (isMissing(mapHref) || mapHref.includes('{{')) {
        hideElement(mapBtn);
      }
    }

    /* Iframe / mapa embebido */
    if (infoMap) {
      const mapHtml = infoMap.innerHTML.replace(/\s+/g, ' ').trim();
      if (
        isMissing(mapHtml) ||
        mapHtml.includes('{{MAP_EMBED}}') ||
        mapHtml === ''
      ) {
        hideElement(infoMap);
      }
    }

    /* Si no hay mapa, ajustar layout */
    const mapVisible = infoMap && infoMap.style.display !== 'none';
    if (infoLayout && !mapVisible) {
      infoLayout.style.gridTemplateColumns = '1fr';
      if (infoData) infoData.style.maxWidth = '760px';
    }

    /* Si no queda nada visible en el bloque izquierdo, ocultar toda la sección */
    const visibleGroups = Array.from(infoData.querySelectorAll('.info__group'))
      .filter(el => el.style.display !== 'none');

    const mapButtonVisible = mapBtn && mapBtn.style.display !== 'none';
    const mapStillVisible = infoMap && infoMap.style.display !== 'none';

    if (visibleGroups.length === 0 && !mapButtonVisible && !mapStillVisible) {
      hideElement(infoSection);
    }
  }

  /* 8. Footer — ocultar redes vacías */
  const socialWrap = document.querySelector('.footer__social');
  if (socialWrap) {
    const socialLinks = socialWrap.querySelectorAll('.footer__social-link');
    let visibleSocials = 0;

    socialLinks.forEach(link => {
      const href = link.getAttribute('href') || '';
      if (isMissing(href) || href.includes('{{')) {
        hideElement(link);
      } else {
        visibleSocials++;
      }
    });

    if (visibleSocials === 0) {
      hideElement(socialWrap);
    }
  }

  /* 9. Footer — ocultar dirección corta si no existe */
  const footerDetails = document.querySelector('.footer__details');
  if (footerDetails) {
    const detailItems = footerDetails.querySelectorAll('p');

    detailItems.forEach(item => {
      const text = item.textContent.replace(/\s+/g, ' ').trim();
      if (isMissing(text) || text === '') {
        hideElement(item);
      }
    });

    const visibleDetails = Array.from(detailItems).filter(el => el.style.display !== 'none');
    if (visibleDetails.length === 0) {
      hideElement(footerDetails);
    }
  }

  /* 10. Footer — si no hay redes, ajustar grilla */
  const footerTop = document.querySelector('.footer__top');
  if (footerTop && socialWrap && socialWrap.style.display === 'none') {
    if (window.innerWidth > 900) {
      footerTop.style.gridTemplateColumns = '1fr 1fr';
    }
  }

});
