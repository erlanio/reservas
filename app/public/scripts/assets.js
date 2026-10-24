const tableBody = document.querySelector('#assetsTable');
const statusBox = document.querySelector('#assetsStatus');
const pageInfo = document.querySelector('#pageInfo');
const views = document.querySelector('#assetViews');
const assetModal = document.querySelector('#assetModal');
const assetForm = document.querySelector('#assetForm');
const assetModalTitle = document.querySelector('#assetModalTitle');
const typesModal = document.querySelector('#typesModal');
const typeForm = document.querySelector('#typeForm');
const typeList = document.querySelector('#typeList');
const disableAssetModal = document.querySelector('#disableAssetModal');
const disableAssetForm = document.querySelector('#disableAssetForm');
const disableAssetName = document.querySelector('#disableAssetName');
const disableDescriptionLabel = document.querySelector('#disableDescriptionLabel');
const disableAssetStatus = document.querySelector('#disableAssetStatus');
const assetHistoryModal = document.querySelector('#assetHistoryModal');
const assetHistoryList = document.querySelector('#assetHistoryList');
const confirmModal = document.querySelector('#confirmModal');
const confirmTitle = document.querySelector('#confirmTitle');
const confirmMessage = document.querySelector('#confirmMessage');
const confirmButton = document.querySelector('[data-action="confirm-action"]');
const cancelConfirmButton = document.querySelector('[data-action="cancel-confirm"]');

let currentPage = 1;
let totalPages = 1;
let currentView = 'todos';
let currentTypeId = '';
let assets = [];
let types = [];
let pendingConfirmation = null;

function setStatus(message, type = '') {
  statusBox.className = type ? `status is-${type}` : 'status';
  statusBox.textContent = message;
}

