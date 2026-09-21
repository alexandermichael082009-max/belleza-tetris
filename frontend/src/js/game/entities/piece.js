import { GAME } from '../../utils/constants.js';

/**
 * Definitions of the 7 standard Tetris pieces.
 * colorId is an index into PIECE_COLORS (1..7).
 */
const SHAPES = Object.freeze({
  I: Object.freeze({ colorId: 1, matrix: Object.freeze([[1, 1, 1, 1]]) }),
  O: Object.freeze({
    colorId: 2,
    matrix: Object.freeze([
      [1, 1],
      [1, 1],
    ]),
  }),
  T: Object.freeze({
    colorId: 3,
    matrix: Object.freeze([
      [0, 1, 0],
      [1, 1, 1],
    ]),
  }),
  S: Object.freeze({
    colorId: 4,
    matrix: Object.freeze([
      [0, 1, 1],
      [1, 1, 0],
    ]),
  }),
  Z: Object.freeze({
    colorId: 5,
    matrix: Object.freeze([
      [1, 1, 0],
      [0, 1, 1],
    ]),
  }),
  J: Object.freeze({
    colorId: 6,
    matrix: Object.freeze([
      [1, 0, 0],
      [1, 1, 1],
    ]),
  }),
  L: Object.freeze({
    colorId: 7,
    matrix: Object.freeze([
      [0, 0, 1],
      [1, 1, 1],
    ]),
  }),
});

const PIECE_TYPES = Object.keys(SHAPES);

/**
 * Piece entity: shape, color and position on the board.
 */
export class Piece {
  constructor(type) {
    const config = SHAPES[type];
    this.type = type;
    this.colorId = config.colorId;
    this.matrix = config.matrix.map((row) => [...row]);
    this.x = Math.floor((GAME.COLS - config.matrix[0].length) / 2);
    this.y = 0;
  }

  /** Creates a random piece. */
  static random() {
    const type = PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];
    return new Piece(type);
  }

  /** Returns the matrix rotated 90° clockwise (does not mutate this piece). */
  rotatedMatrix() {
    return this.matrix[0].map((_, col) => this.matrix.map((row) => row[col]).reverse());
  }
}
