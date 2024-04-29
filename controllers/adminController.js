
const adminController = {

	get: async function(req, res, next) {

		req.locals.model.getAll('products', function(error, results, fields) {
			req.locals.products = []
			res.render('admin');
		});
		
	},

	post: async function (req, res, next) {

	}
}

module.exports =  adminController;