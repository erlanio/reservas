const { createNotificationSafely } = require('./notificationService');

const LIST_RESERVATION_OPTIONS_SQL = {
  assets: `
    SELECT a.id,
           a.identificador,
           t.descricao AS tipo,
           t.id AS tipo_id
    FROM ativos a
    INNER JOIN tipos_ativos t ON t.id = a.tipo_id
    WHERE a.excluido_em IS NULL
      AND a.status = 'ativo'
    ORDER BY t.descricao, a.identificador
  `,
  times: `
    SELECT id, identificador, hora_inicio, hora_fim
    FROM tempos
    WHERE excluido_em IS NULL
    ORDER BY hora_inicio, hora_fim
  `,
  users: `
    SELECT id, nome, email
    FROM usuarios
    WHERE validado = 1 AND excluido_em IS NULL
    ORDER BY nome
  `
};

const LIST_RESERVATIONS_BASE_SQL = `
  SELECT r.id,
         r.usuario_id,
         u.nome AS usuario,
         a.identificador AS ativo,
         a.id AS ativo_id,
         tipo.id AS tipo_id,
         tipo.descricao AS tipo,
         t.identificador AS tempo,
         t.id AS tempo_id,
         t.hora_inicio,
         t.hora_fim,
         r.data_reserva,
         r.cancelada_em,
         cancelador.nome AS cancelada_por_nome
  FROM reservas r
  INNER JOIN usuarios u ON u.id = r.usuario_id
  INNER JOIN ativos a ON a.id = r.ativo_id
  INNER JOIN tipos_ativos tipo ON tipo.id = a.tipo_id
  INNER JOIN tempos t ON t.id = r.tempo_id
  LEFT JOIN usuarios cancelador ON cancelador.id = r.cancelada_por
  WHERE r.data_reserva = :dataReserva
`;

const RESERVATION_STATUS_SQL = `
  CASE
    WHEN r.cancelada_em IS NOT NULL THEN 'cancelada'
    WHEN r.data_reserva < CURDATE()
      OR (r.data_reserva = CURDATE() AND t.hora_fim < CURTIME()) THEN 'concluida'
    ELSE 'aceita'
  END
`;

const LIST_MY_RESERVATIONS_BASE_SQL = `
  SELECT r.id,
         r.usuario_id AS usuarioId,
         r.ativo_id AS ativoId,
         r.tempo_id AS tempoId,
         r.data_reserva AS dataReserva,
         t.identificador AS tempoIdentificacao,
         t.hora_inicio AS horaInicio,
         t.hora_fim AS horaFim,
         '' AS finalidade,
         '' AS observacoes,
         ${RESERVATION_STATUS_SQL} AS status,
         r.cancelada_em AS canceladaEm,
         cancelador.nome AS canceladaPor,
         r.criada_em AS createdAt,
         r.atualizada_em AS updatedAt,
         a.id AS ativoId,
         a.identificador AS ativoNome,
         a.identificador AS ativoIdentificacao,
         a.descricao AS ativoDescricao,
         a.status AS ativoStatus,
         tipo.descricao AS ativoCategoria
  FROM reservas r
  INNER JOIN ativos a ON a.id = r.ativo_id
  INNER JOIN tipos_ativos tipo ON tipo.id = a.tipo_id
  INNER JOIN tempos t ON t.id = r.tempo_id
  LEFT JOIN usuarios cancelador ON cancelador.id = r.cancelada_por
  WHERE r.usuario_id = :usuarioId
`;

const COUNT_MY_RESERVATIONS_BASE_SQL = `
  SELECT COUNT(*) AS total
  FROM reservas r
  INNER JOIN ativos a ON a.id = r.ativo_id
  INNER JOIN tipos_ativos tipo ON tipo.id = a.tipo_id
  INNER JOIN tempos t ON t.id = r.tempo_id
  WHERE r.usuario_id = :usuarioId
`;

const FIND_MY_RESERVATION_SQL = `
  ${LIST_MY_RESERVATIONS_BASE_SQL}
    AND r.id = :id
  LIMIT 1
`;

const FIND_ACTIVE_CONFLICT_SQL = `
  SELECT r.id, a.identificador AS ativo, t.identificador AS tempo
  FROM reservas r
  INNER JOIN ativos a ON a.id = r.ativo_id
  INNER JOIN tempos t ON t.id = r.tempo_id
  WHERE r.cancelada_em IS NULL
    AND r.data_reserva = :dataReserva
    AND r.ativo_id = :ativoId
    AND r.tempo_id = :tempoId
    AND r.id <> :ignoredId
  LIMIT 1
`;

