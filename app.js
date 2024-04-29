
/*============== Initialise Packages ================*/
const express = require('express');                            // Express
const app = express();

const passport =        require('passport');                       // Authentication
const LocalStrategy =   require('passport-local').Strategy;        // Authentication with email/password
const path =            require('path');                           // File Paths
const cookieParser =    require('cookie-parser');                  // Parse Cookies
const mysql =           require('mysql');
const crypto =          require('crypto');
const session =         require('express-session')
const MySQLStore =      require('express-mysql-session')(session); // 

const createError = require('http-errors');                        // Create HTTP Errors
const logger = require('morgan');                                  // Log errors

require('dotenv').config()


/*============== Initialise View Engine ================*/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


/*============== Initialise Database ================*/

const Model = require("./model/Model");
const model = new Model();
const connection = model.db

app.use(function (req, res, next) {
    req.locals = {}
	req.locals.model = model;
    req.locals.connection = model.db;
	next()
})


/*============== Middleware ================*/

app.use(logger('dev'));
app.use(express.json());                                   // parse request body
//app.use(express.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true }));           // parse request body
app.use(cookieParser());                                   // parse request cookie
app.use(express.static(path.join(__dirname, 'public')));   // serve static files (images, css, etc.)

app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: new MySQLStore({
        database: process.env.COOKIE_DB_NAME,
        host: process.env.COOKIE_DB_HOST,
        port: process.env.COOKIE_DB_PORT,
        user: process.env.COOKIE_DB_USER,
        password: process.env.COOKIE_DB_PASS
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24        // 24 hours
    }
}))

app.use(passport.initialize());     // Authentication
app.use(passport.session());        // Authentication


/*============== Passport.js ================*/



function validPassword(password,hash,salt) {
    const hashVerify = crypto.pbkdf2Sync(password,salt,10000,60,'sha512').toString('hex');
    return hash === hashVerify;
}


const verifyCallback = (email, password, callback) => {
 
    connection.query('SELECT * FROM users WHERE email = ? ', [email], function(error, results, fields) {

        if (error) 
            return callback(error);

        else if (results.length==0)
            return callback(null,false);

        const isValid = validPassword(password, results[0].hash, results[0].salt);
        const user = {
            id: results[0].id,
            email: results[0].email,
            hash: results[0].hash,
            salt: results[0].salt
        };
        
        if (isValid)
            return callback(null,user);

        return callback(null,false);
    });
}


const customFields = {
    usernameField:'email',
    passwordField:'password',
};

const strategy = new LocalStrategy(customFields,verifyCallback);

passport.use(strategy);

passport.serializeUser((user, callback) => {
    console.log("inside serialize");
    callback(null, user.id)
});

passport.deserializeUser((userId, callback) => {
    console.log('deserializeUser, '+ userId);
    connection.query('SELECT * FROM users where id = ?',[userId], function(error, results) {
        callback(null, results[0]);
    });
});


// Add the authenticated user (User object or null) to our list of locals
app.use(function(req, res, next) {
    app.locals.user = req.user ?? {};
    next();
});



/*middleware*/
//const authMiddleware = require('./middleware/auth')
//app.use(authMiddleware)


/*============== Initialise Routers ================*/

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var registerRouter = require('./routes/register');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');

var ordersRouter = require('./routes/orders');
var accountRouter = require('./routes/account');
var adminRouter = require('./routes/admin');
var cartRouter = require('./routes/cart');
var orderRouter = require('./routes/order');
var productRouter = require('./routes/product');


/*============== Create Routes ================*/

app.use('/users', usersRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/account', accountRouter);


app.use('/admin', adminRouter);
app.use('/cart', cartRouter);
app.use('/order', orderRouter);
app.use('/orders', ordersRouter);
app.use('/product', productRouter);

app.use('/', function(req, res, next) {
    res.render('home')
});

/*============== Main Process ================*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
