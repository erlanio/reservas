const { createNotificationSafely } = require('./notificationService');

const LIST_TYPES_SQL = `
  SELECT id, descricao
  FROM tipos_ativos
  WHERE excluido_em IS NULL
  ORDER BY descricao
`;

const CREATE_TYPE_SQL = `
  INSERT INTO tipos_ativos (descricao)
  VALUES (:descricao)
`;

const UPDATE_TYPE_SQL = `
  UPDATE tipos_ativos
  SET descricao = :descricao
  WHERE id = :id AND excluido_em IS NULL
`;

const DELETE_TYPE_SQL = `
  UPDATE tipos_ativos
  SET excluido_em = NOW()
  WHERE id = :id AND excluido_em IS NULL
`;

const LIST_ASSETS_BASE_SQL = `
  SELECT a.id,
         a.identificador,
         a.descricao,
         a.tipo_id,
         a.status,
         a.motivo_desativacao,
         a.descricao_desativacao,
         a.desativado_em,
         t.descricao AS tipo
  FROM ativos a
  INNER JOIN tipos_ativos t ON t.id = a.tipo_id
  WHERE a.excluido_em IS NULL
`;

const COUNT_ASSETS_BASE_SQL = `
  SELECT COUNT(*) AS total
  FROM ativos a
  WHERE a.excluido_em IS NULL
`;

const LIST_DELETED_ASSETS_SQL = `
  SELECT a.id, a.identificador, a.descricao, a.tipo_id, a.status, t.descricao AS tipo, a.excluido_em
  FROM ativos a
  INNER JOIN tipos_ativos t ON t.id = a.tipo_id
  WHERE a.excluido_em IS NOT NULL
    AND a.excluido_em >= DATE_SUB(NOW(), INTERVAL 30 DAY)
  ORDER BY a.excluido_em DESC
`;

const CREATE_ASSET_SQL = `
  INSERT INTO ativos (identificador, descricao, tipo_id)
  VALUES (:identificador, :descricao, :tipoId)
`;

const UPDATE_ASSET_SQL = `
  UPDATE ativos
  SET identificador = :identificador,
      descricao = :descricao,
      tipo_id = :tipoId
  WHERE id = :id AND excluido_em IS NULL
`;

const DELETE_ASSET_SQL = `
  UPDATE ativos
  SET excluido_em = NOW()
  WHERE id = :id AND excluido_em IS NULL
`;

const FIND_ASSET_BY_ID_SQL = `
  SELECT id, identificador, status, excluido_em
  FROM ativos
  WHERE id = :id
  LIMIT 1
`;

const FIND_FUTURE_RESERVATIONS_SQL = `
  SELECT COUNT(*) AS total, MIN(data_reserva) AS proxima_data
  FROM reservas
  WHERE ativo_id = :id
    AND cancelada_em IS NULL
    AND data_reserva >= CURDATE()
`;

const CANCEL_FUTURE_RESERVATIONS_SQL = `
  UPDATE reservas
  SET cancelada_em = NOW(),
      cancelada_por = :usuarioId,
      cancelada_por_desativacao_ativo = 1
  WHERE ativo_id = :id
    AND cancelada_em IS NULL
    AND data_reserva >= CURDATE()
`;

const LIST_FUTURE_RESERVATIONS_TO_CANCEL_SQL = `
  SELECT r.id,
         r.usuario_id,
         r.data_reserva,
         a.identificador AS ativo,
         t.identificador AS tempo,
         t.hora_inicio,
         t.hora_fim
  FROM reservas r
  INNER JOIN ativos a ON a.id = r.ativo_id
  INNER JOIN tempos t ON t.id = r.tempo_id
  WHERE r.ativo_id = :id
    AND r.cancelada_em IS NULL
    AND r.data_reserva >= CURDATE()
  ORDER BY r.data_reserva, t.hora_inicio
`;

const RESTORE_ASSET_DISABLED_RESERVATIONS_SQL = `
  UPDATE reservas
  SET cancelada_em = NULL,
      cancelada_por = NULL,
      cancelada_por_desativacao_ativo = 0
  WHERE ativo_id = :id
    AND cancelada_por_desativacao_ativo = 1
    AND cancelada_em IS NOT NULL
    AND data_reserva >= CURDATE()
`;

