const ALLOWED_TYPES = [
  'cadastro_aprovado',
  'cadastro_rejeitado',
  'reserva_realizada',
  'reserva_aprovada',
  'reserva_alterada',
  'reserva_cancelada'
];

const INSERT_NOTIFICATION_SQL = `
  INSERT INTO notificacoes (
    usuario_id,
    tipo,
    titulo,
    mensagem,
    referencia_tipo,
    referencia_id,
    event_key
  )
  VALUES (
    :usuarioId,
    :tipo,
    :titulo,
    :mensagem,
    :referenciaTipo,
    :referenciaId,
    :eventKey
  )
`;

const FIND_USER_SQL = `
  SELECT id
  FROM usuarios
  WHERE id = :id AND excluido_em IS NULL
  LIMIT 1
`;

const LIST_NOTIFICATIONS_BASE_SQL = `
  SELECT id,
         tipo,
         titulo,
         mensagem,
         referencia_tipo AS referenciaTipo,
         referencia_id AS referenciaId,
         lida,
         lida_em AS lidaEm,
         created_at AS createdAt
  FROM notificacoes
  WHERE usuario_id = :usuarioId
`;

const COUNT_NOTIFICATIONS_BASE_SQL = `
  SELECT COUNT(*) AS total
  FROM notificacoes
  WHERE usuario_id = :usuarioId
`;

const COUNT_UNREAD_SQL = `
  SELECT COUNT(*) AS quantidade
  FROM notificacoes
  WHERE usuario_id = :usuarioId
    AND lida = 0
`;

const FIND_NOTIFICATION_SQL = `
  SELECT id,
         usuario_id AS usuarioId,
         tipo,
         titulo,
         mensagem,
         referencia_tipo AS referenciaTipo,
         referencia_id AS referenciaId,
         lida,
         lida_em AS lidaEm,
         created_at AS createdAt
  FROM notificacoes
  WHERE id = :id
  LIMIT 1
`;

const MARK_NOTIFICATION_READ_SQL = `
  UPDATE notificacoes
  SET lida = 1,
      lida_em = COALESCE(lida_em, NOW())
  WHERE id = :id
    AND usuario_id = :usuarioId
`;

const MARK_ALL_READ_SQL = `
  UPDATE notificacoes
  SET lida = 1,
      lida_em = COALESCE(lida_em, NOW())
  WHERE usuario_id = :usuarioId
    AND lida = 0
`;

function normalizeText(value) {
  return String(value || '').trim();
}

function normalizeType(type) {
  const normalized = normalizeText(type);
  if (!ALLOWED_TYPES.includes(normalized)) {
    const error = new Error('Tipo de notificacao invalido.');
    error.code = 'VALIDATION_ERROR';
    throw error;
  }

  return normalized;
}

function normalizePage(value) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function normalizeLimit(value) {
  const limit = Number(value);
  return Number.isInteger(limit) && limit > 0 && limit <= 50 ? limit : 10;
}

function normalizeReadFilter(value) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  if (value === 'true' || value === true || value === '1' || value === 1) {
    return 1;
  }

  if (value === 'false' || value === false || value === '0' || value === 0) {
    return 0;
  }

  const error = new Error('Filtro de leitura invalido.');
  error.code = 'VALIDATION_ERROR';
  throw error;
}

async function assertRecipientExists(usuarioId, db) {
  const users = await db.execute(FIND_USER_SQL, { id: usuarioId });
  if (!users || users.length === 0) {
    const error = new Error('Usuario destinatario nao encontrado.');
    error.code = 'VALIDATION_ERROR';
    throw error;
  }
}

