import { API_BASE_URL } from '../utils/constants.js';

/**
 * Cliente HTTP centralizado. Toda comunicación con el backend pasa por aquí.
 * Ninguna vista hace fetch directo.
 */
export const apiClient = {
  /**
   * Realiza una petición HTTP y normaliza la respuesta.
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
