/**
 * Constantes globales del frontend.
 * Se usan para evitar números mágicos y strings repetidos.
 */

export const API_BASE_URL = 'http://localhost:3000/api';

export const ROUTES = Object.freeze({
  HOME: 'home',
  APPOINTMENTS: 'appointments',
  GAME: 'game',
  SCORES: 'scores',
});

export const THEMES = Object.freeze({
  LIGHT: 'light',
  DARK: 'dark',
});

export const STORAGE_KEYS = Object.freeze({
  THEME: 'belleza-tetris-theme',
});

export const GAME = Object.freeze({
  COLS: 10,
  ROWS: 20,
  BLOCK_SIZE: 26,
  INITIAL_DROP_MS: 700,
  MIN_DROP_MS: 120,
  SPEED_STEP_MS: 40,
  LINES_PER_LEVEL: 5,
  POINTS_PER_LINE: 100,
});

/** Palette de las piezas. El índice 0 se deja vacío (celda sin pieza). */
export const PIECE_COLORS = Object.freeze([
  '',
  '#d6336c',
  '#f59f00',
  '#37b24d',
  '#1c7ed6',
  '#6741d9',
  '#e8590c',
  '#e03131',
]);

export const ITBIS_RATE = 0.18;

export const SERVICE_PRICES = Object.freeze({
  corte: 800,
  tinte: 1500,
  manicure: 600,
  facial: 1200,
});

export const SERVICE_LABELS = Object.freeze({
  corte: 'Corte de cabello',
  tinte: 'Tinte',
  manicure: 'Manicure',
  facial: 'Facial',
});
