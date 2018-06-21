/* 
SERVER API ENDPOINTS
/(root) --> res = this is working 
/signin --> POST = success/fail --- POST is used to send passwords through body, for security.
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT = user
/imageurl --> POST = clarifai data
/rankings --> GET = user 
*/

//built in express module in node - creates server
const express = require('express');
//import bodyParser - parsing json data (installed in npm)
const bodyParser = require('body-parser');
//bCrypt - password hasher
const bcrypt = require('bcrypt-nodejs');
//cors middleware - server security to allow connection with local server, from same origin(computer) of requests
const cors = require('cors');

//import controllers
const register = require('./controllers/register.js');
const signin = require('./controllers/signin.js');
const profile = require('./controllers/profile.js');
const image = require('./controllers/image.js');
const rankings = require('./controllers/rankings.js');


//knex.js - server to db connectivity, (pg installed for postgresql)
const knex = require('knex'); //importing
const db = 
	knex({  //initialization
	  client: 'pg', //PostgreSQL
	  connection: {
	    connectionString : process.env.DATABASE_URL, //127.0.0.1 - home localhost. update with dynamic db IP once hosted on a platform 
	    ssl: true,
  	}
});

//select query with knex, returns a promise
// db.select('*').from('users').then(data => {
// 	 console.log(data); //no parsing needed: data sent & received from database, not through HTTP (where json syntax is a must)
// });


//initiate express module
const app = express();
//parse all data using bodyParser()
app.use(bodyParser.json());
//allow connection to local server - bypassing engine security feature
app.use(cors());


app.get('/', (req, res) => { res.send("working...") });

//KNEX - signin route - signs in valid user
//call on imported signin function in sigin.js
//req, res, db, bcrypt - dependency injection - give handleRegister func what it needs to run
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) });

//KNEX - profile/:userId route - returns user profile, 400 if no such profile
//NOT USED IN APP
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) });

//KNEX - register route - registers user
//call on imported register function in register.js
//req, res, db, bcrypt - dependency injection - give handleRegister func what it needs to run
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });

//KNEX - image route - updates: increase entry count
app.put('/image', (req, res) => { image.handleImage(req, res, db) });
//handles api call to clarifai (hides api key from view in front end)
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) });

//KNEX - get rankings
app.get('/rankings', (req, res) => { rankings.handleRankingsGet(req, res, db) });


//sets localhost to 3000 and listens for requests
const PORT = process.env.PORT;
//app.list(process.env.PORT || 3001, ()=> {
app.listen(PORT, ()=> {
	console.log(`app is running on port ${PORT}`);
});
//git bash
//port=address node server.js
