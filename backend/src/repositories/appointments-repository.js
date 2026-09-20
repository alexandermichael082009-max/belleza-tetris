const { getDb } = require('../config/database');
const appointmentModel = require('../models/appointment-model');

const { TABLE_NAME, toEntity } = appointmentModel;

const COLUMNS = 'id, name, email, phone, service, date, status, created_at';

const appointmentsRepository = {
  /** Crea una cita con consultas parametrizadas. */
  create(data) {
    const result = getDb()
      .prepare(
        `INSERT INTO ${TABLE_NAME} (name, email, phone, service, date, status)
         VALUES (@name, @email, @phone, @service, @date, @status)`,
      )
      .run(data);
    return this.findById(result.lastInsertRowid);
  },

  findAll() {
    const rows = getDb()
      .prepare(`SELECT ${COLUMNS} FROM ${TABLE_NAME} ORDER BY date ASC`)
      .all();
    return rows.map(toEntity);
  },

  findById(id) {
    const row = getDb()
      .prepare(`SELECT ${COLUMNS} FROM ${TABLE_NAME} WHERE id = ?`)
      .get(id);
    return toEntity(row);
  },

  update(id, data) {
    getDb()
      .prepare(
        `UPDATE ${TABLE_NAME}
         SET name = @name, email = @email, phone = @phone,
             service = @service, date = @date
         WHERE id = @id`,
      )
      .run({ ...data, id });
    return this.findById(id);
  },

  remove(id) {
    const existing = this.findById(id);
    getDb().prepare(`DELETE FROM ${TABLE_NAME} WHERE id = ?`).run(id);
    return existing;
  },
};

module.exports = appointmentsRepository;
