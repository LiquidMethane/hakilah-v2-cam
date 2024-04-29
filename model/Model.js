
const pool = require('./config')

class Model {
	//mysql config
	db = pool

	byId = async (table, value) => {
		let sql = 'SELECT * FROM ?? WHERE id=?';

		return new Promise((resolve) => {
			this.db.query(sql, [table, value], (error, results, fields) => {
				const result = (results.length) ? results[0] : null
				resolve({error, result, fields})
			});
		})
	}

	getFirst = async (table) => {
		let sql = 'SELECT * FROM ?? LIMIT 1';

		return new Promise((resolve) => {
			this.db.query(sql, [table], (error, results, fields) => {
				const result = (results.length) ? results[0] : null
				resolve({error, result, fields})
			});
		})
	}

	getAll = async (table) => {
		let sql = 'SELECT * FROM ??';
		return new Promise((resolve) => {
			this.db.query(sql, [table], (error, results, fields) => {
				resolve({error, results, fields})
			});
		})
	}

	findFirst = async (table, filters) => {

		let sql = 'SELECT * FROM ?? WHERE ';
		let inserts = [table];

		Object.keys(filters).forEach((key, index) => {
			sql += (index == 0) ? '??=? ' : 'AND ??=? '
			inserts.push(key, filters[key])
		})

		sql += 'LIMIT 1';

		return new Promise((resolve) => {
			this.db.query(sql, inserts, (error, results, fields) => {
				const result = (results.length) ? results[0] : null
				resolve({error, result, fields})
			});
		})	
	}

	findAll = async (table, filters) => {
	
		let sql = 'SELECT * FROM ?? WHERE ';
		let inserts = [table];

		Object.keys(filters).forEach((key, index) => {
			sql += (index == 0) ? '??=? ' : 'AND ??=? '
			inserts.push(key, filters[key])
		})

		return new Promise((resolve) => {
			this.db.query(sql, inserts, (error, results, fields) => {
				resolve({error, results, fields})
			});
		})
	}

	create = async (table, obj, callback) => {
		let sql = 'INSERT INTO ?? SET ?';

		return new Promise((resolve) => {
			this.db.query(sql, [table, obj], (error, result, fields) => {
				resolve({error, result, fields});
			});
		})
		
	}

	update = async (table, obj, callback) => {
		let sql = 'UPDATE ?? SET ? WHERE id = ?';
		
		return new Promise((resolve) => {
			this.db.query(sql, [table, obj, obj.id], (error, result, fields) => {
				resolve({error, result, fields});
			});
		})
	}

	deleteById = (table, id, callback) => {
		let sql = 'DELETE FROM ?? WHERE id = ?';
		this.db.query(sql, [table, id], callback);
	}


	//get all data from a table in decending order by a field with pagination
	/**
	 * @param {page} page number (1,2,3,4..)
	 * @param {table} tabel name
	 * @param {field} where filter apply on which field
	 * @param {value} where filter value
	 * @param {order_field} order by field
	 * @param {callback} (error,results)=>{}
	 */
	getPaginateList = (page, table, field, value, field2 = "", value2 = -1, order_field, callback) => {

		//implement pagination here later
		const page_size = Define.PAGINATE_PAGE_SIZE;
		let skip = (page - 1) * page_size;

		let sql = "";
		if (value2 === -1 && field2 === "") {
			sql = `SELECT * from ?? WHERE ?? =? ORDER BY ?? DESC LIMIT ? OFFSET ? `;
			this.db.query(sql, [table, field, value, order_field, page_size, skip], callback);
		} else {
			sql = `SELECT * from ?? WHERE ?? =? AND ??=? ORDER BY ?? DESC LIMIT ? OFFSET ? `;
			this.db.query(sql, [table, field, value, field2, value2, order_field, page_size, skip], callback);
		}

	}
}

module.exports = Model
