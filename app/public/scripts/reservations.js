const reservationsTable = document.querySelector('#reservationsTable');
const reservationsStatus = document.querySelector('#reservationsStatus');
const reservationForm = document.querySelector('#reservationForm');
const reservationFormStatus = document.querySelector('#reservationFormStatus');
const assetChoices = document.querySelector('#assetChoices');
const timeChoices = document.querySelector('#timeChoices');
const filterDate = document.querySelector('#filterDate');
const filterAsset = document.querySelector('#filterAsset');
const reservationViews = document.querySelector('#reservationViews');
const reservationScreens = document.querySelector('#reservationScreens');
const createPanel = document.querySelector('#createPanel');
const viewPanel = document.querySelector('#viewPanel');
const createAssetTypeTabs = document.querySelector('#createAssetTypeTabs');
const viewAssetTypeTabs = document.querySelector('#viewAssetTypeTabs');
const editReservationModal = document.querySelector('#editReservationModal');
const editReservationForm = document.querySelector('#editReservationForm');
const editReservationStatus = document.querySelector('#editReservationStatus');
const confirmModal = document.querySelector('#confirmModal');
const confirmTitle = document.querySelector('#confirmTitle');
const confirmMessage = document.querySelector('#confirmMessage');
const confirmButton = document.querySelector('[data-action="confirm-action"]');
const cancelConfirmButton = document.querySelector('[data-action="cancel-confirm"]');

let options = { assets: [], times: [], users: [] };
let reservations = [];
let availabilityReservations = [];
let currentStatus = 'ativas';
let currentScreen = 'create';
let currentCreateType = '';
let currentViewType = '';
let pendingConfirmation = null;
let currentUser = null;

function today() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function setStatus(element, message, type = '') {
  const isModalStatus = element.classList.contains('modal-status');
  element.className = type ? `status is-${type}` : 'status';
  if (isModalStatus) {
    element.className = type ? `status modal-status is-${type}` : 'status modal-status';
  }
  element.textContent = message;
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatTime(value) {
  return String(value || '').slice(0, 5);
}

function formatDate(value) {
  const text = String(value || '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return '';
  }

  const [year, month, day] = text.split('-');
  return `${day}/${month}/${year}`;
}

async function requestJson(url, requestOptions = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...requestOptions
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Nao foi possivel concluir a solicitacao.');
  }

  return data;
}

function icon(name) {
  const icons = {
    edit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>',
    delete: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"></path><path d="M8 6V4h8v2"></path><path d="M19 6l-1 14H6L5 6"></path><path d="M10 11v5"></path><path d="M14 11v5"></path></svg>'
  };
  return icons[name];
}

function askConfirmation({ title, message, actionText = 'Confirmar', danger = false }) {
  confirmTitle.textContent = title;
  confirmMessage.textContent = message;
  confirmButton.textContent = actionText;
  confirmButton.classList.toggle('danger-primary', danger);
  confirmModal.showModal();

  return new Promise((resolve) => {
    pendingConfirmation = resolve;
  });
}

function resolveConfirmation(value) {
  if (pendingConfirmation) {
    pendingConfirmation(value);
    pendingConfirmation = null;
  }
  confirmModal.close();
}

function actionButton(action, id, label, iconName, extraClass = '') {
  return `
    <button class="table-action icon-text ${extraClass}" type="button" data-action="${action}" data-id="${id}">
      ${icon(iconName)}
      <span>${label}</span>
    </button>
  `;
}

function assetTypeKey(asset) {
  return String(asset.tipo_id || asset.tipo || 'sem-tipo');
}

function assetTypes(includeAll = false) {
  const seen = new Map();
  options.assets.forEach((asset) => {
    const key = assetTypeKey(asset);
    if (!seen.has(key)) {
      seen.set(key, { key, label: asset.tipo || 'Sem tipo' });
    }
  });

  const types = Array.from(seen.values()).sort((a, b) => a.label.localeCompare(b.label));
  return includeAll ? [{ key: '', label: 'Todos' }, ...types] : types;
}

function ensureSelectedTypes() {
  const types = assetTypes();
  if (!currentCreateType && types.length > 0) {
    currentCreateType = types[0].key;
  }
}

