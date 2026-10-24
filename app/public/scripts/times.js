const tableBody = document.querySelector('#timesTable');
const statusBox = document.querySelector('#timesStatus');
const views = document.querySelector('#timeViews');
const timeModal = document.querySelector('#timeModal');
const timeForm = document.querySelector('#timeForm');
const timeFormStatus = document.querySelector('#timeFormStatus');
const timeModalTitle = document.querySelector('#timeModalTitle');
const confirmModal = document.querySelector('#confirmModal');
const confirmTitle = document.querySelector('#confirmTitle');
const confirmMessage = document.querySelector('#confirmMessage');
const confirmButton = document.querySelector('[data-action="confirm-action"]');
const cancelConfirmButton = document.querySelector('[data-action="cancel-confirm"]');

let currentView = 'ativos';
let times = [];
let pendingConfirmation = null;

function setStatus(message, type = '') {
  statusBox.className = type ? `status is-${type}` : 'status';
  statusBox.textContent = message;
}

function setModalStatus(message, type = '') {
  timeFormStatus.className = type ? `status modal-status is-${type}` : 'status modal-status';
  timeFormStatus.textContent = message;
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

function icon(name) {
  const icons = {
    edit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>',
    delete: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"></path><path d="M8 6V4h8v2"></path><path d="M19 6l-1 14H6L5 6"></path><path d="M10 11v5"></path><path d="M14 11v5"></path></svg>',
    restore: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7"></path><path d="M3 3v6h6"></path></svg>'
  };
  return icons[name];
}

function actionButton(action, id, label, iconName, extraClass = '') {
  return `
    <button class="table-action icon-text ${extraClass}" type="button" data-action="${action}" data-id="${id}">
      ${icon(iconName)}
      <span>${label}</span>
    </button>
  `;
}

function renderActions(time) {
  if (currentView === 'lixeira') {
    return actionButton('restore', time.id, 'Recuperar', 'restore');
  }

  return `
    ${actionButton('edit', time.id, 'Alterar', 'edit')}
    ${actionButton('delete', time.id, 'Excluir', 'delete', 'danger')}
  `;
}

function renderTimes() {
  if (times.length === 0) {
    tableBody.innerHTML = '<tr class="empty-row"><td colspan="4">Nenhum tempo encontrado.</td></tr>';
    return;
  }

  tableBody.innerHTML = times.map((time) => `
    <tr>
      <td data-label="Identificador">${escapeHtml(time.identificador)}</td>
      <td data-label="Inicio">${formatTime(time.hora_inicio)}</td>
      <td data-label="Fim">${formatTime(time.hora_fim)}</td>
      <td data-label="Opcoes"><div class="table-actions">${renderActions(time)}</div></td>
    </tr>
  `).join('');
}

async function loadTimes() {
  try {
    setStatus('Carregando...');
    const endpoint = currentView === 'lixeira' ? '/api/admin/tempos/lixeira' : '/api/admin/tempos';
    const data = await requestJson(endpoint);
    times = data.times;
    renderTimes();
    setStatus('');
  } catch (error) {
    setStatus(error.message, 'error');
  }
}

function openTimeModal(time = null) {
  timeModalTitle.textContent = time ? 'Alterar tempo' : 'Novo tempo';
  setModalStatus('');
  timeForm.elements.id.value = time ? time.id : '';
  timeForm.elements.identificador.value = time ? time.identificador : '';
  timeForm.elements.horaInicio.value = time ? formatTime(time.hora_inicio) : '';
  timeForm.elements.horaFim.value = time ? formatTime(time.hora_fim) : '';
  timeModal.showModal();
}

async function saveTime() {
  setModalStatus('');
  const id = timeForm.elements.id.value;
  const payload = {
    identificador: timeForm.elements.identificador.value,
    horaInicio: timeForm.elements.horaInicio.value,
    horaFim: timeForm.elements.horaFim.value
  };

  if (id) {
    const confirmed = await askConfirmation({
      title: 'Salvar alteracoes',
      message: 'Confirme para atualizar este tempo.',
      actionText: 'Salvar'
    });
    if (!confirmed) {
      return;
    }
  }

  await requestJson(id ? `/api/admin/tempos/${id}` : '/api/admin/tempos', {
    method: id ? 'PUT' : 'POST',
    body: JSON.stringify(payload)
  });
  timeModal.close();
  timeForm.reset();
  setStatus(id ? 'Tempo atualizado com sucesso.' : 'Tempo cadastrado com sucesso.', 'success');
  await loadTimes();
}

async function handleAction(action, id) {
  const time = times.find((item) => String(item.id) === String(id));

  if (action === 'edit') {
    openTimeModal(time);
    return;
  }

  if (action === 'delete') {
    const confirmed = await askConfirmation({
      title: 'Excluir tempo',
      message: 'Este tempo ficara na lixeira por 30 dias e podera ser recuperado dentro desse periodo.',
      actionText: 'Excluir',
      danger: true
    });
    if (!confirmed) {
      return;
    }

    await requestJson(`/api/admin/tempos/${id}`, { method: 'DELETE' });
    setStatus('Tempo enviado para a lixeira.', 'success');
    await loadTimes();
    return;
  }

  if (action === 'restore') {
    const confirmed = await askConfirmation({
      title: 'Recuperar tempo',
      message: 'Este tempo voltara para a lista se nao existir outro tempo ativo com o mesmo identificador.',
      actionText: 'Recuperar'
    });
    if (!confirmed) {
      return;
    }

    await requestJson(`/api/admin/tempos/${id}/restaurar`, { method: 'POST' });
    setStatus('Tempo recuperado com sucesso.', 'success');
    await loadTimes();
  }
}

tableBody.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) {
    return;
  }

  handleAction(button.dataset.action, button.dataset.id).catch((error) => {
    setStatus(error.message, 'error');
  });
});

views.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-view]');
  if (!button) {
    return;
  }

  currentView = button.dataset.view;
  views.querySelectorAll('.segment').forEach((item) => item.classList.toggle('is-active', item === button));
  loadTimes();
});

timeForm.addEventListener('submit', (event) => {
  event.preventDefault();
  saveTime().catch((error) => setModalStatus(error.message, 'error'));
});

document.querySelector('[data-action="new-time"]').addEventListener('click', () => openTimeModal());
document.querySelector('[data-action="close-time-modal"]').addEventListener('click', () => {
  setModalStatus('');
  timeModal.close();
});
confirmButton.addEventListener('click', () => resolveConfirmation(true));
cancelConfirmButton.addEventListener('click', () => resolveConfirmation(false));
confirmModal.addEventListener('cancel', (event) => {
  event.preventDefault();
  resolveConfirmation(false);
});

loadTimes();
