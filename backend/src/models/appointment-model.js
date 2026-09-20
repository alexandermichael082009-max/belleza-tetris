/**
 * Modelo de la entidad Cita (appointment).
 */

const TABLE_NAME = 'appointments';

const VALID_SERVICES = Object.freeze(['corte', 'tinte', 'manicure', 'facial']);

const DEFAULT_STATUS = 'pending';

const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    service TEXT NOT NULL,
    date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`;

function createTable(db) {
  db.exec(CREATE_TABLE_SQL);
}

function toEntity(row) {
  if (!row) {
    return null;
  }
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    service: row.service,
    date: row.date,
    status: row.status,
    createdAt: row.created_at,
  };
}

module.exports = {
  TABLE_NAME,
  VALID_SERVICES,
  DEFAULT_STATUS,
  createTable,
  toEntity,
};
