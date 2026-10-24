const path = require('path');
const crypto = require('crypto');
const express = require('express');
const db = require('./db/mysql');
const { sendSafeError } = require('./db/errors');
const { getServerConfig } = require('./config/env');
const {
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
  updateType
} = require('./services/assetService');
const {
  createTime,
  deleteTime,
  listDeletedTimes,
  listTimes,
  restoreTime,
  updateTime
} = require('./services/timeService');
const {
  cancelReservation,
  createReservations,
  getMyReservation,
  listMyReservations,
  listOptions,
  listReservations,
  updateReservation
} = require('./services/reservationService');
const {
  countUnreadNotifications,
  getNotification,
  listNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead
} = require('./services/notificationService');
const {
  approveUser,
  countPendingUsers,
  createUser,
  deleteUser,
  listDeletedUsers,
  listUsers,
  login,
  recoverPassword,
  restoreUser,
  updateUser
} = require('./services/userService');

const app = express();
const sessions = new Map();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function parseCookies(cookieHeader = '') {
  return Object.fromEntries(
    cookieHeader
      .split(';')
      .map((cookie) => cookie.trim())
      .filter(Boolean)
      .map((cookie) => {
        const separator = cookie.indexOf('=');
        return [cookie.slice(0, separator), decodeURIComponent(cookie.slice(separator + 1))];
      })
  );
}

function getSession(req) {
  const cookies = parseCookies(req.headers.cookie);
  if (!cookies.session_id) {
    return null;
  }

  return sessions.get(cookies.session_id) || null;
}

function requireAuthenticatedUser(req, res, next) {
  const session = getSession(req);
  if (!session || !session.user) {
    if (req.path.startsWith('/api/')) {
      res.status(401).json({ error: 'Usuario nao autenticado.' });
      return;
    }

    res.redirect('/');
    return;
  }

  req.user = session.user;
  next();
}

function requireMasterUser(req, res, next) {
  const session = getSession(req);
  if (!session || !session.user) {
    if (req.path.startsWith('/api/')) {
      res.status(401).json({ error: 'Usuario nao autenticado.' });
      return;
    }

    res.redirect('/');
    return;
  }

  if (session.user.nivelAcesso !== 'master') {
    if (req.path.startsWith('/api/')) {
      res.status(403).json({ error: 'Acesso permitido apenas para usuarios master.' });
      return;
    }

    res.redirect('/minhas-reservas');
    return;
  }

  req.user = session.user;
  next();
}

app.get('/health', async (req, res) => {
  try {
    await db.testConnection();
    res.json({ status: 'ok' });
  } catch (error) {
    sendSafeError(res, error);
  }
});

app.post('/api/usuarios', async (req, res) => {
  try {
    const result = await createUser(req.body, db);
    res.status(201).json(result);
  } catch (error) {
    if (error.code === 'VALIDATION_ERROR') {
      res.status(400).json({ error: error.message });
      return;
    }

    sendSafeError(res, error);
  }
});

app.post('/api/usuarios/recuperar-senha', async (req, res) => {
  try {
    const result = await recoverPassword(req.body, db);
    res.json(result);
  } catch (error) {
    if (error.code === 'VALIDATION_ERROR' || error.code === 'USER_NOT_FOUND') {
      res.status(400).json({ error: error.message });
      return;
    }

    sendSafeError(res, error);
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const result = await login(req.body, db);

    if (result.status === 'authenticated') {
      const sessionId = crypto.randomUUID();
      sessions.set(sessionId, { user: result.user });
      res.cookie('session_id', sessionId, {
        httpOnly: true,
        sameSite: 'lax'
      });
    }

    res.json(result);
  } catch (error) {
    if (error.code === 'VALIDATION_ERROR' || error.code === 'EMAIL_NOT_FOUND' || error.code === 'INVALID_PASSWORD') {
      res.status(400).json({ error: error.message, code: error.code });
      return;
    }

    sendSafeError(res, error);
  }
});

