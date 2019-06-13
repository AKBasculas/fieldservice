require("@babel/polyfill"); //Needed for async

import models from './models'; //Import database models
import 'dotenv/config'; //Import environment variables

//Express setup
const express = require('express');
const app = express();
app.use(express.urlencoded());
app.use(express.json());

//Mongoose setup
var mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
  console.log('Database open.');
});

//Routing
app.get('/', async (req, res) => {
  return res.send('Received a GET HTTP method');
});

app.post('/login', (req, res) => {

})

app.post('/register', (req, res) => {

});

app.post('/', (req, res) => {
  return res.send('Received a POST HTTP method');
});

app.put('/', (req, res) => {
  return res.send('Received a PUT HTTP method');
});

app.delete('/', (req, res) => {
  return res.send('Received a DELETE HTTP method');
});

app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`))
