var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('cookie-session')
require('dotenv').load()
var passport = require('passport');
var LinkedInStrategy = require('passport-linkedin').Strategy

var routes = require('./routes/index');
var users = require('./routes/users');
var dashboard = require('./routes/dashboard');
var posts = require('./routes/posts');
var authRoutes = require('./routes/auth');
// var login = require('./routes/login');

var app = express();

var knex = require('./db/knex');

function Users(){
  return knex('users');
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ keys: [process.env.SESSION_KEY1, process.env.SESSION_KEY2] }))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LinkedInStrategy({
    consumerKey: process.env.LINKEDIN_CLIENT_ID,
    consumerSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: process.env.HOST + "/auth/linkedin/callback"
  },
  function(token, tokenSecret, profile, done) {
    Users().where('linkedin_id', profile.id).first().then(function (user) {
      if(user){
        console.log("*****USER****");
        console.log(user);
        res.cookie("user", profile.id)
        res.redirect('/');
      } else {
        Users().insert({
          linkedin_id: profile.id,
          first_name: profile.name.givenName,
          last_name: profile.name.familyName
        }, "id").then(function (user) {
          done(null, profile)
          res.cookie("user", profile.id)
          res.redirect('/');
        });
      }
    })

    done(null, profile)




  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user)
});

app.use(function (req, res, next) {
  res.locals.user = req.user
  next()
})

app.use('/', routes);
app.use('/auth', authRoutes);
// app.use('/login', login);
app.use('/dashboard', dashboard)
app.use('/users', users);
app.use('/posts', posts);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
