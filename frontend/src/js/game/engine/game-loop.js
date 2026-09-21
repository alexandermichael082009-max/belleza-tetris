/**
 * Main game loop based on requestAnimationFrame.
 * Calls the callback with the timestamp of each frame.
 */
export class GameLoop {
  constructor(callback) {
    this.callback = callback;
    this.running = false;
    this.animationFrame = null;
  }

  /** Starts the loop. */
  start() {
    if (this.running) return;
    this.running = true;
    this.#step(performance.now());
  }

  /** Stops the loop. */
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
