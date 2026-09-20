/**
 * Modelo de la entidad Puntuación (score).
 */

const TABLE_NAME = 'scores';

const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_name TEXT NOT NULL,
    score INTEGER NOT NULL,
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
    playerName: row.player_name,
    score: row.score,
    createdAt: row.created_at,
  };
}

module.exports = { TABLE_NAME, createTable, toEntity };
