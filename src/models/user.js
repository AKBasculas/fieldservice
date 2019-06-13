var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
const SALT_ROUNDS = 5;


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.pre('save', function(next){
  var user = this;
  if (!user.isModified('password')) return next(); //only hash is password is being modified or is new
  bcrypt.genSalt(SALT_ROUNDS, function(err, salt){ //generate salt
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) { //hash password
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.method('comparePassword', function(password){ //defines a password comparison method for the schema class
  bcrypt.compare(password, this.password, function(err, res){ //compares a password to the user password and callbacks
    if (err) throw err;
    return res; //returns comparison result
  });
});

const User = mongoose.model('User', userSchema); //creates user model based on the schema

export default User;
