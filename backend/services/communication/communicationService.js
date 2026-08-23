const logger = require('../../utils/logger');
const { env } = require('../../config/env');
const swytchcodeAdapter = require('../swytchcode/swytchcodeAdapter');

/**
 * Communication & Messaging Service Adapter
 */
class CommunicationService {
  async sendMessage({ channel = 'slack', recipient, subject, content }) {
    logger.info(`Communication service sending message via [${channel}] to [${recipient || 'default'}]`);

    // Route through Swytchcode adapter
    const canonicalMap = {
      slack: 'slack.message.send',
      telegram: 'telegram.message.send',
      gmail: 'gmail.message.send',
      resend: 'email.send'
    };

    const canonicalId = canonicalMap[channel] || 'slack.message.send';
    const result = await swytchcodeAdapter.execute(canonicalId, { recipient, subject, content });

    return {
      success: true,
      channel,
      recipient: recipient || '#general',
      deliveredAt: new Date().toISOString(),
      executionDetails: result
    };
  }
}

module.exports = new CommunicationService();