app.get('/api/session', (req, res) => {
  const session = getSession(req);
  if (!session) {
    res.status(401).json({ error: 'Usuario nao autenticado.' });
    return;
  }

  res.json({ user: session.user });
});

app.post('/api/logout', (req, res) => {
  const cookies = parseCookies(req.headers.cookie);
  if (cookies.session_id) {
    sessions.delete(cookies.session_id);
  }

  res.clearCookie('session_id');
  res.json({ message: 'Logout realizado com sucesso.' });
});

app.get('/api/notificacoes', requireAuthenticatedUser, async (req, res) => {
  try {
    res.json(await listNotifications(req.user, req.query, db));
  } catch (error) {
    if (error.code === 'VALIDATION_ERROR') {
      res.status(400).json({ error: error.message });
      return;
    }

    sendSafeError(res, error);
  }
});

app.get('/api/notificacoes/nao-lidas/quantidade', requireAuthenticatedUser, async (req, res) => {
  try {
    res.json(await countUnreadNotifications(req.user, db));
  } catch (error) {
    sendSafeError(res, error);
  }
});

app.get('/api/notificacoes/:id', requireAuthenticatedUser, async (req, res) => {
  try {
    res.json(await getNotification(req.params.id, req.user, db));
  } catch (error) {
    if (error.code === 'NOTIFICATION_NOT_FOUND') {
      res.status(404).json({ error: error.message });
      return;
    }

    if (error.code === 'FORBIDDEN') {
      res.status(403).json({ error: error.message });
      return;
    }

    sendSafeError(res, error);
  }
});

app.patch('/api/notificacoes/:id/lida', requireAuthenticatedUser, async (req, res) => {
  try {
    res.json(await markNotificationAsRead(req.params.id, req.user, db));
  } catch (error) {
    if (error.code === 'NOTIFICATION_NOT_FOUND') {
      res.status(404).json({ error: error.message });
      return;
    }

    if (error.code === 'FORBIDDEN') {
      res.status(403).json({ error: error.message });
      return;
    }

    sendSafeError(res, error);
  }
});

app.patch('/api/notificacoes/marcar-todas-como-lidas', requireAuthenticatedUser, async (req, res) => {
  try {
    res.json(await markAllNotificationsAsRead(req.user, db));
  } catch (error) {
    sendSafeError(res, error);
  }
});

app.get('/api/admin/usuarios', requireMasterUser, async (req, res) => {
  try {
    res.json(await listUsers({ page: req.query.page, sort: req.query.sort, status: req.query.status }, db));
  } catch (error) {
    sendSafeError(res, error);
  }
});

app.get('/api/admin/usuarios/pendentes/count', requireMasterUser, async (req, res) => {
  try {
    res.json(await countPendingUsers(db));
  } catch (error) {
    sendSafeError(res, error);
  }
});

app.get('/api/admin/usuarios/lixeira', requireMasterUser, async (req, res) => {
  try {
    res.json(await listDeletedUsers(db));
  } catch (error) {
    sendSafeError(res, error);
  }
});

app.put('/api/admin/usuarios/:id', requireMasterUser, async (req, res) => {
  try {
    res.json(await updateUser(req.params.id, req.body, db));
  } catch (error) {
    if (error.code === 'VALIDATION_ERROR') {
      res.status(400).json({ error: error.message });
      return;
    }

    sendSafeError(res, error);
  }
});

app.post('/api/admin/usuarios/:id/aprovar', requireMasterUser, async (req, res) => {
  try {
    res.json(await approveUser(req.params.id, db));
  } catch (error) {
    sendSafeError(res, error);
  }
});

app.delete('/api/admin/usuarios/:id', requireMasterUser, async (req, res) => {
  try {
    res.json(await deleteUser(req.params.id, db));
  } catch (error) {
    sendSafeError(res, error);
  }
});

