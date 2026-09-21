const express = require('express');
const cors = require('cors');
const env = require('./src/config/env');
const { seedDatabase } = require('./src/config/database');
const healthRoutes = require('./src/routes/health-routes');
const appointmentsRoutes = require('./src/routes/appointments-routes');
const scoresRoutes = require('./src/routes/scores-routes');
const chatbotRoutes = require('./src/routes/chatbot-routes');
const notFound = require('./src/middlewares/not-found');
const { errorHandler } = require('./src/middlewares/error-handler');

seedDatabase();

const app = express();

app.use(cors({ origin: env.ALLOWED_ORIGINS }));
app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/scores', scoresRoutes);
app.use('/api/chatbot', chatbotRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(env.PORT, () => {
  process.stderr.write(`[info] API running on http://localhost:${env.PORT}\n`);
});

module.exports = app;
