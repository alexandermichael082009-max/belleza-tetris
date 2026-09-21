import { THEMES, STORAGE_KEYS } from '../utils/constants.js';

/**
 * Manages the light/dark theme switch and its persistence.
 */
export class ThemeManager {
  constructor(toggleButton) {
    this.toggleButton = toggleButton;
    this.currentTheme = this.#loadTheme();
  }

  /** Initializes the theme and registers the toggle event. */
  init() {
    this.#applyTheme(this.currentTheme);
    this.toggleButton.addEventListener('click', () => this.toggle());
  }

  /** Switches between light and dark. */
  toggle() {
    const next = this.currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
    this.#applyTheme(next);
  }

  /** Applies the theme to the DOM and stores it in localStorage. */
  #applyTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    this.toggleButton.textContent = theme === THEMES.LIGHT ? '🌙' : '☀️';
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }

  /** Loads the stored theme or detects the system preference. */
  #loadTheme() {
    const stored = localStorage.getItem(STORAGE_KEYS.THEME);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? THEMES.DARK
      : THEMES.LIGHT;
  }
}
