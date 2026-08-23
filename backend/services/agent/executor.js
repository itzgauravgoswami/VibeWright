const { getTool } = require('./toolRegistry');
const validator = require('../validation/validator');
const logger = require('../../utils/logger');
const { STEP_STATUS } = require('./schemas');

/**
 * Execution Engine
 * Sequentially executes planned tool calls with validation, logging, and human approval boundaries.
 */
class Executor {
  async executeStep(step, executionContext) {
    const { stepIndex, tool: toolId, action, input, requiresApproval } = step;
    logger.info(`Executor processing Step ${stepIndex}: [${toolId}] - ${action}`);

    // Validate tool call
    const validation = validator.validateToolCall(toolId, input);
    if (!validation.valid) {
      logger.error(`Validation failed for Step ${stepIndex}`, validation.reason);
      return {
        stepIndex,
        tool: toolId,
        action,
        status: STEP_STATUS.FAILED,
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        error: validation.reason
      };
    }

    // Check if human approval is required and execution is not pre-approved
    if (requiresApproval && !executionContext.approvedByHuman) {
      logger.info(`Step ${stepIndex} [${toolId}] requires Human Approval before proceeding.`);
      return {
        stepIndex,
        tool: toolId,
        action,
        input,
        status: STEP_STATUS.WAITING_APPROVAL,
        startedAt: new Date().toISOString(),
        completedAt: null,
        resultSummary: 'Paused execution for Human Approval.'
      };
    }

    const tool = getTool(toolId);
    const startTime = new Date().toISOString();

    try {
      const toolResult = await tool.handler(input);
      const endTime = new Date().toISOString();

      return {
        stepIndex,
        tool: toolId,
        action,
        status: STEP_STATUS.COMPLETED,
        startedAt: startTime,
        completedAt: endTime,
        resultSummary: `Executed ${toolId} successfully.`,
        data: toolResult
      };
    } catch (err) {
      logger.error(`Step ${stepIndex} execution error`, err);
      return {
        stepIndex,
        tool: toolId,
        action,
        status: STEP_STATUS.FAILED,
        startedAt: startTime,
        completedAt: new Date().toISOString(),
        error: err.message || 'Execution error'
      };
    }
  }
}

module.exports = new Executor();
