const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
    console.log('user has been logged out')
    req.logout(() => {
        res.redirect('/login')
    }); 
});

module.exports = router;
