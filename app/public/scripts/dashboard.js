const sidebar = document.querySelector('#sidebar');
const userChip = document.querySelector('#dashboardUser');
const toggleButton = document.querySelector('[data-action="toggle-menu"]');
const dashboardDate = document.querySelector('#dashboardDate');
const dashboardType = document.querySelector('#dashboardType');
const dashboardAsset = document.querySelector('#dashboardAsset');
const agendaTitle = document.querySelector('#agendaTitle');
const agendaCount = document.querySelector('#agendaCount');
const timelineTitle = document.querySelector('#timelineTitle');
const timelineList = document.querySelector('#timelineList');
const dayReservations = document.querySelector('#dayReservations');
const dashboardStatus = document.querySelector('#dashboardStatus');
const quickReservationModal = document.querySelector('#quickReservationModal');
const quickReservationForm = document.querySelector('#quickReservationForm');
const quickReservationStatus = document.querySelector('#quickReservationStatus');
const dashboardConfirmModal = document.querySelector('#dashboardConfirmModal');
const dashboardConfirmTitle = document.querySelector('#dashboardConfirmTitle');
const dashboardConfirmMessage = document.querySelector('#dashboardConfirmMessage');
const dashboardConfirmButton = document.querySelector('[data-action="confirm-dashboard-action"]');
const dashboardCancelConfirmButton = document.querySelector('[data-action="cancel-dashboard-confirm"]');
const pendingUsersAlert = document.querySelector('#pendingUsersAlert');
const pendingUsersMessage = document.querySelector('#pendingUsersMessage');
const pendingUsersCount = document.querySelector('#pendingUsersCount');

let dashboardCurrentUser = null;
let dashboardOptions = { assets: [], times: [] };
let dashboardReservations = [];
let pendingDashboardConfirmation = null;
let pendingUsersAlertClosed = false;
let notificationsPanel = null;
let notificationsBadge = null;
let notificationsList = null;
let notificationsStatus = null;
let notificationsOpen = false;
let notificationsTimer = null;

async function loadSession() {
  const response = await fetch('/api/session');

  if (!response.ok) {
    window.location.href = '/';
    return;
  }

  const data = await response.json();
  dashboardCurrentUser = data.user;
  renderTopbarUser(data.user);

  if (data.user.nivelAcesso !== 'master') {
    document.body.classList.remove('is-master');
    document.querySelectorAll('[data-master-only]').forEach((item) => {
      item.hidden = true;
    });
  } else {
    document.body.classList.add('is-master');
    document.querySelectorAll('[data-master-only]').forEach((item) => {
      item.hidden = false;
    });
    document.querySelectorAll('[data-home-link]').forEach((item) => {
      item.href = '/dashboard';
      if (window.location.pathname === '/minhas-reservas') {
        item.classList.remove('is-active');
        item.removeAttribute('aria-current');
      }
    });
    await refreshPendingUsersNotification();
  }

  if (dashboardDate) {
    await initDashboardAgenda();
  }
}

function renderTopbarUser(user) {
  userChip.textContent = user.nome;

  if (document.querySelector('[data-action="topbar-logout"]')) {
    return;
  }

  const actions = document.createElement('div');
  actions.className = 'topbar-actions';
  userChip.parentNode.insertBefore(actions, userChip);
  actions.appendChild(userChip);

  const logoutButton = document.createElement('button');
  logoutButton.className = 'secondary compact icon-text topbar-logout';
  logoutButton.type = 'button';
  logoutButton.dataset.action = 'topbar-logout';
  logoutButton.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <path d="M16 17l5-5-5-5"></path>
      <path d="M21 12H9"></path>
    </svg>
    <span>Sair</span>
  `;
  logoutButton.addEventListener('click', logout);
  actions.appendChild(logoutButton);
  mountNotifications(actions);
}

function notificationIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg>
  `;
}

