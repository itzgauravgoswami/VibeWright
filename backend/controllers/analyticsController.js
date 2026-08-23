const analyticsService = require('../services/analytics/analyticsService');

class AnalyticsController {
  getAnalytics(req, res) {
    const metrics = analyticsService.getMetrics();
    return res.status(200).json(metrics);
  }
}

module.exports = new AnalyticsController();
