import { THEMES, STORAGE_KEYS } from '../utils/constants.js';

/**
 * Gestiona el cambio de tema (claro / oscuro) y su persistencia.
 */
export class ThemeManager {
  constructor(toggleButton) {
    this.toggleButton = toggleButton;
    this.currentTheme = this.#loadTheme();
  }

  /** Inicializa el tema y registra el evento del botón. */
  init() {
    this.#applyTheme(this.currentTheme);
    this.toggleButton.addEventListener('click', () => this.toggle());
  }

  /** Alterna entre claro y oscuro. */
  toggle() {
    const next = this.currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
    this.#applyTheme(next);
  }

  /** Aplica el tema al DOM y lo guarda en localStorage. */
  #applyTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    this.toggleButton.textContent = theme === THEMES.LIGHT ? '🌙' : '☀️';
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }

  /** Recupera el tema guardado o detecta preferencia del sistema. */
  #loadTheme() {
    const stored = localStorage.getItem(STORAGE_KEYS.THEME);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? THEMES.DARK
      : THEMES.LIGHT;
  }
}
