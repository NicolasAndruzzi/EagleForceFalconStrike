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
function Comments(){
  return knex('comments');
}
var events

router.use('/', function(req, res, next) {
  unirest.get('https://api.meetup.com/2/open_events?zip=80202&and_text=False&offset=0&format=json&limited_events=False&topic=javascript,angularjs,node,web+development,jquery,react,ember&photo-host=public&page=20&time=1w%2C2w&radius=25.0&desc=False&status=upcoming&sig_id=195744452&sig=77b786475090cc7600cdcad96aaea4c388daf3a9').end(function(response) {
    events = response.body.results;
    console.log(Date(events[0].time));
    next();
  });
});


router.get('/', function (req, res, next) {
  res.cookie("logged out", "logged out")
  Users().fullOuterJoin("posts", "users.id", "posts.author_id").then(function (users){
    if(req.session){
      var profile = res.locals.user
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

router.get('/post/:post_id/upvote', function (req, res, next) {
  Posts().where('id', req.params.post_id).first().then(function (results) {
    console.log(results);
    var votes = results.upvotes;
    console.log(votes);
    console.log("***********");
    votes += 1;
    console.log(votes);
    Posts().where('id', req.params.post_id).update({
      upvotes: votes
    }).then(function (votes) {
      res.redirect('/')
    })
    })
})
router.get('/post/:post_id/downvote', function (req, res, next) {
  Posts().where('id', req.params.post_id).first().then(function (results) {
    console.log(results);
    var votes = results.downvotes;
    console.log(votes);
    console.log("***********");
    votes += 1;
    console.log(votes);
    Posts().where('id', req.params.post_id).update({
      downvotes: votes
    }).then(function (votes) {
      res.redirect('/')
    })
    })
})
router.get('/post/:post_id/upvote/show', function (req, res, next) {
  Comments().where('id', req.params.post_id).first().then(function (results) {
    console.log(results);
    var votes = results.upvotes;
    console.log(votes);
    console.log("***********");
    votes += 1;
    console.log(votes);
    Comments().where('id', req.params.post_id).update({
      upvotes: votes
    }).then(function (votes) {
      res.redirect('/posts/'+req.params.post_id+'/show')
    })
    })
})
router.get('/post/:post_id/downvote/show', function (req, res, next) {
  Comments().where('id', req.params.post_id).first().then(function (results) {
    var votes = results.downvotes;
    votes += 1;
    Comments().where('id', req.params.post_id).update({
      downvotes: votes
    }).then(function (votes) {
      res.redirect('/posts/'+req.params.post_id+'/show')
    })
    })
})

// admin route for Super Admin
router.get('/admin', function (req, res, next) {
  var linkedinID = req.session.passport.user.id
  Users().select().then(function (users) {
    Users().where("linkedin_id", linkedinID).first().then(function (admin) {
      console.log("^^^^TRUE^^^^");
      console.log(admin);
      Posts().select().then(function (posts) {
        Posts().where("cat_name", "helps").then(function (helps) {
          Posts().where("cat_name", "interestings").then(function (interestings) {
            var interestingsNumber = Number(interestings.length);
            var helpsNumber = Number(helps.length);
            var userNumber = Number(users.length);
            var profile = res.locals.user;
            res.render('admin', {profile: profile, users: users, posts: posts, userNumber: userNumber, helpsNumber: helpsNumber,
              interestingsNumber: interestingsNumber, admin: admin});

            })
        })
      })
    })
  })
})

module.exports = router;