const FIND_ACTIVE_ASSET_SQL = `
  SELECT id, identificador, status
  FROM ativos
  WHERE id = :id
    AND excluido_em IS NULL
  LIMIT 1
`;

const FIND_TIME_SQL = `
  SELECT id, identificador, hora_inicio, hora_fim
  FROM tempos
  WHERE id = :id AND excluido_em IS NULL
  LIMIT 1
`;

const CREATE_RESERVATION_SQL = `
  INSERT INTO reservas (usuario_id, ativo_id, tempo_id, data_reserva)
  VALUES (:usuarioId, :ativoId, :tempoId, :dataReserva)
`;

const UPDATE_RESERVATION_SQL = `
  UPDATE reservas
  SET usuario_id = :usuarioId,
      ativo_id = :ativoId,
      tempo_id = :tempoId,
      data_reserva = :dataReserva
  WHERE id = :id AND cancelada_em IS NULL
`;

const FIND_RESERVATION_OWNER_SQL = `
  SELECT r.id,
         r.usuario_id,
         r.ativo_id,
         r.tempo_id,
         r.data_reserva,
         r.cancelada_em,
         a.identificador AS ativo,
         t.identificador AS tempo,
         t.hora_inicio,
         t.hora_fim
  FROM reservas r
  INNER JOIN ativos a ON a.id = r.ativo_id
  INNER JOIN tempos t ON t.id = r.tempo_id
  WHERE r.id = :id
  LIMIT 1
`;

const CANCEL_RESERVATION_SQL = `
  UPDATE reservas
  SET cancelada_em = NOW(),
      cancelada_por = :canceladaPor
  WHERE id = :id AND cancelada_em IS NULL
`;

function required(data, fields) {
  const missing = fields.filter((field) => !data[field]);
  if (missing.length > 0) {
    const error = new Error('Preencha todos os campos obrigatorios.');
    error.code = 'VALIDATION_ERROR';
    throw error;
  }
}

function normalizeDate(value) {
  const date = String(value || '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const error = new Error('Informe uma data valida para consultar reservas.');
    error.code = 'VALIDATION_ERROR';
    throw error;
  }

  return date;
}

function todayDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
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

function normalizeReservationDate(value) {
  const date = normalizeDate(value);
  if (date < todayDate()) {
    const error = new Error('Nao e permitido reservar ativos em datas anteriores a hoje.');
    error.code = 'VALIDATION_ERROR';
    throw error;
  }

  return date;
}

function currentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}

function normalizeIds(value, fieldName) {
  const values = Array.isArray(value) ? value : [value];
  const ids = values.map(Number).filter((id) => Number.isInteger(id) && id > 0);

  if (ids.length === 0) {
    const error = new Error(`Selecione ${fieldName}.`);
    error.code = 'VALIDATION_ERROR';
    throw error;
  }

  return [...new Set(ids)];
}

function normalizeId(value, fieldName) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    const error = new Error(`Informe ${fieldName} valido.`);
    error.code = 'VALIDATION_ERROR';
    throw error;
  }

  return id;
}

function normalizeOptionalDate(value, fieldName) {
  if (!value) {
    return null;
  }

  try {
    return normalizeDate(value);
  } catch (error) {
    error.message = `Informe uma ${fieldName} valida.`;
    throw error;
  }
}

function normalizeStatus(value) {
  if (!value) {
    return null;
  }

  const status = String(value).trim().toLowerCase();
  if (status === 'todas' || status === 'todos' || status === 'all') {
    return null;
  }

  const allowed = ['aceita', 'concluida', 'cancelada'];
  if (!allowed.includes(status)) {
    const error = new Error('Situacao de reserva invalida.');
    error.code = 'VALIDATION_ERROR';
    throw error;
  }

  return status;
}

function normalizeMyReservationPage(value) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function normalizeMyReservationLimit(value) {
  const limit = Number(value);
  return Number.isInteger(limit) && limit > 0 && limit <= 50 ? limit : 10;
}

