const crypto = require('crypto');
const { createNotificationSafely } = require('./notificationService');

const INSERT_USER_SQL = `
  INSERT INTO usuarios (nome, email, senha, data_nascimento, nivel_acesso, validado)
  VALUES (:nome, :email, :senha, :dataNascimento, 'normal', 0)
`;

const FIND_USER_FOR_RECOVERY_SQL = `
  SELECT id, email
  FROM usuarios
  WHERE email = :email AND data_nascimento = :dataNascimento
  LIMIT 1
`;

const UPDATE_PASSWORD_SQL = `
  UPDATE usuarios
  SET senha = :senha
  WHERE id = :id
`;

const FIND_USER_BY_EMAIL_SQL = `
  SELECT id, nome, email, senha, nivel_acesso, validado
  FROM usuarios
  WHERE email = :email AND excluido_em IS NULL
  LIMIT 1
`;

const FIND_MASTER_EMAILS_SQL = `
  SELECT email
  FROM usuarios
  WHERE nivel_acesso = 'master' AND excluido_em IS NULL
  ORDER BY email
`;

const LIST_USERS_BASE_SQL = `
  SELECT id, nome, email, data_nascimento, nivel_acesso, validado
  FROM usuarios
  WHERE excluido_em IS NULL
`;

const COUNT_USERS_SQL = `
  SELECT COUNT(*) AS total
  FROM usuarios
  WHERE excluido_em IS NULL
`;

const COUNT_PENDING_USERS_SQL = `
  SELECT COUNT(*) AS total
  FROM usuarios
  WHERE validado = 0 AND excluido_em IS NULL
`;

const LIST_DELETED_USERS_SQL = `
  SELECT id, nome, email, excluido_em
  FROM usuarios
  WHERE excluido_em IS NOT NULL
    AND excluido_em >= DATE_SUB(NOW(), INTERVAL 30 DAY)
  ORDER BY excluido_em DESC
`;

const FIND_USER_BY_ID_SQL = `
  SELECT id, nome, email, excluido_em
  FROM usuarios
  WHERE id = :id
  LIMIT 1
`;

const FIND_ACTIVE_USER_BY_EMAIL_SQL = `
  SELECT id
  FROM usuarios
  WHERE email = :email AND excluido_em IS NULL
  LIMIT 1
`;

const UPDATE_USER_SQL = `
  UPDATE usuarios
  SET nome = :nome,
      email = :email,
      senha = :senha,
      data_nascimento = :dataNascimento,
      nivel_acesso = :nivelAcesso,
      validado = :validado
  WHERE id = :id AND excluido_em IS NULL
`;

const UPDATE_USER_WITHOUT_PASSWORD_SQL = `
  UPDATE usuarios
  SET nome = :nome,
      email = :email,
      data_nascimento = :dataNascimento,
      nivel_acesso = :nivelAcesso,
      validado = :validado
  WHERE id = :id AND excluido_em IS NULL
`;

const APPROVE_USER_SQL = `
  UPDATE usuarios
  SET validado = 1
  WHERE id = :id AND excluido_em IS NULL
`;

const SOFT_DELETE_USER_SQL = `
  UPDATE usuarios
  SET excluido_em = NOW()
  WHERE id = :id AND excluido_em IS NULL
`;

const RESTORE_USER_SQL = `
  UPDATE usuarios
  SET excluido_em = NULL
  WHERE id = :id
    AND excluido_em IS NOT NULL
    AND excluido_em >= DATE_SUB(NOW(), INTERVAL 30 DAY)
`;

function hashPassword(password) {
  return crypto.createHash('md5').update(password).digest('hex');
}