function setDisableStatus(message, type = '') {
  disableAssetStatus.className = type ? `status modal-status is-${type}` : 'status modal-status';
  disableAssetStatus.textContent = message;
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function requestBody(data) {
  return JSON.stringify(data);
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || 'Nao foi possivel concluir a solicitacao.');
    error.details = data.details;
    throw error;
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

function actionButton(action, id, label, icon, extraClass = '') {
  return `
    <button class="table-action icon-text ${extraClass}" type="button" data-action="${action}" data-id="${id}">
      ${icon}
      <span>${label}</span>
    </button>
  `;
}

function icons(name) {
  const map = {
    edit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>',
    delete: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"></path><path d="M8 6V4h8v2"></path><path d="M19 6l-1 14H6L5 6"></path><path d="M10 11v5"></path><path d="M14 11v5"></path></svg>',
    restore: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7"></path><path d="M3 3v6h6"></path></svg>',
    power: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v10"></path><path d="M18.4 6.6a9 9 0 1 1-12.8 0"></path></svg>',
    history: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7"></path><path d="M3 3v6h6"></path><path d="M12 7v5l3 2"></path></svg>'
  };
  return map[name];
}

function formatDateTime(value) {
  if (!value) {
    return '';
  }

  return String(value).replace('T', ' ').slice(0, 16);
}

function formatReason(value) {
  const labels = {
    desativacao: 'Desativacao',
    reativacao: 'Reativacao',
    defeito: 'Defeito',
    manutencao: 'Manutencao',
    reforma: 'Reforma',
    outro: 'Outro'
  };
  return labels[value] || value || '';
}

function renderStatus(asset) {
  if (asset.status === 'desativado') {
    return '<span class="status-pill danger-pill">Desativado</span>';
  }

  return '<span class="status-pill success-pill">Ativo</span>';
}

function renderAssetActions(asset) {
  if (currentView === 'lixeira') {
    return actionButton('restore', asset.id, 'Recuperar', icons('restore'));
  }

  const statusAction = asset.status === 'desativado'
    ? actionButton('reactivate', asset.id, 'Reativar', icons('power'), 'success-action')
    : actionButton('disable', asset.id, 'Desativar', icons('power'), 'danger');

  return `
    ${actionButton('edit', asset.id, 'Alterar', icons('edit'))}
    ${statusAction}
    ${actionButton('history', asset.id, 'Historico', icons('history'))}
    ${actionButton('delete', asset.id, 'Excluir', icons('delete'), 'danger')}
  `;
}

function renderAssets() {
  if (assets.length === 0) {
    tableBody.innerHTML = '<tr class="empty-row"><td colspan="4">Nenhum ativo encontrado.</td></tr>';
    return;
  }

  tableBody.innerHTML = assets.map((asset) => `
    <tr>
      <td data-label="Identificador">${escapeHtml(asset.identificador)}</td>
      <td data-label="Tipo">${escapeHtml(asset.tipo)}</td>
      <td data-label="Status">${renderStatus(asset)}</td>
      <td data-label="Opcoes"><div class="table-actions">${renderAssetActions(asset)}</div></td>
    </tr>
  `).join('');
}

function renderTypes() {
  const selectOptions = [
    '<option value="">Selecione</option>',
    ...types.map((type) => `<option value="${type.id}">${escapeHtml(type.descricao)}</option>`)
  ];
  assetForm.elements.tipoId.innerHTML = selectOptions.join('');

  const isAllActive = currentView === 'todos';
  const isTrashActive = currentView === 'lixeira';
  const firstButton = `
    <button class="segment ${isAllActive ? 'is-active' : ''}" type="button" data-view="todos">Todos</button>
  `;
  const typeButtons = types.map((type) => `
    <button class="segment ${currentTypeId === String(type.id) ? 'is-active' : ''}" type="button" data-view="tipo" data-type-id="${type.id}">
      ${escapeHtml(type.descricao)}
    </button>
  `);
  const trashButton = `
    <button class="segment ${isTrashActive ? 'is-active' : ''}" type="button" data-view="lixeira">Lixeira</button>
  `;
  views.innerHTML = [firstButton, ...typeButtons, trashButton].join('');

  if (types.length === 0) {
    typeList.innerHTML = '<p class="muted">Nenhum tipo cadastrado.</p>';
    return;
  }

  typeList.innerHTML = types.map((type) => `
    <div class="type-row">
      <span>${escapeHtml(type.descricao)}</span>
      <div class="table-actions">
        ${actionButton('edit-type', type.id, 'Alterar', icons('edit'))}
        ${actionButton('delete-type', type.id, 'Excluir', icons('delete'), 'danger')}
      </div>
    </div>
  `).join('');
}

async function loadTypes() {
  const data = await requestJson('/api/admin/tipos-ativos');
  types = data.types;
  renderTypes();
}

async function loadAssets() {
  try {
    setStatus('Carregando...');

    if (currentView === 'lixeira') {
      const data = await requestJson('/api/admin/ativos/lixeira');
      assets = data.assets;
      totalPages = 1;
      pageInfo.textContent = 'Lixeira';
    } else {
      const query = new URLSearchParams({ page: currentPage });
      if (currentTypeId) {
        query.set('tipoId', currentTypeId);
      }
      const data = await requestJson(`/api/admin/ativos?${query.toString()}`);
      assets = data.assets;
      totalPages = data.pagination.totalPages;
      pageInfo.textContent = `Pagina ${data.pagination.page} de ${totalPages}`;
    }

    renderAssets();
    setStatus('');
  } catch (error) {
    setStatus(error.message, 'error');
  }
}

function openAssetModal(asset = null) {
  assetModalTitle.textContent = asset ? 'Alterar ativo' : 'Novo ativo';
  assetForm.elements.id.value = asset ? asset.id : '';
  assetForm.elements.identificador.value = asset ? asset.identificador : '';
  assetForm.elements.descricao.value = asset ? asset.descricao || '' : '';
  assetForm.elements.tipoId.value = asset ? asset.tipo_id : '';
  assetModal.showModal();
}

function openDisableModal(asset) {
  disableAssetForm.reset();
  disableAssetForm.elements.id.value = asset.id;
  disableAssetName.textContent = `${asset.identificador} - ${asset.tipo}`;
  disableDescriptionLabel.hidden = true;
  disableAssetForm.elements.descricao.required = false;
  setDisableStatus('');
  disableAssetModal.showModal();
}

async function saveDisable(confirmarReservasFuturas = false) {
  const id = disableAssetForm.elements.id.value;
  const payload = {
    motivo: disableAssetForm.elements.motivo.value,
    descricao: disableAssetForm.elements.descricao.value,
    confirmarReservasFuturas
  };

  try {
    await requestJson(`/api/admin/ativos/${id}/desativar`, {
      method: 'PATCH',
      body: requestBody(payload)
    });
  } catch (error) {
    if (error.details && error.details.reservasFuturas) {
      const confirmed = await askConfirmation({
        title: 'Cancelar reservas futuras',
        message: `Este ativo possui ${error.details.reservasFuturas} reserva(s) futura(s). Ao desativar, elas serao canceladas.`,
        actionText: 'Desativar e cancelar',
        danger: true
      });
      if (!confirmed) {
        return;
      }

      return saveDisable(true);
    }

    throw error;
  }

  disableAssetModal.close();
  setStatus('Ativo desativado com sucesso.', 'success');
  await loadAssets();
}

async function saveAsset() {
  const id = assetForm.elements.id.value;
  const payload = {
    identificador: assetForm.elements.identificador.value,
    descricao: assetForm.elements.descricao.value,
    tipoId: assetForm.elements.tipoId.value
  };

  if (id) {
    const confirmed = await askConfirmation({
      title: 'Salvar alteracoes',
      message: 'Confirme para atualizar os dados deste ativo.',
      actionText: 'Salvar'
    });
    if (!confirmed) {
      return;
    }
  }

  await requestJson(id ? `/api/admin/ativos/${id}` : '/api/admin/ativos', {
    method: id ? 'PUT' : 'POST',
    body: requestBody(payload)
  });
  assetModal.close();
  assetForm.reset();
  setStatus(id ? 'Ativo atualizado com sucesso.' : 'Ativo cadastrado com sucesso.', 'success');
  await loadAssets();
}

async function saveType() {
  const id = typeForm.elements.id.value;
  const payload = { descricao: typeForm.elements.descricao.value };

  if (id) {
    const confirmed = await askConfirmation({
      title: 'Salvar tipo',
      message: 'Confirme para alterar este tipo de ativo.',
      actionText: 'Salvar'
    });
    if (!confirmed) {
      return;
    }
  }

  await requestJson(id ? `/api/admin/tipos-ativos/${id}` : '/api/admin/tipos-ativos', {
    method: id ? 'PUT' : 'POST',
    body: requestBody(payload)
  });
  typeForm.reset();
  await loadTypes();
  await loadAssets();
}

async function handleAssetAction(action, id) {
  const asset = assets.find((item) => String(item.id) === String(id));

  if (action === 'edit') {
    openAssetModal(asset);
    return;
  }

  if (action === 'disable') {
    openDisableModal(asset);
    return;
  }

  if (action === 'reactivate') {
    const confirmed = await askConfirmation({
      title: 'Reativar ativo',
      message: 'Este ativo voltara a ficar disponivel para novas reservas.',
      actionText: 'Reativar'
    });
    if (!confirmed) {
      return;
    }

    const data = await requestJson(`/api/admin/ativos/${id}/reativar`, { method: 'PATCH' });
    setStatus(data.message || 'Ativo reativado com sucesso.', 'success');
    await loadAssets();
    return;
  }

  if (action === 'history') {
    const data = await requestJson(`/api/admin/ativos/${id}/historico`);
    if (!data.history || data.history.length === 0) {
      assetHistoryList.innerHTML = '<p class="muted">Nenhum historico encontrado.</p>';
    } else {
      assetHistoryList.innerHTML = data.history.map((item) => `
        <div class="history-row">
          <strong>${formatReason(item.operacao)}</strong>
          <span>${escapeHtml(item.status_anterior)} para ${escapeHtml(item.status_novo)}</span>
          <small>${escapeHtml(item.usuario)} - ${formatDateTime(item.data_hora)}</small>
          ${item.motivo ? `<small>Motivo: ${formatReason(item.motivo)}</small>` : ''}
          ${item.descricao ? `<p>${escapeHtml(item.descricao)}</p>` : ''}
        </div>
      `).join('');
    }
    assetHistoryModal.showModal();
    return;
  }

  if (action === 'delete') {
    const confirmed = await askConfirmation({
      title: 'Excluir ativo',
      message: 'Este ativo ficara na lixeira por 30 dias e podera ser recuperado dentro desse periodo.',
      actionText: 'Excluir',
      danger: true
    });
    if (!confirmed) {
      return;
    }

    await requestJson(`/api/admin/ativos/${id}`, { method: 'DELETE' });
    setStatus('Ativo enviado para a lixeira.', 'success');
    await loadAssets();
    return;
  }

  if (action === 'restore') {
    const confirmed = await askConfirmation({
      title: 'Recuperar ativo',
      message: 'Este ativo voltara para a lista se nao existir outro ativo com o mesmo identificador.',
      actionText: 'Recuperar'
    });
    if (!confirmed) {
      return;
    }

    await requestJson(`/api/admin/ativos/${id}/restaurar`, { method: 'POST' });
    setStatus('Ativo recuperado com sucesso.', 'success');
    await loadAssets();
  }
}

async function handleTypeAction(action, id) {
  const type = types.find((item) => String(item.id) === String(id));

  if (action === 'edit-type') {
    typeForm.elements.id.value = type.id;
    typeForm.elements.descricao.value = type.descricao;
    return;
  }

  if (action === 'delete-type') {
    const confirmed = await askConfirmation({
      title: 'Excluir tipo',
      message: 'Confirme para remover este tipo da lista de tipos disponiveis.',
      actionText: 'Excluir',
      danger: true
    });
    if (!confirmed) {
      return;
    }

    await requestJson(`/api/admin/tipos-ativos/${id}`, { method: 'DELETE' });
    await loadTypes();
    await loadAssets();
  }
}

tableBody.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) {
    return;
  }

  handleAssetAction(button.dataset.action, button.dataset.id).catch((error) => {
    setStatus(error.message, 'error');
  });
});

