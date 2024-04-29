const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/:slug', productController.get);

module.exports = router;
