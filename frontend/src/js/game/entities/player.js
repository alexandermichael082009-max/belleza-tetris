import { GAME } from '../../utils/constants.js';

/**
 * Player entity: score, level, lines and active pieces.
 */
export class Player {
  constructor() {
    this.score = 0;
    this.level = 1;
    this.lines = 0;
    this.activePiece = null;
    this.nextPiece = null;
  }

  /** Resets the player state. */
  reset() {
    this.score = 0;
    this.level = 1;
    this.lines = 0;
    this.activePiece = null;
    this.nextPiece = null;
  }

  /** Adds cleared lines and recomputes score and level. */
  addClearedLines(count) {
    if (count <= 0) return;
    this.lines += count;
    this.score += count * GAME.POINTS_PER_LINE * this.level;
    this.level = Math.floor(this.lines / GAME.LINES_PER_LEVEL) + 1;
  }

  /** Drop interval in ms based on the current level. */
  dropInterval() {
    const speedUp = (this.level - 1) * GAME.SPEED_STEP_MS;
    return Math.max(GAME.MIN_DROP_MS, GAME.INITIAL_DROP_MS - speedUp);
  }
}
