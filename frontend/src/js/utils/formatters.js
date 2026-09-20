import { ITBIS_RATE, SERVICE_PRICES, SERVICE_LABELS } from './constants.js';

/**
 * Formatea un número como moneda dominicana (DOP).
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'DOP',
  }).format(amount);
}

/**
 * Formatea una fecha ISO a formato local legible.
 * @param {string} isoDate
 * @returns {string}
 */
export function formatDate(isoDate) {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat('es-DO', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(date);
}

/**
 * Calcula subtotal, ITBIS y total de un servicio.
 * Centralizado aquí para no duplicar lógica en vistas.
 * @param {string} serviceKey
 * @returns {{subtotal: number, itbis: number, total: number}}
 */
export function calculateServiceTotals(serviceKey) {
  const subtotal = SERVICE_PRICES[serviceKey] ?? 0;
  const itbis = subtotal * ITBIS_RATE;
  return { subtotal, itbis, total: subtotal + itbis };
}

/**
 * Devuelve la etiqueta legible de un servicio.
 * @param {string} serviceKey
 * @returns {string}
 */
export function getServiceLabel(serviceKey) {
  return SERVICE_LABELS[serviceKey] ?? serviceKey;
}
