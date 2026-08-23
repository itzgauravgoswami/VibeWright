const logger = require('../../utils/logger');
const { env } = require('../../config/env');

/**
 * Swytchcode Execution Boundary Adapter
 * Acts as the centralized execution kernel for all external capabilities.
 */
class SwytchcodeAdapter {
  constructor() {
    this.runtimeAvailable = false;
    try {
      this.runtime = require('@swytchcode/runtime');
      this.runtimeAvailable = true;
    } catch (e) {
      this.runtimeAvailable = false;
    }
  }

  /**
   * Execute a Swytchcode tool by canonical ID
   */
  async execute(canonicalId, input = {}) {
    logger.info(`Swytchcode boundary invoking: ${canonicalId}`, { inputKeys: Object.keys(input) });

    // Live Swytchcode runtime execution
    if (this.runtimeAvailable && env.swytchcode.apiKey) {
      try {
        const result = await this.runtime.exec(canonicalId, input);
        return {
          status: 'SUCCESS',
          canonicalId,
          executionMode: 'REAL_SWYTCHCODE',
          data: result,
          executedAt: new Date().toISOString()
        };
      } catch (err) {
        logger.error(`Swytchcode execution failed for ${canonicalId}`, err);
        return {
          status: 'FAILED',
          canonicalId,
          executionMode: 'REAL_SWYTCHCODE',
          error: err.message || 'Swytchcode runtime execution error',
          executedAt: new Date().toISOString()
        };
      }
    }

    // Mock Execution Adapter for local hackathon testing
    return {
      status: 'SUCCESS',
      canonicalId,
      executionMode: 'DEMO_MOCK',
      badge: '[DEMO/MOCK]',
      data: {
        message: `Successfully executed Swytchcode capability: ${canonicalId}`,
        canonicalId,
        inputReceived: input,
        timestamp: new Date().toISOString()
      },
      executedAt: new Date().toISOString()
    };
  }
}

module.exports = new SwytchcodeAdapter();
