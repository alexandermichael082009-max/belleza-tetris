import { Board } from '../engine/board.js';
import { Renderer } from '../engine/renderer.js';
import { GameLoop } from '../engine/game-loop.js';
import { InputHandler } from '../input/input-handler.js';
import { Player } from '../entities/player.js';
import { Piece } from '../entities/piece.js';

/**
 * Escena de juego: coordina tablero, renderer, input y bucle.
 */
export class PlayScene {
  constructor(container, { onGameOver }) {
    this.container = container;
    this.onGameOver = onGameOver;
    this.paused = false;
    this.accumulator = 0;
    this.lastTimestamp = null;
  }

  mount() {
    this.container.innerHTML = `
      <section class="game-wrapper">
        <div class="game-hud">
          <p>Puntos: <span id="game-score">0</span></p>
          <p>Nivel: <span id="game-level">1</span></p>
          <p>Líneas: <span id="game-lines">0</span></p>
        </div>
        <canvas id="game-canvas" class="game-canvas" aria-label="Tablero de Tetris"></canvas>
        <div class="game-controls">
          <button data-action="left" aria-label="Mover a la izquierda">←</button>
          <button data-action="rotate" aria-label="Rotar pieza">↻</button>
          <button data-action="right" aria-label="Mover a la derecha">→</button>
          <button data-action="down" aria-label="Bajar">↓</button>
          <button data-action="drop" aria-label="Soltar pieza">⤓</button>
          <button data-action="pause" aria-label="Pausar">Pausa</button>
        </div>
      </section>
    `;

    this.canvas = this.container.querySelector('#game-canvas');
    this.scoreEl = this.container.querySelector('#game-score');
    this.levelEl = this.container.querySelector('#game-level');
    this.linesEl = this.container.querySelector('#game-lines');
    this.pauseButton = this.container.querySelector('[data-action="pause"]');

    this.board = new Board();
    this.renderer = new Renderer(this.canvas);
    this.player = new Player();

    this.input = new InputHandler({
      moveLeft: () => this.#move(-1, 0),
      moveRight: () => this.#move(1, 0),
      softDrop: () => this.#move(0, 1),
      rotate: () => this.#rotate(),
      hardDrop: () => this.#hardDrop(),
      togglePause: () => this.#togglePause(),
      restart: () => this.#restart(),
    });
    this.input.register();
    this.#bindControlButtons();

    this.loop = new GameLoop((timestamp) => this.#update(timestamp));
    this.loop.start();
    this.#spawn();
    this.#updateHud();
  }

  destroy() {
    this.loop?.stop();
    this.input?.unregister();
  }

  #bindControlButtons() {
    const actions = {
      left: () => this.#move(-1, 0),
      right: () => this.#move(1, 0),
      down: () => this.#move(0, 1),
      rotate: () => this.#rotate(),
      drop: () => this.#hardDrop(),
      pause: () => this.#togglePause(),
    };
    this.container.querySelectorAll('[data-action]').forEach((button) => {
      const handler = actions[button.dataset.action];
      if (handler) button.addEventListener('click', handler);
    });
  }

  #update(timestamp) {
    if (this.paused) {
      this.lastTimestamp = timestamp;
      return;
    }
    if (this.lastTimestamp === null) this.lastTimestamp = timestamp;
    const delta = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;
    if (this.player.activePiece) {
      this.accumulator += delta;
      if (this.accumulator >= this.player.dropInterval()) {
        this.accumulator = 0;
        if (!this.#move(0, 1)) this.#lockPiece();
      }
      this.renderer.render(this.board, this.player.activePiece, this.player.nextPiece);
    }
  }

  #move(dx, dy) {
    const piece = this.player.activePiece;
    if (!piece || !this.board.canPlace(piece, dx, dy)) return false;
    piece.x += dx;
    piece.y += dy;
    return true;
  }

  #rotate() {
    const piece = this.player.activePiece;
    if (!piece) return;
    const rotated = piece.rotatedMatrix();
    for (const kick of [0, -1, 1, -2, 2]) {
      if (this.board.canPlace(piece, kick, 0, rotated)) {
        piece.x += kick;
        piece.matrix = rotated;
        return;
      }
    }
  }

  #hardDrop() {
    const piece = this.player.activePiece;
    if (!piece) return;
    let drop = 0;
    while (this.board.canPlace(piece, 0, drop + 1)) drop += 1;
    piece.y += drop;
    this.#lockPiece();
  }

  #lockPiece() {
    const piece = this.player.activePiece;
    if (!piece) return;
    this.board.merge(piece);
    const cleared = this.board.clearLines();
    this.player.addClearedLines(cleared);
    this.#updateHud();
    this.#spawn();
  }

  #spawn() {
    this.player.activePiece = this.player.nextPiece ?? Piece.random();
    this.player.nextPiece = Piece.random();
    if (!this.board.canPlace(this.player.activePiece)) {
      this.#gameOver();
    }
  }

  #togglePause() {
    this.paused = !this.paused;
    this.pauseButton.textContent = this.paused ? 'Continuar' : 'Pausa';
  }

  #restart() {
    this.board.reset();
    this.player.reset();
    this.accumulator = 0;
    this.#spawn();
    this.#updateHud();
  }

  #updateHud() {
    this.scoreEl.textContent = String(this.player.score);
    this.levelEl.textContent = String(this.player.level);
    this.linesEl.textContent = String(this.player.lines);
  }

  #gameOver() {
    this.loop.stop();
    this.onGameOver(this.player);
  }
}
