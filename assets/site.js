const params = new URLSearchParams(window.location.search);
const body = document.body;
const appearanceStorageKey = 'surveybenefits.appearance';
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
const isAuthenticatedShell = Boolean(document.querySelector('.app-frame'));

if (params.get('tenant') === 'horizon') body.classList.add('tenant');
if (params.get('mode') === 'impersonation') body.classList.add('impersonating');

function getAppearance() { return localStorage.getItem(appearanceStorageKey) || 'system'; }
function appearanceLabel(value) { return { system: 'Sistema', light: 'Claro', dark: 'Escuro' }[value] || 'Sistema'; }
function effectiveDark(value) { return value === 'dark' || (value === 'system' && systemTheme.matches); }

function showToast(message, type = 'success') {
  let region = document.querySelector('[data-toast-region]');
  if (!region) {
    region = document.createElement('div');
    region.className = 'toast-region';
    region.dataset.toastRegion = '';
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    body.append(region);
  }
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'status');
  toast.textContent = message;
  region.append(toast);
  window.setTimeout(() => toast.remove(), 4200);
}

function applyAppearance(value, announce = false) {
  const appearance = ['system', 'light', 'dark'].includes(value) ? value : 'system';
  localStorage.setItem(appearanceStorageKey, appearance);
  body.classList.toggle('dark', effectiveDark(appearance));
  body.dataset.appearance = appearance;
  document.querySelectorAll('[data-appearance-current]').forEach(element => element.textContent = appearanceLabel(appearance));
  document.querySelectorAll('[data-appearance-option]').forEach(input => { input.checked = input.value === appearance; });
  if (announce) {
    const message = appearance === 'system' ? 'Aparência definida pelo sistema.' : `Aparência alterada para ${appearance === 'dark' ? 'escuro' : 'claro'}.`;
    showToast(message);
  }
}

if (isAuthenticatedShell) {
  applyAppearance(getAppearance());
  systemTheme.addEventListener?.('change', () => { if (getAppearance() === 'system') applyAppearance('system'); });
}

function accountMenuMarkup() {
  return `<div class="menu-conta" data-account-menu hidden>
    <div class="menu-conta-cabecalho"><span class="avatar">RM</span><span><strong>Rui Martins</strong><small class="platform-name">Administrador da Plataforma</small><small class="tenant-name">Administrador do Tenant</small></span></div>
    <div class="menu-conta-separador"></div>
    <button class="menu-conta-item menu-aparencia" type="button" data-appearance-menu aria-expanded="false"><span><strong>Aparência</strong><small data-appearance-current></small></span><span aria-hidden="true">›</span></button>
    <div class="submenu-aparencia" data-appearance-submenu hidden>
      <label><input type="radio" name="appearance-menu" value="system" data-appearance-option> Sistema</label>
      <label><input type="radio" name="appearance-menu" value="light" data-appearance-option> Claro</label>
      <label><input type="radio" name="appearance-menu" value="dark" data-appearance-option> Escuro</label>
    </div>
    <a class="menu-conta-item" href="definicoes-pessoais.html${window.location.search}"><span>Definições pessoais</span></a>
    <div class="menu-conta-separador"></div>
    <a class="menu-conta-item menu-logout" href="login.html"><span>Terminar sessão</span></a>
  </div>`;
}

document.querySelectorAll('.conta').forEach(account => {
  const toggle = account.querySelector('.botao-conta');
  if (!toggle) return;
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-haspopup', 'true');
  account.insertAdjacentHTML('beforeend', accountMenuMarkup());
  const menu = account.querySelector('[data-account-menu]');
  const appearanceButton = account.querySelector('[data-appearance-menu]');
  const appearanceSubmenu = account.querySelector('[data-appearance-submenu]');
  applyAppearance(getAppearance());
  const closeMenu = () => {
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    appearanceSubmenu.hidden = true;
    appearanceButton.setAttribute('aria-expanded', 'false');
  };
  toggle.addEventListener('click', event => {
    event.stopPropagation();
    const opening = menu.hidden;
    document.querySelectorAll('[data-account-menu]').forEach(other => { if (other !== menu) other.hidden = true; });
    menu.hidden = !opening;
    toggle.setAttribute('aria-expanded', String(opening));
  });
  appearanceButton.addEventListener('click', () => {
    const opening = appearanceSubmenu.hidden;
    appearanceSubmenu.hidden = !opening;
    appearanceButton.setAttribute('aria-expanded', String(opening));
  });
  document.addEventListener('click', event => { if (!account.contains(event.target)) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
});

document.querySelectorAll('[data-appearance-option]').forEach(input => input.addEventListener('change', () => { if (input.checked) applyAppearance(input.value, true); }));

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
sidebarToggleButtons.forEach(button => button.addEventListener('click', () => {
  const shell = document.querySelector('.app-frame');
  const sidebar = document.querySelector('.sidebar');
  if (window.matchMedia('(max-width: 900px)').matches) { setSidebarOpen(!(sidebar?.classList.contains('open') ?? false)); return; }
  shell?.classList.toggle('menu-recolhido');
  button.setAttribute('aria-expanded', String(!shell?.classList.contains('menu-recolhido')));
}));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && window.matchMedia('(max-width: 900px)').matches) setSidebarOpen(false); });

