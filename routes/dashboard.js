var express = require('express');
var router = express.Router();
var knex = require('../db/knex')

function Users(){
  return knex('users');
}

function Posts(){
  return knex('posts');
}

// get route for dashboard
router.get('/', function (req, res, next) {
  res.render('index', {title: "You are on Dashboard"});
})

//get route for category (helps or interestings)
// router.get('/:category', function (req, res, next) {
//   // need to put in req.params here to get category
//   Users().where('id', req.params.id).first().then(function (users) {
//     Posts().where('author_id', req.params.id).first().then(function (posts) {
//       // if req.body.cat_name === "helps"
//       // res.redirect('/helps')
//
//     })
//
//   })
//   res.render('posts/index', {title: "you are on the category"});
// })

// get route for users

router.get('/users', function (req, res, next) {
  Users().select().then(function (users) {
    res.render('users/index', {title: "this is the users page", users:users})

  })
})





module.exports = router;
