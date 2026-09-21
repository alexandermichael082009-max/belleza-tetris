import { GAME } from '../../utils/constants.js';

/**
 * Represents the Tetris board as a matrix.
 * Stores the colorId of every locked cell (0 = empty).
 */
export class Board {
  constructor() {
    this.rows = GAME.ROWS;
    this.cols = GAME.COLS;
    this.grid = this.#createEmptyGrid();
  }

  #createEmptyGrid() {
    return Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
  }

  /** Resets the board. */
  reset() {
    this.grid = this.#createEmptyGrid();
  }

  /**
   * Indicates whether the piece fits in the shifted position.
   * @param {Piece} piece
   * @param {number} [dx] column displacement
   * @param {number} [dy] row displacement
   * @param {number[][]} [matrix] matrix to evaluate (useful when rotating)
   * @returns {boolean}
   */
  canPlace(piece, dx = 0, dy = 0, matrix = piece.matrix) {
    for (let y = 0; y < matrix.length; y += 1) {
      for (let x = 0; x < matrix[y].length; x += 1) {
        if (matrix[y][x] === 0) continue;
        const row = piece.y + dy + y;
        const col = piece.x + dx + x;
        if (!this.isFree(row, col)) return false;
      }
    }
    return true;
  }

  /** Indicates whether a cell is inside the board and empty. */
  isFree(row, col) {
    return (
      row >= 0 &&
      row < this.rows &&
      col >= 0 &&
      col < this.cols &&
      this.grid[row][col] === 0
    );
  }

  /** Locks a piece into the board. */
  merge(piece) {
    piece.matrix.forEach((line, dy) => {
      line.forEach((value, dx) => {
        if (value === 0) return;
        const row = piece.y + dy;
        const col = piece.x + dx;
        if (this.isFree(row, col)) this.grid[row][col] = piece.colorId;
      });
    });
  }

  /** Removes full lines and returns how many were cleared. */
  clearLines() {
    const remaining = this.grid.filter((row) => row.includes(0));
    const cleared = this.rows - remaining.length;
    if (cleared === 0) return 0;
    const empty = Array.from({ length: cleared }, () => Array(this.cols).fill(0));
    this.grid = [...empty, ...remaining];
    return cleared;
  }
}
