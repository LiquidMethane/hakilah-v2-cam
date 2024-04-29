const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/', cartController.get);
router.post('/', cartController.post);

module.exports = router;
