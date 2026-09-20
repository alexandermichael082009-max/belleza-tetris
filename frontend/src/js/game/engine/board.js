import { GAME } from '../../utils/constants.js';

/**
 * Representa el tablero del Tetris como matriz.
 * Guarda el colorId de cada celda fija (0 = vacía).
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

  /** Reinicia el tablero. */
  reset() {
    this.grid = this.#createEmptyGrid();
  }

  /**
   * Indica si la pieza cabe en la posición desplazada.
   * @param {Piece} piece
   * @param {number} [dx] Desplazamiento en columnas.
   * @param {number} [dy] Desplazamiento en filas.
   * @param {number[][]} [matrix] Matriz a evaluar (útil al rotar).
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

  /** Indica si una celda está dentro del tablero y vacía. */
  isFree(row, col) {
    return (
      row >= 0 &&
      row < this.rows &&
      col >= 0 &&
      col < this.cols &&
      this.grid[row][col] === 0
    );
  }

  /** Fija una pieza en el tablero. */
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

  /** Elimina líneas completas y devuelve cuántas se quitaron. */
  clearLines() {
    const remaining = this.grid.filter((row) => row.includes(0));
    const cleared = this.rows - remaining.length;
    if (cleared === 0) return 0;
    const empty = Array.from({ length: cleared }, () => Array(this.cols).fill(0));
    this.grid = [...empty, ...remaining];
    return cleared;
  }
}
