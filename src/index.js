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
passport.use(new LocalStrategy(function(username, password, done){
  models.User.findOne({username: username}, function (err, user){
    if (err) return done(err);
    if (!user) return done(null, false);
    user.comparePassword(password).then(function(isMatch){
      if (!isMatch) return done(null, false);
      return done(null, user);
    });
  });
}));

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
app.use(['/register'], permissions.permit([permissions.PERMISSIONS.USER.CREATE]));
app.use(['/service'], permissions.permit([permissions.PERMISSIONS.SERVICE.CREATE]));
app.use(['/company'], permissions.permit([permissions.PERMISSIONS.COMPANY.CREATE]));
app.use(['/device/type'], permissions.permit([permissions.PERMISSIONS.DEVICE.TYPE]));
app.use(['/device/brand'], permissions.permit([permissions.PERMISSIONS.DEVICE.BRAND]));
app.use(['/device/model'], permissions.permit([permissions.PERMISSIONS.DEVICE.MODEL]));
app.use(['/ownership'], permissions.permit([permissions.PERMISSIONS.OWNERSHIP.CREATE]))
app.use(['/person'], permissions.permit([permissions.PERMISSIONS.PERSON.CREATE]));
app.use(['/vehicle'], permissions.permit([permissions.PERMISSIONS.VEHICLE.CREATE]));

