import { apiClient } from './api-client.js';

/**
 * Servicio del chatbot. Envía el mensaje del usuario al backend
 * y recibe la respuesta generada.
 */
export const chatbotService = {
  sendMessage(message) {
    return apiClient.post('/chatbot', { message });
  },
};
