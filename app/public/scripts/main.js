const shell = document.querySelector('.shell');
let failedLoginAttempts = 0;

function showLogin() {
  shell.classList.remove('show-pending');
}

function formToJson(form) {
  return Object.fromEntries(new FormData(form).entries());
}

async function submitForm(form) {
  const status = form.querySelector('.status');
  status.className = 'status';
  status.textContent = 'Enviando...';

  try {
    const response = await fetch(form.dataset.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formToJson(form))
    });

    const data = await response.json();

    if (!response.ok) {
      const requestError = new Error(data.error || 'Nao foi possivel concluir a solicitacao.');
      requestError.code = data.code;
      throw requestError;
    }

    if (form.dataset.kind === 'login') {
      handleLogin(data);
      return;
    }

    status.classList.add('is-success');
    status.textContent = data.senhaTemporaria
      ? `${data.message} Senha temporaria: ${data.senhaTemporaria}`
      : data.message;
    form.reset();
  } catch (error) {
    if (form.dataset.kind === 'login') {
      failedLoginAttempts += 1;
      if (failedLoginAttempts >= 3) {
        window.location.href = '/recuperar-senha.html';
        return;
      }
    }

    status.classList.add('is-error');
    status.textContent = error.message;
  }
}

function handleLogin(data) {
  failedLoginAttempts = 0;

  if (data.status === 'pending') {
    const list = document.querySelector('#masterEmails');
    list.innerHTML = '';

    if (data.masters && data.masters.length > 0) {
      data.masters.forEach((email) => {
        const item = document.createElement('li');
        item.textContent = email;
        list.appendChild(item);
      });
    } else {
      const item = document.createElement('li');
      item.className = 'is-empty';
      item.textContent = 'Nenhum usuario master cadastrado.';
      list.appendChild(item);
    }

    shell.classList.add('show-pending');
    return;
  }

  window.location.href = data.user && data.user.nivelAcesso === 'master'
    ? '/dashboard'
    : '/minhas-reservas';
}

document.querySelectorAll('form').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    submitForm(form);
  });
});

document.querySelectorAll('[data-action="logout"], [data-action="back-login"]').forEach((button) => {
  button.addEventListener('click', showLogin);
});
