const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  logger.error(`API Error on ${req.method} ${req.originalUrl}`, err);
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  return res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
}

module.exports = errorHandler;
