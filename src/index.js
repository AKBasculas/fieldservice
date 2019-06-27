require("@babel/polyfill"); //Needed for async
const express = require('express');
const uuid = require('uuid/v4');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const validate = require('validate.js');

//Local modules
import 'dotenv/config'; //Import environment variables
import models from './models'; //Import database models
import permissions from './permissions'; //Middleware for user roles and permissions
import constraints from './validate/constraints.js'; //Constraints definitions for use with validate.js


//Express setup
const app = express();

//Mongoose setup
var mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
  console.log('Database open.');
});

//Passport setup
passport.use(new LocalStrategy(
  function(username, password, done){
    models.User.findOne({username: username}, function (err, user){
      if (err) return done(err);
      if (!user) return done(null, false);
      user.comparePassword(password).then(function(isMatch){
        if (!isMatch) return done(null, false);
        return done(null, user);
      });
    });
  }
));

passport.serializeUser(function(user, cb){
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb){
  models.User.findById(id).
  populate('branches').
  exec(function(err, user){
    if (err) return cb(err);
    cb(null, user);
  });
});


// MIDDLEWARE
//express parsing
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//express-session
app.use(session({
  genid: (req) => {
    console.log('Inside the session middleware');
    console.log(req.sessionID);
    return uuid();
  },
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));
//passport
app.use(passport.initialize());
app.use(passport.session());

//permissions
app.use(['/branch'], permissions.permit([permissions.PERMISSIONS.BRANCH.CREATE]));

//Routing


app.post('/login', passport.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

app.get('/logout', function(req, res){
  req.logout();
  res.sendStatus(200);
});

app.post('/register', async (req, res) => {
  if (req.body.username && req.body.password){
    if (await models.User.findOne({username: req.body.username})){
      return res.status(409).send("That user already exists.");
    }
    else{
      //TODO: VERIFY USERNAME AND PASSWORD MAYBE??
      let user = new models.User({
        username: req.body.username,
        password: req.body.password
      });
      if(await user.save()){
        return res.status(200).send("You have been registered.");
      }
      else{
        return res.sendStatus(400);
      }
    }
  }
  else{
    return res.sendStatus(400);
  }
app.post('/branch', (req, res, next) => {
  //Validate request data
  if (validate(req.body.branch, constraints.BRANCH) != undefined) return res.sendStatus(406);
  //Check if branch exists
  models.Branch.findOne({name: req.body.branch.name}, function(err, branch){
    if (err) return next(err);
    if (branch) return res.status(409).send("This branch already exists.");
    //Create new branch
    let new_branch = new models.Branch({
      name: req.body.branch.name
    });
    //Save branch
    new_branch.save(function(err){
      if (err) return next(err);
      return res.status(200).send("The branch has been registered.");
    });
  })
});
});

app.post('/test', (req, res) => {
  console.log(req.body.username);
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
