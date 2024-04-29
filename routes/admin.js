const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

const { isAdmin } = require('./helpers');

router.get('/', isAdmin, adminController.get);
router.post('/', isAdmin, adminController.post);

module.exports = router;
