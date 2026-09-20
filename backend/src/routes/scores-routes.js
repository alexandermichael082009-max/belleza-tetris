const express = require('express');
const { body, query } = require('express-validator');
const scoresController = require('../controllers/scores-controller');
const validateRequest = require('../middlewares/validate-request');

const router = express.Router();

router.get(
  '/',
  validateRequest([query('limit').optional().isInt({ min: 1, max: 50 }).toInt()]),
  scoresController.listTop,
);

router.post(
  '/',
  validateRequest([
    body('playerName').trim().escape().isLength({ min: 1, max: 40 }),
    body('score').isInt({ min: 1 }),
  ]),
  scoresController.saveScore,
);

module.exports = router;