function mountNotifications(actions) {
  if (document.querySelector('[data-action="toggle-notifications"]')) {
    return;
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'notifications';
  wrapper.innerHTML = `
    <button class="icon-button notification-button" type="button" data-action="toggle-notifications" aria-label="Abrir notificacoes" aria-expanded="false">
      ${notificationIcon()}
      <span class="notification-badge" id="notificationBadge" hidden>0</span>
    </button>
    <section class="notification-panel" id="notificationPanel" aria-label="Notificacoes" hidden>
      <header class="notification-panel-header">
        <div>
          <p class="eyebrow">Central</p>
          <h2>Notificacoes</h2>
        </div>
        <button class="secondary compact" type="button" data-action="mark-all-notifications">Marcar todas</button>
      </header>
      <div class="notification-filters">
        <select id="notificationTypeFilter" aria-label="Filtrar por tipo">
          <option value="">Todos os tipos</option>
          <option value="cadastro_aprovado">Cadastro aprovado</option>
          <option value="cadastro_rejeitado">Cadastro rejeitado</option>
          <option value="reserva_realizada">Reserva realizada</option>
          <option value="reserva_aprovada">Reserva aprovada</option>
          <option value="reserva_alterada">Reserva alterada</option>
          <option value="reserva_cancelada">Reserva cancelada</option>
        </select>
        <select id="notificationReadFilter" aria-label="Filtrar por leitura">
          <option value="">Todas</option>
          <option value="false">Nao lidas</option>
          <option value="true">Lidas</option>
        </select>
      </div>
      <div class="notification-list" id="notificationList"></div>
      <p class="status notification-status" id="notificationStatus" role="status"></p>
    </section>
  `;

  actions.insertBefore(wrapper, userChip);
  notificationsPanel = wrapper.querySelector('#notificationPanel');
  notificationsBadge = wrapper.querySelector('#notificationBadge');
  notificationsList = wrapper.querySelector('#notificationList');
  notificationsStatus = wrapper.querySelector('#notificationStatus');

  wrapper.querySelector('[data-action="toggle-notifications"]').addEventListener('click', toggleNotifications);
  wrapper.querySelector('[data-action="mark-all-notifications"]').addEventListener('click', markAllNotificationsRead);
  wrapper.querySelector('#notificationTypeFilter').addEventListener('change', loadNotifications);
  wrapper.querySelector('#notificationReadFilter').addEventListener('change', loadNotifications);
  notificationsList.addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-action="mark-notification"]');
    const link = event.target.closest('a[data-notification-id]');

    if (button) {
      await markNotificationRead(button.dataset.id);
      return;
    }

    if (link) {
      await markNotificationRead(link.dataset.notificationId);
    }
  });

  document.addEventListener('click', (event) => {
    if (notificationsOpen && !wrapper.contains(event.target)) {
      closeNotifications();
    }
  });

  refreshNotificationsCount();
  notificationsTimer = window.setInterval(refreshNotificationsCount, 60000);
}

