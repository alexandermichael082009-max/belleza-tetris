const httpStatus = require('../utils/http-status');
const { failure } = require('../utils/response-builder');

/**
 * Application error carrying its own HTTP status code.
 */
class AppError extends Error {
  constructor(status, message, data = null) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

/**
 * Global error middleware. Transforms any error into a uniform JSON response.
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
