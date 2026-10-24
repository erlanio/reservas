const crypto = require('crypto');
const mysql = require('mysql2/promise');
const { getDatabaseConfig } = require('../app/config/env');

function hashPassword(password) {
  return crypto.createHash('md5').update(password).digest('hex');
}

async function main() {
  const config = getDatabaseConfig();
  const email = process.argv[2] || 'master@escola.local';
  const password = process.argv[3] || crypto.randomBytes(5).toString('hex');
  const nome = process.argv[4] || 'Usuario Master';
  const dataNascimento = process.argv[5] || '2000-01-01';

  const connection = await mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    multipleStatements: false
  });

  await connection.execute(
    `
      INSERT INTO usuarios (nome, email, senha, data_nascimento, nivel_acesso, validado)
      VALUES (?, ?, ?, ?, 'master', 1)
      ON DUPLICATE KEY UPDATE
        nome = VALUES(nome),
        senha = VALUES(senha),
        data_nascimento = VALUES(data_nascimento),
        nivel_acesso = 'master',
        validado = 1
    `,
    [nome, email, hashPassword(password), dataNascimento]
  );

  await connection.end();

  console.log('Usuario master criado/atualizado com sucesso.');
  console.log(`Email: ${email}`);
  console.log(`Senha temporaria: ${password}`);
}

main().catch((error) => {
  console.error('Nao foi possivel criar o usuario master.');
  if (error.code) {
    console.error(`Codigo: ${error.code}`);
  }
  process.exit(1);
});
