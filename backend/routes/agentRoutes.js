const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');

router.post('/run', (req, res, next) => agentController.runAgent(req, res, next));
router.get('/executions', (req, res, next) => agentController.getExecutions(req, res, next));
router.get('/executions/:id', (req, res, next) => agentController.getExecutionById(req, res, next));
router.post('/executions/:id/approve', (req, res, next) => agentController.approveExecution(req, res, next));

module.exports = router;
