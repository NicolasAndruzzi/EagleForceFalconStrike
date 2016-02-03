var express = require('express');
var router = express.Router();
var passport = require('passport');
var knex = require('../db/knex')

function Users(){
  return knex('users');
}

router.get('/linkedin', passport.authenticate('linkedin'), function(req, res, next){
});

router.get('/logout', function (req, res, next) {
  // req.session = null;
  res.clearCookie("session")
  res.clearCookie("session.sig")
  res.render('logout')
})

router.get('/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/' , successRedirect: '/'}))


module.exports = router;
