const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

const { isAuth } = require('./helpers');

router.get('/', isAuth, accountController.get);
router.post('/', isAuth, accountController.post);

module.exports = router;
