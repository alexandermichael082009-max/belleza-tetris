import { GAME, PIECE_COLORS } from '../../utils/constants.js';

/**
 * Renderizador en Canvas del tablero, pieza activa, fantasma, rejilla y siguiente pieza.
 */
export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.canvas.width = GAME.COLS * GAME.BLOCK_SIZE;
    this.canvas.height = GAME.ROWS * GAME.BLOCK_SIZE;
  }

  render(board, piece, nextPiece) {
    this.#clear();
    this.#drawPlayfield(board);
    this.#drawGhost(board, piece);
    this.#drawPiece(piece);
    this.#drawGridLines();
    this.#drawNext(nextPiece);
  }

  #clear() {
    this.ctx.fillStyle = this.#cssVar('--color-surface') || '#ffffff';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  #drawPlayfield(board) {
    board.grid.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) this.#drawCell(x, y, PIECE_COLORS[value]);
      });
    });
  }

  #drawGhost(board, piece) {
    let drop = 0;
    while (board.canPlace(piece, 0, drop + 1)) drop += 1;
    if (drop === 0) return;
    const color = PIECE_COLORS[piece.colorId];
    piece.matrix.forEach((line, dy) => {
      line.forEach((value, dx) => {
        if (value === 0) return;
        this.ctx.globalAlpha = 0.25;
        this.#drawCell(piece.x + dx, piece.y + dy + drop, color);
        this.ctx.globalAlpha = 1;
      });
    });
  }

  #drawPiece(piece) {
    const color = PIECE_COLORS[piece.colorId];
    piece.matrix.forEach((line, dy) => {
      line.forEach((value, dx) => {
        if (value === 0) return;
        this.#drawCell(piece.x + dx, piece.y + dy, color);
      });
    });
  }

  #drawGridLines() {
    this.ctx.strokeStyle = 'rgba(128, 128, 128, 0.18)';
    this.ctx.lineWidth = 1;
    for (let x = 1; x < GAME.COLS; x += 1) {
      // Líneas verticales por columna.
      this.ctx.beginPath();
      this.ctx.moveTo(x * GAME.BLOCK_SIZE, 0);
      this.ctx.lineTo(x * GAME.BLOCK_SIZE, this.canvas.height);
      this.ctx.stroke();
    }
    for (let y = 1; y < GAME.ROWS; y += 1) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y * GAME.BLOCK_SIZE);
      this.ctx.lineTo(this.canvas.width, y * GAME.BLOCK_SIZE);
      this.ctx.stroke();
    }
  }

  #drawNext(piece) {
    const size = Math.round(GAME.BLOCK_SIZE * 0.6);
    const label = this.#cssVar('--color-text-soft') || '#6b6b6b';
    this.ctx.fillStyle = label;
    this.ctx.font = '12px sans-serif';
    const startX = this.canvas.width - size * 4 - GAME.BLOCK_SIZE;
    const startY = GAME.BLOCK_SIZE * 3;

    this.ctx.fillText('Siguiente', startX, startY - GAME.BLOCK_SIZE * 1.5);
    const color = PIECE_COLORS[piece.colorId];
    piece.matrix.forEach((line, dy) => {
      line.forEach((value, dx) => {
        if (value === 0) return;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(startX + dx * size, startY + dy * size, size - 1, size - 1);
      });
    });
  }

  #drawCell(col, row, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(
      col * GAME.BLOCK_SIZE,
      row * GAME.BLOCK_SIZE,
      GAME.BLOCK_SIZE - 1,
      GAME.BLOCK_SIZE - 1,
    );
  }

  /** Lee una variable CSS del documento (para adaptar el canvas al tema). */
  #cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
}
