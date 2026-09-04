const params = new URLSearchParams(window.location.search);
const body = document.body;

if (params.get('tenant') === 'horizon') body.classList.add('tenant');
if (params.get('theme') === 'dark') body.classList.add('dark');
if (params.get('mode') === 'impersonation') body.classList.add('impersonating');

document.querySelectorAll('[data-toggle-menu]').forEach(button => {
  button.addEventListener('click', () => document.querySelector('.sidebar')?.classList.toggle('open'));
});

document.querySelectorAll('form[data-prototype]').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    const notice = form.querySelector('[role="status"]');
    if (notice) notice.hidden = false;
  });
});

document.querySelectorAll('[data-theme-toggle]').forEach(button => {
  button.addEventListener('click', () => body.classList.toggle('dark'));
});

document.querySelectorAll('[data-year]').forEach(element => element.textContent = new Date().getFullYear());
