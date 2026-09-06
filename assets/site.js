const params = new URLSearchParams(window.location.search);
const body = document.body;
const appearanceStorageKey = 'surveybenefits.appearance';
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
const isAuthenticatedShell = Boolean(document.querySelector('.app-frame'));
const isFormOwnerDemo = params.get('role') === 'owner';

if (params.get('tenant') === 'horizon') body.classList.add('tenant');
if (params.get('mode') === 'impersonation') body.classList.add('impersonating');
if (isFormOwnerDemo) document.querySelectorAll('.botao-conta .identidade small').forEach(label => { label.textContent = 'Responsável por Questionários'; });

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
    <div class="menu-conta-cabecalho"><span class="avatar">RM</span><span><strong>Rui Martins</strong><small class="menu-email">rui.martins@softbenefits.pt</small><small class="menu-role platform-name">Administrador da Plataforma</small><small class="menu-role tenant-name">${isFormOwnerDemo ? 'Responsável por Questionários' : 'Administrador do Tenant'}</small></span></div>
    <div class="menu-conta-separador"></div>
    <button class="menu-conta-item menu-aparencia" type="button" data-appearance-menu aria-expanded="false"><span><i aria-hidden="true">◐</i><strong>Aparência</strong></span><b data-appearance-current></b></button>
    <div class="submenu-aparencia" data-appearance-submenu hidden>
      <label><input type="radio" name="appearance-menu" value="system" data-appearance-option><span>Sistema</span></label>
      <label><input type="radio" name="appearance-menu" value="light" data-appearance-option><span>Claro</span></label>
      <label><input type="radio" name="appearance-menu" value="dark" data-appearance-option><span>Escuro</span></label>
    </div>
    <a class="menu-conta-item" href="definicoes-pessoais.html${window.location.search}"><span><i aria-hidden="true">⚙</i>Definições pessoais</span></a>
    <div class="menu-conta-separador"></div>
    <a class="menu-conta-item menu-logout" href="login.html"><span><i aria-hidden="true">↪</i>Terminar sessão</span></a>
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

if (isFormOwnerDemo) {
  document.querySelectorAll('a[href^="questionario"]').forEach(anchor => {
    const target = new URL(anchor.href);
    target.searchParams.set('role', 'owner');
    anchor.href = target.href;
  });
}

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

const questionnaireList = document.querySelector('[data-questionnaire-list]');
if (questionnaireList) {
  const listContent = questionnaireList.querySelector('[data-list-content]');
  const listFooter = questionnaireList.querySelector('[data-list-footer]');
  const search = questionnaireList.querySelector('[data-questionnaire-search]');
  const resultCount = questionnaireList.querySelector('[data-result-count]');
  const rows = [...questionnaireList.querySelectorAll('[data-questionnaire-row]')];
  const states = [...questionnaireList.querySelectorAll('[data-list-state]')];

  function showQuestionnaireState(name) {
    const showList = !name;
    listContent.hidden = !showList;
    listFooter.hidden = !showList;
    states.forEach(state => { state.hidden = state.dataset.listState !== name; });
  }

  const requestedState = params.get('state');
  if (['empty', 'no-results', 'loading', 'error', 'forbidden'].includes(requestedState)) {
    showQuestionnaireState(requestedState);
  }

  search?.addEventListener('input', () => {
    const term = search.value.trim().toLocaleLowerCase('pt-PT');
    let visible = 0;
    rows.forEach(row => {
      const matches = row.dataset.title.includes(term);
      row.hidden = !matches;
      if (matches) visible += 1;
    });
    if (resultCount) resultCount.textContent = `${visible} ${visible === 1 ? 'questionário' : 'questionários'}`;
    showQuestionnaireState(visible === 0 ? 'no-results' : '');
  });

  questionnaireList.querySelector('[data-clear-search]')?.addEventListener('click', () => {
    if (!search) return;
    search.value = '';
    rows.forEach(row => { row.hidden = false; });
    if (resultCount) resultCount.textContent = '3 questionários';
    showQuestionnaireState('');
    search.focus();
  });

  const toast = params.get('toast');
  if (toast === 'created') showToast('Questionário criado.');
  if (toast === 'updated') showToast('Questionário atualizado.');
}

const questionnaireForm = document.querySelector('[data-questionnaire-form]');
if (questionnaireForm) {
  const titleInput = questionnaireForm.querySelector('[data-questionnaire-title]');
  const descriptionInput = questionnaireForm.querySelector('[data-questionnaire-description]');
  const titleCount = questionnaireForm.querySelector('[data-title-count]');
  const descriptionCount = questionnaireForm.querySelector('[data-description-count]');
  const questionnaireId = params.get('id');
  const examples = {
    '1': ['Experiência de integração', 'Avaliação do processo de acolhimento.'],
    '2': ['Clima organizacional', 'Questionário interno para as equipas.'],
    '3': ['Avaliação de formação', 'Recolha posterior a cada sessão.']
  };

  if (questionnaireId && examples[questionnaireId]) {
    titleInput.value = examples[questionnaireId][0];
    descriptionInput.value = examples[questionnaireId][1];
    document.querySelector('[data-form-title]').textContent = 'Editar questionário';
    document.querySelector('[data-form-breadcrumb]').textContent = 'Editar';
    questionnaireForm.querySelector('[data-form-submit]').textContent = 'Guardar alterações';
    document.title = 'Editar questionário — SurveyBenefits';
  }

  const updateCounters = () => {
    titleCount.textContent = titleInput.value.length;
    descriptionCount.textContent = descriptionInput.value.length;
  };
  titleInput.addEventListener('input', updateCounters);
  descriptionInput.addEventListener('input', updateCounters);
  updateCounters();

  questionnaireForm.addEventListener('submit', event => {
    event.preventDefault();
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const errors = {
      title: title.length === 0
        ? 'Indique o nome do questionário.'
        : title.length < 3
          ? 'O nome deve ter pelo menos 3 caracteres.'
          : title.length > 150
            ? 'O nome não pode exceder 150 caracteres.'
            : '',
      description: description.length > 1000
        ? 'As observações não podem exceder 1000 caracteres.'
        : ''
    };

    Object.entries(errors).forEach(([name, message]) => {
      const input = questionnaireForm.elements[name];
      const error = questionnaireForm.querySelector(`[data-error-for="${name}"]`);
      input.setAttribute('aria-invalid', String(Boolean(message)));
      error.textContent = message;
      error.hidden = !message;
    });

    if (Object.values(errors).some(Boolean)) {
      showToast('Reveja os dados do questionário.', 'error');
      questionnaireForm.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    window.location.href = `questionarios.html?tenant=horizon${isFormOwnerDemo ? '&role=owner' : ''}&toast=${questionnaireId ? 'updated' : 'created'}`;
  });
}

document.querySelectorAll('[data-fullscreen-toggle]').forEach(button => {
  const updateLabel = () => { const fullscreen = Boolean(document.fullscreenElement); button.setAttribute('aria-label', fullscreen ? 'Sair de ecrã inteiro' : 'Maximizar ecrã'); button.setAttribute('title', fullscreen ? 'Sair de ecrã inteiro' : 'Maximizar ecrã'); };
  button.addEventListener('click', async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); } catch { updateLabel(); } });
  document.addEventListener('fullscreenchange', updateLabel);
  updateLabel();
});
document.querySelectorAll('[data-year]').forEach(element => element.textContent = new Date().getFullYear());
