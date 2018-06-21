const handleProfileGet = (req, res, db) => {
	const { id } = req.params;
	db.select('*').from('users').where('id', id)
		.then(user => {
			if(user.length) { //if there is a user returned (non-empty)
				res.json(user[0]); //return just the value not the array
			} else { //return an error not found
				res.status(400).json('Not found');
			}
		})
		.catch(err => res.status(400).json('error getting user'));
}

module.exports = {
	handleProfileGet //ES6 no need for prop: value
}