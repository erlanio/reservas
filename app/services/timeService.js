const LIST_TIMES_SQL = `
  SELECT id, identificador, hora_inicio, hora_fim
  FROM tempos
  WHERE excluido_em IS NULL
  ORDER BY hora_inicio, hora_fim
`;

const LIST_DELETED_TIMES_SQL = `
  SELECT id, identificador, hora_inicio, hora_fim, excluido_em
  FROM tempos
  WHERE excluido_em IS NOT NULL
    AND excluido_em >= DATE_SUB(NOW(), INTERVAL 30 DAY)
  ORDER BY excluido_em DESC
`;

const FIND_OVERLAPPING_TIME_SQL = `
  SELECT id
  FROM tempos
  WHERE excluido_em IS NULL
    AND id <> :id
    AND :horaInicio < hora_fim
    AND :horaFim > hora_inicio
  LIMIT 1
`;

const CREATE_TIME_SQL = `
  INSERT INTO tempos (identificador, hora_inicio, hora_fim)
  VALUES (:identificador, :horaInicio, :horaFim)
`;

const UPDATE_TIME_SQL = `
  UPDATE tempos
  SET identificador = :identificador,
      hora_inicio = :horaInicio,
      hora_fim = :horaFim
  WHERE id = :id AND excluido_em IS NULL
`;

const DELETE_TIME_SQL = `
  UPDATE tempos
  SET excluido_em = NOW()
  WHERE id = :id AND excluido_em IS NULL
`;

const FIND_TIME_BY_ID_SQL = `
  SELECT id, identificador, excluido_em
  FROM tempos
  WHERE id = :id
  LIMIT 1
`;

const FIND_ACTIVE_TIME_BY_IDENTIFIER_SQL = `
  SELECT id
  FROM tempos
  WHERE identificador = :identificador AND excluido_em IS NULL
  LIMIT 1
`;

const RESTORE_TIME_SQL = `
  UPDATE tempos
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

function normalizeText(value) {
  return String(value || '').trim();
}

function normalizeTime(value) {
  const time = String(value || '').trim();
  if (!/^\d{2}:\d{2}$/.test(time) && !/^\d{2}:\d{2}:\d{2}$/.test(time)) {
    const error = new Error('Informe horarios validos.');
    error.code = 'VALIDATION_ERROR';
    throw error;
  }

  return time.length === 5 ? `${time}:00` : time;
}

function toMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function handleWriteError(error, message) {
  if (error && error.code === 'ER_DUP_ENTRY') {
    const duplicate = new Error(message);
    duplicate.code = 'DUPLICATE_ENTRY';
    throw duplicate;
  }

  throw error;
}

async function assertValidTimeRange(data, db, ignoredId = 0) {
  required(data, ['identificador', 'horaInicio', 'horaFim']);
  const horaInicio = normalizeTime(data.horaInicio);
  const horaFim = normalizeTime(data.horaFim);

  if (toMinutes(horaFim) <= toMinutes(horaInicio)) {
    const error = new Error('O horario de fim deve ser maior que o horario de inicio.');
    error.code = 'VALIDATION_ERROR';
    throw error;
  }

  const overlapping = await db.execute(FIND_OVERLAPPING_TIME_SQL, {
    id: ignoredId,
    horaInicio,
    horaFim
  });

  if (overlapping && overlapping.length > 0) {
    const error = new Error('Ja existe um tempo cadastrado neste intervalo.');
    error.code = 'TIME_OVERLAP';
    throw error;
  }

  return {
    identificador: normalizeText(data.identificador),
    horaInicio,
    horaFim
  };
}

async function listTimes(db) {
  return { times: await db.execute(LIST_TIMES_SQL) };
}

async function listDeletedTimes(db) {
  return { times: await db.execute(LIST_DELETED_TIMES_SQL) };
}

async function createTime(data, db) {
  const params = await assertValidTimeRange(data, db);

  try {
    await db.execute(CREATE_TIME_SQL, params);
  } catch (error) {
    handleWriteError(error, 'Ja existe um tempo com este identificador.');
  }

  return { message: 'Tempo cadastrado com sucesso.' };
}

async function updateTime(id, data, db) {
  const params = await assertValidTimeRange(data, db, Number(id));

  try {
    await db.execute(UPDATE_TIME_SQL, { ...params, id });
  } catch (error) {
    handleWriteError(error, 'Ja existe um tempo com este identificador.');
  }

  return { message: 'Tempo atualizado com sucesso.' };
}

async function deleteTime(id, db) {
  await db.execute(DELETE_TIME_SQL, { id });
  return { message: 'Tempo enviado para a lixeira.' };
}

async function restoreTime(id, db) {
  const times = await db.execute(FIND_TIME_BY_ID_SQL, { id });
  if (!times || times.length === 0 || !times[0].excluido_em) {
    const error = new Error('Tempo excluido nao encontrado na lixeira.');
    error.code = 'DELETED_TIME_NOT_FOUND';
    throw error;
  }

  const activeTimes = await db.execute(FIND_ACTIVE_TIME_BY_IDENTIFIER_SQL, {
    identificador: times[0].identificador
  });

  if (activeTimes && activeTimes.length > 0) {
    const error = new Error('Nao foi possivel recuperar: ja existe tempo ativo com este identificador.');
    error.code = 'IDENTIFIER_IN_USE';
    throw error;
  }

  await db.execute(RESTORE_TIME_SQL, { id });
  return { message: 'Tempo recuperado com sucesso.' };
}

module.exports = {
  createTime,
  deleteTime,
  listDeletedTimes,
  listTimes,
  restoreTime,
  updateTime,
  sql: {
    FIND_OVERLAPPING_TIME_SQL
  }
};
