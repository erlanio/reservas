function sanitizeDatabaseError(error) {
  const safeError = new Error('Nao foi possivel acessar o banco de dados no momento.');
  safeError.code = error && error.code ? error.code : 'DB_ERROR';
  return safeError;
}

function sendSafeError(res, error, statusCode = 500) {
  const safeError = sanitizeDatabaseError(error);
  res.status(statusCode).json({
    error: safeError.message
  });
}

module.exports = {
  sanitizeDatabaseError,
  sendSafeError
};