function buildMyReservationsFilters(filters, params) {
  const clauses = [];
  const hasStatusFilter = filters && Object.prototype.hasOwnProperty.call(filters, 'status');
  const status = hasStatusFilter ? normalizeStatus(filters.status) : 'aceita';
  const dataInicial = normalizeOptionalDate(filters && filters.dataInicial, 'data inicial');
  const dataFinal = normalizeOptionalDate(filters && filters.dataFinal, 'data final');
  const pesquisa = String((filters && filters.pesquisa) || '').trim();

  if (dataInicial && dataFinal && dataInicial > dataFinal) {
    const error = new Error('A data inicial deve ser anterior ou igual a data final.');
    error.code = 'VALIDATION_ERROR';
    throw error;
  }

  if (status) {
    clauses.push(`${RESERVATION_STATUS_SQL} = :status`);
    params.status = status;
  }

  if (dataInicial) {
    clauses.push('r.data_reserva >= :dataInicial');
    params.dataInicial = dataInicial;
  }

  if (dataFinal) {
    clauses.push('r.data_reserva <= :dataFinal');
    params.dataFinal = dataFinal;
  }

  if (!dataInicial && !dataFinal) {
    clauses.push('r.data_reserva >= CURDATE()');
  }

  if (pesquisa) {
    clauses.push('(a.identificador LIKE :pesquisa OR tipo.descricao LIKE :pesquisa)');
    params.pesquisa = `%${pesquisa}%`;
  }

  return clauses.length ? ` AND ${clauses.join(' AND ')}` : '';
}

function canManageReservation(user, reservation) {
  return user.nivelAcesso === 'master' || Number(user.id) === Number(reservation.usuario_id);
}

async function listOptions(user, db) {
  const [assets, times] = await Promise.all([
    db.execute(LIST_RESERVATION_OPTIONS_SQL.assets),
    db.execute(LIST_RESERVATION_OPTIONS_SQL.times)
  ]);

  const users = user.nivelAcesso === 'master'
    ? await db.execute(LIST_RESERVATION_OPTIONS_SQL.users)
    : [{ id: user.id, nome: user.nome, email: user.email }];

  return { assets, times, users };
}

async function listReservations(filters, db) {
  required(filters, ['dataReserva']);
  const dataReserva = normalizeDate(filters.dataReserva);
  const params = { dataReserva };
  const activeOnly = filters.status !== 'canceladas';
  let sql = LIST_RESERVATIONS_BASE_SQL;

  if (activeOnly) {
    sql += ' AND r.cancelada_em IS NULL';
  } else {
    sql += ' AND r.cancelada_em IS NOT NULL';
  }

  if (filters.ativoId) {
    params.ativoId = normalizeId(filters.ativoId, 'um ativo');
    sql += ' AND r.ativo_id = :ativoId';
  }

  if (filters.tipoId) {
    params.tipoId = normalizeId(filters.tipoId, 'um tipo de ativo');
    sql += ' AND a.tipo_id = :tipoId';
  }

  sql += ' ORDER BY t.hora_inicio, a.identificador, u.nome';

  return { reservations: await db.execute(sql, params) };
}

function mapMyReservation(row) {
  return {
    id: row.id,
    usuarioId: row.usuarioId,
    dataReserva: dateOnly(row.dataReserva),
    horaInicio: row.horaInicio,
    horaFim: row.horaFim,
    finalidade: row.finalidade || '',
    observacoes: row.observacoes || '',
    status: row.status,
    canceladaEm: row.canceladaEm,
    canceladaPor: row.canceladaPor || '',
    motivoCancelamento: row.canceladaEm ? `Cancelada por ${row.canceladaPor || 'usuario'}.` : '',
    motivoRejeicao: '',
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    tempo: {
      id: row.tempoId,
      identificacao: row.tempoIdentificacao
    },
    ativo: {
      id: row.ativoId,
      nome: row.ativoNome,
      identificacao: row.ativoIdentificacao,
      categoria: row.ativoCategoria,
      descricao: row.ativoDescricao || '',
      status: row.ativoStatus
    }
  };
}