const DISABLE_ASSET_SQL = `
  UPDATE ativos
  SET status = 'desativado',
      motivo_desativacao = :motivo,
      descricao_desativacao = :descricao,
      desativado_em = NOW(),
      desativado_por = :usuarioId
  WHERE id = :id
    AND excluido_em IS NULL
    AND status = 'ativo'
`;

const REACTIVATE_ASSET_SQL = `
  UPDATE ativos
  SET status = 'ativo',
      motivo_desativacao = NULL,
      descricao_desativacao = NULL,
      desativado_em = NULL,
      desativado_por = NULL
  WHERE id = :id
    AND excluido_em IS NULL
    AND status = 'desativado'
`;

const INSERT_ASSET_HISTORY_SQL = `
  INSERT INTO ativos_historico (ativo_id, usuario_id, operacao, status_anterior, status_novo, motivo, descricao)
  VALUES (:ativoId, :usuarioId, :operacao, :statusAnterior, :statusNovo, :motivo, :descricao)
`;

const LIST_ASSET_HISTORY_SQL = `
  SELECT h.id,
         h.operacao,
         h.status_anterior,
         h.status_novo,
         h.motivo,
         h.descricao,
         h.data_hora,
         u.nome AS usuario
  FROM ativos_historico h
  INNER JOIN usuarios u ON u.id = h.usuario_id
  WHERE h.ativo_id = :id
  ORDER BY h.data_hora DESC, h.id DESC
`;

const FIND_ACTIVE_ASSET_BY_IDENTIFIER_SQL = `
  SELECT id
  FROM ativos
  WHERE identificador = :identificador AND excluido_em IS NULL
  LIMIT 1
`;

const RESTORE_ASSET_SQL = `
  UPDATE ativos
  SET excluido_em = NULL
  WHERE id = :id
    AND excluido_em IS NOT NULL
    AND excluido_em >= DATE_SUB(NOW(), INTERVAL 30 DAY)
`;

function required(data, fields) {
  const missing = fields.filter((field) => !data[field]);
  if (missing.length > 0) {
    const error = new Error('Preencha todos os campos obrigatorios.');
    error.code = 'VALIDATION_ERROR';
    throw error;
  }
}

function duplicateError(message) {
  const error = new Error(message);
  error.code = 'DUPLICATE_ENTRY';
  return error;
}

function normalizePage(page) {
  const parsed = Number(page);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

function normalizeText(value) {
  return String(value || '').trim();
}

function dateOnly(value) {
  if (!value) {
    return '';
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  return String(value).slice(0, 10);
}

function handleWriteError(error, message) {
  if (error && error.code === 'ER_DUP_ENTRY') {
    throw duplicateError(message);
  }

  throw error;
}

function normalizeReason(reason) {
  const normalized = normalizeText(reason).toLowerCase();
  const allowed = ['defeito', 'manutencao', 'reforma', 'outro'];
  if (!allowed.includes(normalized)) {
    const error = new Error('Informe um motivo valido para a desativacao.');
    error.code = 'VALIDATION_ERROR';
    throw error;
  }

  return normalized;
}

function notFoundError() {
  const error = new Error('Ativo nao encontrado.');
  error.code = 'ASSET_NOT_FOUND';
  return error;
}

async function listTypes(db) {
  return { types: await db.execute(LIST_TYPES_SQL) };
}

async function createType(data, db) {
  required(data, ['descricao']);

  try {
    await db.execute(CREATE_TYPE_SQL, { descricao: normalizeText(data.descricao) });
  } catch (error) {
    handleWriteError(error, 'Ja existe um tipo de ativo com esta descricao.');
  }

  return { message: 'Tipo de ativo cadastrado com sucesso.' };
}

async function updateType(id, data, db) {
  required(data, ['descricao']);

  try {
    await db.execute(UPDATE_TYPE_SQL, { id, descricao: normalizeText(data.descricao) });
  } catch (error) {
    handleWriteError(error, 'Ja existe um tipo de ativo com esta descricao.');
  }

  return { message: 'Tipo de ativo atualizado com sucesso.' };
}

async function deleteType(id, db) {
  await db.execute(DELETE_TYPE_SQL, { id });
  return { message: 'Tipo de ativo excluido com sucesso.' };
}

async function listAssets(options, db) {
  const page = normalizePage(options && options.page);
  const limit = 10;
  const offset = (page - 1) * limit;
  const tipoId = options && options.tipoId ? Number(options.tipoId) : null;
  const filter = tipoId ? ' AND a.tipo_id = :tipoId' : '';
  const params = { limit, offset };

  if (tipoId) {
    params.tipoId = tipoId;
  }

  const assets = await db.execute(
    `${LIST_ASSETS_BASE_SQL}${filter} ORDER BY a.identificador LIMIT :limit OFFSET :offset`,
    params
  );
  const countRows = await db.execute(`${COUNT_ASSETS_BASE_SQL}${filter}`, params);
  const total = Number(countRows[0].total);

  return {
    assets,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit))
    }
  };
}

