
const createError = require('http-errors');


function isAuth(req, res, next) {
    if(req.isAuthenticated())
        next();
    else
        res.redirect('/login');
}


function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.is_admin == 1)
        next();
    else
        next(createError(404));
}

module.exports = {
    isAuth,
    isAdmin
};