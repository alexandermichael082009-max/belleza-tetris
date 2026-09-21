const { AppError } = require('../middlewares/error-handler');
const httpStatus = require('../utils/http-status');
const appointmentModel = require('../models/appointment-model');
const appointmentsRepository = require('../repositories/appointments-repository');

const appointmentsService = {
  /** Lists all appointments. */
  listAll() {
    return appointmentsRepository.findAll();
  },

  /** Creates an appointment with the default status. */
  create(data) {
    const appointment = { ...data, status: appointmentModel.DEFAULT_STATUS };
    return appointmentsRepository.create(appointment);
  },

  /** Updates an appointment after checking it exists. */
  updateById(id, data) {
    const existing = appointmentsRepository.findById(id);
    if (!existing) {
      throw new AppError(httpStatus.NOT_FOUND, 'La cita solicitada no existe.');
    }
    return appointmentsRepository.update(id, data);
  },

  /** Removes an appointment after checking it exists. */
  removeById(id) {
    const existing = appointmentsRepository.findById(id);
    if (!existing) {
      throw new AppError(httpStatus.NOT_FOUND, 'La cita solicitada no existe.');
    }
    return appointmentsRepository.remove(id);
  },
};

module.exports = appointmentsService;