function formatNotificationDate(value) {
  if (!value) {
    return '';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
}

function notificationTypeLabel(type) {
  const labels = {
    cadastro_aprovado: 'Cadastro aprovado',
    cadastro_rejeitado: 'Cadastro rejeitado',
    reserva_realizada: 'Reserva realizada',
    reserva_aprovada: 'Reserva aprovada',
    reserva_alterada: 'Reserva alterada',
    reserva_cancelada: 'Reserva cancelada'
  };

  return labels[type] || 'Notificacao';
}

function notificationTypeIcon(type) {
  if (type === 'cadastro_aprovado' || type === 'reserva_aprovada') {
    return '<path d="M20 6 9 17l-5-5"></path>';
  }

  if (type === 'cadastro_rejeitado' || type === 'reserva_cancelada') {
    return '<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>';
  }

  if (type === 'reserva_alterada') {
    return '<path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>';
  }

  return '<rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M16 2v4"></path><path d="M8 2v4"></path><path d="M3 10h18"></path>';
}

function renderNotification(notification) {
  const unreadText = notification.lida ? 'Lida' : 'Nao lida';
  const referenceLink = notification.referenciaTipo === 'reserva' && notification.referenciaId
    ? `<a class="text-link" href="/reservas" data-notification-id="${notification.id}">Ver reserva</a>`
    : '';

  return `
    <article class="notification-item ${notification.lida ? '' : 'is-unread'}">
      <span class="notification-type-icon ${notification.tipo}">
        <svg viewBox="0 0 24 24" aria-hidden="true">${notificationTypeIcon(notification.tipo)}</svg>
      </span>
      <div class="notification-copy">
        <div class="notification-title-row">
          <strong>${escapeHtml(notification.titulo)}</strong>
          <small>${unreadText}</small>
        </div>
        <p>${escapeHtml(notification.mensagem)}</p>
        <span>${notificationTypeLabel(notification.tipo)} - ${formatNotificationDate(notification.createdAt)}</span>
        <div class="notification-actions">
          ${referenceLink}
          ${notification.lida ? '' : `<button class="secondary compact" type="button" data-action="mark-notification" data-id="${notification.id}">Marcar como lida</button>`}
        </div>
      </div>
    </article>
  `;
}

async function refreshNotificationsCount() {
  if (!notificationsBadge) {
    return;
  }

  try {
    const data = await requestJson('/api/notificacoes/nao-lidas/quantidade');
    const quantity = Number(data.quantidade || 0);
    notificationsBadge.hidden = quantity <= 0;
    notificationsBadge.textContent = quantity > 99 ? '99+' : quantity;
    notificationsBadge.setAttribute('aria-label', `${quantity} notificacoes nao lidas`);
  } catch (error) {
    notificationsBadge.hidden = true;
  }
}

async function loadNotifications() {
  if (!notificationsList) {
    return;
  }

  notificationsStatus.textContent = 'Carregando notificacoes...';
  const typeFilter = document.querySelector('#notificationTypeFilter');
  const readFilter = document.querySelector('#notificationReadFilter');
  const query = new URLSearchParams({ limite: '10' });
  if (typeFilter && typeFilter.value) {
    query.set('tipo', typeFilter.value);
  }
  if (readFilter && readFilter.value) {
    query.set('lida', readFilter.value);
  }

  try {
    const data = await requestJson(`/api/notificacoes?${query.toString()}`);
    if (!data.notificacoes || data.notificacoes.length === 0) {
      notificationsList.innerHTML = '<p class="muted notification-empty">Nenhuma notificacao encontrada.</p>';
    } else {
      notificationsList.innerHTML = data.notificacoes.map(renderNotification).join('');
    }
    notificationsStatus.textContent = '';
  } catch (error) {
    notificationsStatus.textContent = 'Nao foi possivel carregar as notificacoes.';
    notificationsList.innerHTML = '';
  }
}

async function toggleNotifications(event) {
  event.stopPropagation();
  notificationsOpen = !notificationsOpen;
  notificationsPanel.hidden = !notificationsOpen;
  event.currentTarget.setAttribute('aria-expanded', String(notificationsOpen));
  if (notificationsOpen) {
    await loadNotifications();
  }
}

function closeNotifications() {
  notificationsOpen = false;
  notificationsPanel.hidden = true;
  const button = document.querySelector('[data-action="toggle-notifications"]');
  if (button) {
    button.setAttribute('aria-expanded', 'false');
  }
}

async function markNotificationRead(id) {
  await requestJson(`/api/notificacoes/${id}/lida`, { method: 'PATCH' });
  await loadNotifications();
  await refreshNotificationsCount();
}

async function markAllNotificationsRead() {
  await requestJson('/api/notificacoes/marcar-todas-como-lidas', { method: 'PATCH' });
  await loadNotifications();
  await refreshNotificationsCount();
}

window.refreshNotificationsCount = refreshNotificationsCount;

function findUsersNavItem() {
  return document.querySelector('.nav-item[href="/usuarios"]');
}

function pendingUsersText(quantity) {
  return quantity === 1
    ? 'Existe 1 usuario aguardando aprovacao.'
    : `Existem ${quantity} usuarios aguardando aprovacao.`;
}

function renderUsersMenuBadge(quantity) {
  const usersNavItem = findUsersNavItem();
  if (!usersNavItem) {
    return;
  }

  let badge = usersNavItem.querySelector('.nav-badge');
  if (quantity <= 0) {
    if (badge) {
      badge.remove();
    }
    usersNavItem.removeAttribute('aria-label');
    usersNavItem.href = '/usuarios';
    return;
  }

  if (!badge) {
    badge = document.createElement('span');
    badge.className = 'nav-badge';
    usersNavItem.appendChild(badge);
  }

  badge.textContent = quantity;
  badge.setAttribute('aria-label', `${quantity} usuarios pendentes`);
  usersNavItem.setAttribute('aria-label', `Usuarios, ${quantity} pendentes`);
  usersNavItem.href = '/usuarios?filtro=pendentes';
}

function renderPendingUsersAlert(quantity) {
  if (!pendingUsersAlert) {
    return;
  }

  if (quantity <= 0 || pendingUsersAlertClosed) {
    pendingUsersAlert.hidden = true;
    return;
  }

  pendingUsersMessage.textContent = pendingUsersText(quantity);
  pendingUsersCount.textContent = quantity;
  pendingUsersCount.setAttribute('aria-label', `${quantity} usuarios pendentes`);
  pendingUsersAlert.hidden = false;
}

async function refreshPendingUsersNotification() {
  if (!dashboardCurrentUser || dashboardCurrentUser.nivelAcesso !== 'master') {
    return;
  }

  try {
    const data = await requestJson('/api/admin/usuarios/pendentes/count');
    const quantity = Number(data.quantidade || 0);
    renderUsersMenuBadge(quantity);
    renderPendingUsersAlert(quantity);
  } catch (error) {
    if (dashboardStatus) {
      setDashboardStatus('Nao foi possivel atualizar as notificacoes.', 'error');
    }
  }
}

window.refreshPendingUsersNotification = refreshPendingUsersNotification;

async function logout() {
  if (notificationsTimer) {
    window.clearInterval(notificationsTimer);
  }
  await fetch('/api/logout', {
    method: 'POST'
  });
  window.location.href = '/';
}

toggleButton.addEventListener('click', () => {
  const collapsed = sidebar.classList.toggle('is-collapsed');
  toggleButton.setAttribute('aria-label', collapsed ? 'Mostrar menu' : 'Ocultar menu');
});

document.querySelector('[data-action="logout"]').addEventListener('click', logout);

loadSession();

function today() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDate(value) {
  const text = String(value || '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return '';
  }

  const [year, month, day] = text.split('-');
  return `${day}/${month}/${year}`;
}

function formatTime(value) {
  return String(value || '').slice(0, 5);
}

function setDashboardStatus(message, type = '') {
  dashboardStatus.className = type ? `status is-${type}` : 'status';
  dashboardStatus.textContent = message;
}

function setQuickStatus(message, type = '') {
  quickReservationStatus.className = type ? `status modal-status is-${type}` : 'status modal-status';
  quickReservationStatus.textContent = message;
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Nao foi possivel concluir a solicitacao.');
  }

  return data;
}