typeList.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) {
    return;
  }

  handleTypeAction(button.dataset.action, button.dataset.id).catch((error) => {
    setStatus(error.message, 'error');
  });
});

views.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-view]');
  if (!button) {
    return;
  }

  currentView = button.dataset.view;
  currentTypeId = button.dataset.typeId || '';
  currentPage = 1;
  views.querySelectorAll('.segment').forEach((item) => item.classList.toggle('is-active', item === button));
  loadAssets();
});

assetForm.addEventListener('submit', (event) => {
  event.preventDefault();
  saveAsset().catch((error) => setStatus(error.message, 'error'));
});

disableAssetForm.addEventListener('submit', (event) => {
  event.preventDefault();
  saveDisable().catch((error) => setDisableStatus(error.message, 'error'));
});

disableAssetForm.elements.motivo.addEventListener('change', () => {
  const isOther = disableAssetForm.elements.motivo.value === 'outro';
  disableDescriptionLabel.hidden = !isOther;
  disableAssetForm.elements.descricao.required = isOther;
});

typeForm.addEventListener('submit', (event) => {
  event.preventDefault();
  saveType().catch((error) => setStatus(error.message, 'error'));
});

document.querySelector('[data-action="new-asset"]').addEventListener('click', () => openAssetModal());
document.querySelector('[data-action="manage-types"]').addEventListener('click', () => typesModal.showModal());
document.querySelector('[data-action="close-asset-modal"]').addEventListener('click', () => assetModal.close());
document.querySelector('[data-action="close-disable-modal"]').addEventListener('click', () => disableAssetModal.close());
document.querySelector('[data-action="close-history-modal"]').addEventListener('click', () => assetHistoryModal.close());
document.querySelector('[data-action="close-types-modal"]').addEventListener('click', () => typesModal.close());
document.querySelector('[data-action="reset-type"]').addEventListener('click', () => typeForm.reset());
document.querySelector('[data-action="prev-page"]').addEventListener('click', () => {
  if (currentPage > 1 && currentView !== 'lixeira') {
    currentPage -= 1;
    loadAssets();
  }
});
document.querySelector('[data-action="next-page"]').addEventListener('click', () => {
  if (currentPage < totalPages && currentView !== 'lixeira') {
    currentPage += 1;
    loadAssets();
  }
});

confirmButton.addEventListener('click', () => resolveConfirmation(true));
cancelConfirmButton.addEventListener('click', () => resolveConfirmation(false));
confirmModal.addEventListener('cancel', (event) => {
  event.preventDefault();
  resolveConfirmation(false);
});

loadTypes()
  .then(loadAssets)
  .catch((error) => setStatus(error.message, 'error'));
