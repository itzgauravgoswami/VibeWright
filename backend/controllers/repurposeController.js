const repurposingEngine = require('../services/repurposing/repurposingEngine');
const contentEngine = require('../services/content/contentEngine');
const trendEngine = require('../services/trends/trendEngine');
const activityService = require('../services/activity/activityService');

class RepurposeController {
  async getMasterList(req, res, next) {
    try {
      const contentList = contentEngine.listContent();
      const trends = trendEngine.listTrends();
      
      // Map content and trends into eligible master content items
      let masters = contentList.map(c => ({
        id: c.id,
        trendId: c.trendId,
        topic: c.trendTitle || c.title,
        coreMessage: c.body ? c.body.split('\n')[0] : c.title,
        evidenceScore: c.qualityAudit?.grounding || 94,
        status: c.status,
        createdAt: c.createdAt
      }));

      if (masters.length === 0 && trends.length > 0) {
        masters = trends.map(t => ({
          id: t.id,
          trendId: t.id,
          topic: t.title,
          coreMessage: t.summary,
          evidenceScore: t.score || 92,
          status: 'READY',
          createdAt: t.detectedAt
        }));
      }

      return res.status(200).json({ total: masters.length, masters });
    } catch (err) {
      next(err);
    }
  }

  async getPackageById(req, res, next) {
    try {
      const { contentId } = req.params;
      const pkg = await repurposingEngine.repurposeContent(contentId, []);
      return res.status(200).json(pkg);
    } catch (err) {
      next(err);
    }
  }

  async generateAll(req, res, next) {
    try {
      const { contentId } = req.params;
      const { formats } = req.body;
      const formatsToRun = formats || ['video_script', 'thread', 'caption', 'blog_snippet'];

      const pkg = await repurposingEngine.repurposeContent(contentId, formatsToRun);

      activityService.logActivity({
        action: 'Content Repurposed into 4 Formats',
        detail: `Gemini 3.6 Flash repurposed Master Content [${pkg.masterContent.topic}] into Video, Thread, Caption & Blog Snippet`,
        status: 'COMPLETED',
        badgeType: 'success'
      });

      return res.status(200).json(pkg);
    } catch (err) {
      next(err);
    }
  }

  async regenerateFormat(req, res, next) {
    try {
      const { contentId, format } = req.params;
      const updated = await repurposingEngine.regenerateFormat(contentId, format, req.body);

      activityService.logActivity({
        action: 'Derivative Content Format Regenerated',
        detail: `Regenerated ${format} for [${contentId}] using Gemini 3.6 Flash`,
        status: 'REGENERATED',
        badgeType: 'primary'
      });

      return res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  }

  async updateFormat(req, res, next) {
    try {
      const { contentId, format } = req.params;
      const { content } = req.body;
      const updated = await repurposingEngine.updateFormat(contentId, format, content);

      activityService.logActivity({
        action: 'Derivative Format Edited & Re-checked',
        detail: `Updated ${format} version v${updated.version} (Brand Score: ${updated.scores.brandConsistency}%)`,
        status: 'EDITED',
        badgeType: 'purple'
      });

      return res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  }

  async schedulePackage(req, res, next) {
    try {
      const { contentId } = req.params;
      const scheduledPkg = repurposingEngine.schedulePackage(contentId);

      activityService.logActivity({
        action: 'Swytchcode Content Package Scheduled',
        detail: `Scheduled complete 4-format package for [${scheduledPkg.masterContent.topic}] for daily publishing`,
        status: 'SCHEDULED',
        badgeType: 'success'
      });

      return res.status(200).json(scheduledPkg);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new RepurposeController();
