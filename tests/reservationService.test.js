const assert = require('node:assert/strict');
const test = require('node:test');
const {
  cancelReservation,
  createReservations,
  getMyReservation,
  listMyReservations,
  listReservations,
  updateReservation
} = require('../app/services/reservationService');

const master = { id: 1, nome: 'Jose', email: 'jose@gmail.com', nivelAcesso: 'master' };
const normal = { id: 2, nome: 'Maria', email: 'maria@gmail.com', nivelAcesso: 'normal' };

function today() {
  const now = new Date();
  return formatDate(now);
}

function yesterday() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return formatDate(date);
}

function tomorrow() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return formatDate(date);
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

test('createReservations cria uma reserva por ativo e tempo selecionado', async () => {
  const inserts = [];
  const db = {
    execute: async (query, params) => {
      if (/SELECT r\.id/.test(query)) {
        return [];
      }

      if (/FROM ativos/.test(query)) {
        return [{ id: params.id, status: 'ativo' }];
      }

      if (/FROM tempos/.test(query)) {
        return [{ id: params.id, hora_inicio: '23:00:00', hora_fim: '23:50:00' }];
      }

      if (/INSERT INTO reservas/.test(query)) {
        inserts.push(params);
        return { affectedRows: 1 };
      }

      if (/FROM usuarios/.test(query)) {
        return [{ id: params.id }];
      }

      return [];
    }
  };

  const result = await createReservations({
    dataReserva: tomorrow(),
    usuarioId: 2,
    ativoIds: [10, 11],
    tempoIds: [3, 4]
  }, master, db);

  assert.equal(result.created, 4);
  assert.deepEqual(inserts.map((item) => [item.usuarioId, item.ativoId, item.tempoId]), [
    [2, 10, 3],
    [2, 10, 4],
    [2, 11, 3],
    [2, 11, 4]
  ]);
});

test('createReservations bloqueia reserva duplicada de ativo no mesmo tempo e data', async () => {
  const db = {
    execute: async (query) => {
      if (/SELECT r\.id/.test(query)) {
        return [{ id: 9, ativo: 'Projetor 1', tempo: '1o tempo' }];
      }

      if (/FROM ativos/.test(query)) {
        return [{ id: 10, status: 'ativo' }];
      }

      if (/FROM tempos/.test(query)) {
        return [{ id: 3, hora_inicio: '23:00:00', hora_fim: '23:50:00' }];
      }

      return [];
    }
  };

  await assert.rejects(
    () => createReservations({
      dataReserva: tomorrow(),
      ativoIds: [10],
      tempoIds: [3]
    }, normal, db),
    { code: 'RESERVATION_CONFLICT' }
  );
});

test('createReservations bloqueia ativo desativado', async () => {
  const db = {
    execute: async (query) => {
      if (/FROM ativos/.test(query)) {
        return [{ id: 10, status: 'desativado' }];
      }

      return [];
    }
  };

  await assert.rejects(
    () => createReservations({
      dataReserva: tomorrow(),
      ativoIds: [10],
      tempoIds: [3]
    }, normal, db),
    { code: 'ASSET_UNAVAILABLE' }
  );
});

test('listReservations exige data e separa reservas ativas de canceladas', async () => {
  const calls = [];
  const db = {
    execute: async (query, params) => {
      calls.push({ query, params });
      return [];
    }
  };

  await assert.rejects(
    () => listReservations({}, db),
    { code: 'VALIDATION_ERROR' }
  );

  await listReservations({ dataReserva: today(), status: 'ativas' }, db);
  await listReservations({ dataReserva: today(), status: 'canceladas', ativoId: 10 }, db);

  assert.match(calls[0].query, /r\.cancelada_em IS NULL/);
  assert.match(calls[1].query, /r\.cancelada_em IS NOT NULL/);
  assert.equal(calls[1].params.ativoId, 10);
});

test('listReservations filtra reservas por tipo de ativo', async () => {
  const calls = [];
  const db = {
    execute: async (query, params) => {
      calls.push({ query, params });
      return [];
    }
  };

  await listReservations({ dataReserva: today(), status: 'ativas', tipoId: 2 }, db);

  assert.match(calls[0].query, /a\.tipo_id = :tipoId/);
  assert.equal(calls[0].params.tipoId, 2);
});

test('listMyReservations filtra apenas reservas do usuario autenticado', async () => {
  const calls = [];
  const db = {
    execute: async (query, params) => {
      calls.push({ query, params });
      if (/COUNT/.test(query)) {
        return [{ total: 1 }];
      }

      return [{
        id: 7,
        usuarioId: 2,
        dataReserva: '2026-09-10',
        tempoIdentificacao: '1o tempo',
        horaInicio: '07:20:00',
        horaFim: '08:10:00',
        status: 'aceita',
        ativoId: 4,
        ativoNome: 'Laboratorio 1',
        ativoIdentificacao: 'Laboratorio 1',
        ativoCategoria: 'Laboratorio',
        ativoStatus: 'ativo'
      }];
    }
  };

  const result = await listMyReservations(normal, {
    status: 'aceita',
    dataInicial: '2026-09-01',
    dataFinal: '2026-09-30',
    pesquisa: 'lab'
  }, db);

  assert.match(calls[0].query, /r\.usuario_id = :usuarioId/);
  assert.match(calls[0].query, /LIKE :pesquisa/);
  assert.match(calls[0].query, /ORDER BY r\.data_reserva ASC, t\.hora_inicio ASC, r\.id ASC/);
  assert.equal(calls[0].params.usuarioId, 2);
  assert.equal(calls[0].params.status, 'aceita');
  assert.equal(result.reservas[0].ativo.nome, 'Laboratorio 1');
  assert.equal(result.reservas[0].tempo.identificacao, '1o tempo');
  assert.equal(result.paginacao.total, 1);
});

