const httpStatus = require('../utils/http-status');
const { failure } = require('../utils/response-builder');

/**
 * Middleware for unmatched routes.
 */
function notFound(req, res) {
  return res
    .status(httpStatus.NOT_FOUND)
    .json(failure(`La ruta ${req.originalUrl} no existe.`));
}

module.exports = notFound;
