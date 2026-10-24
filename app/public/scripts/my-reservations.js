(function () {
  const tableBody = document.querySelector('#myReservationsTable');
  const filtersForm = document.querySelector('#myReservationsFilters');
  const statusBox = document.querySelector('#myReservationsStatus');
  const countBox = document.querySelector('#myReservationsCount');
  const pageInfo = document.querySelector('#myReservationsPageInfo');
  const detailsModal = document.querySelector('#myReservationDetailsModal');
  const detailsTitle = document.querySelector('#myReservationDetailsTitle');
  const detailsStatus = document.querySelector('#myReservationDetailsStatus');
  const detailsBox = document.querySelector('#myReservationDetails');
  const cancelModal = document.querySelector('#myReservationCancelModal');
  const createModal = document.querySelector('#myReservationCreateModal');
  const createForm = document.querySelector('#myReservationCreateForm');
  const createStatus = document.querySelector('#myReservationCreateStatus');
  const createUserField = document.querySelector('#myReservationUserField');
  const createTimeChoices = document.querySelector('#myReservationTimeChoices');

  let currentPage = 1;
  let totalPages = 1;
  let loading = false;
  let reservationPendingCancellation = null;
  let reservationOptions = { assets: [], times: [], users: [] };

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

  function formatDateTime(value) {
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

  function formatTime(value) {
    return String(value || '').slice(0, 5);
  }

  function statusLabel(status) {
    const labels = {
      aceita: 'Aceita',
      concluida: 'Concluida',
      cancelada: 'Cancelada'
    };

    return labels[status] || 'Aceita';
  }

  function statusIcon(status) {
    if (status === 'cancelada') {
      return '<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>';
    }

    if (status === 'concluida' || status === 'aceita') {
      return '<path d="M20 6 9 17l-5-5"></path>';
    }

    return '<path d="M12 9v4"></path><path d="M12 17h.01"></path><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"></path>';
  }

  function statusPill(status) {
    return `
      <span class="reservation-state ${escapeHtml(status)}">
        <svg viewBox="0 0 24 24" aria-hidden="true">${statusIcon(status)}</svg>
        <span>${statusLabel(status)}</span>
      </span>
    `;
  }

  function setStatus(message, type = '') {
    statusBox.className = type ? `status is-${type}` : 'status';
    statusBox.textContent = message;
  }

  function setCreateStatus(message, type = '') {
    createStatus.className = type ? `status modal-status is-${type}` : 'status modal-status';
    createStatus.textContent = message;
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

  function buildQuery() {
    const data = new FormData(filtersForm);
    const query = new URLSearchParams({
      pagina: String(currentPage),
      limite: '10'
    });

    ['pesquisa', 'status', 'dataInicial', 'dataFinal'].forEach((field) => {
      const value = String(data.get(field) || '').trim();
      if (value) {
        query.set(field, value);
      }
    });

    return query;
  }

  function renderRows(reservas) {
    if (reservas.length === 0) {
      tableBody.innerHTML = '<tr class="empty-row"><td colspan="7">Nenhuma reserva encontrada.</td></tr>';
      return;
    }

    tableBody.innerHTML = reservas.map((reserva) => {
      const cancelAction = reserva.status === 'aceita'
        ? `
            <button class="table-action icon-text danger" type="button" data-action="cancel" data-id="${reserva.id}">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
              <span>Cancelar</span>
            </button>
          `
        : '';

      return `
      <tr class="my-reservation-row ${reserva.status}">
        <td data-label="#">#${reserva.id}</td>
        <td data-label="Ativo">
          <strong>${escapeHtml(reserva.ativo.nome)}</strong>
          <small class="my-reservation-asset-meta">${escapeHtml(reserva.tempo.identificacao)}</small>
        </td>
        <td data-label="Categoria">${escapeHtml(reserva.ativo.categoria)}</td>
        <td data-label="Data">${formatDate(reserva.dataReserva)}</td>
        <td data-label="Horario">${formatTime(reserva.horaInicio)} - ${formatTime(reserva.horaFim)}</td>
        <td data-label="Situacao">${statusPill(reserva.status)}</td>
        <td data-label="Opcoes">
          <div class="table-actions">
            <button class="table-action icon-text" type="button" data-action="details" data-id="${reserva.id}">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span>Detalhes</span>
            </button>
            ${cancelAction}
          </div>
        </td>
      </tr>
    `;
    }).join('');
  }

  function detailItem(label, value) {
    return `
      <div class="detail-item">
        <span>${label}</span>
        <strong>${escapeHtml(value || '-')}</strong>
      </div>
    `;
  }

  function renderDetails(reserva) {
    detailsTitle.textContent = `Reserva #${reserva.id}`;
    detailsStatus.innerHTML = statusPill(reserva.status);
    detailsBox.innerHTML = [
      detailItem('Ativo', reserva.ativo.nome),
      detailItem('Identificacao', reserva.ativo.identificacao),
      detailItem('Categoria', reserva.ativo.categoria),
      detailItem('Status do ativo', reserva.ativo.status),
      detailItem('Descricao do ativo', reserva.ativo.descricao),
      detailItem('Data', formatDate(reserva.dataReserva)),
      detailItem('Horario', `${formatTime(reserva.horaInicio)} - ${formatTime(reserva.horaFim)}`),
      detailItem('Finalidade', reserva.finalidade),
      detailItem('Observacoes', reserva.observacoes),
      detailItem('Motivo do cancelamento', reserva.motivoCancelamento),
      detailItem('Motivo da rejeicao', reserva.motivoRejeicao),
      detailItem('Criada em', formatDateTime(reserva.createdAt)),
      detailItem('Atualizada em', formatDateTime(reserva.updatedAt))
    ].join('');
  }

  async function loadReservations() {
    if (loading) {
      return;
    }

    loading = true;
    tableBody.innerHTML = '<tr class="empty-row"><td colspan="7">Carregando reservas...</td></tr>';
    setStatus('Carregando...');

    try {
      const data = await requestJson(`/api/minhas-reservas?${buildQuery().toString()}`);
      totalPages = data.paginacao.totalPaginas;
      currentPage = data.paginacao.pagina;
      countBox.textContent = `${data.paginacao.total} reserva(s)`;
      pageInfo.textContent = `Pagina ${currentPage} de ${totalPages}`;
      renderRows(data.reservas);
      setStatus('');
    } catch (error) {
      tableBody.innerHTML = '<tr class="empty-row"><td colspan="7">Nao foi possivel carregar as reservas.</td></tr>';
      setStatus(error.message, 'error');
    } finally {
      loading = false;
    }
  }

  async function openDetails(id) {
    setStatus('');
    try {
      const data = await requestJson(`/api/minhas-reservas/${id}`);
      renderDetails(data.reserva);
      detailsModal.showModal();
    } catch (error) {
      setStatus(error.message, 'error');
    }
  }

  function requestCancellation(id) {
    reservationPendingCancellation = id;
    cancelModal.showModal();
  }

  async function confirmCancellation() {
    if (!reservationPendingCancellation) {
      return;
    }

    const id = reservationPendingCancellation;
    reservationPendingCancellation = null;
    await requestJson(`/api/minhas-reservas/${id}`, { method: 'DELETE' });
    cancelModal.close();
    if (window.refreshNotificationsCount) {
      window.refreshNotificationsCount();
    }
    await loadReservations();
    setStatus('Reserva cancelada com sucesso.', 'success');
  }

  function renderCreateOptions() {
    const types = new Map();
    reservationOptions.assets.forEach((asset) => {
      const id = String(asset.tipo_id || asset.tipo);
      if (!types.has(id)) {
        types.set(id, asset.tipo);
      }
    });
    createForm.elements.tipoAtivo.innerHTML = Array.from(types.entries()).map(([id, label]) =>
      `<option value="${escapeHtml(id)}">${escapeHtml(label)}</option>`
    ).join('');
    renderCreateAssets();
    renderCreateTimes();
    createForm.elements.usuarioId.innerHTML = reservationOptions.users.map((user) =>
      `<option value="${user.id}">${escapeHtml(user.nome)}</option>`
    ).join('');
    createUserField.hidden = reservationOptions.users.length <= 1;
  }

  function renderCreateAssets() {
    const selectedType = String(createForm.elements.tipoAtivo.value);
    const assets = reservationOptions.assets.filter((asset) =>
      String(asset.tipo_id || asset.tipo) === selectedType
    );
    createForm.elements.ativoId.innerHTML = assets.map((asset) =>
      `<option value="${asset.id}">${escapeHtml(asset.identificador)}</option>`
    ).join('');
  }

  function renderCreateTimes() {
    createTimeChoices.innerHTML = reservationOptions.times.map((time) => `
      <label class="choice-card">
        <input type="checkbox" name="tempoIds" value="${time.id}">
        <span>${escapeHtml(time.identificador)} (${formatTime(time.hora_inicio)} - ${formatTime(time.hora_fim)})</span>
      </label>
    `).join('');
  }

  async function openCreateModal() {
    setCreateStatus('');
    createForm.elements.dataReserva.value = today();
    createForm.elements.dataReserva.min = today();

    if (!reservationOptions.assets.length || !reservationOptions.times.length) {
      reservationOptions = await requestJson('/api/reservas/opcoes');
      renderCreateOptions();
    } else {
      renderCreateTimes();
    }

    if (!reservationOptions.assets.length || !reservationOptions.times.length) {
      setCreateStatus('Nao ha ativos ou horarios disponiveis para reserva.', 'error');
    }
    createModal.showModal();
  }

  async function createReservation() {
    setCreateStatus('');
    const tempoIds = Array.from(createForm.querySelectorAll('input[name="tempoIds"]:checked')).map((input) => input.value);
    if (tempoIds.length === 0) {
      setCreateStatus('Selecione ao menos um horario.', 'error');
      return;
    }

    await requestJson('/api/reservas', {
      method: 'POST',
      body: JSON.stringify({
        dataReserva: createForm.elements.dataReserva.value,
        ativoIds: [createForm.elements.ativoId.value],
        tempoIds,
        usuarioId: createForm.elements.usuarioId.value
      })
    });

    createModal.close();
    filtersForm.elements.status.value = 'aceita';
    filtersForm.elements.dataInicial.value = createForm.elements.dataReserva.value;
    filtersForm.elements.dataFinal.value = '';
    currentPage = 1;
    await loadReservations();
    setStatus('Reserva criada com sucesso.', 'success');
    if (window.refreshNotificationsCount) {
      window.refreshNotificationsCount();
    }
  }

  filtersForm.addEventListener('submit', (event) => {
    event.preventDefault();
    currentPage = 1;
    loadReservations();
  });

  function scheduleFilterLoad() {
    window.clearTimeout(scheduleFilterLoad.timer);
    scheduleFilterLoad.timer = window.setTimeout(() => {
      currentPage = 1;
      loadReservations();
    }, 250);
  }

  filtersForm.querySelectorAll('input, select').forEach((field) => {
    field.addEventListener(field.type === 'search' ? 'input' : 'change', scheduleFilterLoad);
  });

  document.querySelector('[data-action="clear-my-reservations"]').addEventListener('click', () => {
    filtersForm.reset();
    filtersForm.elements.status.value = 'aceita';
    filtersForm.elements.dataInicial.value = today();
    filtersForm.elements.dataFinal.value = '';
    currentPage = 1;
    loadReservations();
  });

  document.querySelector('[data-action="my-prev-page"]').addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage -= 1;
      loadReservations();
    }
  });

  document.querySelector('[data-action="my-next-page"]').addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage += 1;
      loadReservations();
    }
  });

  tableBody.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (button) {
      if (button.dataset.action === 'details') {
        openDetails(button.dataset.id);
        return;
      }

      if (button.dataset.action === 'cancel') {
        requestCancellation(button.dataset.id);
      }
    }
  });

  document.querySelector('[data-action="close-my-reservation-details"]').addEventListener('click', () => {
    detailsModal.close();
  });

  document.querySelector('[data-action="open-my-reservation-create"]').addEventListener('click', () => {
    openCreateModal().catch((error) => setStatus(error.message, 'error'));
  });

  createForm.addEventListener('submit', (event) => {
    event.preventDefault();
    createReservation().catch((error) => setCreateStatus(error.message, 'error'));
  });

  createForm.elements.tipoAtivo.addEventListener('change', renderCreateAssets);

  document.querySelector('[data-action="close-my-reservation-create"]').addEventListener('click', () => {
    setCreateStatus('');
    createModal.close();
  });

  document.querySelector('[data-action="close-my-reservation-cancel"]').addEventListener('click', () => {
    reservationPendingCancellation = null;
    cancelModal.close();
  });

  document.querySelector('[data-action="confirm-my-reservation-cancel"]').addEventListener('click', () => {
    confirmCancellation().catch((error) => setStatus(error.message, 'error'));
  });

  cancelModal.addEventListener('cancel', (event) => {
    event.preventDefault();
    reservationPendingCancellation = null;
    cancelModal.close();
  });

  filtersForm.elements.status.value = 'aceita';
  filtersForm.elements.dataInicial.value = today();
  filtersForm.elements.dataFinal.value = '';
  loadReservations();
}());
