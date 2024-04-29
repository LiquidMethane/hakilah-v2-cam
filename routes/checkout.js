const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');

router.get('/', checkoutController.get);
router.post('/', checkoutController.post);

module.exports = router;
