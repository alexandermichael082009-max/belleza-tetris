import { GAME, PIECE_COLORS, RENDERER } from '../../utils/constants.js';

/**
 * Canvas renderer for the board, active piece, ghost, grid and next piece.
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
    this.ctx.fillStyle = this.#cssVar('--color-surface') || RENDERER.SURFACE_FALLBACK;
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
        this.ctx.globalAlpha = RENDERER.GHOST_ALPHA;
        this.#drawCell(piece.x + dx, piece.y + dy + drop, color);
        this.ctx.globalAlpha = RENDERER.FULL_ALPHA;
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
    this.ctx.strokeStyle = RENDERER.GRID_STROKE;
    this.ctx.lineWidth = RENDERER.GRID_LINE_WIDTH;
    for (let x = 1; x < GAME.COLS; x += 1) {
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
    const size = Math.round(GAME.BLOCK_SIZE * RENDERER.NEXT_SCALE);
    const label = this.#cssVar('--color-text-soft') || RENDERER.TEXT_SOFT_FALLBACK;
    this.ctx.fillStyle = label;
    this.ctx.font = RENDERER.NEXT_FONT;
    const startX = this.canvas.width - size * RENDERER.NEXT_SPACING - GAME.BLOCK_SIZE;
    const startY = GAME.BLOCK_SIZE * RENDERER.NEXT_TOP_ROW;

    this.ctx.fillText(
      'Siguiente',
      startX,
      startY - GAME.BLOCK_SIZE * RENDERER.NEXT_LABEL_OFFSET,
    );
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

  /** Reads a CSS variable from the document (to adapt the canvas to the theme). */
  #cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
}
