const assert = require('node:assert/strict');
const test = require('node:test');
const {
  countUnreadNotifications,
  createNotification,
  getNotification,
  listNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead
} = require('../app/services/notificationService');

const user = { id: 2, nome: 'Maria', nivelAcesso: 'normal' };

test('createNotification cria notificacao valida', async () => {
  const calls = [];
  const db = {
    execute: async (sql, params) => {
      calls.push({ sql, params });
      if (/FROM usuarios/.test(sql)) {
        return [{ id: 2 }];
      }

      return { affectedRows: 1, insertId: 10 };
    }
  };

  const result = await createNotification({
    usuarioId: 2,
    tipo: 'reserva_realizada',
    titulo: 'Reserva realizada',
    mensagem: 'Sua reserva foi registrada.',
    referenciaTipo: 'reserva',
    referenciaId: 8,
    eventKey: 'reserva_realizada:8'
  }, db);

  assert.equal(result.created, true);
  assert.ok(calls.some((call) => /INSERT INTO notificacoes/.test(call.sql)));
});

test('createNotification bloqueia tipo invalido', async () => {
  const db = { execute: async () => [] };

  await assert.rejects(
    () => createNotification({
      usuarioId: 2,
      tipo: 'invalida',
      titulo: 'Teste',
      mensagem: 'Mensagem'
    }, db),
    { code: 'VALIDATION_ERROR' }
  );
});

test('listNotifications filtra, pagina e ordena notificacoes do usuario', async () => {
  const calls = [];
  const db = {
    execute: async (sql, params) => {
      calls.push({ sql, params });
      if (/COUNT/.test(sql)) {
        return [{ total: 1 }];
      }

      return [{ id: 1, tipo: 'reserva_cancelada', lida: 0 }];
    }
  };

  const result = await listNotifications(user, {
    pagina: 1,
    limite: 10,
    tipo: 'reserva_cancelada',
    lida: 'false'
  }, db);

  assert.match(calls[0].sql, /usuario_id = :usuarioId/);
  assert.match(calls[0].sql, /tipo = :tipo/);
  assert.match(calls[0].sql, /lida = :lida/);
  assert.match(calls[0].sql, /ORDER BY created_at DESC, id DESC/);
  assert.equal(calls[0].params.usuarioId, 2);
  assert.equal(result.paginacao.total, 1);
});

test('countUnreadNotifications retorna quantidade nao lida', async () => {
  const db = {
    execute: async (sql, params) => {
      assert.match(sql, /lida = 0/);
      assert.equal(params.usuarioId, 2);
      return [{ quantidade: 4 }];
    }
  };

  const result = await countUnreadNotifications(user, db);
  assert.equal(result.quantidade, 4);
});

test('getNotification impede acesso a notificacao de outro usuario', async () => {
  const db = {
    execute: async () => [{ id: 3, usuarioId: 9 }]
  };

  await assert.rejects(
    () => getNotification(3, user, db),
    { code: 'FORBIDDEN' }
  );
});

test('markNotificationAsRead marca somente notificacao do usuario', async () => {
  const calls = [];
  const db = {
    execute: async (sql, params) => {
      calls.push({ sql, params });
      if (/FROM notificacoes/.test(sql)) {
        return [{ id: 3, usuarioId: 2 }];
      }

      return { affectedRows: 1 };
    }
  };

  const result = await markNotificationAsRead(3, user, db);

  assert.ok(calls.some((call) => /UPDATE notificacoes/.test(call.sql) && /usuario_id = :usuarioId/.test(call.sql)));
  assert.equal(result.notificacao.lida, true);
});

test('markAllNotificationsAsRead atualiza todas do usuario autenticado', async () => {
  const db = {
    execute: async (sql, params) => {
      assert.match(sql, /usuario_id = :usuarioId/);
      assert.equal(params.usuarioId, 2);
      return { affectedRows: 3 };
    }
  };

  const result = await markAllNotificationsAsRead(user, db);
  assert.equal(result.quantidadeAtualizada, 3);
});
