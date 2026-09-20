const express = require('express');
const { body, param } = require('express-validator');
const appointmentsController = require('../controllers/appointments-controller');
const validateRequest = require('../middlewares/validate-request');
const appointmentModel = require('../models/appointment-model');

const router = express.Router();

const appointmentValidations = [
  body('name').trim().escape().isLength({ min: 3, max: 80 }),
  body('email').trim().isEmail().normalizeEmail(),
  body('phone').trim().escape().isLength({ min: 7, max: 15 }),
  body('service').isIn(appointmentModel.VALID_SERVICES),
  body('date')
    .isISO8601()
    .custom((value) => new Date(value) > new Date())
    .withMessage('La fecha debe estar en formato ISO y ser futura.'),
];

const idValidation = [param('id').isInt().toInt()];

router.get('/', appointmentsController.listAll);

router.post('/', validateRequest(appointmentValidations), appointmentsController.create);

router.put(
  '/:id',
  validateRequest([...idValidation, ...appointmentValidations]),
  appointmentsController.updateById,
);

router.delete('/:id', validateRequest(idValidation), appointmentsController.removeById);

module.exports = router;
