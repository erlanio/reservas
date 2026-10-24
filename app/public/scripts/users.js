const tableBody = document.querySelector('#usersTable');
const statusBox = document.querySelector('#usersStatus');
const pageInfo = document.querySelector('#pageInfo');
const editModal = document.querySelector('#editModal');
const editForm = document.querySelector('#editForm');
const confirmModal = document.querySelector('#confirmModal');
const confirmTitle = document.querySelector('#confirmTitle');
const confirmMessage = document.querySelector('#confirmMessage');
const confirmButton = document.querySelector('[data-action="confirm-action"]');
const cancelConfirmButton = document.querySelector('[data-action="cancel-confirm"]');
const sortLabel = document.querySelector('#sortLabel');

let currentPage = 1;
let totalPages = 1;
let currentView = new URLSearchParams(window.location.search).get('filtro') === 'pendentes' ? 'pendentes' : 'ativos';
let sortDirection = 'asc';
let users = [];
let pendingConfirmation = null;

function setStatus(message, type = '') {
  statusBox.className = type ? `status is-${type}` : 'status';
  statusBox.textContent = message;
}

function formatDate(value) {
  if (!value) {
    return '';
  }

  return String(value).slice(0, 10);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function userToEditPayload(form) {
  return {
    nome: form.nome.value,
    email: form.email.value,
    senha: form.senha.value,
    dataNascimento: form.dataNascimento.value,
    nivelAcesso: form.nivelAcesso.value,
    validado: form.validado.checked
  };
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

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...options
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Nao foi possivel concluir a solicitacao.');
  }

  return data;
}

function renderActions(user) {
  if (currentView === 'lixeira') {
    return `
      <button class="table-action icon-text" type="button" data-action="restore" data-id="${user.id}">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 12a9 9 0 1 0 3-6.7"></path>
          <path d="M3 3v6h6"></path>
        </svg>
        <span>Recuperar</span>
      </button>
    `;
  }

  const approveButton = user.validado
    ? ''
    : `
      <button class="table-action icon-text success-action" type="button" data-action="approve" data-id="${user.id}">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 6 9 17l-5-5"></path>
        </svg>
        <span>Aprovar</span>
      </button>
    `;

  return `
    ${approveButton}
    <button class="table-action icon-text" type="button" data-action="edit" data-id="${user.id}">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 20h9"></path>
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
      </svg>
      <span>Alterar</span>
    </button>
    <button class="table-action icon-text danger" type="button" data-action="delete" data-id="${user.id}">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 6h18"></path>
        <path d="M8 6V4h8v2"></path>
        <path d="M19 6l-1 14H6L5 6"></path>
        <path d="M10 11v5"></path>
        <path d="M14 11v5"></path>
      </svg>
      <span>Excluir</span>
    </button>
  `;
}

function renderUsers() {
  if (users.length === 0) {
    tableBody.innerHTML = '<tr class="empty-row"><td colspan="3">Nenhum usuario encontrado.</td></tr>';
    return;
  }

  tableBody.innerHTML = users.map((user) => `
    <tr>
      <td data-label="Nome">${escapeHtml(user.nome)}</td>
      <td data-label="Email">${escapeHtml(user.email)}</td>
      <td data-label="Opcoes"><div class="table-actions">${renderActions(user)}</div></td>
    </tr>
  `).join('');
}

async function loadUsers() {
  try {
    setStatus('Carregando...');

    if (currentView === 'lixeira') {
      const data = await requestJson('/api/admin/usuarios/lixeira');
      users = data.users;
      totalPages = 1;
      pageInfo.textContent = 'Lixeira';
    } else {
      const query = new URLSearchParams({ page: currentPage, sort: sortDirection });
      if (currentView === 'pendentes') {
        query.set('status', 'pendentes');
      }
      const data = await requestJson(`/api/admin/usuarios?${query.toString()}`);
      users = data.users;
      totalPages = data.pagination.totalPages;
      pageInfo.textContent = currentView === 'pendentes'
        ? `Pendentes - pagina ${data.pagination.page} de ${totalPages}`
        : `Pagina ${data.pagination.page} de ${totalPages}`;
    }

    renderUsers();
    setStatus('');
  } catch (error) {
    setStatus(error.message, 'error');
  }
}

