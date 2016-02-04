var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

function Users(){
  return knex('users');
}

function Posts(){
  return knex('posts');
}

router.get('/', function (req, res, next) {
  res.cookie("logged out", "logged out")
  Users().fullOuterJoin("posts", "users.id", "posts.author_id").then(function (users) {
    if(req.session){
      var profile = res.locals.user
      res.render('index', {title: "You are on Dashboard", users:users, profile: profile});
    } else {
      res.render('index', {title: "You are on Dashboard", users:users, profile: profile});
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
  res.render('about')
})


module.exports = router;
