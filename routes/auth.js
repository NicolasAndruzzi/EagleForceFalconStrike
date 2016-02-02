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
  req.session = null;
  res.redirect('/');
})

router.get('/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/' , successRedirect: '/'}))


// { provider: 'linkedin',
//   id: 'YKBYNsgTZ-',
//   displayName: 'Thomas Pasque',
//   name: { familyName: 'Pasque', givenName: 'Thomas' },
//   _raw: '{\n  "firstName": "Thomas",\n  "id": "YKBYNsgTZ-",\n  "lastName": "Pasque"\n}',
//   _json: { firstName: 'Thomas', id: 'YKBYNsgTZ-', lastName: 'Pasque' } }

module.exports = router;