async function listMyReservations(user, filters, db) {
  const page = normalizeMyReservationPage(filters && (filters.pagina || filters.page));
  const limit = normalizeMyReservationLimit(filters && (filters.limite || filters.limit));
  const offset = (page - 1) * limit;
  const params = { usuarioId: user.id, limit, offset };
  const filterSql = buildMyReservationsFilters(filters || {}, params);
  const rows = await db.execute(
    `${LIST_MY_RESERVATIONS_BASE_SQL}${filterSql} ORDER BY r.data_reserva ASC, t.hora_inicio ASC, r.id ASC LIMIT :limit OFFSET :offset`,
    params
  );
  const totals = await db.execute(`${COUNT_MY_RESERVATIONS_BASE_SQL}${filterSql}`, params);
  const total = Number(totals[0].total);

  return {
    reservas: rows.map(mapMyReservation),
    paginacao: {
      pagina: page,
      limite: limit,
      total,
      totalPaginas: Math.max(1, Math.ceil(total / limit))
    }
  };
}

async function getMyReservation(id, user, db) {
  const reservaId = normalizeId(id, 'uma reserva');
  const rows = await db.execute(FIND_MY_RESERVATION_SQL, { id: reservaId, usuarioId: user.id });
  if (!rows || rows.length === 0) {
    const error = new Error('Reserva nao encontrada ou sem permissao de acesso.');
    error.code = 'RESERVATION_NOT_FOUND';
    throw error;
  }

  return { reserva: mapMyReservation(rows[0]) };
}

async function assertAvailable(dataReserva, ativoId, tempoId, db, ignoredId = 0) {
  const conflicts = await db.execute(FIND_ACTIVE_CONFLICT_SQL, {
    dataReserva,
    ativoId,
    tempoId,
    ignoredId
  });

  if (conflicts && conflicts.length > 0) {
    const error = new Error(`O ativo ${conflicts[0].ativo} ja esta reservado no tempo ${conflicts[0].tempo}.`);
    error.code = 'RESERVATION_CONFLICT';
    throw error;
  }
}

async function assertAssetCanBeReserved(ativoId, db) {
  const assets = await db.execute(FIND_ACTIVE_ASSET_SQL, { id: ativoId });
  if (!assets || assets.length === 0 || assets[0].status !== 'ativo') {
    const error = new Error('Este ativo esta indisponivel para novas reservas.');
    error.code = 'ASSET_UNAVAILABLE';
    throw error;
  }

  return assets[0];
}

async function assertTimeCanBeReserved(dataReserva, tempoId, db) {
  const times = await db.execute(FIND_TIME_SQL, { id: tempoId });
  if (!times || times.length === 0) {
    const error = new Error('Tempo nao encontrado.');
    error.code = 'VALIDATION_ERROR';
    throw error;
  }

  if (dataReserva === todayDate() && String(times[0].hora_inicio) <= currentTime()) {
    const error = new Error('Nao e permitido reservar horarios que ja passaram.');
    error.code = 'VALIDATION_ERROR';
    throw error;
  }

  return times[0];
}

function formatReservationSummary({ id, ativo, tempo, dataReserva, horaInicio, horaFim }) {
  return `Reserva #${id}: ${ativo} em ${dataReserva}, ${tempo} (${String(horaInicio).slice(0, 5)} - ${String(horaFim).slice(0, 5)}).`;
}

async function createReservations(data, user, db) {
  required(data, ['dataReserva', 'ativoIds', 'tempoIds']);
  const dataReserva = normalizeReservationDate(data.dataReserva);
  const ativoIds = normalizeIds(data.ativoIds, 'ao menos um ativo');
  const tempoIds = normalizeIds(data.tempoIds, 'ao menos um tempo');
  const usuarioId = user.nivelAcesso === 'master' && data.usuarioId
    ? normalizeId(data.usuarioId, 'um usuario')
    : Number(user.id);
  let created = 0;

  for (const ativoId of ativoIds) {
    const asset = await assertAssetCanBeReserved(ativoId, db);
    for (const tempoId of tempoIds) {
      const time = await assertTimeCanBeReserved(dataReserva, tempoId, db);
      await assertAvailable(dataReserva, ativoId, tempoId, db);
      try {
        const result = await db.execute(CREATE_RESERVATION_SQL, { usuarioId, ativoId, tempoId, dataReserva });
        const reservaId = result.insertId || 0;
        created += 1;
        await createNotificationSafely({
          usuarioId,
          tipo: 'reserva_realizada',
          titulo: 'Reserva realizada',
          mensagem: formatReservationSummary({
            id: reservaId || 'nova',
            ativo: asset.identificador,
            tempo: time.identificador,
            dataReserva,
            horaInicio: time.hora_inicio,
            horaFim: time.hora_fim
          }),
          referenciaTipo: 'reserva',
          referenciaId: reservaId || null,
          eventKey: reservaId ? `reserva_realizada:${reservaId}` : null
        }, db);
      } catch (error) {
        if (error && error.code === 'ER_DUP_ENTRY') {
          const conflict = new Error('Este ativo ja esta reservado neste tempo e data.');
          conflict.code = 'RESERVATION_CONFLICT';
          throw conflict;
        }

        throw error;
      }
    }
  }

  return { message: `${created} reserva(s) criada(s) com sucesso.`, created };
}

