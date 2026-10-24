const assert = require('node:assert/strict');
const test = require('node:test');
const {
  createAsset,
  createType,
  deactivateAsset,
  deleteAsset,
  listAssetHistory,
  listAssets,
  reactivateAsset,
  restoreAsset,
  updateAsset,
  updateType
} = require('../app/services/assetService');

test('createType cadastra tipo de ativo', async () => {
  const db = {
    execute: async (sql, params) => {
      assert.match(sql, /INSERT INTO tipos_ativos/);
      assert.equal(params.descricao, 'Projetor');
      return { affectedRows: 1 };
    }
  };

  const result = await createType({ descricao: ' Projetor ' }, db);
  assert.match(result.message, /cadastrado/);
});

test('createType informa descricao duplicada', async () => {
  const db = {
    execute: async () => {
      const error = new Error('Duplicate entry');
      error.code = 'ER_DUP_ENTRY';
      throw error;
    }
  };

  await assert.rejects(
    () => createType({ descricao: 'Laboratorio' }, db),
    { code: 'DUPLICATE_ENTRY' }
  );
});

test('updateType altera descricao do tipo', async () => {
  const db = {
    execute: async (sql, params) => {
      assert.match(sql, /UPDATE tipos_ativos/);
      assert.equal(params.id, 4);
      assert.equal(params.descricao, 'Laboratorio');
      return { affectedRows: 1 };
    }
  };

  const result = await updateType(4, { descricao: 'Laboratorio' }, db);
  assert.match(result.message, /atualizado/);
});

test('listAssets pagina e filtra por tipo', async () => {
  const calls = [];
  const db = {
    execute: async (sql, params) => {
      calls.push({ sql, params });
      if (/COUNT/.test(sql)) {
        return [{ total: 11 }];
      }
      return [{ id: 1, identificador: 'LAB1', tipo: 'Laboratorio' }];
    }
  };

  const result = await listAssets({ page: 2, tipoId: 7 }, db);

  assert.match(calls[0].sql, /a.tipo_id = :tipoId/);
  assert.equal(calls[0].params.tipoId, 7);
  assert.equal(calls[0].params.limit, 10);
  assert.equal(calls[0].params.offset, 10);
  assert.equal(result.pagination.totalPages, 2);
});

test('createAsset cadastra ativo com identificador e tipo', async () => {
  const db = {
    execute: async (sql, params) => {
      assert.match(sql, /INSERT INTO ativos/);
      assert.equal(params.identificador, 'LAB1');
      assert.equal(params.tipoId, 2);
      return { affectedRows: 1 };
    }
  };

  const result = await createAsset({ identificador: ' LAB1 ', descricao: '', tipoId: 2 }, db);
  assert.match(result.message, /cadastrado/);
});

test('updateAsset altera dados do ativo', async () => {
  const db = {
    execute: async (sql, params) => {
      assert.match(sql, /UPDATE ativos/);
      assert.equal(params.id, 8);
      assert.equal(params.identificador, 'PROJ1');
      assert.equal(params.tipoId, 3);
      return { affectedRows: 1 };
    }
  };

  const result = await updateAsset(8, { identificador: 'PROJ1', descricao: 'Sala 2', tipoId: 3 }, db);
  assert.match(result.message, /atualizado/);
});

test('deleteAsset envia ativo para lixeira', async () => {
  const db = {
    execute: async (sql, params) => {
      assert.match(sql, /SET excluido_em = NOW/);
      assert.equal(params.id, 9);
      return { affectedRows: 1 };
    }
  };

  const result = await deleteAsset(9, db);
  assert.match(result.message, /lixeira/);
});

test('restoreAsset bloqueia recuperacao quando identificador esta em uso', async () => {
  const db = {
    execute: async (sql) => {
      if (/SELECT id, identificador, status/.test(sql)) {
        return [{ id: 6, identificador: 'LAB1', excluido_em: '2026-09-08 12:00:00' }];
      }

      if (/WHERE identificador = :identificador/.test(sql)) {
        return [{ id: 7 }];
      }

      return { affectedRows: 1 };
    }
  };

  await assert.rejects(
    () => restoreAsset(6, db),
    { code: 'IDENTIFIER_IN_USE' }
  );
});

