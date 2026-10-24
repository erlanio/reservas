const assert = require('node:assert/strict');
const test = require('node:test');
const {
  createTime,
  deleteTime,
  restoreTime,
  updateTime,
  sql
} = require('../app/services/timeService');

test('createTime cadastra tempo valido sem sobreposicao', async () => {
  const calls = [];
  const db = {
    execute: async (query, params) => {
      calls.push({ query, params });
      if (/SELECT id/.test(query)) {
        return [];
      }
      return { affectedRows: 1 };
    }
  };

  const result = await createTime({
    identificador: '10o tempo',
    horaInicio: '16:40',
    horaFim: '17:30'
  }, db);

  assert.match(calls[0].query, /:horaInicio < hora_fim/);
  assert.match(calls[0].query, /:horaFim > hora_inicio/);
  assert.equal(calls[1].params.horaInicio, '16:40:00');
  assert.equal(calls[1].params.horaFim, '17:30:00');
  assert.match(result.message, /cadastrado/);
});

test('createTime bloqueia horario sobreposto', async () => {
  const db = {
    execute: async () => [{ id: 1 }]
  };

  await assert.rejects(
    () => createTime({ identificador: 'Extra', horaInicio: '08:30', horaFim: '09:10' }, db),
    { code: 'TIME_OVERLAP' }
  );
});

test('regra de sobreposicao permite fim e inicio no mesmo horario', () => {
  assert.match(sql.FIND_OVERLAPPING_TIME_SQL, /:horaInicio < hora_fim/);
  assert.match(sql.FIND_OVERLAPPING_TIME_SQL, /:horaFim > hora_inicio/);
});

test('updateTime valida e atualiza tempo', async () => {
  const calls = [];
  const db = {
    execute: async (query, params) => {
      calls.push({ query, params });
      if (/SELECT id/.test(query)) {
        return [];
      }
      return { affectedRows: 1 };
    }
  };

  const result = await updateTime(8, {
    identificador: '8o tempo',
    horaInicio: '15:00',
    horaFim: '15:50'
  }, db);

  assert.equal(calls[0].params.id, 8);
  assert.match(calls[1].query, /UPDATE tempos/);
  assert.match(result.message, /atualizado/);
});

test('deleteTime envia tempo para lixeira', async () => {
  const db = {
    execute: async (query, params) => {
      assert.match(query, /SET excluido_em = NOW/);
      assert.equal(params.id, 3);
      return { affectedRows: 1 };
    }
  };

  const result = await deleteTime(3, db);
  assert.match(result.message, /lixeira/);
});

test('restoreTime bloqueia recuperacao quando identificador esta em uso', async () => {
  const db = {
    execute: async (query) => {
      if (/SELECT id, identificador, excluido_em/.test(query)) {
        return [{ id: 5, identificador: '1o tempo', excluido_em: '2026-09-08 12:00:00' }];
      }

      if (/WHERE identificador = :identificador/.test(query)) {
        return [{ id: 1 }];
      }

      return { affectedRows: 1 };
    }
  };

  await assert.rejects(
    () => restoreTime(5, db),
    { code: 'IDENTIFIER_IN_USE' }
  );
});
