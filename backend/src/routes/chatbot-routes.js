const express = require('express');
const { body } = require('express-validator');
const chatbotController = require('../controllers/chatbot-controller');
const validateRequest = require('../middlewares/validate-request');

const router = express.Router();

router.post(
  '/',
  validateRequest([body('message').trim().escape().isLength({ min: 1, max: 300 })]),
  chatbotController.reply,
);

module.exports = router;