//Routing
app.post('/login', passport.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

app.get('/logout', function(req, res){
  req.logout();
  res.sendStatus(200);
});

app.post('/register', (req, res, next) => {
  //Validate request data
  if (validate(req.body, constraints.REGISTER) != undefined) return res.sendStatus(406);
  if(!req.body.branches.every( branch => branch && typeof(branch) === "string")) return res.sendStatus(406);
  //Check if user exists
  models.User.findOne({username: req.body.username}, function (err, user){
    if (err) return next(err);
    if (user) return res.status(409).send("That user already exists.");
    //TODO: Verify username and password to be valid
    //Check if role exists
    if (!permissions.ROLES.hasOwnProperty(req.body.role)) return res.sendStatus(406);
    //Check if branches exist
    models.Branch.find({name: {$in: req.body.branches}}, function(err, branches){
      if (!branches) return res.status(404).send("Couldn't find any branch");
      if (req.body.branches.length != branches.length) return res.status(404).send("Couldn't find one of the branches");
      //Turn array of branch objects into array of ids
      let branches_ids = branches.map( b => b._id);
      //Create new user
      let new_user = new models.User({
        username: req.body.username,
        password: req.body.password,
        role: req.body.role,
        branches: branches_ids
      });
      //Save user
      new_user.save(function(err){
        if (err) return next(err);
        return res.status(200).send("You have been registered.");
      });
    });
  });
});

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

app.post('/service', (req, res, next) => {
  //Validate request data
  if (validate(req.body.service, constraints.SERVICE) != undefined) return res.sendStatus(406);
  //Check if service exists
  models.Service.findOne({name: req.body.service.name}, function(err, service){
    if (err) return next(err);
    if (service) return res.status(409).send("This service already exists.");
    //Create new service
    let new_service = new models.Service({
      name: req.body.service.name
    });
    //Save service
    new_service.save(function(err){
      if (err) return next(err);
      return res.status(200).send("The service has been registered.");
    });
  });
});

app.post('/company', (req, res, next) => {
  //Validate request data
  if(validate(req.body.company, constraints.COMPANY) != undefined) return res.sendStatus(406);
  if(!req.body.company.contacts.every( contact => validate(contact, constraints.CONTACT) === undefined)) return res.sendStatus(406);
  //Check if company exists
  models.Company.findOne({name: req.body.company.name}, function(err, company){
    if (err) return next(err);
    if (company) return res.status(409).send("This company already exists.");
    //Check if user can add company to that branch
    if (!req.user.branches.some( b => b.name == req.body.company.branch)) return res.sendStatus(406);
    //Find branch and its id
    models.Branch.findOne({name: req.body.company.branch}, function(err, branch){
      if (err) return next(err);
      //Save company
      let new_company = new models.Company({
        name: req.body.company.name,
        address: req.body.company.address,
        contacts: req.body.company.contacts,
        branch: branch._id
      });
      new_company.save(function(err){
        if (err) return next(err);
        return res.status(200).send("The company and its contacts have been registered.");
      });
    });
  });
});

app.post('/device/type', (req, res, next) => {
  //Validate request data
  if(validate(req.body.device, constraints.DEVICE.TYPE) != undefined) return res.sendStatus(406);
  //Check if device exists
  models.Device.findOne({name: req.body.device.type}, function(err, device){
    if (err) return next(err);
    if (device) return res.status(409).send("This device type already exists.");
    //Create new device type
    let new_device_type = new models.Device({
      name: req.body.device.type,
      brands: []
    });
    //Save device
    new_device_type.save(function(err){
      if (err) return next(err);
      return res.status(200).send("The device type has been registered");
    });
  });
});

app.post('/device/brand', (req, res, next) => {
  //Validate request data
  if(validate(req.body.device, constraints.DEVICE.BRAND) != undefined) return res.sendStatus(406);
  //Check if device type exists
  models.Device.findOne({name: req.body.device.type}, function(err, device){
    if (err) return next(err);
    if (!device) return res.status(404).send("Couldn't find that device type");
    //Check if device type brand exists
    if (device.brands.some( b => b.name === req.body.device.brand)) return res.status(409).send("This device brand already exists for this type");
    //Add new brand to device type
    device.brands.push({
      name: req.body.device.brand
    });
    //Save whole device
    device.save(function(err){
      if (err) return next(err);
      return res.status(200).send("The device brand has been registered");
    });
  });
});

app.post('/device/model', (req, res, next) => {
  //Validate request data
  if(validate(req.body.device, constraints.DEVICE.MODEL) != undefined) return res.sendStatus(406);
  //Check if device type exists
  models.Device.findOne({name: req.body.device.type}, function(err, device){
    if (err) return next(err);
    if (!device) return res.status(404).send("Couldn't find that device type");
    //Check if brand exists for that device type
    var brandIndex = device.brands.findIndex(b => b.name === req.body.device.brand);
    if (brandIndex === -1) return res.status(404).send("Couldn't find that brand for that device type");
    //Check if model exists
    if (device.brands[brandIndex].models.some(m => m.name === req.body.device.model)) return res.status(409).send("This device model already exists for this brand and type")
    //Add new model to brand in device type
    device.brands[brandIndex].models.push({
      name: req.body.device.model
    });
    //Save whole device
    device.save(function(err){
      if (err) return next(err);
      return res.status(200).send("The device model has been registered");
    });
  });
});

app.post('/ownership', (req, res, next) => {
  //Validate request data
  if(validate(req.body.ownership, constraints.OWNERSHIP) != undefined) return res.sendStatus(406);
  //Check if ownership exists
  models.Ownership.findOne({name: req.body.ownership.name}, function(err, ownership){
    if (err) return next(err);
    if (ownership) return res.status(409).send("This ownership already exists.");
    //Create new ownership
    let new_ownership = new models.Ownership({
      name: req.body.ownership.name
    });
    //Save ownership
    new_ownership.save(function(err){
      if (err) return next(err);
      return res.status(200).send("The ownership has been registered.");
    });
  });
});

app.post('/person', (req, res, next) => {
  //Validate request data
  if (validate(req.body.person, constraints.PERSON) != undefined) return res.sendStatus(406);
  //Check if person number exists
  models.Person.findOne({number: req.body.person.number}, function(err, person){
    if (err) return next(err);
    if (person) return res.status(409).send("This person number already exists");
    //Check if user can add person with that branch
    if (!req.user.branches.some( b => b.name == req.body.person.branch)) return res.sendStatus(406);
    //Find branch
    models.Branch.findOne({name: req.body.person.branch}, function(err, branch){
      //Create new person
      let new_person = new models.Person({
        name: req.body.person.name,
        number: req.body.person.number,
        branch: branch._id
      });
      //Save person
      new_person.save(function(err){
        if (err) return next(err);
        return res.status(200).send("The person has been registered");
      });
    });
  });
});

app.post('/vehicle', (req, res, next) => {
  //Validate request data
  if (validate(req.body.vehicle, constraints.VEHICLE) != undefined) return res.sendStatus(406);
  //Check if vehicle alias exists
  models.Vehicle.findOne({alias: req.body.vehicle.alias}, function(err, vehicle){
    if (err) return next(err);
    if (vehicle) return res.status(409).send("This vehicle alias already exists");
    //Check if user can add vehicle with that branch
    if(!req.user.branches.some( b => b.name == req.body.vehicle.branch)) return res.sendStatus(406);
    //Find branch
    models.Branch.findOne({name: req.body.vehicle.branch}, function(err, branch){
      //Create new vehicle
      let new_vehicle = new models.Vehicle({
        name: req.body.vehicle.name,
        alias: req.body.vehicle.alias,
        branch: branch._id
      });
      //Save vehicle
      new_vehicle.save(function(err){
        if (err) return next(err);
        return res.status(200).send("The vehicle has been registered");
      });
    });
  });
});

app.post('/test', (req, res) => {
  console.log(req.user);
  console.log(validate(req.body.company, company_constraints));
  console.log(req.body.company.contacts.every( contact => validate(contact, contact_constraints) === undefined));
  res.sendStatus(200);
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
