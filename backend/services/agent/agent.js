const planner = require('./planner');
const executor = require('./executor');
const aiService = require('../ai/aiService');
const logger = require('../../utils/logger');
const { EXECUTION_STATUS, STEP_STATUS } = require('./schemas');

// In-memory execution store for fast retrieval and demo state management
const executionStore = new Map();

/**
 * Main Agent Orchestrator
 */
class AgentOrchestrator {
  /**
   * Run agent for a given natural language prompt
   */
  async runAgent(userRequest, options = {}) {
    const executionId = `exec-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const startedAt = new Date().toISOString();

    logger.info(`Starting Agent Orchestrator execution [ID: ${executionId}] for request: "${userRequest}"`);

    // 1. Create Execution Record
    const record = {
      executionId,
      userRequest,
      startedAt,
      completedAt: null,
      status: EXECUTION_STATUS.PLANNING,
      approvedByHuman: Boolean(options.approvedByHuman),
      plan: null,
      steps: [],
      synthesis: null,
      errors: []
    };
    executionStore.set(executionId, record);

    try {
      // 2. Planning Phase
      const plan = await planner.createPlan(userRequest);
      record.plan = plan;
      record.status = EXECUTION_STATUS.EXECUTING;
      logger.info(`Plan generated for execution [${executionId}]. Intent: ${plan.intent}`);

      // 3. Execution Phase
      let requiresHumanPause = false;

      for (const stepConfig of plan.steps) {
        const stepResult = await executor.executeStep(stepConfig, record);
        record.steps.push(stepResult);

        if (stepResult.status === STEP_STATUS.WAITING_APPROVAL) {
          requiresHumanPause = true;
          record.status = EXECUTION_STATUS.WAITING_FOR_APPROVAL;
          logger.info(`Execution [${executionId}] paused awaiting human approval on Step ${stepConfig.stepIndex}`);
          break;
        }

        if (stepResult.status === STEP_STATUS.FAILED) {
          record.errors.push(`Step ${stepConfig.stepIndex} failed: ${stepResult.error}`);
        }
      }

      // If paused for human approval, return current record state
      if (requiresHumanPause) {
        return record;
      }

      // 4. LLM Synthesis Phase
      record.status = record.errors.length > 0 ? EXECUTION_STATUS.FAILED : EXECUTION_STATUS.COMPLETED;
      record.completedAt = new Date().toISOString();

      const synthesis = await aiService.synthesizeResults({
        userRequest,
        plan: record.plan,
        executionResults: record.steps
      });

      record.synthesis = synthesis;
      logger.info(`Execution [${executionId}] completed successfully.`);
      return record;

    } catch (err) {
      logger.error(`Execution [${executionId}] encountered error`, err);
      record.status = EXECUTION_STATUS.FAILED;
      record.completedAt = new Date().toISOString();
      record.errors.push(err.message || 'Fatal orchestrator execution error');
      return record;
    }
  }

  /**
   * Resume / Approve pending execution
   */
  async approveExecution(executionId) {
    const record = executionStore.get(executionId);
    if (!record) {
      throw new Error(`Execution record with ID '${executionId}' not found.`);
    }

    if (record.status !== EXECUTION_STATUS.WAITING_FOR_APPROVAL) {
      throw new Error(`Execution '${executionId}' is not currently waiting for approval.`);
    }

    logger.info(`Human approval granted for Execution [${executionId}]. Resuming pipeline...`);
    record.approvedByHuman = true;
    record.status = EXECUTION_STATUS.EXECUTING;

    // Find paused step
    const pausedStepIndex = record.steps.findIndex(s => s.status === STEP_STATUS.WAITING_APPROVAL);
    if (pausedStepIndex !== -1) {
      const stepConfig = record.plan.steps[pausedStepIndex];
      const stepResult = await executor.executeStep(stepConfig, record);
      record.steps[pausedStepIndex] = stepResult;
    }

    // Resume remaining steps
    const startIndex = pausedStepIndex !== -1 ? pausedStepIndex + 1 : record.steps.length;
    for (let i = startIndex; i < record.plan.steps.length; i++) {
      const stepConfig = record.plan.steps[i];
      const stepResult = await executor.executeStep(stepConfig, record);
      record.steps.push(stepResult);
    }

    record.status = EXECUTION_STATUS.COMPLETED;
    record.completedAt = new Date().toISOString();

    record.synthesis = await aiService.synthesizeResults({
      userRequest: record.userRequest,
      plan: record.plan,
      executionResults: record.steps
    });

    return record;
  }

  getExecution(executionId) {
    return executionStore.get(executionId);
  }

  listExecutions(limit = 20) {
    return Array.from(executionStore.values())
      .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt))
      .slice(0, limit);
  }
}

module.exports = new AgentOrchestrator();
