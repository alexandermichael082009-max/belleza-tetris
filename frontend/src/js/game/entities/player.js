import { GAME } from '../../utils/constants.js';

/**
 * Entidad jugador: puntuación, nivel, líneas y piezas activas.
 */
export class Player {
  constructor() {
    this.score = 0;
    this.level = 1;
    this.lines = 0;
    this.activePiece = null;
    this.nextPiece = null;
  }

  /** Reinicia el estado del jugador. */
  reset() {
    this.score = 0;
    this.level = 1;
    this.lines = 0;
    this.activePiece = null;
    this.nextPiece = null;
  }

  /** Suma líneas limpiadas y recalcula score y nivel. */
  addClearedLines(count) {
    if (count <= 0) return;
    this.lines += count;
    this.score += count * GAME.POINTS_PER_LINE * this.level;
    this.level = Math.floor(this.lines / GAME.LINES_PER_LEVEL) + 1;
  }

  /** Intervalo de caída en ms según el nivel actual. */
  dropInterval() {
    const speedUp = (this.level - 1) * GAME.SPEED_STEP_MS;
    return Math.max(GAME.MIN_DROP_MS, GAME.INITIAL_DROP_MS - speedUp);
  }
}