app.post('/api/admin/usuarios/:id/restaurar', requireMasterUser, async (req, res) => {
  try {
    res.json(await restoreUser(req.params.id, db));
  } catch (error) {
    if (error.code === 'DELETED_USER_NOT_FOUND' || error.code === 'EMAIL_IN_USE') {
      res.status(400).json({ error: error.message });
      return;
    }

    sendSafeError(res, error);
  }
});

app.get('/api/admin/tipos-ativos', requireMasterUser, async (req, res) => {
  try {
    res.json(await listTypes(db));
  } catch (error) {
    sendSafeError(res, error);
  }
});

app.post('/api/admin/tipos-ativos', requireMasterUser, async (req, res) => {
  try {
    res.status(201).json(await createType(req.body, db));
  } catch (error) {
    if (error.code === 'VALIDATION_ERROR' || error.code === 'DUPLICATE_ENTRY') {
      res.status(400).json({ error: error.message });
      return;
    }

    sendSafeError(res, error);
  }
});

app.put('/api/admin/tipos-ativos/:id', requireMasterUser, async (req, res) => {
  try {
    res.json(await updateType(req.params.id, req.body, db));
  } catch (error) {
    if (error.code === 'VALIDATION_ERROR' || error.code === 'DUPLICATE_ENTRY') {
      res.status(400).json({ error: error.message });
      return;
    }

    sendSafeError(res, error);
  }
});

app.delete('/api/admin/tipos-ativos/:id', requireMasterUser, async (req, res) => {
  try {
    res.json(await deleteType(req.params.id, db));
  } catch (error) {
    sendSafeError(res, error);
  }
});

app.get('/api/admin/ativos', requireMasterUser, async (req, res) => {
  try {
    res.json(await listAssets({ page: req.query.page, tipoId: req.query.tipoId }, db));
  } catch (error) {
    sendSafeError(res, error);
  }
});

app.get('/api/admin/ativos/lixeira', requireMasterUser, async (req, res) => {
  try {
    res.json(await listDeletedAssets(db));
  } catch (error) {
    sendSafeError(res, error);
  }
});

app.post('/api/admin/ativos', requireMasterUser, async (req, res) => {
  try {
    res.status(201).json(await createAsset(req.body, db));
  } catch (error) {
    if (error.code === 'VALIDATION_ERROR' || error.code === 'DUPLICATE_ENTRY') {
      res.status(400).json({ error: error.message });
      return;
    }

    sendSafeError(res, error);
  }
});

app.put('/api/admin/ativos/:id', requireMasterUser, async (req, res) => {
  try {
    res.json(await updateAsset(req.params.id, req.body, db));
  } catch (error) {
    if (error.code === 'VALIDATION_ERROR' || error.code === 'DUPLICATE_ENTRY') {
      res.status(400).json({ error: error.message });
      return;
    }

    sendSafeError(res, error);
  }
});

app.delete('/api/admin/ativos/:id', requireMasterUser, async (req, res) => {
  try {
    res.json(await deleteAsset(req.params.id, db));
  } catch (error) {
    sendSafeError(res, error);
  }
});

app.post('/api/admin/ativos/:id/restaurar', requireMasterUser, async (req, res) => {
  try {
    res.json(await restoreAsset(req.params.id, db));
  } catch (error) {
    if (error.code === 'DELETED_ASSET_NOT_FOUND' || error.code === 'IDENTIFIER_IN_USE') {
      res.status(400).json({ error: error.message });
      return;
    }

    sendSafeError(res, error);
  }
});

app.patch('/api/admin/ativos/:id/desativar', requireMasterUser, async (req, res) => {
  try {
    res.json(await deactivateAsset(req.params.id, req.body, req.user, db));
  } catch (error) {
    if (error.code === 'VALIDATION_ERROR') {
      res.status(400).json({ error: error.message });
      return;
    }

    if (error.code === 'ASSET_NOT_FOUND') {
      res.status(404).json({ error: error.message });
      return;
    }

    if (error.code === 'ASSET_ALREADY_DISABLED') {
      res.status(409).json({ error: error.message });
      return;
    }

    if (error.code === 'FUTURE_RESERVATIONS_CONFIRMATION_REQUIRED') {
      res.status(400).json({ error: error.message, details: error.details });
      return;
    }

    sendSafeError(res, error);
  }
});

