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
  Posts().select().then(function(posts){
    res.render('index', {title: "You are on Dashboard", posts: posts});
  })
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

// get route to create a new post
router.get('/new', function (req, res, next) {
  Users().select().first().then(function (user){
    res.render('posts/form', {title: "this is the new form page", user: user})
  })
})

//get route to create a new post
// router.get('/users/:id/new', function (req, res, next) {
//   Users().where('id', req.params.id).then(function (user){
//     res.render('posts/form', {title: "this is the new form page", user: user})
//   })
// })

//post route to submit form and update the Posts database
router.post('/', function (req, res, next) {
    // Posts().insert({
    //   author_id: Number(req.body.author_id),
    //   upvotes: Number(req.body.upvotes),
    //   downvotes: Number(req.body.downvotes),
    //   body: req.body.body,
    //   cat_name: req.body.cat_name,
    //   created_at: Number(req.body.created_at),
    //   updated_at: Number(req.body.updated_at)
    // }).then(function (result) {
    //   res.redirect('/')
    // })

    Posts().insert(req.body).then(function (posts) {
      res.redirect('/')
    })
})

module.exports = router;
