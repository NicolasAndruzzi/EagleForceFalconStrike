
var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

function Users(){
 return knex('users');
}

function Posts(){
 return knex('posts');
}

// get route for all users
router.get('/', function (req, res, next) {
 Users().select().then(function (users) {
   var profile = res.locals.user
   res.render('users/index', {title: "this is the users page", users:users, profile: profile})
 })
})


// get route that will display individual user profile page
router.get('/:id', function(req, res, next){
  Users().where('id', req.params.id).first().then(function (user){
    Posts().where('author_id', user.id).then(function (posts) {
      var profile = res.locals.user
      res.render('users/show', {user: user, profile:profile, posts:posts})
    })
  })
})

module.exports = router;
