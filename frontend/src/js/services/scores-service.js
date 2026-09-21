import { apiClient } from './api-client.js';

/**
 * Game scores service (leaderboard).
 */
export const scoresService = {
  /** Gets the top scores. */
  listTop(limit = 10) {
    return apiClient.get(`/scores?limit=${limit}`);
  },

  /** Saves a new score. */
  saveScore(payload) {
    return apiClient.post('/scores', payload);
  },
};
