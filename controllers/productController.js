

const productController = {

	get: async function(req, res, next) {

		const product = await req.locals.model.findFirst('products', {'friendly_slug': req.params.slug});
		
		if (product.result) {
			res.render('products/' + product.result.friendly_slug, {product: product.result})
		} else {
			res.render('404');
		}
	},

	post: async function (req, res, next) {

		console.log("Inside product post", req.body);
		
		//res.redirect('/login');
	}
}

module.exports =  productController;