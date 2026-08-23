const express = require('express');
const router = express.Router();
const automationController = require('../controllers/automationController');

router.get('/status', (req, res) => automationController.getStatus(req, res));
router.post('/run', (req, res, next) => automationController.runDailyWorkflow(req, res, next));
router.put('/settings', (req, res) => automationController.updateSettings(req, res));

module.exports = router;