test('listMyReservations usa data inicial de hoje como padrao quando periodo nao e informado', async () => {
  const calls = [];
  const db = {
    execute: async (query, params) => {
      calls.push({ query, params });
      if (/COUNT/.test(query)) {
        return [{ total: 0 }];
      }

      return [];
    }
  };

  await listMyReservations(normal, {}, db);

  assert.match(calls[0].query, /CASE[\s\S]*END\s*=\s*:status/);
  assert.match(calls[0].query, /r\.data_reserva >= CURDATE\(\)/);
  assert.equal(calls[0].params.status, 'aceita');
  assert.equal(calls[0].params.dataInicial, undefined);
  assert.equal(calls[0].params.dataFinal, undefined);
});

test('listMyReservations permite listar todas as situacoes quando solicitado', async () => {
  const calls = [];
  const db = {
    execute: async (query, params) => {
      calls.push({ query, params });
      if (/COUNT/.test(query)) {
        return [{ total: 0 }];
      }

      return [];
    }
  };

  await listMyReservations(normal, { status: 'todas' }, db);

  assert.doesNotMatch(calls[0].query, /END\s*=\s*:status/);
  assert.equal(calls[0].params.status, undefined);
});

test('listMyReservations valida periodo informado', async () => {
  const db = { execute: async () => [] };

  await assert.rejects(
    () => listMyReservations(normal, {
      dataInicial: '2026-09-30',
      dataFinal: '2026-09-01'
    }, db),
    { code: 'VALIDATION_ERROR' }
  );
});

test('getMyReservation retorna detalhes somente da reserva do usuario', async () => {
  const db = {
    execute: async (query, params) => {
      assert.match(query, /r\.usuario_id = :usuarioId/);
      assert.equal(params.usuarioId, 2);
      return [{
        id: 7,
        usuarioId: 2,
        dataReserva: '2026-09-10',
        horaInicio: '07:20:00',
        horaFim: '08:10:00',
        status: 'cancelada',
        canceladaPor: 'Maria',
        ativoId: 4,
        ativoNome: 'Projetor Epson',
        ativoIdentificacao: 'Projetor Epson',
        ativoCategoria: 'Projetor',
        ativoDescricao: 'HDMI',
        ativoStatus: 'ativo'
      }];
    }
  };

  const result = await getMyReservation(7, normal, db);
  assert.equal(result.reserva.id, 7);
  assert.equal(result.reserva.status, 'cancelada');
  assert.equal(result.reserva.ativo.categoria, 'Projetor');
});

test('getMyReservation bloqueia reserva inexistente ou de outro usuario', async () => {
  const db = {
    execute: async () => []
  };

  await assert.rejects(
    () => getMyReservation(99, normal, db),
    { code: 'RESERVATION_NOT_FOUND' }
  );
});

test('updateReservation impede usuario comum de alterar reserva de outro usuario', async () => {
  const db = {
    execute: async (query) => {
      if (/SELECT r\.id/.test(query)) {
        return [{ id: 7, usuario_id: 1, cancelada_em: null }];
      }

      if (/FROM tempos/.test(query)) {
        return [{ id: 3, hora_inicio: '23:00:00', hora_fim: '23:50:00' }];
      }

      return [];
    }
  };

  await assert.rejects(
    () => updateReservation(7, {
      dataReserva: today(),
      ativoId: 10,
      tempoId: 3
    }, normal, db),
    { code: 'FORBIDDEN' }
  );
});

test('createReservations bloqueia horario passado no dia atual', async () => {
  const db = {
    execute: async (query, params) => {
      if (/FROM ativos/.test(query)) {
        return [{ id: params.id, status: 'ativo' }];
      }

      if (/FROM tempos/.test(query)) {
        return [{ id: 3, hora_inicio: '00:00:00', hora_fim: '00:50:00' }];
      }

      return [];
    }
  };

  await assert.rejects(
    () => createReservations({
      dataReserva: today(),
      ativoIds: [10],
      tempoIds: [3]
    }, normal, db),
    { code: 'VALIDATION_ERROR' }
  );
});

test('createReservations bloqueia datas anteriores a hoje', async () => {
  const db = {
    execute: async () => []
  };

  await assert.rejects(
    () => createReservations({
      dataReserva: yesterday(),
      ativoIds: [10],
      tempoIds: [3]
    }, normal, db),
    { code: 'VALIDATION_ERROR' }
  );
});

test('cancelReservation registra cancelamento feito pelo dono da reserva', async () => {
  const updates = [];
  const db = {
    execute: async (query, params) => {
      if (/SELECT r\.id/.test(query)) {
        return [{
          id: 7,
          usuario_id: 2,
          cancelada_em: null,
          ativo: 'Projetor',
          tempo: '1o tempo',
          data_reserva: '2026-09-10'
        }];
      }

      if (/UPDATE reservas/.test(query)) {
        updates.push(params);
        return { affectedRows: 1 };
      }

      if (/FROM usuarios/.test(query)) {
        return [{ id: params.id }];
      }

      return [];
    }
  };

  const result = await cancelReservation(7, normal, db);

  assert.equal(updates[0].canceladaPor, 2);
  assert.match(result.message, /cancelada/);
});
