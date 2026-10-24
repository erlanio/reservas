const assert = require('node:assert/strict');
const test = require('node:test');
const {
  approveUser,
  countPendingUsers,
  createUser,
  deleteUser,
  hashPassword,
  listUsers,
  login,
  recoverPassword,
  restoreUser,
  updateUser
} = require('../app/services/userService');

test('hashPassword gera md5 da senha', () => {
  assert.equal(hashPassword('123456'), 'e10adc3949ba59abbe56e057f20f883e');
});

test('createUser cadastra usuario normal pendente de validacao', async () => {
  const calls = [];
  const db = {
    execute: async (sql, params) => {
      calls.push({ sql, params });
      return { affectedRows: 1 };
    }
  };

  const result = await createUser({
    nome: 'Maria Silva',
    email: 'MARIA@ESCOLA.COM',
    senha: 'abc123',
    dataNascimento: '1990-05-20'
  }, db);

  assert.equal(calls.length, 1);
  assert.match(calls[0].sql, /INSERT INTO usuarios/);
  assert.match(calls[0].sql, /'normal'/);
  assert.match(calls[0].sql, /0/);
  assert.equal(calls[0].params.email, 'maria@escola.com');
  assert.equal(calls[0].params.senha, hashPassword('abc123'));
  assert.match(result.message, /Aguarde a validacao/);
});

test('recoverPassword gera nova senha para email e data de nascimento validos', async () => {
  const calls = [];
  const db = {
    execute: async (sql, params) => {
      calls.push({ sql, params });
      if (/SELECT id/.test(sql)) {
        return [{ id: 7, email: params.email }];
      }
      return { affectedRows: 1 };
    }
  };

  const result = await recoverPassword({
    email: 'usuario@escola.com',
    dataNascimento: '1988-01-02'
  }, db);

  assert.equal(calls.length, 2);
  assert.match(calls[0].sql, /WHERE email = :email AND data_nascimento = :dataNascimento/);
  assert.match(calls[1].sql, /UPDATE usuarios/);
  assert.equal(calls[1].params.id, 7);
  assert.equal(calls[1].params.senha.length, 32);
  assert.equal(result.senhaTemporaria.length, 8);
});

test('login autentica usuario validado', async () => {
  const db = {
    execute: async () => [{
      id: 1,
      nome: 'Ana',
      email: 'ana@escola.com',
      senha: hashPassword('123456'),
      nivel_acesso: 'normal',
      validado: 1
    }]
  };

  const result = await login({
    email: 'ana@escola.com',
    senha: '123456'
  }, db);

  assert.equal(result.status, 'authenticated');
  assert.equal(result.user.email, 'ana@escola.com');
  assert.equal(result.user.nivelAcesso, 'normal');
});

test('login informa quando email nao existe', async () => {
  const db = {
    execute: async () => []
  };

  await assert.rejects(
    () => login({ email: 'naoexiste@escola.com', senha: '123456' }, db),
    { code: 'EMAIL_NOT_FOUND' }
  );
});

test('login informa senha incorreta para usuario existente', async () => {
  const db = {
    execute: async () => [{
      id: 1,
      nome: 'Ana',
      email: 'ana@escola.com',
      senha: hashPassword('correta'),
      nivel_acesso: 'normal',
      validado: 1
    }]
  };

  await assert.rejects(
    () => login({ email: 'ana@escola.com', senha: 'errada' }, db),
    { code: 'INVALID_PASSWORD' }
  );
});

test('login retorna pendencia e emails master para usuario nao validado', async () => {
  const db = {
    execute: async (sql) => {
      if (/SELECT id, nome, email/.test(sql)) {
        return [{
          id: 1,
          nome: 'Ana',
          email: 'ana@escola.com',
          senha: hashPassword('123456'),
          nivel_acesso: 'normal',
          validado: 0
        }];
      }

      return [{ email: 'master@escola.com' }];
    }
  };

  const result = await login({
    email: 'ana@escola.com',
    senha: '123456'
  }, db);

  assert.equal(result.status, 'pending');
  assert.deepEqual(result.masters, ['master@escola.com']);
});

test('listUsers pagina em blocos de 10 usuarios ordenados por nome desc', async () => {
  const calls = [];
  const db = {
    execute: async (sql, params) => {
      calls.push({ sql, params });
      if (/COUNT/.test(sql)) {
        return [{ total: 22 }];
      }
      return [{ id: 1, nome: 'Ana', email: 'ana@escola.com' }];
    }
  };

  const result = await listUsers({ page: 2, sort: 'desc' }, db);

  assert.match(calls[0].sql, /ORDER BY nome DESC/);
  assert.equal(calls[0].params.limit, 10);
  assert.equal(calls[0].params.offset, 10);
  assert.equal(result.pagination.sort, 'desc');
  assert.equal(result.pagination.totalPages, 3);
});