function renderTypeTabs(container, selected, includeAll) {
  const types = assetTypes(includeAll);
  if (types.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = types.map((type) => `
    <button class="segment ${selected === type.key ? 'is-active' : ''}" type="button" data-type-id="${escapeHtml(type.key)}">
      ${escapeHtml(type.label)}
    </button>
  `).join('');
}

function selectedValues(form, name) {
  return Array.from(form.querySelectorAll(`input[name="${name}"]:checked`)).map((input) => input.value);
}

function unavailableTimeIdsForSelectedAssets(ignoredReservationId = '') {
  const selectedAssets = new Set(selectedValues(reservationForm, 'ativoIds').map(String));
  if (selectedAssets.size === 0) {
    return new Set();
  }

  return new Set(
    availabilityReservations
      .filter((reservation) => String(reservation.id) !== String(ignoredReservationId))
      .filter((reservation) => selectedAssets.has(String(reservation.ativo_id)))
      .map((reservation) => String(reservation.tempo_id))
  );
}

function renderAssetChoices() {
  const assets = options.assets.filter((asset) => assetTypeKey(asset) === currentCreateType);
  if (assets.length === 0) {
    assetChoices.innerHTML = '<p class="muted">Nenhum ativo disponivel neste tipo.</p>';
    return;
  }

  assetChoices.innerHTML = assets.map((asset) => `
    <label class="choice-card">
      <input type="checkbox" name="ativoIds" value="${asset.id}">
      <span>${escapeHtml(asset.identificador)}</span>
    </label>
  `).join('');
}

function renderTimeChoices() {
  const selectedAssets = selectedValues(reservationForm, 'ativoIds');
  if (selectedAssets.length === 0) {
    timeChoices.innerHTML = '<p class="muted">Selecione ao menos um ativo para ver os tempos disponiveis.</p>';
    return;
  }

  const unavailable = unavailableTimeIdsForSelectedAssets();
  const availableTimes = options.times.filter((time) => !unavailable.has(String(time.id)));

  if (availableTimes.length === 0) {
    timeChoices.innerHTML = '<p class="muted">Nenhum tempo disponivel para os ativos selecionados nesta data.</p>';
    return;
  }

  timeChoices.innerHTML = availableTimes.map((time) => `
    <label class="choice-card">
      <input type="checkbox" name="tempoIds" value="${time.id}">
      <span>${escapeHtml(time.identificador)} (${formatTime(time.hora_inicio)} - ${formatTime(time.hora_fim)})</span>
    </label>
  `).join('');
}

function renderSelect(select, items, labelFor, firstLabel = 'Selecione') {
  select.innerHTML = [
    `<option value="">${firstLabel}</option>`,
    ...items.map((item) => `<option value="${item.id}">${escapeHtml(labelFor(item))}</option>`)
  ].join('');
}

function renderFilterAssets() {
  const assets = currentViewType
    ? options.assets.filter((asset) => assetTypeKey(asset) === currentViewType)
    : options.assets;
  const selectedType = assetTypes().find((type) => type.key === currentViewType);
  const firstLabel = selectedType ? `Todos de ${selectedType.label}` : 'Todos os ativos';

  renderSelect(filterAsset, assets, (asset) => asset.identificador, firstLabel);
}

function renderOptions() {
  ensureSelectedTypes();
  renderTypeTabs(createAssetTypeTabs, currentCreateType, false);
  renderTypeTabs(viewAssetTypeTabs, currentViewType, true);
  renderAssetChoices();
  renderTimeChoices();
  renderSelect(reservationForm.elements.usuarioId, options.users, (user) => `${user.nome} - ${user.email}`);
  renderSelect(editReservationForm.elements.usuarioId, options.users, (user) => `${user.nome} - ${user.email}`);
  renderSelect(editReservationForm.elements.ativoId, options.assets, (asset) => `${asset.identificador} - ${asset.tipo}`);
  renderSelect(editReservationForm.elements.tempoId, options.times, (time) => `${time.identificador} (${formatTime(time.hora_inicio)} - ${formatTime(time.hora_fim)})`);
  renderFilterAssets();

  if (options.users.length === 1) {
    reservationForm.elements.usuarioId.value = options.users[0].id;
  }
}

function reservationStatus(reservation) {
  if (!reservation.cancelada_em) {
    return '<span class="status-pill success-pill">Ativa</span>';
  }

  return `
    <span class="status-pill danger-pill">Cancelada</span>
    <small>por ${escapeHtml(reservation.cancelada_por_nome || 'usuario')}</small>
  `;
}

function renderActions(reservation) {
  if (reservation.cancelada_em) {
    return '<span class="muted">Historico</span>';
  }

  const canManage = currentUser
    && (currentUser.nivelAcesso === 'master' || Number(currentUser.id) === Number(reservation.usuario_id));
  if (!canManage) {
    return '<span class="muted">Somente visualizacao</span>';
  }

  return `
    ${actionButton('edit', reservation.id, 'Alterar', 'edit')}
    ${actionButton('cancel', reservation.id, 'Excluir', 'delete', 'danger')}
  `;
}

function renderReservations() {
  if (reservations.length === 0) {
    reservationsTable.innerHTML = '<tr class="empty-row"><td colspan="6">Nenhuma reserva encontrada.</td></tr>';
    return;
  }

  reservationsTable.innerHTML = reservations.map((reservation) => `
    <tr>
      <td data-label="Data">${formatDate(reservation.data_reserva)}</td>
      <td data-label="Tempo">${escapeHtml(reservation.tempo)} (${formatTime(reservation.hora_inicio)} - ${formatTime(reservation.hora_fim)})</td>
      <td data-label="Ativo">${escapeHtml(reservation.ativo)}</td>
      <td data-label="Usuario">${escapeHtml(reservation.usuario)}</td>
      <td data-label="Situacao"><span class="status-stack">${reservationStatus(reservation)}</span></td>
      <td data-label="Opcoes"><div class="table-actions">${renderActions(reservation)}</div></td>
    </tr>
  `).join('');
}

async function loadAvailability() {
  const data = await requestJson(`/api/reservas?${new URLSearchParams({
    data: reservationForm.elements.dataReserva.value,
    status: 'ativas'
  }).toString()}`);
  availabilityReservations = data.reservations;
  renderTimeChoices();
}

async function loadOptions() {
  const session = await requestJson('/api/session');
  currentUser = session.user;
  options = await requestJson('/api/reservas/opcoes');
  renderOptions();
  await loadAvailability();
}

async function loadReservations() {
  try {
    setStatus(reservationsStatus, 'Carregando...');
    const query = new URLSearchParams({
      data: filterDate.value,
      status: currentStatus
    });

    if (filterAsset.value) {
      query.set('ativoId', filterAsset.value);
    } else if (currentViewType) {
      query.set('tipoId', currentViewType);
    }

    const data = await requestJson(`/api/reservas?${query.toString()}`);
    reservations = data.reservations;
    renderReservations();
    setStatus(reservationsStatus, '');
  } catch (error) {
    setStatus(reservationsStatus, error.message, 'error');
  }
}

async function createReservation() {
  setStatus(reservationFormStatus, '');
  const payload = {
    dataReserva: reservationForm.elements.dataReserva.value,
    usuarioId: reservationForm.elements.usuarioId.value,
    ativoIds: selectedValues(reservationForm, 'ativoIds'),
    tempoIds: selectedValues(reservationForm, 'tempoIds')
  };

  await requestJson('/api/reservas', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  reservationForm.querySelectorAll('input[type="checkbox"]').forEach((input) => {
    input.checked = false;
  });
  filterDate.value = payload.dataReserva;
  setStatus(reservationFormStatus, 'Reserva cadastrada com sucesso.', 'success');
  if (window.refreshNotificationsCount) {
    window.refreshNotificationsCount();
  }
  await loadAvailability();
  await loadReservations();
}

function openEditModal(reservation) {
  editReservationForm.elements.id.value = reservation.id;
  editReservationForm.elements.dataReserva.value = String(reservation.data_reserva).slice(0, 10);
  editReservationForm.elements.usuarioId.value = reservation.usuario_id;
  editReservationForm.elements.ativoId.value = reservation.ativo_id;
  editReservationForm.elements.tempoId.value = reservation.tempo_id;
  setStatus(editReservationStatus, '');
  editReservationModal.showModal();
}

async function saveEdit() {
  setStatus(editReservationStatus, '');
  const id = editReservationForm.elements.id.value;
  const confirmed = await askConfirmation({
    title: 'Salvar alteracoes',
    message: 'Confirme para atualizar os dados desta reserva.',
    actionText: 'Salvar'
  });
  if (!confirmed) {
    return;
  }

  await requestJson(`/api/reservas/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      dataReserva: editReservationForm.elements.dataReserva.value,
      usuarioId: editReservationForm.elements.usuarioId.value,
      ativoId: editReservationForm.elements.ativoId.value,
      tempoId: editReservationForm.elements.tempoId.value
    })
  });

  editReservationModal.close();
  setStatus(reservationsStatus, 'Reserva atualizada com sucesso.', 'success');
  if (window.refreshNotificationsCount) {
    window.refreshNotificationsCount();
  }
  await loadAvailability();
  await loadReservations();
}

async function handleTableAction(action, id) {
  const reservation = reservations.find((item) => String(item.id) === String(id));

  if (action === 'edit') {
    openEditModal(reservation);
    return;
  }

  if (action === 'cancel') {
    const confirmed = await askConfirmation({
      title: 'Cancelar reserva',
      message: 'Esta reserva sera cancelada e permanecera registrada no historico.',
      actionText: 'Cancelar reserva',
      danger: true
    });
    if (!confirmed) {
      return;
    }

    await requestJson(`/api/reservas/${id}`, { method: 'DELETE' });
    setStatus(reservationsStatus, 'Reserva cancelada com sucesso.', 'success');
    if (window.refreshNotificationsCount) {
      window.refreshNotificationsCount();
    }
    await loadAvailability();
    await loadReservations();
  }
}

reservationForm.elements.dataReserva.value = today();
reservationForm.elements.dataReserva.min = today();
editReservationForm.elements.dataReserva.min = today();
filterDate.value = today();

reservationForm.addEventListener('submit', (event) => {
  event.preventDefault();
  createReservation().catch((error) => setStatus(reservationFormStatus, error.message, 'error'));
});

reservationScreens.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-screen]');
  if (!button) {
    return;
  }

  currentScreen = button.dataset.screen;
  reservationScreens.querySelectorAll('.segment').forEach((item) => item.classList.toggle('is-active', item === button));
  createPanel.hidden = currentScreen !== 'create';
  viewPanel.hidden = currentScreen !== 'view';
  if (currentScreen === 'view') {
    loadReservations();
  }
});

createAssetTypeTabs.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-type-id]');
  if (!button) {
    return;
  }

  currentCreateType = button.dataset.typeId;
  renderTypeTabs(createAssetTypeTabs, currentCreateType, false);
  renderAssetChoices();
  renderTimeChoices();
});

viewAssetTypeTabs.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-type-id]');
  if (!button) {
    return;
  }

  currentViewType = button.dataset.typeId;
  renderTypeTabs(viewAssetTypeTabs, currentViewType, true);
  renderFilterAssets();
  loadReservations();
});

assetChoices.addEventListener('change', () => {
  setStatus(reservationFormStatus, '');
  renderTimeChoices();
});

reservationForm.elements.dataReserva.addEventListener('change', () => {
  setStatus(reservationFormStatus, '');
  loadAvailability().catch((error) => setStatus(reservationFormStatus, error.message, 'error'));
});

filterDate.addEventListener('change', loadReservations);
filterAsset.addEventListener('change', loadReservations);

reservationViews.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-status]');
  if (!button) {
    return;
  }

  currentStatus = button.dataset.status;
  reservationViews.querySelectorAll('.segment').forEach((item) => item.classList.toggle('is-active', item === button));
  loadReservations();
});

reservationsTable.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) {
    return;
  }

  handleTableAction(button.dataset.action, button.dataset.id).catch((error) => {
    setStatus(reservationsStatus, error.message, 'error');
  });
});

editReservationForm.addEventListener('submit', (event) => {
  event.preventDefault();
  saveEdit().catch((error) => setStatus(editReservationStatus, error.message, 'error'));
});

document.querySelector('[data-action="close-edit-reservation"]').addEventListener('click', () => {
  setStatus(editReservationStatus, '');
  editReservationModal.close();
});
confirmButton.addEventListener('click', () => resolveConfirmation(true));
cancelConfirmButton.addEventListener('click', () => resolveConfirmation(false));
confirmModal.addEventListener('cancel', (event) => {
  event.preventDefault();
  resolveConfirmation(false);
});

loadOptions()
  .then(loadReservations)
  .catch((error) => setStatus(reservationFormStatus, error.message, 'error'));
