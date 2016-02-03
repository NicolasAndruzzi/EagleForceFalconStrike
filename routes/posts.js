var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

function Users(){
  return knex('users');
}

function Posts(){
  return knex('posts');
}

// get route to create a new post
router.get('/new', function (req, res, next) {
  if(user){
  Users().where("linkedin_id", res.locals.user.id).first().then(function (user){
    res.render('posts/form', {title: "this is the new form page", user: user})
    })
  } else {
    res.redirect('/dashboard')
  }
})


module.exports = router;
