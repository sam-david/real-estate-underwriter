var express  = require('express');
var app      = express();
var path     = require('path');
var secretKey = require('./secret');
var zillow = require('./app/models/zillow');
var trulia = require('./app/models/trulia');
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

// connect db
var configDB = require('./config/database.js');
mongoose.connect(configDB.url);

require('./config/passport')(passport); // pass passport for configuration
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

// Set up express
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// required for passport
app.use(session({ secret: 'GWdi*z8Gyfa>6XT6wGKJRv3?4C8c$n' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// Routes
require('./app/routes.js')(app, passport); // load our routes and pass in app, configured passport



// Set server port
app.listen(port);
console.log('server is running on port: ' + port);


