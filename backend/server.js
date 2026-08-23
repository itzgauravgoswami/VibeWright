const express = require('express');
const cors = require('cors');
const { env } = require('./config/env');
const logger = require('./utils/logger');

const requestLogger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

const healthRoutes = require('./routes/healthRoutes');
const agentRoutes = require('./routes/agentRoutes');
const integrationRoutes = require('./routes/integrationRoutes');
const trendRoutes = require('./routes/trendRoutes');
const contentRoutes = require('./routes/contentRoutes');
const automationRoutes = require('./routes/automationRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(requestLogger);

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/integrations', integrationRoutes);
app.use('/api/trends', trendRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/automation', automationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/repurpose', require('./routes/repurposeRoutes'));
app.use('/api/settings/brand', require('./routes/brandRoutes'));

app.get('/api/activity', (req, res) => {
  const activityService = require('./services/activity/activityService');
  res.json({ logs: activityService.getLogs() });
});

app.get('/api/sources', async (req, res) => {
  const weaviateRAG = require('./services/rag/weaviateRAG');
  const sources = await weaviateRAG.retrieveContext('Emerging Trends & Technology', 'All');
  res.json({ total: sources.length, sources });
});

// Root Welcome Endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to TrendForge Autonomous Trend Intelligence & Publishing Platform API',
    endpoints: {
      health: '/api/health',
      trends: '/api/trends',
      content: '/api/content',
      automation: '/api/automation/status',
      analytics: '/api/analytics',
      integrations: '/api/integrations'
    }
  });
});

// Error Handler
app.use(errorHandler);

// Start Express Server
const PORT = env.port || 5000;
app.listen(PORT, () => {
  logger.info(`===================================================`);
  logger.info(`🚀 TrendForge Platform Server running on port ${PORT}`);
  logger.info(`🌐 Health Endpoint: http://localhost:${PORT}/api/health`);
  logger.info(`===================================================`);
});
