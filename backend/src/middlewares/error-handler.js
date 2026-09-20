const httpStatus = require('../utils/http-status');
const { failure } = require('../utils/response-builder');

/**
 * Error de aplicación con código HTTP propio.
 */
class AppError extends Error {
  constructor(status, message, data = null) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

/**
 * Middleware global de errores. Transforma cualquier error en JSON uniforme.
 */
function errorHandler(error, _req, res, _next) {
  const status = error.status || httpStatus.INTERNAL_SERVER_ERROR;
  if (status >= httpStatus.INTERNAL_SERVER_ERROR) {
    process.stderr.write(`[error] ${error.stack}\n`);
  }
  return res
    .status(status)
    .json(failure(error.message || 'Error interno del servidor.', error.data || null));
}

module.exports = { AppError, errorHandler };
