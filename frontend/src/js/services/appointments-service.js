import { apiClient } from './api-client.js';

/**
 * Servicio de citas. Una función por cada punto de acceso del backend.
 */
export const appointmentsService = {
  /** Lista todas las citas. */
  listAll() {
    return apiClient.get('/appointments');
  },

  /** Crea una nueva cita. */
  create(payload) {
    return apiClient.post('/appointments', payload);
  },

  /** Actualiza una cita existente. */
  update(id, payload) {
    return apiClient.put(`/appointments/${id}`, payload);
  },

  /** Elimina una cita. */
  remove(id) {
    return apiClient.delete(`/appointments/${id}`);
  },
};