app.patch('/api/admin/ativos/:id/reativar', requireMasterUser, async (req, res) => {
  try {
    res.json(await reactivateAsset(req.params.id, req.user, db));
  } catch (error) {
    if (error.code === 'ASSET_NOT_FOUND') {
      res.status(404).json({ error: error.message });
      return;
    }

    if (error.code === 'ASSET_ALREADY_ACTIVE') {
      res.status(409).json({ error: error.message });
      return;
    }

    sendSafeError(res, error);
  }
});

app.get('/api/admin/ativos/:id/historico', requireMasterUser, async (req, res) => {
  try {
    res.json(await listAssetHistory(req.params.id, db));
  } catch (error) {
    if (error.code === 'ASSET_NOT_FOUND') {
      res.status(404).json({ error: error.message });
      return;
    }

    sendSafeError(res, error);
  }
});

app.get('/api/admin/tempos', requireMasterUser, async (req, res) => {
  try {
    res.json(await listTimes(db));
  } catch (error) {
    sendSafeError(res, error);
  }
});

app.get('/api/admin/tempos/lixeira', requireMasterUser, async (req, res) => {
  try {
    res.json(await listDeletedTimes(db));
  } catch (error) {
    sendSafeError(res, error);
  }
});

app.post('/api/admin/tempos', requireMasterUser, async (req, res) => {
  try {
    res.status(201).json(await createTime(req.body, db));
  } catch (error) {
    if (error.code === 'VALIDATION_ERROR' || error.code === 'TIME_OVERLAP' || error.code === 'DUPLICATE_ENTRY') {
      res.status(400).json({ error: error.message });
      return;
    }

    sendSafeError(res, error);
  }
});

app.put('/api/admin/tempos/:id', requireMasterUser, async (req, res) => {
  try {
    res.json(await updateTime(req.params.id, req.body, db));
  } catch (error) {
    if (error.code === 'VALIDATION_ERROR' || error.code === 'TIME_OVERLAP' || error.code === 'DUPLICATE_ENTRY') {
      res.status(400).json({ error: error.message });
      return;
    }

    sendSafeError(res, error);
  }
});

app.delete('/api/admin/tempos/:id', requireMasterUser, async (req, res) => {
  try {
    res.json(await deleteTime(req.params.id, db));
  } catch (error) {
    sendSafeError(res, error);
  }
});

app.post('/api/admin/tempos/:id/restaurar', requireMasterUser, async (req, res) => {
  try {
    res.json(await restoreTime(req.params.id, db));
  } catch (error) {
    if (error.code === 'DELETED_TIME_NOT_FOUND' || error.code === 'IDENTIFIER_IN_USE') {
      res.status(400).json({ error: error.message });
      return;
    }

    sendSafeError(res, error);
  }
});

app.get('/api/reservas/opcoes', requireAuthenticatedUser, async (req, res) => {
  try {
    res.json(await listOptions(req.user, db));
  } catch (error) {
    sendSafeError(res, error);
  }
});

app.get('/api/minhas-reservas', requireAuthenticatedUser, async (req, res) => {
  try {
    res.json(await listMyReservations(req.user, req.query, db));
  } catch (error) {
    if (error.code === 'VALIDATION_ERROR') {
      res.status(400).json({ error: error.message });
      return;
    }

    sendSafeError(res, error);
  }
});

app.get('/api/minhas-reservas/:id', requireAuthenticatedUser, async (req, res) => {
  try {
    res.json(await getMyReservation(req.params.id, req.user, db));
  } catch (error) {
    if (error.code === 'VALIDATION_ERROR') {
      res.status(400).json({ error: error.message });
      return;
    }

    if (error.code === 'RESERVATION_NOT_FOUND') {
      res.status(404).json({ error: error.message });
      return;
    }

    sendSafeError(res, error);
  }
});

