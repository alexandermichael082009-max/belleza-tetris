const httpStatus = require('../utils/http-status');
const { failure } = require('../utils/response-builder');

/**
 * Middleware para rutas inexistentes.
 */
function notFound(req, res) {
  return res
    .status(httpStatus.NOT_FOUND)
    .json(failure(`La ruta ${req.originalUrl} no existe.`));
}

module.exports = notFound;
