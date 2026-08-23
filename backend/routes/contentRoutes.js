const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');

router.get('/', (req, res, next) => contentController.getContent(req, res, next));
router.post('/', (req, res, next) => contentController.generateContent(req, res, next));
router.get('/:id', (req, res, next) => contentController.getContentById(req, res, next));
router.put('/:id', (req, res, next) => contentController.updateContent(req, res, next));
router.post('/:id/approve', (req, res, next) => contentController.approveContent(req, res, next));
router.post('/:id/schedule', (req, res, next) => contentController.scheduleContent(req, res, next));

module.exports = router;
