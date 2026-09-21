import { apiClient } from './api-client.js';

/**
 * Appointments service. One function per backend endpoint.
 */
export const appointmentsService = {
  /** Lists all appointments. */
  listAll() {
    return apiClient.get('/appointments');
  },

  /** Creates a new appointment. */
  create(payload) {
    return apiClient.post('/appointments', payload);
  },

  /** Updates an existing appointment. */
  update(id, payload) {
    return apiClient.put(`/appointments/${id}`, payload);
  },

  /** Removes an appointment. */
  remove(id) {
    return apiClient.delete(`/appointments/${id}`);
  },
};
