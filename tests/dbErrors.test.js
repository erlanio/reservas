const assert = require('node:assert/strict');
const test = require('node:test');
const { sanitizeDatabaseError } = require('../app/db/errors');

test('sanitizeDatabaseError nao expoe dados sensiveis do erro original', () => {
  const original = new Error('Access denied for user escola with password senha-super-secreta');
  original.code = 'ER_ACCESS_DENIED_ERROR';

  const sanitized = sanitizeDatabaseError(original);

  assert.equal(sanitized.message, 'Nao foi possivel acessar o banco de dados no momento.');
  assert.equal(sanitized.code, 'ER_ACCESS_DENIED_ERROR');
  assert.doesNotMatch(sanitized.message, /senha-super-secreta|escola|Access denied/);
});
