const { getDb } = require('../config/database');
const scoreModel = require('../models/score-model');

const { TABLE_NAME, toEntity } = scoreModel;

const COLUMNS = 'id, player_name, score, created_at';

const scoresRepository = {
  /** Crea una puntuación con consultas parametrizadas. */
  create(data) {
    const result = getDb()
      .prepare(
        `INSERT INTO ${TABLE_NAME} (player_name, score) VALUES (@playerName, @score)`,
      )
      .run(data);
    return this.findById(result.lastInsertRowid);
  },

  findById(id) {
    const row = getDb()
      .prepare(`SELECT ${COLUMNS} FROM ${TABLE_NAME} WHERE id = ?`)
      .get(id);
    return toEntity(row);
  },

  findTop(limit) {
    const rows = getDb()
      .prepare(`SELECT ${COLUMNS} FROM ${TABLE_NAME} ORDER BY score DESC LIMIT ?`)
      .all(limit);
    return rows.map(toEntity);
  },
};

module.exports = scoresRepository;