async function listDeletedAssets(db) {
  return { assets: await db.execute(LIST_DELETED_ASSETS_SQL) };
}

async function createAsset(data, db) {
  required(data, ['identificador', 'tipoId']);

  try {
    await db.execute(CREATE_ASSET_SQL, {
      identificador: normalizeText(data.identificador),
      descricao: normalizeText(data.descricao),
      tipoId: data.tipoId
    });
  } catch (error) {
    handleWriteError(error, 'Ja existe um ativo com este identificador.');
  }

  return { message: 'Ativo cadastrado com sucesso.' };
}

async function updateAsset(id, data, db) {
  required(data, ['identificador', 'tipoId']);

  try {
    await db.execute(UPDATE_ASSET_SQL, {
      id,
      identificador: normalizeText(data.identificador),
      descricao: normalizeText(data.descricao),
      tipoId: data.tipoId
    });
  } catch (error) {
    handleWriteError(error, 'Ja existe um ativo com este identificador.');
  }

  return { message: 'Ativo atualizado com sucesso.' };
}

async function deleteAsset(id, db) {
  await db.execute(DELETE_ASSET_SQL, { id });
  return { message: 'Ativo enviado para a lixeira.' };
}

async function restoreAsset(id, db) {
  const assets = await db.execute(FIND_ASSET_BY_ID_SQL, { id });
  if (!assets || assets.length === 0 || !assets[0].excluido_em) {
    const error = new Error('Ativo excluido nao encontrado na lixeira.');
    error.code = 'DELETED_ASSET_NOT_FOUND';
    throw error;
  }

  const activeAssets = await db.execute(FIND_ACTIVE_ASSET_BY_IDENTIFIER_SQL, {
    identificador: assets[0].identificador
  });

  if (activeAssets && activeAssets.length > 0) {
    const error = new Error('Nao foi possivel recuperar: ja existe ativo com este identificador.');
    error.code = 'IDENTIFIER_IN_USE';
    throw error;
  }

  await db.execute(RESTORE_ASSET_SQL, { id });
  return { message: 'Ativo recuperado com sucesso.' };
}

