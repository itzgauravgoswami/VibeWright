const express = require('express');
const router = express.Router();
const integrationController = require('../controllers/integrationController');

router.get('/', (req, res, next) => integrationController.getIntegrations(req, res, next));

module.exports = router;
