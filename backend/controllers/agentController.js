const agentOrchestrator = require('../services/agent/agent');
const logger = require('../utils/logger');

class AgentController {
  async runAgent(req, res, next) {
    try {
      const { prompt, options } = req.body;
      if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
        return res.status(400).json({ error: 'Field "prompt" is required and must be a non-empty string.' });
      }

      const execution = await agentOrchestrator.runAgent(prompt.trim(), options || {});
      return res.status(200).json(execution);
    } catch (err) {
      next(err);
    }
  }

  async getExecutions(req, res, next) {
    try {
      const executions = agentOrchestrator.listExecutions();
      return res.status(200).json({ executions });
    } catch (err) {
      next(err);
    }
  }

  async getExecutionById(req, res, next) {
    try {
      const { id } = req.params;
      const execution = agentOrchestrator.getExecution(id);
      if (!execution) {
        return res.status(404).json({ error: `Execution with ID '${id}' not found.` });
      }
      return res.status(200).json(execution);
    } catch (err) {
      next(err);
    }
  }

  async approveExecution(req, res, next) {
    try {
      const { id } = req.params;
      const execution = await agentOrchestrator.approveExecution(id);
      return res.status(200).json(execution);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AgentController();
