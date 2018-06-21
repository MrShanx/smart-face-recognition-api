const Clarifai = require('clarifai');

//Clarifai Demo API 
const app = new Clarifai.App({
  // Most API require/import these types of keys to use their service
 apiKey: process.env.CLARIFAI_KEY //config Vars heroku server settings
});

//moved API key (call) from being visible in front-end to back-end 
const handleApiCall = (req, res) => {
	app.models
		.predict(Clarifai.DEMOGRAPHICS_MODEL, req.body.input)
		.then(data => {
			res.json(data);
		})
		.catch(err => res.status(400).json('unable to work with API'));
}

const handleImage = (req, res, db) => {
	const { id } = req.body;
	db('users').where('id', '=', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries => {
		res.json(entries[0]); //return just the value not the array
	})
	.catch(err => res.status(400).json('unable to get entries'));
}

module.exports = {
	handleImage, //ES6 prop:value not needed
	handleApiCall
}