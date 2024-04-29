
const checkoutController = {

	get: async function(req, res, next) {
		res.render('checkout', {});
	},

	post: async function (req, res, next) {

	}
}

module.exports =  checkoutController;