function generatePassword() {
  return crypto.randomBytes(4).toString('hex');
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function requireFields(data, fields) {
  const missing = fields.filter((field) => !data[field]);
  if (missing.length > 0) {
    const error = new Error('Preencha todos os campos obrigatorios.');
    error.code = 'VALIDATION_ERROR';
    throw error;
  }
}

async function createUser(data, db) {
  requireFields(data, ['nome', 'email', 'senha', 'dataNascimento']);

  await db.execute(INSERT_USER_SQL, {
    nome: String(data.nome).trim(),
    email: normalizeEmail(data.email),
    senha: hashPassword(data.senha),
    dataNascimento: data.dataNascimento
  });

  return {
    message: 'Cadastro realizado. Aguarde a validacao de um usuario master.'
  };
}

async function recoverPassword(data, db) {
  requireFields(data, ['email', 'dataNascimento']);

  const users = await db.execute(FIND_USER_FOR_RECOVERY_SQL, {
    email: normalizeEmail(data.email),
    dataNascimento: data.dataNascimento
  });

  if (!users || users.length === 0) {
    const error = new Error('Usuario nao encontrado para os dados informados.');
    error.code = 'USER_NOT_FOUND';
    throw error;
  }

  const newPassword = generatePassword();

  await db.execute(UPDATE_PASSWORD_SQL, {
    id: users[0].id,
    senha: hashPassword(newPassword)
  });

  return {
    message: 'Nova senha gerada com sucesso.',
    senhaTemporaria: newPassword
  };
}

async function listMasterEmails(db) {
  const masters = await db.execute(FIND_MASTER_EMAILS_SQL);
  return masters.map((master) => master.email);
}

async function login(data, db) {
  requireFields(data, ['email', 'senha']);

  const users = await db.execute(FIND_USER_BY_EMAIL_SQL, {
    email: normalizeEmail(data.email)
  });

  if (!users || users.length === 0) {
    const error = new Error('O email informado nao possui cadastro.');
    error.code = 'EMAIL_NOT_FOUND';
    throw error;
  }

  const user = users[0];

  if (user.senha !== hashPassword(data.senha)) {
    const error = new Error('Senha incorreta.');
    error.code = 'INVALID_PASSWORD';
    throw error;
  }

  if (!user.validado) {
    return {
      status: 'pending',
      message: 'Seu cadastro ainda esta pendente de validacao.',
      masters: await listMasterEmails(db)
    };
  }

  return {
    status: 'authenticated',
    message: 'Login realizado com sucesso.',
    user: {
      id: user.id,
      nome: user.nome,
      email: user.email,
      nivelAcesso: user.nivel_acesso
    }
  };
}

function normalizePage(page) {
  const parsed = Number(page);
  if (!Number.isInteger(parsed) || parsed < 1) {
    return 1;
  }
  return parsed;
}

async function countPendingUsers(db) {
  const rows = await db.execute(COUNT_PENDING_USERS_SQL);
  return { quantidade: Number(rows[0].total) };
}

async function listUsers(options, db) {
  const page = normalizePage(options && options.page);
  const sortDirection = options && options.sort === 'desc' ? 'DESC' : 'ASC';
  const pendingOnly = options && options.status === 'pendentes';
  const filterSql = pendingOnly ? ' AND validado = 0' : '';
  const limit = 10;
  const offset = (page - 1) * limit;
  const users = await db.execute(
    `${LIST_USERS_BASE_SQL}${filterSql} ORDER BY nome ${sortDirection} LIMIT :limit OFFSET :offset`,
    { limit, offset }
  );
  const countRows = await db.execute(`${COUNT_USERS_SQL}${filterSql}`);
  const total = Number(countRows[0].total);

  return {
    users,
    pagination: {
      page,
      limit,
      sort: sortDirection.toLowerCase(),
      total,
      totalPages: Math.max(1, Math.ceil(total / limit))
    }
  };
}

async function listDeletedUsers(db) {
  return {
    users: await db.execute(LIST_DELETED_USERS_SQL)
  };
}

async function updateUser(id, data, db) {
  requireFields(data, ['nome', 'email', 'dataNascimento', 'nivelAcesso']);

  const nivelAcesso = data.nivelAcesso === 'master' ? 'master' : 'normal';
  const params = {
    id,
    nome: String(data.nome).trim(),
    email: normalizeEmail(data.email),
    dataNascimento: data.dataNascimento,
    nivelAcesso,
    validado: data.validado ? 1 : 0
  };

  if (data.senha) {
    await db.execute(UPDATE_USER_SQL, {
      ...params,
      senha: hashPassword(data.senha)
    });
  } else {
    await db.execute(UPDATE_USER_WITHOUT_PASSWORD_SQL, params);
  }

  return { message: 'Usuario atualizado com sucesso.' };
}

async function approveUser(id, db) {
  const users = await db.execute(FIND_USER_BY_ID_SQL, { id });
  await db.execute(APPROVE_USER_SQL, { id });

  if (users && users.length > 0 && !users[0].excluido_em) {
    await createNotificationSafely({
      usuarioId: users[0].id,
      tipo: 'cadastro_aprovado',
      titulo: 'Cadastro aprovado',
      mensagem: 'Seu cadastro foi aprovado. Seu acesso ao sistema esta liberado.',
      referenciaTipo: 'usuario',
      referenciaId: users[0].id,
      eventKey: `cadastro_aprovado:${users[0].id}`
    }, db);
  }

  return { message: 'Usuario aprovado com sucesso.' };
}

async function deleteUser(id, db) {
  await db.execute(SOFT_DELETE_USER_SQL, { id });
  return { message: 'Usuario enviado para a lixeira.' };
}

async function restoreUser(id, db) {
  const users = await db.execute(FIND_USER_BY_ID_SQL, { id });
  if (!users || users.length === 0 || !users[0].excluido_em) {
    const error = new Error('Usuario excluido nao encontrado na lixeira.');
    error.code = 'DELETED_USER_NOT_FOUND';
    throw error;
  }

  const activeUsers = await db.execute(FIND_ACTIVE_USER_BY_EMAIL_SQL, {
    email: users[0].email
  });

  if (activeUsers && activeUsers.length > 0) {
    const error = new Error('Nao foi possivel restaurar: ja existe usuario ativo com este email.');
    error.code = 'EMAIL_IN_USE';
    throw error;
  }

  await db.execute(RESTORE_USER_SQL, { id });
  return { message: 'Usuario restaurado com sucesso.' };
}

module.exports = {
  approveUser,
  countPendingUsers,
  createUser,
  deleteUser,
  hashPassword,
  listDeletedUsers,
  listUsers,
  login,
  recoverPassword,
  restoreUser,
  updateUser,
  sql: {
    INSERT_USER_SQL,
    FIND_USER_FOR_RECOVERY_SQL,
    FIND_USER_BY_EMAIL_SQL,
    FIND_MASTER_EMAILS_SQL,
    LIST_USERS_BASE_SQL,
    COUNT_USERS_SQL,
    COUNT_PENDING_USERS_SQL,
    LIST_DELETED_USERS_SQL,
    FIND_USER_BY_ID_SQL,
    FIND_ACTIVE_USER_BY_EMAIL_SQL,
    UPDATE_USER_SQL,
    UPDATE_USER_WITHOUT_PASSWORD_SQL,
    APPROVE_USER_SQL,
    SOFT_DELETE_USER_SQL,
    RESTORE_USER_SQL,
    UPDATE_PASSWORD_SQL
  }
};
