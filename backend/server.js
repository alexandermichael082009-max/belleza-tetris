const express = require('express');
const cors = require('cors');
const env = require('./src/config/env');
const { seedDatabase } = require('./src/config/database');
const { success } = require('./src/utils/response-builder');
const appointmentsRoutes = require('./src/routes/appointments-routes');
const scoresRoutes = require('./src/routes/scores-routes');
const chatbotRoutes = require('./src/routes/chatbot-routes');
const notFound = require('./src/middlewares/not-found');
const { errorHandler } = require('./src/middlewares/error-handler');

seedDatabase();

const app = express();

app.use(cors({ origin: env.ALLOWED_ORIGINS }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json(success(null, 'Belleza Tetris API activa.'));
});

app.use('/api/appointments', appointmentsRoutes);
app.use('/api/scores', scoresRoutes);
app.use('/api/chatbot', chatbotRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(env.PORT, () => {
  process.stderr.write(`[info] API corriendo en http://localhost:${env.PORT}\n`);
});

module.exports = app;
