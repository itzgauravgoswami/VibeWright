const express = require('express');
const router = express.Router();
const trendController = require('../controllers/trendController');

router.get('/', (req, res, next) => trendController.getTrends(req, res, next));
router.post('/discover', (req, res, next) => trendController.discoverTrends(req, res, next));
router.get('/:id', (req, res, next) => trendController.getTrendById(req, res, next));

module.exports = router;
