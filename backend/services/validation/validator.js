const { isToolRegistered } = require('../agent/toolRegistry');
const logger = require('../../utils/logger');

/**
 * Validation & Security Guardrails
 */
class Validator {
  /**
   * Validate tool invocation before execution
   */
  validateToolCall(toolId, input) {
    if (!isToolRegistered(toolId)) {
      logger.warn(`Security violation attempt: Tool '${toolId}' is NOT registered in ToolRegistry.`);
      return {
        valid: false,
        reason: `Tool '${toolId}' is not registered in the system tool registry.`
      };
    }

    if (input && typeof input !== 'object') {
      return {
        valid: false,
        reason: 'Tool input payload must be a valid JSON object.'
      };
    }

    return { valid: true };
  }

  /**
   * Validate structured output from external providers
   */
  validateResult(result) {
    if (!result) {
      return { valid: false, reason: 'Tool returned empty or null result payload.' };
    }
    return { valid: true };
  }
}

module.exports = new Validator();
