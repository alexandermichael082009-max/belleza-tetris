require('dotenv').config();

const DEFAULT_PORT = 3000;
const DEFAULT_ORIGINS = 'http://localhost:5500,http://127.0.0.1:5500';

module.exports = Object.freeze({
  PORT: Number(process.env.PORT) || DEFAULT_PORT,
  DB_PATH: process.env.DB_PATH || './data/belleza-tetris.db',
  ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS || DEFAULT_ORIGINS).split(','),
});
