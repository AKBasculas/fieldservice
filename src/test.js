var response = false;
var ivan = new models.User({
  username: 'ivanleon',
  password: 'password'
});
try{
  ivan.save(function(err){
    if (err) throw err;

    models.User.findOne({username: 'ivanleon'}, function(err, user){
      if (err) throw err;

      response = user.comparePassword('password');
      return res.send("comparison");

    });
  });
}
catch(e){
  console.log(e);
}
