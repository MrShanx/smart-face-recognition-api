//KNEX - signin route - signs in valid user
const handleSignin = (req, res, db, bcrypt) => {
	//backend-input validation
	const { email, password } =  req.body;
	if(!email || !password) { //if any var is empty
		return res.status(400).json('incorrect form submission');
	}
	//no need for transaction, since db isn't updated
	db.select('email', 'hash').from('login')
		.where('email', '=', email)
		.then(data => {
			const isValid = bcrypt.compareSync(password, data[0].hash); //compare stored hashed password with password input (hashed)
			if(isValid) {
				return db.select('*').from('users') //return so db knows
					.where('email', '=', email)
					.then(user => {
						res.json(user[0]); //return value not array
					})
					.catch(err => res.status(400).json('unable to get user'))
			} else {
				res.status(400).json('wrong credentials');
			}
		})
		.catch(err => res.status(400).json('unexpected error'))
}

module.exports = {
	handleSignin: handleSignin
}