test('deactivateAsset exige confirmacao quando existem reservas futuras', async () => {
  const db = {
    execute: async (sql) => {
      if (/SELECT id, identificador, status/.test(sql)) {
        return [{ id: 8, identificador: 'LAB1', status: 'ativo', excluido_em: null }];
      }

      if (/COUNT/.test(sql)) {
        return [{ total: 2, proxima_data: '2026-09-10' }];
      }

      return { affectedRows: 1 };
    }
  };

  await assert.rejects(
    () => deactivateAsset(8, { motivo: 'manutencao' }, { id: 1 }, db),
    { code: 'FUTURE_RESERVATIONS_CONFIRMATION_REQUIRED' }
  );
});

test('deactivateAsset cancela reservas futuras confirmadas e registra historico', async () => {
  const calls = [];
  const db = {
    execute: async (sql, params) => {
      calls.push({ sql, params });
      if (/SELECT id, identificador, status/.test(sql)) {
        return [{ id: 8, identificador: 'LAB1', status: 'ativo', excluido_em: null }];
      }

      if (/COUNT/.test(sql)) {
        return [{ total: 2, proxima_data: '2026-09-10' }];
      }

      if (/FROM reservas r/.test(sql)) {
        return [{
          id: 21,
          usuario_id: 2,
          data_reserva: '2026-09-10',
          ativo: 'LAB1',
          tempo: '1o tempo',
          hora_inicio: '07:20:00',
          hora_fim: '08:10:00'
        }];
      }

      if (/UPDATE reservas/.test(sql)) {
        return { affectedRows: 2 };
      }

      if (/FROM usuarios/.test(sql)) {
        return [{ id: params.id }];
      }

      return { affectedRows: 1 };
    }
  };

  const result = await deactivateAsset(8, {
    motivo: 'manutencao',
    descricao: 'Preventiva',
    confirmarReservasFuturas: true
  }, { id: 1 }, db);

  assert.ok(calls.some((call) => /UPDATE reservas/.test(call.sql)));
  assert.ok(calls.some((call) => /cancelada_por_desativacao_ativo = 1/.test(call.sql)));
  assert.ok(calls.some((call) => /INSERT INTO notificacoes/.test(call.sql)));
  assert.ok(calls.some((call) => /INSERT INTO ativos_historico/.test(call.sql)));
  assert.equal(result.reservasCanceladas, 2);
});

test('deactivateAsset exige descricao quando motivo for outro', async () => {
  const db = {
    execute: async (sql) => {
      if (/SELECT id, identificador, status/.test(sql)) {
        return [{ id: 8, identificador: 'LAB1', status: 'ativo', excluido_em: null }];
      }

      return [];
    }
  };

  await assert.rejects(
    () => deactivateAsset(8, { motivo: 'outro', descricao: '' }, { id: 1 }, db),
    { code: 'VALIDATION_ERROR' }
  );
});

test('reactivateAsset altera status e registra historico', async () => {
  const calls = [];
  const db = {
    execute: async (sql, params) => {
      calls.push({ sql, params });
      if (/SELECT id, identificador, status/.test(sql)) {
        return [{ id: 8, identificador: 'LAB1', status: 'desativado', excluido_em: null }];
      }

      if (/UPDATE reservas/.test(sql)) {
        return { affectedRows: 2 };
      }

      return { affectedRows: 1 };
    }
  };

  const result = await reactivateAsset(8, { id: 1 }, db);

  assert.ok(calls.some((call) => /UPDATE ativos/.test(call.sql) && /status = 'ativo'/.test(call.sql)));
  assert.ok(calls.some((call) => /UPDATE reservas/.test(call.sql) && /cancelada_por_desativacao_ativo = 0/.test(call.sql)));
  assert.ok(calls.some((call) => /INSERT INTO ativos_historico/.test(call.sql)));
  assert.match(result.message, /reativado/);
  assert.equal(result.reservasRestauradas, 2);
});

test('listAssetHistory retorna historico do ativo', async () => {
  const db = {
    execute: async (sql) => {
      if (/SELECT id, identificador, status/.test(sql)) {
        return [{ id: 8, identificador: 'LAB1', status: 'ativo', excluido_em: null }];
      }

      if (/FROM ativos_historico/.test(sql)) {
        return [{ id: 1, operacao: 'desativacao' }];
      }

      return [];
    }
  };

  const result = await listAssetHistory(8, db);
  assert.equal(result.history.length, 1);
});
