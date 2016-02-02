var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

function Users(){
  return knex('users');
}

function Posts(){
  return knex('posts');
}

// function Login(){
//   return knex('login');
// }



// get route for dashboard  
router.get('/', function (req, res, next) {
  Users().select().then(function (users) {
    Posts().select().then(function (posts) {
      res.render('index', {title: "You are on Dashboard", user:users, posts: posts});
    })
  })
})

//post route to submit form and update the Posts database to be displayed on dashboard page
router.post('/', function (req, res, next) {
    Posts().insert(req.body).then(function (posts) {
      res.redirect('/')
    })
})

// get rout to the "about" page
router.get('/about', function (req, res, next) {
  res.render('about')
})




module.exports = router;
