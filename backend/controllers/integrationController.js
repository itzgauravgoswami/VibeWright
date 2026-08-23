const { getCapabilityMatrix } = require('../config/env');
const { listTools } = require('../services/agent/toolRegistry');

class IntegrationController {
  getIntegrations(req, res, next) {
    try {
      const capabilities = getCapabilityMatrix();
      const registeredTools = listTools();

      return res.status(200).json({
        totalCapabilities: capabilities.length,
        capabilities,
        registeredToolsCount: registeredTools.length,
        registeredTools
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new IntegrationController();
