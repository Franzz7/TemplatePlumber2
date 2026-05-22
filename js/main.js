'use strict';

/*
 * main.js — Halden & Co. Plumbing
 *
 * initFadeIn()          Scroll-triggered fade-in via IntersectionObserver
 * initMobileNav()       Burger toggle, outside-click close, nav link close
 * initFormValidation()  Required-field validation, CSS error states, success message
 */

/* === ANIMATIONS === */

function initFadeIn() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('on');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.07, rootMargin: '0px 0px -32px 0px' }
  );

  document.querySelectorAll('.fi').forEach((el) => {
    const siblings = el.parentElement.querySelectorAll('.fi');
    if (siblings.length > 1) {
      const idx = Array.from(siblings).indexOf(el);
      el.style.transitionDelay = `${idx * 70}ms`;
    }
    observer.observe(el);
  });
}

/* === NAVIGATION === */

function initMobileNav() {
  const nav    = document.getElementById('mobile-nav');
  const burger = document.querySelector('.nav__burger');
  const close  = document.querySelector('.mobile-nav__close');
  const links  = document.querySelectorAll('.mobile-nav__links a');

  function openNav() {
    nav.classList.add('mobile-nav--open');
    burger.setAttribute('aria-expanded', 'true');
  }

  function closeNav() {
    nav.classList.remove('mobile-nav--open');
    burger.setAttribute('aria-expanded', 'false');
  }

  burger.addEventListener('click', openNav);
  close.addEventListener('click', closeNav);
  links.forEach((link) => link.addEventListener('click', closeNav));

  nav.addEventListener('click', (e) => {
    if (e.target === nav) closeNav();
  });
}

/* === FORM HANDLING === */

function validateField(field) {
  const group   = field.closest('.form-group');
  const errorEl = group ? group.querySelector('.form-error') : null;
  const valid   = field.value.trim().length > 0;

  field.classList.toggle('form-input--error', !valid);
  if (errorEl) errorEl.textContent = valid ? '' : 'This field is required';

  return valid;
}

function initFormValidation() {
  const form      = document.getElementById('contact-form');
  const successEl = document.getElementById('form-success');
  if (!form || !successEl) return;

  form.querySelectorAll('[required]').forEach((field) => {
    field.addEventListener('input', () => validateField(field));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const required = Array.from(form.querySelectorAll('[required]'));
    const allValid = required.map(validateField).every(Boolean);

    if (allValid) {
      const data = Object.fromEntries(new FormData(form));
      console.log('Project enquiry submitted:', data);
      form.hidden      = true;
      successEl.hidden = false;
    }
  });
}

/* === INIT === */

document.addEventListener('DOMContentLoaded', () => {
  initFadeIn();
  initMobileNav();
  initFormValidation();
});
