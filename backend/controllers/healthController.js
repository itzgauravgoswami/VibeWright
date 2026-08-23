class HealthController {
  getHealth(req, res) {
    return res.status(200).json({
      status: 'OK',
      application: 'TrendForge Backend Orchestrator',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  }
}

module.exports = new HealthController();
