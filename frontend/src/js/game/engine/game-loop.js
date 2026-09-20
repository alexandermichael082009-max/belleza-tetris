/**
 * Bucle principal del juego basado en requestAnimationFrame.
 * Llama al callback con el timestamp de cada fotograma.
 */
export class GameLoop {
  constructor(callback) {
    this.callback = callback;
    this.running = false;
    this.animationFrame = null;
  }

  /** Inicia el bucle. */
  start() {
    if (this.running) return;
    this.running = true;
    this.#step(performance.now());
  }

  /** Detiene el bucle. */
  stop() {
    this.running = false;
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  #step(timestamp) {
    if (!this.running) return;
    this.callback(timestamp);
    this.animationFrame = requestAnimationFrame((time) => this.#step(time));
  }
}
