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

//Validate setup
validate.extend(validate.validators.datetime,{
  parse: function(value, options){
    return Date.parse(value);
  },
  format: function(value, options){
    return Date(value);
  }
});

// MIDDLEWARE
//express parsing
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//express-session
app.use(session({
  genid: (req) => {
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
app.use(['/branch'], permissions.permit([permissions.PERMISSIONS.CREATE_BRANCH]));
app.use(['/register'], permissions.permit([permissions.PERMISSIONS.CREATE_USER]));
app.use(['/service'], permissions.permit([permissions.PERMISSIONS.CREATE_SERVICE]));
app.use(['/contact'], permissions.permit([permissions.PERMISSIONS.CREATE_CONTACT]))
app.use(['/company'], permissions.permit([permissions.PERMISSIONS.CREATE_COMPANY]));
app.use(['/company/contact'], permissions.permit([permissions.PERMISSIONS.ADD_COMPANY_CONTACTS]));
app.use(['/device/type'], permissions.permit([permissions.PERMISSIONS.CREATE_DEVICE_TYPE]));
app.use(['/device/brand'], permissions.permit([permissions.PERMISSIONS.CREATE_DEVICE_BRAND]));
app.use(['/device/model'], permissions.permit([permissions.PERMISSIONS.CREATE_DEVICE_MODEL]));
app.use(['/ownership'], permissions.permit([permissions.PERMISSIONS.CREATE_OWNERSHIP]))
app.use(['/person'], permissions.permit([permissions.PERMISSIONS.CREATE_PERSON]));
app.use(['/vehicle'], permissions.permit([permissions.PERMISSIONS.CREATE_VEHICLE]));
app.use(['/entry'], permissions.permit([permissions.PERMISSIONS.CREATE_ENTRY]));

//Routing
//Login to local db
app.post('/login', passport.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

//Logout
app.get('/logout', function(req, res){
  req.logout();
  res.sendStatus(200);
});

//Create user
app.post('/register', (req, res, next) => {
  //Validate request data
  if (validate(req.body, constraints.CREATE_USER) != undefined) return res.sendStatus(406);
  if(!req.body.branches.every( branch => validate.single(branch, constraints.ID) === undefined)) return res.sendStatus(406);
  //Check if user exists with that username
  models.User.findOne({username: req.body.username}, function (err, user){
    if (err) return next(err);
    if (user) return res.status(409).send("A user with that username already exists.");
    //TODO: Verify username and password to be valid
    //Check if role exists
    if (!permissions.ROLES.hasOwnProperty(req.body.role)) return res.sendStatus(406);
    //Check if branches exist
    models.Branch.find({_id: {$in: req.body.branches.map(b => mongoose.Types.ObjectId(b))}}, function(err, branches){
      if (req.body.branches.length != branches.length) return res.status(404).send("Couldn't find one of the branches");
      //Create new user
      let new_user = new models.User({
        username: req.body.username,
        password: req.body.password,
        role: req.body.role,
        branches: req.body.branches
      });
      //Save user
      new_user.save(function(err){
        if (err) return next(err);
        return res.status(200).send("You have been registered.");
      });
    });
  });
});

//Create branch
app.post('/branch', (req, res, next) => {
  //Validate request data
  if (validate(req.body.branch, constraints.CREATE_BRANCH) != undefined) return res.sendStatus(406);
  //Check if branch exists with that name
  models.Branch.findOne({name: req.body.branch.name}, function(err, branch){
    if (err) return next(err);
    if (branch) return res.status(409).send("A branch with that name already exists.");
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

//Create service
app.post('/service', (req, res, next) => {
  //Validate request data
  if (validate(req.body.service, constraints.CREATE_SERVICE) != undefined) return res.sendStatus(406);
  //Check if service exists with that name
  models.Service.findOne({name: req.body.service.name}, function(err, service){
    if (err) return next(err);
    if (service) return res.status(409).send("A service with that name already exists.");
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

//Create contact
app.post('/contact', (req, res, next) =>{
  //Validate request data
  if(validate(req.body.contact, constraints.CREATE_CONTACT) != undefined) return res.sendStatus(406);
  //Create new contact
  let new_contact = new models.Contact({
    name: req.body.contact.name,
    phone: req.body.contact.phone
  });
  new_contact.save(function(err){
    if (err) return next(err);
    return res.status(200).send("The contact has been registered");
  });
});

//Create company
app.post('/company', (req, res, next) => {
  //Validate request data
  if(validate(req.body.company, constraints.CREATE_COMPANY) != undefined) return res.sendStatus(406);
  //Check if company exists with that name
  models.Company.findOne({name: req.body.company.name}, function(err, company){
    if (err) return next(err);
    if (company) return res.status(409).send("A company with that name already exists.");
    //Check if user can add company to that branch
    if (!req.user.branches.some( b => b._id.toString() === req.body.company.branch)) return res.sendStatus(406);
    //Find branch and its id
    models.Branch.findById(req.body.company.branch, function(err, branch){
      if (err) return next(err);
      if (!branch) return res.status(404).send("Couldn't find that branch.");
      //Save company
      let new_company = new models.Company({
        name: req.body.company.name,
        address: req.body.company.address,
        branch: req.body.company.branch
      });
      new_company.save(function(err){
        if (err) return next(err);
        return res.status(200).send("The company has been registered.");
      });
    });
  });
});

//Add company contacts
app.put('/company/contacts', (req, res, next) => {
  //Validate request data
  if(validate(req.body, constraints.ADD_COMPANY_CONTACTS) != undefined) return res.sendStatus(406);
  if(!req.body.contacts.every( contact => contact && typeof(contact) === "string")) return res.sendStatus(406);
  //Check if company exists for user branches
  models.Company.findOne({
    $and: [
      {_id: mongoose.Types.ObjectId(req.body.company)},
      {branch: {$in: req.user.branches.map( b => mongoose.Types.ObjectId(b._id))}}
    ]
  }, function(err, company){
    if (err) return next(err);
    if (!company) return res.status(404).send("Couldn't find that company.");
    //Check if contacts exist
    models.Contact.find({
      _id: {
        $in: req.body.contacts.map(c => mongoose.Types.ObjectId(c))
      }
    }, function(err, contacts){
      if (contacts.length != req.body.contacts.length) return res.status(404).send("Couldn't find one of the contacts");
      //Add contacts to company if they don't already exist
      contacts.forEach(contact => {
        if (!company.contacts.some(c => c.toString() == contact._id)) company.contacts.push(contact._id);
      });
      //Save company
      company.save(function(err){
        if (err) return next(err);
        return res.status(200).send("The contacts have been added to the company.")
      });
    });
  });
});

//Create device type
app.post('/device/type', (req, res, next) => {
  //Validate request data
  if(validate(req.body.devicetype, constraints.CREATE_DEVICE_TYPE) != undefined) return res.sendStatus(406);
  //Check if device type exists with same name
  models.DeviceType.findOne({name: req.body.devicetype.name}, function(err, devicetype){
    if (err) return next(err);
    if (devicetype) return res.status(409).send("A device type with that name already exists.");
    //Create new device type
    let new_devicetype = new models.DeviceType({
      name: req.body.devicetype.name,
    });
    //Save device type
    new_devicetype.save(function(err){
      if (err) return next(err);
      return res.status(200).send("The device type has been added.");
    });
  });
});

//Create device brand
app.post('/device/brand', (req, res, next) => {
  //Validate request data
  if(validate(req.body.devicebrand, constraints.CREATE_DEVICE_BRAND) != undefined) return res.sendStatus(406);
  //Check if device brand exists with same name
  models.DeviceBrand.findOne({name: req.body.devicebrand.name}, function(err, devicebrand){
    if (err) return next(err);
    if (devicebrand) return res.status(409).send("A device brand with that name already exists.");
    //Create new device brand
    let new_devicebrand = new models.DeviceBrand({
      name: req.body.devicebrand.name,
    });
    //Save device brand
    new_devicebrand.save(function(err){
      if (err) return next(err);
      return res.status(200).send("The device brand has been added.");
    });
  });
});

//Create device model
app.post('/device/model', (req, res, next) => {
  //Validate request data
  if(validate(req.body.devicemodel, constraints.CREATE_DEVICE_MODEL) != undefined) return res.sendStatus(406);
  //Check if device model exists with same name
  models.DeviceModel.findOne({name: req.body.devicemodel.name}, function(err, devicemodel){
    if (err) return next(err);
    if (devicemodel) return res.status(409).send("A device model with that name already exists.");
    //Check if brand exists
    models.DeviceBrand.findOne({_id: req.body.devicemodel.brand}, function(err, devicebrand){
      if (err) return next(err);
      if (!devicebrand) return res.status(404).send("Couldn't find that device brand.");
      //Check if type exists
      models.DeviceType.findOne({_id: req.body.devicemodel.type}, function(err, devicetype){
        if (err) return next(err);
        if (!devicetype) return res.status(404).send("Couldn't find that device type.");
        //Create new device model
        let new_devicemodel = new models.DeviceModel({
          name: req.body.devicemodel.name,
          brand: devicebrand._id,
          type: devicetype._id
        });
        //Save device model
        new_devicemodel.save(function(err){
          if (err) return next(err);
          return res.status(200).send("The device model has been added.");
        });
      });
    });
  });
});

//Create ownership
app.post('/ownership', (req, res, next) => {
  //Validate request data
  if(validate(req.body.ownership, constraints.CREATE_OWNERSHIP) != undefined) return res.sendStatus(406);
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

//Create person
app.post('/person', (req, res, next) => {
  //Validate request data
  if (validate(req.body.person, constraints.CREATE_PERSON) != undefined) return res.sendStatus(406);
  //Check if person number exists
  models.Person.findOne({number: req.body.person.number}, function(err, person){
    if (err) return next(err);
    if (person) return res.status(409).send("This person number already exists");
    //Check if user can add person with that branch
    if (!req.user.branches.some( b => b._id.toString() === req.body.person.branch)) return res.sendStatus(406);
    //Find branch
    models.Branch.findById(req.body.person.branch, function(err, branch){
      if (err) return next(err);
      if (!branch) return res.status(404).send("Couldn't find that branch.");
      //Create new person
      let new_person = new models.Person({
        name: req.body.person.name,
        number: req.body.person.number,
        branch: req.body.person.branch
      });
      //Save person
      new_person.save(function(err){
        if (err) return next(err);
        return res.status(200).send("The person has been registered");
      });
    });
  });
});

//Create vehicle
app.post('/vehicle', (req, res, next) => {
  //Validate request data
  if (validate(req.body.vehicle, constraints.CREATE_VEHICLE) != undefined) return res.sendStatus(406);
  //Check if vehicle alias exists
  models.Vehicle.findOne({alias: req.body.vehicle.alias}, function(err, vehicle){
    if (err) return next(err);
    if (vehicle) return res.status(409).send("This vehicle alias already exists");
    //Check if user can add vehicle with that branch
    if(!req.user.branches.some( b => b._id.toString() === req.body.vehicle.branch)) return res.sendStatus(406);
    //Find branch
    models.Branch.findById(req.body.vehicle.branch, function(err, branch){
      if (err) return next(err);
      if (!branch) return res.status(404).send("Couldn't find that branch.");
      //Create new vehicle
      let new_vehicle = new models.Vehicle({
        name: req.body.vehicle.name,
        alias: req.body.vehicle.alias,
        branch: req.body.vehicle.branch
      });
      //Save vehicle
      new_vehicle.save(function(err){
        if (err) return next(err);
        return res.status(200).send("The vehicle has been registered");
      });
    });
  });
});

//Create entry
app.post('/entry', (req, res, next) => {
  //Validate request data
  if (validate(req.body.entry, constraints.CREATE_ENTRY.ENTRY) != undefined) return res.status(406).send("ENTRY Not Acceptable");
  if (!req.body.entry.contacts.every( contact => validate.single(contact, constraints.ID) === undefined)) return res.status(406).send("Contacts Not Acceptable");
  if (!req.body.entry.devicemodels.every( devicemodel => validate.single(devicemodel, constraints.ID) === undefined)) return res.status(406).send("Devices Not Acceptable");
  if (!req.body.entry.periods.every( period => validate(period, constraints.CREATE_ENTRY.PERIOD) === undefined)) return res.status(406).send("Periods Not Acceptable");
  if (!req.body.entry.periods.every( period => period.people.every(person => validate.single(person, constraints.ID) === undefined) && period.vehicles.every(vehicle => validate.single(vehicle, constraints.ID) === undefined))) return res.status(406).send("Person and vehicle Not Acceptable");
  //Check if user can add to that branch
  if (!req.user.branches.some(b => b._id == req.body.entry.branch)) return res.status(406).send("User Not Acceptable");
  //Check if branch exists
  models.Branch.findById(req.body.entry.branch, function(err, branch){
    if (err) return next(err);
    if (!branch) return res.status(404).send("Couldn't find that branch");
    //Check if service exists
    models.Service.findById(req.body.entry.service, function(err, service){
      if (err) return next(err);
      if (!service) return res.status(404).send("Couldn't find that service");
      //Check if company exists
      models.Company.findById(req.body.entry.company, function(err, company){
        if (err) return next(err);
        if (!company) return res.status(404).send("Couldn't find that company");
        //Check if contacts exist in that company
        if (!req.body.entry.contacts.every(contact => company.contacts.some(c => c.toString() === contact))) return res.status(404).send("Couldn't find one of the contacts");
        //Check if ownership exists
        models.Ownership.findById(req.body.entry.ownership, function(err, ownership){
          if (err) return next(err);
          if (!ownership) return res.status(404).send("Couldn't find that ownership");
          //TODO: Check if device models exist
          models.DeviceModel.find({_id: {$in: req.body.entry.devicemodels.map(d => mongoose.Types.ObjectId(d))}}, function(err, devicemodels){
            if (err) return next(err);
            if (devicemodels.length != req.body.entry.devicemodels.length) return res.status(404).send("Couldn't find one of the device models");
            try{
              //Check if period has correct datetimes, check persons and vehicles exist
              (async function checkPeriod(){
                for (let i = 0; i < req.body.entry.periods.length; i++){
                  let period = req.body.entry.periods[i];
                  if (Date.parse(period.starttime) >= Date.parse(period.endtime)) return res.sendStatus(406);
                  //Check if people exist
                  for (let j = 0; j < period.people.length; j++){
                    let person = period.people[j];
                    if (!await models.Person.findById(person).exec()) return res.status(404).send("Couldn't find a person");
                  }
                  //Check if vehicles exist
                  for (let j = 0; j < period.vehicles.length; j++){
                    let vehicle = period.vehicles[j];
                    if (!await models.Vehicle.findById(vehicle).exec()) return res.status(404).send("Couldn't find a vehicle");
                  }
                  //Check if there is splices of people or vehicles
                  const entries = await models.Entry.find({
                    periods: {
                      $elemMatch: {
                        $and: [
                          {
                            $or: [
                              {
                                $and: [
                                  {starttime:{$gte: new Date(period.starttime)}},
                                  {starttime:{$lte: new Date(period.endtime)}}
                                ]
                              },
                              {
                                $and: [
                                  {endtime:{$gte: new Date(period.starttime)}},
                                  {endtime:{$lte: new Date(period.endtime)}}
                                ]
                              }
                            ]
                          },
                          {
                            $or: [
                              {vehicles: {$in: period.vehicles.map(v => mongoose.Types.ObjectId(v))}},
                              {people: {$in: period.people.map(p => mongoose.Types.ObjectId(p))}}
                            ]
                          }
                        ]
                      }
                    }
                  }).exec();
                  if(entries.length) return res.status(409).send("Space ocuppied");
                }
                //Create entry
                let new_entry = new models.Entry({
                  user: req.user._id,
                  branch: req.body.entry.branch,
                  service: req.body.entry.service,
                  company: req.body.entry.company,
                  contacts: req.body.entry.contacts,
                  devicemodels: req.body.entry.devicemodels,
                  periods: req.body.entry.periods,
                  cost: req.body.entry.cost,
                  ownership: req.body.entry.ownership,
                  comments: req.body.entry.comments
                });
                //Save entry
                new_entry.save(function(err){
                  if (err) return next(err);
                  return res.status(200).send("The entry has been registered");
                });
              })();
            }
            catch (err){
              return next(err);
            }
          });
        });
      });
    });
  });
});

//Read branches
app.get('/branch', (req, res, next) => {
  //Validate request data
  if (validate(req.body.query, constraints.READ_BRANCHES) != undefined) return res.sendStatus(406);
  let exp = `.*${req.body.query.name}.*`;
  models.Branch.find({name: {$regex: exp, $options: 'i'}}, function(err, branches){
    if (err) return next(err);
    return res.send(branches);
  });
});

//Read services
app.get('/service', (req, res, next) => {
  //Validate request data
  if (validate(req.body.query, constraints.READ_SERVICES) != undefined) return res.sendStatus(406);
  let exp = `.*${req.body.query.name}.*`;
  models.Service.find({name: {$regex: exp, $options: 'i'}}, function(err, services){
    if (err) return next(err);
    return res.send(services);
  });
});

//TESTING
app.get('/test', (req, res, next) => {
  models.Entry.findOne().populate('branch').populate('ownership').populate('periods.people periods.vehicles').populate('user', 'username').populate('contacts').populate('company').populate({path: 'devicemodels', populate: {path: 'brand type'}}).exec(function(err, entry){
    if (err) next(err);
    res.send(entry);
  });
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
