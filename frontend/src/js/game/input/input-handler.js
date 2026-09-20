const KEY_ACTIONS = Object.freeze({
  ArrowLeft: 'moveLeft',
  KeyA: 'moveLeft',
  ArrowRight: 'moveRight',
  KeyD: 'moveRight',
  ArrowDown: 'softDrop',
  KeyS: 'softDrop',
  ArrowUp: 'rotate',
  KeyW: 'rotate',
  Space: 'hardDrop',
  KeyP: 'togglePause',
  KeyR: 'restart',
});

/**
 * Traduce eventos de teclado a acciones del juego.
 * Se registra/elimina para no acumular listeners entre partidas.
 */
export class InputHandler {
  constructor(actions) {
    this.actions = actions;
    this.boundKeyDown = (event) => this.#handleKeyDown(event);
  }

  register() {
    document.addEventListener('keydown', this.boundKeyDown);
  }

  unregister() {
    document.removeEventListener('keydown', this.boundKeyDown);
  }

  #handleKeyDown(event) {
    const action = KEY_ACTIONS[event.code];
    if (!action) return;
    event.preventDefault();
    const handler = this.actions[action];
    if (handler) handler();
  }
}
