const { AppError } = require('../middlewares/error-handler');
const httpStatus = require('../utils/http-status');
const scoresRepository = require('../repositories/scores-repository');

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

const scoresService = {
  /** Returns the top scores within a bounded limit. */
  listTop(limit) {
    const safeLimit = Math.min(Math.max(Number(limit) || DEFAULT_LIMIT, 1), MAX_LIMIT);
    return scoresRepository.findTop(safeLimit);
  },

  /** Saves a score after validating it is positive. */
  saveScore(data) {
    const score = Math.floor(Number(data.score) || 0);
    if (score <= 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'El puntaje debe ser un número positivo.',
      );
    }
    return scoresRepository.create({
      playerName: data.playerName.trim(),
      score,
    });
  },
};

module.exports = scoresService;
