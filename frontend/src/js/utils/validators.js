import { SERVICE_PRICES } from './constants.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-\s]{7,15}$/;

/**
 * Validates the appointment form data on the client.
 * @param {{name: string, email: string, phone: string, service: string, date: string}} data
 * @returns {Object<string, string>} errors per field (empty if valid)
 */
export function validateAppointmentForm(data) {
  const errors = {};

  if (!data.name || data.name.trim().length < 3) {
    errors.name = 'El nombre debe tener al menos 3 caracteres.';
  }
  if (!EMAIL_REGEX.test(data.email)) {
    errors.email = 'Correo electrónico inválido.';
  }
  if (!PHONE_REGEX.test(data.phone)) {
    errors.phone = 'Teléfono inválido (7 a 15 dígitos).';
  }
  if (!Object.keys(SERVICE_PRICES).includes(data.service)) {
    errors.service = 'Selecciona un servicio válido.';
  }
  if (!isValidFutureDate(data.date)) {
    errors.date = 'La fecha debe ser futura.';
  }

  return errors;
}

/**
 * Indicates whether an errors object is empty.
 * @param {Object} errors
 * @returns {boolean}
 */
export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}

function isValidFutureDate(value) {
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  return date > new Date();
}