test('listUsers filtra usuarios pendentes quando solicitado', async () => {
  const calls = [];
  const db = {
    execute: async (sql, params) => {
      calls.push({ sql, params });
      if (/COUNT/.test(sql)) {
        return [{ total: 2 }];
      }
      return [{ id: 1, nome: 'Ana', email: 'ana@escola.com', validado: 0 }];
    }
  };

  const result = await listUsers({ page: 1, sort: 'asc', status: 'pendentes' }, db);

  assert.match(calls[0].sql, /validado = 0/);
  assert.match(calls[1].sql, /validado = 0/);
  assert.equal(result.pagination.total, 2);
});

test('countPendingUsers contabiliza somente usuarios nao validados ativos', async () => {
  const db = {
    execute: async (sql) => {
      assert.match(sql, /validado = 0/);
      assert.match(sql, /excluido_em IS NULL/);
      return [{ total: 3 }];
    }
  };

  const result = await countPendingUsers(db);
  assert.equal(result.quantidade, 3);
});

test('updateUser atualiza todos os dados permitidos incluindo senha', async () => {
  const calls = [];
  const db = {
    execute: async (sql, params) => {
      calls.push({ sql, params });
      return { affectedRows: 1 };
    }
  };

  await updateUser(5, {
    nome: 'Jose',
    email: 'JOSE@GMAIL.COM',
    senha: '123',
    dataNascimento: '2000-01-01',
    nivelAcesso: 'master',
    validado: true
  }, db);

  assert.match(calls[0].sql, /UPDATE usuarios/);
  assert.equal(calls[0].params.email, 'jose@gmail.com');
  assert.equal(calls[0].params.nivelAcesso, 'master');
  assert.equal(calls[0].params.validado, 1);
  assert.equal(calls[0].params.senha, hashPassword('123'));
});

test('updateUser mantem senha atual quando nova senha nao foi informada', async () => {
  const calls = [];
  const db = {
    execute: async (sql, params) => {
      calls.push({ sql, params });
      return { affectedRows: 1 };
    }
  };

  await updateUser(5, {
    nome: 'Jose',
    email: 'jose@gmail.com',
    senha: '',
    dataNascimento: '2000-01-01',
    nivelAcesso: 'normal',
    validado: true
  }, db);

  assert.match(calls[0].sql, /UPDATE usuarios/);
  assert.doesNotMatch(calls[0].sql, /senha = :senha/);
  assert.equal(calls[0].params.senha, undefined);
});

test('approveUser valida cadastro pendente', async () => {
  const calls = [];
  const db = {
    execute: async (sql, params) => {
      calls.push({ sql, params });
      if (/SELECT id, nome, email, excluido_em/.test(sql)) {
        return [{ id: 9, nome: 'Ana', email: 'ana@escola.com', excluido_em: null }];
      }

      return { affectedRows: 1 };
    }
  };

  const result = await approveUser(9, db);
  assert.ok(calls.some((call) => /SET validado = 1/.test(call.sql) && Number(call.params.id) === 9));
  assert.ok(calls.some((call) => /INSERT INTO notificacoes/.test(call.sql)));
  assert.match(result.message, /aprovado/);
});

test('deleteUser envia usuario para lixeira sem excluir definitivamente', async () => {
  const db = {
    execute: async (sql, params) => {
      assert.match(sql, /SET excluido_em = NOW/);
      assert.equal(params.id, 11);
      return { affectedRows: 1 };
    }
  };

  const result = await deleteUser(11, db);
  assert.match(result.message, /lixeira/);
});

test('restoreUser bloqueia recuperacao quando existe usuario ativo com mesmo email', async () => {
  const db = {
    execute: async (sql) => {
      if (/SELECT id, nome, email, excluido_em/.test(sql)) {
        return [{ id: 12, email: 'ana@escola.com', excluido_em: '2026-09-08 12:00:00' }];
      }

      if (/WHERE email = :email AND excluido_em IS NULL/.test(sql)) {
        return [{ id: 13 }];
      }

      return { affectedRows: 1 };
    }
  };

  await assert.rejects(
    () => restoreUser(12, db),
    { code: 'EMAIL_IN_USE' }
  );
});
