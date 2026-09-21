import { apiClient } from './api-client.js';

/**
 * Chatbot service. Sends the user message to the backend
 * and receives the generated reply.
 */
export const chatbotService = {
  sendMessage(message) {
    return apiClient.post('/chatbot', { message });
  },
};
