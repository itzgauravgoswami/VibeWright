const contentEngine = require('../services/content/contentEngine');

class ContentController {
  getContent(req, res, next) {
    try {
      const { status, platform } = req.query;
      const content = contentEngine.listContent({ status, platform });
      return res.status(200).json({ total: content.length, content });
    } catch (err) {
      next(err);
    }
  }

  async generateContent(req, res, next) {
    try {
      const { trendId, platform, type, tone, audience } = req.body;
      if (!trendId) {
        return res.status(400).json({ error: 'Field "trendId" is required' });
      }

      const item = await contentEngine.generateContent({
        trendId,
        platform,
        type,
        tone,
        audience
      });

      const activityService = require('../services/activity/activityService');
      activityService.logActivity({
        action: 'Grounded Content Generated',
        detail: `Gemini 3.6 Flash generated grounded ${item.type} for trend [${item.trendTitle}] (Score: ${item.qualityAudit.overallScore}/100)`,
        status: 'COMPLETED',
        badgeType: 'primary'
      });

      return res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  }

  getContentById(req, res, next) {
    try {
      const { id } = req.params;
      const item = contentEngine.getContentById(id);
      if (!item) {
        return res.status(404).json({ error: `Content item '${id}' not found` });
      }
      return res.status(200).json(item);
    } catch (err) {
      next(err);
    }
  }

  updateContent(req, res, next) {
    try {
      const { id } = req.params;
      const updated = contentEngine.updateContent(id, req.body);
      return res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  }

  approveContent(req, res, next) {
    try {
      const { id } = req.params;
      const approved = contentEngine.approveContent(id);
      const activityService = require('../services/activity/activityService');
      activityService.logActivity({
        action: 'Human Approval Received',
        detail: `Content item '${approved.title}' approved for daily publishing queue`,
        status: 'APPROVED',
        badgeType: 'purple'
      });
      return res.status(200).json(approved);
    } catch (err) {
      next(err);
    }
  }

  scheduleContent(req, res, next) {
    try {
      const { id } = req.params;
      const { scheduledTime } = req.body;
      const scheduled = contentEngine.scheduleContent(id, scheduledTime);
      const activityService = require('../services/activity/activityService');
      activityService.logActivity({
        action: 'Content Scheduled for Publishing',
        detail: `Scheduled '${scheduled.title}' for Swytchcode daily queue (${scheduledTime})`,
        status: 'SCHEDULED',
        badgeType: 'success'
      });
      return res.status(200).json(scheduled);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ContentController();
