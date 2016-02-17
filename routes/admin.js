var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

function Users(){
  return knex('users');
}

function Posts(){
  return knex('posts');
}
function Comments(){
  return knex('comments');
}


router.use('/', function (req, res, next) {
  var linkedinID = req.session.passport.user.id
  Users().where('linkedin_id', linkedinID).first().then(function (user) {
    if (user.is_admin){
      next()
    } else{
      res.redirect("/dashboard")
    }
  })
})

router.get('/', function(req, res, next) {
  Users().select().then(function(users) {
    Posts().select().then(function(posts) {
      Posts().where('cat_name', 'helps').then(function(helps) {
        Posts().where('cat_name', 'interestings').then(function(interestings) {
          var interestingsNumber = Number(interestings.length);
          var helpsNumber = Number(helps.length);
          var userNumber = Number(users.length);
          var profile = res.locals.user;
          res.render('admin', {profile: profile, users: users, posts: posts, userNumber: userNumber, helpsNumber: helpsNumber,
            interestingsNumber: interestingsNumber})
        })
      })
    })
  })
})


module.exports = router;
