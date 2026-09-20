import { apiClient } from './api-client.js';

/**
 * Servicio de puntuaciones del juego (leaderboard).
 */
export const scoresService = {
  /** Obtiene las mejores puntuaciones. */
  listTop(limit = 10) {
    return apiClient.get(`/scores?limit=${limit}`);
  },

  /** Guarda una puntuación nueva. */
  saveScore(payload) {
    return apiClient.post('/scores', payload);
  },
};
