// Require the Express Module
var express = require('express');
// require mongoose
var mongoose = require('mongoose');
//Mongoose database connection
mongoose.connect('mongodb://localhost/basic_mongoose');
// create a mongoose schema
var UserSchema = new mongoose.Schema({
    name: String,
    age: Number
   },
   {timestamps: true}
)
   mongoose.model('User', UserSchema); // We are setting this Schema in our Models as 'User'

   var User = mongoose.model('User') // We are retrieving this Schema from our Models, named 'User'

// Create an Express App
var app = express();
// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));
// Require path
var path = require('path');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
// Routes
// Root Request
app.get('/', function(req, res) {
    User.find({}, function(err, users){
    // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
    res.render('index', {users: users});
    })
})
// Add User Request 
app.post('/users', function(req, res) {
    console.log("POST DATA", req.body);
    // create a new User with the name and age corresponding to those from req.body
    var user = new User({name: req.body.name, age: req.body.age});
    // Try to save that new user to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
    user.save(function(err) {
      // if there is an error console.log that something went wrong!
      if(err) {
        console.log('something went wrong');
        console.log(err);
      } else { // else console.log that we did well and then redirect to the root route
        console.log('successfully added a user!');
        res.redirect('/');
      }
    })
  })
  // The root route -- we want to get all of the users from the database and then render the index view passing it all of the users
app.get('/', function(req, res) {
    User.find({}, function(err, users) {
      // This is the method that finds all of the users from the database
      // Notice how the first parameter is the options for what to find and the second is the
      //   callback function that has an error (if any) and all of the users
      // Keep in mind that everything you want to do AFTER you get the users from the database must
      //   happen inside of this callback for it to be synchronous 
      // Make sure you handle the case when there is an error, as well as the case when there is no error
    })
  })
  app.post('/destroy', function(req, res){
      User.remove({}, function(err){

      })
      res.redirect('/');
  });
  
// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
})
