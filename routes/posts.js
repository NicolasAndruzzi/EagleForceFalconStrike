var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

function Users(){
  return knex('users');
}

function Posts(){
  return knex('posts');
}

// function Login() {
//   return knex('login')
// }

// get route to create a new post
router.get('/new', function (req, res, next) {
  Users().where("id", req.params.id).first().then(function (user){
    res.render('posts/form', {title: "this is the new form page", user: user})
  })
})


module.exports = router;
