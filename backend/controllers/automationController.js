const dailyScheduler = require('../services/scheduler/dailyScheduler');

class AutomationController {
  getStatus(req, res) {
    const status = dailyScheduler.getAutomationStatus();
    return res.status(200).json(status);
  }

  async runDailyWorkflow(req, res, next) {
    try {
      const result = await dailyScheduler.runDailyWorkflow();
      const activityService = require('../services/activity/activityService');
      activityService.logActivity({
        action: 'Swytchcode Publishing Kernel Triggered',
        detail: result.status === 'PUBLISHED' ? `Published '${result.publishedItem?.title}' via Swytchcode` : (result.reason || 'Daily publishing workflow evaluated'),
        status: result.status,
        badgeType: result.status === 'PUBLISHED' ? 'success' : 'warning'
      });
      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  updateSettings(req, res) {
    const updated = dailyScheduler.updateSettings(req.body);
    return res.status(200).json(updated);
  }
}

module.exports = new AutomationController();
