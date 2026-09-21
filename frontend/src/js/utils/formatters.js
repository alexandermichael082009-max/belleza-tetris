import { ITBIS_RATE, SERVICE_PRICES, SERVICE_LABELS } from './constants.js';

/**
 * Formats a number as Dominican currency (DOP).
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
 * Formats an ISO date into a readable local format.
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
 * Computes subtotal, ITBIS and total for a service.
 * Centralized here so views do not duplicate the logic.
 * @param {string} serviceKey
 * @returns {{subtotal: number, itbis: number, total: number}}
 */
export function calculateServiceTotals(serviceKey) {
  const subtotal = SERVICE_PRICES[serviceKey] ?? 0;
  const itbis = subtotal * ITBIS_RATE;
  return { subtotal, itbis, total: subtotal + itbis };
}

/**
 * Returns the human-readable label of a service.
 * @param {string} serviceKey
 * @returns {string}
 */
export function getServiceLabel(serviceKey) {
  return SERVICE_LABELS[serviceKey] ?? serviceKey;
}
