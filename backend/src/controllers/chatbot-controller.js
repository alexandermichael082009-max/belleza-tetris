const httpStatus = require('../utils/http-status');
const { success } = require('../utils/response-builder');
const chatbotService = require('../services/chatbot-service');

const chatbotController = {
  reply(req, res, next) {
    try {
      const reply = chatbotService.reply(req.body.message);
      return res.status(httpStatus.OK).json(success({ reply }, 'Respuesta generada.'));
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = chatbotController;
