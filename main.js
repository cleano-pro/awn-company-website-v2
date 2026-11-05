const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const menuClose = document.querySelector('.menu-close');
const menuLinks = document.querySelectorAll('.mobile-menu a');

function setMenu(open) {
  if (!mobileMenu || !menuToggle) return;
  mobileMenu.classList.toggle('open', open);
  mobileMenu.setAttribute('aria-hidden', String(!open));
  menuToggle.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
}

menuToggle?.addEventListener('click', () => setMenu(true));
menuClose?.addEventListener('click', () => setMenu(false));
menuLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

document.querySelector('#year').textContent = new Date().getFullYear();

const form = document.querySelector('#feedback-form');
const status = document.querySelector('#form-status');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const required = ['name', 'contact', 'type', 'message'];
  const missing = required.some((field) => !String(data.get(field) || '').trim());
  status.classList.remove('error');
  if (missing) {
    status.classList.add('error');
    status.textContent = 'يرجى إكمال الحقول المطلوبة قبل الإرسال.';
    return;
  }
  status.textContent = 'شكرًا لك. وصلت رسالتك إلى نموذج عَون التجريبي، وسيتم ربط الإرسال بقناة التواصل الرسمية عند اعتمادها.';
  form.reset();
});

const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  header?.classList.toggle('scrolled', window.scrollY > 22);
}, { passive: true });
