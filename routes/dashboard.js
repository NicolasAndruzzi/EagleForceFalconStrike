var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var unirest = require('unirest');
function Users(){
  return knex('users');
}

function Posts(){
  return knex('posts');
}
var events

router.use('/', function(req, res, next) {
  unirest.get('https://api.meetup.com/2/open_events?zip=80202&and_text=False&offset=0&format=json&limited_events=False&topic=javascript,angularjs,node,web+development,jquery,react,ember&photo-host=public&page=20&time=1w%2C2w&radius=25.0&desc=False&status=upcoming&sig_id=195744452&sig=77b786475090cc7600cdcad96aaea4c388daf3a9').end(function(response) {
    events = response.body.results;
    next();
  });
});


router.get('/', function (req, res, next) {
  res.cookie("logged out", "logged out")
  Users().fullOuterJoin("posts", "users.id", "posts.author_id").then(function (users){
    if(req.session){
      var profile = res.locals.user
      console.log(profile);
      res.render('index', {title: "You are on Dashboard", users:users, profile: profile,events:events});
    } else {
      res.render('index', {title: "You are on Dashboard", users:users, profile: profile,events:events});
    }
  })
})

//post route to submit form and update the Posts database to be displayed on dashboard page
router.post('/', function (req, res, next) {
  Users().where('linkedin_id', res.locals.user.id).first().then(function(users){
    Posts().insert({
      author_id: users.id,
      body: req.body.body,
      cat_name: req.body.cat_name,
      subject: req.body.subject,
    }).then(function (posts) {
      res.redirect('/')
    })
  })
})


// get rout to the "about" page
router.get('/about', function (req, res, next) {
  var profile = res.locals.user
  res.render('about', {profile:profile})
})


module.exports = router;