app.delete('/api/minhas-reservas/:id', requireAuthenticatedUser, async (req, res) => {
  try {
    res.json(await cancelReservation(req.params.id, req.user, db));
  } catch (error) {
    if (error.code === 'RESERVATION_NOT_FOUND') {
      res.status(400).json({ error: error.message });
      return;
    }

    if (error.code === 'FORBIDDEN') {
      res.status(403).json({ error: error.message });
      return;
    }

    sendSafeError(res, error);
  }
});

app.get('/api/reservas', requireAuthenticatedUser, async (req, res) => {
  try {
    res.json(await listReservations({
      dataReserva: req.query.data,
      ativoId: req.query.ativoId,
      tipoId: req.query.tipoId,
      status: req.query.status
    }, db));
  } catch (error) {
    if (error.code === 'VALIDATION_ERROR') {
      res.status(400).json({ error: error.message });
      return;
    }

    sendSafeError(res, error);
  }
});

app.post('/api/reservas', requireAuthenticatedUser, async (req, res) => {
  try {
    res.status(201).json(await createReservations(req.body, req.user, db));
  } catch (error) {
    if (error.code === 'VALIDATION_ERROR' || error.code === 'RESERVATION_CONFLICT' || error.code === 'ASSET_UNAVAILABLE') {
      res.status(400).json({ error: error.message });
      return;
    }

    sendSafeError(res, error);
  }
});

app.put('/api/reservas/:id', requireAuthenticatedUser, async (req, res) => {
  try {
    res.json(await updateReservation(req.params.id, req.body, req.user, db));
  } catch (error) {
    if (error.code === 'VALIDATION_ERROR' || error.code === 'RESERVATION_CONFLICT' || error.code === 'RESERVATION_NOT_FOUND' || error.code === 'ASSET_UNAVAILABLE') {
      res.status(400).json({ error: error.message });
      return;
    }

    if (error.code === 'FORBIDDEN') {
      res.status(403).json({ error: error.message });
      return;
    }

    sendSafeError(res, error);
  }
});

app.delete('/api/reservas/:id', requireAuthenticatedUser, async (req, res) => {
  try {
    res.json(await cancelReservation(req.params.id, req.user, db));
  } catch (error) {
    if (error.code === 'RESERVATION_NOT_FOUND') {
      res.status(400).json({ error: error.message });
      return;
    }

    if (error.code === 'FORBIDDEN') {
      res.status(403).json({ error: error.message });
      return;
    }

    sendSafeError(res, error);
  }
});

app.get('/dashboard', requireAuthenticatedUser, (req, res) => {
  if (req.user.nivelAcesso === 'master') {
    res.sendFile(path.join(__dirname, 'private', 'dashboard.html'));
    return;
  }

  res.redirect('/minhas-reservas');
});

app.get('/usuarios', requireMasterUser, (req, res) => {
  res.sendFile(path.join(__dirname, 'private', 'usuarios.html'));
});

app.get('/ativos', requireMasterUser, (req, res) => {
  res.sendFile(path.join(__dirname, 'private', 'ativos.html'));
});

app.get('/tempos', requireMasterUser, (req, res) => {
  res.sendFile(path.join(__dirname, 'private', 'tempos.html'));
});

app.get('/reservas', requireAuthenticatedUser, (req, res) => {
  res.sendFile(path.join(__dirname, 'private', 'reservas.html'));
});

app.get('/minhas-reservas', requireAuthenticatedUser, (req, res) => {
  res.sendFile(path.join(__dirname, 'private', 'minhas-reservas.html'));
});

if (require.main === module) {
  const { host, port } = getServerConfig();
  app.listen(port, host, () => {
    console.log(`Servidor iniciado em http://${host}:${port}`);
  });
}

module.exports = app;
