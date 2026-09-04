const params = new URLSearchParams(window.location.search);
const body = document.body;

if (params.get('tenant') === 'horizon') body.classList.add('tenant');
if (params.get('theme') === 'dark') body.classList.add('dark');
if (params.get('mode') === 'impersonation') body.classList.add('impersonating');

const sidebarToggleButtons = document.querySelectorAll('[data-toggle-sidebar]');

function setSidebarOpen(isOpen) {
  const shell = document.querySelector('.app-frame');
  const sidebar = document.querySelector('.sidebar');
  sidebar?.classList.toggle('open', isOpen);
  shell?.classList.toggle('menu-movel-aberto', isOpen);
  sidebarToggleButtons.forEach(toggle => {
    toggle.setAttribute('aria-expanded', String(isOpen));
    if (toggle.classList.contains('alternar-menu')) toggle.textContent = isOpen ? '×' : '☰';
  });
}

sidebarToggleButtons.forEach(button => {
  button.addEventListener('click', () => {
    const shell = document.querySelector('.app-frame');
    const sidebar = document.querySelector('.sidebar');
    if (window.matchMedia('(max-width: 900px)').matches) {
      setSidebarOpen(!(sidebar?.classList.contains('open') ?? false));
      return;
    }
    shell?.classList.toggle('menu-recolhido');
    button.setAttribute('aria-expanded', String(!shell?.classList.contains('menu-recolhido')));
  });
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && window.matchMedia('(max-width: 900px)').matches) setSidebarOpen(false);
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

document.querySelectorAll('[data-fullscreen-toggle]').forEach(button => {
  const updateLabel = () => {
    const fullscreen = Boolean(document.fullscreenElement);
    button.setAttribute('aria-label', fullscreen ? 'Sair de ecrã inteiro' : 'Maximizar ecrã');
    button.setAttribute('title', fullscreen ? 'Sair de ecrã inteiro' : 'Maximizar ecrã');
  };

  button.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      updateLabel();
    }
  });

  document.addEventListener('fullscreenchange', updateLabel);
  updateLabel();
});

document.querySelectorAll('[data-year]').forEach(element => element.textContent = new Date().getFullYear());
