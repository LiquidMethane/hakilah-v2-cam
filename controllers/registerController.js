
const crypto = require('crypto');


const registerController = {

	genPassword: function(password) {
		var salt = crypto.randomBytes(32).toString('hex');
		var genhash = crypto.pbkdf2Sync(password,salt,10000,60,'sha512').toString('hex');
		return {
			salt: salt,
			hash: genhash
		};
	},

	get: async function(req, res, next) {
		console.log("Inside register get");
		res.render('register')
	},

	post: async function (req, res, next) {

		console.log("Inside register post", req.body);
		console.log("password", req.body.password);

		const saltHash = registerController.genPassword(req.body.password);
		const salt = saltHash.salt;
		const hash = saltHash.hash;
		console.log(saltHash);

		req.locals.connection.query('Insert into users(email,hash,salt,is_admin) values(?,?,?,0) ', [req.body.email,hash,salt], function(error, results, fields) {
			if (error) 
				console.log("Error", error);
			else
				console.log("Successfully Entered");		   
		});
	
		res.redirect('/login');
	}
}

module.exports =  registerController;