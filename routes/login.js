const express = require('express');
const router = express.Router();
const passport = require('passport');


router.get('/', function (req, res, next) {
    const success = req.query.success;
    res.render('login', {success})
});

router.post('/', passport.authenticate('local', {
    failureRedirect:'/login?success=0',
    successRedirect:'/'
}));

module.exports = router;
