const httpStatus = require('../utils/http-status');
const { success } = require('../utils/response-builder');
const scoresService = require('../services/scores-service');

const scoresController = {
  listTop(req, res, next) {
    try {
      const data = scoresService.listTop(req.query.limit);
      return res.status(httpStatus.OK).json(success(data, 'Puntuaciones obtenidas.'));
    } catch (error) {
      return next(error);
    }
  },

  saveScore(req, res, next) {
    try {
      const data = scoresService.saveScore(req.body);
      return res.status(httpStatus.CREATED).json(success(data, 'Puntuación guardada.'));
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = scoresController;
