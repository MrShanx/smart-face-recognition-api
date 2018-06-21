const handleRankingsGet = (req, res, db) => {
	db('users')
		.select('name', 'entries')
		.orderBy('entries', 'desc')
		.limit(3)
		.returning('name', 'entries')
		.then(rankings => {
			res.json(rankings); //returns array of 3 objects
		})
		.catch(err => res.status(400).json('unable to get rankings'));
}

module.exports = {
	handleRankingsGet //ES6
}