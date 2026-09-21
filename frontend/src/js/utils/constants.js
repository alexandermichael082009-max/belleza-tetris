/**
 * Global frontend constants.
 * Used to avoid magic numbers and repeated strings.
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

/** Piece palette. Index 0 is left empty (empty cell). */
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

/** Canvas rendering constants (no magic numbers in the renderer). */
export const RENDERER = Object.freeze({
  GHOST_ALPHA: 0.25,
  FULL_ALPHA: 1,
  GRID_STROKE: 'rgba(128, 128, 128, 0.18)',
  GRID_LINE_WIDTH: 1,
  NEXT_SCALE: 0.6,
  NEXT_SPACING: 4,
  NEXT_TOP_ROW: 3,
  NEXT_LABEL_OFFSET: 1.5,
  NEXT_FONT: '12px sans-serif',
  SURFACE_FALLBACK: '#ffffff',
  TEXT_SOFT_FALLBACK: '#6b6b6b',
});

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
