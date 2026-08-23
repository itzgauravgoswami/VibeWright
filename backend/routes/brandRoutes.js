const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');

router.get('/', brandController.getProfile);
router.put('/', brandController.updateProfile);

module.exports = router;