document.querySelectorAll('form[data-prototype]').forEach(form => form.addEventListener('submit', event => {
  event.preventDefault();
  const notice = form.querySelector('[role="status"]');
  if (notice) notice.hidden = false;
}));

document.querySelectorAll('[data-profile-form]').forEach(form => form.addEventListener('submit', event => {
  event.preventDefault();
  let valid = true;
  ['firstName', 'lastName'].forEach(name => {
    const input = form.elements[name];
    const error = form.querySelector(`[data-error-for="${name}"]`);
    const invalid = !input.value.trim();
    input.setAttribute('aria-invalid', String(invalid));
    if (error) error.hidden = !invalid;
    valid &&= !invalid;
  });
  if (!valid) { showToast('Reveja os dados pessoais indicados.', 'error'); return; }
  showToast('Dados pessoais atualizados.');
}));

document.querySelectorAll('[data-password-form]').forEach(form => form.addEventListener('submit', event => {
  event.preventDefault();
  const errors = {
    currentPassword: !form.elements.currentPassword.value ? 'Indique a password atual.' : '',
    newPassword: form.elements.newPassword.value.length < 8 ? 'A nova password deve ter pelo menos 8 caracteres.' : '',
    confirmPassword: form.elements.confirmPassword.value !== form.elements.newPassword.value ? 'A confirmação não coincide com a nova password.' : ''
  };
  Object.entries(errors).forEach(([name, message]) => {
    const input = form.elements[name];
    const error = form.querySelector(`[data-error-for="${name}"]`);
    input.setAttribute('aria-invalid', String(Boolean(message)));
    if (error) { error.textContent = message; error.hidden = !message; }
  });
  if (Object.values(errors).some(Boolean)) { showToast('Não foi possível alterar a palavra-passe.', 'error'); return; }
  form.reset();
  showToast('Palavra-passe alterada.');
}));

document.querySelectorAll('[data-avatar-input]').forEach(input => input.addEventListener('change', () => {
  const file = input.files?.[0];
  const preview = document.querySelector('[data-avatar-preview]');
  if (!file || !preview) return;
  const reader = new FileReader();
  reader.addEventListener('load', () => { preview.style.backgroundImage = `url("${reader.result}")`; preview.textContent = ''; preview.classList.add('avatar-image'); });
  reader.readAsDataURL(file);
}));
document.querySelectorAll('[data-avatar-trigger]').forEach(button => button.addEventListener('click', () => document.querySelector('[data-avatar-input]')?.click()));

document.querySelectorAll('[data-password-toggle]').forEach(button => button.addEventListener('click', () => {
  const input = button.closest('.password-control')?.querySelector('[data-password-input]');
  if (!input) return;
  const shouldShow = input.type === 'password';
  input.type = shouldShow ? 'text' : 'password';
  button.setAttribute('aria-pressed', String(shouldShow));
  button.setAttribute('aria-label', shouldShow ? 'Ocultar password' : 'Mostrar password');
}));

document.querySelectorAll('[data-fullscreen-toggle]').forEach(button => {
  const updateLabel = () => { const fullscreen = Boolean(document.fullscreenElement); button.setAttribute('aria-label', fullscreen ? 'Sair de ecrã inteiro' : 'Maximizar ecrã'); button.setAttribute('title', fullscreen ? 'Sair de ecrã inteiro' : 'Maximizar ecrã'); };
  button.addEventListener('click', async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); } catch { updateLabel(); } });
  document.addEventListener('fullscreenchange', updateLabel);
  updateLabel();
});
document.querySelectorAll('[data-year]').forEach(element => element.textContent = new Date().getFullYear());
