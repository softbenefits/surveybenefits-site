const params = new URLSearchParams(window.location.search);
const body = document.body;

if (params.get('tenant') === 'horizon') body.classList.add('tenant');
if (params.get('theme') === 'dark') body.classList.add('dark');
if (params.get('mode') === 'impersonation') body.classList.add('impersonating');

document.querySelectorAll('[data-toggle-sidebar]').forEach(button => {
  button.addEventListener('click', () => {
    const shell = document.querySelector('.app-shell');
    const sidebar = document.querySelector('.sidebar');
    if (window.matchMedia('(max-width: 900px)').matches) {
      sidebar?.classList.toggle('open');
      button.setAttribute('aria-expanded', String(sidebar?.classList.contains('open')));
      return;
    }
    shell?.classList.toggle('collapsed');
    button.setAttribute('aria-expanded', String(!shell?.classList.contains('collapsed')));
  });
});

document.querySelectorAll('form[data-prototype]').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    const notice = form.querySelector('[role="status"]');
    if (notice) notice.hidden = false;
  });
});

document.querySelectorAll('[data-password-toggle]').forEach(button => {
  button.addEventListener('click', () => {
    const input = button.closest('.password-control')?.querySelector('[data-password-input]');
    if (!input) return;

    const shouldShow = input.type === 'password';
    input.type = shouldShow ? 'text' : 'password';
    button.setAttribute('aria-pressed', String(shouldShow));
    button.setAttribute('aria-label', shouldShow ? 'Ocultar password' : 'Mostrar password');
    input.focus({ preventScroll: true });
  });
});

document.querySelectorAll('[data-theme-toggle]').forEach(button => {
  button.addEventListener('click', () => body.classList.toggle('dark'));
});

document.querySelectorAll('[data-year]').forEach(element => element.textContent = new Date().getFullYear());
