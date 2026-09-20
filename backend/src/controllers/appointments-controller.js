const httpStatus = require('../utils/http-status');
const { success } = require('../utils/response-builder');
const appointmentsService = require('../services/appointments-service');

const appointmentsController = {
  listAll(_req, res, next) {
    try {
      const data = appointmentsService.listAll();
      return res
        .status(httpStatus.OK)
        .json(success(data, 'Citas listadas correctamente.'));
    } catch (error) {
      return next(error);
    }
  },

  create(req, res, next) {
    try {
      const data = appointmentsService.create(req.body);
      return res
        .status(httpStatus.CREATED)
        .json(success(data, 'Cita creada correctamente.'));
    } catch (error) {
      return next(error);
    }
  },

  updateById(req, res, next) {
    try {
      const data = appointmentsService.updateById(Number(req.params.id), req.body);
      return res
        .status(httpStatus.OK)
        .json(success(data, 'Cita actualizada correctamente.'));
    } catch (error) {
      return next(error);
    }
  },

  removeById(req, res, next) {
    try {
      const data = appointmentsService.removeById(Number(req.params.id));
      return res
        .status(httpStatus.OK)
        .json(success(data, 'Cita eliminada correctamente.'));
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = appointmentsController;
