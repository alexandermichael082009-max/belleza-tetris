const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const env = require('./env');
const appointmentModel = require('../models/appointment-model');
const scoreModel = require('../models/score-model');

let connection = null;

/**
 * Devuelve la conexión única a SQLite (singleton con modo WAL).
 */
function getDb() {
  if (!connection) {
    const directory = path.dirname(env.DB_PATH);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    connection = new Database(env.DB_PATH);
    connection.pragma('journal_mode = WAL');
  }
  return connection;
}

/**
 * Crea las tablas si no existen y siembra datos iniciales.
 */
function seedDatabase() {
  const db = getDb();
  appointmentModel.createTable(db);
  scoreModel.createTable(db);
  seedSampleAppointments(db);
}

function seedSampleAppointments(db) {
  const count = db.prepare('SELECT COUNT(*) AS total FROM appointments').get().total;
  if (count > 0) {
    return;
  }
  const insert = db.prepare(
    'INSERT INTO appointments (name, email, phone, service, date, status) VALUES (?, ?, ?, ?, ?, ?)',
  );
  const sample = [
    [
      'María Pérez',
      'maria@correo.com',
      '8095550101',
      'corte',
      '2026-10-01T10:30',
      'pending',
    ],
    [
      'Juan Rodríguez',
      'juan@correo.com',
      '8095550102',
      'facial',
      '2026-10-02T15:00',
      'confirmed',
    ],
  ];
  for (const row of sample) {
    insert.run(...row);
  }
}

module.exports = { getDb, seedDatabase };
