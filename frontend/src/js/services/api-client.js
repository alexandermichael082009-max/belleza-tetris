import { API_BASE_URL } from '../utils/constants.js';

/**
 * Centralized HTTP client. All backend communication goes through here.
 * No view performs a direct fetch.
 */
export const apiClient = {
  /**
   * Performs an HTTP request and normalizes the response.
   * @param {string} endpoint
   * @param {RequestInit} [options]
   * @returns {Promise<{success: boolean, data: any, message: string}>}
   */
  async request(endpoint, options = {}) {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const payload = await response.json().catch(() => ({
      success: false,
      data: null,
      message: 'Respuesta inválida del servidor.',
    }));

    if (!response.ok) {
      throw new Error(payload.message || `Error HTTP ${response.status}`);
    }
    return payload;
  },

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },

  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },
};
