var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

function Users(){
  return knex('users');
}

function Posts(){
  return knex('posts');
}

// get route for dashboard
router.get('/', function (req, res, next) {
  Users().select().then(function (users) {
    Posts().select().then(function (posts) {
      var profile = res.locals.user
      // console.log("******");
      // console.log(profile);
      res.render('index', {title: "You are on Dashboard", user:users, posts: posts, profile: profile});
    })
  })
})

//post route to submit form and update the Posts database to be displayed on dashboard page
router.post('/', function (req, res, next) {
  Users().where('linkedin_id', res.locals.user.id).first().then(function(users){
    console.log(users);
    Posts().insert({
      author_id: users.id,
      body: req.body.body,
      cat_name: req.body.cat_name
    }).then(function (posts) {
      res.redirect('/')
    })
  })
})

// get rout to the "about" page
router.get('/about', function (req, res, next) {
  res.render('about')
})




module.exports = router;
