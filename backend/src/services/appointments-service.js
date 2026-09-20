const { AppError } = require('../middlewares/error-handler');
const httpStatus = require('../utils/http-status');
const appointmentModel = require('../models/appointment-model');
const appointmentsRepository = require('../repositories/appointments-repository');

const appointmentsService = {
  /** Lista todas las citas. */
  listAll() {
    return appointmentsRepository.findAll();
  },

  /** Crea una cita asignando el estado por defecto. */
  create(data) {
    const appointment = { ...data, status: appointmentModel.DEFAULT_STATUS };
    return appointmentsRepository.create(appointment);
  },

  /** Actualiza una cita; valida que exista. */
  updateById(id, data) {
    const existing = appointmentsRepository.findById(id);
    if (!existing) {
      throw new AppError(httpStatus.NOT_FOUND, 'La cita solicitada no existe.');
    }
    return appointmentsRepository.update(id, data);
  },

  /** Elimina una cita; valida que exista. */
  removeById(id) {
    const existing = appointmentsRepository.findById(id);
    if (!existing) {
      throw new AppError(httpStatus.NOT_FOUND, 'La cita solicitada no existe.');
    }
    return appointmentsRepository.remove(id);
  },
};

module.exports = appointmentsService;
