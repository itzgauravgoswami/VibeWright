const express = require('express');
const router = express.Router();
const repurposeController = require('../controllers/repurposeController');

router.get('/', repurposeController.getMasterList);
router.get('/:contentId', repurposeController.getPackageById);
router.post('/:contentId/generate', repurposeController.generateAll);
router.post('/:contentId/schedule', repurposeController.schedulePackage);
router.post('/:contentId/:format/regenerate', repurposeController.regenerateFormat);
router.put('/:contentId/:format', repurposeController.updateFormat);

module.exports = router;
