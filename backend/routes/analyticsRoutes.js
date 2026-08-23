const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/', (req, res) => analyticsController.getAnalytics(req, res));

module.exports = router;
