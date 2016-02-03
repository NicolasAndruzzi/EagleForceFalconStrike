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
  Users().where("linkedin_id", res.locals.user.id).first().then(function (user){
    if(user){
    res.render('posts/form', {title: "add a post mo-fo", user: user})
    } else {
      res.redirect('/auth/linkedin')
    }
  })
})


module.exports = router;
