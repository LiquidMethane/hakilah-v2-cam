

const orderController = {

	get: async function(req, res, next) {
		const order = await req.locals.model.findFirst('orders', {'hash': req.params.hash});
		
		if (order.result) {
			const orderItems = await req.locals.model.findAll('order_products', {'order_id': order.result.id});
			
			let subtotal = 0;

			if (orderItems.results && orderItems.results.length) {
				
				for (let i = 0; i < orderItems.results.length; i += 1) {

					let item = orderItems.results[i]
					const product = await req.locals.model.byId('products', item.product_id);

					if (!product.result) {
						res.status(500).send('Internal Server Error');
						return;
					}

					item.product = product.result;
					const price = item.product.price_per_cad * item.quantity
					item.price = price
					subtotal += price
				}
			}

			const tax = subtotal * 0.13            /** ONTARIO TAX RATE */
			const shipping = 45.00                 /** CHANGE LATER */
			const total = subtotal + tax + shipping
			
			res.render('order', {
				order: order.result, 
				orderItems: orderItems.results,
				subtotal,
				tax,
				shipping,
				total
			})
		} else {
			res.render('404');
		}
	},

	post: async function (req, res, next) {

		console.log("Inside orders post", req.body);
		
		//res.redirect('/login');
	}
}

module.exports =  orderController;