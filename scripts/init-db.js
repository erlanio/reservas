const mysql = require('mysql2/promise');
const { getDatabaseConfig } = require('../app/config/env');

function quoteIdentifier(identifier) {
  return `\`${String(identifier).replace(/`/g, '``')}\``;
}

async function columnExists(connection, databaseName, tableName, columnName) {
  const [columns] = await connection.query(
    `
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?
      LIMIT 1
    `,
    [databaseName, tableName, columnName]
  );

  return columns.length > 0;
}

async function indexExists(connection, databaseName, tableName, indexName) {
  const [indexes] = await connection.query(
    `
      SELECT INDEX_NAME
      FROM INFORMATION_SCHEMA.STATISTICS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND INDEX_NAME = ?
      LIMIT 1
    `,
    [databaseName, tableName, indexName]
  );

  return indexes.length > 0;
}

async function main() {
  const config = getDatabaseConfig();
  const databaseName = config.database;
  const connection = await mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    multipleStatements: false
  });

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS ${quoteIdentifier(databaseName)} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await connection.query(`USE ${quoteIdentifier(databaseName)}`);
  await connection.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      nome VARCHAR(150) NOT NULL,
      email VARCHAR(180) NOT NULL,
      senha CHAR(32) NOT NULL,
      data_nascimento DATE NOT NULL,
      nivel_acesso ENUM('normal', 'master') NOT NULL DEFAULT 'normal',
      validado TINYINT(1) NOT NULL DEFAULT 0,
      excluido_em DATETIME NULL,
      email_ativo VARCHAR(180) GENERATED ALWAYS AS (IF(excluido_em IS NULL, email, NULL)) VIRTUAL,
      criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY usuarios_email_ativo_unique (email_ativo)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  if (!(await columnExists(connection, databaseName, 'usuarios', 'excluido_em'))) {
    await connection.query('ALTER TABLE usuarios ADD COLUMN excluido_em DATETIME NULL');
  }

  if (!(await columnExists(connection, databaseName, 'usuarios', 'email_ativo'))) {
    await connection.query('ALTER TABLE usuarios ADD COLUMN email_ativo VARCHAR(180) GENERATED ALWAYS AS (IF(excluido_em IS NULL, email, NULL)) VIRTUAL');
  }

  if (await indexExists(connection, databaseName, 'usuarios', 'usuarios_email_unique')) {
    await connection.query('ALTER TABLE usuarios DROP INDEX usuarios_email_unique');
  }

  if (!(await indexExists(connection, databaseName, 'usuarios', 'usuarios_email_ativo_unique'))) {
    await connection.query('CREATE UNIQUE INDEX usuarios_email_ativo_unique ON usuarios (email_ativo)');
  }

  await connection.query(`
    CREATE TABLE IF NOT EXISTS tipos_ativos (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      descricao VARCHAR(120) NOT NULL,
      excluido_em DATETIME NULL,
      descricao_ativa VARCHAR(120) GENERATED ALWAYS AS (IF(excluido_em IS NULL, descricao, NULL)) VIRTUAL,
      criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY tipos_ativos_descricao_ativa_unique (descricao_ativa)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS ativos (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      identificador VARCHAR(80) NOT NULL,
      descricao TEXT NULL,
      tipo_id INT UNSIGNED NOT NULL,
      status ENUM('ativo', 'desativado') NOT NULL DEFAULT 'ativo',
      motivo_desativacao ENUM('defeito', 'manutencao', 'reforma', 'outro') NULL,
      descricao_desativacao TEXT NULL,
      desativado_em DATETIME NULL,
      desativado_por INT UNSIGNED NULL,
      excluido_em DATETIME NULL,
      identificador_ativo VARCHAR(80) GENERATED ALWAYS AS (IF(excluido_em IS NULL, identificador, NULL)) VIRTUAL,
      criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY ativos_identificador_ativo_unique (identificador_ativo),
      CONSTRAINT ativos_tipo_id_foreign FOREIGN KEY (tipo_id) REFERENCES tipos_ativos (id),
      CONSTRAINT ativos_desativado_por_foreign FOREIGN KEY (desativado_por) REFERENCES usuarios (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  if (!(await columnExists(connection, databaseName, 'tipos_ativos', 'excluido_em'))) {
    await connection.query('ALTER TABLE tipos_ativos ADD COLUMN excluido_em DATETIME NULL');
  }

  if (!(await columnExists(connection, databaseName, 'tipos_ativos', 'descricao_ativa'))) {
    await connection.query('ALTER TABLE tipos_ativos ADD COLUMN descricao_ativa VARCHAR(120) GENERATED ALWAYS AS (IF(excluido_em IS NULL, descricao, NULL)) VIRTUAL');
  }

  if (!(await indexExists(connection, databaseName, 'tipos_ativos', 'tipos_ativos_descricao_ativa_unique'))) {
    await connection.query('CREATE UNIQUE INDEX tipos_ativos_descricao_ativa_unique ON tipos_ativos (descricao_ativa)');
  }

  if (!(await columnExists(connection, databaseName, 'ativos', 'excluido_em'))) {
    await connection.query('ALTER TABLE ativos ADD COLUMN excluido_em DATETIME NULL');
  }

  if (!(await columnExists(connection, databaseName, 'ativos', 'identificador_ativo'))) {
    await connection.query('ALTER TABLE ativos ADD COLUMN identificador_ativo VARCHAR(80) GENERATED ALWAYS AS (IF(excluido_em IS NULL, identificador, NULL)) VIRTUAL');
  }

  if (!(await columnExists(connection, databaseName, 'ativos', 'status'))) {
    await connection.query("ALTER TABLE ativos ADD COLUMN status ENUM('ativo', 'desativado') NOT NULL DEFAULT 'ativo'");
  }

  if (!(await columnExists(connection, databaseName, 'ativos', 'motivo_desativacao'))) {
    await connection.query("ALTER TABLE ativos ADD COLUMN motivo_desativacao ENUM('defeito', 'manutencao', 'reforma', 'outro') NULL");
  }

  if (!(await columnExists(connection, databaseName, 'ativos', 'descricao_desativacao'))) {
    await connection.query('ALTER TABLE ativos ADD COLUMN descricao_desativacao TEXT NULL');
  }

  if (!(await columnExists(connection, databaseName, 'ativos', 'desativado_em'))) {
    await connection.query('ALTER TABLE ativos ADD COLUMN desativado_em DATETIME NULL');
  }

  if (!(await columnExists(connection, databaseName, 'ativos', 'desativado_por'))) {
    await connection.query('ALTER TABLE ativos ADD COLUMN desativado_por INT UNSIGNED NULL');
  }

  if (!(await indexExists(connection, databaseName, 'ativos', 'ativos_identificador_ativo_unique'))) {
    await connection.query('CREATE UNIQUE INDEX ativos_identificador_ativo_unique ON ativos (identificador_ativo)');
  }

  await connection.query(`
    CREATE TABLE IF NOT EXISTS tempos (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      identificador VARCHAR(80) NOT NULL,
      hora_inicio TIME NOT NULL,
      hora_fim TIME NOT NULL,
      excluido_em DATETIME NULL,
      identificador_ativo VARCHAR(80) GENERATED ALWAYS AS (IF(excluido_em IS NULL, identificador, NULL)) VIRTUAL,
      criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY tempos_identificador_ativo_unique (identificador_ativo)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  if (!(await columnExists(connection, databaseName, 'tempos', 'excluido_em'))) {
    await connection.query('ALTER TABLE tempos ADD COLUMN excluido_em DATETIME NULL');
  }

  if (!(await columnExists(connection, databaseName, 'tempos', 'identificador_ativo'))) {
    await connection.query('ALTER TABLE tempos ADD COLUMN identificador_ativo VARCHAR(80) GENERATED ALWAYS AS (IF(excluido_em IS NULL, identificador, NULL)) VIRTUAL');
  }

  if (!(await indexExists(connection, databaseName, 'tempos', 'tempos_identificador_ativo_unique'))) {
    await connection.query('CREATE UNIQUE INDEX tempos_identificador_ativo_unique ON tempos (identificador_ativo)');
  }

  const defaultTimes = [
    ['1o tempo', '07:20:00', '08:10:00'],
    ['2o tempo', '08:10:00', '09:00:00'],
    ['3o tempo', '09:20:00', '10:10:00'],
    ['4o tempo', '10:10:00', '11:00:00'],
    ['5o tempo', '11:00:00', '12:00:00'],
    ['6o tempo', '13:00:00', '13:50:00'],
    ['7o tempo', '13:50:00', '14:40:00'],
    ['8o tempo', '15:00:00', '15:50:00'],
    ['9o tempo', '15:50:00', '16:40:00']
  ];

  for (const [identificador, horaInicio, horaFim] of defaultTimes) {
    await connection.execute(
      'INSERT IGNORE INTO tempos (identificador, hora_inicio, hora_fim) VALUES (?, ?, ?)',
      [identificador, horaInicio, horaFim]
    );
  }

  await connection.query(`
    CREATE TABLE IF NOT EXISTS reservas (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      usuario_id INT UNSIGNED NOT NULL,
      ativo_id INT UNSIGNED NOT NULL,
      tempo_id INT UNSIGNED NOT NULL,
      data_reserva DATE NOT NULL,
      cancelada_em DATETIME NULL,
      cancelada_por INT UNSIGNED NULL,
      cancelada_por_desativacao_ativo TINYINT(1) NOT NULL DEFAULT 0,
      reserva_ativa TINYINT GENERATED ALWAYS AS (IF(cancelada_em IS NULL, 1, NULL)) VIRTUAL,
      criada_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      atualizada_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY reservas_ativo_tempo_data_ativa_unique (ativo_id, tempo_id, data_reserva, reserva_ativa),
      CONSTRAINT reservas_usuario_id_foreign FOREIGN KEY (usuario_id) REFERENCES usuarios (id),
      CONSTRAINT reservas_ativo_id_foreign FOREIGN KEY (ativo_id) REFERENCES ativos (id),
      CONSTRAINT reservas_tempo_id_foreign FOREIGN KEY (tempo_id) REFERENCES tempos (id),
      CONSTRAINT reservas_cancelada_por_foreign FOREIGN KEY (cancelada_por) REFERENCES usuarios (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  if (!(await columnExists(connection, databaseName, 'reservas', 'cancelada_em'))) {
    await connection.query('ALTER TABLE reservas ADD COLUMN cancelada_em DATETIME NULL');
  }

  if (!(await columnExists(connection, databaseName, 'reservas', 'cancelada_por'))) {
    await connection.query('ALTER TABLE reservas ADD COLUMN cancelada_por INT UNSIGNED NULL');
  }

  if (!(await columnExists(connection, databaseName, 'reservas', 'cancelada_por_desativacao_ativo'))) {
    await connection.query('ALTER TABLE reservas ADD COLUMN cancelada_por_desativacao_ativo TINYINT(1) NOT NULL DEFAULT 0');
  }

  if (!(await columnExists(connection, databaseName, 'reservas', 'reserva_ativa'))) {
    await connection.query('ALTER TABLE reservas ADD COLUMN reserva_ativa TINYINT GENERATED ALWAYS AS (IF(cancelada_em IS NULL, 1, NULL)) VIRTUAL');
  }

  if (!(await indexExists(connection, databaseName, 'reservas', 'reservas_ativo_tempo_data_ativa_unique'))) {
    await connection.query('CREATE UNIQUE INDEX reservas_ativo_tempo_data_ativa_unique ON reservas (ativo_id, tempo_id, data_reserva, reserva_ativa)');
  }

  await connection.query(`
    CREATE TABLE IF NOT EXISTS ativos_historico (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      ativo_id INT UNSIGNED NOT NULL,
      usuario_id INT UNSIGNED NOT NULL,
      operacao ENUM('desativacao', 'reativacao') NOT NULL,
      status_anterior ENUM('ativo', 'desativado') NOT NULL,
      status_novo ENUM('ativo', 'desativado') NOT NULL,
      motivo ENUM('defeito', 'manutencao', 'reforma', 'outro') NULL,
      descricao TEXT NULL,
      data_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      INDEX ativos_historico_ativo_id_index (ativo_id),
      CONSTRAINT ativos_historico_ativo_id_foreign FOREIGN KEY (ativo_id) REFERENCES ativos (id),
      CONSTRAINT ativos_historico_usuario_id_foreign FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS notificacoes (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      usuario_id INT UNSIGNED NOT NULL,
      tipo ENUM(
        'cadastro_aprovado',
        'cadastro_rejeitado',
        'reserva_realizada',
        'reserva_aprovada',
        'reserva_alterada',
        'reserva_cancelada'
      ) NOT NULL,
      titulo VARCHAR(140) NOT NULL,
      mensagem TEXT NOT NULL,
      referencia_tipo VARCHAR(40) NULL,
      referencia_id INT UNSIGNED NULL,
      event_key VARCHAR(180) NULL,
      lida TINYINT(1) NOT NULL DEFAULT 0,
      lida_em DATETIME NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY notificacoes_event_key_unique (event_key),
      INDEX notificacoes_usuario_id_index (usuario_id),
      INDEX notificacoes_tipo_index (tipo),
      INDEX notificacoes_lida_index (lida),
      INDEX notificacoes_created_at_index (created_at),
      CONSTRAINT notificacoes_usuario_id_foreign FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await connection.end();
  console.log('Banco e tabelas criados/verificados com sucesso.');
}

main().catch((error) => {
  console.error('Nao foi possivel inicializar o banco. Verifique se o MySQL esta ativo e se o .env esta correto.');
  if (error.code) {
    console.error(`Codigo: ${error.code}`);
  }
  process.exit(1);
});