async function deactivateAsset(id, data, user, db) {
  required(data, ['motivo']);
  const assets = await db.execute(FIND_ASSET_BY_ID_SQL, { id });
  if (!assets || assets.length === 0 || assets[0].excluido_em) {
    throw notFoundError();
  }

  if (assets[0].status === 'desativado') {
    const error = new Error('Este ativo ja esta desativado.');
    error.code = 'ASSET_ALREADY_DISABLED';
    throw error;
  }

  const motivo = normalizeReason(data.motivo);
  const descricao = normalizeText(data.descricao);
  if (motivo === 'outro' && !descricao) {
    const error = new Error('Informe a descricao quando o motivo for outro.');
    error.code = 'VALIDATION_ERROR';
    throw error;
  }

  const futureRows = await db.execute(FIND_FUTURE_RESERVATIONS_SQL, { id });
  const reservasFuturas = Number(futureRows[0].total);
  if (reservasFuturas > 0 && !data.confirmarReservasFuturas) {
    const error = new Error('Este ativo possui reservas futuras.');
    error.code = 'FUTURE_RESERVATIONS_CONFIRMATION_REQUIRED';
    error.details = {
      reservasFuturas,
      proximaData: futureRows[0].proxima_data
    };
    throw error;
  }

  let reservasCanceladas = 0;
  let reservasAfetadas = [];
  if (reservasFuturas > 0) {
    const reservationRows = await db.execute(LIST_FUTURE_RESERVATIONS_TO_CANCEL_SQL, { id });
    reservasAfetadas = Array.isArray(reservationRows) ? reservationRows : [];
    const result = await db.execute(CANCEL_FUTURE_RESERVATIONS_SQL, { id, usuarioId: user.id });
    reservasCanceladas = Number(result.affectedRows || reservasFuturas);
  }

  await db.execute(DISABLE_ASSET_SQL, {
    id,
    motivo,
    descricao,
    usuarioId: user.id
  });
  await db.execute(INSERT_ASSET_HISTORY_SQL, {
    ativoId: id,
    usuarioId: user.id,
    operacao: 'desativacao',
    statusAnterior: 'ativo',
    statusNovo: 'desativado',
    motivo,
    descricao
  });

  for (const reserva of reservasAfetadas) {
    await createNotificationSafely({
      usuarioId: reserva.usuario_id,
      tipo: 'reserva_cancelada',
      titulo: 'Reserva cancelada',
      mensagem: `A reserva #${reserva.id} de ${reserva.ativo} em ${dateOnly(reserva.data_reserva)}, ${reserva.tempo} foi cancelada por ${user.nome || 'usuario master'} devido a desativacao do ativo.`,
      referenciaTipo: 'reserva',
      referenciaId: reserva.id,
      eventKey: `reserva_cancelada:${reserva.id}`
    }, db);
  }

  return {
    message: reservasCanceladas > 0
      ? `Ativo desativado com sucesso. ${reservasCanceladas} reserva(s) futura(s) cancelada(s).`
      : 'Ativo desativado com sucesso.',
    reservasCanceladas
  };
}

async function reactivateAsset(id, user, db) {
  const assets = await db.execute(FIND_ASSET_BY_ID_SQL, { id });
  if (!assets || assets.length === 0 || assets[0].excluido_em) {
    throw notFoundError();
  }

  if (assets[0].status !== 'desativado') {
    const error = new Error('Este ativo ja esta ativo.');
    error.code = 'ASSET_ALREADY_ACTIVE';
    throw error;
  }

  await db.execute(REACTIVATE_ASSET_SQL, { id });
  const restoredReservations = await db.execute(RESTORE_ASSET_DISABLED_RESERVATIONS_SQL, { id });
  await db.execute(INSERT_ASSET_HISTORY_SQL, {
    ativoId: id,
    usuarioId: user.id,
    operacao: 'reativacao',
    statusAnterior: 'desativado',
    statusNovo: 'ativo',
    motivo: null,
    descricao: ''
  });

  const reservasRestauradas = Number(restoredReservations.affectedRows || 0);

  return {
    message: reservasRestauradas > 0
      ? `Ativo reativado com sucesso. ${reservasRestauradas} reserva(s) futura(s) restaurada(s).`
      : 'Ativo reativado com sucesso.',
    reservasRestauradas
  };
}

async function listAssetHistory(id, db) {
  const assets = await db.execute(FIND_ASSET_BY_ID_SQL, { id });
  if (!assets || assets.length === 0) {
    throw notFoundError();
  }

  return { history: await db.execute(LIST_ASSET_HISTORY_SQL, { id }) };
}

module.exports = {
  createAsset,
  createType,
  deactivateAsset,
  deleteAsset,
  deleteType,
  listAssetHistory,
  listAssets,
  listDeletedAssets,
  listTypes,
  reactivateAsset,
  restoreAsset,
  updateAsset,
  updateType,
  sql: {
    CANCEL_FUTURE_RESERVATIONS_SQL,
    DISABLE_ASSET_SQL,
    FIND_FUTURE_RESERVATIONS_SQL,
    INSERT_ASSET_HISTORY_SQL,
    LIST_FUTURE_RESERVATIONS_TO_CANCEL_SQL,
    LIST_ASSET_HISTORY_SQL,
    REACTIVATE_ASSET_SQL,
    RESTORE_ASSET_DISABLED_RESERVATIONS_SQL
  }
};