async function updateReservation(id, data, user, db) {
  required(data, ['dataReserva', 'ativoId', 'tempoId']);
  const reservations = await db.execute(FIND_RESERVATION_OWNER_SQL, { id });
  if (!reservations || reservations.length === 0 || reservations[0].cancelada_em) {
    const error = new Error('Reserva ativa nao encontrada.');
    error.code = 'RESERVATION_NOT_FOUND';
    throw error;
  }

  if (!canManageReservation(user, reservations[0])) {
    const error = new Error('Voce nao pode alterar esta reserva.');
    error.code = 'FORBIDDEN';
    throw error;
  }

  const dataReserva = normalizeReservationDate(data.dataReserva);
  const ativoId = normalizeId(data.ativoId, 'um ativo');
  const tempoId = normalizeId(data.tempoId, 'um tempo');
  const usuarioId = user.nivelAcesso === 'master' && data.usuarioId
    ? normalizeId(data.usuarioId, 'um usuario')
    : reservations[0].usuario_id;
  const changed = dateOnly(reservations[0].data_reserva) !== dataReserva
    || Number(reservations[0].ativo_id) !== ativoId
    || Number(reservations[0].tempo_id) !== tempoId
    || Number(reservations[0].usuario_id) !== usuarioId;

  const asset = await assertAssetCanBeReserved(ativoId, db);
  await assertAvailable(dataReserva, ativoId, tempoId, db, Number(id));
  const time = await assertTimeCanBeReserved(dataReserva, tempoId, db);
  await db.execute(UPDATE_RESERVATION_SQL, { id, usuarioId, ativoId, tempoId, dataReserva });
  if (changed) {
    await createNotificationSafely({
      usuarioId,
      tipo: 'reserva_alterada',
      titulo: 'Reserva alterada',
      mensagem: `Sua reserva #${id} foi alterada para ${asset.identificador} em ${dataReserva}, ${time.identificador} (${String(time.hora_inicio).slice(0, 5)} - ${String(time.hora_fim).slice(0, 5)}).`,
      referenciaTipo: 'reserva',
      referenciaId: id,
      eventKey: `reserva_alterada:${id}:${Date.now()}`
    }, db);
  }

  return { message: 'Reserva atualizada com sucesso.' };
}

async function cancelReservation(id, user, db) {
  const reservations = await db.execute(FIND_RESERVATION_OWNER_SQL, { id });
  if (!reservations || reservations.length === 0 || reservations[0].cancelada_em) {
    const error = new Error('Reserva ativa nao encontrada.');
    error.code = 'RESERVATION_NOT_FOUND';
    throw error;
  }

  if (!canManageReservation(user, reservations[0])) {
    const error = new Error('Voce nao pode cancelar esta reserva.');
    error.code = 'FORBIDDEN';
    throw error;
  }

  await db.execute(CANCEL_RESERVATION_SQL, { id, canceladaPor: user.id });
  await createNotificationSafely({
    usuarioId: reservations[0].usuario_id,
    tipo: 'reserva_cancelada',
    titulo: 'Reserva cancelada',
    mensagem: `A reserva #${id} de ${reservations[0].ativo} em ${dateOnly(reservations[0].data_reserva)}, ${reservations[0].tempo} foi cancelada por ${user.nome}.`,
    referenciaTipo: 'reserva',
    referenciaId: id,
    eventKey: `reserva_cancelada:${id}`
  }, db);
  return { message: 'Reserva cancelada com sucesso.' };
}

module.exports = {
  cancelReservation,
  createReservations,
  getMyReservation,
  listMyReservations,
  listOptions,
  listReservations,
  updateReservation,
  sql: {
    FIND_ACTIVE_CONFLICT_SQL,
    FIND_ACTIVE_ASSET_SQL,
    FIND_TIME_SQL
  }
};
