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
    res.render('users/index', {title: "this is the users page for all users", users:users})
  })
})

// get route that will display individual user profile page
router.get('/:id', function(req, res, next){
  Users().innerJoin("posts", "users.id", "=", "posts.author_id").where().first().then(function (user){
    res.render('users/show', {user: user})
  })
})

module.exports = router;
