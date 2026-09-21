const express = require('express');
const { success } = require('../utils/response-builder');

/** Defines the health endpoint used by the frontend. */
const router = express.Router();

router.get('/', (_req, res) => {
  res.json(success(null, 'Belleza Tetris API is active.'));
});

module.exports = router;