function askDashboardConfirmation({ title, message, actionText = 'Confirmar', danger = false }) {
  dashboardConfirmTitle.textContent = title;
  dashboardConfirmMessage.textContent = message;
  dashboardConfirmButton.textContent = actionText;
  dashboardConfirmButton.classList.toggle('danger-primary', danger);
  dashboardConfirmModal.showModal();

  return new Promise((resolve) => {
    pendingDashboardConfirmation = resolve;
  });
}

function resolveDashboardConfirmation(value) {
  if (pendingDashboardConfirmation) {
    pendingDashboardConfirmation(value);
    pendingDashboardConfirmation = null;
  }
  dashboardConfirmModal.close();
}

function assetTypeKey(asset) {
  return String(asset.tipo_id || asset.tipo || 'sem-tipo');
}

function assetTypes() {
  const seen = new Map();
  dashboardOptions.assets.forEach((asset) => {
    const key = assetTypeKey(asset);
    if (!seen.has(key)) {
      seen.set(key, { key, label: asset.tipo || 'Sem tipo' });
    }
  });

  return Array.from(seen.values()).sort((a, b) => a.label.localeCompare(b.label));
}

function selectedAsset() {
  return dashboardOptions.assets.find((asset) => String(asset.id) === String(dashboardAsset.value)) || null;
}

function selectedTime(id) {
  return dashboardOptions.times.find((time) => String(time.id) === String(id)) || null;
}

function isPastTime(time) {
  if (dashboardDate.value !== today()) {
    return dashboardDate.value < today();
  }

  const now = new Date();
  const current = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  return formatTime(time.hora_inicio) <= current;
}

function reservationByTime(timeId) {
  return dashboardReservations.find((reservation) => String(reservation.tempo_id) === String(timeId));
}

function canCancelReservation(reservation) {
  return dashboardCurrentUser
    && (dashboardCurrentUser.nivelAcesso === 'master' || Number(dashboardCurrentUser.id) === Number(reservation.usuario_id));
}

function renderTypeSelect() {
  const types = assetTypes();
  dashboardType.innerHTML = types.map((type) => `
    <option value="${escapeHtml(type.key)}">${escapeHtml(type.label)}</option>
  `).join('');
}

