const mysql = require('mysql2/promise');
const { getDatabaseConfig } = require('../config/env');
const { sanitizeDatabaseError } = require('./errors');

let pool;

function getPool() {
  if (!pool) {
    pool = mysql.createPool(getDatabaseConfig());
  }

  return pool;
}

async function testConnection() {
  try {
    const connection = await getPool().getConnection();
    connection.release();
    return true;
  } catch (error) {
    throw sanitizeDatabaseError(error);
  }
}

async function execute(query, params = {}) {
  try {
    const [rows] = await getPool().execute(query, params);
    return rows;
  } catch (error) {
    throw sanitizeDatabaseError(error);
  }
}

function resetPoolForTests() {
  pool = undefined;
}

module.exports = {
  execute,
  getPool,
  resetPoolForTests,
  testConnection
};
