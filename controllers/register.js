//KNEX - register route - registers user
const handleRegister = (req, res, db, bcrypt) => {
	//backend-input validation
	const { email, name, password } = req.body;
	if(!email || !name || !password) { //if any var is empty
		return res.status(400).json('incorrect form submission');
	}
	//hash password and store in a variable
	const hash = bcrypt.hashSync(password);
	//transaction - for DB consistency, either all pass, or none passes successfully.
		db.transaction(trx => {
			trx.insert({ //trx obj instead of db obj
				hash: hash,
				email: email
			})
			.into('login') //insert info into LOGIN table first
			.returning('email') //return email from LGOIN table
			.then(loginEmail => { //use login email : loginEmail, to create new user in USERS table
				return trx('users') //trx obj instead of db('users'), since part of transaction
					.returning('*')
					.insert({
						//id: '', -- auto incremented in DB
						name: name,
						email: loginEmail[0], //return value not array
						// entries: , -- DEFAULT 0 in DB
						joined: new Date() //returns current data upon first execution
					})
					.then(user => {
						res.json(user[0]); //return just the value not the array
					})
			})
			.then(trx.commit) //COMMIT changes if all are successful
			.catch(trx.rollback) //ROLLBACK changes if atleast one fails
		})
			.catch(err => res.status(400).json('unable to register')); //never return any information about your system to the client (security purposes)
};

//old way of exporting, backend not yet supported for ES6
module.exports = {
	handleRegister: handleRegister
};