function renderAssetSelect(keepSelected = true) {
  const previousAsset = keepSelected ? dashboardAsset.value : '';
  const assets = dashboardOptions.assets.filter((asset) => assetTypeKey(asset) === dashboardType.value);
  dashboardAsset.innerHTML = assets.map((asset) => `
    <option value="${asset.id}">${escapeHtml(asset.identificador)}</option>
  `).join('');

  if (assets.some((asset) => String(asset.id) === String(previousAsset))) {
    dashboardAsset.value = previousAsset;
  } else if (assets.length > 0) {
    dashboardAsset.value = assets[0].id;
  }
}

function renderQuickUserSelect() {
  const select = quickReservationForm.elements.usuarioId;
  const users = dashboardOptions.users || [];
  select.innerHTML = users.map((user) => `
    <option value="${user.id}">${escapeHtml(user.nome)} - ${escapeHtml(user.email)}</option>
  `).join('');

  select.value = dashboardCurrentUser.id;
  select.disabled = dashboardCurrentUser.nivelAcesso !== 'master';
}

function renderReservationsList() {
  agendaTitle.textContent = `Agenda de ${formatDate(dashboardDate.value)}`;
  agendaCount.textContent = `${dashboardReservations.length} reserva(s)`;

  if (dashboardReservations.length === 0) {
    dayReservations.innerHTML = '<p class="muted">Nao existem reservas para o dia selecionado.</p>';
    return;
  }

  dayReservations.innerHTML = dashboardReservations.map((reservation) => `
    <article class="reservation-card">
      <strong>${escapeHtml(reservation.tempo)} (${formatTime(reservation.hora_inicio)} - ${formatTime(reservation.hora_fim)})</strong>
      <span>${escapeHtml(reservation.ativo)}</span>
      <small>${escapeHtml(reservation.usuario)}</small>
    </article>
  `).join('');
}

function renderTimeline() {
  const asset = selectedAsset();
  if (!asset) {
    timelineTitle.textContent = 'Selecione um ativo';
    timelineList.innerHTML = '<p class="muted">Nenhum ativo disponivel para o tipo selecionado.</p>';
    renderReservationsList();
    return;
  }

  timelineTitle.textContent = asset.identificador;
  timelineList.innerHTML = dashboardOptions.times.map((time) => {
    const reservation = reservationByTime(time.id);
    const past = isPastTime(time);
    const state = reservation ? 'reserved' : past ? 'past' : 'free';
    const stateLabel = reservation ? 'Reservado' : past ? 'Passado' : 'Livre';
    const cancelAction = reservation && canCancelReservation(reservation)
      ? '<button class="secondary compact danger-action" type="button" data-action="cancel-reservation" data-reservation-id="' + reservation.id + '">Cancelar</button>'
      : '';
    const action = reservation
      ? `<small>Responsavel: ${escapeHtml(reservation.usuario)}</small>${cancelAction}`
      : past
        ? '<small>Horario indisponivel</small>'
        : '<button class="secondary compact" type="button" data-action="quick-reserve" data-time-id="' + time.id + '">Reservar</button>';

    return `
      <div class="timeline-item ${state}">
        <div>
          <strong>${escapeHtml(time.identificador)}</strong>
          <span>${formatTime(time.hora_inicio)} - ${formatTime(time.hora_fim)}</span>
        </div>
        <div class="timeline-state">
          <span class="status-pill ${state === 'free' ? 'success-pill' : state === 'reserved' ? 'reserved-pill' : 'past-pill'}">${stateLabel}</span>
          ${action}
        </div>
      </div>
    `;
  }).join('');

  renderReservationsList();
}

async function loadDashboardReservations() {
  const asset = selectedAsset();
  if (!asset) {
    dashboardReservations = [];
    renderTimeline();
    return;
  }

  const query = new URLSearchParams({
    data: dashboardDate.value,
    ativoId: dashboardAsset.value,
    status: 'ativas'
  });
  const data = await requestJson(`/api/reservas?${query.toString()}`);
  dashboardReservations = data.reservations;
  renderTimeline();
}

