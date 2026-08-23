const contentEngine = require('../content/contentEngine');
const swytchcodeAdapter = require('../swytchcode/swytchcodeAdapter');
const logger = require('../../utils/logger');

class DailyScheduler {
  constructor() {
    this.autoPublishEnabled = true;
    this.publishTime = '18:00';
    this.minTrendScore = 80;
    this.minEvidenceScore = 85;
    this.lastExecutionAt = new Date(Date.now() - 3600000 * 4).toISOString();
    this.nextExecutionAt = '18:00 Today';
  }

  getAutomationStatus() {
    return {
      agentStatus: 'ACTIVE',
      autoPublishEnabled: this.autoPublishEnabled,
      publishTime: this.publishTime,
      minTrendScore: this.minTrendScore,
      minEvidenceScore: this.minEvidenceScore,
      lastExecutionAt: this.lastExecutionAt,
      nextExecutionAt: this.nextExecutionAt,
      lastActionSummary: 'Content published successfully via Swytchcode'
    };
  }

  updateSettings(settings) {
    if (settings.autoPublishEnabled !== undefined) this.autoPublishEnabled = Boolean(settings.autoPublishEnabled);
    if (settings.publishTime) this.publishTime = settings.publishTime;
    if (settings.minTrendScore) this.minTrendScore = Number(settings.minTrendScore);
    if (settings.minEvidenceScore) this.minEvidenceScore = Number(settings.minEvidenceScore);

    logger.info('Scheduler settings updated', settings);
    return this.getAutomationStatus();
  }

  async runDailyWorkflow() {
    logger.info('Triggering Daily Autonomous Publishing Workflow...');

    // 1. Get Scheduled / Approved Content
    const scheduledItems = contentEngine.listContent({ status: 'SCHEDULED' });
    const approvedItems = contentEngine.listContent({ status: 'APPROVED' });
    const candidates = [...scheduledItems, ...approvedItems];

    if (candidates.length === 0) {
      return {
        status: 'SKIPPED',
        reason: 'No scheduled or approved content items waiting in queue.',
        timestamp: new Date().toISOString()
      };
    }

    const itemToPublish = candidates[0];

    // 2. Validate Safety Thresholds
    if (itemToPublish.qualityAudit && itemToPublish.qualityAudit.overallScore < this.minEvidenceScore) {
      logger.warn(`Publishing blocked for item ${itemToPublish.id}: Evidence score ${itemToPublish.qualityAudit.overallScore}% below threshold ${this.minEvidenceScore}%`);
      return {
        status: 'BLOCKED',
        reason: `Evidence quality score (${itemToPublish.qualityAudit.overallScore}%) is below configured safety threshold (${this.minEvidenceScore}%).`,
        itemId: itemToPublish.id,
        timestamp: new Date().toISOString()
      };
    }

    // 3. Execute Swytchcode Publishing Kernel
    const swResult = await swytchcodeAdapter.execute('social.publish.post', {
      platform: itemToPublish.platform,
      content: itemToPublish.body,
      title: itemToPublish.title
    });

    // 4. Update Content Status
    contentEngine.publishContent(itemToPublish.id);
    this.lastExecutionAt = new Date().toISOString();

    return {
      status: 'PUBLISHED',
      publishedItem: itemToPublish,
      swytchcodeResult: swResult,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = new DailyScheduler();