function openEditModal(user) {
  editForm.elements.id.value = user.id;
  editForm.elements.nome.value = user.nome;
  editForm.elements.email.value = user.email;
  editForm.elements.senha.value = '';
  editForm.elements.dataNascimento.value = formatDate(user.data_nascimento);
  editForm.elements.nivelAcesso.value = user.nivel_acesso;
  editForm.elements.validado.checked = Boolean(user.validado);
  editModal.showModal();
}

async function handleTableAction(action, id) {
  try {
    const user = users.find((item) => String(item.id) === String(id));

    if (action === 'edit') {
      openEditModal(user);
      return;
    }

    if (action === 'approve') {
      await requestJson(`/api/admin/usuarios/${id}/aprovar`, { method: 'POST' });
      setStatus('Usuario aprovado com sucesso.', 'success');
      await loadUsers();
      if (window.refreshPendingUsersNotification) {
        window.refreshPendingUsersNotification();
      }
      if (window.refreshNotificationsCount) {
        window.refreshNotificationsCount();
      }
      return;
    }

    if (action === 'delete') {
      const confirmed = await askConfirmation({
        title: 'Excluir usuario',
        message: 'Este usuario ficara na lixeira por 30 dias e podera ser restaurado dentro desse periodo.',
        actionText: 'Excluir',
        danger: true
      });

      if (!confirmed) {
        return;
      }

      await requestJson(`/api/admin/usuarios/${id}`, { method: 'DELETE' });
      setStatus('Usuario enviado para a lixeira.', 'success');
      await loadUsers();
      if (window.refreshPendingUsersNotification) {
        window.refreshPendingUsersNotification();
      }
      return;
    }

    if (action === 'restore') {
      const confirmed = await askConfirmation({
        title: 'Recuperar usuario',
        message: 'Este usuario voltara para a lista de ativos se nao existir outro cadastro ativo com o mesmo email.',
        actionText: 'Recuperar'
      });

      if (!confirmed) {
        return;
      }

      await requestJson(`/api/admin/usuarios/${id}/restaurar`, { method: 'POST' });
      setStatus('Usuario restaurado com sucesso.', 'success');
      await loadUsers();
    }
  } catch (error) {
    setStatus(error.message, 'error');
  }
}

tableBody.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) {
    return;
  }

  handleTableAction(button.dataset.action, button.dataset.id);
});

editForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const confirmed = await askConfirmation({
    title: 'Salvar alteracoes',
    message: editForm.elements.senha.value
      ? 'Revise os dados antes de confirmar. A senha tambem sera atualizada.'
      : 'Revise os dados antes de confirmar. A senha atual sera mantida.',
    actionText: 'Salvar'
  });

  if (!confirmed) {
    return;
  }

  try {
    const id = editForm.elements.id.value;
    await requestJson(`/api/admin/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userToEditPayload(editForm))
    });
    editModal.close();
    setStatus('Usuario atualizado com sucesso.', 'success');
    await loadUsers();
  } catch (error) {
    setStatus(error.message, 'error');
  }
});

document.querySelector('[data-action="close-modal"]').addEventListener('click', () => {
  editModal.close();
});

confirmButton.addEventListener('click', () => resolveConfirmation(true));
cancelConfirmButton.addEventListener('click', () => resolveConfirmation(false));
confirmModal.addEventListener('cancel', (event) => {
  event.preventDefault();
  resolveConfirmation(false);
});

document.querySelector('[data-action="sort-name"]').addEventListener('click', () => {
  if (currentView === 'lixeira') {
    return;
  }

  sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
  sortLabel.textContent = sortDirection === 'asc' ? 'Nome A-Z' : 'Nome Z-A';
  currentPage = 1;
  loadUsers();
});

document.querySelector('[data-action="prev-page"]').addEventListener('click', () => {
  if (currentPage > 1 && currentView !== 'lixeira') {
    currentPage -= 1;
    loadUsers();
  }
});

document.querySelector('[data-action="next-page"]').addEventListener('click', () => {
  if (currentPage < totalPages && currentView !== 'lixeira') {
    currentPage += 1;
    loadUsers();
  }
});

document.querySelectorAll('.segment').forEach((button) => {
  button.addEventListener('click', () => {
    currentView = button.dataset.view;
    currentPage = 1;
    document.querySelectorAll('.segment').forEach((item) => {
      item.classList.toggle('is-active', item === button);
    });
    loadUsers();
  });
});

document.querySelectorAll('.segment').forEach((button) => {
  button.classList.toggle('is-active', button.dataset.view === currentView);
});

loadUsers();