async function initDashboardAgenda() {
  try {
    setDashboardStatus('Carregando agenda...');
    dashboardDate.value = today();
    dashboardDate.min = today();
    dashboardOptions = await requestJson('/api/reservas/opcoes');
    renderTypeSelect();
    renderAssetSelect(false);
    renderQuickUserSelect();
    await loadDashboardReservations();
    setDashboardStatus('');
  } catch (error) {
    setDashboardStatus(error.message, 'error');
  }
}

function openQuickReservation(timeId) {
  const asset = selectedAsset();
  const time = selectedTime(timeId);
  if (!asset || !time) {
    return;
  }

  quickReservationForm.elements.ativoId.value = asset.id;
  quickReservationForm.elements.tempoId.value = time.id;
  quickReservationForm.elements.dataReserva.value = dashboardDate.value;
  quickReservationForm.elements.ativoLabel.value = `${asset.identificador} - ${asset.tipo}`;
  quickReservationForm.elements.tempoLabel.value = `${time.identificador} (${formatTime(time.hora_inicio)} - ${formatTime(time.hora_fim)})`;
  setQuickStatus('');
  quickReservationModal.showModal();
}

async function saveQuickReservation() {
  setQuickStatus('');
  await requestJson('/api/reservas', {
    method: 'POST',
    body: JSON.stringify({
      dataReserva: quickReservationForm.elements.dataReserva.value,
      usuarioId: quickReservationForm.elements.usuarioId.value,
      ativoIds: [quickReservationForm.elements.ativoId.value],
      tempoIds: [quickReservationForm.elements.tempoId.value]
    })
  });

  quickReservationModal.close();
  setDashboardStatus('Reserva realizada com sucesso.', 'success');
  await refreshNotificationsCount();
  await loadDashboardReservations();
}

async function cancelDashboardReservation(id) {
  const reservation = dashboardReservations.find((item) => String(item.id) === String(id));
  if (!reservation || !canCancelReservation(reservation)) {
    return;
  }

  const confirmed = await askDashboardConfirmation({
    title: 'Cancelar reserva',
    message: 'Esta reserva sera cancelada e permanecera registrada no historico.',
    actionText: 'Cancelar reserva',
    danger: true
  });
  if (!confirmed) {
    return;
  }

  await requestJson(`/api/reservas/${id}`, { method: 'DELETE' });
  setDashboardStatus('Reserva cancelada com sucesso.', 'success');
  await refreshNotificationsCount();
  await loadDashboardReservations();
}

if (dashboardDate) {
  dashboardDate.addEventListener('change', () => {
    loadDashboardReservations().catch((error) => setDashboardStatus(error.message, 'error'));
  });

  dashboardType.addEventListener('change', () => {
    renderAssetSelect(false);
    loadDashboardReservations().catch((error) => setDashboardStatus(error.message, 'error'));
  });

  dashboardAsset.addEventListener('change', () => {
    loadDashboardReservations().catch((error) => setDashboardStatus(error.message, 'error'));
  });

  timelineList.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) {
      return;
    }

    if (button.dataset.action === 'quick-reserve') {
      openQuickReservation(button.dataset.timeId);
      return;
    }

    if (button.dataset.action === 'cancel-reservation') {
      cancelDashboardReservation(button.dataset.reservationId).catch((error) => setDashboardStatus(error.message, 'error'));
    }
  });

  quickReservationForm.addEventListener('submit', (event) => {
    event.preventDefault();
    saveQuickReservation().catch((error) => setQuickStatus(error.message, 'error'));
  });

  document.querySelector('[data-action="close-quick-reservation"]').addEventListener('click', () => {
    setQuickStatus('');
    quickReservationModal.close();
  });

  const closePendingAlertButton = document.querySelector('[data-action="close-pending-alert"]');
  if (closePendingAlertButton) {
    closePendingAlertButton.addEventListener('click', () => {
      pendingUsersAlertClosed = true;
      pendingUsersAlert.hidden = true;
    });
  }

  dashboardConfirmButton.addEventListener('click', () => resolveDashboardConfirmation(true));
  dashboardCancelConfirmButton.addEventListener('click', () => resolveDashboardConfirmation(false));
  dashboardConfirmModal.addEventListener('cancel', (event) => {
    event.preventDefault();
    resolveDashboardConfirmation(false);
  });
}

window.addEventListener('focus', () => {
  refreshPendingUsersNotification();
  refreshNotificationsCount();
});

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    refreshPendingUsersNotification();
    refreshNotificationsCount();
  }
});
