

const ordersController = {

	get: async function(req, res, next) {
		console.log('order body')
		res.redirect('/orders-successful');
	},

	post: async function (req, res, next) {

		console.log("Inside orders post", req.body);
		
		//res.redirect('/login');
	}
}

module.exports =  ordersController;