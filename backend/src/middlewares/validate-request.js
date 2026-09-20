const { validationResult } = require('express-validator');
const httpStatus = require('../utils/http-status');
const { failure } = require('../utils/response-builder');

/**
 * Envuelve un arreglo de validaciones de express-validator y
 * responde 400 con JSON uniforme cuando fallan.
 * @param {Array} validations
 * @returns {Array} middlewares encadenados
 */
function validateRequest(validations) {
  return [
    validations,
    (req, res, next) => {
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(failure('Los datos enviados no son válidos.', errors.array()));
    },
  ];
}

module.exports = validateRequest;