async function createNotification(data, db) {
  const usuarioId = Number(data.usuarioId);
  const tipo = normalizeType(data.tipo);
  const titulo = normalizeText(data.titulo);
  const mensagem = normalizeText(data.mensagem);

  if (!Number.isInteger(usuarioId) || usuarioId <= 0 || !titulo || !mensagem) {
    const error = new Error('Preencha todos os campos obrigatorios da notificacao.');
    error.code = 'VALIDATION_ERROR';
    throw error;
  }

  await assertRecipientExists(usuarioId, db);

  try {
    await db.execute(INSERT_NOTIFICATION_SQL, {
      usuarioId,
      tipo,
      titulo,
      mensagem,
      referenciaTipo: data.referenciaTipo || null,
      referenciaId: data.referenciaId || null,
      eventKey: data.eventKey || null
    });
  } catch (error) {
    if (error && error.code === 'ER_DUP_ENTRY') {
      return { created: false, duplicated: true };
    }

    throw error;
  }

  return { created: true };
}

async function createNotificationSafely(data, db) {
  try {
    return await createNotification(data, db);
  } catch (error) {
    console.error('Nao foi possivel criar notificacao:', error.message);
    return { created: false, error };
  }
}

async function listNotifications(user, filters, db) {
  const page = normalizePage(filters && (filters.pagina || filters.page));
  const limit = normalizeLimit(filters && (filters.limite || filters.limit));
  const offset = (page - 1) * limit;
  const params = { usuarioId: user.id, limit, offset };
  const parts = [];

  if (filters && filters.tipo) {
    params.tipo = normalizeType(filters.tipo);
    parts.push('tipo = :tipo');
  }

  const lida = normalizeReadFilter(filters && filters.lida);
  if (lida !== null) {
    params.lida = lida;
    parts.push('lida = :lida');
  }

  const filterSql = parts.length ? ` AND ${parts.join(' AND ')}` : '';
  const notificacoes = await db.execute(
    `${LIST_NOTIFICATIONS_BASE_SQL}${filterSql} ORDER BY created_at DESC, id DESC LIMIT :limit OFFSET :offset`,
    params
  );
  const totals = await db.execute(`${COUNT_NOTIFICATIONS_BASE_SQL}${filterSql}`, params);
  const total = Number(totals[0].total);

  return {
    notificacoes,
    paginacao: {
      pagina: page,
      limite: limit,
      total,
      totalPaginas: Math.max(1, Math.ceil(total / limit))
    }
  };
}

async function countUnreadNotifications(user, db) {
  const rows = await db.execute(COUNT_UNREAD_SQL, { usuarioId: user.id });
  return { quantidade: Number(rows[0].quantidade) };
}

async function getNotification(id, user, db) {
  const rows = await db.execute(FIND_NOTIFICATION_SQL, { id });
  if (!rows || rows.length === 0) {
    const error = new Error('Notificacao nao encontrada.');
    error.code = 'NOTIFICATION_NOT_FOUND';
    throw error;
  }

  if (Number(rows[0].usuarioId) !== Number(user.id)) {
    const error = new Error('Voce nao pode acessar esta notificacao.');
    error.code = 'FORBIDDEN';
    throw error;
  }

  return { notificacao: rows[0] };
}

async function markNotificationAsRead(id, user, db) {
  await getNotification(id, user, db);
  await db.execute(MARK_NOTIFICATION_READ_SQL, { id, usuarioId: user.id });
  return {
    mensagem: 'Notificacao marcada como lida.',
    notificacao: {
      id: Number(id),
      lida: true
    }
  };
}

async function markAllNotificationsAsRead(user, db) {
  const result = await db.execute(MARK_ALL_READ_SQL, { usuarioId: user.id });
  return {
    mensagem: 'Todas as notificacoes foram marcadas como lidas.',
    quantidadeAtualizada: Number(result.affectedRows || 0)
  };
}

module.exports = {
  ALLOWED_TYPES,
  countUnreadNotifications,
  createNotification,
  createNotificationSafely,
  getNotification,
  listNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  sql: {
    COUNT_UNREAD_SQL,
    FIND_NOTIFICATION_SQL,
    INSERT_NOTIFICATION_SQL,
    LIST_NOTIFICATIONS_BASE_SQL,
    MARK_ALL_READ_SQL,
    MARK_NOTIFICATION_READ_SQL
  }
};
