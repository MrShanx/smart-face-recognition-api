const Clarifai = require('clarifai');

//Clarifai Demo API 
const app = new Clarifai.App({
  // MY API KEY - cad8df1bb71b4f0a822797a7bae79204
  // Most API require/import these types of keys to use their service
 apiKey: 'cad8df1bb71b4f0a822797a7bae79204'
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