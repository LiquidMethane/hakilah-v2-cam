const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');

const { isAuth } = require('./helpers');

router.get('/', isAuth, ordersController.get);
router.post('/', isAuth, ordersController.post);

module.exports = router;
