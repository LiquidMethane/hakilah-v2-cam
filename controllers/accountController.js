
const accountController = {

	get: async function(req, res, next) {
		res.render('account');
	},

	post: async function (req, res, next) {

		const publicFields = [
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

		let payload = {}

		Object.keys(req.body).forEach(key => {
			if (publicFields.includes(key))
				payload[key] = req.body[key]
		})

		payload.id = req.user.id

		req.locals.model.update('users', payload).then(done => {

			if (done.result.affectedRows == 1) {
				req.locals.model.byId('users', payload.id).then(done => {
					res.locals.user = done.result
					res.render('account');
				})

			} else {
				res.status(500).send('Internal Server Error');
			}
		})

			
	}
}

module.exports =  accountController;