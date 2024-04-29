const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');


function userExists(req,res,next) {

    req.locals.connection.query('Select * from users where email=? ', [req.body.email], function(error, results, fields) {
        if (error) 
            console.log("Error");
        else if(results.length>0)
            res.redirect('/userAlreadyExists')
        else
            next();
    });
}

router.get('/', registerController.get);
router.post('/', userExists, registerController.post);

module.exports = router;
