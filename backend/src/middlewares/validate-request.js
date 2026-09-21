const { validationResult } = require('express-validator');
const httpStatus = require('../utils/http-status');
const { failure } = require('../utils/response-builder');

/**
 * Wraps an express-validator chain and answers 400 with a uniform JSON
 * response when validation fails.
 * @param {Array} validations
 * @returns {Array} chained middlewares
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
