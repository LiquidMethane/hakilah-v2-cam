const utilities = require('../helpers/utilities');

const cartController = {

	get: async function(req, res, next) {
		res.render('cart_get_redirect');
	},


    getCartItems: async function(userCart, model) {

        // User cart is a list of {id: int, quantity: int}
        // Returns a list of {id: int, quantity: int, ...(data for product with id)}

        let newCart = []

        for (let i = 0; i < userCart.length; i++) {

            const item = userCart[i];

            let product = await model.byId('products', item.id);

            if (product.err || !product.result) {
                throw new Error('Item with id "' + item.id + '" not found!')
            }

            newCart.push({
                id: item.id,
                quantity: item.quantity,
                name: product.result.name,
                price_per_cad: product.result.price_per_cad
            })
        }

        return newCart
    },

	post: async function (req, res, next) {

        //============================================================

        // VALID CART DATA MUST EXIST IN REQUEST BODY

        // Cart is a list of objects, in the format: [ {id: int, quantity: int}, ...]

        // 'cart' exists
		if (!('cart' in req.body && req.body.cart)) {
			res.redirect('cart-not-found');
			return;
		}

        // 'cart' is valid JSON
		let cartItems = []
		try {
			cartItems = JSON.parse(req.body.cart)
		} catch {
			res.redirect('cart-json-invalid');
			return;
		}

        // every item in 'cart' has the required keys ('id' and 'quantity'), which are also valid
		let isValid = cartItems.every(item => {
			return ('id' in item && item.id && utilities.isNatural(item.id)) &&
				('quantity' in item && item.quantity && utilities.isNatural(item.quantity));
		})

		if (!isValid) {
			res.redirect('cart-count-invalid');
			return;
		}

        // now filter cart item keys to only be 'quantity' and 'id'
        let newCartItems = []
        cartItems.forEach(item => {
            newCartItems.push({
                id: item.id,
                quantity: item.quantity
            })
        })
        cartItems = newCartItems

        //============================================================
		
        // Cart is validated
        
        if ('action' in req.body && req.body.action == 'show_cart') {

            const fullCartItems = await cartController.getCartItems(cartItems, req.locals.model)

            res.render('cart', {
				cart: fullCartItems
			})
        }

        else if ('action' in req.body && req.body.action == 'create-order') {

            
            //Now save it as a new order

            let payload = {
                hash: utilities.createHash(20),
                is_finalized: false,
                status: "Editing"
            };

            let userKeys = [
                'first_name',
                'last_name',
                'email',
                'phone',
                'billing_address',
                'billing_city',
                'billing_state',
                'billing_country',
                'billing_postal_code',
                'mailing_address',
                'mailing_city',
                'mailing_state',
                'mailing_country',
                'mailing_postal_code'
            ]

            if ('user' in req && req.user) {
                Object.keys(req.user).forEach(key => {
                    if (userKeys.includes(key) && req.user[key])
                        payload[key] = req.user[key];
                })

                if ('id' in req.user && req.user.id > 0)
                    payload.created_by = req.user.id;
            }
            

            const order = await req.locals.model.create('orders', payload)

            if (order.err || order.result.affectedRows != 1) {
                res.redirect('order-save-invalid');
                return;
            }

            const orderId = order.result.insertId;


            for (let i = 0; i < cartItems.length; i++) {

                const item = cartItems[i];

                let product = await req.locals.model.byId('products', item.id);

                if (product.err || !product.result) {
                    res.redirect('product-not-found');
                    return;
                }

                const itemPayload = {
                    order_id: orderId,
                    product_id: item.id,
                    quantity: item.count
                }

                const orderProduct = await req.locals.model.create('order_products', itemPayload);

                if (orderProduct.err || orderProduct.result.affectedRows != 1) {
                    res.redirect('order-product-save-invalid');
                    return;
                }
            }

            res.redirect('order-created');

        }

        
        
	}
}

module.exports =  cartController;