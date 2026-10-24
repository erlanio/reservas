const dotenv = require('dotenv');

dotenv.config();

const REQUIRED_DB_KEYS = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER'];

function getEnv(name, fallback) {
  const value = process.env[name];
  if (value === undefined || value === '') {
    return fallback;
  }
  return value;
}

function getDatabaseConfig() {
  const missing = REQUIRED_DB_KEYS.filter((key) => !process.env[key]);

  if (process.env.DB_PASSWORD === undefined) {
    missing.push('DB_PASSWORD');
  }

  if (missing.length > 0) {
    const error = new Error('Configuracao de banco incompleta.');
    error.code = 'DB_CONFIG_MISSING';
    error.missing = missing;
    throw error;
  }

  return {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    namedPlaceholders: true
  };
}

function getServerConfig() {
  return {
    host: getEnv('HOST', '127.0.0.1'),
    port: Number(getEnv('PORT', 3000))
  };
}

module.exports = {
  getDatabaseConfig,
  getServerConfig
};
